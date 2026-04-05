import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Handle image upload (simulated for this environment)
  app.use(express.json({ limit: '50mb' }));
  
  app.post('/api/upload-featured', (req, res) => {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: 'No image provided' });
    
    // In a real app, we'd save to disk. Here we'll just acknowledge.
    // The user can also just upload a file to src/assets/featured.jpg
    res.json({ message: 'Image received' });
  });

  app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Simulate processing (e.g., sending an email)
    console.log(`Contact form submission:`, { name, email, message });
    
    res.json({ message: 'Message sent successfully' });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
