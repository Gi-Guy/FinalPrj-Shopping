import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req: express.Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, path.join(__dirname, '../../pictures'));
  },
  filename: (req: express.Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post('/', upload.single('image'), (req: express.Request, res: express.Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileUrl = `/pictures/${req.file.filename}`;
  res.status(201).json({ url: fileUrl });
});

export default router;
