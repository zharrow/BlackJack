<script>
    import { authStore } from '$lib/stores/authStore';
    import { preloadAllSounds } from '$lib/utils/soundManager';
    import { onMount } from 'svelte';
    import { fade, fly } from 'svelte/transition';
    import { goto } from '$app/navigation';
    
    /** @type {{ user?: { isGuest: boolean, username: string }, path?: string }} */
    export let data;
    
    let showMenu = false;
    let loaded = false;
    
    // Si on a des données utilisateur côté serveur, les mettre dans le store
    $: if (data?.user && !$authStore.isAuthenticated) {
      $authStore.user = data.user;
      $authStore.isAuthenticated = true;
      $authStore.isGuest = data.user.isGuest;
      $authStore.username = data.user.username;
    }
    
    onMount(() => {
      loaded = true;
      // L'utilisateur doit interagir avec la page avant que les sons ne fonctionnent
      const handleFirstInteraction = () => {
        preloadAllSounds();
        document.removeEventListener('click', handleFirstInteraction);
      };
      // On attend que l'utilisateur clique sur la page pour charger les sons
      // Cela permet de respecter les règles de lecture automatique des navigateurs
      document.addEventListener('click', handleFirstInteraction);
    });

    
    function toggleMenu() {
      showMenu = !showMenu;
    }
    
    async function logout() {
      showMenu = false;
      await authStore.logout();
      goto('/');
    }
  </script>
  
  {#if loaded}
    <div class="app" in:fade={{ duration: 300 }}>
      <header>
        <div class="logo">
          <a href="/">
            <span class="logo-text">Blackjack</span>
          </a>
        </div>
        
        <nav>
          <ul class="nav-links">
            <li><a href="/game" class:active={data.path === '/game'}>Jouer</a></li>
            <li><a href="/rules" class:active={data.path === '/rules'}>Règles</a></li>
            <li><a href="/stats" class:active={data.path === '/stats'}>Statistiques</a></li>
          </ul>
        </nav>
        
        <div class="user-area">
          {#if $authStore.isAuthenticated}
            <button class="user-button" on:click={toggleMenu}>
              <span class="user-name">{$authStore.username}</span>
              <span class="user-icon">{$authStore.isGuest ? '👤' : '👑'}</span>
            </button>
            
            {#if showMenu}
              <div class="user-menu" transition:fade={{ duration: 150 }}>
                <ul>
                  <li><a href="/profile">Profil</a></li>
                  <li><a href="/settings">Paramètres</a></li>
                  <li><button on:click={logout}>Déconnexion</button></li>
                </ul>
              </div>
            {/if}
          {:else}
            <div class="auth-buttons">
              <a href="/login" class="login-button">Connexion</a>
              <a href="/register" class="register-button">S'inscrire</a>
            </div>
          {/if}
        </div>
      </header>
      
      <main>
        <slot></slot>
      </main>
      
      <footer>
        <div class="footer-content">
          <p>&copy; 2025 Blackjack - Tous droits réservés</p>
          <div class="footer-links">
            <a href="/about">À propos</a>
            <a href="/terms">Conditions d'utilisation</a>
            <a href="/privacy">Politique de confidentialité</a>
          </div>
        </div>
      </footer>
    </div>
  {/if}
  
  <style>
    .app {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    
    header {
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.8rem 2rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      z-index: 100;
    }
    
    .logo a {
      text-decoration: none;
      color: white;
      display: flex;
      align-items: center;
    }
    
    .logo-text {
      font-size: 1.5rem;
      font-weight: 700;
      background: linear-gradient(90deg, #00b894, #00cec9);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .nav-links {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 2rem;
    }
    
    .nav-links a {
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s;
      position: relative;
      padding: 0.3rem 0;
    }
    
    .nav-links a:hover {
      color: white;
    }
    
    .nav-links a::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, #00b894, #00cec9);
      transition: width 0.3s;
    }
    
    .nav-links a:hover::after,
    .nav-links a.active::after {
      width: 100%;
    }
    
    .nav-links a.active {
      color: white;
      font-weight: 600;
    }
    
    .user-area {
      position: relative;
    }
    
    .user-button {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 30px;
      padding: 0.4rem 1rem;
      color: white;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .user-button:hover {
      background: rgba(255, 255, 255, 0.15);
    }
    
    .user-icon {
      font-size: 1.2rem;
    }
    
    .user-menu {
      position: absolute;
      top: calc(100% + 10px);
      right: 0;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      border-radius: 8px;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
      min-width: 180px;
      z-index: 100;
    }
    
    .user-menu ul {
      list-style: none;
      padding: 0.5rem 0;
      margin: 0;
    }
    
    .user-menu li {
      padding: 0;
    }
    
    .user-menu a,
    .user-menu button {
      display: block;
      padding: 0.7rem 1rem;
      text-decoration: none;
      color: white;
      font-size: 0.9rem;
      text-align: left;
      width: 100%;
      background: none;
      border: none;
      cursor: pointer;
      transition: background 0.2s;
    }
    
    .user-menu a:hover,
    .user-menu button:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    
    .auth-buttons {
      display: flex;
      gap: 1rem;
    }
    
    .login-button,
    .register-button {
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 30px;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.2s;
    }
    
    .login-button {
      color: white;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .login-button:hover {
      background: rgba(255, 255, 255, 0.2);
    }
    
    .register-button {
      color: white;
      background: linear-gradient(135deg, #0984e3 0%, #6c5ce7 100%);
    }
    
    .register-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
    }
    
    main {
      flex: 1;
      display: flex;
      flex-direction: column;
	  justify-content: center;
	  align-items: center;
    }
    
    footer {
      background: rgba(0, 0, 0, 0.3);
      padding: 1rem 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.6);
    }
    
    .footer-links {
      display: flex;
      gap: 1rem;
    }
    
    .footer-links a {
      color: rgba(255, 255, 255, 0.6);
      text-decoration: none;
      transition: color 0.2s;
    }
    
    .footer-links a:hover {
      color: white;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      header {
        padding: 0.8rem 1rem;
      }
      
      .nav-links {
        gap: 1rem;
      }
      
      .user-name {
        display: none;
      }
      
      .auth-buttons {
        gap: 0.5rem;
      }
      
      .login-button,
      .register-button {
        padding: 0.4rem 0.8rem;
        font-size: 0.8rem;
      }
      
      .footer-content {
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
      }
    }
    
    @media (max-width: 600px) {
      .nav-links {
        display: none;
      }
    }
  </style>