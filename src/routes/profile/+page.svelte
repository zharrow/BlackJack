<script>
  import { authStore } from '$lib/stores/authStore';
  import { onMount } from 'svelte';

  let userStats = {
    gamesPlayed: 0,
    gamesWon: 0,
    totalEarnings: 0,
    highestWin: 0,
    longestStreak: 0,
    favoriteTable: 'VIP'
  };

  let loading = true;

  onMount(async () => {
    // Simuler le chargement des données
    // À remplacer par un vrai appel API
    setTimeout(() => {
      // Données fictives pour démonstration
      if ($authStore.isAuthenticated) {
        userStats = {
          gamesPlayed: 157,
          gamesWon: 72,
          totalEarnings: 12450,
          highestWin: 1800,
          longestStreak: 5,
          favoriteTable: 'VIP'
        };
      }
      loading = false;
    }, 800);
  });
</script>

<div class="profile-container">
  <h1>Profil joueur</h1>
  
  {#if loading}
    <div class="loading">
      <div class="spinner"></div>
      <p>Chargement du profil...</p>
    </div>
  {:else}
    <div class="profile-card">
      <div class="profile-header">
        <div class="avatar">
          <span class="avatar-text">{$authStore.username.charAt(0).toUpperCase()}</span>
        </div>
        <div class="user-info">
          <h2>{$authStore.username}</h2>
          <p class="user-type">{$authStore.isGuest ? 'Compte invité' : 'Compte premium'}</p>
        </div>
      </div>

      <div class="stats-section">
        <h3>Statistiques du joueur</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-value">{userStats.gamesPlayed}</span>
            <span class="stat-label">Parties jouées</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{userStats.gamesWon}</span>
            <span class="stat-label">Victoires</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{((userStats.gamesWon / userStats.gamesPlayed) * 100).toFixed(1)}%</span>
            <span class="stat-label">Taux de victoire</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{userStats.totalEarnings}€</span>
            <span class="stat-label">Gains totaux</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{userStats.highestWin}€</span>
            <span class="stat-label">Plus gros gain</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{userStats.longestStreak}</span>
            <span class="stat-label">Série max</span>
          </div>
        </div>
      </div>

      <div class="preferences-section">
        <h3>Préférences</h3>
        <div class="preference-item">
          <span class="preference-label">Table préférée:</span>
          <span class="preference-value">{userStats.favoriteTable}</span>
        </div>
      </div>

      {#if !$authStore.isGuest}
        <div class="premium-section">
          <h3>Avantages premium</h3>
          <ul class="premium-features">
            <li>Tables VIP exclusives</li>
            <li>Bonus quotidien de jetons</li>
            <li>Statistiques détaillées</li>
            <li>Personnalisation avancée</li>
          </ul>
        </div>
      {/if}

      <div class="action-buttons">
        <a href="/game" class="btn btn-primary">Jouer maintenant</a>
      </div>
    </div>
  {/if}
</div>

<style>
  .profile-container {
    max-width: 900px;
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

  .profile-card {
    background: rgba(0, 0, 0, 0.4);
    border-radius: 12px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }

  .profile-header {
    padding: 2rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    background: rgba(0, 0, 0, 0.2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .avatar {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #0984e3, #6c5ce7);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .avatar-text {
    font-size: 2.5rem;
    font-weight: 600;
    color: white;
  }

  .user-info h2 {
    margin: 0;
    font-size: 1.8rem;
    color: white;
  }

  .user-type {
    margin: 0.3rem 0 0;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
  }

  .stats-section, .preferences-section, .premium-section {
    padding: 1.5rem 2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  h3 {
    margin-top: 0;
    margin-bottom: 1.2rem;
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.9);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }

  .stat-item {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 1rem;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .stat-value {
    display: block;
    font-size: 1.5rem;
    font-weight: 600;
    color: white;
    margin-bottom: 0.3rem;
  }

  .stat-label {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.7);
  }

  .preference-item {
    display: flex;
    justify-content: space-between;
    padding: 0.8rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .preference-item:last-child {
    border-bottom: none;
  }

  .preference-label {
    color: rgba(255, 255, 255, 0.7);
  }

  .preference-value {
    color: white;
    font-weight: 500;
  }

  .premium-features {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .premium-features li {
    padding: 0.5rem 0;
    color: rgba(255, 255, 255, 0.9);
    position: relative;
    padding-left: 1.5rem;
  }

  .premium-features li:before {
    content: "✓";
    position: absolute;
    left: 0;
    color: #00b894;
    font-weight: bold;
  }

  .action-buttons {
    padding: 1.5rem 2rem;
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }

  .btn {
    padding: 0.8rem 1.5rem;
    border-radius: 30px;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.2s;
    cursor: pointer;
  }

  .btn-primary {
    background: linear-gradient(135deg, #0984e3, #6c5ce7);
    color: white;
  }

  .btn-secondary {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }

  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .profile-header {
      flex-direction: column;
      text-align: center;
    }
    
    .action-buttons {
      flex-direction: column;
    }
    
    .btn {
      width: 100%;
      text-align: center;
    }
  }

  @media (max-width: 500px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }
  }
</style>