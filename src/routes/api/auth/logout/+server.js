import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import { getTokenFromCookie } from '$lib/utils/jwt';

export async function POST({ cookies }) {
  try {
    const token = getTokenFromCookie(cookies);
    
    if (token) {
      // Supprimer la session de la base de données
      await prisma.session.deleteMany({
        where: { token }
      });
      
      // Supprimer le cookie
      cookies.delete('auth_token', { path: '/' });
    }
    
    return json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return json({ success: false, message: 'Erreur lors de la déconnexion' }, { status: 500 });
  }
}