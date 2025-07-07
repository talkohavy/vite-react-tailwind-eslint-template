import cors from 'cors';
import express, { type Request, type Response } from 'express';
import path from 'path';

const app = express();
const PORT = 3003;

const distFolderName = 'dist';

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, distFolderName)));

app.get('/', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, distFolderName, 'index.html'));
});

// Route for the "/base" page that the button will navigate to
app.get('/base', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, distFolderName, 'base.html'));
});

app.listen(PORT, () => {
  console.log(`Iframe server running on http://localhost:${PORT}`);
});
