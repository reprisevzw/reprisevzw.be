import { parse } from 'querystring';  // For URL-encoded form parsing
import { Buffer } from 'buffer';  // For decoding base64
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";  // AWS SDK v3 SES client
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";  // AWS SDK v3 DynamoDB client

// Initialize the SES client
const sesClient = new SESClient({ region: 'eu-north-1' });  // Use your AWS region

// Initialize the DynamoDB client
const dynamoClient = new DynamoDBClient({ region: 'eu-north-1' });  // Use your AWS region

// Function to log submission to DynamoDB
async function logSubmissionToDynamoDB(name, email, message) {
  const params = {
    TableName: 'ContactFormSubmissions',  // Replace with your actual DynamoDB table name
    Item: {
      'id': { S: Date.now().toString() },  // Use timestamp as a simple unique ID
      'name': { S: name },
      'email': { S: email },
      'message': { S: message },
      'timestamp': { S: new Date().toISOString() }
    }
  };

  const command = new PutItemCommand(params);
  await dynamoClient.send(command);
}

export const handler = async (event) => {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "https://reprisevzw.be",
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: headers,
      body: ''
    };
  }

  if (event.httpMethod === 'POST') {
    try {
      console.log("Incoming event:", event);

      let formData;

      // Check if the body is base64-encoded and decode it if necessary
      if (event.isBase64Encoded) {
        const decodedBody = Buffer.from(event.body, 'base64').toString('utf-8');
        formData = parse(decodedBody);
      } else {
        formData = parse(event.body);
      }

      const name = formData.name;
      const email = formData.email;
      const message = formData.message;

      if (!name || !email || !message) {
        throw new Error("Missing form data");
      }

      console.log(`Name: ${name}, Email: ${email}, Message: ${message}`);

      // Prepare the email parameters for SES
      const emailParams = {
        Source: "maxime@reprisevzw.be", //verified SES email
        Destination: {
          ToAddresses: ["info@reprisevzw.be"]
        },
        ReplyToAddresses: [email], // Set Reply-To to the email from the form
        Message: {
          Subject: {
            Data: `Nieuw inzending via contact formulier van ${name}`
          },
          Body: {
            Text: {
              Data: `Naam: ${name}\nEmail: ${email}\nBericht: ${message}`
            }
          }
        }
      };

      // Create and send the email command using SESClient
      const command = new SendEmailCommand(emailParams);
      await sesClient.send(command);

      // Log the submission to DynamoDB
      await logSubmissionToDynamoDB(name, email, message);

      // Return a minimal HTML response
      const htmlResponse = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Formulier verzonden</title>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #f4f4f9;
                      color: #333;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      height: 100vh;
                      margin: 0;
                  }
                  .container {
                      text-align: center;
                      background-color: #fff;
                      padding: 20px;
                      border-radius: 10px;
                      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                  }
                  h1 {
                      color: #963561;
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <h1>Bedankt!</h1>
                  <p>Uw inzending is verzonden. We nemen spoeding contact met u op!</p>
              </div>
          </body>
          </html>`;

      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'text/html' },
        body: htmlResponse
      };
    } catch (error) {
      console.error("Error processing form submission:", error.message);

      const errorHtmlResponse = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Error</title>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #f4f4f9;
                      color: #333;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      height: 100vh;
                      margin: 0;
                  }
                  .container {
                      text-align: center;
                      background-color: #fff;
                      padding: 20px;
                      border-radius: 10px;
                      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                  }
                  h1 {
                      color: #f44336;
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <h1>Fout</h1>
                  <p>Er was een probleem bij het versturen van uw inzending. Gelieve later opnieuw te proberen, of een email te versturen.</p>
              </div>
          </body>
          </html>`;

      return {
        statusCode: 500,
        headers: { ...headers, 'Content-Type': 'text/html' },
        body: errorHtmlResponse
      };
    }
  }

  // If not OPTIONS or POST, return method not allowed
  return {
    statusCode: 405,
    headers: headers,
    body: 'Method Not Allowed'
  };
};
