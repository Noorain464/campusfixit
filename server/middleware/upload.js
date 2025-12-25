import fs from "fs";
import multer from "multer";
import path from "path";
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const uploadDir = "uploads";
    try {
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (err) {
      cb(err);
    }
  },
  filename(req, file, cb) {
    cb(
      null,
      `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(
        file.originalname
      )}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only images allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
