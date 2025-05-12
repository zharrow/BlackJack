// src/lib/stores/settingsStore.js
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Charger les paramètres depuis localStorage si disponible
const storedSettings = browser && localStorage.getItem('gameSettings') 
  ? JSON.parse(localStorage.getItem('gameSettings'))
  : null;

// État initial avec les paramètres par défaut
const defaultSettings = {
  soundEnabled: true,
  musicEnabled: false,
  // autres paramètres...
};

// Créer le store avec les paramètres stockés ou les valeurs par défaut
export const settings = writable(storedSettings || defaultSettings);

// Sauvegarder les paramètres dans localStorage quand ils changent
if (browser) {
  settings.subscribe(value => {
    localStorage.setItem('gameSettings', JSON.stringify(value));
  });
}