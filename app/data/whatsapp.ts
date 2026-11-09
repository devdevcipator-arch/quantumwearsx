/**
 * QuantumWear X — WhatsApp Integration Utilities
 *
 * Formats quote requests into high-impact, professional B2B inquiry messages
 * and directs users to the platform's official WhatsApp business contact.
 */

export const WHATSAPP_NUMBER = "923143351255"; // Official WhatsApp number (+92 314 3351255)
export const WHATSAPP_DISPLAY_NUMBER = "+92 314 3351255";

export interface QuoteData {
  brandName?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  category?: string;
  productTitle?: string;
  quantity?: string;
  customizations?: string[];
  details?: string;
  source?: "modal" | "product_page" | "contact_page";
}

/**
 * Formats structured quote inquiry data into a clean, professional WhatsApp message
 * with bold labels, clean dividers, and clear sections.
 */
export function formatWhatsAppQuoteMessage(data: QuoteData): string {
  const lines: string[] = [];

  // Header Title
  lines.push("🏭 *NEW B2B QUOTE REQUEST — QUANTUMWEAR X*");
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // Product or Category Section
  if (data.productTitle) {
    lines.push("");
    lines.push("📦 *PRODUCT INQUIRY:*");
    lines.push(`• *Product:* ${data.productTitle}`);
    if (data.category && data.category !== data.productTitle) {
      lines.push(`• *Category:* ${data.category}`);
    }
  } else if (data.category) {
    lines.push("");
    lines.push("📦 *CATEGORY INQUIRY:*");
    lines.push(`• *Category:* ${data.category}`);
  }

  // Specifications Section
  const specs: string[] = [];
  if (data.quantity) {
    specs.push(`• *Target Volume / MOQ:* ${data.quantity}`);
  }
  if (data.customizations && data.customizations.length > 0) {
    specs.push(`• *Custom Finishes:* ${data.customizations.join(", ")}`);
  }
  if (specs.length > 0) {
    lines.push("");
    lines.push("📊 *ORDER SPECIFICATIONS:*");
    lines.push(...specs);
  }

  // Client & Brand Details Section
  const clientFields: string[] = [];
  if (data.contactName && data.contactName.trim()) {
    clientFields.push(`• *Contact Name:* ${data.contactName.trim()}`);
  }
  if (data.brandName && data.brandName.trim()) {
    clientFields.push(`• *Brand / Company:* ${data.brandName.trim()}`);
  }
  if (data.email && data.email.trim()) {
    clientFields.push(`• *Work Email:* ${data.email.trim()}`);
  }
  if (data.phone && data.phone.trim()) {
    clientFields.push(`• *WhatsApp / Phone:* ${data.phone.trim()}`);
  }
  if (clientFields.length > 0) {
    lines.push("");
    lines.push("👤 *CLIENT INFORMATION:*");
    lines.push(...clientFields);
  }

  // Project Notes / Tech Pack Specifications
  if (data.details && data.details.trim()) {
    lines.push("");
    lines.push("📝 *PROJECT DETAILS & TECH PACK NOTES:*");
    lines.push(data.details.trim());
  }

  // Footer
  lines.push("");
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━");
  lines.push("⚡ _Inquiry submitted via QuantumWear X B2B Platform (Sialkot, Pakistan)_");

  return lines.join("\n");
}

/**
 * Returns the full WhatsApp link with the URL-encoded message.
 */
export function getWhatsAppQuoteUrl(data: QuoteData): string {
  const message = formatWhatsAppQuoteMessage(data);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Safely redirects the user to WhatsApp.
 * Opens in a new tab if possible; otherwise navigates the current tab.
 */
export function openWhatsAppQuote(data: QuoteData): string {
  const url = getWhatsAppQuoteUrl(data);
  if (typeof window !== "undefined") {
    try {
      const opened = window.open(url, "_blank", "noopener,noreferrer");
      if (!opened || opened.closed || typeof opened.closed === "undefined") {
        window.location.href = url;
      }
    } catch {
      window.location.href = url;
    }
  }
  return url;
}
