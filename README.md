# E-commerce Support Agent

An AI customer support agent built with the [Anthropic TypeScript SDK](https://github.com/anthropics/anthropic-sdk-typescript). It handles FAQs, order status lookups, and returns/refunds, and escalates to a human when needed.

## Features

- **FAQ answering** — searches a policy knowledge base (`src/data/faq.ts`) instead of guessing.
- **Order status lookup** — looks up orders by ID or customer email (`src/data/mockOrders.ts`).
- **Returns/refunds** — validates return eligibility and creates a return request.
- **Human escalation** — hands off to a human agent with a summary and urgency level.

## Architecture

```
src/
  agent.ts          # Core loop: calls Claude, executes requested tools, feeds results back
  index.ts           # CLI chat interface
  types.ts            # Shared TypeScript interfaces
  tools/
    index.ts          # Registers tool schemas + executors
    orderLookup.ts     # lookup_order tool
    returns.ts          # initiate_return tool
    faq.ts               # search_faq tool
    escalate.ts           # escalate_to_human tool
  data/
    mockOrders.ts     # In-memory order "database" (swap for your real DB/API)
    faq.ts              # In-memory FAQ list (swap for real search/vector DB)
```

The agent uses Claude's **tool use** (function calling): each tool is defined once as a JSON schema plus an executor function, registered in `src/tools/index.ts`. `SupportAgent.handleMessage()` runs the request/tool-call/tool-result loop until Claude returns a final text answer.

## Setup

```bash
npm install
cp .env.example .env   # then add your ANTHROPIC_API_KEY
npm run dev             # or: npm run build && npm start
```

## Extending this template

- **Real data**: replace `src/data/mockOrders.ts` and `src/data/faq.ts` with calls to your order-management API and help-center/vector search.
- **Real escalation**: in `src/tools/escalate.ts`, replace the in-memory ticket with a call to Zendesk/Intercom/Freshdesk, or a Slack/PagerDuty webhook for high-urgency cases.
- **New capabilities**: add a `src/tools/<name>.ts` exporting a tool schema + executor, then register both in `src/tools/index.ts`. No changes needed to `agent.ts`.
- **Channels**: `src/index.ts` is a CLI for local testing. For production, wrap `SupportAgent` in an HTTP endpoint (Express/Fastify) or a chat-widget backend, keeping one `SupportAgent` instance (or its `history`) per conversation.
- **Guardrails**: consider adding input/output moderation, PII redaction in logs, and a hard cap on how many return/refund actions the agent can auto-approve before requiring human sign-off.

## Notes

- This template uses in-memory mock data so it runs immediately with no external services beyond the Anthropic API.
- `MAX_TURNS` in `agent.ts` caps the tool-use loop per message to avoid runaway agent behavior.
