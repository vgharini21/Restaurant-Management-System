import boto3
from botocore.exceptions import ClientError

# --- Configuration ---
AWS_REGION = 'us-east-1' 
DYNAMODB_TABLE_NAME = 'RestaurantMenu' 

# Initialize DynamoDB resource client
try:
    dynamodb = boto3.resource('dynamodb', region_name=AWS_REGION)
    table = dynamodb.Table(DYNAMODB_TABLE_NAME)
except Exception as e:
    print(f"Error initializing DynamoDB: {e}")
    print("Ensure your AWS credentials and region are correctly configured.")
    exit()

print(f"\nStarting SCAN and DELETE operation on table: {DYNAMODB_TABLE_NAME}...")

# 1. SCAN the table to retrieve all Primary Keys
# We only project the PK and SK to minimize read capacity consumption.
scan_response = table.scan(
    ProjectionExpression="restaurant_id, menu_item_id"
)

items_to_delete = scan_response['Items']

# Handle pagination if the table has more than 1MB of data (unlikely here, but good practice)
while 'LastEvaluatedKey' in scan_response:
    scan_response = table.scan(
        ProjectionExpression="restaurant_id, menu_item_id",
        ExclusiveStartKey=scan_response['LastEvaluatedKey']
    )
    items_to_delete.extend(scan_response['Items'])

print(f"Found {len(items_to_delete)} items to delete.")

if not items_to_delete:
    print("Table is already empty. Skipping deletion.")
else:
    # 2. DELETE the items using batch_writer
    # The batch writer automatically groups requests into batches of 25.
    delete_count = 0
    with table.batch_writer() as batch:
        for item in items_to_delete:
            # We only need the PK and SK for the delete request
            batch.delete_item(
                Key={
                    'restaurant_id': item['restaurant_id'],
                    'menu_item_id': item['menu_item_id']
                }
            )
            delete_count += 1

    print(f"✅ Successful deletion of {delete_count} items from {DYNAMODB_TABLE_NAME}.")

# --- End of Deletion Script ---