export interface Order {
  orderId: string;
  customerEmail: string;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  items: { sku: string; name: string; qty: number; price: number }[];
  total: number;
  placedAt: string;
  eta?: string;
  trackingNumber?: string;
  returnEligible: boolean;
}

export interface ReturnRequest {
  returnId: string;
  orderId: string;
  reason: string;
  status: "requested" | "approved" | "rejected" | "refunded";
  createdAt: string;
}

export interface FaqEntry {
  question: string;
  answer: string;
  tags: string[];
}

export interface EscalationTicket {
  ticketId: string;
  summary: string;
  customerEmail?: string;
  urgency: "low" | "medium" | "high";
  createdAt: string;
}

export interface ConversationTurn {
  role: "user" | "assistant";
  content: string;
}
