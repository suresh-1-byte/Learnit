-- Learn-It Platform Database Schema
-- Version: 2.0
-- Database: PostgreSQL (Recommended) / MySQL Compatible
-- Last Updated: August 5, 2026

-- ============================================
-- EXTENSIONS (PostgreSQL)
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- ENUM TYPES
-- ============================================

-- User Roles
CREATE TYPE user_role AS ENUM (
    'super_admin',
    'college_admin',
    'mentor',
    'student'
);

-- User Status
CREATE TYPE user_status AS ENUM (
    'active',
    'inactive',
    'suspended'
);

-- College Status
CREATE TYPE college_status AS ENUM (
    'active',
    'inactive',
    'suspended'
);

-- Department Status
CREATE TYPE department_status AS ENUM (
    'active',
    'inactive'
);

-- Program Status
CREATE TYPE program_status AS ENUM (
    'active',
    'inactive',
    'archived'
);

-- Batch Status
CREATE TYPE batch_status AS ENUM (
    'upcoming',
    'ongoing',
    'completed',
    'cancelled'
);

-- Mentor Role in Batch
CREATE TYPE batch_mentor_role AS ENUM (
    'lead',
    'assistant'
);

-- Gender
CREATE TYPE gender AS ENUM (
    'male',
    'female',
    'other'
);

-- Enrollment Status
CREATE TYPE enrollment_status AS ENUM (
    'active',
    'completed',
    'dropped',
    'transferred'
);

-- Company Status
CREATE TYPE company_status AS ENUM (
    'active',
    'inactive'
);

-- Employment Type
CREATE TYPE employment_type AS ENUM (
    'full_time',
    'part_time',
    'contract',
    'internship'
);

-- Job Status
CREATE TYPE job_status AS ENUM (
    'active',
    'closed',
    'draft'
);

-- Certificate Status
CREATE TYPE certificate_status AS ENUM (
    'issued',
    'revoked'
);

-- Template Status
CREATE TYPE template_status AS ENUM (
    'active',
    'inactive'
);

-- Payment Method
CREATE TYPE payment_method AS ENUM (
    'cash',
    'card',
    'upi',
    'bank_transfer',
    'cheque'
);

-- Payment Status
CREATE TYPE payment_status AS ENUM (
    'pending',
    'completed',
    'failed',
    'refunded'
);

-- Invoice Status
CREATE TYPE invoice_status AS ENUM (
    'draft',
    'sent',
    'paid',
    'overdue',
    'cancelled'
);

-- Schedule Type
CREATE TYPE schedule_type AS ENUM (
    'daily',
    'weekly',
    'monthly'
);

-- Report Schedule Status
CREATE TYPE report_schedule_status AS ENUM (
    'active',
    'inactive'
);

-- Attendance Status
CREATE TYPE attendance_status AS ENUM (
    'present',
    'absent',
    'late',
    'excused'
);

-- Attendance Action Type
CREATE TYPE attendance_action AS ENUM (
    'marked',
    'edited',
    'corrected',
    'overridden'
);

-- ============================================
-- CORE TABLES
-- ============================================

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role user_role NOT NULL,
    college_id UUID REFERENCES colleges(id) ON DELETE SET NULL,
    profile_image_url VARCHAR(500),
    status user_status DEFAULT 'active',
    last_login_at TIMESTAMP,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- User Preferences Table
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notification_email BOOLEAN DEFAULT TRUE,
    notification_sms BOOLEAN DEFAULT FALSE,
    notification_push BOOLEAN DEFAULT TRUE,
    theme theme DEFAULT 'system',
    language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Colleges Table
CREATE TABLE colleges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    logo_url VARCHAR(500),
    status college_status DEFAULT 'active',
    established_date DATE,
    description TEXT,
    total_students INT DEFAULT 0,
    total_mentors INT DEFAULT 0,
    total_batches INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Departments Table
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    head_id UUID REFERENCES users(id),
    description TEXT,
    status department_status DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    UNIQUE(college_id, code)
);

