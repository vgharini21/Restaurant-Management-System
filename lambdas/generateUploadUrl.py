import json
import boto3
import os
import uuid

s3 = boto3.client("s3")
BUCKET = os.environ["BUCKET_NAME"]

def lambda_handler(event, context):
    # For now, fake userId (JWT later)
    user_id = "test-user"

    body = json.loads(event.get("body", "{}"))
    order_id = body.get("orderId", "unknown")

    # create unique filename
    file_name = f"{uuid.uuid4()}.jpg"
    object_key = f"uploads/{user_id}/{order_id}/{file_name}"

    # generate pre-signed URL
    upload_url = s3.generate_presigned_url(
        ClientMethod="put_object",
        Params={
            "Bucket": BUCKET,
            "Key": object_key,
            "ContentType": "image/png"
        },
        ExpiresIn=300  # 5 minutes
    )

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        "body": json.dumps({
            "uploadUrl": upload_url,
            "photoKey": object_key
        })
    }
