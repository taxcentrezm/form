const fs = require('fs');

try {
    // Read preserved intents (handle potential BOM)
    let preservedContent = fs.readFileSync('preserved_intents.json', 'utf8');
    if (preservedContent.charCodeAt(0) === 0xFEFF) {
        preservedContent = preservedContent.slice(1);
    }
    const preserved = JSON.parse(preservedContent);

    // Read new FAQ intents
    const newFaqContent = fs.readFileSync('new_faq_intents.json', 'utf8');
    const newFaq = JSON.parse(newFaqContent);

    // Combine intents
    // preserved is an array of intents
    // newFaq is an object { intents: [...] }
    const allIntents = [...preserved, ...newFaq.intents];

    // Create final structure
    const finalJson = {
        "bot_meta": {
            "name": "ZRA Assistant",
            "language": "en-bem-loz-nya",
            "description": "Chatbot answering in English, Bemba, Lozi, and Nyanja regarding ZRA and Smart Invoice (Practice Note No. 1 of 2025)."
        },
        "intents": allIntents
    };

    // Write to final file
    fs.writeFileSync('public/assets/zra_intents.json', JSON.stringify(finalJson, null, 2), 'utf8');

    console.log(`Successfully merged intents.`);
    console.log(`Preserved intents: ${preserved.length}`);
    console.log(`New FAQ intents: ${newFaq.intents.length}`);
    console.log(`Total intents: ${allIntents.length}`);

} catch (error) {
    console.error('Error merging intents:', error);
    process.exit(1);
}
