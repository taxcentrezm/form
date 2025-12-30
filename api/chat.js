// Simple chat logging endpoint for Vercel serverless
import { put, list } from '@vercel/blob';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET - Retrieve chat messages
  if (req.method === 'GET') {
    try {
      const blobs = await list({ prefix: 'chat/' });
      const messages = [];

      for (const blob of blobs.blobs) {
        const response = await fetch(blob.url);
        const msg = await response.json();
        messages.push(msg);
      }

      return res.status(200).json(messages);
    } catch (error) {
      console.error('❌ Error in GET /api/chat:', error);
      return res.status(500).json({ error: 'Failed to load chat messages' });
    }
  }

  // POST - Save chat message
  if (req.method === 'POST') {
    try {
      const { sender, text } = req.body;

      if (!sender || !text) {
        return res.status(400).json({ error: 'Missing sender or text' });
      }

      const timestamp = Date.now();
      const filename = `chat/${timestamp}-${sender}.json`;

      const blob = await put(filename, JSON.stringify({ sender, text, timestamp }), {
        access: 'public',
      });

      return res.status(200).json({ success: true, url: blob.url });
    } catch (error) {
      console.error('❌ Error in POST /api/chat:', error);
      return res.status(500).json({ error: 'Failed to save chat message' });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
}
