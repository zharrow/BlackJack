<script>
    import { fade } from 'svelte/transition';
  </script>
  
  <svelte:head>
    <title>Blackjack - Règles du jeu</title>
  </svelte:head>
  
  <div class="rules-page" in:fade={{ duration: 300 }}>
    <div class="rules-container">
      <h1>Règles du Blackjack</h1>
      
      <div class="rule-section">
        <h2>Objectif du jeu</h2>
        <p>Le but du Blackjack est de battre la main du croupier sans dépasser 21 points. Vous gagnez si :</p>
        <ul>
          <li>Votre main a une valeur plus élevée que celle du croupier sans dépasser 21</li>
          <li>Le croupier dépasse 21 (« bust »)</li>
          <li>Vous obtenez un « Blackjack » (21 points avec les deux premières cartes)</li>
        </ul>
      </div>
      
      <div class="rule-section">
        <h2>Valeur des cartes</h2>
        <div class="card-values">
          <div class="card-value-item">
            <span class="card-symbol">2-10</span>
            <span class="card-description">Valeur nominale (2 vaut 2 points, etc.)</span>
          </div>
          <div class="card-value-item">
            <span class="card-symbol">V, D, R</span>
            <span class="card-description">10 points chacune</span>
          </div>
          <div class="card-value-item">
            <span class="card-symbol">A</span>
            <span class="card-description">1 ou 11 points (au choix)</span>
          </div>
        </div>
        <p>Les As valent 11 points, sauf si cela fait dépasser 21 au joueur, auquel cas ils valent 1 point.</p>
      </div>
      
      <div class="rule-section">
        <h2>Déroulement du jeu</h2>
        <ol>
          <li>Le croupier distribue deux cartes au joueur et à lui-même (une carte du croupier est face cachée).</li>
          <li>Le joueur joue en premier. Il peut demander des cartes supplémentaires (« Hit ») ou passer (« Stand »).</li>
          <li>Si le joueur dépasse 21, il perd immédiatement (« Bust »).</li>
          <li>Lorsque le joueur passe, c'est au tour du croupier de jouer.</li>
          <li>Le croupier doit tirer des cartes jusqu'à avoir au moins 17 points.</li>
          <li>Si le croupier dépasse 21, le joueur gagne.</li>
          <li>Sinon, la main la plus proche de 21 l'emporte.</li>
        </ol>
      </div>
      
      <div class="rule-section">
        <h2>Blackjack</h2>
        <p>Un « Blackjack » est une main composée d'un As et d'une carte valant 10 points (10, Valet, Dame ou Roi) obtenue avec les deux premières cartes distribuées.</p>
        <p>Un Blackjack bat toute autre main valant 21 points obtenue avec plus de deux cartes.</p>
        <p>Si le joueur et le croupier ont tous deux un Blackjack, la partie est déclarée nulle (« Push »).</p>
      </div>
      
      <div class="rule-section">
        <h2>Autres règles</h2>
        <ul>
          <li><strong>Push</strong> : Si le joueur et le croupier ont la même valeur de main, la partie est nulle et le joueur garde sa mise.</li>
          <li><strong>Assurance</strong> : Si la carte visible du croupier est un As, le joueur peut prendre une assurance contre un Blackjack du croupier.</li>
          <li><strong>Split</strong> : Si les deux premières cartes du joueur ont la même valeur, il peut les séparer en deux mains distinctes.</li>
          <li><strong>Double</strong> : Le joueur peut doubler sa mise après avoir reçu ses deux premières cartes, mais ne recevra qu'une seule carte supplémentaire.</li>
        </ul>
        <p class="note">Note : Ces règles avancées (assurance, split, double) ne sont pas encore implémentées dans cette version du jeu.</p>
      </div>
      
      <div class="rule-section">
        <h2>Stratégies de base</h2>
        <p>Voici quelques conseils de base pour améliorer vos chances :</p>
        <ul>
          <li>Tirez toujours si vous avez 11 points ou moins.</li>
          <li>Restez toujours si vous avez 17 points ou plus.</li>
          <li>Si vous avez 12 à 16 points, tirez si le croupier montre 7 ou plus, sinon restez.</li>
          <li>Avec un As et une petite carte (As souple), tirez jusqu'à atteindre au moins 18 points.</li>
        </ul>
      </div>
    </div>
  </div>
  
  <style>
    .rules-page {
      min-height: calc(100vh - 60px);
      padding: 2rem;
      display: flex;
      justify-content: center;
      color: white;
    }
    
    .rules-container {
      max-width: 800px;
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
    
    .rule-section {
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .rule-section:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    
    h2 {
      color: #00b894;
      margin-bottom: 1rem;
      font-size: 1.5rem;
    }
    
    p {
      line-height: 1.6;
      margin-bottom: 1rem;
    }
    
    ul, ol {
      margin-left: 1.5rem;
      margin-bottom: 1rem;
    }
    
    li {
      margin-bottom: 0.5rem;
      line-height: 1.6;
    }
    
    .card-values {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;
      background: rgba(0, 0, 0, 0.2);
      padding: 1rem;
      border-radius: 8px;
    }
    
    .card-value-item {
      display: flex;
      align-items: center;
    }
    
    .card-symbol {
      background: rgba(255, 255, 255, 0.1);
      padding: 0.3rem 0.8rem;
      border-radius: 5px;
      min-width: 80px;
      display: inline-block;
      text-align: center;
      margin-right: 1rem;
      font-weight: bold;
      font-family: monospace;
      font-size: 1.1rem;
    }
    
    .note {
      font-style: italic;
      opacity: 0.8;
      font-size: 0.9rem;
      border-left: 3px solid #00b894;
      padding-left: 1rem;
    }
    
    @media (max-width: 768px) {
      .rules-page {
        padding: 1rem;
      }
      
      .rules-container {
        padding: 1.5rem;
      }
      
      h1 {
        font-size: 2rem;
      }
    }
  </style>