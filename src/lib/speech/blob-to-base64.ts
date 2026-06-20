export function readBlobAsBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Không đọc được file ghi âm"));
        return;
      }
      const base64 = result.split(",")[1];
      if (!base64) {
        reject(new Error("Không đọc được file ghi âm"));
        return;
      }
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Không đọc được file ghi âm"));
    reader.readAsDataURL(blob);
  });
}
