import { supabase } from "@/integrations/supabase/client";

const BUCKET = "media";

/** Envia um arquivo para a pasta privada do usuário e devolve uma URL temporária. */
export async function uploadMedia(file: File, folder = "uploads") {
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) throw new Error("Entre na sua conta para enviar arquivos.");

  const ext = file.name.split(".").pop() ?? "png";
  const path = `${userId}/${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type || "image/png",
    upsert: false,
  });
  if (error) throw error;

  return { path, url: await signedUrl(path) };
}

export async function signedUrl(path: string, expiresIn = 60 * 60 * 24 * 7) {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, expiresIn);
  if (error) throw error;
  return data.signedUrl;
}

export async function removeMedia(path: string) {
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw error;
}
