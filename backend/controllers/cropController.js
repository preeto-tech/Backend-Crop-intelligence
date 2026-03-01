// Crop library seed data
const crops = [
    {
        id: 1, name: 'Rice', nameHi: 'चावल', season: 'Kharif', seasonHi: 'खरीफ',
        soil: 'Clayey, Loamy', soilHi: 'चिकनी, दोमट',
        irrigation: 'Flood / Sprinkler – needs 1200–1500mm water',
        irrigationHi: 'बाढ़/स्प्रिंकलर – 1200-1500mm पानी',
        fertilizer: 'N:P:K = 120:60:60 kg/ha. Apply urea in 3 splits.',
        fertilizerHi: 'N:P:K = 120:60:60 kg/ha. यूरिया 3 भागों में डालें।',
        pests: 'Brown Planthopper, Stem Borer, Leaf Folder',
        pestsHi: 'भूरा लीफहॉपर, तना छेदक, पत्ती मोड़क',
        image: '🌾', color: 'from-green-400 to-emerald-600',
    },
    {
        id: 2, name: 'Wheat', nameHi: 'गेहूँ', season: 'Rabi', seasonHi: 'रबी',
        soil: 'Loamy, Well-drained', soilHi: 'दोमट, अच्छी जल निकासी',
        irrigation: 'Furrow / Drip – 4-6 irrigations needed',
        irrigationHi: 'कुंड/ड्रिप – 4-6 सिंचाई जरूरी',
        fertilizer: 'N:P:K = 120:60:40 kg/ha. Split nitrogen application.',
        fertilizerHi: 'N:P:K = 120:60:40 kg/ha. नाइट्रोजन विभाजित करें।',
        pests: 'Aphids, Rust, Loose Smut',
        pestsHi: 'एफिड्स, रस्ट, लूज स्मट',
        image: '🌿', color: 'from-yellow-400 to-amber-600',
    },
    {
        id: 3, name: 'Maize', nameHi: 'मक्का', season: 'Kharif', seasonHi: 'खरीफ',
        soil: 'Sandy Loam, Rich in OM', soilHi: 'बलुई दोमट, OM से भरपूर',
        irrigation: 'Furrow / Drip – critical at silking stage',
        irrigationHi: 'कुंड/ड्रिप – सिल्किंग चरण में महत्वपूर्ण',
        fertilizer: 'N:P:K = 150:75:50 kg/ha',
        fertilizerHi: 'N:P:K = 150:75:50 kg/ha',
        pests: 'Fall Armyworm, Stem Borer, Aphids',
        pestsHi: 'फॉल आर्मीवर्म, तना छेदक, एफिड्स',
        image: '🌽', color: 'from-orange-400 to-yellow-600',
    },
    {
        id: 4, name: 'Sugarcane', nameHi: 'गन्ना', season: 'Annual', seasonHi: 'वार्षिक',
        soil: 'Deep Loamy', soilHi: 'गहरी दोमट',
        irrigation: 'Drip / Furrow – 1800-2500mm/year',
        irrigationHi: 'ड्रिप/कुंड – 1800-2500mm/वर्ष',
        fertilizer: 'N:P:K = 250:60:60 kg/ha. Apply in 3 splits.',
        fertilizerHi: 'N:P:K = 250:60:60 kg/ha. 3 भागों में डालें।',
        pests: 'Early Shoot Borer, Woolly Aphid, Red Rot',
        pestsHi: 'अर्ली शूट बोरर, ऊनी एफिड, रेड रॉट',
        image: '🎋', color: 'from-green-500 to-teal-700',
    },
    {
        id: 5, name: 'Cotton', nameHi: 'कपास', season: 'Kharif', seasonHi: 'खरीफ',
        soil: 'Black Cotton Soil, Well-drained',
        soilHi: 'काली कपास की मिट्टी, अच्छी जल निकासी',
        irrigation: 'Drip – 700-1000mm water',
        irrigationHi: 'ड्रिप – 700-1000mm पानी',
        fertilizer: 'N:P:K = 180:90:90 kg/ha',
        fertilizerHi: 'N:P:K = 180:90:90 kg/ha',
        pests: 'Bollworm, Jassids, Thrips, Whitefly',
        pestsHi: 'बॉलवर्म, जसीड्स, थ्रिप्स, व्हाइटफ्लाई',
        image: '🌸', color: 'from-blue-300 to-indigo-500',
    },
    {
        id: 6, name: 'Tomato', nameHi: 'टमाटर', season: 'Rabi / Kharif', seasonHi: 'रबी / खरीफ',
        soil: 'Sandy Loam, Rich in OM', soilHi: 'बलुई दोमट, OM से भरपूर',
        irrigation: 'Drip – 600-800mm',
        irrigationHi: 'ड्रिप – 600-800mm',
        fertilizer: 'N:P:K = 120:60:80 kg/ha',
        fertilizerHi: 'N:P:K = 120:60:80 kg/ha',
        pests: 'Fruit Borer, Whitefly, Early Blight',
        pestsHi: 'फ्रूट बोरर, व्हाइटफ्लाई, अर्ली ब्लाइट',
        image: '🍅', color: 'from-red-400 to-rose-600',
    },
    {
        id: 7, name: 'Onion', nameHi: 'प्याज', season: 'Rabi', seasonHi: 'रबी',
        soil: 'Loamy / Clay Loam', soilHi: 'दोमट / क्ले दोमट',
        irrigation: 'Drip / Sprinkler – 350-550mm',
        irrigationHi: 'ड्रिप/स्प्रिंकलर – 350-550mm',
        fertilizer: 'N:P:K = 100:50:50 kg/ha',
        fertilizerHi: 'N:P:K = 100:50:50 kg/ha',
        pests: 'Thrips, Purple Blotch, Damping Off',
        pestsHi: 'थ्रिप्स, पर्पल ब्लॉच, डैम्पिंग ऑफ',
        image: '🧅', color: 'from-purple-400 to-violet-600',
    },
    {
        id: 8, name: 'Soybean', nameHi: 'सोयाबीन', season: 'Kharif', seasonHi: 'खरीफ',
        soil: 'Well-drained Clay Loam', soilHi: 'अच्छी जल निकासी वाली क्ले दोमट',
        irrigation: 'Furrow – 450-700mm',
        irrigationHi: 'कुंड – 450-700mm',
        fertilizer: 'N:P:K = 30:60:40 kg/ha (fixes own N)',
        fertilizerHi: 'N:P:K = 30:60:40 kg/ha (स्वयं N बनाती है)',
        pests: 'Girdle Beetle, Leaf Eating Caterpillar, Rust',
        pestsHi: 'गर्डल बीटल, पत्ती खाने वाली कैटरपिलर, रस्ट',
        image: '🫘', color: 'from-lime-400 to-green-600',
    },
];

// GET /api/crops
const getCrops = (req, res) => {
    try {
        let result = [...crops];
        const { search, season } = req.query;
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(c =>
                c.name.toLowerCase().includes(q) || c.soil.toLowerCase().includes(q)
            );
        }
        if (season && season !== 'All') {
            result = result.filter(c => c.season.toLowerCase().includes(season.toLowerCase()));
        }
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getCrops };
