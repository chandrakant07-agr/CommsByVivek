import multer from "multer";

const storage = multer.diskStorage({
    destination: (_, _, cb) => {
        cb(null, "public/temp/");
    },
    filename: (_, file, cb) => {
        const fileName = `${Date.now()}_${file.originalname.replace(/\s+/g, '-')}`;
        cb(null, fileName);
    },
});

const upload = multer({ storage });

export default upload;