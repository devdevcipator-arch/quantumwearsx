"use client";

import { useEffect, useRef, useState } from "react";

interface CatalogInfo {
  name: string;
  displayName: string;
  url: string;
  size: number;
  sizeFormatted: string;
  lastModified: string;
  category?: string;
  version?: string;
  status: string;
}

interface CatalogUploaderProps {
  categories?: string[];
  onProductsImported?: (count: number) => void;
  onCatalogUpdated?: (catalog: CatalogInfo) => void;
}

export default function CatalogUploader({
  onCatalogUpdated,
}: CatalogUploaderProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // PDF Catalog state
  const [currentCatalog, setCurrentCatalog] = useState<CatalogInfo>({
    name: "QuantumWearX-Catalog.pdf",
    displayName: "QuantumWear X B2B Master Wholesale Catalog",
    url: "/catalog/QuantumWearX-Catalog.pdf",
    size: 15859,
    sizeFormatted: "15.5 KB",
    lastModified: new Date().toISOString(),
    category: "All Categories",
    version: "v2.6 - SS26",
    status: "Active",
  });

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isDraggingPdf, setIsDraggingPdf] = useState(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState("");
  const [pdfAlert, setPdfAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const pdfInputRef = useRef<HTMLInputElement>(null);

  // Load current catalog stats on mount
  useEffect(() => {
    async function loadCatalog() {
      try {
        const res = await fetch("/api/catalog");
        if (res.ok) {
          const data = await res.json();
          if (data?.currentCatalog) {
            setCurrentCatalog(data.currentCatalog);
          }
        }
      } catch (err) {
        console.warn("Could not fetch catalog metadata:", err);
      }
    }
    loadCatalog();
  }, []);

  // Copy catalog public download link
  const handleCopyLink = () => {
    const fullUrl = `${window.location.origin}${currentCatalog.url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // PDF File drop handlers
  const handlePdfDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingPdf(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        setPdfFile(file);
        setPdfAlert(null);
      } else {
        setPdfAlert({
          type: "error",
          message: "Please drop a valid PDF document (.pdf file only).",
        });
      }
    }
  };

  const handlePdfFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        setPdfFile(file);
        setPdfAlert(null);
      } else {
        setPdfAlert({
          type: "error",
          message: "Please choose a valid PDF document (.pdf file only).",
        });
      }
    }
  };

  // Execute PDF catalog upload
  const handleUploadCatalog = async () => {
    if (!pdfFile) return;

    setIsUploadingPdf(true);
    setUploadProgress(15);
    setUploadStage("Preparing catalog payload...");
    setPdfAlert(null);

    try {
      const formData = new FormData();
      formData.append("file", pdfFile);
      formData.append("title", "QuantumWear X B2B Master Catalog");
      formData.append("category", "All Categories");
      formData.append("version", "v1.0");

      setUploadProgress(45);
      setUploadStage("Transferring PDF document to catalog repository...");

      const res = await fetch("/api/catalog", {
        method: "POST",
        body: formData,
      });

      setUploadProgress(85);
      setUploadStage("Synchronizing live website download link...");

      const data = await res.json();

      if (res.ok && data.success) {
        setUploadProgress(100);
        setUploadStage("Catalog published successfully!");

        const updated: CatalogInfo = data.catalog || {
          name: "QuantumWearX-Catalog.pdf",
          displayName: pdfFile.name.replace(".pdf", ""),
          url: "/catalog/QuantumWearX-Catalog.pdf",
          size: pdfFile.size,
          sizeFormatted: `${(pdfFile.size / (1024 * 1024)).toFixed(2)} MB`,
          lastModified: new Date().toISOString(),
          category: "All Categories",
          version: "v1.0",
          status: "Active",
        };

        setCurrentCatalog(updated);
        onCatalogUpdated?.(updated);
        setPdfFile(null);
        if (pdfInputRef.current) pdfInputRef.current.value = "";

        setPdfAlert({
          type: "success",
          message: `Official B2B Catalog successfully updated! The public download button on the website now delivers this latest file.`,
        });
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setPdfAlert({
        type: "error",
        message: err.message || "Failed to upload catalog file. Please try again.",
      });
    } finally {
      setIsUploadingPdf(false);
      setTimeout(() => {
        setUploadProgress(0);
        setUploadStage("");
      }, 3000);
    }
  };

  return (
    <section
      className="catalog-uploader-wrapper"
      aria-label="B2B Catalog and Lookbook Management Section"
    >
      {/* Header Bar */}
      <div className="catalog-uploader-header">
        <div className="catalog-uploader-title-group">
          <div className="catalog-uploader-icon-badge" aria-hidden="true">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z" />
              <polyline points="10 9 9 9 8 9" />
              <path d="M12 5v8" />
              <polyline points="9 10 12 13 15 10" />
            </svg>
          </div>
          <div>
            <div className="catalog-uploader-heading">
              <span>B2B Catalog & Lookbook Manager</span>
            </div>
            <p className="catalog-uploader-subtitle">
              Upload or update your official B2B PDF catalog for buyer downloads on the website.
            </p>
          </div>
        </div>

        {/* Collapse Toggle */}
        <div className="catalog-uploader-controls">
          <button
            type="button"
            className="catalog-toggle-btn"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-label={isExpanded ? "Collapse catalog section" : "Expand catalog section"}
            title={isExpanded ? "Collapse section" : "Expand section"}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.25s ease",
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Collapsible Body */}
      {isExpanded && (
        <div className="catalog-uploader-content">
          {/* Active Catalog Live Status Card */}
          <div className="catalog-active-card">
            <div className="catalog-active-left">
              <div className="catalog-pdf-icon-box" aria-hidden="true">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <span>PDF</span>
              </div>
              <div>
                <div className="catalog-active-name">
                  <span>{currentCatalog.name}</span>
                  <span className="catalog-live-indicator">
                    <span className="catalog-live-dot" />
                    <span>Live on Website</span>
                  </span>
                </div>
                <div className="catalog-active-meta">
                  <span><strong>Title:</strong> {currentCatalog.displayName}</span>
                  <span>•</span>
                  <span><strong>Size:</strong> {currentCatalog.sizeFormatted}</span>
                  <span>•</span>
                  <span>
                    <strong>Updated:</strong>{" "}
                    {new Date(currentCatalog.lastModified).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick actions for current catalog */}
            <div className="catalog-active-actions">
              <a
                href={currentCatalog.url}
                target="_blank"
                rel="noopener noreferrer"
                className="catalog-action-btn"
                title="Open PDF preview in browser tab"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span>Preview PDF</span>
              </a>

              <button
                type="button"
                className="catalog-action-btn"
                onClick={handleCopyLink}
                title="Copy direct download link to clipboard"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <span>{copiedLink ? "✓ Link Copied!" : "Copy Link"}</span>
              </button>

              <a
                href={currentCatalog.url}
                download={currentCatalog.name}
                className="catalog-action-btn primary"
                title="Download active B2B PDF catalog"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Download</span>
              </a>
            </div>
          </div>

          {/* Alert Feedback */}
          {pdfAlert && (
            <div className={`catalog-alert-banner ${pdfAlert.type}`} role="alert">
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {pdfAlert.type === "success" ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                )}
                <span>{pdfAlert.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setPdfAlert(null)}
                style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontSize: "16px" }}
              >
                ×
              </button>
            </div>
          )}

          {/* Upload New Catalog Area */}
          <div className="catalog-uploader-grid">
            {/* Drag and Drop Zone */}
            <div
              className={`catalog-dropzone ${isDraggingPdf ? "dragging" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingPdf(true);
              }}
              onDragLeave={() => setIsDraggingPdf(false)}
              onDrop={handlePdfDrop}
              onClick={() => pdfInputRef.current?.click()}
              tabIndex={0}
              role="button"
              aria-label="Upload PDF catalog"
            >
              <input
                ref={pdfInputRef}
                type="file"
                accept=".pdf,application/pdf"
                style={{ display: "none" }}
                onChange={handlePdfFileSelect}
              />

              <div className="catalog-dropzone-icon-circle" aria-hidden="true">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>

              {pdfFile ? (
                <div
                  className="catalog-selected-file-box"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="catalog-selected-file-info">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <span className="catalog-selected-filename">{pdfFile.name}</span>
                    <span className="catalog-selected-size">
                      ({(pdfFile.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <div className="catalog-selected-actions">
                    <button
                      type="button"
                      className="catalog-btn-cancel-file"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPdfFile(null);
                        if (pdfInputRef.current) pdfInputRef.current.value = "";
                      }}
                      disabled={isUploadingPdf}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="catalog-upload-submit-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUploadCatalog();
                      }}
                      disabled={isUploadingPdf}
                    >
                      {isUploadingPdf ? (
                        <>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            className="admin-spin-loader"
                          >
                            <line x1="12" y1="2" x2="12" y2="6" />
                            <line x1="12" y1="18" x2="12" y2="22" />
                            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                            <line x1="2" y1="12" x2="6" y2="12" />
                            <line x1="18" y1="12" x2="22" y2="12" />
                            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                          </svg>
                          <span>Publishing...</span>
                        </>
                      ) : (
                        <>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                          <span>PUBLISH CATALOG LIVE</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="catalog-dropzone-text-primary">
                    <span>Click to browse</span> or drag & drop PDF Catalog
                  </div>
                  <p className="catalog-dropzone-text-secondary">
                    Upload updated wholesale lookbook, seasonal linesheet, or master brochure.
                  </p>
                  <div className="catalog-dropzone-badges">
                    <span className="catalog-spec-badge">PDF format</span>
                    <span className="catalog-spec-badge">Max 50 MB</span>
                    <span className="catalog-spec-badge">Auto-updates live link</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Upload Progress Bar */}
          {isUploadingPdf && (
            <div className="catalog-progress-card">
              <div className="catalog-progress-header">
                <div className="catalog-progress-filename">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  </svg>
                  <span>{pdfFile?.name}</span>
                </div>
                <span className="catalog-progress-pct">{uploadProgress}%</span>
              </div>
              <div className="catalog-progress-track">
                <div className="catalog-progress-fill" style={{ width: `${uploadProgress}%` }} />
              </div>
              <div className="catalog-progress-stage">{uploadStage}</div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