-- Programs Table
CREATE TABLE programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    description TEXT,
    duration_months INT NOT NULL,
    curriculum JSONB,
    fee_structure JSONB,
    status program_status DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    UNIQUE(college_id, code)
);

-- Batches Table
CREATE TABLE batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    capacity INT NOT NULL,
    enrolled_count INT DEFAULT 0,
    status batch_status DEFAULT 'upcoming',
    schedule JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    UNIQUE(college_id, code)
);

-- Batch Mentors Table
CREATE TABLE batch_mentors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    mentor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role batch_mentor_role DEFAULT 'assistant',
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by UUID REFERENCES users(id),
    UNIQUE(batch_id, mentor_id)
);

-- Mentor Profiles Table
CREATE TABLE mentor_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    employee_id VARCHAR(50) UNIQUE,
    qualification VARCHAR(255),
    specialization VARCHAR(255),
    experience_years INT DEFAULT 0,
    bio TEXT,
    resume_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    joining_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student Profiles Table
CREATE TABLE student_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    date_of_birth DATE,
    gender gender,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    parent_name VARCHAR(255),
    parent_phone VARCHAR(20),
    emergency_contact VARCHAR(20),
    qualification VARCHAR(255),
    admission_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student Enrollments Table
CREATE TABLE student_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    enrollment_date DATE NOT NULL,
    status enrollment_status DEFAULT 'active',
    completion_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, batch_id)
);

-- Companies Table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    industry VARCHAR(255),
    website VARCHAR(255),
    logo_url VARCHAR(500),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    contact_person VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    description TEXT,
    status company_status DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Company Jobs Table
CREATE TABLE company_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    requirements TEXT,
    salary_range VARCHAR(100),
    location VARCHAR(255),
    employment_type employment_type DEFAULT 'full_time',
    status job_status DEFAULT 'draft',
    posted_date DATE,
    deadline_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Certificate Templates Table
CREATE TABLE certificate_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    template_data JSONB NOT NULL,
    status template_status DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Certificates Table
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certificate_number VARCHAR(100) UNIQUE NOT NULL,
    student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    template_id UUID NOT NULL REFERENCES certificate_templates(id),
    issue_date DATE NOT NULL,
    expiry_date DATE,
    status certificate_status DEFAULT 'issued',
    verification_code VARCHAR(100) UNIQUE,
    pdf_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    issued_by UUID REFERENCES users(id)
);

-- Payments Table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id VARCHAR(100) UNIQUE NOT NULL,
    student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method payment_method NOT NULL,
    transaction_id VARCHAR(100),
    status payment_status DEFAULT 'pending',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    recorded_by UUID REFERENCES users(id)
);

-- Invoices Table
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    status invoice_status DEFAULT 'draft',
    pdf_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Report Templates Table
CREATE TABLE report_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    query_template TEXT NOT NULL,
    parameters JSONB,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Report Schedules Table
CREATE TABLE report_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES report_templates(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    schedule_type schedule_type NOT NULL,
    recipients TEXT[],
    next_run_at TIMESTAMP,
    last_run_at TIMESTAMP,
    status report_schedule_status DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- ============================================
-- ADDITIONAL TABLES
-- ============================================

-- Attendance Records Table (RBAC Enhanced)
CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attendance_id VARCHAR(100) UNIQUE NOT NULL,
    student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    mentor_id UUID NOT NULL REFERENCES users(id), -- Mentor who owns this attendance
    batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    program_id UUID REFERENCES programs(id) ON DELETE SET NULL,
    course_id UUID,
    session_id UUID,
    attendance_date DATE NOT NULL,
    status attendance_status NOT NULL,
    check_in_time TIME,
    check_out_time TIME,
    marked_by UUID NOT NULL REFERENCES users(id), -- User who marked attendance (must be Mentor)
    created_by UUID NOT NULL REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP, -- Soft delete
    notes TEXT,
    UNIQUE(student_id, batch_id, attendance_date)
);

