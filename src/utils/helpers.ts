//Convert Hex to Uint8Array (Raw Binary Data)

import { IUploadPayload } from "../pages/project/types/interface";

const hexToUint8Array = (hex: string) => {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
};

// Convert Hex to Base64 (For Images, PDFs, etc.)
export const hexToBase64 = (hex: string, mimeType: string) => {
  const bytes = hexToUint8Array(hex);

  // Process bytes in chunks to avoid stack overflow
  const CHUNK_SIZE = 1024;
  let binary = "";

  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    const chunk = bytes.slice(i, i + CHUNK_SIZE);

    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }

  return `data:${mimeType};base64,${btoa(binary)}`;
};

// Convert Hex to Blob URL (For Large Files like DOCX, XLSX, etc.)
export const hexToBlobURL = (hex: string, mimeType: string) => {
  const bytes = hexToUint8Array(hex);
  const blob = new Blob([bytes], { type: mimeType });
  return URL.createObjectURL(blob);
};

// Convert Hex to String (For Text Files)
export const hexToString = (hex: string) => {
  const bytes = hexToUint8Array(hex);
  return new TextDecoder().decode(bytes);
};

// Function to convert file to hex string
export const fileToHex = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const uint8Array = new Uint8Array(arrayBuffer);

      // Convert Uint8Array to hex string
      let hexString = "";
      for (let i = 0; i < uint8Array.length; i++) {
        const hex = uint8Array[i].toString(16).padStart(2, "0");
        hexString += hex;
      }

      resolve(hexString);
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsArrayBuffer(file);
  });
};


export const convertFileToBase64 = (file: File): Promise<IUploadPayload> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                const result = reader.result as string;
                const base64String = result.split(',')[1]; // remove data:<mime>;base64, part
                const mimeType = result.split(';')[0].split(':')[1];
                resolve({ base64String, mimeType });
            };

            reader.onerror = (error) => {
                reject(error);
            };

            reader.readAsDataURL(file);
        });
    }