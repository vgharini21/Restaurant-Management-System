import { randomUUID } from "crypto";

export const handler = async (event) => {
  console.log("Payment Request Received:", JSON.stringify(event));

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    
    
    const { amount, cvv, expiry } = body;
    const cardNumber = body.cardNumber || "0000-0000-0000-0000";

    
    if (!amount || amount <= 0) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ message: "Invalid payment amount" }),
      };
    }


    const cardStr = String(cardNumber);
    const maskedCard = cardStr.length >= 4 ? cardStr.slice(-4) : "xxxx";
    
    console.log(`💰 Processing payment of $${amount} for Card ending in ...${maskedCard}`);
    
    if (cvv) {
        console.log(`🔒 CVV Verified: ${cvv} (Mock)`);
    }

    
    const transactionId = "TXN-" + randomUUID();

    const response = {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        message: "Payment Approved",
        transactionId: transactionId,
        amount: amount,
        status: "APPROVED"
      }),
    };
    
    console.log("FINAL RESPONSE:", JSON.stringify(response));
    return response;
    
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
