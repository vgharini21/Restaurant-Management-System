import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const ddbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddbClient);
const snsClient = new SNSClient({});

const TABLE_NAME = "RestaurantOrders";

const SNS_TOPIC_ARN = "arn:aws:sns:us-east-1:875219264820:OrderUpdates";

export const handler = async (event) => {
  console.log("Status Update Request:", JSON.stringify(event));

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { orderId, status } = body;

    if (!orderId || !status) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing orderId or status" }),
      };
    }

    // 1. Update DynamoDB
    const updateCommand = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { orderId: orderId },
      UpdateExpression: "set #s = :s",
      ExpressionAttributeNames: { "#s": "status" },
      ExpressionAttributeValues: { ":s": status },
      ReturnValues: "UPDATED_NEW",
    });

    await docClient.send(updateCommand);

    // 2. Send SNS Notification
    const message = `Update for Order #${orderId}: Your order is now ${status}!`;
    const publishCommand = new PublishCommand({
      TopicArn: SNS_TOPIC_ARN,
      Message: message,
      Subject: "Restaurant Order Update",
    });

    await snsClient.send(publishCommand);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Status updated and notification sent",
        newStatus: status,
      }),
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
