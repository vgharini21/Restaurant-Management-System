import json
import boto3
import uuid
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('RestaurantOrders')


def normalize_items(raw_items):
    """
    Accepts:
      - ["Burger", "Fries"]
      - [{"S": "Burger"}, {"S": "Fries"}]
      - {"L": [{"S": "Burger"}, {"S": "Fries"}]}
    and always returns ["Burger", "Fries"].
    """
    
    if isinstance(raw_items, dict) and "L" in raw_items:
        raw_items = raw_items["L"]

    if not isinstance(raw_items, list):
        raise ValueError("Items must be a list or DynamoDB List AttributeValue")

    clean = []
    for item in raw_items:
        
        if isinstance(item, dict) and len(item) == 1:
            val = next(iter(item.values()))
            clean.append(str(val))
        else:
            
            clean.append(str(item))

    return clean


def lambda_handler(event, context):
    print("Create Order Request:", json.dumps(event))

    try:
        body = json.loads(event.get('body', '{}')) if event.get('body') else {}

        user_id = body.get('userId')
        items = body.get('items')
        total_amount = body.get('totalAmount')
        restaurant_id = body.get('restaurantId')
        payment_id = body.get('paymentId')

        if not user_id or not items:
            return {
                'statusCode': 400,
                'body': json.dumps({"message": "Missing userId or items"})
            }

    
        clean_items = normalize_items(items)
        print("CLEAN ITEMS TO SAVE:", json.dumps(clean_items))

        order_id = str(uuid.uuid4())
        timestamp = datetime.utcnow().isoformat()

        order_item = {
            'orderId': order_id,
            'userId': user_id,
            'restaurantId': restaurant_id,
            'items': clean_items, 
            'amount': total_amount,
            'paymentId': payment_id,
            'status': "ORDER_PLACED",
            'timestamp': timestamp
        }

        table.put_item(Item=order_item)  
        return {
            'statusCode': 200,
            'headers': {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            'body': json.dumps({
                "message": "Order Created",
                "orderId": order_id
            })
        }

    except Exception as e:
        print("ERROR:", str(e))
        return {
            'statusCode': 500,
            'body': json.dumps({"error": str(e)})
        }
