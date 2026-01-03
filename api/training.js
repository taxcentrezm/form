import { put, list } from '@vercel/blob';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET - Retrieve all training data
  if (req.method === 'GET') {
    try {
      const { blobs } = await list({ prefix: 'training/' });
      const trainingData = [];

      for (const blob of blobs) {
        const response = await fetch(blob.url);
        const data = await response.json();
        // Attach the blob url/pathname so we can identify it later if needed (though we just overwrite for now)
        trainingData.push({ ...data, id: blob.pathname });
      }

      // Sort by timestamp descending
      trainingData.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

      return res.status(200).json(trainingData);
    } catch (error) {
      console.error('❌ Error in GET /api/training:', error);
      return res.status(500).json({ error: 'Failed to load training data' });
    }
  }

  // POST - Save or Update training data
  if (req.method === 'POST') {
    try {
      const data = req.body;

      // If it's an update, we might want to use the existing ID/filename, 
      // but for simplicity with Blob, we'll just create a new one or overwrite if we had a consistent naming scheme.
      // Here we'll use a timestamp-based name for new entries.
      // If updating, the frontend could pass the original 'id' (pathname) to overwrite, 
      // but Vercel Blob 'put' with same path overwrites. 

      let filename;
      if (data.id) {
        // If ID exists, it's likely 'training/timestamp-user.json'. 
        // We can just use it directly if we want to overwrite, or parse it.
        // However, the 'id' from list() is the pathname.
        filename = data.id;
      } else {
        const timestamp = Date.now();
        // Sanitize user input for filename to avoid issues
        const safeUser = (data.user || 'anon').replace(/[^a-z0-9]/gi, '_').substring(0, 20);
        filename = `training/${timestamp}-${safeUser}.json`;
      }

      // Ensure timestamp is present
      const payload = {
        ...data,
        timestamp: data.timestamp || Date.now()
      };

      const blob = await put(filename, JSON.stringify(payload), {
        access: 'public',
        addRandomSuffix: false // We want to control the filename for updates
      });

      return res.status(200).json({ success: true, url: blob.url, id: filename });
    } catch (error) {
      console.error('❌ Error in POST /api/training:', error);
      return res.status(500).json({ error: 'Failed to save training data' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
