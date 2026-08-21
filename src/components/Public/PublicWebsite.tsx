import React, { useState, useEffect } from 'react';
import { UserRole } from '../../types';
import { AuthModal } from '../Auth/AuthModal';
import { AnimatedBackground, GradientMesh } from '../Shared/AnimatedBackground';
import { MagneticButton } from '../Shared/MagneticButton';
import { SectionDivider, AnimatedGradientDivider } from '../Shared/SectionDivider';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { useTheme } from '../../contexts/ThemeContext';
import { PlacementService } from '../../services/placementService';
import { PlacementDrive, PlacementStatistics } from '../../types';
import {
  GraduationCap,
  Sparkles,
  Building2,
  Users,
  Briefcase,
  Award,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Search,
  Star,
  ShieldCheck,
  Globe,
  TrendingUp,
  MapPin,
  Calendar,
  Clock,
  Phone,
  Mail,
  Send,
  X,
  Play,
  Check,
  FileText,
  ExternalLink,
  Laptop,
  MessageSquare,
  HelpCircle,
  Menu,
  Monitor,
  Smartphone,
  Tablet,
  Building,
  CheckCircle,
  Download,
  Share2,
  Filter,
  Code,
  BarChart3,
  PieChart,
  ArrowUpRight,
  UserCheck,
  HeartHandshake,
  Lock,
  Compass,
  Target,
  Sparkle,
  Layers,
  Zap,
  Cloud,
  Bell,
  User,
  Home,
  ClipboardCheck,
  Sun,
  Moon
} from 'lucide-react';

interface PublicWebsiteProps {
  onAccessErp: (role?: UserRole) => void;
  onClose?: () => void;
}

interface Program {
  id: string;
  category: 'AI & Data' | 'Cloud & DevOps' | 'Frontend' | 'Backend';
  title: string;
  level: 'Beginner to Advanced' | 'Intermediate' | 'Advanced Track';
  description: string;
  duration: string;
  mode: string;
  eligibility: string;
  avgPackage: string;
  outcomes: string[];
  phases: { 
    name: string; 
    topics: string[]; 
    tools: string[]; 
    phaseProject: string;
  }[];
  capstone: string;
  icon: React.ReactNode;
}

interface Article {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  summary: string;
  content: string;
}

const programsList: Program[] = [
  {
    id: 'prog-1',
    category: 'AI & Data',
    title: 'AI & Machine Learning',
    level: 'Beginner to Advanced',
    description: 'Master artificial intelligence and machine learning from foundations to deployment. Build intelligent systems using Python, deep learning frameworks, and generative AI technologies.',
    duration: '6 Months',
    mode: 'Hybrid (Campus + Live LMS)',
    eligibility: 'B.Tech / B.E. / MCA (3rd & 4th Year)',
    avgPackage: '4.0 - 6.5 LPA',
    icon: <Sparkles className="w-5 h-5 text-[#A855F7]" />,
    outcomes: [
      'Build ML models with Python and Scikit-learn',
      'Develop deep learning applications with PyTorch',
      'Deploy GenAI solutions with LLMs and RAG architecture',
      'Create end-to-end AI pipelines from data to production'
    ],
    phases: [
      {
        name: 'Phase 1: Foundations & Data Science',
        topics: ['Python Programming', 'NumPy & Pandas', 'Data Visualization', 'SQL for Analytics', 'Statistics & Probability', 'Exploratory Data Analysis'],
        tools: ['Python', 'Jupyter', 'NumPy', 'Pandas', 'Matplotlib', 'Seaborn', 'SQL'],
        phaseProject: 'Sales Data Analysis Dashboard with predictive insights'
      },
      {
        name: 'Phase 2: Machine Learning & Deep Learning',
        topics: ['Supervised Learning', 'Classification & Regression', 'Model Evaluation', 'Neural Networks', 'CNNs for Computer Vision', 'RNNs & LSTMs', 'Transfer Learning'],
        tools: ['Scikit-learn', 'PyTorch', 'TensorFlow', 'Keras', 'OpenCV'],
        phaseProject: 'Image Classification System using CNNs'
      },
      {
        name: 'Phase 3: GenAI & Deployment',
        topics: ['Large Language Models', 'Prompt Engineering', 'RAG Architecture', 'Vector Databases', 'Model Deployment', 'MLOps Basics', 'API Integration'],
        tools: ['OpenAI API', 'LangChain', 'Pinecone', 'Hugging Face', 'FastAPI', 'Docker'],
        phaseProject: 'Intelligent Chatbot with RAG implementation'
      }
    ],
    capstone: 'End-to-End AI Solution: Build a complete AI application combining ML models, deep learning, and GenAI features with deployment pipeline'
  },
  {
    id: 'prog-2',
    category: 'Cloud & DevOps',
    title: 'DevOps & Cloud Engineering',
    level: 'Intermediate',
    description: 'Transform into a DevOps engineer with expertise in Linux, cloud infrastructure, containerization, and CI/CD automation. Master modern deployment practices and cloud-native technologies.',
    duration: '5 Months',
    mode: 'Live Interactive Sessions',
    eligibility: 'B.Tech / B.E. / MCA (3rd & 4th Year)',
    avgPackage: '3.5 - 6.0 LPA',
    icon: <ShieldCheck className="w-5 h-5 text-[#10B981]" />,
    outcomes: [
      'Master Linux system administration and networking',
      'Deploy applications using Docker and Kubernetes',
      'Build automated CI/CD pipelines',
      'Manage cloud infrastructure on AWS/Azure'
    ],
    phases: [
      {
        name: 'Phase 1: Linux & Networking Fundamentals',
        topics: ['Linux Commands & Shell Scripting', 'File Systems & Permissions', 'Process Management', 'Network Protocols', 'DNS & Load Balancing', 'Security Basics'],
        tools: ['Linux', 'Bash', 'SSH', 'Vim', 'Git', 'Network Tools'],
        phaseProject: 'Automated Server Setup & Monitoring Script'
      },
      {
        name: 'Phase 2: Containers & Orchestration',
        topics: ['Docker Fundamentals', 'Container Images & Registry', 'Docker Compose', 'Kubernetes Architecture', 'Pods & Deployments', 'Services & Ingress', 'ConfigMaps & Secrets'],
        tools: ['Docker', 'Docker Hub', 'Kubernetes', 'Helm', 'kubectl'],
        phaseProject: 'Microservices Deployment on Kubernetes Cluster'
      },
      {
        name: 'Phase 3: CI/CD & Cloud Infrastructure',
        topics: ['Jenkins Pipeline', 'GitHub Actions', 'AWS EC2 & S3', 'VPC & IAM', 'Terraform Basics', 'Infrastructure as Code', 'Monitoring & Logging'],
        tools: ['Jenkins', 'GitHub Actions', 'AWS', 'Terraform', 'Ansible', 'Prometheus', 'Grafana'],
        phaseProject: 'Automated Deployment Pipeline with Infrastructure as Code'
      }
    ],
    capstone: 'Complete DevOps Pipeline: Build a full CI/CD pipeline deploying containerized microservices to cloud with automated testing, monitoring, and scaling'
  },
  {
    id: 'prog-3',
    category: 'Frontend',
    title: 'Frontend Development — Design & Dev',
    level: 'Beginner to Advanced',
    description: 'Become a complete frontend developer mastering web fundamentals, modern React development, and professional UI/UX design. Build responsive, accessible, and performant web applications.',
    duration: '5 Months',
    mode: 'Hybrid (Campus + Live LMS)',
    eligibility: 'All Engineering Students',
    avgPackage: '3.0 - 5.5 LPA',
    icon: <Laptop className="w-5 h-5 text-[#F59E0B]" />,
    outcomes: [
      'Build responsive websites with HTML, CSS, and JavaScript',
      'Develop modern React applications with hooks and state management',
      'Design beautiful UI/UX with Figma and design systems',
      'Create full-stack features with API integration'
    ],
    phases: [
      {
        name: 'Phase 1: Web & Design Foundations',
        topics: ['HTML5 Semantic Markup', 'CSS3 & Flexbox/Grid', 'Responsive Design', 'JavaScript ES6+', 'DOM Manipulation', 'Figma Basics', 'Design Principles'],
        tools: ['HTML', 'CSS', 'JavaScript', 'Figma', 'Chrome DevTools', 'Git'],
        phaseProject: 'Responsive Portfolio Website with interactive UI'
      },
      {
        name: 'Phase 2: React & Component Architecture',
        topics: ['React Components', 'JSX & Props', 'State & Hooks', 'React Router', 'Context API', 'Custom Hooks', 'Component Libraries', 'Tailwind CSS'],
        tools: ['React', 'Vite', 'React Router', 'Tailwind CSS', 'Lucide Icons', 'npm'],
        phaseProject: 'Task Management App with React and API integration'
      },
      {
        name: 'Phase 3: Full-Stack Integration & Testing',
        topics: ['REST API Integration', 'Authentication Flow', 'Firebase Integration', 'State Management', 'Form Validation', 'Performance Optimization', 'Testing Basics', 'Deployment'],
        tools: ['Firebase', 'Axios', 'React Query', 'Vercel', 'Netlify', 'ESLint'],
        phaseProject: 'E-commerce Frontend with Firebase backend'
      }
    ],
    capstone: 'Production-Ready Web Application: Build a complete full-stack web app with authentication, real-time features, responsive design, and cloud deployment'
  },
  {
    id: 'prog-4',
    category: 'Backend',
    title: 'Backend Development — Python',
    level: 'Beginner to Advanced',
    description: 'Master backend development with Python, from core programming to building scalable APIs and deploying production systems. Learn database design, REST APIs, and cloud deployment.',
    duration: '5 Months',
    mode: 'Live Interactive Sessions',
    eligibility: 'B.Tech / B.E. / MCA (3rd & 4th Year)',
    avgPackage: '3.5 - 6.0 LPA',
    icon: <Code className="w-5 h-5 text-[#6366F1]" />,
    outcomes: [
      'Write clean Python code with OOP principles',
      'Build RESTful APIs with Django and FastAPI',
      'Design and optimize database schemas',
      'Deploy scalable backend systems to production'
    ],
    phases: [
      {
        name: 'Phase 1: Python & Object-Oriented Programming',
        topics: ['Python Fundamentals', 'Data Structures', 'Functions & Modules', 'OOP Concepts', 'Classes & Objects', 'Inheritance & Polymorphism', 'File Handling', 'Exception Handling'],
        tools: ['Python', 'PyCharm', 'Jupyter', 'Git', 'Virtual Environments'],
        phaseProject: 'Library Management System with OOP design'
      },
      {
        name: 'Phase 2: Web Frameworks & APIs',
        topics: ['Django Framework', 'Models & ORM', 'REST API Design', 'Authentication & Authorization', 'FastAPI Basics', 'API Documentation', 'Postman Testing'],
        tools: ['Django', 'Django REST Framework', 'FastAPI', 'PostgreSQL', 'Postman', 'Swagger'],
        phaseProject: 'RESTful Blog API with user authentication'
      },
      {
        name: 'Phase 3: Databases, Scale & Deployment',
        topics: ['Database Design', 'SQL Optimization', 'Redis Caching', 'Async Programming', 'Background Tasks', 'Docker Deployment', 'AWS Basics', 'Performance Tuning'],
        tools: ['PostgreSQL', 'MongoDB', 'Redis', 'Celery', 'Docker', 'AWS', 'Gunicorn', 'Nginx'],
        phaseProject: 'Scalable API Service with caching and async tasks'
      }
    ],
    capstone: 'Enterprise Backend System: Build a complete backend application with multiple microservices, database optimization, caching, and production deployment on cloud'
  }
];

// Mock partnership data removed - partner colleges will only be shown when approved by Super Admin
// No fake/mock data should be displayed on the Public Website

const articlesList: Article[] = [
  {
    id: 'art-1',
    title: "Our Vision: Building India's Next-Generation Academic Ecosystem",
    category: 'Future Roadmap',
    readTime: '5 min read',
    date: 'Aug 2, 2026',
    author: 'Shiva (Chief Executive Officer)',
    summary: "Exploring LearnIT's ambitious plans to transform how colleges deliver industry-aligned education across India.",
    content: 'LearnIT is building a comprehensive platform that will connect engineering colleges with real industry mentors and modern curriculum. We plan to introduce AI-powered learning analytics, blockchain-verified certifications, and seamless placement integrations. Our upcoming features will include adaptive learning paths, real-time skill gap analysis, and direct recruitment pipelines with leading technology companies.'
  },
  {
    id: 'art-2',
    title: 'What\'s Coming: Smart Campus Management & Advanced Analytics',
    category: 'Platform Development',
    readTime: '4 min read',
    date: 'Jul 28, 2026',
    author: 'Mohan Ram (Chief Technology Officer)',
    summary: "A look into LearnIT's future technical capabilities including intelligent attendance systems and predictive student success models.",
    content: 'We are developing advanced QR-based attendance with geofencing capabilities to streamline campus operations. Future releases will include AI-driven student performance prediction, automated assignment grading, and comprehensive learning management tools. Our technical roadmap includes building scalable cloud infrastructure to support thousands of colleges simultaneously with real-time data synchronization.'
  },
  {
    id: 'art-3',
    title: "Shaping Tomorrow: LearnIT's Placement Ecosystem Vision",
    category: 'Future Initiatives',
    readTime: '6 min read',
    date: 'Jul 15, 2026',
    author: 'Vijay (Head of Placement Operations)',
    summary: 'How LearnIT plans to revolutionize campus placements by connecting students directly with top tech companies.',
    content: 'We envision a future where every college using LearnIT gains direct access to corporate recruitment drives. Our planned placement portal will enable students to showcase verified skills through blockchain certificates, participate in company-specific hiring challenges, and access personalized interview preparation. We\'re working to build partnerships with leading tech firms to create a seamless campus-to-career pipeline for engineering graduates across India.'
  }
];

const faqList = [
  {
    category: 'Institutional ERP',
    q: "How does LearnIT partner with engineering institutions?",
    a: "We integrate directly into college academic calendars, deploying certified industry mentors, providing digital LMS access, conducting daily attendance, and hosting campus recruitment drives."
  },
  {
    category: 'Certifications',
    q: "Are the certificates verified and recognized by IT recruiters?",
    a: "Yes. Every LearnIT certificate includes a tamper-evident QR code and a unique cryptographic verification URL, enabling HR teams to instantly verify student transcript authenticity."
  },
  {
    category: 'Placements',
    q: "What is the placement support mechanism?",
    a: "Students who achieve 90%+ attendance and complete required capstone projects will gain access to corporate recruitment drives hosted on our platform."
  },
  {
    category: 'Institutional ERP',
    q: "Can college administrators monitor student attendance and progress?",
    a: "Absolutely. College Admins receive real-time dashboard analytics tracking daily student attendance, assignment scores, mentor ratings, and fee compliance."
  },
  {
    category: 'General',
    q: "How long does it take to onboard a new campus?",
    a: "Onboarding a partner college takes under 48 hours. Our team configures student accounts, department branches, mentor allocations, and batch schedules seamlessly."
  }
];

