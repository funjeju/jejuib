import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './client';

export async function uploadVerificationDocument(
  userId: string,
  documentType: string,
  file: File
): Promise<string> {
  try {
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const storagePath = `verifications/${userId}/${documentType}_${timestamp}.${fileExtension}`;
    const fileRef = ref(storage, storagePath);

    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);

    return storagePath;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getDocumentDownloadURL(storagePath: string): Promise<string> {
  try {
    const fileRef = ref(storage, storagePath);
    return await getDownloadURL(fileRef);
  } catch (error: any) {
    throw new Error(error.message);
  }
}
