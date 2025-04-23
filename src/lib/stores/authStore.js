// src/lib/stores/authStore.js
import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

// État initial
const initialState = {
  user: { 
    isGuest: false,
    username: ''
  },
  isAuthenticated: false,
  isGuest: false,
  username: '',
  loading: false,
  error: null
};

function createAuthStore() {
  const { subscribe, set, update } = writable(initialState);
  
  return {
    subscribe,
    
    // Initialiser le store à partir de l'API
    initialize: async () => {
      update(state => ({ ...state, loading: true }));
      
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        
        if (data.success && data.user) {
          update(state => ({
            ...state,
            user: data.user,
            isAuthenticated: true,
            isGuest: data.user.isGuest,
            username: data.user.username,
            loading: false
          }));
        } else {
          set({ ...initialState, loading: false });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        set({ ...initialState, loading: false });
      }
    },
    
    // Pour jouer en tant qu'invité
    setGuest: async (username) => {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        // Créer un compte invité temporaire
        const response = await fetch('/api/auth/guest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: username || 'Invité' })
        });
        
        const data = await response.json();
        
        if (data.success) {
          update(state => ({
            ...state,
            isGuest: true,
            isAuthenticated: true,
            username: data.user.username,
            user: data.user,
            loading: false,
            error: null
          }));
          return true;
        } else {
          update(state => ({
            ...state,
            loading: false,
            error: data.message
          }));
          return false;
        }
      } catch (error) {
        console.error('Guest login error:', error);
        update(state => ({
          ...state,
          loading: false,
          error: 'Erreur lors de la connexion en tant qu\'invité'
        }));
        return false;
      }
    },
    
    // Connexion
    login: async (email, password) => {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
          update(state => ({
            ...state,
            isAuthenticated: true,
            isGuest: data.user.isGuest,
            username: data.user.username,
            user: data.user,
            loading: false,
            error: null
          }));
          return true;
        } else {
          update(state => ({
            ...state,
            loading: false,
            error: data.message
          }));
          return false;
        }
      } catch (error) {
        console.error('Login error:', error);
        update(state => ({
          ...state,
          loading: false,
          error: 'Erreur lors de la connexion'
        }));
        return false;
      }
    },
    
    // Inscription
    register: async (username, email, password) => {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
          update(state => ({
            ...state,
            isAuthenticated: true,
            isGuest: false,
            username: data.user.username,
            user: data.user,
            loading: false,
            error: null
          }));
          return true;
        } else {
          update(state => ({
            ...state,
            loading: false,
            error: data.message
          }));
          return false;
        }
      } catch (error) {
        console.error('Register error:', error);
        update(state => ({
          ...state,
          loading: false,
          error: 'Erreur lors de l\'inscription'
        }));
        return false;
      }
    },
    
    // Déconnexion
    logout: async () => {
      update(state => ({ ...state, loading: true }));
      
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
        set(initialState);
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        update(state => ({ ...state, loading: false }));
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

// Initialiser le store au chargement si on est côté navigateur
if (browser) {
  authStore.initialize();
}

// Valeurs dérivées pour faciliter l'accès
export const isAuthenticated = derived(authStore, $authStore => $authStore.isAuthenticated);
export const isGuest = derived(authStore, $authStore => $authStore.isGuest);
export const username = derived(authStore, $authStore => $authStore.username);
export const user = derived(authStore, $authStore => $authStore.user);