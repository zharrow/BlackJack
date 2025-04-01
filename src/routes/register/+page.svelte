<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { authStore } from '$lib/stores/authStore';
    import { fade, fly } from 'svelte/transition';
    
    let username = '';
    let email = '';
    let password = '';
    let confirmPassword = '';
    let agreeTerms = false;
    let isLoading = false;
    let errorMessage = '';
    
    $: if ($authStore.error) {
      errorMessage = $authStore.error;
    }
    
    $: if ($authStore.isAuthenticated) {
      goto('/game');
    }
    
    async function handleRegister() {
      // Validation des champs
      if (!username || !email || !password || !confirmPassword) {
        errorMessage = 'Veuillez remplir tous les champs';
        return;
      }
      
      if (password !== confirmPassword) {
        errorMessage = 'Les mots de passe ne correspondent pas';
        return;
      }
      
      if (!agreeTerms) {
        errorMessage = 'Vous devez accepter les conditions d\'utilisation';
        return;
      }
      
      // Validation basique de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errorMessage = 'Veuillez entrer une adresse email valide';
        return;
      }
      
      // Validation basique du mot de passe
      if (password.length < 6) {
        errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
        return;
      }
      
      isLoading = true;
      errorMessage = '';
      
      const success = await authStore.register(username, email, password);
      
      isLoading = false;
      
      if (success) {
        goto('/game');
      }
    }
    
    function goBack() {
      goto('/');
    }
  </script>
  
  <div class="register-page">
    <div class="backdrop"></div>
    
    <div class="register-container" in:fade={{ duration: 300 }}>
      <button class="back-button" on:click={goBack}>
        <span>←</span> Retour
      </button>
      
      <h1>Créer un compte</h1>
      
      {#if errorMessage}
        <div class="error-message" in:fly={{ y: -10, duration: 200 }}>
          {errorMessage}
        </div>
      {/if}
      
      <form on:submit|preventDefault={handleRegister}>
        <div class="form-group">
          <label for="username">Pseudo</label>
          <input 
            type="text" 
            id="username" 
            bind:value={username} 
            disabled={isLoading} 
            placeholder="VotreNom"
            autocomplete="username"
          />
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            bind:value={email} 
            disabled={isLoading} 
            placeholder="votre@email.com"
            autocomplete="email"
          />
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input 
              type="password" 
              id="password" 
              bind:value={password} 
              disabled={isLoading}
              autocomplete="new-password"
            />
          </div>
          
          <div class="form-group">
            <label for="confirm-password">Confirmer</label>
            <input 
              type="password" 
              id="confirm-password" 
              bind:value={confirmPassword} 
              disabled={isLoading}
              autocomplete="new-password"
            />
          </div>
        </div>
        
        <div class="form-options">
          <label class="checkbox-container">
            <input type="checkbox" bind:checked={agreeTerms} disabled={isLoading}>
            <span class="checkmark"></span>
            J'accepte les <a href="#" class="terms-link">conditions d'utilisation</a>
          </label>
        </div>
        
        <button type="submit" class="register-button" disabled={isLoading}>
          {#if isLoading}
            <div class="spinner-small"></div>
          {:else}
            S'inscrire
          {/if}
        </button>
      </form>
      
      <div class="separator">
        <span>ou</span>
      </div>
      
      <div class="login-prompt">
        Vous avez déjà un compte ? 
        <a href="/login" class="login-link">Se connecter</a>
      </div>
      
      <div class="guest-prompt">
        <button class="guest-button" on:click={() => goto('/')}>
          Jouer en tant qu'invité
        </button>
      </div>
    </div>
  </div>
  
  <style>
    .register-page {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 2rem;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: white;
    }
    
    .backdrop {
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
    
    .register-container {
      position: relative;
      z-index: 1;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 15px;
      padding: 2.5rem;
      width: 100%;
      max-width: 500px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .back-button {
      position: absolute;
      top: 1rem;
      left: 1rem;
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.9rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: color 0.2s;
    }
    
    .back-button:hover {
      color: white;
    }
    
    .back-button span {
      margin-right: 5px;
    }
    
    h1 {
      text-align: center;
      margin-bottom: 2rem;
      font-size: 2rem;
      font-weight: 700;
    }
    
    .error-message {
      background: rgba(231, 76, 60, 0.3);
      color: white;
      padding: 0.8rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      border-left: 3px solid #e74c3c;
    }
    
    .form-group {
      margin-bottom: 1.5rem;
      width: 100%;
    }
    
    .form-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 0;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      font-size: 0.9rem;
    }
    
    input[type="text"],
    input[type="email"],
    input[type="password"] {
      width: 100%;
      padding: 0.8rem 1rem;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
      font-size: 1rem;
      transition: all 0.3s;
    }
    
    input[type="text"]:focus,
    input[type="email"]:focus,
    input[type="password"]:focus {
      outline: none;
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.3);
    }
    
    input::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
    
    .form-options {
      display: flex;
      align-items: center;
      margin-bottom: 1.5rem;
      font-size: 0.9rem;
    }
    
    .checkbox-container {
      display: flex;
      align-items: center;
      cursor: pointer;
    }
    
    .checkbox-container input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }
    
    .checkmark {
      position: relative;
      display: inline-block;
      height: 18px;
      width: 18px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 4px;
      margin-right: 8px;
    }
    
    .checkbox-container:hover input ~ .checkmark {
      background: rgba(255, 255, 255, 0.15);
    }
    
    .checkbox-container input:checked ~ .checkmark {
      background: #0984e3;
      border-color: #0984e3;
    }
    
    .checkmark:after {
      content: "";
      position: absolute;
      display: none;
    }
    
    .checkbox-container input:checked ~ .checkmark:after {
      display: block;
    }
    
    .checkbox-container .checkmark:after {
      left: 6px;
      top: 2px;
      width: 4px;
      height: 9px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
    
    .terms-link {
      color: #0984e3;
      text-decoration: none;
    }
    
    .terms-link:hover {
      text-decoration: underline;
    }
    
    .register-button {
      width: 100%;
      padding: 1rem;
      border: none;
      border-radius: 8px;
      background: linear-gradient(135deg, #fdcb6e 0%, #e17055 100%);
      color: white;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .register-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }
    
    .register-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    .spinner-small {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .separator {
      display: flex;
      align-items: center;
      margin: 2rem 0;
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.9rem;
    }
    
    .separator::before,
    .separator::after {
      content: '';
      flex: 1;
      height: 1px;
      background: rgba(255, 255, 255, 0.2);
    }
    
    .separator span {
      padding: 0 1rem;
    }
    
    .login-prompt {
      text-align: center;
      margin-bottom: 1.5rem;
      color: rgba(255, 255, 255, 0.8);
    }
    
    .login-link {
      color: #0984e3;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s;
    }
    
    .login-link:hover {
      color: #6c5ce7;
      text-decoration: underline;
    }
    
    .guest-prompt {
      text-align: center;
    }
    
    .guest-button {
      background: none;
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: rgba(255, 255, 255, 0.7);
      padding: 0.7rem 1.5rem;
      border-radius: 8px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s;
    }
    
    .guest-button:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }
    
    /* Responsive */
    @media (max-width: 600px) {
      .form-row {
        flex-direction: column;
        gap: 0;
      }
    }
  </style>