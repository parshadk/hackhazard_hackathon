const multer = require('multer'); 
import { v4 as uuid } from 'uuid';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'course-content', 
      public_id: uuid(), 
      resource_type: 'auto', 
      format: file.originalname.split('.').pop(), 
    };
  },
});

export const uploadFiles = multer({ storage }).single('file');