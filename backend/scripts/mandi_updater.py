import requests
import firebase_admin
from firebase_admin import credentials, firestore
import json
import os
from datetime import datetime

# --- CONFIGURATION ---
# Path to your Firebase Service Account JSON file
# You can get this from Firebase Console -> Project Settings -> Service Accounts -> Generate new private key
SERVICE_ACCOUNT_PATH = os.path.join(os.path.dirname(__file__), 'serviceAccountKey.json')

# Agmarknet API Endpoints
FILTERS_URL = "https://api.agmarknet.gov.in/v1/dashboard-filters/?dashboard_name=marketwise_price_arrival"
DATA_URL_TEMPLATE = "https://api.agmarknet.gov.in/v1/dashboard-data/?dashboard=marketwise_price_arrival&date={date}&group=[100000]&commodity=[100001]&variety=100021&state={state_id}&district=[100007]&market=[100009]&grades=[4]&page=1&limit=2000&format=json"

def initialize_firebase():
    if not os.path.exists(SERVICE_ACCOUNT_PATH):
        print(f"ERROR: Service account file not found at {SERVICE_ACCOUNT_PATH}")
        print("Please place your 'serviceAccountKey.json' in the same directory as this script.")
        return None
    
    cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
    firebase_admin.initialize_app(cred)
    return firestore.client()

def fetch_and_update_filters(db):
    print("Fetching filters from Agmarknet...")
    try:
        response = requests.get(FILTERS_URL, timeout=30)
        response.raise_for_status()
        filters_data = response.json()
        
        # Update Firestore
        db.collection('mandi_metadata').document('filters').set(filters_data)
        print("Successfully updated mandi_metadata/filters")
        return filters_data
    except Exception as e:
        print(f"Error updating filters: {e}")
        return None

def fetch_and_update_prices(db, state_ids):
    today = datetime.now().strftime("%Y-%m-%d")
    print(f"Fetching Mandi prices for {today}...")
    
    for state_id in state_ids:
        print(f"  Updating state ID: {state_id}...")
        url = DATA_URL_TEMPLATE.format(date=today, state_id=state_id)
        try:
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            data = response.json()
            
            if data.get('status') == 'success' and data.get('records'):
                # Store in Firestore. We use the state_id as the document ID or a field.
                # Here we use state_id as a field to match our controller's query.
                # We can store one document per state to keep it clean.
                doc_ref = db.collection('mandi_prices').document(f"state_{state_id}")
                doc_ref.set({
                    'state': str(state_id),
                    'last_updated': today,
                    'records': data.get('records', [])
                })
                print(f"    Uploaded {len(data['records'])} records for state {state_id}")
            else:
                print(f"    No records found for state {state_id} on {today}")
        except Exception as e:
            print(f"    Error fetching data for state {state_id}: {e}")

def main():
    db = initialize_firebase()
    if not db:
        return

    # 1. Update Filters
    filters = fetch_and_update_filters(db)
    
    # 2. Update Prices for relevant states
    # You can customize this list based on common states or extract from filters
    # Defaulting to some common states: Punjab (100006), Haryana (100003), UP (100010), etc.
    target_states = ['100006', '100003', '100010', '100005', '100007'] 
    
    if filters:
        # Optionally extract all state IDs from filters if you want a full sync
        try:
            all_states = [s['value'] for s in filters.get('state', []) if s.get('value')]
            if all_states:
                target_states = all_states
        except:
            pass

    fetch_and_update_prices(db, target_states)
    print("Sync Complete!")

if __name__ == "__main__":
    main()
