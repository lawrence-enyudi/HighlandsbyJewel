import { supabase } from "@/lib/supabase";

const STORAGE_BUCKET = 'project-images';

export async function uploadImageToStorage(
  file: File,
  projectId: string,
  imageType: 'map' | 'price_list',
  index: number
): Promise<{ url: string; path: string }> {
  // Create a unique file path
  const fileExt = file.name.split('.').pop();
  const fileName = `${imageType}-${Date.now()}-${index}.${fileExt}`;
  const filePath = `${projectId}/${fileName}`;

  // Upload file to Supabase Storage
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath);

  return {
    url: publicUrl,
    path: filePath
  };
}

export async function deleteImageFromStorage(path: string): Promise<void> {
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([path]);

  if (error) {
    console.error(`Failed to delete image: ${error.message}`);
    // Don't throw here, as we want to continue even if deletion fails
  }
}

export async function deleteProjectImages(projectId: string): Promise<void> {
  // List all files in the project folder
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .list(projectId);

  if (error) {
    console.error(`Failed to list project images: ${error.message}`);
    return;
  }

  if (data && data.length > 0) {
    const paths = data.map(file => `${projectId}/${file.name}`);
    const { error: deleteError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove(paths);

    if (deleteError) {
      console.error(`Failed to delete project images: ${deleteError.message}`);
    }
  }
}

export async function fileToCompressedDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

// For backward compatibility during migration
export async function migrateDataUrlToStorage(
  dataUrl: string,
  projectId: string,
  imageType: 'map' | 'price_list',
  index: number
): Promise<{ url: string; path: string }> {
  // Convert data URL to blob
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  
  // Create a File object from the blob
  const file = new File([blob], `image-${index}.png`, { type: blob.type });
  
  return uploadImageToStorage(file, projectId, imageType, index);
}
