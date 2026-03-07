const getMandiData = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 30;

        // Grab state from query.
        const stateIdParam = req.query.stateId ? `&state=${req.query.stateId}` : '&state=100006';

        // Fetch data from Agmarknet API for today's date (or a recent valid date)
        const url = `https://api.agmarknet.gov.in/v1/dashboard-data/?dashboard=marketwise_price_arrival&date=2026-03-07&group=[100000]&commodity=[100001]&variety=100021${stateIdParam}&district=[100007]&market=[100009]&grades=[4]&page=${page}&limit=${limit}&format=json`;

        const response = await fetch(url, {
            headers: {
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
            }
        });

        if (!response.ok) {
            throw new Error(`Agmarknet API responded with status: ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching mandi data:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch mandi data', error: error.message });
    }
};

const getMandiFilters = async (req, res) => {
    try {
        const url = 'https://api.agmarknet.gov.in/v1/dashboard-filters/?dashboard_name=marketwise_price_arrival';
        const response = await fetch(url, {
            headers: {
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
            }
        });
        if (!response.ok) throw new Error(`Status: ${response.status}`);

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching mandi filters:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch filters' });
    }
};

module.exports = { getMandiData, getMandiFilters };
