import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "RestaurantOrders";

export const handler = async (event) => {
  console.log("Create Order Request:", JSON.stringify(event));

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { userId, items, totalAmount, restaurantId, paymentId } = body;

    if (!userId || !items) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing userId or items" }),
      };
    }

    const orderId = randomUUID();
    const timestamp = new Date().toISOString();

    const orderItem = {
      orderId,
      userId,
      restauraantId,
      items,
      amount: totalAmount,
      paymentId,
      status: "ORDER_PLACED",
      timestamp,
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: orderItem,
    });

    await docClient.send(command);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Order Created",
        orderId: orderId,
      }),
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
