const cropsData1 = require('./cropData1');
const cropsData2 = require('./cropData2');

// Merged crop library: 105 crops across cereals, pulses, oilseeds,
// vegetables, fruits, spices, cash and plantation crops.
const crops = [...cropsData1, ...cropsData2];

// GET /api/crops
// Supports query params: ?search=rice  ?season=Kharif  ?category=Fruit
const getCrops = (req, res) => {
    try {
        let result = [...crops];
        const { search, season, category } = req.query;

        if (search) {
            const q = search.toLowerCase();
            result = result.filter(c =>
                c.name.toLowerCase().includes(q) ||
                (c.nameHi && c.nameHi.toLowerCase().includes(q)) ||
                (c.soil && c.soil.toLowerCase().includes(q)) ||
                (c.pests && c.pests.toLowerCase().includes(q))
            );
        }
        if (season && season !== 'All') {
            result = result.filter(c =>
                c.season.toLowerCase().includes(season.toLowerCase())
            );
        }
        res.json({
            total: result.length,
            crops: result,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/crops/:id
const getCropById = (req, res) => {
    try {
        const crop = crops.find(c => c.id === parseInt(req.params.id));
        if (!crop) return res.status(404).json({ message: 'Crop not found' });
        res.json(crop);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getCrops, getCropById };
