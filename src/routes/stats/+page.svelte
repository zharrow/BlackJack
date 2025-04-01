<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { authStore } from '$lib/stores/authStore';
    import { browser } from '$app/environment';
    
    // Structure des statistiques
    let stats = {
      player: {
        name: $authStore.username || "Joueur",
        wins: 0,
        losses: 0,
        pushes: 0,
        blackjacks: 0,
        busts: 0,
        totalGames: 0,
        longestWinStreak: 0,
        currentWinStreak: 0,
        lastGames: []
      },
      dealer: {
        name: "Croupier",
        wins: 0,
        losses: 0,
        busts: 0
      },
      gameStats: {
        averageScore: 0,
        highestScore: 0,
        cardsDealt: 0
      }
    };
    
    // Données fictives pour la démonstration
    function generateDemoStats() {
      stats.player.wins = 25;
      stats.player.losses = 18;
      stats.player.pushes = 7;
      stats.player.blackjacks = 4;
      stats.player.busts = 11;
      stats.player.totalGames = 50;
      stats.player.longestWinStreak = 5;
      stats.player.currentWinStreak = 2;
      
      stats.dealer.wins = 18;
      stats.dealer.losses = 25;
      stats.dealer.busts = 15;
      
      stats.gameStats.averageScore = 17.8;
      stats.gameStats.highestScore = 21;
      stats.gameStats.cardsDealt = 312;
      
      // Générer un historique de jeux
      stats.player.lastGames = [];
      const results = ['Victoire', 'Défaite', 'Égalité', 'Blackjack', 'Bust'];
      const scores = [17, 18, 19, 20, 21, 16, 22];
      
      for (let i = 0; i < 10; i++) {
        const result = results[Math.floor(Math.random() * results.length)];
        const playerScore = scores[Math.floor(Math.random() * scores.length)];
        const dealerScore = scores[Math.floor(Math.random() * scores.length)];
        
        stats.player.lastGames.unshift({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
          result: result,
          playerScore: playerScore,
          dealerScore: dealerScore
        });
      }
    }
    
    // Charger les statistiques réelles ou générer des données de démo
    onMount(() => {
      if (browser) {
        const storedStats = localStorage.getItem('blackjackStats');
        if (storedStats) {
          try {
            const parsedStats = JSON.parse(storedStats);
            
            // Mise à jour partielle pour maintenir la structure complète
            stats.player.name = $authStore.username || "Joueur";
            stats.player.wins = parsedStats.player?.wins || 0;
            stats.player.losses = parsedStats.player?.losses || 0;
            
            stats.dealer.wins = parsedStats.dealer?.wins || 0;
            stats.dealer.losses = parsedStats.dealer?.losses || 0;
            
            // Calcul des statistiques dérivées
            stats.player.totalGames = stats.player.wins + stats.player.losses + stats.player.pushes;
          } catch (e) {
            console.error('Error parsing stats from localStorage', e);
            generateDemoStats();
          }
        } else {
          // Pas de données, générer des démos
          generateDemoStats();
        }
      }
    });
    
    // Calculer le taux de victoire
    $: winRate = stats.player.totalGames > 0 
      ? Math.round((stats.player.wins / stats.player.totalGames) * 100) 
      : 0;
      
    // Calculer le taux de blackjack
    $: blackjackRate = stats.player.totalGames > 0 
      ? Math.round((stats.player.blackjacks / stats.player.totalGames) * 100) 
      : 0;
      
    // Formater une date
    function formatDate(date) {
      return new Date(date).toLocaleDateString();
    }
    
    // Obtenir la classe CSS pour un résultat
    function getResultClass(result) {
      switch(result) {
        case 'Victoire': return 'win';
        case 'Blackjack': return 'blackjack';
        case 'Défaite': return 'loss';
        case 'Bust': return 'bust';
        case 'Égalité': return 'push';
        default: return '';
      }
    }
  </script>
  
  <svelte:head>
    <title>Blackjack - Statistiques</title>
  </svelte:head>
  
  <div class="stats-page" in:fade={{ duration: 300 }}>
    <div class="stats-container">
      <h1>Vos statistiques</h1>
      
      <div class="stats-grid">
        <!-- Résumé -->
        <div class="stats-card summary">
          <h2>Résumé</h2>
          <div class="player-summary">
            <div class="player-avatar">
              <span>{stats.player.name.charAt(0).toUpperCase()}</span>
            </div>
            <div class="player-info">
              <h3>{stats.player.name}</h3>
              <div class="win-rate">
                <div class="progress-bar">
                  <div class="progress" style="width: {winRate}%"></div>
                </div>
                <span class="win-rate-text">{winRate}% de victoires</span>
              </div>
            </div>
          </div>
          
          <div class="summary-stats">
            <div class="stat-item">
              <span class="stat-label">Parties jouées</span>
              <span class="stat-value">{stats.player.totalGames}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Victoires</span>
              <span class="stat-value win">{stats.player.wins}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Défaites</span>
              <span class="stat-value loss">{stats.player.losses}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Égalités</span>
              <span class="stat-value push">{stats.player.pushes}</span>
            </div>
          </div>
        </div>
        
        <!-- Performances -->
        <div class="stats-card performance">
          <h2>Performances</h2>
          <div class="performance-stats">
            <div class="stat-item">
              <span class="stat-label">Blackjacks</span>
              <span class="stat-value blackjack">{stats.player.blackjacks}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Busts</span>
              <span class="stat-value bust">{stats.player.busts}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Série actuelle</span>
              <span class="stat-value">{stats.player.currentWinStreak}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Meilleure série</span>
              <span class="stat-value">{stats.player.longestWinStreak}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Score moyen</span>
              <span class="stat-value">{stats.gameStats.averageScore}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Record</span>
              <span class="stat-value">{stats.gameStats.highestScore}</span>
            </div>
          </div>
        </div>
        
        <!-- Historique -->
        <div class="stats-card history">
          <h2>Dernières parties</h2>
          <div class="game-history">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Résultat</th>
                  <th>Votre score</th>
                  <th>Croupier</th>
                </tr>
              </thead>
              <tbody>
                {#each stats.player.lastGames as game, i}
                  <tr>
                    <td>{formatDate(game.date)}</td>
                    <td class={getResultClass(game.result)}>{game.result}</td>
                    <td>{game.playerScore}</td>
                    <td>{game.dealerScore}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Statistiques du croupier -->
        <div class="stats-card dealer">
          <h2>Croupier</h2>
          <div class="dealer-stats">
            <div class="stat-item">
              <span class="stat-label">Victoires</span>
              <span class="stat-value">{stats.dealer.wins}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Défaites</span>
              <span class="stat-value">{stats.dealer.losses}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Busts</span>
              <span class="stat-value">{stats.dealer.busts}</span>
            </div>
            <div class="dealer-win-rate">
              <div class="progress-bar">
                <div class="progress" style="width: {stats.player.totalGames > 0 ? Math.round((stats.dealer.wins / stats.player.totalGames) * 100) : 0}%"></div>
              </div>
              <span class="win-rate-text">
                {stats.player.totalGames > 0 ? Math.round((stats.dealer.wins / stats.player.totalGames) * 100) : 0}% de victoires
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="stats-footer">
        <p>Ces statistiques sont stockées localement sur votre appareil.</p>
        <button class="reset-button">Réinitialiser les statistiques</button>
      </div>
    </div>
  </div>
  
  <style>
    .stats-page {
      min-height: calc(100vh - 60px);
      padding: 2rem;
      display: flex;
      justify-content: center;
      color: white;
    }
    
    .stats-container {
      max-width: 1200px;
      width: 100%;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(10px);
      border-radius: 15px;
      padding: 2rem;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    h1 {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 2rem;
      color: #00cec9;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }
    
    .stats-card {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 10px;
      padding: 1.5rem;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    .stats-card h2 {
      font-size: 1.3rem;
      margin-bottom: 1.5rem;
      color: #00b894;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 0.5rem;
    }
    
    .summary {
      grid-column: 1;
      grid-row: 1;
    }
    
    .performance {
      grid-column: 2;
      grid-row: 1;
    }
    
    .history {
      grid-column: 1 / span 2;
      grid-row: 2;
    }
    
    .dealer {
      grid-column: 1 / span 2;
      grid-row: 3;
    }
    
    /* Player summary */
    .player-summary {
      display: flex;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    
    .player-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0984e3 0%, #6c5ce7 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: bold;
      color: white;
      margin-right: 1rem;
      flex-shrink: 0;
    }
    
    .player-info {
      flex: 1;
    }
    
    .player-info h3 {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
    }
    
    .win-rate {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }
    
    .progress-bar {
      height: 8px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      overflow: hidden;
    }
    
    .progress {
      height: 100%;
      background: linear-gradient(90deg, #00b894, #00cec9);
      border-radius: 4px;
    }
    
    .win-rate-text {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.8);
    }
    
    /* Summary and performance stats */
    .summary-stats, .performance-stats, .dealer-stats {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
    
    .stat-item {
      display: flex;
      flex-direction: column;
      padding: 0.8rem;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 8px;
    }
    
    .stat-label {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 0.3rem;
    }
    
    .stat-value {
      font-size: 1.3rem;
      font-weight: 600;
    }
    
    .win {
      color: #2ecc71;
    }
    
    .loss {
      color: #e74c3c;
    }
    
    .push {
      color: #3498db;
    }
    
    .blackjack {
      color: #f1c40f;
    }
    
    .bust {
      color: #e74c3c;
    }
    
    /* Game history */
    .game-history {
      overflow-x: auto;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    th, td {
      padding: 0.8rem;
      text-align: left;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    th {
      font-weight: 600;
      color: rgba(255, 255, 255, 0.8);
      text-transform: uppercase;
      font-size: 0.8rem;
      letter-spacing: 1px;
    }
    
    /* Dealer stats */
    .dealer-win-rate {
      grid-column: 1 / span 2;
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }
    
    /* Footer */
    .stats-footer {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .stats-footer p {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.9rem;
    }
    
    .reset-button {
      background: rgba(231, 76, 60, 0.2);
      color: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(231, 76, 60, 0.5);
      padding: 0.5rem 1rem;
      border-radius: 5px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .reset-button:hover {
      background: rgba(231, 76, 60, 0.3);
    }
    
    /* Responsive */
    @media (max-width: 900px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .summary, .performance, .history, .dealer {
        grid-column: 1;
      }
      
      .summary {
        grid-row: 1;
      }
      
      .performance {
        grid-row: 2;
      }
      
      .history {
        grid-row: 3;
      }
      
      .dealer {
        grid-row: 4;
      }
      
      .stats-footer {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
    }
    
    @media (max-width: 600px) {
      .stats-page {
        padding: 1rem;
      }
      
      .stats-container {
        padding: 1.5rem;
      }
      
      h1 {
        font-size: 2rem;
      }
      
      .summary-stats, .performance-stats, .dealer-stats {
        grid-template-columns: 1fr;
      }
    }
  </style>