import { useState } from "react";
import { postData } from "@/lib/api";
import { toast } from "sonner";

type Folder = "thumbnails" | "videos" | "resources" | "previews";

export function usePresignedUpload() {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  async function upload(file: File, folder: Folder): Promise<string> {
    setIsUploading(true);
    setProgress(0);

    try {
      const { presignedUrl, publicUrl } = await postData<{
        presignedUrl: string;
        publicUrl: string;
      }>("/upload/presigned-url", {
        filename: file.name,
        contentType: file.type,
        folder,
      });

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`S3 upload failed: ${xhr.status}`));
          }
        };
        xhr.onerror = () => reject(new Error("Upload failed"));
        xhr.open("PUT", presignedUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });

      setProgress(100);
      return publicUrl;
    } catch (err) {
      toast.error("Upload failed. Please try again.");
      throw err;
    } finally {
      setIsUploading(false);
    }
  }

  return { upload, progress, isUploading };
}
