import { writable, derived } from 'svelte/store';
import * as cardService from '../services/cardService';
import { statsStore } from './statsStore';

// État initial du jeu
const initialState = {
  deckId: null,
  remainingCards: 0,
  playerHand: [],
  dealerHand: [],
  gameStatus: 'idle', // 'idle', 'playing', 'playerWin', 'dealerWin', 'push', 'playerBlackjack', 'playerBust', 'dealerBust'
  isPlayerTurn: true,
  title: 'Bienvenue au Blackjack!',
  message: 'Cliquez sur "Nouvelle Partie" pour commencer.',
  isLoading: false
};

// Créer le store
const createGameStore = () => {
  const { subscribe, set, update } = writable(initialState);
  
  // Fonction pour gérer le tour du croupier
  const dealerPlay = async () => {
    let state;
    update(s => { state = s; return { ...s, isLoading: true, title: 'Le croupier joue...' }; });
    
    console.log('Dealer play started', state);
    try {
      let dealerHand = [...state.dealerHand];
      let { value: dealerValue } = cardService.calculateHandValue(dealerHand);
      let { value: playerValue } = cardService.calculateHandValue(state.playerHand);
      
      // Le croupier tire jusqu'à 17 ou plus
      while (dealerValue < 17) {
        const result = await cardService.drawCards(state.deckId, 1);
        const newCard = result.cards[0];
        
        dealerHand = [...dealerHand, newCard];
        dealerValue = cardService.calculateHandValue(dealerHand).value;
        
        update(s => ({
          ...s,
          dealerHand,
          remainingCards: result.remaining,
          title: `Le croupier tire ${newCard.value} de ${newCard.suit.toLowerCase()}.`,
          message: `Sa main vaut ${dealerValue}.`
        }));
        
        // Pause pour l'animation
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Déterminer le résultat
      let gameStatus;
      let title;
      let message;

      
      if (dealerValue > 21) {
        gameStatus = 'dealerBust';
        title ='Vous gagnez!';
        message = `Le croupier dépasse 21 avec ${dealerValue}.`;
        
        // Mettre à jour les statistiques
        setTimeout(() => {
          statsStore.updateStats('win', playerValue, dealerValue);
        }, 1000);
      } else if (dealerValue > playerValue) {
        gameStatus = 'dealerWin';
        title = 'Le croupier gagne!';
        message = `Le croupier gagne avec ${dealerValue} contre votre ${playerValue}.`;
        
        // Mettre à jour les statistiques
        setTimeout(() => {
          statsStore.updateStats('loss', playerValue, dealerValue);
        }, 1000);
      } else if (dealerValue < playerValue) {
        gameStatus = 'playerWin';
        title = 'Vous gagnez!';
        message = `Vous gagnez avec ${playerValue} contre ${dealerValue} pour le croupier!`;
        
        // Mettre à jour les statistiques
        setTimeout(() => {
          statsStore.updateStats('win', playerValue, dealerValue);
        }, 1000);
      } else {
        gameStatus = 'push';
        title = 'Égalité!';
        message = `Égalité! Vous avez tous les deux ${playerValue}.`;
        
        // Mettre à jour les statistiques
        setTimeout(() => {
          statsStore.updateStats('tie', playerValue, dealerValue);
        }, 1000);
      }
      
      update(s => ({
        ...s,
        gameStatus,
        message,
        isLoading: false
      }));
      
    } catch (error) {
      update(s => ({
        ...s,
        isLoading: false,
        message: `Erreur: ${error.message}`
      }));
    }
  };
  
  // Fonction pour gérer la distribution initiale des cartes
  const dealInitialCards = async (deckId) => {
    try {
      // Tirer 2 cartes pour le joueur et 2 pour le croupier
      const result = await cardService.drawCards(deckId, 4);
      
      const playerHand = [result.cards[0], result.cards[2]];
      const dealerHand = [result.cards[1], result.cards[3]];
      
      const { value: playerValue, isBlackjack: playerBlackjack } = cardService.calculateHandValue(playerHand);
      const { value: dealerValue, isBlackjack: dealerBlackjack } = cardService.calculateHandValue(dealerHand);
      
      let gameStatus = 'playing';
      let title = `Vos cartes valent ${playerValue}.`;
      let message = ` La carte visible du croupier est ${dealerHand[0].value}.`;
      let isPlayerTurn = true;
      
      // Vérifier le blackjack
      if (playerBlackjack && dealerBlackjack) {
        gameStatus = 'push';
        title = 'Égalité!';
        message = 'Vous avez tous les deux un Blackjack! C\'est une égalité!';
        isPlayerTurn = false;
        
        // Mettre à jour les statistiques
        setTimeout(() => {
          statsStore.updateStats('tie', playerValue, dealerValue);
        }, 1000);
      } else if (playerBlackjack) {
        gameStatus = 'playerBlackjack';
        title = 'Blackjack!';
        message = 'Vous gagnez 3:2!';
        isPlayerTurn = false;
        
        // Mettre à jour les statistiques
        setTimeout(() => {
          statsStore.updateStats('blackjack', playerValue, dealerValue);
        }, 1000);
      } else if (dealerBlackjack) {
        gameStatus = 'dealerWin';
        title = 'Le croupier a un Blackjack!';
        message = 'Vous avez perdu.';
        isPlayerTurn = false;
        
        // Mettre à jour les statistiques
        setTimeout(() => {
          statsStore.updateStats('loss', playerValue, dealerValue);
        }, 1000);
      }
      
      update(state => ({
        ...state,
        playerHand,
        dealerHand,
        remainingCards: result.remaining,
        gameStatus,
        message,
        isPlayerTurn,
        isLoading: false
      }));
      
    } catch (error) {
      update(state => ({
        ...state,
        isLoading: false,
        message: `Erreur: ${error.message}`
      }));
    }
  };
  
  return {
    subscribe,
    
    // Initialiser une nouvelle partie
    newGame: async () => {
      update(state => ({ ...state, isLoading: true, message: 'Création d\'une nouvelle partie...' }));
      
      try {
        const deck = await cardService.createDeck();
        const { deck_id, remaining } = deck;
        
        update(state => ({
          ...state,
          deckId: deck_id,
          remainingCards: remaining,
          playerHand: [],
          dealerHand: [],
          gameStatus: 'playing',
          isPlayerTurn: true,
          message: 'Distribution des cartes...',
          isLoading: true
        }));
        
        // Distribuer les cartes initiales
        await dealInitialCards(deck_id);
      } catch (error) {
        update(state => ({
          ...state,
          isLoading: false,
          message: `Erreur: ${error.message}`
        }));
      }
    },
    
    // Le joueur tire une carte
    hit: async () => {
      update(state => {
        if (state.gameStatus !== 'playing' || !state.isPlayerTurn) {
          return state;
        }
        return { ...state, isLoading: true, message: 'Tirage d\'une carte...' };
      });
      
      try {
        let state;
        update(s => { state = s; return s; });
        
        const result = await cardService.drawCards(state.deckId, 1);
        const newCard = result.cards[0];
        
        update(state => {
          const updatedPlayerHand = [...state.playerHand, newCard];
          const { value: handValue } = cardService.calculateHandValue(updatedPlayerHand);
          
          let newGameStatus = state.gameStatus;
          let newMessage = `Vous avez tiré ${newCard.value} de ${newCard.suit.toLowerCase()}. Votre main vaut ${handValue}.`;
          
          // Vérifier si le joueur a dépassé 21
          if (handValue > 21) {
            newGameStatus = 'playerBust';
            newMessage = `Vous avez dépassé 21 avec ${handValue}. Vous avez perdu!`;
            
            // Mettre à jour les statistiques avec le résultat "bust"
            setTimeout(() => {
              statsStore.updateStats('bust', handValue, 0);
            }, 1000);
          }
          
          return {
            ...state,
            playerHand: updatedPlayerHand,
            remainingCards: result.remaining,
            gameStatus: newGameStatus,
            message: newMessage,
            isLoading: false,
            isPlayerTurn: newGameStatus === 'playing'
          };
        });
        
        // Si le joueur a perdu, mettre fin au jeu
        state = null;
        update(s => { state = s; return s; });
        
        if (state.gameStatus === 'playerBust') {
          setTimeout(() => {
            update(s => ({ ...s, isPlayerTurn: false }));
          }, 1500);
        }
      } catch (error) {
        update(state => ({
          ...state,
          isLoading: false,
          message: `Erreur: ${error.message}`
        }));
      }
    },
    
    // Le joueur reste (ne tire plus de cartes)
    stand: () => {
      update(state => {
        if (state.gameStatus !== 'playing' || !state.isPlayerTurn) {
          return state;
        }
        
        return {
          ...state,
          isPlayerTurn: false,
          message: 'Vous restez. Au tour du croupier...'
        };
      });
      
      // Lancer le tour du croupier
      setTimeout(dealerPlay, 1000);
    },
  };
  
};


// Créer et exporter le store
export const gameStore = createGameStore();

// Valeurs dérivées utiles
export const playerHandValue = derived(gameStore, $gameStore => {
  return $gameStore.playerHand.length > 0 
    ? cardService.calculateHandValue($gameStore.playerHand).value 
    : 0;
});

export const dealerHandValue = derived(gameStore, $gameStore => {
  return $gameStore.dealerHand.length > 0 
    ? cardService.calculateHandValue($gameStore.dealerHand).value 
    : 0;
});

export const isGameOver = derived(gameStore, $gameStore => {
  return $gameStore.gameStatus !== 'playing' && $gameStore.gameStatus !== 'idle';
});

export const canHit = derived(gameStore, $gameStore => {
  return $gameStore.gameStatus === 'playing' && $gameStore.isPlayerTurn;
});

export const canStand = derived(gameStore, $gameStore => {
  return $gameStore.gameStatus === 'playing' && $gameStore.isPlayerTurn;
});