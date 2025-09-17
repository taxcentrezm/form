export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
}

  // Handle POST request
  if (req.method === 'POST') {
    const data = req.body;
    console.log('Received form data:', data);
    return res.status(200).send('Form submitted successfully!');
}

  // Handle other methods
  return res.status(405).send('Method Not Allowed');
}