-- Attendance Audit Log Table (RBAC Enhanced)
CREATE TABLE attendance_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attendance_id UUID NOT NULL REFERENCES attendance_records(id) ON DELETE CASCADE,
    action_type attendance_action NOT NULL,
    previous_status attendance_status,
    new_status attendance_status NOT NULL,
    performed_by UUID NOT NULL REFERENCES users(id),
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    device_info TEXT,
    reason TEXT,
    old_values JSONB,
    new_values JSONB
);

-- Attendance Sessions Table (For QR/Session-based attendance)
CREATE TABLE attendance_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    mentor_id UUID NOT NULL REFERENCES users(id),
    session_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    qr_code VARCHAR(500),
    qr_expiry TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'closed', 'expired'
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP,
    closed_by UUID REFERENCES users(id)
);

-- Assignments Table
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    total_marks INT DEFAULT 100,
    attachment_url VARCHAR(500),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assignment Submissions Table
CREATE TABLE assignment_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    attachment_url VARCHAR(500),
    marks_obtained INT,
    feedback TEXT,
    graded_by UUID REFERENCES users(id),
    graded_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'submitted', 'graded', 'late'
    UNIQUE(assignment_id, student_id)
);

-- Study Materials Table
CREATE TABLE study_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),
    file_size BIGINT,
    uploaded_by UUID REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Videos Table
CREATE TABLE videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    duration INT, -- in seconds
    uploaded_by UUID REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Video Progress Table
CREATE TABLE video_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    progress_seconds INT DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    last_watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(video_id, student_id)
);

-- Placement Drives Table
CREATE TABLE placement_drives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    job_id UUID REFERENCES company_jobs(id),
    drive_date DATE NOT NULL,
    venue VARCHAR(255),
    description TEXT,
    status VARCHAR(20) DEFAULT 'upcoming', -- 'upcoming', 'ongoing', 'completed', 'cancelled'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- Student Applications Table
CREATE TABLE student_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES company_jobs(id) ON DELETE CASCADE,
    drive_id UUID REFERENCES placement_drives(id),
    applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'applied', -- 'applied', 'shortlisted', 'interview_scheduled', 'selected', 'rejected', 'offered'
    resume_url VARCHAR(500),
    notes TEXT,
    UNIQUE(student_id, job_id)
);

-- Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'info', 'success', 'warning', 'error'
    is_read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(500),
    is_email_sent BOOLEAN DEFAULT FALSE,
    is_sms_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP
);

-- Audit Logs Table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES
-- ============================================

-- Users Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_college_id ON users(college_id);
CREATE INDEX idx_users_status ON users(status);

-- Colleges Indexes
CREATE INDEX idx_colleges_code ON colleges(code);
CREATE INDEX idx_colleges_status ON colleges(status);
CREATE INDEX idx_colleges_city ON colleges(city);

-- Departments Indexes
CREATE INDEX idx_departments_college_id ON departments(college_id);
CREATE INDEX idx_departments_code ON departments(code);

-- Programs Indexes
CREATE INDEX idx_programs_college_id ON programs(college_id);
CREATE INDEX idx_programs_department_id ON programs(department_id);
CREATE INDEX idx_programs_status ON programs(status);

-- Batches Indexes
CREATE INDEX idx_batches_college_id ON batches(college_id);
CREATE INDEX idx_batches_program_id ON batches(program_id);
CREATE INDEX idx_batches_status ON batches(status);
CREATE INDEX idx_batches_start_date ON batches(start_date);
CREATE INDEX idx_batches_end_date ON batches(end_date);

-- Batch Mentors Indexes
CREATE INDEX idx_batch_mentors_batch_id ON batch_mentors(batch_id);
CREATE INDEX idx_batch_mentors_mentor_id ON batch_mentors(mentor_id);

