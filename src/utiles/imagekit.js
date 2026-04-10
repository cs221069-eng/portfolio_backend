const fs = require('fs');
const ImageKit = require('@imagekit/nodejs');

const client = new ImageKit({
  privateKey: process.env['IMAGEKIT_PRIVATE_KEY'],
});

async function uploadImage(file) {
  const response = await client.files.upload({
    file: fs.createReadStream(file.path),
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
  const response = await client.files.upload({
    file: fs.createReadStream(file.path),
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
