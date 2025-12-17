import boto3
from opensearchpy import OpenSearch, RequestsHttpConnection, AWSV4SignerAuth
from botocore.exceptions import ClientError

# --- Configuration ---
# REPLACE THE HOST VALUE ONLY IF IT IS NOT CORRECT
HOST = 'search-rms-food-search-domain-zq4q42xavhnjx5p2nwxsgvxjfu.us-east-1.es.amazonaws.com' 
REGION = 'us-east-1' 
INDEX_NAME = 'food_index'

# --- Initialization ---
try:
    # Get local credentials for signing requests
    credentials = boto3.Session().get_credentials()
except ClientError as e:
    print(f"Error getting AWS credentials: {e}. Check 'aws configure'.")
    exit()

auth = AWSV4SignerAuth(credentials, REGION, 'es')

client = OpenSearch(
    hosts = [{'host': HOST, 'port': 443}],
    http_auth = auth,
    use_ssl = True,
    verify_certs = True,
    connection_class = RequestsHttpConnection
)

# Attempt to delete the index
print(f"Attempting to delete index: {INDEX_NAME}...")

try:
    # Check if the index exists first
    if client.indices.exists(index=INDEX_NAME):
        # We need the permissions: indices:admin/delete
        response = client.indices.delete(index=INDEX_NAME)
        if 'acknowledged' in response and response['acknowledged']:
            print(f"✅ Index '{INDEX_NAME}' successfully deleted via script.")
        else:
            print(f"⚠️ Index deletion failed with unexpected response: {response}")
    else:
        print(f"Index '{INDEX_NAME}' does not exist.")

except Exception as e:
    print(f"🛑 Critical error during index deletion: {e}")
    print("If you see a 403, the IAM user mapping is still the root cause.")


# Attempt to create the index
print(f"Attempting to create index: {INDEX_NAME}...")
try:
    # We need the permissions: indices:admin/create
    index_body = {
        "settings": {
            "number_of_shards": 1,
            "number_of_replicas": 0 
        },
        "mappings": {
            "properties": {
              "restaurant_id": { "type": "keyword" },  
              "restaurant_name": { "type": "text" },
              "cuisine": { "type": "keyword" },
              "name": { "type": "text" },       
              "description": { "type": "text" }, 
              "price": { "type": "float" },
              "category": { "type": "keyword" }
            }
        }
    }
    response = client.indices.create(index=INDEX_NAME, body=index_body)
    if response.get('acknowledged'):
        print(f"✅ Index '{INDEX_NAME}' successfully created via script.")
    else:
        print(f"⚠️ Index creation failed: {response}")

except Exception as e:
    print(f"🛑 Critical error during index creation: {e}")


print("\n--- If successful, proceed to run the bulk indexing script. ---")