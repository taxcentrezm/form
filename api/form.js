import { put, list } from '@vercel/blob';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET - List all form submissions
  if (req.method === 'GET') {
    try {
      const { blobs } = await list({ prefix: 'forms/' });
      const forms = [];

      for (const blob of blobs) {
        const response = await fetch(blob.url);
        const data = await response.json();
        // Attach blob metadata
        forms.push({ ...data, blobName: blob.pathname, url: blob.url });
      }

      // Sort by timestamp descending
      forms.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

      return res.status(200).json(forms);
    } catch (error) {
      console.error('❌ Error in GET /api/form:', error);
      return res.status(500).json({ error: 'Failed to load forms' });
    }
  }

  // POST - Submit a new form
  if (req.method === 'POST') {
    try {
      const formData = req.body;
      const timestamp = Date.now();
      const filename = `forms/${timestamp}-submission.json`;

      const blob = await put(filename, JSON.stringify({ ...formData, timestamp }), {
        access: 'public',
        addRandomSuffix: false
      });

      return res.status(200).json({ success: true, url: blob.url });
    } catch (error) {
      console.error('❌ Error in POST /api/form:', error);
      return res.status(500).json({ error: 'Failed to save form' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
