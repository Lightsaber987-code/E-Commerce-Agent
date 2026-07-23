import "dotenv/config";
import * as readline from "readline";
import { SupportAgent } from "./agent";

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("Missing ANTHROPIC_API_KEY. Copy .env.example to .env and add your key.");
    process.exit(1);
  }

  const agent = new SupportAgent();

  console.log("E-commerce Support Agent (Aria) — type 'exit' to quit.");
  console.log("Try: \"Where's my order ORD-1001?\" or \"I want to return ORD-1001, it's the wrong color\"\n");

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ask = () =>
    rl.question("You: ", async (input) => {
      if (input.trim().toLowerCase() === "exit") {
        rl.close();
        return;
      }
      try {
        const reply = await agent.handleMessage(input);
        console.log(`\nAria: ${reply}\n`);
      } catch (err) {
        console.error("Error:", (err as Error).message);
      }
      ask();
    });

  ask();
}

main();
