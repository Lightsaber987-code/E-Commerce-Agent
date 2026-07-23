import { FaqEntry } from "../types";

// Swap this for a real retrieval step (vector search over your help center)
// once you outgrow keyword matching. Keeping it simple here so the template
// has no external dependencies.
export const faqs: FaqEntry[] = [
  {
    question: "What is your return policy?",
    answer:
      "Most items can be returned within 30 days of delivery for a full refund, as long as they're unused and in original packaging. Final-sale items (like the mug set) are not eligible.",
    tags: ["returns", "refund", "policy"],
  },
  {
    question: "How long does shipping take?",
    answer:
      "Standard shipping takes 5-9 business days. Expedited shipping (selected at checkout) takes 2-3 business days.",
    tags: ["shipping", "delivery", "eta"],
  },
  {
    question: "How do I change my shipping address after ordering?",
    answer:
      "We can update the address as long as the order hasn't shipped yet. Once it's shipped, we're unable to redirect it, but you can refuse delivery or contact the carrier directly.",
    tags: ["shipping", "address", "order"],
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Yes, we ship to over 30 countries. International orders typically take 10-20 business days and may be subject to customs fees.",
    tags: ["shipping", "international"],
  },
  {
    question: "How do I use a discount code?",
    answer:
      "Enter your code in the 'Promo code' field at checkout before payment. Codes can't be applied retroactively to completed orders.",
    tags: ["discount", "promo", "checkout"],
  },
];

export function searchFaqs(query: string): FaqEntry[] {
  const q = query.toLowerCase();
  return faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(q) ||
      f.answer.toLowerCase().includes(q) ||
      f.tags.some((t) => q.includes(t))
  );
}
