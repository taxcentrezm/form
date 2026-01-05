import json

preserved = [
  {"id": "greeting.general", "training_phrases": ["Hi", "Hello", "Good morning", "Good afternoon", "Good evening"], "responses": ["Hello, welcome to the Zambia Revenue Authority virtual assistant. How can you be helped today?", "Welcome to the ZRA assistant. Ask anything about tax changes for 2025, Smart Invoice, VAT or other ZRA services."]},
  {"id": "greeting.general.bemba", "training_phrases": ["Shani", "Mulishani", "Mwashibukeni", "Mwaiseni", "Chungulo mukwai", "Ulishani", "Mwapoleni"], "responses": ["Mulishani, mwaiseni ku Zambia Revenue Authority virtual assistant. Ungafwa ifyo nafwa ifyo lelo?", "Mwaiseni ku ZRA assistant. Funda ilibantu ifitile ku tax changes ya 2025, Smart Invoice, VAT na ifilomboshi fyi ZRA."]},
  {"id": "greeting.bemba", "training_phrases": ["Shani", "Mulishani", "Mwaiseni", "Mwashibukeni", "Chungulo mukwai"], "responses": ["Ndi bwino, ngaiwe? Mwaiseni mukwai.", "Natotela. Kuti namwafwa shani lelo?"]},
  {"id": "greeting.bemba.fine", "training_phrases": ["Ndi bwino", "Ndi fye bwino"], "responses": ["Cawama. Kuti namwafwa shani na ZRA?", "Natotela. Mungepusha pa Smart Invoice nangu imisonkho."]},
  {"id": "greeting.nyanja", "training_phrases": ["Moni", "Muli bwanji", "Muli bwanji?", "Bwanji", "Mwauka bwanji", "Mwadzuka bwanji"], "responses": ["Ndili bwino, kaya inu? Zikomo.", "Ndili bwino. Mungafunse za misonkho kapena Smart Invoice."]},
  {"id": "greeting.nyanja.fine", "training_phrases": ["Ndili bwino", "Ndili bwino zikomo", "Ndili bwino, inu bwanji?", "Ndili bwino kaya inu?", "Ndili bwino chomene"], "responses": ["Zikomo. Mungafunse za misonkho kapena Smart Invoice.", "Chabwino. Ndingakuthandizeni bwanji lero?"]},
  {"id": "greeting.tonga", "training_phrases": ["Mwalumezi", "Mwabuka buti", "Mwabuka buti?"], "responses": ["Ndililabotu. Mwapona buti?", "Ndililabotu. Ingamugwasya buti sunu?"]},
  {"id": "greeting.tonga.fine", "training_phrases": ["Ndililabotu", "Ndililabotu zikomo"], "responses": ["Kabotu. Ingamugwasya buti sunu?", "Zikomo. Amubuzye zya Smart Invoice."]},
  {"id": "greeting.lozi", "training_phrases": ["Lumela", "Mlumeleng", "U pila cwang", "U zuhile cwang", "Mutozi chwani", "Muzuhile"], "responses": ["Na pila hande, wena u pila cwang?", "Ni itumezi. Mutozi cwani?"]},
  {"id": "greeting.lozi.fine", "training_phrases": ["Na pila hande", "Na pila hande zikomo"], "responses": ["Ni itumezi. Mwakona kubuza za Smart Invoice kapa mitelo.", "Hande. Mwakona kubuza za ZRA."]},
  {"id": "greeting.about_bot", "training_phrases": ["What can you do?", "How can you help me?", "Who are you?", "What is this chatbot for?"], "responses": ["This assistant provides general guidance on recent Zambian tax changes for 2025, including income tax, VAT, Smart Invoice requirements, turnover tax, mobile money levy and other topics covered in Practice Note No. 1 of 2025. It does not replace the law or official ZRA advice."]},
  {"id": "greeting.about_bot.bemba", "training_phrases": ["Ngecita cinshi?", "Ungandi fwila shani?", "Nni ni ni?", "Ichi chatbot ni fi?", "Uli kucita cinshi?", "Njipusheko?"], "responses": ["Ichi assistant chipapula amafunika yakusowa ku tax changes za Zambian za 2025, pantu income tax, VAT, Smart Invoice requirements, turnover tax, mobile money levy na ifilomboshi fyi Practice Note No. 1 ya 2025. Tachipelela law na official ZRA advice."]},
  {"id": "zra.definition", "training_phrases": ["What is the Zambia Revenue Authority?", "What is ZRA?", "Define ZRA"], "responses": ["ZRA is the statutory body that administers and collects taxes and related levies in Zambia, including income tax, VAT, customs and excise duties, and specific charges like the mobile money transaction levy."]},
  {"id": "zra.definition.bemba", "training_phrases": ["ZRA ni cinshi?", "Zambia Revenue Authority ni cinshi?", "Eleka ZRA", "ZRA yaliba cinshi?", "ZRA icitika cinshi?"], "responses": ["ZRA ni boma body ifyo ili kukukwata na kulemeka amisonkho na related levies mu Zambia, pantu income tax, VAT, customs na excise duties, na specific charges nga mobile money transaction levy."]},
  {"id": "zra.mission_vision", "training_phrases": ["What is ZRA's mission?", "What is ZRA's vision?", "ZRA mission and vision", "Tell me about ZRA"], "responses": ["ZRA's mission is to optimise and sustain revenue collection and administration for a prosperous Zambia.", "ZRA's vision is to be a world class model of excellence in revenue administration and trade facilitation.", "The ZRA tagline is: \"My Tax, Your Tax, Our Destiny\"."]},
  {"id": "zra.mission_vision.bemba", "training_phrases": ["ZRA yakusowa cinshi?", "ZRA mission ni cinshi?", "ZRA vision ni cinshi?", "Fundula ZRA", "ZRA balandako cinshi?"], "responses": ["ZRA's mission ni kukukwata na kusunga revenue collection na administration for a prosperous Zambia.", "ZRA's vision ni ku ba world class model of excellence mu revenue administration na trade facilitation.", "ZRA tagline ni: \"My Tax, Your Tax, Our Destiny\"."]}
]

# Load existing file to get FAQ intents
with open('public/assets/zra_intents.json', 'r', encoding='utf-8') as f:
    existing = json.load(f)

# Filter FAQ intents (all non-greeting intents after the preserved ones)
faq = [i for i in existing['intents'] if i['id'] not in [p['id'] for p in preserved]]

# Combine
final = {
    "bot_meta": existing['bot_meta'],
    "intents": preserved + faq
}

with open('public/assets/zra_intents.json', 'w', encoding='utf-8') as f:
    json.dump(final, f, indent=2, ensure_ascii=False)

print('✓ Updated zra_intents.json')
