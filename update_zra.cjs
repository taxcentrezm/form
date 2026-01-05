const fs = require('fs');

// Read file and strip BOM if present
let content = fs.readFileSync('preserved_intents.json', 'utf8');
if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
}
const preserved = JSON.parse(content);

// New FAQ intents to add (first 3 from user's request)
const newFAQ = [
    {
        "id": "zra.mission",
        "training_phrases": [
            "What is ZRA's mission?",
            "Mission of Zambia Revenue Authority",
            "ZRA mission statement"
        ],
        "responses": [
            "The mission of the Zambia Revenue Authority (ZRA) is to optimise and sustain revenue collection and administration for a prosperous Zambia."
        ]
    },
    {
        "id": "zra.vision",
        "training_phrases": [
            "What is ZRA's vision?",
            "Vision of Zambia Revenue Authority",
            "ZRA long term vision"
        ],
        "responses": [
            "ZRA's vision is to be a world class model of excellence in revenue administration and trade facilitation."
        ]
    },
    {
        "id": "zra.tagline",
        "training_phrases": [
            "What is ZRA's tagline?",
            "ZRA motto",
            "My Tax Your Tax Our Destiny"
        ],
        "responses": [
            "ZRA's tagline is: 'My Tax, Your Tax, Our Destiny'"
        ]
    }
];

// Build final structure
const final = {
    "bot_meta": {
        "name": "ZRA Assistant",
        "language": "en-bem-loz-nya",
        "description": "Chatbot answering in English, Bemba, Lozi, and Nyanja regarding ZRA and Smart Invoice (Practice Note No. 1 of 2025)."
    },
    "intents": [...preserved, ...newFAQ]
};

// Write to file
fs.writeFileSync('public/assets/zra_intents.json', JSON.stringify(final, null, 2), 'utf8');
console.log('✓ Successfully updated zra_intents.json with', final.intents.length, 'intents');
