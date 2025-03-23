const { CdpAgentkit } = require("@coinbase/cdp-agentkit-core");
const { CdpToolkit, CdpTool } = require("@coinbase/cdp-langchain");
const { HumanMessage } = require("@langchain/core/messages");
const { MemorySaver } = require("@langchain/langgraph");
const { createReactAgent } = require("@langchain/langgraph/prebuilt");
const { ChatOpenAI } = require("@langchain/openai");
const { WebSocketServer } = require("ws");
const dotenv = require("dotenv");
const { z } = require("zod");
const express = require("express");
const cors = require("cors");
const { parseEther } = require("viem");

dotenv.config();

const PORT = process.env.PORT || 3000;

function validateEnvironment() {
  const missingVars = [];
  const requiredVars = [
    "OPENAI_API_KEY",
    "CDP_API_KEY_NAME",
    "CDP_API_KEY_PRIVATE_KEY",
  ];

  requiredVars.forEach((varName) => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    console.error("Error: Required environment variables are not set");
    missingVars.forEach((varName) => {
      console.error(`${varName}=your_${varName.toLowerCase()}_here`);
    });
    process.exit(1);
  }

  if (!process.env.NETWORK_ID) {
    console.warn(
      "Warning: NETWORK_ID not set, defaulting to base-sepolia testnet"
    );
  }
}

async function initializeAgent() {
  try {
    const llm = new ChatOpenAI({
      model: "gpt-4o-mini",
      apiKey: process.env.OPENAI_API_KEY,
    });

    const walletData = {
      walletId: process.env.WALLET_ID,
      seed: process.env.WALLET_SEED,
      defaultAddressId: "0xB9Cf11e1dd8547a8f03Ac922E894938F666CD935",
    };

    const walletDataStr = JSON.stringify(walletData);

    const config = {
      cdpWalletData: walletDataStr || undefined,
      networkId: process.env.NETWORK_ID || "base-sepolia",
    };

    const agentkit = await CdpAgentkit.configureWithWallet(config);
    const cdpToolkit = new CdpToolkit(agentkit);
    const tools = cdpToolkit.getTools();


    const memory = new MemorySaver();
    const agentConfig = {
      configurable: { thread_id: "Rewards Agent!" },
    };

    const agent = createReactAgent({
      llm,
      tools,
      checkpointSaver: memory,
      messageModifier: "You are a helpful agent that can interact onchain using the Coinbase Developer Platform AgentKit.",
    });

    return { agent, config: agentConfig };
  } catch (error) {
    console.error("Failed to initialize agent:", error);
    throw error;
  }
}

async function startServers() {
  validateEnvironment();

  const { agent, config } = await initializeAgent();

  // Initialize Express app
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.get("/", (req, res) => {
    res.send("Hello World");
  });

  // Start HTTP server
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HTTP server is running on port ${PORT}`);
  });

  // Start WebSocket server
  const wss = new WebSocketServer({ port: PORT + 1 });
  console.log(`WebSocket server is running on port ${PORT + 1}`);

  wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", async (message) => {
      try {
        const userInput = message.toString();
        const stream = await agent.stream(
          { messages: [new HumanMessage(userInput)] },
          config
        );

        for await (const chunk of stream) {
          if ("agent" in chunk) {
            ws.send(
              JSON.stringify({
                type: "agent",
                content: chunk.agent.messages[0].content,
              })
            );
          } else if ("tools" in chunk) {
            ws.send(
              JSON.stringify({
                type: "tools",
                content: chunk.tools.messages[0].content,
              })
            );
          }
        }
      } catch (error) {
        ws.send(
          JSON.stringify({
            type: "error",
            content: error.message,
          })
        );
      }
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });
}

if (require.main === module) {
  console.log("Starting HTTP and WebSocket Servers...");
  startServers().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}