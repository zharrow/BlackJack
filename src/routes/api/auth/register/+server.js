import { json } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { prisma } from '$lib/prisma';
import { generateToken } from '$lib/utils/jwt';

export async function POST({ request, cookies }) {
  try {
    const { username, email, password } = await request.json();
    
    // Validation basique
    if (!username || !email || !password) {
      return json({ success: false, message: 'Tous les champs sont requis' }, { status: 400 });
    }
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });
    
    if (existingUser) {
      return json({ success: false, message: 'Cet email ou ce nom d\'utilisateur est déjà utilisé' }, { status: 400 });
    }
    
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
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
    
    return json({ success: true, user });
  } catch (error) {
    console.error('Register error:', error);
    return json({ success: false, message: 'Erreur lors de l\'inscription' }, { status: 500 });
  }
}