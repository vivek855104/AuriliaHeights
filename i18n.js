/* Aurelia Heights: Hindi and Marathi text. Each table is keyed by the English text it replaces, so anything
   missing here simply stays in English. Building and project names are brand names and are not translated.
   Loaded as a plain script before the page so the loading screen can use the chosen language straight away. */
(function(){
const hi={
  /* interface */
  'Daylight':'दिन','Golden hour':'सुनहरी शाम','Night':'रात',
  'The project':'परियोजना','Sample flat':'सैंपल फ्लैट','Residences':'आवास',
  'Two towers around a five-acre garden.':'पाँच एकड़ के बगीचे के चारों ओर दो टावर।',
  'Fly around the site, pick a tower, then step inside a sample flat. The slider at the top takes the day into night.':
    'साइट के ऊपर घूमिए, कोई टावर चुनिए, फिर किसी सैंपल फ्लैट के अंदर जाइए। ऊपर का स्लाइडर दिन को रात में बदलता है।',
  'Towers':'टावर','Homes':'घर','Open space':'खुली जगह','Configurations':'फ्लैट के प्रकार',
  'in two towers':'दो टावरों में','of the site, approx.':'साइट का, लगभग','floors':'मंज़िलें','Floors':'मंज़िलें',
  'Lifts':'लिफ़्ट','Per floor':'प्रति मंज़िल','Floor':'मंज़िल','Penthouses':'पेंटहाउस',
  'Amenities':'सुविधाएँ','Sample flats you can walk into':'सैंपल फ्लैट जिनमें आप घूम सकते हैं','What is here':'यहाँ क्या है',
  'In this home':'इस घर में','Specifications':'विशिष्टताएँ',
  'Demo only: names and specifications are placeholders.':'केवल डेमो: नाम और विशिष्टताएँ उदाहरण मात्र हैं।',
  'Site':'साइट','Back':'वापस','Faces the central garden':'केंद्रीय बगीचे की ओर','high-speed lifts':'हाई-स्पीड लिफ़्ट',
  'Carpet area':'कार्पेट एरिया','Layout':'लेआउट','Outlook':'नज़ारा','+ terrace':'+ टेरेस','carpet':'कार्पेट',
  'Flat':'फ्लैट','sq ft':'वर्ग फ़ुट','homes':'घर','Amenity':'सुविधा',
  'The whole home is furnished: use the room buttons below to walk from the entry through every room.':
    'पूरा घर सुसज्जित है: नीचे दिए कमरों के बटन से प्रवेश द्वार से हर कमरे तक घूमिए।',
  'You are standing in the master bedroom, with its attached bath and balcony.':
    'आप मास्टर बेडरूम में खड़े हैं, जिसके साथ अटैच्ड बाथरूम और बालकनी है।',
  'You are standing in the master bedroom, with its attached bath and private terrace.':
    'आप मास्टर बेडरूम में खड़े हैं, जिसके साथ अटैच्ड बाथरूम और निजी टेरेस है।',
  /* loading screens */
  'Loading':'लोड हो रहा है','Structure':'संरचना','Materials':'सामग्री','Landscape':'परिदृश्य','Welcome':'स्वागत है',
  'Entering':'प्रवेश','Taking you to the real experience':'आपको असली अनुभव की ओर ले जा रहे हैं',
  /* room viewpoints */
  'Entry':'प्रवेश','Living':'लिविंग रूम','Dining':'डाइनिंग','Kitchen':'रसोई','Master':'मास्टर बेडरूम','Master Bath':'मास्टर बाथ',
  'Bedroom 2':'बेडरूम 2','Bathroom':'बाथरूम','Balcony':'बालकनी','View':'नज़ारा','Bed':'बिस्तर','Lounge':'लाउंज',
  'Window':'खिड़की','Bath':'बाथ',
  /* flat types */
  'Penthouse':'पेंटहाउस','4 BHK Sky Penthouse':'4 BHK स्काई पेंटहाउस',
  '2 bed · 2 bath':'2 बेडरूम · 2 बाथरूम','3 bed · 3 bath':'3 बेडरूम · 3 बाथरूम','4 bed · 5 bath':'4 बेडरूम · 5 बाथरूम',
  'Garden':'बगीचा','Garden and pool':'बगीचा और पूल','Open sky and the city':'खुला आसमान और शहर',
  'A generous, light-filled home. The living room opens onto a balcony over the garden, and the master bedroom you are standing in has its own bath.':
    'एक खुला, रोशनी से भरा घर। लिविंग रूम बगीचे के ऊपर बालकनी में खुलता है, और जिस मास्टर बेडरूम में आप खड़े हैं उसका अपना बाथरूम है।',
  'Three bedrooms and a separate dining area, with two balconies. The master suite shown here has an attached bath and looks across the garden toward the pool.':
    'तीन बेडरूम और अलग डाइनिंग एरिया, दो बालकनियों के साथ। यहाँ दिखाए गए मास्टर सुइट में अटैच्ड बाथरूम है और यहाँ से बगीचे के पार पूल दिखता है।',
  'The top floor, given to just a few homes. A double-height living room, four bedrooms, and a private terrace with a plunge pool off the master suite.':
    'सबसे ऊपरी मंज़िल, जो केवल कुछ घरों के लिए है। डबल-हाइट लिविंग रूम, चार बेडरूम, और मास्टर सुइट से लगा प्लंज पूल वाला निजी टेरेस।',
  'Two bedrooms, two baths':'दो बेडरूम, दो बाथरूम','Modular kitchen with chimney':'चिमनी के साथ मॉड्यूलर किचन',
  'Sun-facing balcony':'धूप वाली बालकनी','Wardrobes in both bedrooms':'दोनों बेडरूम में वार्डरोब','Video door phone':'वीडियो डोर फ़ोन',
  'Split AC points':'स्प्लिट एसी पॉइंट','Piped gas':'पाइप्ड गैस','Covered parking for one car':'एक कार के लिए कवर्ड पार्किंग',
  'Three bedrooms, three baths':'तीन बेडरूम, तीन बाथरूम','Modular kitchen and utility':'मॉड्यूलर किचन और यूटिलिटी',
  'Two balconies':'दो बालकनियाँ','Walk-in wardrobe':'वॉक-इन वार्डरोब','Air-conditioning in all rooms':'सभी कमरों में एयर-कंडीशनिंग',
  'Two covered parking spaces':'दो कवर्ड पार्किंग','Four bedrooms, five baths':'चार बेडरूम, पाँच बाथरूम',
  'Private terrace with plunge pool':'प्लंज पूल के साथ निजी टेरेस','Double-height living room':'डबल-हाइट लिविंग रूम',
  'Walk-in wardrobes':'वॉक-इन वार्डरोब','Home automation':'होम ऑटोमेशन','Air-conditioning throughout':'पूरे घर में एयर-कंडीशनिंग',
  'Private lift lobby':'निजी लिफ़्ट लॉबी','Three covered parking spaces':'तीन कवर्ड पार्किंग',
  /* specifications */
  'Earthquake-resistant RCC frame':'भूकंपरोधी आरसीसी ढाँचा','Flooring':'फ़्लोरिंग',
  'Large-format vitrified tiles; engineered oak in the master bedroom':'बड़े आकार की विट्रिफ़ाइड टाइलें; मास्टर बेडरूम में इंजीनियर्ड ओक',
  'Granite counter, stainless steel sink, modular cabinets':'ग्रेनाइट काउंटर, स्टेनलेस स्टील सिंक, मॉड्यूलर कैबिनेट',
  'Bathrooms':'बाथरूम','Branded sanitaryware and fittings, glass shower partition':'ब्रांडेड सैनिटरीवेयर और फ़िटिंग, काँच का शावर पार्टीशन',
  'Windows':'खिड़कियाँ','Aluminium frames with clear float glass':'साफ़ फ़्लोट ग्लास के साथ एल्युमिनियम फ़्रेम',
  'Power':'बिजली','Full back-up for lifts and common areas':'लिफ़्ट और कॉमन एरिया के लिए पूरा बैक-अप',
  /* buildings */
  '18 floors · 2 and 3 BHK, sky penthouses':'18 मंज़िलें · 2 और 3 BHK, स्काई पेंटहाउस','15 floors · 2 and 3 BHK homes':'15 मंज़िलें · 2 और 3 BHK घर',
  'Gym, games, banquet hall and café':'जिम, खेल, बैंक्वेट हॉल और कैफ़े','25 m lap pool, kids’ pool and sun deck':'25 मी लैप पूल, बच्चों का पूल और सन डेक',
  'Lawns, jogging track and kids’ play area':'लॉन, जॉगिंग ट्रैक और बच्चों का खेल क्षेत्र',
  'The taller of the two towers. Every flat looks over the central garden, and the eighteenth floor is given to sky penthouses with private terraces.':
    'दोनों टावरों में ऊँचा। हर फ्लैट से केंद्रीय बगीचा दिखता है, और अठारहवीं मंज़िल निजी टेरेस वाले स्काई पेंटहाउस के लिए है।',
  'Fifteen floors of two and three bedroom homes, a short walk across the garden from the clubhouse and the pool.':
    'दो और तीन बेडरूम वाले घरों की पंद्रह मंज़िलें, बगीचे के पार क्लबहाउस और पूल से थोड़ी ही दूरी पर।',
  'Two floors of shared space for residents: a glass-walled gym and café at ground level, the banquet hall and games rooms above, and a roof garden on top.':
    'निवासियों के लिए साझा जगह की दो मंज़िलें: भूतल पर काँच की दीवारों वाला जिम और कैफ़े, ऊपर बैंक्वेट हॉल और खेल के कमरे, और छत पर रूफ़ गार्डन।',
  'A 25 metre lap pool between the towers, with a shallow splash pool for children, a teak sun deck and loungers on both sides.':
    'टावरों के बीच 25 मीटर का लैप पूल, बच्चों के लिए उथला स्प्लैश पूल, सागौन का सन डेक और दोनों ओर लाउंजर।',
  'The heart of the site: open lawns ringed by a 300 metre jogging track, with a fountain plaza, a shaded pergola corner and a children’s play area.':
    'साइट का दिल: 300 मीटर जॉगिंग ट्रैक से घिरे खुले लॉन, फव्वारा प्लाज़ा, छायादार पर्गोला कोना और बच्चों का खेल क्षेत्र।',
  'Air-conditioned gym':'वातानुकूलित जिम','Yoga and aerobics studio':'योग और एरोबिक्स स्टूडियो','Indoor games room':'इनडोर गेम्स रूम',
  'Banquet hall':'बैंक्वेट हॉल','Café and lounge':'कैफ़े और लाउंज','Guest suites':'गेस्ट सुइट','Mini theatre':'मिनी थिएटर','Library':'पुस्तकालय',
  '25 m lap pool':'25 मी लैप पूल','Kids’ splash pool':'बच्चों का स्प्लैश पूल','Sun loungers':'सन लाउंजर','Changing rooms':'चेंजिंग रूम',
  'Poolside cabanas':'पूल किनारे कैबाना','Lifeguard on duty':'ड्यूटी पर लाइफ़गार्ड','Landscaped lawns':'सजे हुए लॉन',
  '300 m jogging track':'300 मी जॉगिंग ट्रैक','Kids’ play area':'बच्चों का खेल क्षेत्र','Fountain plaza':'फव्वारा प्लाज़ा',
  'Pergola seating':'पर्गोला बैठक','Senior citizens’ corner':'वरिष्ठ नागरिक कोना','24 × 7 security':'24 × 7 सुरक्षा','Visitor parking':'विज़िटर पार्किंग'
};
const mr={
  'Daylight':'दिवस','Golden hour':'सोनेरी संध्याकाळ','Night':'रात्र',
  'The project':'प्रकल्प','Sample flat':'नमुना सदनिका','Residences':'निवास',
  'Two towers around a five-acre garden.':'पाच एकरांच्या बागेभोवती दोन टॉवर्स.',
  'Fly around the site, pick a tower, then step inside a sample flat. The slider at the top takes the day into night.':
    'साइटवरून फिरा, एखादा टॉवर निवडा, मग नमुना सदनिकेत प्रवेश करा. वरचा स्लायडर दिवसाला रात्रीत बदलतो.',
  'Towers':'टॉवर्स','Homes':'घरे','Open space':'मोकळी जागा','Configurations':'सदनिकांचे प्रकार',
  'in two towers':'दोन टॉवर्समध्ये','of the site, approx.':'साइटच्या, सुमारे','floors':'मजले','Floors':'मजले',
  'Lifts':'लिफ्ट','Per floor':'प्रति मजला','Floor':'मजला','Penthouses':'पेंटहाऊस',
  'Amenities':'सुविधा','Sample flats you can walk into':'ज्यात फिरता येईल अशा नमुना सदनिका','What is here':'येथे काय आहे',
  'In this home':'या घरात','Specifications':'तपशील',
  'Demo only: names and specifications are placeholders.':'फक्त डेमो: नावे आणि तपशील उदाहरणादाखल आहेत.',
  'Site':'साइट','Back':'मागे','Faces the central garden':'मध्यवर्ती बागेकडे तोंड','high-speed lifts':'हाय-स्पीड लिफ्ट',
  'Carpet area':'कार्पेट क्षेत्र','Layout':'रचना','Outlook':'दृश्य','+ terrace':'+ टेरेस','carpet':'कार्पेट',
  'Flat':'सदनिका','sq ft':'चौ. फूट','homes':'घरे','Amenity':'सुविधा',
  'The whole home is furnished: use the room buttons below to walk from the entry through every room.':
    'संपूर्ण घर सुसज्ज आहे: प्रवेशापासून प्रत्येक खोलीत फिरण्यासाठी खालील खोल्यांची बटणे वापरा.',
  'You are standing in the master bedroom, with its attached bath and balcony.':
    'तुम्ही मास्टर बेडरूममध्ये उभे आहात, ज्याला संलग्न बाथरूम आणि बाल्कनी आहे.',
  'You are standing in the master bedroom, with its attached bath and private terrace.':
    'तुम्ही मास्टर बेडरूममध्ये उभे आहात, ज्याला संलग्न बाथरूम आणि खाजगी टेरेस आहे.',
  'Loading':'लोड होत आहे','Structure':'रचना','Materials':'साहित्य','Landscape':'निसर्गरचना','Welcome':'स्वागत आहे',
  'Entering':'प्रवेश','Taking you to the real experience':'तुम्हाला खऱ्या अनुभवाकडे घेऊन जात आहोत',
  'Entry':'प्रवेश','Living':'दिवाणखाना','Dining':'जेवणाची खोली','Kitchen':'स्वयंपाकघर','Master':'मास्टर बेडरूम','Master Bath':'मास्टर बाथ',
  'Bedroom 2':'बेडरूम 2','Bathroom':'स्नानगृह','Balcony':'बाल्कनी','View':'दृश्य','Bed':'पलंग','Lounge':'लाउंज',
  'Window':'खिडकी','Bath':'बाथ',
  'Penthouse':'पेंटहाऊस','4 BHK Sky Penthouse':'4 BHK स्काय पेंटहाऊस',
  '2 bed · 2 bath':'2 बेडरूम · 2 बाथरूम','3 bed · 3 bath':'3 बेडरूम · 3 बाथरूम','4 bed · 5 bath':'4 बेडरूम · 5 बाथरूम',
  'Garden':'बाग','Garden and pool':'बाग आणि पूल','Open sky and the city':'मोकळे आकाश आणि शहर',
  'A generous, light-filled home. The living room opens onto a balcony over the garden, and the master bedroom you are standing in has its own bath.':
    'प्रशस्त, प्रकाशमान घर. दिवाणखाना बागेवरील बाल्कनीत उघडतो, आणि तुम्ही उभे असलेल्या मास्टर बेडरूमला स्वतःचे बाथरूम आहे.',
  'Three bedrooms and a separate dining area, with two balconies. The master suite shown here has an attached bath and looks across the garden toward the pool.':
    'तीन बेडरूम आणि स्वतंत्र जेवणाची जागा, दोन बाल्कनींसह. येथे दाखवलेल्या मास्टर सुइटला संलग्न बाथरूम आहे आणि तेथून बागेपलीकडील पूल दिसतो.',
  'The top floor, given to just a few homes. A double-height living room, four bedrooms, and a private terrace with a plunge pool off the master suite.':
    'सर्वात वरचा मजला, फक्त काही घरांसाठी. दुहेरी उंचीचा दिवाणखाना, चार बेडरूम, आणि मास्टर सुइटला लागून प्लंज पूल असलेला खाजगी टेरेस.',
  'Two bedrooms, two baths':'दोन बेडरूम, दोन बाथरूम','Modular kitchen with chimney':'चिमणीसह मॉड्युलर किचन',
  'Sun-facing balcony':'सूर्यप्रकाश येणारी बाल्कनी','Wardrobes in both bedrooms':'दोन्ही बेडरूममध्ये वॉर्डरोब','Video door phone':'व्हिडिओ डोअर फोन',
  'Split AC points':'स्प्लिट एसी पॉइंट्स','Piped gas':'पाइप्ड गॅस','Covered parking for one car':'एका कारसाठी आच्छादित पार्किंग',
  'Three bedrooms, three baths':'तीन बेडरूम, तीन बाथरूम','Modular kitchen and utility':'मॉड्युलर किचन आणि युटिलिटी',
  'Two balconies':'दोन बाल्कनी','Walk-in wardrobe':'वॉक-इन वॉर्डरोब','Air-conditioning in all rooms':'सर्व खोल्यांमध्ये वातानुकूलन',
  'Two covered parking spaces':'दोन आच्छादित पार्किंग','Four bedrooms, five baths':'चार बेडरूम, पाच बाथरूम',
  'Private terrace with plunge pool':'प्लंज पूलसह खाजगी टेरेस','Double-height living room':'दुहेरी उंचीचा दिवाणखाना',
  'Walk-in wardrobes':'वॉक-इन वॉर्डरोब','Home automation':'होम ऑटोमेशन','Air-conditioning throughout':'संपूर्ण घरात वातानुकूलन',
  'Private lift lobby':'खाजगी लिफ्ट लॉबी','Three covered parking spaces':'तीन आच्छादित पार्किंग',
  'Earthquake-resistant RCC frame':'भूकंपरोधक आरसीसी फ्रेम','Flooring':'फ्लोअरिंग',
  'Large-format vitrified tiles; engineered oak in the master bedroom':'मोठ्या आकाराच्या व्हिट्रिफाइड टाइल्स; मास्टर बेडरूममध्ये इंजिनिअर्ड ओक',
  'Granite counter, stainless steel sink, modular cabinets':'ग्रॅनाइट काउंटर, स्टेनलेस स्टील सिंक, मॉड्युलर कॅबिनेट',
  'Bathrooms':'बाथरूम','Branded sanitaryware and fittings, glass shower partition':'ब्रँडेड सॅनिटरीवेअर आणि फिटिंग्ज, काचेचे शॉवर पार्टिशन',
  'Windows':'खिडक्या','Aluminium frames with clear float glass':'स्वच्छ फ्लोट काचेसह ॲल्युमिनियम फ्रेम',
  'Power':'वीज','Full back-up for lifts and common areas':'लिफ्ट आणि सामायिक जागांसाठी पूर्ण बॅक-अप',
  '18 floors · 2 and 3 BHK, sky penthouses':'18 मजले · 2 आणि 3 BHK, स्काय पेंटहाऊस','15 floors · 2 and 3 BHK homes':'15 मजले · 2 आणि 3 BHK घरे',
  'Gym, games, banquet hall and café':'जिम, खेळ, बँक्वेट हॉल आणि कॅफे','25 m lap pool, kids’ pool and sun deck':'25 मी लॅप पूल, मुलांचा पूल आणि सन डेक',
  'Lawns, jogging track and kids’ play area':'लॉन, जॉगिंग ट्रॅक आणि मुलांचे खेळाचे मैदान',
  'The taller of the two towers. Every flat looks over the central garden, and the eighteenth floor is given to sky penthouses with private terraces.':
    'दोन टॉवर्सपैकी उंच टॉवर. प्रत्येक सदनिकेतून मध्यवर्ती बाग दिसते, आणि अठरावा मजला खाजगी टेरेस असलेल्या स्काय पेंटहाऊससाठी आहे.',
  'Fifteen floors of two and three bedroom homes, a short walk across the garden from the clubhouse and the pool.':
    'दोन आणि तीन बेडरूम घरांचे पंधरा मजले, बागेपलीकडील क्लबहाऊस आणि पूलपासून थोड्याच अंतरावर.',
  'Two floors of shared space for residents: a glass-walled gym and café at ground level, the banquet hall and games rooms above, and a roof garden on top.':
    'रहिवाशांसाठी सामायिक जागेचे दोन मजले: तळमजल्यावर काचेच्या भिंतींचे जिम आणि कॅफे, वर बँक्वेट हॉल आणि खेळाच्या खोल्या, आणि छतावर रूफ गार्डन.',
  'A 25 metre lap pool between the towers, with a shallow splash pool for children, a teak sun deck and loungers on both sides.':
    'टॉवर्सच्या मध्ये 25 मीटरचा लॅप पूल, मुलांसाठी उथळ स्प्लॅश पूल, सागवानी सन डेक आणि दोन्ही बाजूंना लाउंजर्स.',
  'The heart of the site: open lawns ringed by a 300 metre jogging track, with a fountain plaza, a shaded pergola corner and a children’s play area.':
    'साइटचे हृदय: 300 मीटर जॉगिंग ट्रॅकने वेढलेली मोकळी लॉन, कारंज्याचा प्लाझा, सावलीचा पर्गोला कोपरा आणि मुलांचे खेळाचे मैदान.',
  'Air-conditioned gym':'वातानुकूलित जिम','Yoga and aerobics studio':'योग आणि एरोबिक्स स्टुडिओ','Indoor games room':'इनडोअर गेम्स रूम',
  'Banquet hall':'बँक्वेट हॉल','Café and lounge':'कॅफे आणि लाउंज','Guest suites':'पाहुण्यांसाठी सुइट्स','Mini theatre':'मिनी थिएटर','Library':'ग्रंथालय',
  '25 m lap pool':'25 मी लॅप पूल','Kids’ splash pool':'मुलांचा स्प्लॅश पूल','Sun loungers':'सन लाउंजर्स','Changing rooms':'चेंजिंग रूम्स',
  'Poolside cabanas':'पूलकाठी कबाना','Lifeguard on duty':'ड्युटीवर जीवरक्षक','Landscaped lawns':'सुशोभित लॉन',
  '300 m jogging track':'300 मी जॉगिंग ट्रॅक','Kids’ play area':'मुलांचे खेळाचे मैदान','Fountain plaza':'कारंज्याचा प्लाझा',
  'Pergola seating':'पर्गोला बैठक','Senior citizens’ corner':'ज्येष्ठ नागरिक कोपरा','24 × 7 security':'24 × 7 सुरक्षा','Visitor parking':'अभ्यागत पार्किंग'
};
/* Kitchen and Bathrooms double as specification headings; Structure is both a loading word and a spec heading */
const T={hi,mr};
let lang='en';
try{const s=localStorage.getItem('ah-lang');if(s==='hi'||s==='mr')lang=s;}catch(e){}
window.AH={
  get lang(){return lang;},
  set lang(v){lang=v;try{localStorage.setItem('ah-lang',v);}catch(e){}document.documentElement.lang=v;},
  tr(s,l){const t=T[l||lang];return (t&&t[s])||s;},
  /* ordinal floor, "7th floor", and "7th of 18" */
  floor(n,l){l=l||lang;
    if(l==='hi')return({1:'पहली',2:'दूसरी',3:'तीसरी',4:'चौथी',6:'छठी'}[n]||n+'वीं')+' मंज़िल';
    if(l==='mr')return({1:'पहिला',2:'दुसरा',3:'तिसरा',4:'चौथा'}[n]||n+'वा')+' मजला';
    const s=['th','st','nd','rd'],v=n%100;return n+(s[(v-20)%10]||s[v]||s[0])+' floor';},
  floorOf(n,of,l){l=l||lang;
    if(l==='hi')return `${of} में से ${({1:'पहली',2:'दूसरी',3:'तीसरी',4:'चौथी',6:'छठी'}[n]||n+'वीं')}`;
    if(l==='mr')return `${of} पैकी ${({1:'पहिला',2:'दुसरा',3:'तिसरा',4:'चौथा'}[n]||n+'वा')}`;
    return AH.floor(n,'en').replace(' floor','')+' of '+of;}
};
document.documentElement.lang=lang;
})();
