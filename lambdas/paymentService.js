export const handler = async (event) => {
  console.log("Payment Request:", JSON.stringify(event));

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { amount } = body;

    if (!amount || amount <= 0) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ message: "Invalid payment amount" }),
      };
    }

   
    const transactionId = crypto.randomUUID();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Payment Successful",
        transactionId: transactionId,
        amount: amount,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
