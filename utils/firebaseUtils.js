import { db, storage } from '../firebase-config';
import { addDoc, collection, doc, setDoc, updateDoc } from 'firebase/firestore';
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
            const docRef = await setDoc(doc(db, table, id), data);
            return docRef.id;
        }
        else {
            const docRef = await addDoc(collection(db, table), data);
            return docRef.id;
        }
    } catch(error) {
        console.error("Error adding document: ", error);
    }
    return null;
}