"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFiles = void 0;
const multer = require('multer'); // Use require for CommonJS modules
const uuid_1 = require("uuid");
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads');
    },
    filename(req, file, cb) {
        const id = (0, uuid_1.v4)();
        const extName = file.originalname.split('.').pop();
        const fileName = `${id}.${extName}`;
        cb(null, fileName);
    },
});
exports.uploadFiles = multer({ storage }).single('file');
