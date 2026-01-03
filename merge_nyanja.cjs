const fs = require('fs');
const path = require('path');

const zraPath = path.join(__dirname, 'public', 'assets', 'zra_intents.json');
const nyanjaPath = path.join(__dirname, 'nyanja_update.json');

console.log(`Reading ${zraPath}...`);
const zraData = JSON.parse(fs.readFileSync(zraPath, 'utf8'));

console.log(`Reading ${nyanjaPath}...`);
const nyanjaData = JSON.parse(fs.readFileSync(nyanjaPath, 'utf8'));

// Update bot_meta
console.log('Updating bot_meta...');
zraData.bot_meta = nyanjaData.bot_meta;

// Merge intents
console.log('Merging intents...');
nyanjaData.intents.forEach(newIntent => {
    const existingIndex = zraData.intents.findIndex(i => i.id === newIntent.id);
    if (existingIndex !== -1) {
        console.log(`Updating existing intent: ${newIntent.id}`);
        zraData.intents[existingIndex] = newIntent;
    } else {
        console.log(`Adding new intent: ${newIntent.id}`);
        zraData.intents.push(newIntent);
    }
});

// Update fallback
console.log('Updating fallback...');
// Avoid duplicates in fallback responses
nyanjaData.fallback.responses.forEach(response => {
    if (!zraData.fallback.responses.includes(response)) {
        zraData.fallback.responses.push(response);
    }
});

// Write back
console.log(`Writing back to ${zraPath}...`);
fs.writeFileSync(zraPath, JSON.stringify(zraData, null, 4), 'utf8');

console.log('Done!');
