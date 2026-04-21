const ImageKit = require('@imagekit/nodejs');

const client = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

function ensureImageKitConfig() {
  const missingVars = [
    'IMAGEKIT_PUBLIC_KEY',
    'IMAGEKIT_PRIVATE_KEY',
    'IMAGEKIT_URL_ENDPOINT'
  ].filter((key) => !process.env[key]);

  if (missingVars.length) {
    throw new Error(`Missing ImageKit environment variables: ${missingVars.join(', ')}`);
  }
}

/**
 * Upload any file (image, pdf, etc.)
 * Vercel safe (ONLY buffer)
 */
async function uploadFile(file) {
  ensureImageKitConfig();

  if (!file?.buffer) {
    throw new Error("No file buffer found");
  }

  // 🔥 IMPORTANT: convert buffer to base64
  const base64File = file.buffer.toString('base64');

  const response = await client.files.upload({
    file: base64File, // ✅ THIS FIXES ERROR
    fileName: file.originalname || `file-${Date.now()}`,
    folder: "/resumes"
  });

  return {
    url: response.url,
    fileId: response.fileId,
    response
  };
}

/**
 * Upload Image (same logic, separated for clarity)
 */
async function uploadImage(file) {
  ensureImageKitConfig();

  if (!file?.buffer) {
    throw new Error('No file buffer found for image upload.');
  }

  const base64File = file.buffer.toString('base64');

  const response = await client.files.upload({
    file: base64File,
    fileName: file.originalname || `image-${Date.now()}.jpg`,
    folder: '/projects',
    useUniqueFileName: true
  });

  return {
    url: response.url,
    fileId: response.fileId,
    response
  };
}

/**
 * Delete file from ImageKit
 */
async function deleteFile(fileId) {
  if (!fileId) return;

  return await client.files.delete(fileId);
}

/**
 * Get file details
 */
async function getFileDetails(fileId) {
  if (!fileId) return null;

  return await client.files.get(fileId);
}

module.exports = {
  uploadFile,
  uploadImage,
  deleteFile,
  getFileDetails
};
