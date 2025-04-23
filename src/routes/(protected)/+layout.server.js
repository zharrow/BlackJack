export function load({ locals }) {
    // Transmettre les données utilisateur aux routes enfants
    return {
      user: locals.user
    };
  }