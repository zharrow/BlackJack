import { json } from '@sveltejs/kit';
import { getTokenFromCookie, getUserFromToken } from '$lib/utils/jwt';
import { prisma } from '$lib/prisma';

// Obtenir les stats du joueur
export async function GET({ cookies }) {
  try {
    const token = getTokenFromCookie(cookies);
    const user = await getUserFromToken(token, prisma);
    
    if (!user) {
      return json({ success: false, message: 'Non authentifié' }, { status: 401 });
    }
    
    // Récupérer les stats de l'utilisateur
    const stats = await prisma.stats.findUnique({
      where: { userId: user.id },
      include: {
        gameHistory: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });
    
    if (!stats) {
      return json({ success: false, message: 'Statistiques non trouvées' }, { status: 404 });
    }
    
    return json({ success: true, stats });
  } catch (error) {
    console.error('Stats GET error:', error);
    return json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}

// Mettre à jour les stats après une partie
export async function POST({ request, cookies }) {
  try {
    const token = getTokenFromCookie(cookies);
    const user = await getUserFromToken(token, prisma);
    
    if (!user) {
      return json({ success: false, message: 'Non authentifié' }, { status: 401 });
    }
    
    const { result, playerScore, dealerScore } = await request.json();
    
    // Valider les données
    if (!['win', 'loss', 'tie', 'blackjack', 'bust'].includes(result)) {
      return json({ success: false, message: 'Résultat invalide' }, { status: 400 });
    }
    
    // Mettre à jour les stats et ajouter l'historique de jeu
    const stats = await prisma.stats.findUnique({
      where: { userId: user.id }
    });
    
    if (!stats) {
      return json({ success: false, message: 'Statistiques non trouvées' }, { status: 404 });
    }
    
    // Préparer les données de mise à jour
    const updateData = {
      gamesPlayed: stats.gamesPlayed + 1
    };
    
    // Mettre à jour les statistiques en fonction du résultat
    if (result === 'win' || result === 'blackjack') {
      updateData.gamesWon = stats.gamesWon + 1;
      updateData.currentStreak = stats.currentStreak + 1;
      
      // Mettre à jour la plus longue série si nécessaire
      if (updateData.currentStreak > stats.longestStreak) {
        updateData.longestStreak = updateData.currentStreak;
      }
    } else if (result === 'loss' || result === 'bust') {
      updateData.gamesLost = stats.gamesLost + 1;
      updateData.currentStreak = 0;
    } else if (result === 'tie') {
      updateData.gamesTied = stats.gamesTied + 1;
      // La série ne change pas en cas d'égalité
    }
    
    // Mettre à jour le nombre de blackjacks et de busts
    if (result === 'blackjack') {
      updateData.blackjacks = stats.blackjacks + 1;
    } else if (result === 'bust') {
      updateData.busts = stats.busts + 1;
    }
    
    // Mise à jour des stats
    await prisma.stats.update({
      where: { id: stats.id },
      data: updateData
    });
    
    // Ajouter l'enregistrement de jeu à l'historique
    await prisma.gameRecord.create({
      data: {
        statsId: stats.id,
        result,
        playerScore,
        dealerScore
      }
    });
    
    return json({ success: true });
  } catch (error) {
    console.error('Stats POST error:', error);
    return json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}