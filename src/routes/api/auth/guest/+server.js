import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import { generateToken } from '$lib/utils/jwt';

export async function POST({ request, cookies }) {
  try {
    const { username } = await request.json();
    const guestName = username || `Invité-${Math.floor(Math.random() * 10)}`;
    
    // Créer un utilisateur invité temporaire
    const user = await prisma.user.create({
      data: {
        username: `${guestName} #${Math.floor(Math.random() * 10000)}`, // Assurer l'unicité
        email: `guest${Date.now()}@tempmail.com`, // Email temporaire unique
        password: 'guest-account', // Mot de passe par défaut pour les invités
        isGuest: true,
        profile: {
          create: {} // Créer un profil avec les valeurs par défaut
        },
        stats: {
          create: {} // Créer des stats avec les valeurs par défaut
        }
      },
      select: {
        id: true,
        username: true,
        email: true,
        isGuest: true
      }
    });
    
    // Générer un JWT
    const token = generateToken({ userId: user.id });
    
    // Stocker le token dans un cookie
    cookies.set('auth_token', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 1 // 1 jour pour les invités
    });
    
    // Créer une session pour l'utilisateur invité
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1) // 1 jour
      }
    });
    
    return json({ success: true, user });
  } catch (error) {
    console.error('Guest login error:', error);
    return json({ success: false, message: 'Erreur lors de la connexion en tant qu\'invité' }, { status: 500 });
  }
}