import jwt from 'jsonwebtoken';
import { env } from '$env/dynamic/private';

// Générer un JWT
export function generateToken(payload) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  });
}

// Vérifier un JWT
export function verifyToken(token) {
  try {
    return jwt.verify(token, env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Extraire le token du cookie
export function getTokenFromCookie(cookies) {
  return cookies.get('auth_token');
}

// Obtenir l'utilisateur à partir du token
export async function getUserFromToken(token, prisma) {
  if (!token) return null;
  
  const decoded = verifyToken(token);
  if (!decoded) return null;
  
  // Trouver l'utilisateur par ID
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: {
      id: true,
      username: true,
      email: true,
      isGuest: true,
      createdAt: true
    }
  });
  
  return user;
}