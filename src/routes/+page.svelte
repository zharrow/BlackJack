<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/authStore';
	import { gsap } from 'gsap';
	import { fade, fly } from 'svelte/transition';
	
	let username = "";
	let isLoading = false;
	let showGuestInput = false;
	
	onMount(() => {
	  // Animation du titre et des cartes
	  gsap.from(".title", { 
		y: -50, 
		opacity: 0, 
		duration: 1, 
		ease: "back.out(1.7)" 
	  });
	  
	  gsap.from(".card-icon", { 
		scale: 0, 
		opacity: 0, 
		duration: 0.8, 
		stagger: 0.2, 
		ease: "back.out(2)" 
	  });
	  
	  // Précharger les sons
	  const cardSound = new Audio('/sounds/card-flip.mp3');
	  cardSound.volume = 0;
	  cardSound.play().catch(() => {});
	});
	
	function playAsGuest() {
	  if (!showGuestInput) {
		showGuestInput = true;
		return;
	  }
	  
	  if (!username.trim()) {
		username = "Invité";
	  }
	  
	  isLoading = true;
	  
	  // Enregistrer le nom d'utilisateur dans le store
	  authStore.setGuest(username);
	  
	  // Rediriger vers le jeu
	  setTimeout(() => {
		goto('/game');
	  }, 800);
	}
	
	function goToLogin() {
	  isLoading = true;
	  goto('/login');
	}
	
	function goToRegister() {
	  isLoading = true;
	  goto('/register');
	}
  </script>
  
  <div class="welcome-screen">
	<div class="backdrop"></div>
	
	<!-- Cartes décoratives -->
	<div class="cards-decoration">
	  <span class="card-icon">♠️</span>
	  <span class="card-icon">♥️</span>
	  <span class="card-icon">♣️</span>
	  <span class="card-icon">♦️</span>
	</div>
  
	<div class="content-container" in:fade={{ duration: 800, delay: 200 }}>
	  <h1 class="title">Blackjack</h1>
	  <p class="subtitle">L'expérience casino ultime</p>
	  
	  {#if isLoading}
		<div class="loading">
		  <div class="spinner"></div>
		  <p>Chargement...</p>
		</div>
	  {:else}
		<div class="menu-container">
		  {#if showGuestInput}
			<div class="guest-input" in:fly={{ y: 20, duration: 300 }}>
			  <input 
				type="text" 
				bind:value={username} 
				placeholder="Entrez votre pseudo"
				autofocus
			  />
			  <button on:click={playAsGuest} class="btn play-btn">Jouer</button>
			</div>
		  {:else}
			<button on:click={playAsGuest} class="btn play-btn">
			  Jouer en tant qu'invité
			</button>
		  {/if}
		  
		  <div class="separator">
			<span>ou</span>
		  </div>
		  
		  <div class="auth-buttons">
			<button on:click={goToLogin} class="btn login-btn">
			  Se connecter
			</button>
			<button on:click={goToRegister} class="btn register-btn">
			  S'inscrire
			</button>
		  </div>
		</div>
	  {/if}
	  
	  <!-- Footer avec mentions légales et version -->
	  <div class="footer">
		<p>© 2025 Blackjack · Version 1.0.0</p>
		<p>Tous droits réservés · <a href="#">Conditions d'utilisation</a></p>
	  </div>
	</div>
  </div>
  
  <style>
	.welcome-screen {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  justify-content: center;
	  height: 100vh;
	  width: 100%;
	  position: relative;
	  overflow: hidden;
	  color: white;
	  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	}
	
	.backdrop {
	  position: absolute;
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
	
	.content-container {
	  position: relative;
	  z-index: 10;
	  text-align: center;
	  max-width: 90%;
	  width: 440px;
	  padding: 2rem;
	}
	
	.title {
	  font-size: 5rem;
	  font-weight: 800;
	  margin: 0;
	  color: white;
	  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
	  letter-spacing: 3px;
	}
	
	.subtitle {
	  font-size: 1.2rem;
	  opacity: 0.8;
	  margin-top: 0.5rem;
	  margin-bottom: 3rem;
	}
	
	.cards-decoration {
	  position: absolute;
	  top: 0;
	  left: 0;
	  right: 0;
	  bottom: 0;
	  z-index: 5;
	  overflow: hidden;
	  pointer-events: none;
	}
	
	.card-icon {
	  position: absolute;
	  font-size: 8rem;
	  opacity: 0.1;
	}
	
	.card-icon:nth-child(1) {
	  top: 20%;
	  left: 15%;
	  transform: rotate(-15deg);
	}
	
	.card-icon:nth-child(2) {
	  top: 50%;
	  right: 15%;
	  transform: rotate(20deg);
	}
	
	.card-icon:nth-child(3) {
	  bottom: 15%;
	  left: 25%;
	  transform: rotate(10deg);
	}
	
	.card-icon:nth-child(4) {
	  top: 10%;
	  right: 25%;
	  transform: rotate(-25deg);
	}
	
	.menu-container {
	  display: flex;
	  flex-direction: column;
	  gap: 1.5rem;
	  margin-bottom: 3rem;
	}
	
	.btn {
	  background: none;
	  border: none;
	  padding: 1rem 1.8rem;
	  font-family: 'Montserrat', sans-serif;
	  font-weight: 600;
	  font-size: 1rem;
	  border-radius: 30px;
	  cursor: pointer;
	  transition: all 0.3s ease;
	  color: white;
	  letter-spacing: 1px;
	  position: relative;
	  overflow: hidden;
	  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
	}
	
	.btn:hover {
	  transform: translateY(-3px);
	  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
	}
	
	.play-btn {
	  background: linear-gradient(135deg, #00b894 0%, #00cec9 100%);
	}
	
	.login-btn {
	  background: linear-gradient(135deg, #0984e3 0%, #6c5ce7 100%);
	}
	
	.register-btn {
	  background: linear-gradient(135deg, #fdcb6e 0%, #e17055 100%);
	}
	
	.separator {
	  display: flex;
	  align-items: center;
	  color: rgba(255, 255, 255, 0.5);
	  font-size: 0.9rem;
	  margin: 0.5rem 0;
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
	
	.auth-buttons {
	  display: flex;
	  gap: 1rem;
	}
	
	.auth-buttons .btn {
	  flex: 1;
	}
	
	.guest-input {
	  display: flex;
	  gap: 0.5rem;
	}
	
	input {
	  flex: 1;
	  padding: 0.8rem 1rem;
	  border-radius: 20px;
	  border: none;
	  background: rgba(255, 255, 255, 0.1);
	  color: white;
	  font-family: 'Montserrat', sans-serif;
	  font-size: 1rem;
	  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.2);
	}
	
	input::placeholder {
	  color: rgba(255, 255, 255, 0.5);
	}
	
	input:focus {
	  outline: none;
	  background: rgba(255, 255, 255, 0.15);
	}
	
	.loading {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  gap: 1rem;
	  margin-bottom: 3rem;
	}
	
	.spinner {
	  width: 40px;
	  height: 40px;
	  border: 3px solid rgba(255, 255, 255, 0.3);
	  border-radius: 50%;
	  border-top-color: white;
	  animation: spin 1s ease-in-out infinite;
	}
	
	@keyframes spin {
	  to { transform: rotate(360deg); }
	}
	
	.footer {
	  margin-top: auto;
	  font-size: 0.8rem;
	  opacity: 0.5;
	}
	
	.footer p {
	  margin: 0.3rem 0;
	}
	
	.footer a {
	  color: white;
	  text-decoration: none;
	}
	
	.footer a:hover {
	  text-decoration: underline;
	}
	
	/* Responsive */
	@media (max-width: 600px) {
	  .title {
		font-size: 3.5rem;
	  }
	  
	  .auth-buttons {
		flex-direction: column;
	  }
	  
	  .guest-input {
		flex-direction: column;
	  }
	}
  </style>