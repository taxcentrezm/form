export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    const HF_TOKEN = process.env.HF_TOKEN || "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";

    try {
        const response = await fetch(
            "https://router.huggingface.co/hf-inference/models/facebook/mms-tts-bem",
            {
                headers: {
                    Authorization: `Bearer ${HF_TOKEN}`,
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({ inputs: text }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Hugging Face API error:", errorText);
            return res.status(response.status).json({ error: 'Hugging Face API error', details: errorText });
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        res.setHeader('Content-Type', 'audio/mpeg');
        return res.send(buffer);
    } catch (error) {
        console.error("TTS Proxy Error:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
