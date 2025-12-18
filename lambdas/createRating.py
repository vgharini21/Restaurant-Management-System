import json
import boto3
import uuid
from datetime import datetime

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("Ratings")

def lambda_handler(event, context):
    body = json.loads(event["body"])

    item = {
    "userOrderId": f'{body["userId"]}#{body["orderId"]}',  # REQUIRED KEY
    "restaurantId": body["restaurantId"],
    "createdAt": datetime.utcnow().isoformat(),
    "ratingId": str(uuid.uuid4()),
    "userId": body["userId"],
    "orderId": body["orderId"],
    "rating": int(body["rating"]),
    "comment": body.get("comment", ""),
    "photoKey": body.get("photoKey", "")
    }

    table.put_item(Item=item)

    return {
        "statusCode": 201,
        "headers": {
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps({
            "message": "Rating saved successfully"
        })
    }
