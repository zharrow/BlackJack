<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  
  // Paramètres en lecture seule
  const settings = {
    interface: {
      theme: "Sombre",
      tableColor: "Vert",
      cardStyle: "Classique",
      language: "Français"
    },
    audio: {
      notifications: "Activées",
      sounds: "Activés",
      music: "Activée"
    },
    gameplay: {
      betWarnings: "Activés",
      autoSave: "Activée"
    }
  };
  
  let loading = true;
  
  onMount(() => {
    // Simuler chargement
    setTimeout(() => {
      loading = false;
    }, 500);
  });
  
  function goBack() {
    goto('/profile');
  }
</script>

<div class="settings-container">
  <h1>Paramètres</h1>
  
  {#if loading}
    <div class="loading">
      <div class="spinner"></div>
      <p>Chargement des paramètres...</p>
    </div>
  {:else}
    <div class="settings-card">
      <div class="settings-section">
        <h2>Interface de jeu</h2>
        
        <div class="setting-item">
          <span class="setting-label">Thème</span>
          <span class="setting-value">{settings.interface.theme}</span>
        </div>
        
        <div class="setting-item">
          <span class="setting-label">Couleur de table</span>
          <span class="setting-value">{settings.interface.tableColor}</span>
        </div>
        
        <div class="setting-item">
          <span class="setting-label">Style de cartes</span>
          <span class="setting-value">{settings.interface.cardStyle}</span>
        </div>
        
        <div class="setting-item">
          <span class="setting-label">Langue</span>
          <span class="setting-value">{settings.interface.language}</span>
        </div>
      </div>
      
      <div class="settings-section">
        <h2>Sons et notifications</h2>
        
        <div class="setting-item">
          <span class="setting-label">Notifications</span>
          <span class="setting-value">{settings.audio.notifications}</span>
        </div>
        
        <div class="setting-item">
          <span class="setting-label">Effets sonores</span>
          <span class="setting-value">{settings.audio.sounds}</span>
        </div>
        
        <div class="setting-item">
          <span class="setting-label">Musique de fond</span>
          <span class="setting-value">{settings.audio.music}</span>
        </div>
      </div>
      
      <div class="settings-section">
        <h2>Préférences de jeu</h2>
        
        <div class="setting-item">
          <span class="setting-label">Avertissements de mise</span>
          <span class="setting-value">{settings.gameplay.betWarnings}</span>
        </div>
        
        <div class="setting-item">
          <span class="setting-label">Sauvegarde automatique</span>
          <span class="setting-value">{settings.gameplay.autoSave}</span>
        </div>
      </div>
      
      <div class="button-container">
        <button class="btn btn-primary" on:click={goBack}>Retour au profil</button>
      </div>
    </div>
  {/if}
</div>

<style>
  .settings-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 0 1.5rem;
  }

  h1 {
    color: white;
    margin-bottom: 1.5rem;
    font-weight: 600;
    text-align: center;
    background: linear-gradient(90deg, #00b894, #00cec9);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    border-top-color: #00b894;
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .settings-card {
    background: rgba(0, 0, 0, 0.4);
    border-radius: 12px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }

  .settings-section {
    padding: 1.5rem 2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  h2 {
    font-size: 1.2rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
    margin-top: 0;
    margin-bottom: 1.5rem;
  }

  .setting-item {
    display: flex;
    justify-content: space-between;
    padding: 0.8rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .setting-item:last-child {
    border-bottom: none;
  }

  .setting-label {
    color: rgba(255, 255, 255, 0.7);
  }

  .setting-value {
    color: white;
    font-weight: 500;
  }

  .note-section {
    padding: 1.5rem 2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .note {
    background: rgba(255, 255, 255, 0.05);
    border-left: 4px solid #00b894;
    padding: 1rem 1.5rem;
    border-radius: 0 8px 8px 0;
  }

  .note p {
    margin: 0;
    color: rgba(255, 255, 255, 0.8);
  }

  .button-container {
    padding: 1.5rem 2rem;
    display: flex;
    justify-content: center;
  }

  .btn {
    padding: 0.8rem 1.8rem;
    border-radius: 30px;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.2s;
    cursor: pointer;
    border: none;
    font-size: 1rem;
  }

  .btn-primary {
    background: linear-gradient(135deg, #0984e3, #6c5ce7);
    color: white;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    .setting-item {
      flex-direction: column;
      gap: 0.3rem;
    }
    
    .setting-value {
      color: rgba(255, 255, 255, 0.9);
    }
  }
</style>