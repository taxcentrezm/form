const fs = require('fs');
const path = require('path');

const intentsPath = path.join(__dirname, 'public', 'assets', 'zra_intents.json');
let content = fs.readFileSync(intentsPath, 'utf8');
const data = JSON.parse(content);

data.intents.forEach(intent => {
    intent.responses = intent.responses.map(response => {
        // Replace ZRA with Zambia Revenue Authority in responses
        // Using word boundary \b to avoid matching inside other words (if any)
        return response.replace(/\bZRA\b/g, 'Zambia Revenue Authority');
    });
});

fs.writeFileSync(intentsPath, JSON.stringify(data, null, 2));
console.log('Successfully expanded ZRA in all responses.');
