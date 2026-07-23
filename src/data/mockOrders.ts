import { Order } from "../types";

// In a real system this would live in a database (Postgres, DynamoDB, etc.)
// and be queried through your order-management service. This in-memory
// store exists so the agent template runs end-to-end out of the box.
export const orders: Order[] = [
  {
    orderId: "ORD-1001",
    customerEmail: "jane.doe@example.com",
    status: "shipped",
    items: [{ sku: "SKU-001", name: "Wireless Earbuds", qty: 1, price: 79.99 }],
    total: 79.99,
    placedAt: "2026-07-15",
    eta: "2026-07-25",
    trackingNumber: "1Z999AA10123456784",
    returnEligible: true,
  },
  {
    orderId: "ORD-1002",
    customerEmail: "jane.doe@example.com",
    status: "delivered",
    items: [{ sku: "SKU-014", name: "Ceramic Coffee Mug (Set of 2)", qty: 1, price: 24.5 }],
    total: 24.5,
    placedAt: "2026-06-30",
    eta: "2026-07-05",
    trackingNumber: "1Z999AA10123456785",
    returnEligible: false,
  },
  {
    orderId: "ORD-1003",
    customerEmail: "sam.lee@example.com",
    status: "processing",
    items: [{ sku: "SKU-022", name: "Standing Desk Converter", qty: 1, price: 189.0 }],
    total: 189.0,
    placedAt: "2026-07-20",
    eta: "2026-07-29",
    returnEligible: false,
  },
];

export function findOrder(orderId: string): Order | undefined {
  return orders.find((o) => o.orderId.toLowerCase() === orderId.toLowerCase());
}

export function findOrdersByEmail(email: string): Order[] {
  return orders.filter((o) => o.customerEmail.toLowerCase() === email.toLowerCase());
}
