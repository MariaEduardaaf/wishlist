import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export type Category = 'material' | 'dates' | 'places' | 'food' | 'other';

export const CATEGORIES: { id: Category; label: string; color: string }[] = [
    { id: 'material', label: 'categoryMaterial', color: '#dc2626' },
    { id: 'dates', label: 'categoryDates', color: '#ea580c' },
    { id: 'places', label: 'categoryPlaces', color: '#ca8a04' },
    { id: 'food', label: 'categoryFood', color: '#16a34a' },
    { id: 'other', label: 'categoryOther', color: '#2563eb' },
];

export interface WishlistItem {
  id: string;
  title: string;
  category: Category;
  link?: string;
  price?: string;
  image?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  created_at: string;
}

export const useWishlist = () => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load items from Supabase
  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setItems(data || []);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addWish = async (newItem: Omit<WishlistItem, 'id' | 'created_at' | 'status'>) => {
    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .insert([
          {
            ...newItem,
            status: 'pending',
            priority: newItem.priority || 'medium'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setItems(prev => [data, ...prev]);
    } catch (error) {
      console.error('Error adding wish:', error);
      throw error;
    }
  };

  const toggleWishStatus = async (id: string) => {
    try {
      // Find current item
      const item = items.find(i => i.id === id);
      if (!item) return;

      const newStatus = item.status === 'pending' ? 'completed' : 'pending';

      const { error } = await supabase
        .from('wishlist_items')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      console.error('Error toggling wish status:', error);
      throw error;
    }
  };

  const deleteWish = async (id: string) => {
    try {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting wish:', error);
      throw error;
    }
  };

  const updateWish = async (id: string, updates: Partial<Omit<WishlistItem, 'id' | 'created_at'>>) => {
    try {
      const { error } = await supabase
        .from('wishlist_items')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, ...updates } : item
        )
      );
    } catch (error) {
      console.error('Error updating wish:', error);
      throw error;
    }
  };

  return {
    items,
    isLoading,
    addWish,
    toggleWishStatus,
    deleteWish,
    updateWish
  };
};
