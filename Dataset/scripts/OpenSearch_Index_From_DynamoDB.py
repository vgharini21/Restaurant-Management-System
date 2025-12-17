import boto3
from opensearchpy import OpenSearch, RequestsHttpConnection, AWSV4SignerAuth
from botocore.exceptions import ClientError
import json

# --- Configuration ---
HOST = 'search-rms-food-search-domain-zq4q42xavhnjx5p2nwxsgvxjfu.us-east-1.es.amazonaws.com' # <--- REPLACE THIS VALUE
REGION = 'us-east-1' 
INDEX_NAME = 'food_index'
DYNAMODB_TABLE_NAME = 'RestaurantMenu'

# --- Initialization ---
try:
    # Get local credentials for signing DynamoDB and OpenSearch requests
    credentials = boto3.Session().get_credentials()
except ClientError as e:
    print(f"Error getting credentials: {e}. Run 'aws configure'.")
    exit()

auth = AWSV4SignerAuth(credentials, REGION, 'es')

# 1. Initialize DynamoDB Client
dynamodb = boto3.resource('dynamodb', region_name=REGION)
table = dynamodb.Table(DYNAMODB_TABLE_NAME)

# 2. Initialize OpenSearch Client
client = OpenSearch(
    hosts = [{'host': HOST, 'port': 443}],
    http_auth = auth,
    use_ssl = True,
    verify_certs = True,
    connection_class = RequestsHttpConnection
)

# 3. SCAN DynamoDB to retrieve all data
print(f"\nScanning all items from DynamoDB table: {DYNAMODB_TABLE_NAME}...")
scan_response = table.scan()
items_to_index = scan_response['Items']

# Handle pagination
while 'LastEvaluatedKey' in scan_response:
    scan_response = table.scan(
        ExclusiveStartKey=scan_response['LastEvaluatedKey']
    )
    items_to_index.extend(scan_response['Items'])

print(f"Retrieved {len(items_to_index)} items from DynamoDB. Starting bulk indexing...")
BATCH_SIZE = 5000
actions = []
total_indexed_items = 0

# 4. Prepare data for OpenSearch Bulk API
for item in items_to_index:
    # DynamoDB items use the Decimal type for numbers; must convert back to float/int for OpenSearch
    
    # Create the action metadata for the bulk API
    index_action = {
        "index": {
            "_index": INDEX_NAME,
            # Use the combined PK and SK as the unique document ID
            "_id": f"{item['restaurant_id']}-{item['menu_item_id']}" 
        }
    }
    
    # Create the source document (OpenSearch is flexible with extra fields)
    document = {
        "restaurant_id": item['restaurant_id'],
        "restaurant_name": item['restaurant_name'],
        "cuisine": item['cuisine'],
        "name": item['name'],
        "description": item.get('description', ''),
        # Convert Decimal price back to float for OpenSearch
        "price": float(item['price']), 
        "category": item['category']
    }
    
    actions.append(index_action)
    actions.append(document)
    total_indexed_items += 1
    
    if len(actions) >= BATCH_SIZE * 2: 
        print(f"Indexing batch of {BATCH_SIZE} documents...")
        try:
            # 5. Perform the bulk indexing for the current batch
            response = client.bulk(body=actions)
            
            if response and response.get('errors'):
                print(f"⚠️ Batch indexing completed with errors. Last batch size: {len(actions) // 2}")
                # Log or handle specific errors if needed
            else:
                print(f"✅ Successfully indexed {len(actions) // 2} documents.")
                
            # Clear the actions list for the next batch
            actions = []
            
        except Exception as e:
            print(f"Critical error during bulk indexing of a batch: {e}")
            # If a batch fails, the script will exit.

# 5. Perform the bulk indexing
if actions:
    print(f"Indexing final batch of {len(actions) // 2} documents...")
    try:
        response = client.bulk(body=actions)
        
        if response and response.get('errors'):
            print("⚠️ Bulk indexing completed with errors. Inspect the response.")
        else:
            print(f"✅ OpenSearch indexing successful! Total documents indexed: {total_indexed_items}")
            
    except Exception as e:
        print(f"Critical error during bulk indexing: {e}")

print(f"\n--- Indexing Complete ---")
print(f"Total documents prepared for indexing: {total_indexed_items}")