const ImageKit = require('@imagekit/nodejs');

const client = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

/**
 * Upload any file (image, pdf, etc.)
 * Vercel safe (ONLY buffer)
 */
async function uploadFile(file) {
  const uploadSource = file?.buffer;

  if (!uploadSource) {
    throw new Error('No file buffer found for upload.');
  }

  const response = await client.upload({
    file: uploadSource,
    fileName: file.originalname || `file-${Date.now()}`
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
  const uploadSource = file?.buffer;

  if (!uploadSource) {
    throw new Error('No file buffer found for image upload.');
  }

  const response = await client.upload({
    file: uploadSource,
    fileName: file.originalname || `image-${Date.now()}.jpg`
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

  return await client.deleteFile(fileId);
}

/**
 * Get file details
 */
async function getFileDetails(fileId) {
  if (!fileId) return null;

  return await client.getFileDetails(fileId);
}

module.exports = {
  uploadFile,
  uploadImage,
  deleteFile,
  getFileDetails
};