export const PublicWebsite: React.FC<PublicWebsiteProps> = ({ onAccessErp, onClose }) => {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'programs' | 'placements' | 'colleges' | 'resources' | 'faq' | 'contact'>('home');
  const [programCategory, setProgramCategory] = useState<string>('All');
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showDemoModal, setShowDemoModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [selectedJourneyStep, setSelectedJourneyStep] = useState<number | null>(null);
  const [selectedAboutCard, setSelectedAboutCard] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [devicePreviewMode, setDevicePreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [faqCategory, setFaqCategory] = useState<string>('All');
  const [faqSearch, setFaqSearch] = useState<string>('');

  // Demo Form State
  const [demoForm, setDemoForm] = useState({
    collegeName: '',
    contactPerson: '',
    phone: '',
    email: '',
    studentCount: '100-300',
    message: ''
  });
  const [demoSubmitted, setDemoSubmitted] = useState<boolean>(false);

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: 'Institutional Inquiry',
    message: ''
  });
  const [contactSubmitted, setContactSubmitted] = useState<boolean>(false);

  // Placement Drives State
  const [placementDrives, setPlacementDrives] = useState<PlacementDrive[]>([]);

  // Fetch placement drives on component mount
  useEffect(() => {
    const allDrives = PlacementService.getAllPlacementDrives();
    setPlacementDrives(allDrives);
  }, []);

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoSubmitted(true);
    setTimeout(() => {
      setDemoSubmitted(false);
      setShowDemoModal(false);
      setDemoForm({ collegeName: '', contactPerson: '', phone: '', email: '', studentCount: '500-1000', message: '' });
    }, 2000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: '', email: '', subject: 'Institutional Inquiry', message: '' });
    }, 2500);
  };

  const filteredPrograms = programCategory === 'All' 
    ? programsList 
    : programsList.filter(p => p.category === programCategory);

  const filteredFaqs = faqList.filter(f => {
    const matchesCat = faqCategory === 'All' || f.category === faqCategory;
    const matchesSearch = f.q.toLowerCase().includes(faqSearch.toLowerCase()) || f.a.toLowerCase().includes(faqSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className={`min-h-screen font-sans selection:bg-[#6366F1] selection:text-white relative transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#050505] text-white' : 'bg-[#F8FAFC] text-gray-900'
    }`}>
      
      {/* Custom CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes device-in {
          0% { opacity: 0; transform: scale(0.95) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes bar-grow {
          0% { height: 0%; }
          100% { height: var(--target-height); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.3); }
          50% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.6); }
        }
        @keyframes count-up {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }
        .animate-device-in {
          animation: device-in 0.5s ease-out forwards;
        }
        .animate-bar {
          animation: bar-grow 1s ease-out forwards;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .animate-count {
          animation: count-up 0.5s ease-out forwards;
        }
      `}</style>
      
      {/* Animated Background */}
      <AnimatedBackground theme={theme} />

      {/* GLOBAL HEADER (80px height, Sticky, Spatial Glass Surface) */}
      <header className={`sticky top-0 z-50 h-[80px] border-b px-4 sm:px-8 flex items-center justify-between transition-all duration-250 ${
        theme === 'dark' 
          ? 'bg-[#0A0A0A] border-[rgba(255,255,255,0.08)] shadow-sm' 
          : 'bg-white border-[rgba(0,0,0,0.06)] shadow-sm'
      }`}>
        {/* Left: Logo */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('home')}>
          <div className={`w-14 h-14 rounded-none flex items-center justify-center shadow-lg shadow-[#6366F1]/25 group-hover:scale-105 transition-transform overflow-hidden ${
            theme === 'dark' ? 'bg-white' : 'bg-white'
          }`}>
            <img src="/logo.png" alt="LearnIT Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-extrabold text-xl tracking-tight block leading-none ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>LearnIT</span>
              <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full border ${
                theme === 'dark' 
                  ? 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20' 
                  : 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20'
              }`}>
                Enterprise
              </span>
            </div>
            <span className={`text-[10px] font-semibold tracking-widest uppercase block mt-0.5 ${
              theme === 'dark' ? 'text-[#A855F7]' : 'text-[#6366F1]'
            }`}>Academic & Placement SaaS</span>
          </div>
        </div>

        {/* Center: Navigation Links */}
        <nav className={`hidden xl:flex items-center gap-7 text-xs font-semibold ${
          theme === 'dark' ? 'text-[#888]' : 'text-[#64748B]'
        }`}>
          <button onClick={() => setActiveTab('home')} className={`transition-all duration-250 py-1.5 px-2 rounded-lg hover:-translate-y-0.5 ${
            activeTab === 'home' 
              ? theme === 'dark' 
                ? 'text-white font-bold bg-white/5 border border-white/10 shadow-sm' 
                : 'text-gray-900 font-bold bg-gray-100 border border-gray-200 shadow-sm'
              : theme === 'dark' 
                ? 'hover:text-white hover:bg-white/5 hover:border-white/10' 
                : 'hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300'
          }`}>Home</button>
          <button onClick={() => setActiveTab('about')} className={`transition-all duration-250 py-1.5 px-2 rounded-lg hover:-translate-y-0.5 ${
            activeTab === 'about' 
              ? theme === 'dark' 
                ? 'text-white font-bold bg-white/5 border border-white/10 shadow-sm' 
                : 'text-gray-900 font-bold bg-gray-100 border border-gray-200 shadow-sm'
              : theme === 'dark' 
                ? 'hover:text-white hover:bg-white/5 hover:border-white/10' 
                : 'hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300'
          }`}>About</button>
          <button onClick={() => setActiveTab('placements')} className={`transition-all duration-250 py-1.5 px-2 rounded-lg hover:-translate-y-0.5 ${
            activeTab === 'placements' 
              ? theme === 'dark' 
                ? 'text-white font-bold bg-white/5 border border-white/10 shadow-sm' 
                : 'text-gray-900 font-bold bg-gray-100 border border-gray-200 shadow-sm'
              : theme === 'dark' 
                ? 'hover:text-white hover:bg-white/5 hover:border-white/10' 
                : 'hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300'
          }`}>Partners</button>
          <button onClick={() => setActiveTab('programs')} className={`transition-all duration-250 py-1.5 px-2 rounded-lg hover:-translate-y-0.5 ${
            activeTab === 'programs' 
              ? theme === 'dark' 
                ? 'text-white font-bold bg-white/5 border border-white/10 shadow-sm' 
                : 'text-gray-900 font-bold bg-gray-100 border border-gray-200 shadow-sm'
              : theme === 'dark' 
                ? 'hover:text-white hover:bg-white/5 hover:border-white/10' 
                : 'hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300'
          }`}>Programs</button>
          <button onClick={() => setActiveTab('colleges')} className={`transition-all duration-250 py-1.5 px-2 rounded-lg hover:-translate-y-0.5 ${
            activeTab === 'colleges' 
              ? theme === 'dark' 
                ? 'text-white font-bold bg-white/5 border border-white/10 shadow-sm' 
                : 'text-gray-900 font-bold bg-gray-100 border border-gray-200 shadow-sm'
              : theme === 'dark' 
                ? 'hover:text-white hover:bg-white/5 hover:border-white/10' 
                : 'hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300'
          }`}>Partner Colleges</button>
          <button onClick={() => setActiveTab('resources')} className={`transition-all duration-250 py-1.5 px-2 rounded-lg hover:-translate-y-0.5 ${
            activeTab === 'resources' 
              ? theme === 'dark' 
                ? 'text-white font-bold bg-white/5 border border-white/10 shadow-sm' 
                : 'text-gray-900 font-bold bg-gray-100 border border-gray-200 shadow-sm'
              : theme === 'dark' 
                ? 'hover:text-white hover:bg-white/5 hover:border-white/10' 
                : 'hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300'
          }`}>Resources & Blog</button>
          <button onClick={() => setActiveTab('contact')} className={`transition-all duration-250 py-1.5 px-2 rounded-lg hover:-translate-y-0.5 ${
            activeTab === 'contact' 
              ? theme === 'dark' 
                ? 'text-white font-bold bg-white/5 border border-white/10 shadow-sm' 
                : 'text-gray-900 font-bold bg-gray-100 border border-gray-200 shadow-sm'
              : theme === 'dark' 
                ? 'hover:text-white hover:bg-white/5 hover:border-white/10' 
                : 'hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300'
          }`}>Contact</button>
        </nav>

        {/* Right Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg border transition-all duration-250 hover:-translate-y-0.5 ${
              theme === 'dark'
                ? 'bg-[#111] border-white/10 text-white hover:bg-[#1A1A1A] hover:border-[#6366F1]/50 hover:shadow-sm'
                : 'bg-gray-100 border-gray-300 text-gray-900 hover:bg-gray-200 hover:border-gray-400 hover:shadow-sm'
            }`}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setShowAuthModal(true)}
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.06)' : '#111827',
              color: '#ffffff',
              border: theme === 'dark' ? '1px solid rgba(255,255,255,0.12)' : '1px solid #111827',
              opacity: 1,
              height: '42px',
              minWidth: '82px',
              padding: '0 18px',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '14px'
            }}
            className="transition-all duration-250 hover:-translate-y-0.5 shadow-sm hover:shadow-md active:scale-98"
            onMouseEnter={(e) => {
              if (theme === 'light') {
                e.currentTarget.style.backgroundColor = '#1F2937';
              }
            }}
            onMouseLeave={(e) => {
              if (theme === 'light') {
                e.currentTarget.style.backgroundColor = '#111827';
              }
            }}
          >
            Login
          </button>
          <button
            onClick={() => setShowDemoModal(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-[#6366F1] to-[#A855F7] hover:from-[#5558DD] hover:to-[#9333EA] text-white rounded-xl text-xs font-bold transition-all duration-250 shadow-lg shadow-[#6366F1]/20 hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-1.5"
          >
            Request Demo <ArrowRight className="w-3.5 h-3.5" />
          </button>
          {onClose && (
            <button onClick={onClose} className="p-2 text-[#666] hover:text-white rounded-lg hover:bg-white/5" title="Close Overlay">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`xl:hidden p-2 transition-colors ${
            theme === 'dark' ? 'text-[#888] hover:text-white' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className={`xl:hidden border-b p-5 space-y-3 text-sm font-semibold z-50 relative ${
          theme === 'dark' 
            ? 'bg-[#0A0A0A] border-white/10' 
            : 'bg-white border-gray-200'
        }`}>
          <button onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }} className={`block w-full text-left py-1 ${
            theme === 'dark' ? 'text-[#AAA] hover:text-white' : 'text-gray-600 hover:text-gray-900'
          }`}>Home</button>
          <button onClick={() => { setActiveTab('about'); setMobileMenuOpen(false); }} className={`block w-full text-left py-1 ${
            theme === 'dark' ? 'text-[#AAA] hover:text-white' : 'text-gray-600 hover:text-gray-900'
          }`}>About</button>
          <button onClick={() => { setActiveTab('placements'); setMobileMenuOpen(false); }} className={`block w-full text-left py-1 ${
            theme === 'dark' ? 'text-[#AAA] hover:text-white' : 'text-gray-600 hover:text-gray-900'
          }`}>Partners</button>
          <button onClick={() => { setActiveTab('programs'); setMobileMenuOpen(false); }} className={`block w-full text-left py-1 ${
            theme === 'dark' ? 'text-[#AAA] hover:text-white' : 'text-gray-600 hover:text-gray-900'
          }`}>Training Programs</button>
          <button onClick={() => { setActiveTab('colleges'); setMobileMenuOpen(false); }} className={`block w-full text-left py-1 ${
            theme === 'dark' ? 'text-[#AAA] hover:text-white' : 'text-gray-600 hover:text-gray-900'
          }`}>Partner Colleges</button>
          <button onClick={() => { setActiveTab('resources'); setMobileMenuOpen(false); }} className={`block w-full text-left py-1 ${
            theme === 'dark' ? 'text-[#AAA] hover:text-white' : 'text-gray-600 hover:text-gray-900'
          }`}>Resources & Blog</button>
          <button onClick={() => { setActiveTab('contact'); setMobileMenuOpen(false); }} className={`block w-full text-left py-1 ${
            theme === 'dark' ? 'text-[#AAA] hover:text-white' : 'text-gray-600 hover:text-gray-900'
          }`}>Contact</button>
          <div className="pt-3 flex flex-col gap-2">
            {/* Theme Toggle in Mobile Menu */}
            <button
              onClick={() => { toggleTheme(); }}
              className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                theme === 'dark'
                  ? 'bg-[#111] border border-white/10 text-white'
                  : 'bg-gray-100 border border-gray-300 text-gray-900'
              }`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </button>
            <button onClick={() => { setShowDemoModal(true); setMobileMenuOpen(false); }} className="w-full py-2.5 bg-[#6366F1] text-white rounded-xl text-xs font-bold">Request Demo</button>
            <button onClick={() => { setShowAuthModal(true); setMobileMenuOpen(false); }} className={`w-full py-2.5 text-white rounded-xl text-xs font-bold transition-all ${
              theme === 'dark'
                ? 'bg-[#1A1A1A] border border-white/10'
                : 'bg-[#111827] border border-transparent'
            }`}>Login</button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* HOME PAGE VIEW */}
      {/* ============================================================ */}
      {activeTab === 'home' && (
        <>
          {/* HERO SECTION */}
          <section className={`relative min-h-[90vh] max-w-7xl mx-auto px-6 pt-16 pb-20 flex flex-col lg:flex-row items-center justify-between gap-12 ${
            theme === 'dark' ? 'bg-transparent' : 'bg-white'
          }`}>
            {/* Left Column: Copy & Actions */}
            <motion.div 
              className="flex-1 space-y-8 text-center lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div 
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md text-xs font-semibold shadow-sm ${
                  theme === 'dark' 
                    ? 'bg-white/5 border border-white/10 text-[#A855F7]' 
                    : 'bg-gray-100 border border-gray-200 text-[#6366F1]'
                }`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.05, borderColor: theme === 'dark' ? "rgba(168, 85, 247, 0.5)" : "rgba(99, 102, 241, 0.5)" }}
              >
                <motion.span 
                  className="w-2 h-2 rounded-full bg-[#10B981]"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                Enterprise SaaS Academic & Placement Platform
              </motion.div>

              <motion.h1 
                className={`text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.08] ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Bridging Academic Learning <br />
                <motion.span 
                  className="bg-gradient-to-r from-[#6366F1] via-[#A855F7] to-[#10B981] bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ['0%', '100%', '0%'],
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{ backgroundSize: '200% 100%' }}
                >
                  with Industry Readiness.
                </motion.span>
              </motion.h1>

              <motion.p 
                className={`text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed ${
                  theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                LearnIT aims to become India's most trusted industry-academia platform, empowering every student with future-ready skills, real-world experience, and meaningful career opportunities by creating a strong bridge between academic education and industry.
              </motion.p>

              <motion.div 
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <MagneticButton
                  onClick={() => setActiveTab('programs')}
                  className="px-7 py-4 bg-gradient-to-r from-[#6366F1] to-[#A855F7] hover:from-[#5558DD] hover:to-[#9333EA] text-white font-bold rounded-2xl text-xs transition-all shadow-xl shadow-[#6366F1]/20 flex items-center gap-2 group hover:scale-105"
                  strength={20}
                >
                  Explore Programs <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </MagneticButton>
                <MagneticButton
                  onClick={() => setShowDemoModal(true)}
                  className={`px-7 py-4 font-bold rounded-2xl text-xs transition-all flex items-center gap-2 hover:scale-105 ${
                    theme === 'dark'
                      ? 'bg-[#111] border border-white/10 text-white hover:bg-[#1A1A1A] hover:border-white/20'
                      : 'bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                  strength={20}
                >
                  Request Institutional Demo <Sparkles className="w-4 h-4 text-[#A855F7]" />
                </MagneticButton>
              </motion.div>

              {/* Metrics Below Buttons */}
              <motion.div 
                className={`pt-8 border-t grid grid-cols-3 gap-6 max-w-lg mx-auto lg:mx-0 text-center lg:text-left ${
                  theme === 'dark' ? 'border-white/10' : 'border-gray-200'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <motion.div 
                  whileHover={{ scale: 1.1 }} 
                  transition={{ type: "spring", stiffness: 400 }}
                  className="cursor-pointer"
                >
                  <p className={`text-2xl sm:text-3xl font-extrabold font-mono ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Building</p>
                  <p className={`text-xs font-medium mt-0.5 ${
                    theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
                  }`}>Platform in Development</p>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.1 }} 
                  transition={{ type: "spring", stiffness: 400 }}
                  className="cursor-pointer"
                >
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#6366F1] font-mono">2</p>
                  <p className={`text-xs font-medium mt-0.5 ${
                    theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
                  }`}>Pilot Colleges</p>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.1 }} 
                  transition={{ type: "spring", stiffness: 400 }}
                  className="cursor-pointer"
                >
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#10B981] font-mono">2026</p>
                  <p className={`text-xs font-medium mt-0.5 ${
                    theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
                  }`}>Launch Target</p>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right Column: Premium Spatial Dashboard Mockup */}
            <motion.div 
              className="flex-1 w-full max-w-xl relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              <motion.div 
                className={`relative border rounded-3xl p-6 shadow-2xl backdrop-blur-2xl space-y-5 ${
                  theme === 'dark' 
                    ? 'bg-[rgba(13,13,20,0.9)] border-[rgba(255,255,255,0.08)]' 
                    : 'bg-[rgba(255,255,255,0.95)] border-[rgba(0,0,0,0.06)]'
                }`}
                animate={{ 
                  y: [0, -8, 0],
                  rotateX: [0, 2, 0],
                  rotateY: [0, -3, 0],
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Mock Header */}
                <div className={`flex items-center justify-between pb-4 border-b ${
                  theme === 'dark' ? 'border-white/10' : 'border-gray-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <motion.div 
                      className="w-3 h-3 rounded-full bg-red-500/80"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div 
                      className="w-3 h-3 rounded-full bg-yellow-500/80"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                    />
                    <motion.div 
                      className="w-3 h-3 rounded-full bg-green-500/80"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                    />
                    <span className={`text-[11px] font-mono ml-2 ${
                      theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
                    }`}>learnit.edu/enterprise-hub</span>
                  </div>
                  <motion.span 
                    className="text-[10px] font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-full border border-[#10B981]/20"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Live System
                  </motion.span>
                </div>

                {/* Floating Glass Cards Grid */}
                <div className="space-y-4">
                  {/* QR Roll Call Live Card */}
                  <motion.div 
                    className={`p-4 rounded-2xl border flex items-center justify-between shadow-lg ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-[#111118] to-[#181824] border-white/10'
                        : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    whileHover={{ scale: 1.02, borderColor: theme === 'dark' ? "rgba(99, 102, 241, 0.3)" : "rgba(99, 102, 241, 0.5)" }}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div 
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                          theme === 'dark'
                            ? 'bg-[#6366F1]/15 border-[#6366F1]/30 text-[#6366F1]'
                            : 'bg-[#6366F1]/10 border-[#6366F1]/20 text-[#6366F1]'
                        }`}
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      >
                        <UserCheck className="w-5 h-5" />
                      </motion.div>
                      <div>
                        <h4 className={`text-xs font-bold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>Geo-Verified QR Roll Call</h4>
                        <p className={`text-[10px] ${
                          theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
                        }`}>Class 4A • 68 Students Checked In</p>
                      </div>
                    </div>
                    <motion.span 
                      className="text-xs font-mono font-bold text-[#10B981]"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      98.5% Today
                    </motion.span>
                  </motion.div>

                  {/* Student Placement Offer Card */}
                  <motion.div 
                    className={`p-4 rounded-2xl border flex items-center justify-between shadow-lg ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-[#111118] to-[#181824] border-white/10'
                        : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    whileHover={{ scale: 1.02, borderColor: theme === 'dark' ? "rgba(16, 185, 129, 0.3)" : "rgba(16, 185, 129, 0.5)" }}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div 
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                          theme === 'dark'
                            ? 'bg-[#10B981]/15 border-[#10B981]/30 text-[#10B981]'
                            : 'bg-[#10B981]/10 border-[#10B981]/20 text-[#10B981]'
                        }`}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Award className="w-5 h-5" />
                      </motion.div>
                      <div>
                        <h4 className={`text-xs font-bold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>Upcoming Placement Drive</h4>
                        <p className={`text-[10px] ${
                          theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
                        }`}>TBD • Opening Soon</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#A855F7] bg-[#A855F7]/10 px-2 py-1 rounded-lg border border-[#A855F7]/20">
                      6.5 LPA Target
                    </span>
                  </motion.div>

                  {/* Partner Campus Card */}
                  <motion.div 
                    className={`p-4 rounded-2xl border flex items-center justify-between shadow-lg ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-[#111118] to-[#181824] border-white/10'
                        : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    whileHover={{ scale: 1.02, borderColor: theme === 'dark' ? "rgba(168, 85, 247, 0.3)" : "rgba(168, 85, 247, 0.5)" }}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div 
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                          theme === 'dark'
                            ? 'bg-[#A855F7]/15 border-[#A855F7]/30 text-[#A855F7]'
                            : 'bg-[#A855F7]/10 border-[#A855F7]/20 text-[#A855F7]'
                        }`}
                        animate={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                      >
                        <Building2 className="w-5 h-5" />
                      </motion.div>
                      <div>
                        <h4 className={`text-xs font-bold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>St. Xavier's Campus Sync</h4>
                        <p className={`text-[10px] ${
                          theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
                        }`}>1,450 Enrolled Students</p>
                      </div>
                    </div>
                    <motion.span 
                      className={`text-[10px] font-mono ${
                        theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
                      }`}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      Syncing LMS...
                    </motion.span>
                  </motion.div>
                </div>

                {/* Bottom Quick Roles */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-[#AAA]">
                  <span>Instant Role Switcher:</span>
                  <button
                    onClick={() => onAccessErp('super_admin')}
                    className="text-[#6366F1] font-bold hover:underline flex items-center gap-1"
                  >
                    Open HQ Portal <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </section>

          {/* TRUSTED BY: CAROUSEL */}
          <section className={`border-y py-10 overflow-hidden ${
            theme === 'dark' 
              ? 'border-[rgba(255,255,255,0.08)] bg-[rgba(13,13,20,0.5)]' 
              : 'border-[rgba(0,0,0,0.06)] bg-[rgba(248,250,252,0.8)]'
          }`}>
            <div className="max-w-7xl mx-auto px-6 space-y-6">
              <p className={`text-center text-xs font-bold uppercase tracking-widest ${
                theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
              }`}>
                Building Partnerships with Engineering Campuses & Recruiter Networks
              </p>

              <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-80">
                {['Partner College 1', 'Partner College 2', 'Building Network', 'Coming Soon'].map((brand, i) => (
                  <span key={i} className={`text-xs sm:text-sm font-bold font-mono tracking-tight transition-colors ${
                    theme === 'dark' ? 'text-[#AAA] hover:text-white' : 'text-gray-700 hover:text-gray-900'
                  }`}>
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <SectionDivider className="max-w-7xl mx-auto my-8" />

          {/* STATISTICS SECTION */}
          <motion.section 
            className="max-w-7xl mx-auto px-6 py-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { value: 'Launching', label: 'Platform in Development', color: theme === 'dark' ? '#FFFFFF' : '#111827' },
                { value: '2', label: 'Pilot Colleges', color: '#6366F1' },
                { value: '2026', label: 'Launch Target Year', color: '#10B981' },
                { value: 'Growing', label: 'Building Network', color: '#A855F7' }
              ].map((stat, idx) => (
                <motion.div 
                  key={idx}
                  className={`p-6 rounded-2xl border space-y-2 transition-all duration-250 hover:-translate-y-1 ${
                    theme === 'dark' 
                      ? 'bg-[#0A0A0E] border-[rgba(255,255,255,0.08)] shadow hover:shadow-lg' 
                      : 'bg-white border-[rgba(0,0,0,0.06)] shadow hover:shadow-lg'
                  }`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ 
                    scale: 1.02,
                    borderColor: stat.color === '#FFFFFF' ? (theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)') : stat.color
                  }}
                >
                  <motion.p 
                    className="text-3xl sm:text-5xl font-black font-mono"
                    style={{ color: stat.color }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 + 0.2 }}
                  >
                    {stat.value}
                  </motion.p>
                  <p className={`text-xs font-medium ${
                    theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
                  }`}>{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <AnimatedGradientDivider className="max-w-7xl mx-auto my-8" />

          {/* WHY LEARNIT: 2 x 4 GRID */}
          <motion.section 
            className="max-w-7xl mx-auto px-6 py-16 space-y-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="text-center space-y-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.span 
                className="text-xs font-bold uppercase tracking-widest text-[#6366F1]"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Platform Capabilities
              </motion.span>
              <h2 className={`text-3xl sm:text-4xl font-extrabold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Comprehensive Academic & Career Platform</h2>
              <p className={`text-xs sm:text-sm max-w-xl mx-auto ${
                theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
              }`}>
                Everything colleges need to deliver industry-relevant education, track student progress, and prepare graduates for successful careers.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Industry-Aligned Programs', desc: 'Tech stacks and frameworks used in modern software companies, updated regularly.', icon: <BookOpen className="w-5 h-5 text-[#6366F1]" />, color: '#6366F1' },
                { title: 'Experienced Mentors', desc: 'Working professionals guide students through practical projects and real-world scenarios.', icon: <Users className="w-5 h-5 text-[#A855F7]" />, color: '#A855F7' },
                { title: 'Attendance Tracking', desc: 'Automated attendance with QR codes, GPS verification, and real-time reporting.', icon: <UserCheck className="w-5 h-5 text-[#10B981]" />, color: '#10B981' },
                { title: 'Assignment Management', desc: 'Distribute, collect, and grade assignments with automated code testing.', icon: <FileText className="w-5 h-5 text-[#F59E0B]" />, color: '#F59E0B' },
                { title: 'Performance Analytics', desc: 'Track student progress, identify learning gaps, and measure outcomes.', icon: <BarChart3 className="w-5 h-5 text-[#EC4899]" />, color: '#EC4899' },
                { title: 'Verified Certificates', desc: 'Digitally signed certificates with unique verification codes for employers.', icon: <Award className="w-5 h-5 text-[#3B82F6]" />, color: '#3B82F6' },
                { title: 'Placement Preparation', desc: 'Resume building, interview practice, and direct connections with hiring companies.', icon: <Briefcase className="w-5 h-5 text-[#10B981]" />, color: '#10B981' },
                { title: 'Career Support', desc: 'Guidance on job applications, interview techniques, and career planning.', icon: <HeartHandshake className="w-5 h-5 text-[#6366F1]" />, color: '#6366F1' }
              ].map((item, idx) => (
                <motion.div 
                  key={idx} 
                  className={`p-6 rounded-2xl border transition-all duration-250 space-y-3 group hover:-translate-y-1 ${
                    theme === 'dark' 
                      ? 'bg-[#0A0A0E] border-[rgba(255,255,255,0.08)] shadow hover:shadow-lg hover:border-[#6366F1]/30' 
                      : 'bg-white border-[rgba(0,0,0,0.06)] shadow hover:shadow-lg hover:border-[#6366F1]/30'
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ 
                    scale: 1.02,
                  }}
                >
                  <motion.div 
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center group-hover:scale-110 transition-transform ${
                      theme === 'dark' 
                        ? 'bg-white/5 border-white/10' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                    whileHover={{ 
                      backgroundColor: theme === 'dark' ? `${item.color}20` : `${item.color}15`,
                      borderColor: item.color
                    }}
                  >
                    {item.icon}
                  </motion.div>
                  <h3 className={`font-bold text-base transition-colors ${
                    theme === 'dark' ? 'text-white group-hover:text-[#6366F1]' : 'text-gray-900 group-hover:text-indigo-600'
                  }`}>{item.title}</h3>
                  <p className={`text-xs leading-relaxed ${
                    theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
                  }`}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <SectionDivider className="max-w-7xl mx-auto my-8" />

          {/* FEATURE HIGHLIGHT: INTERACTIVE DASHBOARD PREVIEW WITH DEVICE TOGGLES */}
          <section className={`max-w-7xl mx-auto px-6 py-20 border-t space-y-8 ${
            theme === 'dark' ? 'border-white/10' : 'border-gray-200'
          }`}>
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#10B981]">Multi-Device ERP Experience</span>
              <h2 className={`text-3xl sm:text-4xl font-extrabold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Experience LearnIT Across All Devices</h2>
              <p className={`text-xs sm:text-sm max-w-xl mx-auto ${
                theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
              }`}>
                Seamless experience tailored for Desktop Admins, Tablet Mentors, and Mobile Students.
              </p>

              {/* Device Selector Buttons */}
              <div className={`inline-flex items-center gap-2 p-1 border rounded-xl ${
                theme === 'dark' 
                  ? 'bg-[#0F0F14] border-white/10' 
                  : 'bg-gray-100 border-gray-200'
              }`}>
                <button
                  onClick={() => setDevicePreviewMode('desktop')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                    devicePreviewMode === 'desktop' 
                      ? 'bg-[#6366F1] text-white shadow-md' 
                      : theme === 'dark' ? 'text-[#888] hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Monitor className="w-4 h-4" /> Desktop
                </button>
                <button
                  onClick={() => setDevicePreviewMode('tablet')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                    devicePreviewMode === 'tablet' 
                      ? 'bg-[#6366F1] text-white shadow-md' 
                      : theme === 'dark' ? 'text-[#888] hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Tablet className="w-4 h-4" /> Tablet
                </button>
                <button
                  onClick={() => setDevicePreviewMode('mobile')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                    devicePreviewMode === 'mobile' 
                      ? 'bg-[#6366F1] text-white shadow-md' 
                      : theme === 'dark' ? 'text-[#888] hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Smartphone className="w-4 h-4" /> Mobile
                </button>
              </div>
            </div>

            {/* Premium Device Showcase Section */}
            <div className="relative min-h-[700px] flex items-center justify-center py-12 px-4">
              {/* Background Effects */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-[#6366F1]/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-[#A855F7]/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-[#10B981]/10 rounded-full blur-[120px]" />
              </div>

              {/* Floating Feature Callouts */}
              <div className="absolute top-5 left-2 lg:top-10 lg:left-10 z-20">
                <div className={`p-2 lg:p-4 rounded-xl lg:rounded-2xl backdrop-blur-xl border space-y-1 lg:space-y-2 animate-float ${
                  theme === 'dark' 
                    ? 'bg-white/5 border-white/10' 
                    : 'bg-white border-gray-200 shadow-lg'
                }`} style={{ animationDuration: '6s' }}>
                  <div className="flex items-center gap-1.5 lg:gap-2">
                    <Lock className="w-3 h-3 lg:w-4 lg:h-4 text-[#10B981]" />
                    <span className={`text-[9px] lg:text-xs font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>Enterprise Security</span>
                  </div>
                  <p className={`text-[8px] lg:text-[10px] ${
                    theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
                  }`}>SOC 2 Compliant</p>
                </div>
              </div>

              <div className="absolute top-10 right-2 lg:top-20 lg:right-10 z-20">
                <div className={`p-2 lg:p-4 rounded-xl lg:rounded-2xl backdrop-blur-xl border space-y-1 lg:space-y-2 animate-float ${
                  theme === 'dark' 
                    ? 'bg-white/5 border-white/10' 
                    : 'bg-white border-gray-200 shadow-lg'
                }`} style={{ animationDuration: '7s', animationDelay: '0.5s' }}>
                  <div className="flex items-center gap-1.5 lg:gap-2">
                    <Cloud className="w-3 h-3 lg:w-4 lg:h-4 text-[#6366F1]" />
                    <span className={`text-[9px] lg:text-xs font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>Cloud Sync</span>
                  </div>
                  <p className={`text-[8px] lg:text-[10px] ${
                    theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
                  }`}>RealTime Data</p>
                </div>
              </div>

              <div className="absolute bottom-20 left-2 lg:bottom-20 lg:left-10 z-20">
                <div className={`p-2 lg:p-4 rounded-xl lg:rounded-2xl backdrop-blur-xl border space-y-1 lg:space-y-2 animate-float ${
                  theme === 'dark' 
                    ? 'bg-white/5 border-white/10' 
                    : 'bg-white border-gray-200 shadow-lg'
                }`} style={{ animationDuration: '8s', animationDelay: '1s' }}>
                  <div className="flex items-center gap-1.5 lg:gap-2">
                    <Zap className="w-3 h-3 lg:w-4 lg:h-4 text-[#F59E0B]" />
                    <span className={`text-[9px] lg:text-xs font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>Fast Performance</span>
                  </div>
                  <p className={`text-[8px] lg:text-[10px] ${
                    theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
                  }`}>&lt;100ms Response</p>
                </div>
              </div>

              <div className="absolute bottom-10 right-2 lg:bottom-10 lg:right-10 z-20">
                <div className={`p-2 lg:p-4 rounded-xl lg:rounded-2xl backdrop-blur-xl border space-y-1 lg:space-y-2 animate-float ${
                  theme === 'dark' 
                    ? 'bg-white/5 border-white/10' 
                    : 'bg-white border-gray-200 shadow-lg'
                }`} style={{ animationDuration: '6.5s', animationDelay: '1.5s' }}>
                  <div className="flex items-center gap-1.5 lg:gap-2">
                    <Bell className="w-3 h-3 lg:w-4 lg:h-4 text-[#A855F7]" />
                    <span className={`text-[9px] lg:text-xs font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>Real-Time Notifications</span>
                  </div>
                  <p className={`text-[8px] lg:text-[10px] ${
                    theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
                  }`}>Instant Alerts</p>
                </div>
              </div>

              {/* Device Frame - Responsive Scaling */}
              <div className="relative z-10 transition-all duration-500 ease-in-out w-full max-w-6xl mx-auto">
                {devicePreviewMode === 'desktop' && (
                  <div className="relative animate-device-in flex justify-center">
                    {/* Laptop Frame */}
                    <div className="relative bg-[#1a1a2e] rounded-2xl p-2 shadow-2xl border border-white/10 w-full max-w-[800px]">
                      {/* Screen */}
                      <div className="bg-[#0a0a0f] rounded-xl overflow-hidden aspect-video">
                        {/* Browser Header */}
                        <div className="bg-[#151520] px-4 py-2 flex items-center gap-2 border-b border-white/5">
                          <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                            <div className="w-3 h-3 rounded-full bg-green-500/80" />
                          </div>
                          <div className="flex-1 bg-[#0a0a0f] rounded-lg px-3 py-1 text-[10px] text-[#666] font-mono hidden sm:block">
                            learnit.edu/super-admin/dashboard
                          </div>
                        </div>
                        
                        {/* Dashboard Content */}
                        <div className="flex h-full min-h-[300px]">
                          {/* Sidebar */}
                          <div className="w-12 sm:w-48 bg-[#0d0d15] border-r border-white/5 p-2 sm:p-3 space-y-2 hidden md:block">
                            <div className="text-[8px] sm:text-[10px] font-bold text-[#666] uppercase mb-2 sm:mb-3">Navigation</div>
                            {['Dashboard', 'Colleges', 'Mentors', 'Students', 'Analytics', 'Settings'].map((item, i) => (
                              <div key={i} className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-[8px] sm:text-[10px] font-medium ${i === 0 ? 'bg-[#6366F1]/20 text-[#6366F1]' : 'text-[#888] hover:bg-white/5'}`}>
                                <span className="hidden sm:inline">{item}</span>
                                <span className="sm:hidden">{item[0]}</span>
                              </div>
                            ))}
                          </div>
                          
                          {/* Main Content */}
                          <div className="flex-1 p-2 sm:p-4 overflow-hidden">
                            {/* Top Bar */}
                            <div className="flex items-center justify-between mb-2 sm:mb-4">
                              <div>
                                <h3 className="text-[10px] sm:text-sm font-bold text-white">Super Admin Dashboard</h3>
                                <p className="text-[8px] sm:text-[10px] text-[#666]">Real-time platform overview</p>
                              </div>
                              <div className="flex items-center gap-1 sm:gap-2">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#6366F1]/20 flex items-center justify-center">
                                  <Bell className="w-3 h-3 sm:w-4 sm:h-4 text-[#6366F1]" />
                                </div>
                                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#10B981]/20 flex items-center justify-center">
                                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-[#10B981]" />
                                </div>
                              </div>
                            </div>
                            
                            {/* KPI Cards */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-2 sm:mb-4">
                              {[
                                { label: 'Students', value: 'Demo', color: '#6366F1' },
                                { label: 'Colleges', value: '2', color: '#A855F7' },
                                { label: 'Building', value: '2026', color: '#10B981' },
                                { label: 'Platform', value: 'Beta', color: '#F59E0B' }
                              ].map((kpi, i) => (
                                <div key={i} className="bg-[#111] rounded-xl p-2 sm:p-3 border border-white/5 hover:border-white/10 transition-all animate-pulse-glow" style={{ animationDelay: `${i * 200}ms` } as React.CSSProperties}>
                                  <p className="text-[8px] sm:text-[9px] text-[#666]">{kpi.label}</p>
                                  <p className="text-sm sm:text-lg font-bold font-mono animate-count" style={{ color: kpi.color, animationDelay: `${i * 100}ms` } as React.CSSProperties}>{kpi.value}</p>
                                </div>
                              ))}
                            </div>
                            
                            {/* Charts Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-2 sm:mb-4">
                              <div className="bg-[#111] rounded-xl p-2 sm:p-3 border border-white/5">
                                <p className="text-[8px] sm:text-[9px] text-[#666] mb-2">Revenue Trend</p>
                                <div className="flex items-end gap-0.5 sm:gap-1 h-12 sm:h-16">
                                  {[30, 45, 35, 50, 40, 60, 55, 70, 65, 80, 75, 90].map((h, i) => (
                                    <div 
                                      key={i} 
                                      className="flex-1 bg-[#6366F1]/60 rounded-t animate-bar" 
                                      style={{ '--target-height': `${h}%`, animationDelay: `${i * 50}ms` } as React.CSSProperties}
                                    />
                                  ))}
                                </div>
                              </div>
                              <div className="bg-[#111] rounded-xl p-2 sm:p-3 border border-white/5">
                                <p className="text-[8px] sm:text-[9px] text-[#666] mb-2">College Distribution</p>
                                <div className="flex gap-1 sm:gap-2">
                                  <div className="flex-1 h-12 sm:h-16 bg-[#A855F7]/60 rounded-lg animate-bar" style={{ '--target-height': '100%', animationDelay: '0ms' } as React.CSSProperties} />
                                  <div className="flex-1 h-12 sm:h-16 bg-[#10B981]/60 rounded-lg animate-bar" style={{ '--target-height': '100%', animationDelay: '100ms' } as React.CSSProperties} />
                                  <div className="flex-1 h-12 sm:h-16 bg-[#F59E0B]/60 rounded-lg animate-bar" style={{ '--target-height': '100%', animationDelay: '200ms' } as React.CSSProperties} />
                                </div>
                              </div>
                            </div>
                            
                            {/* Recent Activity */}
                            <div className="bg-[#111] rounded-xl p-2 sm:p-3 border border-white/5">
                              <p className="text-[8px] sm:text-[9px] text-[#666] mb-2">Recent Activity</p>
                              <div className="space-y-1 sm:space-y-2">
                                {[
                                  { action: 'College onboarded', time: '2m' },
                                  { action: 'Drive started', time: '15m' },
                                  { action: 'Mentor updated', time: '1h' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center justify-between text-[8px] sm:text-[10px]">
                                    <span className="text-[#888]">{item.action}</span>
                                    <span className="text-[#666]">{item.time}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Laptop Base */}
                      <div className="bg-[#151520] h-2 sm:h-3 rounded-b-xl mt-1 sm:mt-2 border-t border-white/5" />
                    </div>
                  </div>
                )}

                {devicePreviewMode === 'tablet' && (
                  <div className="relative animate-device-in flex justify-center">
                    {/* Tablet Frame */}
                    <div className="relative bg-[#1a1a2e] rounded-2xl sm:rounded-3xl p-2 sm:p-3 shadow-2xl border border-white/10 w-full max-w-[350px] sm:max-w-[500px]">
                      {/* Screen */}
                      <div className="bg-[#0a0a0f] rounded-xl sm:rounded-2xl overflow-hidden aspect-[3/4]">
                        {/* Status Bar */}
                        <div className="bg-[#151520] px-3 sm:px-4 py-1 sm:py-2 flex items-center justify-between border-b border-white/5">
                          <span className="text-[9px] sm:text-[10px] text-[#666] font-mono">9:41 AM</span>
                          <div className="flex items-center gap-1 sm:gap-2">
                            <div className="w-3 h-1.5 sm:w-4 sm:h-2 bg-[#10B981]/60 rounded-full" />
                            <div className="w-4 h-1.5 sm:w-6 sm:h-2 bg-[#6366F1]/60 rounded-full" />
                          </div>
                        </div>
                        
                        {/* Dashboard Content */}
                        <div className="p-2 sm:p-4 h-full overflow-hidden">
                          {/* Header */}
                          <div className="flex items-center justify-between mb-2 sm:mb-4">
                            <div>
                              <h3 className="text-xs sm:text-sm font-bold text-white">College Admin</h3>
                              <p className="text-[9px] sm:text-[10px] text-[#666]">St. Xavier's Institute</p>
                            </div>
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#6366F1]/20 flex items-center justify-center">
                              <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#6366F1]" />
                            </div>
                          </div>
                          
                          {/* Today's Stats */}
                          <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-2 sm:mb-4">
                            {[
                              { label: 'Attendance', value: '92.4%', icon: <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 text-[#10B981]" /> },
                              { label: 'Mentors', value: '18', icon: <Users className="w-3 h-3 sm:w-4 sm:h-4 text-[#A855F7]" /> },
                              { label: 'Pending', value: '5', icon: <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-[#F59E0B]" /> },
                              { label: 'Events', value: '3', icon: <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-[#6366F1]" /> }
                            ].map((stat, i) => (
                              <div key={i} className="bg-[#111] rounded-xl p-2 sm:p-3 border border-white/5 hover:border-white/10 transition-all animate-pulse-glow" style={{ animationDelay: `${i * 150}ms` } as React.CSSProperties}>
                                <div className="flex items-center gap-1 sm:gap-2 mb-1">
                                  {stat.icon}
                                  <span className="text-[8px] sm:text-[9px] text-[#666]">{stat.label}</span>
                                </div>
                                <p className="text-sm sm:text-lg font-bold font-mono text-white animate-count" style={{ animationDelay: `${i * 100}ms` } as React.CSSProperties}>{stat.value}</p>
                              </div>
                            ))}
                          </div>
                          
                          {/* Department Overview */}
                          <div className="bg-[#111] rounded-xl p-2 sm:p-3 border border-white/5 mb-2 sm:mb-4">
                            <p className="text-[9px] sm:text-[10px] font-bold text-white mb-2">Department Overview</p>
                            <div className="space-y-1 sm:space-y-2">
                              {['CS', 'AI/DS', 'ECE', 'MECH'].map((dept, i) => (
                                <div key={i} className="flex items-center justify-between">
                                  <span className="text-[9px] sm:text-[10px] text-[#888]">{dept}</span>
                                  <div className="flex items-center gap-1 sm:gap-2">
                                    <div className="w-12 sm:w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-[#6366F1] rounded-full animate-bar" 
                                        style={{ '--target-height': `${80 - i * 15}%`, width: `${80 - i * 15}%`, animationDelay: `${i * 100}ms` } as React.CSSProperties}
                                      />
                                    </div>
                                    <span className="text-[8px] sm:text-[9px] text-[#666] font-mono">{80 - i * 15}%</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Faculty List */}
                          <div className="bg-[#111] rounded-xl p-2 sm:p-3 border border-white/5 mb-2 sm:mb-4">
                            <p className="text-[9px] sm:text-[10px] font-bold text-white mb-2">Faculty Status</p>
                            <div className="space-y-1 sm:space-y-2">
                              {[
                                { name: 'Dr. Rajesh', status: 'Online', color: '#10B981' },
                                { name: 'Prof. Sarah', status: 'In Class', color: '#6366F1' },
                                { name: 'Dr. Vikram', status: 'Offline', color: '#666' }
                              ].map((faculty, i) => (
                                <div key={i} className="flex items-center justify-between">
                                  <span className="text-[9px] sm:text-[10px] text-[#888]">{faculty.name}</span>
                                  <span className="text-[8px] sm:text-[9px] font-medium" style={{ color: faculty.color }}>{faculty.status}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Quick Actions */}
                          <div className="grid grid-cols-3 gap-1 sm:gap-2">
                            {[
                              { label: 'Attendance', icon: <UserCheck className="w-3 h-3 sm:w-4 sm:h-4" /> },
                              { label: 'Reports', icon: <FileText className="w-3 h-3 sm:w-4 sm:h-4" /> },
                              { label: 'Events', icon: <Calendar className="w-3 h-3 sm:w-4 sm:h-4" /> }
                            ].map((action, i) => (
                              <div key={i} className="bg-[#111] rounded-xl p-2 sm:p-3 border border-white/5 text-center">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-[#6366F1]/20 flex items-center justify-center mx-auto mb-1 text-[#6366F1]">
                                  {action.icon}
                                </div>
                                <span className="text-[8px] sm:text-[9px] text-[#888]">{action.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {devicePreviewMode === 'mobile' && (
                  <div className="relative animate-device-in flex justify-center">
                    {/* Phone Frame */}
                    <div className="relative bg-[#1a1a2e] rounded-[30px] sm:rounded-[40px] p-2 sm:p-3 shadow-2xl border border-white/10 w-full max-w-[260px] sm:max-w-[280px]">
                      {/* Screen */}
                      <div className="bg-[#0a0a0f] rounded-[24px] sm:rounded-[32px] overflow-hidden aspect-[9/19]">
                        {/* Notch */}
                        <div className="bg-[#151520] h-4 sm:h-6 flex items-center justify-center relative">
                          <div className="w-12 sm:w-16 h-3 sm:h-4 bg-[#0a0a0f] rounded-full" />
                        </div>
                        
                        {/* Status Bar */}
                        <div className="bg-[#151520] px-3 sm:px-4 py-0.5 sm:py-1 flex items-center justify-between border-b border-white/5">
                          <span className="text-[8px] sm:text-[9px] text-[#666] font-mono">9:41 AM</span>
                          <div className="flex items-center gap-0.5 sm:gap-1">
                            <div className="w-2 h-1 sm:w-3 sm:h-1.5 bg-[#10B981]/60 rounded-full" />
                            <div className="w-3 h-1 sm:w-4 sm:h-1.5 bg-[#6366F1]/60 rounded-full" />
                          </div>
                        </div>
                        
                        {/* App Content */}
                        <div className="p-2 sm:p-3 h-full overflow-hidden">
                          {/* Greeting */}
                          <div className="mb-2 sm:mb-3">
                            <p className="text-[9px] sm:text-[10px] text-[#666]">Good Morning,</p>
                            <h3 className="text-xs sm:text-sm font-bold text-white">Rohan Mehta</h3>
                          </div>
                          
                          {/* Profile Card */}
                          <div className="bg-gradient-to-r from-[#6366F1]/20 to-[#A855F7]/20 rounded-xl p-2 sm:p-3 mb-2 sm:mb-3 border border-white/10">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#6366F1]/30 flex items-center justify-center">
                                <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#6366F1]" />
                              </div>
                              <div>
                                <p className="text-[9px] sm:text-[10px] font-bold text-white">CSE • Batch 2026</p>
                                <p className="text-[8px] sm:text-[9px] text-[#666]">CGPA: 8.5</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Today's Class */}
                          <div className="bg-[#111] rounded-xl p-2 sm:p-3 mb-2 sm:mb-3 border border-white/5">
                            <p className="text-[9px] sm:text-[10px] font-bold text-white mb-1 sm:mb-2">Today's Class</p>
                            <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-[#10B981]/20 flex items-center justify-center">
                                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-[#10B981]" />
                              </div>
                              <div>
                                <p className="text-[9px] sm:text-[10px] font-medium text-white">React Microservices</p>
                                <p className="text-[8px] sm:text-[9px] text-[#666]">10:00 AM - 11:30 AM</p>
                              </div>
                            </div>
                            <button className="w-full py-1.5 sm:py-2 bg-[#10B981] text-white font-bold rounded-lg text-[9px] sm:text-[10px]">
                              Generate QR Code
                            </button>
                          </div>
                          
                          {/* Quick Stats */}
                          <div className="grid grid-cols-3 gap-1 sm:gap-2 mb-2 sm:mb-3">
                            {[
                              { label: 'Attendance', value: '92%', color: '#10B981' },
                              { label: 'Assignments', value: '11/12', color: '#6366F1' },
                              { label: 'CGPA', value: '8.5', color: '#A855F7' }
                            ].map((stat, i) => (
                              <div key={i} className="bg-[#111] rounded-xl p-1.5 sm:p-2 border border-white/5 text-center hover:border-white/10 transition-all animate-pulse-glow" style={{ animationDelay: `${i * 100}ms` } as React.CSSProperties}>
                                <p className="text-sm sm:text-lg font-bold font-mono animate-count" style={{ color: stat.color, animationDelay: `${i * 50}ms` } as React.CSSProperties}>{stat.value}</p>
                                <span className="text-[7px] sm:text-[8px] text-[#666]">{stat.label}</span>
                              </div>
                            ))}
                          </div>
                          
                          {/* Upcoming */}
                          <div className="bg-[#111] rounded-xl p-2 sm:p-3 mb-2 sm:mb-3 border border-white/5">
                            <p className="text-[9px] sm:text-[10px] font-bold text-white mb-1 sm:mb-2">Upcoming</p>
                            <div className="space-y-1 sm:space-y-2">
                              {[
                                { title: 'Assessment', time: 'Tomorrow', icon: <Target className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#F59E0B]" /> },
                                { title: 'Assignment Due', time: '3 days', icon: <FileText className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#6366F1]" /> }
                              ].map((item, i) => (
                                <div key={i} className="flex items-center gap-1.5 sm:gap-2">
                                  {item.icon}
                                  <div className="flex-1">
                                    <p className="text-[8px] sm:text-[9px] text-white">{item.title}</p>
                                    <p className="text-[7px] sm:text-[8px] text-[#666]">{item.time}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Bottom Navigation */}
                          <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 bg-[#111] rounded-xl sm:rounded-2xl p-1.5 sm:p-2 border border-white/10">
                            <div className="flex justify-around">
                              {[
                                { icon: <Home className="w-3 h-3 sm:w-4 sm:h-4" />, active: true },
                                { icon: <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />, active: false },
                                { icon: <Award className="w-3 h-3 sm:w-4 sm:h-4" />, active: false },
                                { icon: <User className="w-3 h-3 sm:w-4 sm:h-4" />, active: false }
                              ].map((item, i) => (
                                <div key={i} className={`p-1.5 sm:p-2 rounded-lg ${item.active ? 'bg-[#6366F1]/20 text-[#6366F1]' : 'text-[#666]'}`}>
                                  {item.icon}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          <AnimatedGradientDivider className="max-w-7xl mx-auto my-8" />

          {/* STUDENT JOURNEY TIMELINE */}
          <motion.section 
            className={`max-w-7xl mx-auto px-6 py-20 border-t space-y-12 ${
              theme === 'dark' ? 'border-white/10' : 'border-gray-200'
            }`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="text-center space-y-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.span 
                className="text-xs font-bold uppercase tracking-widest text-[#A855F7]"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                End-To-End Roadmap
              </motion.span>
              <h2 className={`text-3xl sm:text-4xl font-extrabold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>The Student Learning Journey</h2>
              <p className={`text-xs sm:text-sm max-w-xl mx-auto ${
                theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
              }`}>
                5 structured milestones converting campus students into hired software engineers.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              {[
                { step: '01', title: 'Register', desc: 'Onboarding & skill diagnostic test', icon: <Compass className="w-5 h-5 text-[#6366F1]" />, color: '#6366F1' },
                { step: '02', title: 'Training', desc: 'Comprehensive live masterclasses', icon: <BookOpen className="w-5 h-5 text-[#A855F7]" />, color: '#A855F7' },
                { step: '03', title: 'Projects', desc: 'Real-world capstone GitHub repos', icon: <Code className="w-5 h-5 text-[#10B981]" />, color: '#10B981' },
                { step: '04', title: 'Assessment', desc: 'Mock interviews & coding evaluations', icon: <Target className="w-5 h-5 text-[#F59E0B]" />, color: '#F59E0B' },
                { step: '05', title: 'Placement', desc: 'Direct corporate campus drives', icon: <Briefcase className="w-5 h-5 text-[#10B981]" />, color: '#10B981' },
              ].map((m, i) => (
                <motion.div 
                  key={i} 
                  onClick={() => setSelectedJourneyStep(selectedJourneyStep === i ? null : i)}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`p-4 rounded-2xl border space-y-2 flex flex-col items-center justify-between cursor-pointer transition-all duration-250 hover:-translate-y-1 ${
                    theme === 'dark' 
                      ? (selectedJourneyStep === i 
                          ? 'bg-[#0A0A0E] border-[rgba(255,255,255,0.15)] shadow-lg' 
                          : 'bg-[#0A0A0E] border-[rgba(255,255,255,0.08)] shadow hover:shadow-lg hover:border-[rgba(255,255,255,0.15)]')
                      : (selectedJourneyStep === i 
                          ? 'bg-white border-[rgba(99,102,241,0.3)] shadow-lg' 
                          : 'bg-white border-[rgba(0,0,0,0.06)] shadow hover:shadow-lg hover:border-[rgba(99,102,241,0.2)]')
                  }`}
                  style={selectedJourneyStep === i ? { 
                    boxShadow: `0 0 30px ${m.color}30, 0 0 60px ${m.color}15`,
                    background: theme === 'dark' ? `${m.color}15` : `${m.color}10`
                  } : {}}
                  whileHover={{ 
                    scale: 1.02,
                    borderColor: m.color
                  }}
                >
                  <motion.span 
                    className={`text-[10px] font-mono font-bold transition-colors ${
                      selectedJourneyStep === i ? 'text-[#6366F1]' : 'text-[#666]'
                    }`}
                    animate={selectedJourneyStep === i ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5, repeat: selectedJourneyStep === i ? Infinity : 0 }}
                  >
                    {m.step}
                  </motion.span>
                  <motion.div 
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      selectedJourneyStep === i ? 'bg-[#6366F1]/20 scale-110' : 'bg-white/5'
                    }`}
                    style={selectedJourneyStep === i ? { 
                      boxShadow: `0 0 20px ${m.color}60`,
                      borderColor: m.color
                    } : {}}
                    animate={selectedJourneyStep === i ? { rotate: [0, 360] } : {}}
                    transition={{ duration: 2, repeat: selectedJourneyStep === i ? Infinity : 0, ease: "linear" }}
                  >
                    <span className={selectedJourneyStep === i ? 'text-[#6366F1]' : ''}>{m.icon}</span>
                  </motion.div>
                  <motion.h3 
                    className={`font-bold text-xs transition-colors ${
                      selectedJourneyStep === i 
                        ? 'text-[#6366F1]' 
                        : (theme === 'dark' ? 'text-white' : 'text-gray-900')
                    }`}
                    animate={selectedJourneyStep === i ? { y: [0, -5, 0] } : {}}
                    transition={{ duration: 1, repeat: selectedJourneyStep === i ? Infinity : 0 }}
                  >
                    {m.title}
                  </motion.h3>
                  <p className={`text-[10px] leading-tight ${
                    theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
                  }`}>{m.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* PLACEMENT PROCESS VERTICAL TIMELINE */}
          <motion.section 
            className={`max-w-6xl mx-auto px-6 py-20 space-y-12 border-t ${
              theme === 'dark' ? 'border-white/10' : 'border-gray-200'
            }`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="text-center space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.span 
                className="text-xs font-bold uppercase tracking-widest text-[#10B981]"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Career Acceleration Journey
              </motion.span>
              <h2 className={`text-3xl sm:text-4xl font-extrabold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>The Placement Process</h2>
              <p className={`text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed ${
                theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
              }`}>
                A structured 6-month career acceleration journey designed to transform students into industry-ready professionals.
              </p>
            </motion.div>

            <div className="relative">
              {/* Gradient Connecting Line */}
              <motion.div 
                className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#6366F1] via-[#A855F7] to-[#10B981] transform -translate-x-1/2 hidden md:block"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ transformOrigin: "top" }}
              />
              
              {/* Mobile Connecting Line */}
              <motion.div 
                className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#6366F1] via-[#A855F7] to-[#10B981] md:hidden"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ transformOrigin: "top" }}
              />

              <div className="space-y-8 md:space-y-12">
                {[
                  {
                    step: 1,
                    title: 'Industry Training Program',
                    icon: <GraduationCap className="w-6 h-6" />,
                    description: 'Students undergo a comprehensive 6-month industry-focused training program covering programming, aptitude, communication, AI tools, real-world projects, Git & GitHub, interview preparation, and professional skills.',
                    badge: '6 Months',
                    color: '#6366F1'
                  },
                  {
                    step: 2,
                    title: 'Final Assessment',
                    icon: <ClipboardCheck className="w-6 h-6" />,
                    description: 'After completing the training program, students must successfully clear a comprehensive technical assessment to qualify for the next stage.',
                    badge: 'Assessment',
                    color: '#A855F7'
                  },
                  {
                    step: 3,
                    title: 'Technical & HR Interview',
                    icon: <Users className="w-6 h-6" />,
                    description: 'Qualified students attend technical and HR interviews conducted by industry experts and hiring partners to evaluate technical knowledge, communication skills, and problem-solving abilities.',
                    badge: 'Interview',
                    color: '#3B82F6'
                  },
                  {
                    step: 4,
                    title: 'Industry Internship',
                    icon: <Briefcase className="w-6 h-6" />,
                    description: 'Selected students begin internships with partner companies, working on live industry projects while gaining real-world corporate experience.',
                    badge: 'Internship',
                    color: '#F59E0B'
                  },
                  {
                    step: 5,
                    title: 'Performance Evaluation',
                    icon: <TrendingUp className="w-6 h-6" />,
                    description: 'Throughout the internship, mentors and company supervisors evaluate each student\'s performance based on technical skills, project delivery, teamwork, communication, attendance, and professionalism.',
                    badge: 'Performance Review',
                    color: '#EC4899'
                  },
                  {
                    step: 6,
                    title: 'Full-Time Placement',
                    icon: <Award className="w-6 h-6" />,
                    description: 'Students who consistently perform well during the internship receive a full-time employment offer from partner companies and officially begin their professional careers.',
                    badge: 'Placement',
                    color: '#10B981'
                  }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx} 
                    className={`relative flex items-center ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: idx * 0.15 }}
                  >
                    {/* Icon Container */}
                    <motion.div 
                      className={`absolute left-6 md:left-1/2 transform md:-translate-x-1/2 w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0 z-10 hover:scale-110 transition-transform duration-300 shadow-lg ${
                        theme === 'dark' ? 'bg-[#0A0A0E]' : 'bg-white'
                      }`}
                      style={{ borderColor: item.color, boxShadow: `0 0 20px ${item.color}40` }}
                      whileHover={{ 
                        scale: 1.15,
                        boxShadow: `0 0 30px ${item.color}60`
                      }}
                      animate={{ 
                        boxShadow: [`0 0 20px ${item.color}40`, `0 0 40px ${item.color}60`, `0 0 20px ${item.color}40`]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <span style={{ color: item.color }}>{item.icon}</span>
                    </motion.div>

                    {/* Content Card */}
                    <div className={`ml-20 md:ml-0 md:w-1/2 ${idx % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                      <motion.div 
                        className={`p-6 rounded-2xl border transition-all duration-250 hover:-translate-y-1 group shadow ${
                          theme === 'dark' 
                            ? 'bg-[#0A0A0E] border-[rgba(255,255,255,0.08)] hover:shadow-lg hover:border-[rgba(255,255,255,0.15)]' 
                            : 'bg-white border-[rgba(0,0,0,0.06)] hover:shadow-lg hover:border-[rgba(99,102,241,0.2)]'
                        }`}
                        whileHover={{ 
                          scale: 1.01,
                          borderColor: item.color
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <motion.div 
                            className={`w-14 h-14 rounded-xl border flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
                              theme === 'dark' 
                                ? 'bg-white/5 border-white/10' 
                                : 'bg-gray-50 border-gray-200'
                            }`}
                            style={{ boxShadow: `0 0 15px ${item.color}30` }}
                            whileHover={{ 
                              backgroundColor: `${item.color}20`,
                              borderColor: item.color,
                              rotate: [0, -10, 10, -10, 0]
                            }}
                            transition={{ duration: 0.5 }}
                          >
                            <span style={{ color: item.color }}>{item.icon}</span>
                          </motion.div>
                          <motion.span 
                            className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                            style={{ backgroundColor: `${item.color}20`, color: item.color, border: `1px solid ${item.color}40` }}
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {item.badge}
                          </motion.span>
                        </div>
                        <motion.h3 
                          className={`text-lg font-bold mb-2 group-hover:text-[#6366F1] transition-colors ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          {item.title}
                        </motion.h3>
                        <p className={`text-xs leading-relaxed ${
                          theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
                        }`}>{item.description}</p>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* FAQ SECTION */}
          <section className={`max-w-4xl mx-auto px-6 py-20 border-t space-y-8 ${
            theme === 'dark' ? 'border-white/10' : 'border-gray-200'
          }`}>
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#6366F1]">Got Questions?</span>
              <h2 className={`text-3xl font-extrabold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Frequently Asked Questions</h2>
            </div>

            <div className="space-y-3">
              {faqList.map((faq, idx) => (
                <div key={idx} className={`rounded-2xl overflow-hidden transition-all duration-250 shadow ${
                  theme === 'dark' 
                    ? 'bg-[#0A0A0E] border-[rgba(255,255,255,0.08)]' 
                    : 'bg-white border-[rgba(0,0,0,0.06)]'
                }`}>
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    className={`w-full p-4 text-left flex items-center justify-between font-bold text-sm transition-colors ${
                      theme === 'dark' 
                        ? 'text-white hover:bg-white/5' 
                        : 'text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${
                      theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
                    } ${openFaqIndex === idx ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaqIndex === idx && (
                    <div className={`px-4 pb-4 pt-1 text-xs leading-relaxed border-t ${
                      theme === 'dark' 
                        ? 'text-[#CCC] border-white/5' 
                        : 'text-gray-700 border-gray-100'
                    }`}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* FINAL CTA */}
          <section className={`max-w-5xl mx-auto px-6 py-16 my-10 rounded-3xl bg-gradient-to-r from-[#6366F1]/20 via-[#A855F7]/20 to-[#10B981]/20 border text-center space-y-6 backdrop-blur-2xl ${
            theme === 'dark' 
              ? 'border-white/15' 
              : 'border-indigo-200'
          }`}>
            <h2 className={`text-3xl sm:text-5xl font-black ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Ready to Build Career-Ready Students?</h2>
            <p className={`text-xs sm:text-sm max-w-xl mx-auto leading-relaxed ${
              theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
            }`}>
              Join leading engineering institutions ready to modernize their academic delivery and campus placement drives.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <button
                onClick={() => setShowDemoModal(true)}
                className="px-8 py-4 bg-[#6366F1] hover:bg-[#5558DD] text-white font-bold rounded-2xl text-xs shadow-xl transition-all"
              >
                Book Institutional Demo
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`px-8 py-4 font-bold rounded-2xl text-xs border transition-all ${
                  theme === 'dark' 
                    ? 'bg-[#111] hover:bg-[#1A1A1A] text-white border-white/10' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300'
                }`}
              >
                Contact HQ Team
              </button>
            </div>
          </section>
        </>
      )}

      {/* ============================================================ */}
      {/* ABOUT PAGE VIEW */}
      {/* ============================================================ */}
      {activeTab === 'about' && (
        <section className="max-w-6xl mx-auto px-6 py-16 space-y-16">
          <motion.div 
            className="text-center space-y-4"
            initial={{ y: 30 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span 
              className="text-xs font-bold uppercase tracking-widest text-[#6366F1]"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              About LearnIT HQ
            </motion.span>
            <h1 className={`text-4xl sm:text-5xl font-black ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Empowering Higher Education</h1>
            <p className={`text-sm max-w-2xl mx-auto leading-relaxed ${
              theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
            }`}>
              LearnIT acts as a bridge between academic education and industry readiness, transforming the way colleges deliver practical, career-focused learning to prepare students for real-world success.
            </p>
          </motion.div>

          {/* Mission, Vision, Values */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ y: 30 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {[
              { 
                title: 'Our Mission', 
                desc: 'To empower students through industry-aligned training, hands-on projects, internships, mentorship, and placement assistance while partnering with colleges to build a highly employable workforce. We deliver practical skill development, career guidance, and continuous upskilling aligned with emerging technologies to strengthen industry-academia engagement.',
                icon: <Target className="w-5 h-5" />,
                color: '#6366F1'
              },
              { 
                title: 'Our Vision', 
                desc: 'To become India\'s most trusted industry-academia platform, bridging the gap between education and employment by empowering every student with future-ready skills, real-world experience, and the confidence to succeed in the global workforce.',
                icon: <Compass className="w-5 h-5" />,
                color: '#A855F7'
              },
              { 
                title: 'Our Values', 
                desc: 'Excellence in education, transparency in operations, and unwavering commitment to student success above all else.',
                icon: <HeartHandshake className="w-5 h-5" />,
                color: '#10B981'
              }
            ].map((item, i) => (
              <div 
                key={i}
                onClick={() => setSelectedAboutCard(selectedAboutCard === i ? null : i)}
                className={`p-6 rounded-2xl border space-y-3 cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${
                  theme === 'dark' 
                    ? (selectedAboutCard === i 
                        ? 'bg-[#0A0A0E] border-white/10 hover:border-white/20' 
                        : 'bg-[#0A0A0E] border-white/10 hover:border-white/20')
                    : (selectedAboutCard === i 
                        ? 'bg-white border-indigo-300 shadow-xl' 
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md')
                }`}
                style={selectedAboutCard === i ? { 
                  boxShadow: `0 0 30px ${item.color}40, 0 0 60px ${item.color}20`,
                  background: `${item.color}10`
                } : {}}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all duration-300 ${
                  selectedAboutCard === i ? 'scale-110' : ''
                }`}
                style={selectedAboutCard === i ? { 
                  backgroundColor: `${item.color}30`,
                  boxShadow: `0 0 20px ${item.color}60`
                } : { backgroundColor: `${item.color}20` }}
                >
                  <span className={selectedAboutCard === i ? 'text-[#6366F1]' : ''} style={{ color: selectedAboutCard === i ? '#6366F1' : item.color }}>
                    {item.icon}
                  </span>
                </div>
                <h3 className={`font-bold text-lg transition-colors ${
                  selectedAboutCard === i 
                    ? 'text-[#6366F1]' 
                    : (theme === 'dark' ? 'text-white' : 'text-gray-900')
                }`}>{item.title}</h3>
                <p className={`text-xs leading-relaxed ${
                  theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
                }`}>{item.desc}</p>
              </div>
            ))}
          </motion.div>

          {/* Leadership Team */}
          <motion.div 
            className={`space-y-6 pt-8 border-t ${
              theme === 'dark' ? 'border-white/10' : 'border-gray-200'
            }`}
            initial={{ y: 30 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.h2 
              className={`text-2xl font-bold text-center ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Executive Leadership Team
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                { name: 'Shiva', role: 'Chief Executive Officer', ex: 'Visionary Leader & Tech Strategist' },
                { name: 'Suresh', role: 'Chief Operating Officer', ex: 'Leads operational strategy, business coordination and organizational execution' },
                { name: 'Vijay', role: 'Head of Placement Operations', ex: 'Focuses on placement coordination, employer engagement and career-readiness initiatives' },
                { name: 'Mohan Ram', role: 'Chief Technology Officer', ex: 'Drives technology strategy, platform development and digital innovation' },
                { name: 'Vayuputra', role: 'Head of Strategic Partnerships', ex: 'Manages corporate relationships, institutional partnerships and business development initiatives' }
              ].map((m, i) => (
                <motion.div 
                  key={i} 
                  className={`p-5 rounded-2xl border text-center space-y-2 ${
                    theme === 'dark' 
                      ? 'bg-[#0A0A0E] border-white/10' 
                      : 'bg-white border-gray-200'
                  }`}
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <motion.div 
                    className={`w-16 h-16 rounded-full border mx-auto flex items-center justify-center font-bold text-lg ${
                      theme === 'dark' 
                        ? 'bg-[#1A1A24] border-white/10 text-white' 
                        : 'bg-gray-100 border-gray-200 text-gray-900'
                    }`}
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {m.name[0]}
                  </motion.div>
                  <h4 className={`font-bold text-sm ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{m.name}</h4>
                  <p className="text-xs text-[#6366F1] font-semibold">{m.role}</p>
                  <p className={`text-[10px] ${
                    theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
                  }`}>{m.ex}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* ============================================================ */}
      {/* PROGRAMS PAGE VIEW */}
      {/* ============================================================ */}
      {activeTab === 'programs' && (
        <section className="max-w-6xl mx-auto px-6 py-16 space-y-10">
          <motion.div 
            className="text-center space-y-3"
            initial={{ y: 30 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span 
              className="text-xs font-bold uppercase tracking-widest text-[#6366F1]"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              Academic Curriculum
            </motion.span>
            <h1 className={`text-4xl font-extrabold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Training Programs & Tracks</h1>
            <p className={`text-xs sm:text-sm max-w-xl mx-auto ${
              theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
            }`}>
              Choose from industry-verified tracks engineered to meet corporate software requirements.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div 
            className={`flex flex-wrap items-center justify-between gap-4 p-3 rounded-2xl border ${
              theme === 'dark' 
                ? 'bg-[#0A0A0E] border-white/10' 
                : 'bg-gray-50 border-gray-200'
            }`}
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex flex-wrap gap-2">
              {['All', 'AI & Data', 'Cloud & DevOps', 'Frontend', 'Backend'].map((cat) => (
                <motion.button
                  key={cat}
                  onClick={() => setProgramCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    programCategory === cat 
                      ? 'bg-[#6366F1] text-white' 
                      : (theme === 'dark' ? 'text-[#AAA] hover:text-white' : 'text-gray-700 hover:text-gray-900')
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
            <span className={`text-xs font-mono ${
              theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
            }`}>{filteredPrograms.length} Tracks Available</span>
          </motion.div>

          {/* Programs Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ y: 30 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {filteredPrograms.map((prog, i) => (
              <motion.div 
                key={prog.id} 
                className={`p-6 rounded-2xl border space-y-4 hover:border-white/20 transition-all flex flex-col justify-between ${
                  theme === 'dark' 
                    ? 'bg-[#0A0A0E] border-white/10 hover:border-white/20' 
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ scale: 1.02, y: -8 }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      theme === 'dark' 
                        ? 'bg-white/5 text-[#A855F7] border-white/10' 
                        : 'bg-gray-100 text-[#A855F7] border-gray-200'
                    }`}>
                      {prog.category}
                    </span>
                    <span className="text-xs font-bold text-[#10B981] font-mono">{prog.avgPackage}</span>
                  </div>

                  <h3 className={`font-bold text-xl ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{prog.title}</h3>
                  <p className={`text-xs leading-relaxed ${
                    theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
                  }`}>{prog.description}</p>

                  <div className={`grid grid-cols-2 gap-2 pt-2 ${
                    theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
                  }`}>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#6366F1]" /> {prog.duration}</span>
                    <span className="flex items-center gap-1.5"><Laptop className="w-3.5 h-3.5 text-[#A855F7]" /> {prog.mode}</span>
                  </div>
                </div>

                <div className={`pt-4 border-t flex items-center justify-between ${
                  theme === 'dark' ? 'border-white/10' : 'border-gray-200'
                }`}>
                  <span className={`text-[11px] ${
                    theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
                  }`}>Level: {prog.level}</span>
                  <motion.button
                    onClick={() => setSelectedProgram(prog)}
                    className="px-4 py-2 bg-[#6366F1] hover:bg-[#5558DD] text-white rounded-xl text-xs font-bold transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Full Syllabus
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* ============================================================ */}
      {/* PLACEMENTS PAGE VIEW */}
      {/* ============================================================ */}
      {activeTab === 'placements' && (
        <section className="max-w-7xl mx-auto px-6 py-16 space-y-16">
          {/* PLACEMENT HERO */}
          <motion.div 
            className="text-center space-y-4"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span 
              className="text-xs font-bold uppercase tracking-widest text-[#10B981]"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              Campus Recruitment
            </motion.span>
            <motion.h1 
              className={`text-4xl sm:text-5xl font-extrabold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Placement Drives & Opportunities
            </motion.h1>
            <motion.p 
              className={`text-sm max-w-2xl mx-auto ${
                theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
              }`}
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Building direct campus recruitment partnerships with leading technology companies to offer competitive packages and career growth opportunities.
            </motion.p>
          </motion.div>

          {/* PLACEMENT STATISTICS */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className={`p-6 rounded-2xl border text-center space-y-2 ${
              theme === 'dark' 
                ? 'bg-[#0A0A0E] border-white/10' 
                : 'bg-white border-gray-200'
            }`}>
              <div className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-[#10B981]' : 'text-[#10B981]'
              }`}>95%+</div>
              <div className={`text-xs font-semibold ${
                theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
              }`}>Overall Placement Rate</div>
            </div>
            <div className={`p-6 rounded-2xl border text-center space-y-2 ${
              theme === 'dark' 
                ? 'bg-[#0A0A0E] border-white/10' 
                : 'bg-white border-gray-200'
            }`}>
              <div className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-[#A855F7]' : 'text-[#A855F7]'
              }`}>Starting</div>
              <div className={`text-xs font-semibold ${
                theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
              }`}>Building Pipeline</div>
            </div>
            <div className={`p-6 rounded-2xl border text-center space-y-2 ${
              theme === 'dark' 
                ? 'bg-[#0A0A0E] border-white/10' 
                : 'bg-white border-gray-200'
            }`}>
              <div className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-[#6366F1]' : 'text-[#6366F1]'
              }`}>Growing</div>
              <div className={`text-xs font-semibold ${
                theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
              }`}>Partner Network</div>
            </div>
            <div className={`p-6 rounded-2xl border text-center space-y-2 ${
              theme === 'dark' 
                ? 'bg-[#0A0A0E] border-white/10' 
                : 'bg-white border-gray-200'
            }`}>
              <div className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-[#F59E0B]' : 'text-[#F59E0B]'
              }`}>₹3–6 LPA</div>
              <div className={`text-xs font-semibold ${
                theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
              }`}>Package Range</div>
            </div>
          </motion.div>

          {/* PARTNER COMPANIES SECTION */}
          <motion.div 
            className="space-y-12"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#10B981]">Corporate Network</span>
              <h1 className={`text-4xl font-extrabold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Partner Companies</h1>
              <p className={`text-xs sm:text-sm max-w-xl mx-auto ${
                theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
              }`}>
                Leading technology companies partnering with LearnIT for campus recruitment and talent acquisition.
              </p>
            </div>

            {/* Hiring Partners Grid */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className={`p-6 rounded-2xl border text-center ${
                theme === 'dark' ? 'bg-[#0A0A0E] border-white/10' : 'bg-white border-gray-200'
              }`}>
                <div className={`text-4xl font-bold mb-2 ${
                  theme === 'dark' ? 'text-[#10B981]' : 'text-[#10B981]'
                }`}>11+</div>
                <p className={`text-sm font-semibold ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
                }`}>Hiring Partners</p>
                <p className={`text-xs mt-2 ${
                  theme === 'dark' ? 'text-[#888]' : 'text-gray-500'
                }`}>Building partnerships with leading companies</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { 
                    name: 'Infosight Consulting', 
                    type: 'IT Consulting & Services',
                    status: 'Hiring Partner',
                    color: '#6366F1'
                  },
                  { 
                    name: 'Shreegenix Intelligence Solution', 
                    type: 'AI & Data Analytics',
                    status: 'Hiring Partner',
                    color: '#A855F7'
                  },
                  { 
                    name: 'Infosight AI', 
                    type: 'Artificial Intelligence',
                    status: 'Hiring Partner',
                    color: '#10B981'
                  }
                ].map((partner, index) => (
                  <motion.div
                    key={index}
                    className={`p-6 rounded-2xl border space-y-4 ${
                      theme === 'dark' 
                        ? 'bg-[#0A0A0E] border-white/10 hover:border-[#6366F1]/30' 
                        : 'bg-white border-gray-200 hover:border-[#6366F1]/30'
                    } transition-all duration-300 hover:shadow-lg`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    whileHover={{ scale: 1.02, y: -4 }}
                  >
                    <div className="flex items-start gap-4">
                      <div 
                        className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg`}
                        style={{ 
                          backgroundColor: theme === 'dark' ? `${partner.color}20` : `${partner.color}10`,
                          color: partner.color
                        }}
                      >
                        {partner.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold text-sm ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>{partner.name}</h3>
                        <p className={`text-xs ${
                          theme === 'dark' ? 'text-[#A855F7]' : 'text-[#6366F1]'
                        }`}>{partner.type}</p>
                      </div>
                    </div>
                    
                    <div className={`pt-4 border-t ${
                      theme === 'dark' ? 'border-white/10' : 'border-gray-200'
                    }`}>
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        theme === 'dark' ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20' : 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20'
                      }`}>
                        {partner.status}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Partnership Benefits */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className={`font-bold text-lg ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Partnership Benefits</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div 
                  className={`p-4 rounded-xl border space-y-2 ${
                    theme === 'dark' ? 'bg-[#0A0A0E] border-white/10' : 'bg-white border-gray-200'
                  }`}
                  whileHover={{ scale: 1.03, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-2">
                    <motion.div 
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Briefcase className="w-5 h-5 text-[#6366F1]" />
                    </motion.div>
                    <h3 className={`font-bold text-sm ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>Direct Campus Access</h3>
                  </div>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
                  }`}>Connect with pre-screened talent from partner engineering institutions with verified skills.</p>
                </motion.div>
                <motion.div 
                  className={`p-4 rounded-xl border space-y-2 ${
                    theme === 'dark' ? 'bg-[#0A0A0E] border-white/10' : 'bg-white border-gray-200'
                  }`}
                  whileHover={{ scale: 1.03, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-2">
                    <motion.div 
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <TrendingUp className="w-5 h-5 text-[#10B981]" />
                    </motion.div>
                    <h3 className={`font-bold text-sm ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>Streamlined Hiring</h3>
                  </div>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
                  }`}>Reduce hiring time with automated candidate screening and verified project portfolios.</p>
                </motion.div>
                <motion.div 
                  className={`p-4 rounded-xl border space-y-2 ${
                    theme === 'dark' ? 'bg-[#0A0A0E] border-white/10' : 'bg-white border-gray-200'
                  }`}
                  whileHover={{ scale: 1.03, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-2">
                    <motion.div 
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Award className="w-5 h-5 text-[#A855F7]" />
                    </motion.div>
                    <h3 className={`font-bold text-sm ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>Quality Talent Pipeline</h3>
                  </div>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
                  }`}>Access graduates with industry-aligned training and hands-on project experience.</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Featured Partner Companies */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className={`font-bold text-lg ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Featured Partners</h2>
              <motion.div 
                className={`p-8 rounded-2xl border text-center ${
                  theme === 'dark' 
                    ? 'bg-[#0A0A0E] border-white/10' 
                    : 'bg-white border-gray-200'
                }`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Building2 className={`w-12 h-12 mx-auto mb-4 ${
                  theme === 'dark' ? 'text-[#6366F1]' : 'text-[#6366F1]'
                }`} />
                <h3 className={`text-lg font-semibold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>No Partner Companies Yet</h3>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
                }`}>
                  Partner companies will be displayed here once approved and published by Super Admin.
                </p>
              </motion.div>
            </motion.div>

            {/* Partnership CTA */}
            <motion.div 
              className={`p-8 rounded-2xl border text-center space-y-4 ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-[#10B981]/10 to-[#6366F1]/10 border-[#10B981]/20' 
                  : 'bg-gradient-to-r from-[#10B981]/5 to-[#6366F1]/5 border-[#10B981]/20'
              }`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
            >
              <h2 className={`text-2xl font-extrabold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Partner With LearnIT</h2>
              <p className={`text-sm max-w-xl mx-auto ${
                theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
              }`}>
                Connect with top engineering talent through our campus recruitment network and streamline your hiring process.
              </p>
              <motion.button
                onClick={() => setShowDemoModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-[#10B981] to-[#6366F1] hover:from-[#059669] hover:to-[#5558DD] text-white rounded-xl text-sm font-bold transition-all duration-250 shadow-lg shadow-[#10B981]/20 hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2 mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Request Partnership <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* ACTIVE PLACEMENT DRIVES */}
          <motion.div 
            className="space-y-6"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <h2 className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Active Placement Drives</h2>
            </div>
            
            <div className="text-center space-y-4 mb-8">
              <p className={`text-sm ${
                theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
              }`}>
                Placement drives will be displayed here once colleges are onboarded and companies start recruitment.
              </p>
              <p className={`text-xs ${
                theme === 'dark' ? 'text-[#888]' : 'text-gray-500'
              }`}>
                Currently building partnerships with companies for campus recruitment.
              </p>
            </div>
          </motion.div>

          {/* PLACEMENT SUCCESS STORIES */}
          <motion.div 
            className="space-y-6"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="text-center space-y-2">
              <h2 className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Placement Success Stories</h2>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
              }`}>Success stories will be featured here as students get placed through our platform.</p>
            </div>
          </motion.div>
        </section>
      )}

      {/* ============================================================ */}
      {/* PARTNER COLLEGES PAGE VIEW */}
      {/* ============================================================ */}
      {activeTab === 'colleges' && (
        <section className="max-w-6xl mx-auto px-6 py-16 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#10B981]">TRUST & CREDIBILITY</span>
            <h1 className={`text-4xl font-extrabold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Colleges Already Partnering With Us</h1>
            <p className={`text-xs sm:text-sm max-w-xl mx-auto ${
              theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
            }`}>
              The reason these campuses trust us with their students: real industry training, and real placements.
            </p>
          </div>

          {/* Placement Highlight Banner */}
          <motion.div 
            className={`p-6 rounded-2xl border text-center ${
              theme === 'dark' ? 'bg-[#0A0A0E] border-white/10' : 'bg-white border-gray-200'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className={`text-4xl font-bold mb-2 ${
              theme === 'dark' ? 'text-[#10B981]' : 'text-[#10B981]'
            }`}>25+</div>
            <p className={`text-sm font-semibold ${
              theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
            }`}>Successful student placements</p>
            <p className={`text-xs mt-2 ${
              theme === 'dark' ? 'text-[#888]' : 'text-gray-500'
            }`}>Across our partner campuses — and growing</p>
          </motion.div>

          {/* Partner College Cards */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: 'Gandhi Education Trust',
                  location: 'Davangere',
                  detail: 'Estd. 2014',
                  color: '#6366F1',
                  initial: 'G'
                },
                {
                  name: 'Davanagere Institute of Advanced Management Studies',
                  detail: 'Spurthi Educational Trust',
                  location: 'Davangere',
                  color: '#A855F7',
                  initial: 'D'
                },
                {
                  name: 'Dr. C.V. Raman Educational Association',
                  detail: 'Registered Trust',
                  location: 'Bengaluru',
                  color: '#10B981',
                  initial: 'C'
                }
              ].map((college, index) => (
                <motion.div
                  key={index}
                  className={`p-6 rounded-2xl border space-y-4 ${
                    theme === 'dark' 
                      ? 'bg-[#0A0A0E] border-white/10 hover:border-[#6366F1]/30' 
                      : 'bg-white border-gray-200 hover:border-[#6366F1]/30'
                  } transition-all duration-300 hover:shadow-lg`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02, y: -4 }}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div 
                      className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl`}
                      style={{ 
                        backgroundColor: theme === 'dark' ? `${college.color}20` : `${college.color}10`,
                        color: college.color
                      }}
                    >
                      {college.initial}
                    </div>
                    <div>
                      <h3 className={`font-bold text-sm mb-1 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{college.name}</h3>
                      <p className={`text-xs ${
                        theme === 'dark' ? 'text-[#A855F7]' : 'text-[#6366F1]'
                      }`}>{college.detail}</p>
                      {college.location && (
                        <p className={`text-xs mt-1 flex items-center justify-center gap-1 ${
                          theme === 'dark' ? 'text-[#888]' : 'text-gray-500'
                        }`}>
                          <MapPin className="w-3 h-3" /> {college.location}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Partnership Benefits */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className={`font-bold text-lg ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Partnership Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div 
                className={`p-4 rounded-xl border space-y-2 ${
                  theme === 'dark' ? 'bg-[#0A0A0E] border-white/10' : 'bg-white border-gray-200'
                }`}
                whileHover={{ scale: 1.03, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2">
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <GraduationCap className="w-5 h-5 text-[#6366F1]" />
                  </motion.div>
                  <h3 className={`font-bold text-sm ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Industry-Aligned Curriculum</h3>
                </div>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
                }`}>Courses designed with industry professionals to ensure real-world relevance.</p>
              </motion.div>
              <motion.div 
                className={`p-4 rounded-xl border space-y-2 ${
                  theme === 'dark' ? 'bg-[#0A0A0E] border-white/10' : 'bg-white border-gray-200'
                }`}
                whileHover={{ scale: 1.03, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2">
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Users className="w-5 h-5 text-[#10B981]" />
                  </motion.div>
                  <h3 className={`font-bold text-sm ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Expert Mentor Network</h3>
                </div>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
                }`}>Certified industry mentors provide live sessions and code reviews on campus.</p>
              </motion.div>
              <motion.div 
                className={`p-4 rounded-xl border space-y-2 ${
                  theme === 'dark' ? 'bg-[#0A0A0E] border-white/10' : 'bg-white border-gray-200'
                }`}
                whileHover={{ scale: 1.03, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2">
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Briefcase className="w-5 h-5 text-[#A855F7]" />
                  </motion.div>
                  <h3 className={`font-bold text-sm ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Placement Collaboration</h3>
                </div>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
                }`}>Direct access to corporate recruitment drives and hiring partners.</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Partnership CTA */}
          <motion.div 
            className={`p-8 rounded-2xl border text-center space-y-4 ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-[#6366F1]/10 to-[#A855F7]/10 border-[#6366F1]/20' 
                : 'bg-gradient-to-r from-[#6366F1]/5 to-[#A855F7]/5 border-[#6366F1]/20'
            }`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            <h2 className={`text-2xl font-extrabold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Partner With LearnIT</h2>
            <p className={`text-sm max-w-xl mx-auto ${
              theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
            }`}>
              Transform your institution's technical education with industry-aligned curriculum, expert mentorship, and placement support.
            </p>
            <motion.button
              onClick={() => setShowDemoModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-[#6366F1] to-[#A855F7] hover:from-[#5558DD] hover:to-[#9333EA] text-white rounded-xl text-sm font-bold transition-all duration-250 shadow-lg shadow-[#6366F1]/20 hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Request Partnership <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </section>
      )}

      {/* ============================================================ */}
      {/* RESOURCES & BLOG PAGE VIEW */}
      {/* ============================================================ */}
      {activeTab === 'resources' && (
        <section className="max-w-6xl mx-auto px-6 py-16 space-y-10">
          <motion.div 
            className="text-center space-y-3"
            initial={{ y: 30 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span 
              className="text-xs font-bold uppercase tracking-widest text-[#6366F1]"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              Knowledge Hub
            </motion.span>
            <h1 className={`text-4xl font-extrabold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Resources & Articles</h1>
            <p className={`text-xs sm:text-sm max-w-xl mx-auto ${
              theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
            }`}>
              Insights on higher ed technology, QR roll call architecture, and placement analytics.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ y: 30 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {articlesList.map((art, i) => (
              <motion.div 
                key={art.id} 
                className={`p-6 rounded-2xl border space-y-3 flex flex-col justify-between ${
                  theme === 'dark' 
                    ? 'bg-[#0A0A0E] border-white/10' 
                    : 'bg-white border-gray-200'
                }`}
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ scale: 1.02, y: -8 }}
              >
                <div className="space-y-2">
                  <div className={`flex items-center justify-between text-[10px] ${
                    theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
                  }`}>
                    <span className="text-[#A855F7] font-bold">{art.category}</span>
                    <span>{art.readTime}</span>
                  </div>
                  <h3 className={`font-bold text-base leading-snug ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{art.title}</h3>
                  <p className={`text-xs leading-relaxed ${
                    theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
                  }`}>{art.summary}</p>
                </div>

                <div className={`pt-4 border-t flex items-center justify-between text-xs ${
                  theme === 'dark' ? 'border-white/10' : 'border-gray-200'
                }`}>
                  <span className={theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'}>{art.date}</span>
                  <motion.button
                    onClick={() => setSelectedArticle(art)}
                    className="text-[#6366F1] font-bold hover:underline flex items-center gap-1"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Read Article <ArrowRight className="w-3 h-3" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* ============================================================ */}
      {/* CONTACT PAGE VIEW */}
      {/* ============================================================ */}
      {activeTab === 'contact' && (
        <section className="max-w-6xl mx-auto px-6 py-16 space-y-12">
          <motion.div 
            className="text-center space-y-3"
            initial={{ y: 30 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span 
              className="text-xs font-bold uppercase tracking-widest text-[#6366F1]"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              Get In Touch
            </motion.span>
            <h1 className={`text-4xl font-extrabold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Contact Us</h1>
            <p className={`text-xs sm:text-sm max-w-xl mx-auto ${
              theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
            }`}>
              Connect with our institutional partnership team for campus onboarding & demos.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            initial={{ y: 30 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Contact Details & Office */}
            <div className="space-y-6">
              <motion.div 
                className={`p-6 rounded-2xl border space-y-4 ${
                  theme === 'dark' 
                    ? 'bg-[#0A0A0E] border-white/10' 
                    : 'bg-white border-gray-200'
                }`}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <h3 className={`font-bold text-lg ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Zentrix</h3>
                <div className={`space-y-3 text-xs ${
                  theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
                }`}>
                  <p className="flex items-start gap-3"><MapPin className="w-4 h-4 text-[#6366F1] mt-0.5 flex-shrink-0" /> <span>No. 10, Park Road, 2nd Street<br />Maduravoyal<br />Chennai, Tamil Nadu - 600095<br />India</span></p>
                  <p className="flex items-center gap-3"><Phone className="w-4 h-4 text-[#10B981]" /> +91 7200574426</p>
                  <p className="flex items-center gap-3"><Mail className="w-4 h-4 text-[#A855F7]" /> zentrix.coo@gmail.com</p>
                  <p className="flex items-center gap-3"><Clock className="w-4 h-4 text-[#F59E0B]" /> 9:00 AM – 5:00 PM</p>
                </div>
              </motion.div>

              {/* Office Location Info */}
              <motion.div 
                className={`p-6 rounded-2xl border h-48 flex items-center justify-center text-center ${
                  theme === 'dark' 
                    ? 'bg-[#0A0A0E] border-white/10' 
                    : 'bg-white border-gray-200'
                }`}
                whileHover={{ scale: 1.02 }}
              >
                <div className="space-y-2">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Building className="w-8 h-8 text-[#6366F1] mx-auto" />
                  </motion.div>
                  <p className={`text-xs font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Zentrix Headquarters</p>
                  <p className={`text-[10px] ${
                    theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
                  }`}>Maduravoyal, Chennai, Tamil Nadu</p>
                </div>
              </motion.div>
            </div>

            {/* Contact Form */}
            <motion.div 
              className={`p-6 rounded-2xl border space-y-4 ${
                theme === 'dark' 
                  ? 'bg-[#0A0A0E] border-white/10' 
                  : 'bg-white border-gray-200'
              }`}
              whileHover={{ scale: 1.01 }}
            >
              <h3 className={`font-bold text-lg ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Send Us a Message</h3>

              {contactSubmitted ? (
                <div className="p-8 text-center space-y-3 bg-[#10B981]/10 rounded-xl border border-[#10B981]/20">
                  <Check className="w-8 h-8 text-[#10B981] mx-auto" />
                  <h4 className={`font-bold text-base ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Message Sent Successfully</h4>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
                  }`}>Our institutional representative will respond within 12 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className={`font-bold block mb-1 ${
                      theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
                    }`}>Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dean Rajesh Kumar"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className={`w-full rounded-xl p-3 focus:outline-none focus:border-[#6366F1] ${
                        theme === 'dark' 
                          ? 'bg-[#111] border-white/10 text-white' 
                          : 'bg-gray-50 border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`font-bold block mb-1 ${
                      theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
                    }`}>Official Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="admin@college.edu"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className={`w-full rounded-xl p-3 focus:outline-none focus:border-[#6366F1] ${
                        theme === 'dark' 
                          ? 'bg-[#111] border-white/10 text-white' 
                          : 'bg-gray-50 border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`font-bold block mb-1 ${
                      theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
                    }`}>Message / Inquiry *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Specify your campus requirements..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className={`w-full rounded-xl p-3 focus:outline-none focus:border-[#6366F1] ${
                        theme === 'dark' 
                          ? 'bg-[#111] border-white/10 text-white' 
                          : 'bg-gray-50 border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#6366F1] hover:bg-[#5558DD] text-white font-bold rounded-xl text-xs transition-all shadow-md"
                  >
                    Send Inquiry
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        </section>
      )}

      {/* ARTICLE READER MODAL */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto ${
            theme === 'dark' 
              ? 'bg-[#0A0A0E] border-white/15' 
              : 'bg-white border-gray-200'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              theme === 'dark' ? 'border-white/10' : 'border-gray-200'
            }`}>
              <span className="text-xs font-bold text-[#A855F7]">{selectedArticle.category}</span>
              <button onClick={() => setSelectedArticle(null)} className={`p-1 ${
                theme === 'dark' ? 'text-[#AAA] hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <h2 className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>{selectedArticle.title}</h2>
            <div className={`flex items-center gap-3 text-xs ${
              theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
            }`}>
              <span>By {selectedArticle.author}</span>
              <span>•</span>
              <span>{selectedArticle.date}</span>
            </div>
            <p className={`text-xs leading-relaxed pt-2 ${
              theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
            }`}>{selectedArticle.content}</p>
            <div className={`pt-4 border-t flex justify-end ${
              theme === 'dark' ? 'border-white/10' : 'border-gray-200'
            }`}>
              <button onClick={() => setSelectedArticle(null)} className={`px-4 py-2 rounded-xl text-xs font-bold ${
                theme === 'dark' 
                  ? 'bg-[#1A1A1A] text-white' 
                  : 'bg-gray-100 text-gray-900'
              }`}>
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROGRAM DETAILS MODAL */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className={`border rounded-2xl max-w-2xl w-full my-8 shadow-2xl ${
            theme === 'dark' 
              ? 'bg-[#0A0A0E] border-white/15' 
              : 'bg-white border-gray-200'
          }`}>
            {/* Fixed Header with Close Button */}
            <div className={`sticky top-0 z-10 flex items-center justify-between p-6 pb-4 border-b ${
              theme === 'dark' ? 'bg-[#0A0A0E] border-white/10' : 'bg-white border-gray-200'
            }`}>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A855F7]">{selectedProgram.category}</span>
                <h3 className={`font-bold text-xl ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{selectedProgram.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedProgram(null)} 
                className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${
                  theme === 'dark' ? 'text-[#AAA] hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
              <p className={`text-xs leading-relaxed ${
                theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
              }`}>{selectedProgram.description}</p>

              <div className={`grid grid-cols-2 gap-4 text-xs p-4 rounded-xl border ${
                theme === 'dark' 
                  ? 'bg-[#050505] border-white/10' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div>
                  <span className={`block ${
                    theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
                  }`}>Duration</span>
                  <strong className={`font-mono ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{selectedProgram.duration}</strong>
                </div>
                <div>
                  <span className={`block ${
                    theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
                  }`}>Target CTC Range</span>
                  <strong className="text-[#10B981] font-mono">{selectedProgram.avgPackage}</strong>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className={`font-bold text-xs uppercase tracking-wider ${
                  theme === 'dark' ? 'text-white text-[#CCC]' : 'text-gray-900 text-gray-700'
                }`}>Curriculum Structure</h4>
                <div className="space-y-4">
                  {selectedProgram.phases.map((phase, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border space-y-3 ${
                      theme === 'dark' 
                        ? 'bg-[#111] border-white/10' 
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className={`font-bold text-sm flex items-center gap-2 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        <div className="w-6 h-6 rounded-full bg-[#6366F1] text-white flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </div>
                        {phase.name}
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <p className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${
                            theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
                          }`}>Topics Covered</p>
                          <div className="flex flex-wrap gap-1.5">
                            {phase.topics.map((topic, topicIdx) => (
                              <span key={topicIdx} className={`text-[10px] px-2 py-1 rounded-lg ${
                                theme === 'dark' 
                                  ? 'bg-[#0A0A0E] text-[#CCC] border border-white/5' 
                                  : 'bg-white text-gray-700 border border-gray-300'
                              }`}>
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <p className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${
                            theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
                          }`}>Tools & Technologies</p>
                          <div className="flex flex-wrap gap-1.5">
                            {phase.tools.map((tool, toolIdx) => (
                              <span key={toolIdx} className={`text-[10px] px-2 py-1 rounded-lg flex items-center gap-1 ${
                                theme === 'dark' 
                                  ? 'bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20' 
                                  : 'bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/30'
                              }`}>
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className={`pt-2 mt-2 border-t ${
                          theme === 'dark' ? 'border-white/5' : 'border-gray-300'
                        }`}>
                          <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${
                            theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
                          }`}>Phase Project</p>
                          <p className={`text-xs flex items-start gap-1.5 ${
                            theme === 'dark' ? 'text-[#A855F7]' : 'text-[#A855F7]'
                          }`}>
                            <Sparkles className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                            {phase.phaseProject}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className={`p-4 rounded-xl border mt-4 ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-br from-[#6366F1]/10 to-[#A855F7]/10 border-[#6366F1]/30' 
                    : 'bg-gradient-to-br from-[#6366F1]/10 to-[#A855F7]/10 border-[#6366F1]/30'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#6366F1] to-[#A855F7] text-white flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <p className={`text-sm font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>Final Capstone Project</p>
                  </div>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
                  }`}>{selectedProgram.capstone}</p>
                </div>
              </div>
            </div>

            {/* Fixed Footer with Buttons */}
            <div className={`sticky bottom-0 flex justify-end gap-3 p-6 pt-4 border-t ${
              theme === 'dark' ? 'bg-[#0A0A0E] border-white/10' : 'bg-white border-gray-200'
            }`}>
              <button onClick={() => setSelectedProgram(null)} className={`px-4 py-2 rounded-xl text-xs font-semibold ${
                theme === 'dark' 
                  ? 'bg-[#1A1A1A] text-white hover:bg-[#222]' 
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}>
                Close
              </button>
              <button
                onClick={() => { setSelectedProgram(null); setShowDemoModal(true); }}
                className="px-5 py-2 bg-[#6366F1] hover:bg-[#5558DD] text-white rounded-xl text-xs font-bold"
              >
                Enroll Campus Batch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REQUEST DEMO MODAL */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 ${
            theme === 'dark' 
              ? 'bg-[#0A0A0E] border-white/15' 
              : 'bg-white border-gray-200'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              theme === 'dark' ? 'border-white/10' : 'border-gray-200'
            }`}>
              <h3 className={`font-bold text-base ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Request Institutional Demo</h3>
              <button onClick={() => setShowDemoModal(false)} className={`p-1 ${
                theme === 'dark' ? 'text-[#AAA] hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {demoSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className={`font-bold text-base ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Demo Request Submitted!</h4>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
                }`}>Our LearnIT institutional partnership team will contact your administration within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit} className="space-y-3 text-xs">
                <div>
                  <label className={`font-bold block mb-1 ${
                    theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
                  }`}>Engineering College Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. St. Xavier's Institute of Tech"
                    value={demoForm.collegeName}
                    onChange={(e) => setDemoForm({ ...demoForm, collegeName: e.target.value })}
                    className={`w-full rounded-xl p-2.5 focus:outline-none focus:border-[#6366F1] ${
                      theme === 'dark' 
                        ? 'bg-[#111] border-white/10 text-white' 
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`font-bold block mb-1 ${
                    theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
                  }`}>Contact Person & Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Prof. Rajesh Kumar (HOD / TPO)"
                    value={demoForm.contactPerson}
                    onChange={(e) => setDemoForm({ ...demoForm, contactPerson: e.target.value })}
                    className={`w-full rounded-xl p-2.5 focus:outline-none focus:border-[#6366F1] ${
                      theme === 'dark' 
                        ? 'bg-[#111] border-white/10 text-white' 
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={`font-bold block mb-1 ${
                      theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
                    }`}>Official Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="admin@college.edu"
                      value={demoForm.email}
                      onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                      className={`w-full rounded-xl p-2.5 focus:outline-none focus:border-[#6366F1] ${
                        theme === 'dark' 
                          ? 'bg-[#111] border-white/10 text-white' 
                          : 'bg-gray-50 border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`font-bold block mb-1 ${
                      theme === 'dark' ? 'text-[#AAA]' : 'text-gray-600'
                    }`}>Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={demoForm.phone}
                      onChange={(e) => setDemoForm({ ...demoForm, phone: e.target.value })}
                      className={`w-full rounded-xl p-2.5 focus:outline-none focus:border-[#6366F1] ${
                        theme === 'dark' 
                          ? 'bg-[#111] border-white/10 text-white' 
                          : 'bg-gray-50 border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`font-bold block mb-1 ${
                    theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
                  }`}>Estimated Student Count</label>
                  <select
                    value={demoForm.studentCount}
                    onChange={(e) => setDemoForm({ ...demoForm, studentCount: e.target.value })}
                    className={`w-full rounded-xl p-2.5 ${
                      theme === 'dark' 
                        ? 'bg-[#111] border-white/10 text-white' 
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="100-300">100 - 300 Students</option>
                    <option value="300-500">300 - 500 Students</option>
                    <option value="500-1000">500 - 1,000 Students</option>
                    <option value="1000+">1,000+ Students</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#6366F1] hover:bg-[#5558DD] text-white font-bold rounded-xl text-xs mt-2 transition-all shadow-md"
                >
                  Submit Demo Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <motion.footer 
        className={`border-t py-12 mt-20 transition-colors duration-250 ${
          theme === 'dark' ? 'border-[rgba(255,255,255,0.08)] bg-[rgba(13,13,20,0.8)]' : 'border-[rgba(0,0,0,0.06)] bg-[rgba(248,250,252,0.8)]'
        }`}
        initial={{ y: 30 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <motion.div 
            className="space-y-3"
            initial={{ x: -30 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 rounded-none bg-white flex items-center justify-center text-white font-bold text-xs overflow-hidden shadow-sm">
                <img src="/logo.png" alt="LearnIT Logo" className="w-full h-full object-contain" />
              </div>
              <span className={`font-bold text-sm ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>LearnIT HQ</span>
            </motion.div>
            <p className={`leading-relaxed ${
              theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
            }`}>
              Enterprise higher education software infrastructure empowering partner engineering campuses with automated learning and placement drives.
            </p>
          </motion.div>

          <motion.div 
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h5 className={`font-bold mb-3 uppercase tracking-wider text-[11px] ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Training Tracks</h5>
            <ul className="space-y-2">
              {['Full-Stack Software Engineering', 'Applied AI & Data Science', 'Cloud DevOps Architecture', 'Modern Web Development'].map((track, i) => (
                <motion.li 
                  key={i}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <button 
                    onClick={() => setActiveTab('programs')} 
                    className={`transition-colors duration-250 ${
                      theme === 'dark' ? 'text-[#CCC] hover:text-white' : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    {track}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ x: 30 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h5 className={`font-bold mb-3 uppercase tracking-wider text-[11px] ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>HQ Contact</h5>
            <p className={`space-y-1 ${
              theme === 'dark' ? 'text-[#CCC]' : 'text-gray-700'
            }`}>
              <span className={`block ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Zentrix</span>
              <span className="block">No. 10, Park Road, 2nd Street</span>
              <span className="block">Maduravoyal, Chennai</span>
              <span className="block">Tamil Nadu - 600095, India</span>
              <motion.span 
                className="block text-[#6366F1] cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                zentrix.coo@gmail.com
              </motion.span>
            </p>
          </motion.div>
        </div>

        <motion.div 
          className={`max-w-6xl mx-auto pt-8 mt-8 border-t flex flex-col sm:flex-row items-center justify-between text-[11px] transition-colors duration-250 ${
            theme === 'dark' 
              ? 'border-[rgba(255,255,255,0.05)] text-[#AAA]' 
              : 'border-[rgba(0,0,0,0.06)] text-gray-600'
          }`}
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p> 2026 LearnIT HQ Platform. All rights reserved. Enterprise Academic Standards Compliant.</p>
          <div className="flex gap-4 mt-2 sm:mt-0">
            {['Privacy Policy', 'Terms of Service', 'Security Standards'].map((link, i) => (
              <motion.span 
                key={i}
                className={`transition-colors duration-250 cursor-pointer ${
                  theme === 'dark' ? 'hover:text-white' : 'hover:text-gray-900'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {link}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </motion.footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={(role) => {
          onAccessErp(role);
        }}
      />

    </div>
  );
};
