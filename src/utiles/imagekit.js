const fs = require('fs');
const ImageKit = require('@imagekit/nodejs');

const client = new ImageKit({
  privateKey: process.env['IMAGEKIT_PRIVATE_KEY'],
});

async function uploadImage(file) {
  const uploadSource = file?.buffer ?? (file?.path ? fs.createReadStream(file.path) : null);

  if (!uploadSource) {
    throw new Error('No upload data found for image file.');
  }

  const response = await client.files.upload({
    file: uploadSource,
    fileName: file.originalname || `project-${Date.now()}.jpg`,
  });

  const url = process.env['IMAGEKIT_URL_ENDPOINT']
    ? client.helper.buildSrc({
        urlEndpoint: process.env['IMAGEKIT_URL_ENDPOINT'],
        src: response.filePath,
      })
    : response.url;

  return {
    url,
    response,
  };
}

async function uploadFile(file) {
  const uploadSource = file?.buffer ?? (file?.path ? fs.createReadStream(file.path) : null);

  if (!uploadSource) {
    throw new Error('No upload data found for file upload.');
  }

  const response = await client.files.upload({
    file: uploadSource,
    fileName: file.originalname || `file-${Date.now()}`,
  });

  const url = process.env['IMAGEKIT_URL_ENDPOINT']
    ? client.helper.buildSrc({
        urlEndpoint: process.env['IMAGEKIT_URL_ENDPOINT'],
        src: response.filePath,
      })
    : response.url;

  return {
    url,
    response,
  };
}

async function deleteFile(fileId) {
  if (!fileId) {
    return;
  }

  await client.files.delete(fileId);
}

async function getFileDetails(fileId) {
  if (!fileId) {
    return null;
  }

  return client.files.get(fileId);
}

module.exports = {
  uploadImage,
  uploadFile,
  deleteFile,
  getFileDetails,
};
