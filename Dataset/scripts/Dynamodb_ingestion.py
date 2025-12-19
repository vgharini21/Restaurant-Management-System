import json
import boto3
from decimal import Decimal

# --- Configuration ---
# IMPORTANT: Change these values to match your setup
AWS_REGION = 'us-east-1' 
DYNAMODB_TABLE_NAME = 'RestaurantMenu' 
JSON_FILE_PATH = 'cleaned_restaurant_data.json'

# Initialize DynamoDB resource client (it uses your local 'aws configure' credentials)
try:
    dynamodb = boto3.resource('dynamodb', region_name=AWS_REGION)
    table = dynamodb.Table(DYNAMODB_TABLE_NAME)
except Exception as e:
    print(f"Error initializing DynamoDB: {e}")
    print("Ensure your AWS credentials and region are correctly configured.")
    exit()


# Load the cleaned JSON data
try:
    with open(JSON_FILE_PATH, 'r') as f:
        data = json.load(f)
except FileNotFoundError:
    print(f"Error: {JSON_FILE_PATH} not found. Ensure the file is in this directory.")
    exit()

print(f"\nStarting ingestion of data for {len(data)} restaurants into {DYNAMODB_TABLE_NAME}...")
total_items = 0

# Use batch_writer for highly efficient parallel ingestion. 
# It handles retries and sends items in batches of 25.
with table.batch_writer() as batch:
    for restaurant in data:
        # Extract restaurant-level details needed for every menu item
        r_id = str(restaurant['id'])
        r_name = restaurant['name']
        r_cuisine = restaurant['cuisine']
        
        # Iterate over each menu item in the 'menu' list
        for item in restaurant['menu']:
            # Create the item dictionary for DynamoDB
            # This is the FLATTENED structure required by your table schema
            db_item = {
                'restaurant_id': r_id,      # PK (String)
                'menu_item_id': item['id'], # SK (String)
                'restaurant_name': r_name,
                'cuisine': r_cuisine,
                'name': item['name'],
                'description': item.get('description', ''), # .get handles potential missing description
                'price': Decimal(str(item['price'])),             # Ensure it's a number/float type
                'category': item['category']                 # Used by the CategoryIndex GSI (String)
            }
            batch.put_item(Item=db_item)
            total_items += 1

print(f"✅ DynamoDB ingestion successful. Total menu items added: {total_items}")

# After running this script, you can verify the data in the AWS console under the 'Items' tab of your table.