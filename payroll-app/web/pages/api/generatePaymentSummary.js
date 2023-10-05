import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const name = req.body.name || "Bola";
  const walletAddress = req.body.walletAddress || "0x";
  const totalPay = req.body.totalPay || "02";

  if (name.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid name",
      },
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(name, walletAddress, totalPay),
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generatePrompt(name, walletAddress, totalPay) {
  return `Generate a professional Payment summary based on the data provided below.

    Name of user Paid: ${name}
    User's Wallet Address: ${walletAddress}
    Amount paid: ${totalPay} $Flow Tokens
    Time paid: ${Date.now().toLocaleString()} $Flow Tokens

    Then at the end of the summary, add the tagline: "Thanks for using SwiftPay - Brought to you by Flow Blockchain and Streamr Network"
    `;
}
