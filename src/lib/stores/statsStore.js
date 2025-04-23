// src/lib/stores/statsStore.js
import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

// État initial
const initialState = {
  loading: false,
  error: null,
  data: {
    gamesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0,
    gamesTied: 0,
    blackjacks: 0,
    busts: 0,
    longestStreak: 0,
    currentStreak: 0,
    totalEarnings: 0,
    highestWin: 0
  },
  gameHistory: []
};

function createStatsStore() {
  const { subscribe, set, update } = writable(initialState);
  
  return {
    subscribe,
    
    // Initialiser les statistiques depuis l'API
    initialize: async () => {
      if (!browser) return;
      
      update(state => ({ ...state, loading: true }));
      
      try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        
        if (data.success) {
          update(state => ({
            ...state,
            loading: false,
            data: data.stats,
            gameHistory: data.stats.gameHistory || []
          }));
        } else {
          update(state => ({
            ...state,
            loading: false,
            error: data.message
          }));
        }
      } catch (error) {
        console.error('Stats initialization error:', error);
        update(state => ({
          ...state,
          loading: false,
          error: 'Erreur lors du chargement des statistiques'
        }));
      }
    },
    
    // Mettre à jour les statistiques après une partie
    updateStats: async (result, playerScore, dealerScore) => {
      update(state => ({ ...state, loading: true }));
      
      try {
        const response = await fetch('/api/stats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            result,
            playerScore,
            dealerScore
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Mettre à jour les statistiques locales
          update(state => {
            const updatedData = { ...state.data };
            
            // Mettre à jour les statistiques en fonction du résultat
            updatedData.gamesPlayed += 1;
            
            if (result === 'win' || result === 'blackjack') {
              updatedData.gamesWon += 1;
              updatedData.currentStreak += 1;
              
              if (updatedData.currentStreak > updatedData.longestStreak) {
                updatedData.longestStreak = updatedData.currentStreak;
              }
            } else if (result === 'loss' || result === 'bust') {
              updatedData.gamesLost += 1;
              updatedData.currentStreak = 0;
            } else if (result === 'tie') {
              updatedData.gamesTied += 1;
            }
            
            if (result === 'blackjack') {
              updatedData.blackjacks += 1;
            } else if (result === 'bust') {
              updatedData.busts += 1;
            }
            
            // Ajouter l'entrée à l'historique
            const newGameRecord = {
              id: `temp-${Date.now()}`,
              result,
              playerScore,
              dealerScore,
              createdAt: new Date().toISOString()
            };
            
            return {
              ...state,
              loading: false,
              data: updatedData,
              gameHistory: [newGameRecord, ...state.gameHistory].slice(0, 10)
            };
          });
          
          // Recharger les données fraîches depuis le serveur
          setTimeout(() => {
            this.initialize();
          }, 500);
        } else {
          update(state => ({
            ...state,
            loading: false,
            error: data.message
          }));
        }
      } catch (error) {
        console.error('Stats update error:', error);
        update(state => ({
          ...state,
          loading: false,
          error: 'Erreur lors de la mise à jour des statistiques'
        }));
      }
    },
    
    // Effacer l'erreur
    clearError: () => {
      update(state => ({ ...state, error: null }));
    }
  };
}

// Créer et exporter le store
export const statsStore = createStatsStore();

// Initialiser le store au chargement si on est côté navigateur
if (browser) {
  statsStore.initialize();
}

// Valeurs dérivées pour un accès facile
export const winRate = derived(statsStore, $statsStore => {
  const { gamesPlayed, gamesWon } = $statsStore.data;
  return gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0;
});

export const blackjackRate = derived(statsStore, $statsStore => {
  const { gamesPlayed, blackjacks } = $statsStore.data;
  return gamesPlayed > 0 ? Math.round((blackjacks / gamesPlayed) * 100) : 0;
});