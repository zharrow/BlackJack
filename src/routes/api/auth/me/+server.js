import { json } from '@sveltejs/kit';
import { getTokenFromCookie, getUserFromToken } from '$lib/utils/jwt';
import { prisma } from '$lib/prisma';

export async function GET({ cookies }) {
  try {
    const token = getTokenFromCookie(cookies);
    const user = await getUserFromToken(token, prisma);
    
    if (!user) {
      return json({ success: false, message: 'Non authentifié' }, { status: 401 });
    }
    
    return json({ success: true, user });
  } catch (error) {
    console.error('ME endpoint error:', error);
    return json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}