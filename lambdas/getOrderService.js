import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "RestaurantOrders";
const INDEX_NAME = "UserOrdersIndex"; 

export const handler = async (event) => {
  console.log("Get Orders Request:", JSON.stringify(event));

  try {
    const userId = event.queryStringParameters?.userId;

    if (!userId) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ message: "Missing userId query parameter" }),
      };
    }

    
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: INDEX_NAME,             
      KeyConditionExpression: "userId = :uid",
      ExpressionAttributeValues: { ":uid": userId },
      ScanIndexForward: false,           
    });

    const response = await docClient.send(command);

    const result = {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        message: "Orders fetched successfully",
        count: response.Count,
        orders: response.Items || [], 
      }),
    };

    console.log("FINAL RESPONSE:", JSON.stringify(result)); 
    return result;

  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
