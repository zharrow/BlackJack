import { getTokenFromCookie, getUserFromToken } from '$lib/utils/jwt';
import { prisma } from '$lib/prisma';

// Routes protégées qui nécessitent une authentification
const protectedRoutes = [
  '/game',
  '/profile',
  '/stats',
  '/settings'
];

// Routes réservées aux invités (non-authentifiés)
const guestRoutes = [
  '/(auth)/login',
  '/(auth)/register'
];

export async function handle({ event, resolve }) {
  const { cookies, url } = event;
  const path = url.pathname;
  
  // Extraire le token du cookie
  const token = getTokenFromCookie(cookies);
  
  // Récupérer l'utilisateur à partir du token
  const user = token ? await getUserFromToken(token, prisma) : null;
  
  // Stocker l'utilisateur dans l'event.locals pour qu'il soit accessible partout
  event.locals.user = user;
  
  // Vérifier si la route est protégée
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isGuestRoute = guestRoutes.some(route => path === route);
  
  // Rediriger si nécessaire
  if (isProtectedRoute && !user) {
    // L'utilisateur n'est pas authentifié et essaie d'accéder à une route protégée
    return new Response(null, {
      status: 302,
      headers: { Location: '/login' }
    });
  }
  
  if (isGuestRoute && user) {
    // L'utilisateur est déjà authentifié et essaie d'accéder à une route réservée aux invités
    return new Response(null, {
      status: 302,
      headers: { Location: '/game' }
    });
  }
  
  // Résoudre la requête normalement
  return resolve(event);
}