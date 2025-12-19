import json
import boto3
import os

personalize_runtime = boto3.client('personalize-runtime')

CAMPAIGN_ARN = "arn:aws:personalize:us-east-1:875219264820:campaign/restaurant-recs-campaign"

def lambda_handler(event, context):
    try:
        user_id = event["pathParameters"]["userId"]

        response = personalize_runtime.get_recommendations(
            campaignArn=CAMPAIGN_ARN,
            userId=user_id,
            numResults=10
        )

        restaurant_ids = [
            item["itemId"] for item in response.get("itemList", [])
        ]

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            "body": json.dumps({
                "userId": user_id,
                "recommendedRestaurants": restaurant_ids
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({"error": str(e)})
        }
