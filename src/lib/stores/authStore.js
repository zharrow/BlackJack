// src/lib/stores/authStore.js
import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

// État initial
const initialState = {
  user: null,
  isAuthenticated: false,
  isGuest: false,
  username: '',
  loading: false,
  error: null
};

function createAuthStore() {
  // Tenter de charger l'état depuis localStorage au démarrage
  let storedState = initialState;
  
  if (browser) {
    const stored = localStorage.getItem('authState');
    if (stored) {
      try {
        storedState = JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing auth state from localStorage', e);
      }
    }
  }
  
  const { subscribe, set, update } = writable(storedState);
  
  // Persister l'état dans localStorage quand il change
  if (browser) {
    subscribe(state => {
      localStorage.setItem('authState', JSON.stringify(state));
    });
  }
  
  return {
    subscribe,
    
    // Pour jouer en tant qu'invité
    // @ts-ignore
    setGuest: (username) => {
      update(state => ({
        ...state,
        isGuest: true,
        isAuthenticated: true,
        username: username || 'Invité',
        // @ts-ignore
        user: { username: username || 'Invité', guest: true },
        loading: false,
        error: null
      }));
    },
    
    // Connexion (à connecter à une API réelle plus tard)
    // @ts-ignore
    login: async (email, password) => {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        // Simuler un appel API (à remplacer par un vrai appel)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (email === 'test@example.com' && password === 'password') {
          update(state => ({
            ...state,
            isAuthenticated: true,
            isGuest: false,
            username: 'Utilisateur Test',
            // @ts-ignore
            user: { id: 1, username: 'Utilisateur Test', email, guest: false },
            loading: false
          }));
          return true;
        } else {
          update(state => ({
            ...state,
            loading: false,
            // @ts-ignore
            error: 'Email ou mot de passe incorrect'
          }));
          return false;
        }
      } catch (error) {
        update(state => ({
          ...state,
          loading: false,
          // @ts-ignore
          error: error.message || 'Erreur de connexion'
        }));
        return false;
      }
    },
    
    // Inscription (à connecter à une API réelle plus tard)
    // @ts-ignore
    register: async (username, email, password) => {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        // Simuler un appel API (à remplacer par un vrai appel)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        update(state => ({
          ...state,
          isAuthenticated: true,
          isGuest: false,
          username,
          // @ts-ignore
          user: { id: Math.floor(Math.random() * 1000), username, email, guest: false },
          loading: false
        }));
        return true;
      } catch (error) {
        update(state => ({
          ...state,
          loading: false,
          // @ts-ignore
          error: error.message || 'Erreur lors de l\'inscription'
        }));
        return false;
      }
    },
    
    // Déconnexion
    logout: () => {
      set(initialState);
      if (browser) {
        localStorage.removeItem('authState');
      }
    },
    
    // Effacer les erreurs
    clearError: () => {
      update(state => ({ ...state, error: null }));
    }
  };
}

// Créer et exporter le store
export const authStore = createAuthStore();

// Valeurs dérivées pour faciliter l'accès
export const isAuthenticated = derived(authStore, $authStore => $authStore.isAuthenticated);
export const isGuest = derived(authStore, $authStore => $authStore.isGuest);
export const username = derived(authStore, $authStore => $authStore.username);
export const user = derived(authStore, $authStore => $authStore.user);