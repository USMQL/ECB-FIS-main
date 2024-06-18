import { agregarDocumento } from './firebaseUtils';

export function initUser(user){
    agregarDocumento("users", {
        displayName: user.email.split('@')[0],
        bio: null,
        email: user.email,
        emailVerified: user.emailVerified,
        isAdmin: false,
        isProfesor: false,
        isAnonymous: user.isAnonymous,
        phoneNumber: user.phoneNumber===undefined ? null : user.phoneNumber,
        photoURL: user.photoURL===undefined ? null : user.photoURL,
        disabled: false,
        stats: {
          logros: [],
          rachaEjerciciosDiarios: 0,
          rachaEjerciciosGenerados: 0,
          recompensas: [],
          ejerciciosCreados: [],
          ejerciciosEnCurso: [],
          ejerciciosTerminados: [],
          ejerciciosIntentados: [],
          puntajeTotal: 0,
        },
        userVisibilitySettings: {
          showEmail: false,
          showPhoneNumber: false,
          showBio: true,
          showPhotoURL: true,
          showLogros: true,
          showRacha: true,
          showRecompensas: true,
          showPuntajeTotal: true,
        },
      }, user.uid);
}