-- Student Profiles Indexes
CREATE INDEX idx_student_profiles_student_id ON student_profiles(student_id);
CREATE INDEX idx_student_profiles_college_id ON student_profiles(college_id);

-- Student Enrollments Indexes
CREATE INDEX idx_student_enrollments_student_id ON student_enrollments(student_id);
CREATE INDEX idx_student_enrollments_batch_id ON student_enrollments(batch_id);
CREATE INDEX idx_student_enrollments_status ON student_enrollments(status);

-- Companies Indexes
CREATE INDEX idx_companies_code ON companies(code);
CREATE INDEX idx_companies_status ON companies(status);

-- Company Jobs Indexes
CREATE INDEX idx_company_jobs_company_id ON company_jobs(company_id);
CREATE INDEX idx_company_jobs_status ON company_jobs(status);

-- Certificates Indexes
CREATE INDEX idx_certificates_student_id ON certificates(student_id);
CREATE INDEX idx_certificates_batch_id ON certificates(batch_id);
CREATE INDEX idx_certificates_verification_code ON certificates(verification_code);

-- Payments Indexes
CREATE INDEX idx_payments_student_id ON payments(student_id);
CREATE INDEX idx_payments_college_id ON payments(college_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_payment_date ON payments(payment_date);

-- Invoices Indexes
CREATE INDEX idx_invoices_student_id ON invoices(student_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);

-- Attendance Records Indexes
CREATE INDEX idx_attendance_records_attendance_id ON attendance_records(attendance_id);
CREATE INDEX idx_attendance_records_student_id ON attendance_records(student_id);
CREATE INDEX idx_attendance_records_mentor_id ON attendance_records(mentor_id);
CREATE INDEX idx_attendance_records_batch_id ON attendance_records(batch_id);
CREATE INDEX idx_attendance_records_department_id ON attendance_records(department_id);
CREATE INDEX idx_attendance_records_program_id ON attendance_records(program_id);
CREATE INDEX idx_attendance_records_attendance_date ON attendance_records(attendance_date);
CREATE INDEX idx_attendance_records_status ON attendance_records(status);
CREATE INDEX idx_attendance_records_marked_by ON attendance_records(marked_by);
CREATE INDEX idx_attendance_records_deleted_at ON attendance_records(deleted_at);

-- Attendance Audit Log Indexes
CREATE INDEX idx_attendance_audit_log_attendance_id ON attendance_audit_log(attendance_id);
CREATE INDEX idx_attendance_audit_log_action_type ON attendance_audit_log(action_type);
CREATE INDEX idx_attendance_audit_log_performed_by ON attendance_audit_log(performed_by);
CREATE INDEX idx_attendance_audit_log_performed_at ON attendance_audit_log(performed_at);

-- Attendance Sessions Indexes
CREATE INDEX idx_attendance_sessions_batch_id ON attendance_sessions(batch_id);
CREATE INDEX idx_attendance_sessions_mentor_id ON attendance_sessions(mentor_id);
CREATE INDEX idx_attendance_sessions_session_date ON attendance_sessions(session_date);
CREATE INDEX idx_attendance_sessions_status ON attendance_sessions(status);

-- Assignments Indexes
CREATE INDEX idx_assignments_batch_id ON assignments(batch_id);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);

-- Assignment Submissions Indexes
CREATE INDEX idx_assignment_submissions_assignment_id ON assignment_submissions(assignment_id);
CREATE INDEX idx_assignment_submissions_student_id ON assignment_submissions(student_id);

-- Study Materials Indexes
CREATE INDEX idx_study_materials_batch_id ON study_materials(batch_id);

-- Videos Indexes
CREATE INDEX idx_videos_batch_id ON videos(batch_id);

-- Video Progress Indexes
CREATE INDEX idx_video_progress_video_id ON video_progress(video_id);
CREATE INDEX idx_video_progress_student_id ON video_progress(student_id);

