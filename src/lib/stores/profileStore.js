// src/lib/stores/profileStore.js
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// État initial
const initialState = {
  loading: false,
  error: null,
  data: {
    theme: 'dark',
    tableColor: 'green',
    cardStyle: 'classic',
    avatarUrl: null,
    soundEnabled: true,
    musicEnabled: true
  }
};

function createProfileStore() {
  const { subscribe, set, update } = writable(initialState);
  
  // Créer le store
  const profileStore = {
  
  return {
    subscribe,
    
    // Initialiser le profil depuis l'API
    initialize: async () => {
      if (!browser) return;
      
      update(state => ({ ...state, loading: true }));
      
      try {
        const response = await fetch('/api/profile');
        const data = await response.json();
        
        if (data.success) {
          update(state => ({
            ...state,
            loading: false,
            data: {
              theme: data.profile.theme || 'dark',
              tableColor: data.profile.tableColor || 'green',
              cardStyle: data.profile.cardStyle || 'classic',
              avatarUrl: data.profile.avatarUrl || null,
              soundEnabled: data.profile.soundEnabled !== undefined ? data.profile.soundEnabled : true,
              musicEnabled: data.profile.musicEnabled !== undefined ? data.profile.musicEnabled : true
            }
          }));
        } else {
          // Si l'API échoue, garder les valeurs par défaut
          update(state => ({
            ...state,
            loading: false,
            error: data.message
          }));
        }
      } catch (error) {
        console.error('Profile initialization error:', error);
        update(state => ({
          ...state,
          loading: false,
          error: 'Erreur lors du chargement du profil'
        }));
      }
    },
    
    // Mettre à jour le profil
    updateProfile: async (profileData) => {
      update(state => ({ ...state, loading: true }));
      
      try {
        const response = await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profileData)
        });
        
        const data = await response.json();
        
        if (data.success) {
          update(state => ({
            ...state,
            loading: false,
            data: {
              ...state.data,
              ...profileData
            }
          }));
        } else {
          update(state => ({
            ...state,
            loading: false,
            error: data.message
          }));
        }
      } catch (error) {
        console.error('Profile update error:', error);
        update(state => ({
          ...state,
          loading: false,
          error: 'Erreur lors de la mise à jour du profil'
        }));
      }
    },
    
    // Mettre à jour une seule préférence
    updateSetting: async (key, value) => {
      const updateData = { [key]: value };
      update(state => ({
        ...state,
        data: {
          ...state.data,
          ...updateData
        }
      }));
      
      // Synchroniser avec le serveur
      await profileStore.updateProfile(updateData);
    },
    
    // Effacer l'erreur
    clearError: () => {
      update(state => ({ ...state, error: null }));
    }
  };
}