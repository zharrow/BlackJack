<script>
    import { fade } from 'svelte/transition';
    import { onMount } from 'svelte';
    
    let loaded = false;
    
    onMount(() => {
      loaded = true;
    });
  </script>
  
  {#if loaded}
    <div class="auth-layout" in:fade={{ duration: 300 }}>
      <div class="auth-backdrop"></div>
      
      <div class="auth-container">
        <a href="/" class="logo-link">
          <div class="logo">
            <span class="logo-text">Blackjack</span>
          </div>
        </a>
        
        <slot />
      </div>
    </div>
  {/if}
  
  <style>
    .auth-layout {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      width: 100%;
      position: relative;
      overflow: hidden;
      padding: 1rem;
    }
    
    .auth-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url('/images/table-texture.jpg');
      background-size: cover;
      background-position: center;
      opacity: 0.15;
      z-index: 0;
    }
    
    .auth-container {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 500px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .logo-link {
      text-decoration: none;
      margin-bottom: 2rem;
    }
    
    .logo {
      text-align: center;
    }
    
    .logo-text {
      font-size: 3rem;
      font-weight: 800;
      color: white;
      text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
      letter-spacing: 3px;
      background: linear-gradient(90deg, #00b894, #00cec9);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  </style>