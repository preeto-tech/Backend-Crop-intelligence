// Mock district-wise mandi price data
const mandiData = {
    crops: ['Rice', 'Wheat', 'Maize', 'Soybean', 'Cotton', 'Sugarcane', 'Onion', 'Tomato'],
    districts: ['Pune', 'Nashik', 'Nagpur', 'Aurangabad', 'Kolhapur', 'Solapur'],
    priceTable: {
        Rice: { Pune: 2100, Nashik: 2050, Nagpur: 2200, Aurangabad: 1980, Kolhapur: 2150, Solapur: 2080 },
        Wheat: { Pune: 2250, Nashik: 2300, Nagpur: 2180, Aurangabad: 2400, Kolhapur: 2200, Solapur: 2350 },
        Maize: { Pune: 1850, Nashik: 1900, Nagpur: 1780, Aurangabad: 1950, Kolhapur: 1820, Solapur: 1880 },
        Soybean: { Pune: 4500, Nashik: 4600, Nagpur: 4400, Aurangabad: 4700, Kolhapur: 4450, Solapur: 4550 },
        Cotton: { Pune: 6200, Nashik: 6100, Nagpur: 6400, Aurangabad: 6000, Kolhapur: 6300, Solapur: 6150 },
        Sugarcane: { Pune: 320, Nashik: 315, Nagpur: 330, Aurangabad: 310, Kolhapur: 325, Solapur: 318 },
        Onion: { Pune: 1800, Nashik: 1650, Nagpur: 1900, Aurangabad: 1750, Kolhapur: 1850, Solapur: 1700 },
        Tomato: { Pune: 2200, Nashik: 2100, Nagpur: 2400, Aurangabad: 2000, Kolhapur: 2300, Solapur: 2150 },
    },
    // 6-month trend data (Jan–Jun) per crop
    trends: {
        Rice: [1850, 1920, 2050, 2100, 2080, 2150],
        Wheat: [2100, 2150, 2200, 2280, 2300, 2250],
        Maize: [1600, 1680, 1720, 1780, 1820, 1850],
        Soybean: [4000, 4100, 4300, 4450, 4500, 4600],
        Cotton: [5800, 5950, 6100, 6200, 6100, 6300],
        Sugarcane: [285, 295, 305, 310, 318, 320],
        Onion: [1200, 1400, 1650, 1800, 1750, 1850],
        Tomato: [1500, 1800, 2100, 2200, 2000, 2300],
    },
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
};

const getMandiData = (req, res) => {
    res.json(mandiData);
};

module.exports = { getMandiData };
