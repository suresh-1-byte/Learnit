/**
 * Study Materials Service
 * Handles all Firestore operations for study materials (PDFs, Videos, Slides, etc.)
 */

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { db, storage } from '../../config/firebase';

export interface Material {
  id: string;
  title: string;
  description?: string;
  type: 'Video' | 'PDF' | 'Slides' | 'Code Sandbox' | 'Document';
  classId: string;
  className?: string;
  mentorId: string;
  mentorName: string;
  fileUrl: string;
  fileName: string;
  fileSize?: number; // in bytes
  durationOrPages?: string; // e.g., "45 mins" or "20 pages"
  topic?: string;
  tags?: string[];
  uploadedAt: string;
  createdAt: string;
  updatedAt: string;
  viewCount?: number;
}

const MATERIALS_COLLECTION = 'materials';

/**
 * Upload material file to Firebase Storage
 */
export const uploadMaterialFile = async (
  file: File,
  materialId: string,
  mentorId: string
): Promise<{ url: string; name: string; size: number }> => {
  try {
    const storageRef = ref(storage, `materials/${mentorId}/${materialId}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    
    return {
      url,
      name: file.name,
      size: file.size
    };
  } catch (error) {
    console.error('Error uploading material file:', error);
    throw error;
  }
};

/**
 * Create a new study material
 */
export const createMaterial = async (
  materialData: Omit<Material, 'id' | 'createdAt' | 'updatedAt' | 'fileUrl' | 'fileName' | 'fileSize' | 'viewCount'>,
  file: File
): Promise<string> => {
  try {
    // Create material document first to get ID
    const docRef = await addDoc(collection(db, MATERIALS_COLLECTION), {
      ...materialData,
      viewCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Upload file to Storage
    const { url, name, size } = await uploadMaterialFile(file, docRef.id, materialData.mentorId);
    
    // Update document with file details
    await updateDoc(docRef, {
      fileUrl: url,
      fileName: name,
      fileSize: size
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating material:', error);
    throw error;
  }
};

/**
 * Get material by ID
 */
export const getMaterialById = async (materialId: string): Promise<Material | null> => {
  try {
    const docRef = doc(db, MATERIALS_COLLECTION, materialId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString()
      } as Material;
    }
    return null;
  } catch (error) {
    console.error('Error getting material:', error);
    throw error;
  }
};

/**
 * Get all materials for a mentor
 */
export const getMaterialsByMentor = async (mentorId: string): Promise<Material[]> => {
  try {
    const q = query(
      collection(db, MATERIALS_COLLECTION),
      where('mentorId', '==', mentorId)
    );
    
    const querySnapshot = await getDocs(q);
    const materials: Material[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      materials.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString()
      } as Material);
    });
    
    // Sort in memory to avoid index requirement
    return materials.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('Error getting materials:', error);
    throw error;
  }
};

/**
 * Get materials for a class
 */
export const getMaterialsByClass = async (classId: string): Promise<Material[]> => {
  try {
    const q = query(
      collection(db, MATERIALS_COLLECTION),
      where('classId', '==', classId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const materials: Material[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      materials.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString()
      } as Material);
    });
    
    return materials;
  } catch (error) {
    console.error('Error getting class materials:', error);
    throw error;
  }
};

/**
 * Update a material
 */
export const updateMaterial = async (
  materialId: string,
  updates: Partial<Material>,
  newFile?: File
): Promise<void> => {
  try {
    const updateData: any = {
      ...updates,
      updatedAt: serverTimestamp()
    };
    
    // Upload new file if provided
    if (newFile) {
      const material = await getMaterialById(materialId);
      if (material) {
        const { url, name, size } = await uploadMaterialFile(newFile, materialId, material.mentorId);
        updateData.fileUrl = url;
        updateData.fileName = name;
        updateData.fileSize = size;
        
        // Delete old file from storage
        if (material.fileUrl) {
          try {
            const oldFileRef = ref(storage, material.fileUrl);
            await deleteObject(oldFileRef);
          } catch (error) {
            console.warn('Could not delete old file:', error);
          }
        }
      }
    }
    
    const docRef = doc(db, MATERIALS_COLLECTION, materialId);
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating material:', error);
    throw error;
  }
};

/**
 * Delete a material
 */
export const deleteMaterial = async (materialId: string): Promise<void> => {
  try {
    // Get material to find file URL
    const material = await getMaterialById(materialId);
    
    // Delete file from storage if exists
    if (material?.fileUrl) {
      try {
        const fileRef = ref(storage, material.fileUrl);
        await deleteObject(fileRef);
      } catch (error) {
        console.warn('Could not delete material file:', error);
      }
    }
    
    // Delete material document
    const docRef = doc(db, MATERIALS_COLLECTION, materialId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting material:', error);
    throw error;
  }
};

/**
 * Increment view count for a material
 */
export const incrementMaterialViewCount = async (materialId: string): Promise<void> => {
  try {
    const material = await getMaterialById(materialId);
    if (material) {
      const docRef = doc(db, MATERIALS_COLLECTION, materialId);
      await updateDoc(docRef, {
        viewCount: (material.viewCount || 0) + 1,
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error incrementing view count:', error);
    throw error;
  }
};

/**
 * Search materials by title or tags
 */
export const searchMaterials = async (
  mentorId: string,
  searchTerm: string
): Promise<Material[]> => {
  try {
    // Get all materials for mentor
    const materials = await getMaterialsByMentor(mentorId);
    
    // Filter by search term (case-insensitive)
    const term = searchTerm.toLowerCase();
    return materials.filter(material => 
      material.title.toLowerCase().includes(term) ||
      material.description?.toLowerCase().includes(term) ||
      material.topic?.toLowerCase().includes(term) ||
      material.tags?.some(tag => tag.toLowerCase().includes(term))
    );
  } catch (error) {
    console.error('Error searching materials:', error);
    throw error;
  }
};
