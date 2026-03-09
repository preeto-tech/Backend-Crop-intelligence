/**
 * Mandi Data Sync Script (Node.js)
 * 
 * Run this script manually from an Indian region to cache Mandi data into Firestore.
 * Usage: node scripts/syncMandiData.js
 */

const { doc, setDoc } = require('firebase/firestore');
const { db } = require('../config/firebase');

const FILTERS_URL = 'https://api.agmarknet.gov.in/v1/dashboard-filters/?dashboard_name=marketwise_price_arrival';

const HEADERS = {
    'accept': 'application/json, text/plain, */*',
    'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
};

function buildDataUrl(stateId, date, page = 1, limit = 500) {
    return `https://api.agmarknet.gov.in/v1/dashboard-data/?dashboard=marketwise_price_arrival&date=${date}&group=[100000]&commodity=[100001]&variety=100021&state=${stateId}&district=[100007]&market=[100009]&grades=[4]&page=${page}&limit=${limit}&format=json`;
}

async function syncFilters() {
    console.log('📡 Fetching filters from Agmarknet...');
    try {
        const response = await fetch(FILTERS_URL, { headers: HEADERS });
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        const data = await response.json();
        await setDoc(doc(db, 'mandi_metadata', 'filters'), data);
        console.log('✅ Filters saved to Firestore');
        return data;
    } catch (error) {
        console.error('❌ Error syncing filters:', error.message);
        return null;
    }
}

async function syncPricesForState(stateId, date) {
    let allRecords = [];
    let columns = null;
    let page = 1;
    const limit = 500;

    try {
        // Fetch all pages
        while (true) {
            const url = buildDataUrl(stateId, date, page, limit);
            const response = await fetch(url, { headers: HEADERS });
            if (!response.ok) throw new Error(`Status: ${response.status}`);
            const apiResponse = await response.json();

            // The actual API structure is: { status, message, pagination, data: { columns, records, count } }
            const records = apiResponse.data?.records || [];
            if (!columns && apiResponse.data?.columns) {
                columns = apiResponse.data.columns;
            }

            allRecords = allRecords.concat(records);

            // Check if there are more pages
            const totalCount = apiResponse.pagination?.total_count || 0;
            if (allRecords.length >= totalCount || records.length === 0) {
                break;
            }
            page++;
        }

        if (allRecords.length === 0) {
            console.log(`  ⚠️  State ${stateId}: No records found`);
            return 0;
        }

        // Save to Firestore - store the full API response structure for each state
        await setDoc(doc(db, 'mandi_prices', `state_${stateId}`), {
            state: String(stateId),
            last_updated: date,
            columns: columns || [],
            records: allRecords,
        });

        console.log(`  ✅ State ${stateId}: Saved ${allRecords.length} records`);
        return allRecords.length;
    } catch (error) {
        console.error(`  ❌ State ${stateId}: ${error.message}`);
        return 0;
    }
}

async function main() {
    console.log('=== Mandi Data Sync Script ===\n');

    // 1. Sync filters
    const filters = await syncFilters();

    // 2. Extract state IDs from filters, or use defaults
    let stateIds = ['100006', '100003', '100010', '100005', '100007'];
    if (filters && filters.state) {
        try {
            const extracted = filters.state
                .map(s => String(s.value))
                .filter(v => v && v !== 'undefined');
            if (extracted.length > 0) {
                stateIds = extracted;
                console.log(`📋 Found ${stateIds.length} states from filters`);
            }
        } catch (e) {
            console.log('⚠️  Could not extract states, using defaults');
        }
    }

    // 3. Use a known working date
    const date = '2026-03-07';
    console.log(`\n📅 Fetching prices for date: ${date}`);
    console.log(`📊 Syncing ${stateIds.length} states...\n`);

    let totalRecords = 0;
    for (const stateId of stateIds) {
        const count = await syncPricesForState(stateId, date);
        totalRecords += count;
    }

    console.log(`\n🎉 Sync complete! Total records cached: ${totalRecords}`);
    process.exit(0);
}

main().catch(err => {
    console.error('FATAL:', err);
    process.exit(1);
});
