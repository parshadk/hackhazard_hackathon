const multer = require('multer'); // Use require for CommonJS modules
import { v4 as uuid } from 'uuid';

const storage = multer.diskStorage({
  destination(req:any, file:any, cb:any) {
    cb(null, 'uploads');
  },
  filename(req:any, file:any, cb:any) {
    const id = uuid();
    const extName = file.originalname.split('.').pop();
    const fileName = `${id}.${extName}`;
    console.log(fileName);
    
    cb(null, fileName);
  },
});

export const uploadFiles = multer({ storage }).single('file');
