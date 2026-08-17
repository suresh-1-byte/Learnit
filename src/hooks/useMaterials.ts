/**
 * Custom hook for managing study materials
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Material,
  createMaterial,
  getMaterialsByMentor,
  getMaterialsByClass,
  updateMaterial,
  deleteMaterial,
  incrementMaterialViewCount,
  searchMaterials
} from '../services/firebase/materials.service';

export const useMaterials = (classId?: string) => {
  const { userProfile } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch materials when component mounts or dependencies change
  useEffect(() => {
    if (userProfile?.id) {
      fetchMaterials();
    }
  }, [userProfile?.id, classId]);

  const fetchMaterials = async () => {
    if (!userProfile?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      let fetchedMaterials: Material[];
      if (classId) {
        fetchedMaterials = await getMaterialsByClass(classId);
      } else {
        fetchedMaterials = await getMaterialsByMentor(userProfile.id);
      }
      
      setMaterials(fetchedMaterials);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch materials');
      console.error('Error fetching materials:', err);
    } finally {
      setLoading(false);
    }
  };

  const addMaterial = async (
    materialData: Omit<Material, 'id' | 'createdAt' | 'updatedAt' | 'fileUrl' | 'fileName' | 'fileSize' | 'viewCount'>,
    file: File
  ) => {
    try {
      setError(null);
      const materialId = await createMaterial(materialData, file);
      await fetchMaterials(); // Refresh the list
      return materialId;
    } catch (err: any) {
      setError(err.message || 'Failed to create material');
      console.error('Error creating material:', err);
      throw err;
    }
  };

  const updateMaterialData = async (
    materialId: string,
    updates: Partial<Material>,
    newFile?: File
  ) => {
    try {
      setError(null);
      await updateMaterial(materialId, updates, newFile);
      await fetchMaterials(); // Refresh the list
    } catch (err: any) {
      setError(err.message || 'Failed to update material');
      console.error('Error updating material:', err);
      throw err;
    }
  };

  const removeMaterial = async (materialId: string) => {
    try {
      setError(null);
      await deleteMaterial(materialId);
      await fetchMaterials(); // Refresh the list
    } catch (err: any) {
      setError(err.message || 'Failed to delete material');
      console.error('Error deleting material:', err);
      throw err;
    }
  };

  const trackView = async (materialId: string) => {
    try {
      await incrementMaterialViewCount(materialId);
      // Update local state
      setMaterials(prev => prev.map(m => 
        m.id === materialId 
          ? { ...m, viewCount: (m.viewCount || 0) + 1 }
          : m
      ));
    } catch (err: any) {
      console.error('Error tracking view:', err);
      // Don't throw error for view tracking
    }
  };

  const search = async (searchTerm: string) => {
    if (!userProfile?.id) return [];
    
    try {
      setError(null);
      const results = await searchMaterials(userProfile.id, searchTerm);
      return results;
    } catch (err: any) {
      setError(err.message || 'Failed to search materials');
      console.error('Error searching materials:', err);
      return [];
    }
  };

  return {
    materials,
    loading,
    error,
    fetchMaterials,
    addMaterial,
    updateMaterialData,
    removeMaterial,
    trackView,
    search
  };
};
