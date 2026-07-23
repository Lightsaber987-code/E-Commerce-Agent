import Anthropic from "@anthropic-ai/sdk";
import { toolSchemas, toolExecutors } from "./tools";

const SYSTEM_PROMPT = `You are Aria, a customer support agent for an e-commerce store.

Your job:
- Answer questions about orders, shipping, returns, and store policy.
- Use your tools to look up real data instead of guessing — never invent order details, tracking numbers, or policy specifics.
- Confirm return requests with the customer before calling initiate_return.
- Escalate to a human (escalate_to_human) when: the customer asks for one, the issue is outside your tools (fraud, damaged item, billing dispute), or the customer is frustrated after a couple of failed attempts.
- Keep responses concise, warm, and specific. Don't pad with filler.
- Never make up policy. If search_faq finds nothing relevant and you're unsure, say so and offer to escalate.
- Ask for identifying info (order ID or email) if you need it to look something up.`;

export class SupportAgent {
  private client: Anthropic;
  private model: string;
  private history: Anthropic.MessageParam[] = [];

  constructor(apiKey?: string, model?: string) {
    this.client = new Anthropic({ apiKey }); // falls back to ANTHROPIC_API_KEY env var
    this.model = model || process.env.AGENT_MODEL || "claude-sonnet-5";
  }

  /**
   * Send a user message through the agent, running the tool-use loop
   * until Claude produces a final text response (no more tool calls).
   */
  async handleMessage(userMessage: string): Promise<string> {
    this.history.push({ role: "user", content: userMessage });

    // Guard against runaway tool-use loops.
    const MAX_TURNS = 6;

    for (let turn = 0; turn < MAX_TURNS; turn++) {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        tools: toolSchemas,
        messages: this.history,
      });

      this.history.push({ role: "assistant", content: response.content });

      if (response.stop_reason !== "tool_use") {
        return response.content
          .filter((block): block is Anthropic.TextBlock => block.type === "text")
          .map((block) => block.text)
          .join("\n");
      }

      // Execute every tool_use block Claude asked for, then feed the
      // results back in as a single user turn of tool_result blocks.
      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const block of response.content) {
        if (block.type !== "tool_use") continue;

        const executor = toolExecutors[block.name];
        let resultText: string;

        if (!executor) {
          resultText = JSON.stringify({ error: `Unknown tool: ${block.name}` });
        } else {
          try {
            resultText = executor(block.input);
          } catch (err) {
            resultText = JSON.stringify({ error: `Tool ${block.name} failed: ${(err as Error).message}` });
          }
        }

        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: resultText,
        });
      }

      this.history.push({ role: "user", content: toolResults });
    }

    return "I'm having trouble resolving this automatically — let me get a human agent to help.";
  }

  reset(): void {
    this.history = [];
  }
}
