import { db, storage } from '../firebase-config';
import { addDoc, collection, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';

export async function subirArchivo(archivo, carpeta) {
    if (!archivo) return null;

    // Convertir el archivo a blob. https://firebase.google.com/docs/storage/web/upload-files?hl=es&authuser=0#upload_from_a_blob_or_file
    const response = await fetch(archivo);
    const blob = await response.blob();

    // Creando una referencia al archivo.
    const fileName = archivo.split('/').pop();
    const ruta = `${carpeta}/${fileName}`;
    const fileRef = ref(storage, ruta);

    await uploadBytes(fileRef, blob).catch((error) => {
        console.error('Error al subir el archivo', error);
    });
    return ruta;
}

export async function agregarDocumento(table, data, id) {
    try {
        if (id) {
            await setDoc(doc(db, table, id), data);
            return id;
        }
        const docRef = await addDoc(collection(db, table), data);
        return docRef.id;
    } catch(error) {
        console.error("Error al intentar agregar el documento: ", error);
    }
    return null;
}

export async function actualizarDocumento(table, data, id) {
    return await updateDoc(doc(db, table, id), data).catch((error) => {
        console.error("Error al actualizar el documento:", error);
        throw error;
    });
}

export async function obtenerDocumento(table, id) {
    return await getDoc(doc(db, table, id)).catch((error) => {
        console.error("Error al obtener el documento:", error);
        throw error;
    });
}

export async function obtenerColeccion(table) {
    return await getDocs(collection(db, table)).catch((error) => {
        console.error("Error al obtener la colección:", error);
        throw error;
    });
}