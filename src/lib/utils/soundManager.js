// src/lib/utils/soundManager.js
import { browser } from '$app/environment';

// Créer un cache pour les sons chargés
const soundCache = new Map();

// Volumes par défaut pour différents types de sons
const defaultVolumes = {
  'card-flip': 0.3,
  'win': 0.5,
  'lose': 0.5,
  'start': 0.4
};

/**
 * Fonction pour charger et mettre en cache un son
 * @param {string} name - Nom du fichier son (sans l'extension)
 * @returns {HTMLAudioElement|null} - L'élément audio ou null si en SSR
 */
export function loadSound(name) {
  if (!browser) return null;

  if (soundCache.has(name)) {
    return soundCache.get(name);
  }

  try {
    const audio = new Audio(`/sounds/${name}.mp3`);
    audio.volume = defaultVolumes[name] || 0.5;
    soundCache.set(name, audio);
    return audio;
  } catch (error) {
    console.error(`Erreur lors du chargement du son ${name}:`, error);
    return null;
  }
}

/**
 * Joue un son par son nom
 * @param {string} name - Nom du fichier son (sans l'extension)
 * @param {number} [volume] - Volume optionnel pour ce son spécifique
 * @returns {Promise<void>}
 */
export function playSound(name, volume) {
  if (!browser) return Promise.resolve();

  const audio = loadSound(name);
  if (!audio) return Promise.resolve();

  // Réinitialiser si déjà en lecture
  audio.currentTime = 0;
  
  // Définir le volume si fourni
  if (volume !== undefined) {
    audio.volume = volume;
  }

  return audio.play().catch(e => {
    // Gérer les erreurs d'autoplay bloqué par le navigateur
    console.warn(`Autoplay prevented for ${name}:`, e);
  });
}

/**
 * Précharge tous les sons du jeu
 */
export function preloadAllSounds() {
  if (!browser) return;
  
  ['card-flip', 'win', 'lose', 'start'].forEach(loadSound);
}