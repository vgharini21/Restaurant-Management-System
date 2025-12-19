import json
import boto3
from opensearchpy import OpenSearch, RequestsHttpConnection, AWSV4SignerAuth

# --- Configuration ---
HOST = 'search-rms-food-search-domain-zq4q42xavhnjx5p2nwxsgvxjfu.us-east-1.es.amazonaws.com' 
REGION = 'us-east-1' 
INDEX_NAME = 'food_index'

# --- Initialization ---
credentials = boto3.Session().get_credentials()
auth = AWSV4SignerAuth(credentials, REGION, 'es')

client = OpenSearch(
    hosts = [{'host': HOST, 'port': 443}],
    http_auth = auth,
    use_ssl = True,
    verify_certs = True,
    connection_class = RequestsHttpConnection
)

def lambda_handler(event, context):
    
    # 1. Extract the search query from the API Gateway event
    try:
        # Expecting query from query string parameters (e.g., /search/global?query=pizza)
        query_string_params = event.get('queryStringParameters', {})
        search_query = query_string_params.get('query')
        
        if not search_query:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Missing search query parameter: "query"'})
            }
        
    except Exception as e:
        print(f"Error parsing event: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Invalid event format'})
        }

    # 2. Build the OpenSearch query body
    search_body = {
        'query': {
            'multi_match': {
                'query': search_query,
                # Search across menu item name, description, and cuisine type
                'fields': ['name^3', 'description', 'cuisine', 'restaurant_name'],
                'fuzziness': 'AUTO'
            }
        }
    }

    # 3. Execute the search
    try:
        response = client.search(
            index=INDEX_NAME,
            body=search_body
        )
        
        # 4. Extract and format the results (getting the source document)
        results = [hit['_source'] for hit in response['hits']['hits']]
            
        return {
            'statusCode': 200,
            'body': json.dumps(results)
        }
        
    except Exception as e:
        print(f"OpenSearch Search Error: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': f'OpenSearch query failed: {str(e)}'})
        }