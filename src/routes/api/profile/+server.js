import { json } from '@sveltejs/kit';
import { getTokenFromCookie, getUserFromToken } from '$lib/utils/jwt';
import { prisma } from '$lib/prisma';

// Obtenir le profil de l'utilisateur
export async function GET({ cookies }) {
  try {
    const token = getTokenFromCookie(cookies);
    const user = await getUserFromToken(token, prisma);
    
    if (!user) {
      return json({ success: false, message: 'Non authentifié' }, { status: 401 });
    }
    
    // Récupérer le profil de l'utilisateur avec les stats
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            isGuest: true,
            createdAt: true
          }
        }
      }
    });
    
    if (!profile) {
      return json({ success: false, message: 'Profil non trouvé' }, { status: 404 });
    }
    
    // Récupérer également les statistiques
    const stats = await prisma.stats.findUnique({
      where: { userId: user.id }
    });
    
    return json({ 
      success: true, 
      profile: {
        ...profile,
        stats: stats || {}
      }
    });
  } catch (error) {
    console.error('Profile GET error:', error);
    return json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}

// Mettre à jour le profil utilisateur
export async function PUT({ request, cookies }) {
  try {
    const token = getTokenFromCookie(cookies);
    const user = await getUserFromToken(token, prisma);
    
    if (!user) {
      return json({ success: false, message: 'Non authentifié' }, { status: 401 });
    }
    
    const { avatarUrl, theme, tableColor, cardStyle, soundEnabled, musicEnabled } = await request.json();
    
    // Récupérer le profil actuel
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    });
    
    if (!profile) {
      return json({ success: false, message: 'Profil non trouvé' }, { status: 404 });
    }
    
    // Mettre à jour le profil
    const updatedProfile = await prisma.profile.update({
      where: { id: profile.id },
      data: {
        avatarUrl: avatarUrl !== undefined ? avatarUrl : profile.avatarUrl,
        theme: theme !== undefined ? theme : profile.theme,
        tableColor: tableColor !== undefined ? tableColor : profile.tableColor,
        cardStyle: cardStyle !== undefined ? cardStyle : profile.cardStyle,
        soundEnabled: soundEnabled !== undefined ? soundEnabled : profile.soundEnabled,
        musicEnabled: musicEnabled !== undefined ? musicEnabled : profile.musicEnabled
      }
    });
    
    return json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error('Profile PUT error:', error);
    return json({ success: false, message: 'Erreur lors de la mise à jour du profil' }, { status: 500 });
  }
}