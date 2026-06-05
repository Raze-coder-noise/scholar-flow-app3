'use client';

import { useState, useCallback } from 'react';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { UploadedFile } from '@/types';
import { validateFile, getFileType } from '@/utils/file-validator';
import { v4 as uuid } from 'uuid';

interface UploadProgress {
  fileId: string;
  percent: number;
}

export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (file: File, userId: string): Promise<UploadedFile | null> => {
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return null;
    }

    setUploading(true);
    const fileId = uuid();

    try {
      const fileRef = ref(storage, `uploads/${userId}/${fileId}/${file.name}`);
      const snapshot = await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);

      const uploadedFile: UploadedFile = {
        id: fileId,
        userId,
        name: file.name,
        size: file.size,
        type: getFileType(file),
        url: downloadUrl,
        storageRef: snapshot.ref.fullPath,
        uploadedAt: new Date(),
      };

      return uploadedFile;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  const deleteFile = useCallback(async (storageRef: string) => {
    try {
      await deleteObject(ref(storage, storageRef));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Delete failed';
      setError(errorMessage);
    }
  }, []);

  return { uploadFile, deleteFile, uploading, progress, error };
}
