import boto3
from opensearchpy import OpenSearch, RequestsHttpConnection, AWSV4SignerAuth
from botocore.exceptions import ClientError
import json

# --- Configuration ---
HOST = 'search-rms-food-search-domain-zq4q42xavhnjx5p2nwxsgvxjfu.us-east-1.es.amazonaws.com' 
REGION = 'us-east-1' 
INDEX_NAME = 'food_index'

# --- Initialization ---
try:
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

# Attempt to get the index count
print(f"Attempting to get count for index: {INDEX_NAME} using IAM credentials...")
try:
    response = client.count(index=INDEX_NAME)
    
    # Check if the count is zero
    if response['count'] == 0:
        print(f"✅ Count verified! Index '{INDEX_NAME}' is EMPTY.")
        print("You can proceed with the bulk indexing script now.")
    else:
        print(f"⚠️ Count verified! Index '{INDEX_NAME}' contains {response['count']} documents.")
        print("This means the data is already indexed!")
    
    print(json.dumps(response, indent=2))

except Exception as e:
    print(f"🛑 Critical error during count check: {e}")
    print("If you see a 403 here, the IAM user mapping is still the root cause.")