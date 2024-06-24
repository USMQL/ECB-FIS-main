import { Alert } from 'react-native';
import { actualizarDocumento, agregarDocumento, obtenerDocumento } from './firebaseUtils';

export function initUserDB(user){
    agregarDocumento("users", {
        displayName: "hitler",
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
  if (!user) return null;
  let doc = null;

  async function obtDoc(){
    doc = await obtenerDocumento("users", user.uid).catch((error) => {
      Alert.alert("Ups!", "Ha ocurrido un error al intentar obtener los datos del usuario", [
        {text: "Reintentar", style: 'default', onPress: obtDoc()}
      ]);
    });
  }
  await obtDoc();
  return doc?.data()? (doc.data()) : (null);
}

export async function updateUserDB(user, data){
  return await actualizarDocumento("users", data, user.uid).catch((error) => {
    Alert.alert("Ups!", "Ha ocurrido un error al intentar actualizar los datos del usuario");
  });
}

const subscribers = [];
export async function refreshUserDB(user){
  const userData = await getUserDB(user);
  subscribers.forEach(callback => callback(userData));
  return;
}

export function subscribeUserDB(callback){
  if (!subscribers.includes(callback)) subscribers.push(callback);
  return () => {
    const index = subscribers.indexOf(callback);
    if (index > -1) {
      subscribers.splice(index, 1);
    }
    return true;
  };
}