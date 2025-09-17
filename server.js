export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
}

  // Handle POST request
  if (req.method === 'POST') {
    try {
      const data = req.body;

      // Log the received data
      console.log('Received form data:', data);

      // You can add validation, storage, or email logic here

      return res.status(200).send('Form submitted successfully!');
} catch (error) {
      console.error('Error processing form:', error);
      return res.status(500).send('Internal Server Error');
}
}

  // Handle unsupported methods
  return res.status(405).send('Method Not Allowed');
}
