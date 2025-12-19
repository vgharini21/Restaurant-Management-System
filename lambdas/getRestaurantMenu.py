import json
import boto3
from decimal import Decimal
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key

# --- Configuration ---
TABLE_NAME = "RestaurantMenu"
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)

# Allowed frontend origins
ALLOWED_ORIGINS = {
    "http://localhost:5173",
    "https://d3t9ac16dxeckl.cloudfront.net",
    "http://localhost:5174",
    "http://localhost:3000"
}

# --- Helpers ---
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super().default(obj)

def cors_headers(event):
    headers = event.get("headers") or {}
    origin = headers.get("origin") or headers.get("Origin")

    allow_origin = origin if origin in ALLOWED_ORIGINS else "https://d3t9ac16dxeckl.cloudfront.net"

    return {
        "Access-Control-Allow-Origin": allow_origin,
        "Access-Control-Allow-Methods": "GET,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Content-Type": "application/json",
    }

def respond(event, status_code, body):
    return {
        "statusCode": status_code,
        "headers": cors_headers(event),
        "body": json.dumps(body, cls=DecimalEncoder),
    }

# --- Lambda Handler ---
def lambda_handler(event, context):
    print("Received event:", json.dumps(event))

    # Handle CORS preflight
    method = event.get("httpMethod")
    if method == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": cors_headers(event),
            "body": "",
        }

    # Extract restaurantId
    path_params = event.get("pathParameters") or {}
    restaurant_id = path_params.get("restaurantId")

    if not restaurant_id:
        return respond(event, 400, {"error": "Missing restaurantId in path parameters"})

    try:
        response = table.query(
            KeyConditionExpression=Key("restaurant_id").eq(str(restaurant_id))
        )

        items = response.get("Items", [])
        if not items:
            return respond(
                event,
                404,
                {"error": f"Restaurant menu not found for ID: {restaurant_id}"},
            )

        return respond(event, 200, items)

    except ClientError as e:
        print("DynamoDB Client Error:", e.response["Error"]["Message"])
        return respond(event, 500, {"error": "DynamoDB query failed"})

    except Exception as e:
        print("Unexpected error:", str(e))
        return respond(event, 500, {"error": "An unexpected error occurred"})