-- Placement Drives Indexes
CREATE INDEX idx_placement_drives_company_id ON placement_drives(company_id);
CREATE INDEX idx_placement_drives_college_id ON placement_drives(college_id);
CREATE INDEX idx_placement_drives_drive_date ON placement_drives(drive_date);

-- Student Applications Indexes
CREATE INDEX idx_student_applications_student_id ON student_applications(student_id);
CREATE INDEX idx_student_applications_job_id ON student_applications(job_id);
CREATE INDEX idx_student_applications_status ON student_applications(status);

-- Notifications Indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Audit Logs Indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_entity_id ON audit_logs(entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- ============================================
-- VIEWS
-- ============================================

-- College Statistics View
CREATE VIEW college_statistics AS
SELECT 
    c.id,
    c.name,
    c.code,
    COUNT(DISTINCT d.id) as department_count,
    COUNT(DISTINCT p.id) as program_count,
    COUNT(DISTINCT b.id) as batch_count,
    COUNT(DISTINCT sp.id) as student_count,
    COUNT(DISTINCT mp.id) as mentor_count,
    COALESCE(SUM(pay.amount), 0) as total_revenue
FROM colleges c
LEFT JOIN departments d ON c.id = d.college_id AND d.status = 'active'
LEFT JOIN programs p ON c.id = p.college_id AND p.status = 'active'
LEFT JOIN batches b ON c.id = b.college_id
LEFT JOIN student_profiles sp ON c.id = sp.college_id
LEFT JOIN users u ON sp.user_id = u.id AND u.status = 'active'
LEFT JOIN mentor_profiles mp ON c.id = (SELECT college_id FROM users WHERE id = mp.user_id)
LEFT JOIN payments pay ON c.id = pay.college_id AND pay.status = 'completed'
WHERE c.status = 'active'
GROUP BY c.id, c.name, c.code;

-- Batch Details View
CREATE VIEW batch_details AS
SELECT 
    b.id,
    b.name,
    b.code,
    b.start_date,
    b.end_date,
    b.capacity,
    b.enrolled_count,
    b.status,
    c.name as college_name,
    p.name as program_name,
    d.name as department_name,
    COUNT(DISTINCT bm.mentor_id) as mentor_count,
    COUNT(DISTINCT se.student_id) as enrolled_student_count
FROM batches b
JOIN colleges c ON b.college_id = c.id
JOIN programs p ON b.program_id = p.id
JOIN departments d ON p.department_id = d.id
LEFT JOIN batch_mentors bm ON b.id = bm.batch_id
LEFT JOIN student_enrollments se ON b.id = se.batch_id AND se.status = 'active'
GROUP BY b.id, b.name, b.code, b.start_date, b.end_date, b.capacity, b.enrolled_count, b.status, c.name, p.name, d.name;

-- Student Progress View
CREATE VIEW student_progress AS
SELECT 
    sp.id as student_profile_id,
    sp.student_id,
    u.first_name,
    u.last_name,
    u.email,
    c.name as college_name,
    b.name as batch_name,
    p.name as program_name,
    se.enrollment_date,
    se.status as enrollment_status,
    COUNT(DISTINCT ar.id) FILTER (WHERE ar.status = 'present') as attendance_present,
    COUNT(DISTINCT ar.id) FILTER (WHERE ar.status = 'absent') as attendance_absent,
    ROUND(
        (COUNT(DISTINCT ar.id) FILTER (WHERE ar.status = 'present')::FLOAT / 
         NULLIF(COUNT(DISTINCT ar.id), 0)) * 100, 2
    ) as attendance_percentage,
    COUNT(DISTINCT asub.id) FILTER (WHERE asub.status = 'graded') as assignments_graded,
    COUNT(DISTINCT asub.id) FILTER (WHERE asub.status = 'pending') as assignments_pending,
    ROUND(AVG(asub.marks_obtained), 2) as average_marks
FROM student_profiles sp
JOIN users u ON sp.user_id = u.id
JOIN colleges c ON sp.college_id = c.id
JOIN student_enrollments se ON sp.id = se.student_id
JOIN batches b ON se.batch_id = b.id
JOIN programs p ON b.program_id = p.id
LEFT JOIN attendance_records ar ON sp.id = ar.student_id AND ar.batch_id = b.id
LEFT JOIN assignment_submissions asub ON sp.id = asub.student_id
LEFT JOIN assignments a ON asub.assignment_id = a.id AND a.batch_id = b.id
GROUP BY sp.id, sp.student_id, u.first_name, u.last_name, u.email, c.name, b.name, p.name, se.enrollment_date, se.status;

-- ============================================
-- TRIGGERS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_colleges_updated_at BEFORE UPDATE ON colleges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON programs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_batches_updated_at BEFORE UPDATE ON batches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mentor_profiles_updated_at BEFORE UPDATE ON mentor_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_profiles_updated_at BEFORE UPDATE ON student_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_enrollments_updated_at BEFORE UPDATE ON student_enrollments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_jobs_updated_at BEFORE UPDATE ON company_jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_certificate_templates_updated_at BEFORE UPDATE ON certificate_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_certificates_updated_at BEFORE UPDATE ON certificates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_report_templates_updated_at BEFORE UPDATE ON report_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Attendance Records RBAC Trigger
CREATE OR REPLACE FUNCTION enforce_attendance_rbac()
RETURNS TRIGGER AS $$
BEGIN
    -- Only Mentors can create/update attendance records
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        IF NOT EXISTS (
            SELECT 1 FROM users WHERE id = NEW.marked_by AND role = 'mentor'
        ) THEN
            RAISE EXCEPTION 'Only Mentors can mark or edit attendance';
        END IF;
        
        -- Ensure mentor_id matches the batch's assigned mentor
        IF NOT EXISTS (
            SELECT 1 FROM batch_mentors bm 
            JOIN batches b ON bm.batch_id = b.id
            WHERE b.id = NEW.batch_id 
            AND bm.mentor_id = NEW.mentor_id
        ) THEN
            RAISE EXCEPTION 'Mentor must be assigned to this batch';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_enforce_attendance_rbac
    BEFORE INSERT OR UPDATE ON attendance_records
    FOR EACH ROW EXECUTE FUNCTION enforce_attendance_rbac();

-- Attendance Audit Log Trigger
CREATE OR REPLACE FUNCTION log_attendance_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Log all attendance changes to audit trail
    INSERT INTO attendance_audit_log (
        attendance_id,
        action_type,
        previous_status,
        new_status,
        performed_by,
        ip_address,
        device_info,
        reason,
        old_values,
        new_values
    ) VALUES (
        NEW.id,
        CASE TG_OP
            WHEN 'INSERT' THEN 'marked'
            WHEN 'UPDATE' THEN 'edited'
            ELSE 'corrected'
        END,
        OLD.status,
        NEW.status,
        NEW.marked_by,
        inet_client_addr(),
        current_setting('application_name', 'unknown'),
        NEW.notes,
        row_to_json(OLD),
        row_to_json(NEW)
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_attendance_changes
    AFTER INSERT OR UPDATE ON attendance_records
    FOR EACH ROW EXECUTE FUNCTION log_attendance_changes();

-- Update college statistics
CREATE OR REPLACE FUNCTION update_college_statistics()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'student_profiles' THEN
        IF TG_OP = 'INSERT' THEN
            UPDATE colleges SET total_students = total_students + 1 WHERE id = NEW.college_id;
        ELSIF TG_OP = 'DELETE' THEN
            UPDATE colleges SET total_students = total_students - 1 WHERE id = OLD.college_id;
        END IF;
    ELSIF TG_TABLE_NAME = 'mentor_profiles' THEN
        IF TG_OP = 'INSERT' THEN
            UPDATE colleges SET total_mentors = total_mentors + 1 
            WHERE id = (SELECT college_id FROM users WHERE id = NEW.user_id);
        ELSIF TG_OP = 'DELETE' THEN
            UPDATE colleges SET total_mentors = total_mentors - 1 
            WHERE id = (SELECT college_id FROM users WHERE id = OLD.user_id);
        END IF;
    ELSIF TG_TABLE_NAME = 'batches' THEN
        IF TG_OP = 'INSERT' THEN
            UPDATE colleges SET total_batches = total_batches + 1 WHERE id = NEW.college_id;
        ELSIF TG_OP = 'DELETE' THEN
            UPDATE colleges SET total_batches = total_batches - 1 WHERE id = OLD.college_id;
        END IF;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_college_statistics_student_profiles
    AFTER INSERT OR DELETE ON student_profiles
    FOR EACH ROW EXECUTE FUNCTION update_college_statistics();

CREATE TRIGGER trigger_update_college_statistics_mentor_profiles
    AFTER INSERT OR DELETE ON mentor_profiles
    FOR EACH ROW EXECUTE FUNCTION update_college_statistics();

CREATE TRIGGER trigger_update_college_statistics_batches
    AFTER INSERT OR DELETE ON batches
    FOR EACH ROW EXECUTE FUNCTION update_college_statistics();

-- Update batch enrolled count
CREATE OR REPLACE FUNCTION update_batch_enrolled_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'active' THEN
        UPDATE batches SET enrolled_count = enrolled_count + 1 WHERE id = NEW.batch_id;
    ELSIF TG_OP = 'DELETE' AND OLD.status = 'active' THEN
        UPDATE batches SET enrolled_count = enrolled_count - 1 WHERE id = OLD.batch_id;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status != 'active' AND NEW.status = 'active' THEN
            UPDATE batches SET enrolled_count = enrolled_count + 1 WHERE id = NEW.batch_id;
        ELSIF OLD.status = 'active' AND NEW.status != 'active' THEN
            UPDATE batches SET enrolled_count = enrolled_count - 1 WHERE id = NEW.batch_id;
        END IF;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_batch_enrolled_count
    AFTER INSERT OR UPDATE OR DELETE ON student_enrollments
    FOR EACH ROW EXECUTE FUNCTION update_batch_enrolled_count();

-- ============================================
-- FUNCTIONS
-- ============================================

-- Generate certificate number
CREATE OR REPLACE FUNCTION generate_certificate_number()
RETURNS VARCHAR AS $$
DECLARE
    cert_num VARCHAR;
BEGIN
    SELECT 'CERT-' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYY') || '-' || LPAD(NEXTVAL('certificate_seq')::TEXT, 6, '0') INTO cert_num;
    RETURN cert_num;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE certificate_seq START 1;

-- Generate payment ID
CREATE OR REPLACE FUNCTION generate_payment_id()
RETURNS VARCHAR AS $$
DECLARE
    payment_id VARCHAR;
BEGIN
    SELECT 'PAY-' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDD') || '-' || LPAD(NEXTVAL('payment_seq')::TEXT, 6, '0') INTO payment_id;
    RETURN payment_id;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE payment_seq START 1;

-- Generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS VARCHAR AS $$
DECLARE
    invoice_num VARCHAR;
BEGIN
    SELECT 'INV-' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMM') || '-' || LPAD(NEXTVAL('invoice_seq')::TEXT, 6, '0') INTO invoice_num;
    RETURN invoice_num;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE invoice_seq START 1;

-- Generate verification code
CREATE OR REPLACE FUNCTION generate_verification_code()
RETURNS VARCHAR AS $$
BEGIN
    RETURN encode(gen_random_bytes(16), 'hex');
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SEED DATA (Optional - for development)
-- ============================================

-- Insert default Super Admin (password: Admin@123)
-- In production, use proper password hashing and secure methods
-- INSERT INTO users (email, password_hash, first_name, last_name, role, status)
-- VALUES ('admin@learnit.com', '$2b$10$...', 'Super', 'Admin', 'super_admin', 'active');

-- ============================================
-- END OF SCHEMA
-- ============================================
