export async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUD_UPLOAD_PRESET;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return data.secure_url; 
}

export async function uploadImageToCloudinary(file: File, folder = "avatars"): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", import.meta.env.VITE_CLOUD_UPLOAD_PRESET);
  form.append("folder", import.meta.env.VITE_CLOUD_FOLDER || folder);

  const cloud = import.meta.env.VITE_CLOUD_NAME;
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
    method: "POST",
    body: form,
  });
  const json = await res.json();
  if (!json.secure_url) throw new Error("Upload Cloudinary failed");
  return json.secure_url as string;
}
