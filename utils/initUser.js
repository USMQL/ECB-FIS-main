import { Alert } from 'react-native';
import { actualizarDocumento, agregarDocumento, obtenerDocumento } from './firebaseUtils';

export function initUserDB(user){
    agregarDocumento("users", {
        displayName: user.email.split('@')[0],
        bio: null,
        email: user.email,
        emailVerified: user.emailVerified,
        isAdmin: false,
        isProfesor: false,
        isAnonymous: user.isAnonymous,
        avatar: null,
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
          puntajeTotal: {
            ejerciciosDiarios: 0,
            ejerciciosGenerados: 0,
          }
        },
        visibilitySettings: {
          showEmail: false,
          showBio: true,
          showAvatar: true,
          showLogros: true,
          showRacha: true,
          showRecompensas: true,
          showPuntajeTotal: true,
        },
      }, user.uid);
}

export async function getUserDB(user){
  const doc = await obtenerDocumento("users", user.uid).catch((error) => {
    Alert.alert("Ups!", "Ha ocurrido un error al intentar obtener los datos del usuario");
  })
  return doc.data();
}

export async function updateUserDB(user, data){
  return await actualizarDocumento("users", data, user.uid).catch((error) => {
    Alert.alert("Ups!", "Ha ocurrido un error al intentar actualizar los datos del usuario");
  });
}