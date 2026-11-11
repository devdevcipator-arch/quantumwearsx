"use client";

import { usePathname } from "next/navigation";

const WHATSAPP_NUMBER = "923314092799";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hi QuantumWear X, I would like to discuss a custom manufacturing inquiry."
);
const CATALOG_DOWNLOAD_URL = "/catalog/QuantumWearX-Catalog.pdf";
const CATALOG_FILENAME = "QuantumWearX-B2B-Catalog.pdf";

export default function FloatingWhatsApp() {
  const pathname = usePathname();

  // Hide on admin portal
  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <aside className="floating-actions-container" aria-label="Quick Actions">
      {/* 1. Catalog Download Floating Button (Above WhatsApp) */}
      <a
        href={CATALOG_DOWNLOAD_URL}
        download={CATALOG_FILENAME}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-action-btn floating-catalog-btn"
        aria-label="Download B2B Product Catalog (PDF)"
        title="Download Catalog (PDF)"
      >
        <svg
          className="floating-catalog-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Catalog booklet spine and cover */}
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z" />
          {/* Download arrow inside */}
          <line x1="12" y1="6" x2="12" y2="14" />
          <polyline points="9 11 12 14 15 11" />
          {/* Bottom tray/line */}
          <line x1="9" y1="17" x2="15" y2="17" />
        </svg>
        <span className="floating-action-tooltip">Download Catalog (PDF)</span>
      </a>

      {/* 2. WhatsApp Floating Button (Below Catalog) */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-action-btn floating-wa-btn floating-wa-toggle"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp (+92 331 4092799)"
      >
        <svg
          className="floating-wa-icon-whatsapp"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span className="floating-action-tooltip">Chat on WhatsApp</span>
      </a>
    </aside>
  );
}
