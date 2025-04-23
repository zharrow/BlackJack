import { json } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { prisma } from '$lib/prisma';
import { generateToken } from '$lib/utils/jwt';

export async function POST({ request, cookies }) {
  try {
    const { email, password } = await request.json();
    
    // Validation basique
    if (!email || !password) {
      return json({ success: false, message: 'Email et mot de passe requis' }, { status: 400 });
    }
    
    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      return json({ success: false, message: 'Identifiants invalides' }, { status: 401 });
    }
    
    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return json({ success: false, message: 'Identifiants invalides' }, { status: 401 });
    }
    
    // Générer un JWT
    const token = generateToken({ userId: user.id });
    
    // Stocker le token dans un cookie
    cookies.set('auth_token', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 7 jours
    });
    
    // Créer une session pour l'utilisateur
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 jours
      }
    });
    
    // Retourner les informations utilisateur (sans le mot de passe)
    return json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isGuest: user.isGuest
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return json({ success: false, message: 'Erreur lors de la connexion' }, { status: 500 });
  }
}