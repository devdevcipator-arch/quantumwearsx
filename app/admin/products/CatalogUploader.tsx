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
  categories = [],
  onCatalogUpdated,
}: CatalogUploaderProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<"catalog" | "csv">("catalog");

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

  // Form Configuration Inputs
  const [catalogTitle, setCatalogTitle] = useState("QuantumWear X B2B Master Catalog");
  const [catalogCategory, setCatalogCategory] = useState("All Categories");
  const [catalogVersion, setCatalogVersion] = useState("SS26-v2.6");

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
            if (data.currentCatalog.displayName) {
              setCatalogTitle(data.currentCatalog.displayName);
            }
            if (data.currentCatalog.version) {
              setCatalogVersion(data.currentCatalog.version);
            }
            if (data.currentCatalog.category) {
              setCatalogCategory(data.currentCatalog.category);
            }
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
    const fullUrl = currentCatalog.url.startsWith("http")
      ? currentCatalog.url
      : `${window.location.origin}${currentCatalog.url}`;
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
      formData.append("title", catalogTitle || "QuantumWear X B2B Master Catalog");
      formData.append("category", catalogCategory || "All Categories");
      formData.append("version", catalogVersion || "v1.0");

      setUploadProgress(45);
      setUploadStage("Uploading PDF to cloud storage...");

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
          displayName: catalogTitle || pdfFile.name.replace(".pdf", ""),
          url: data.catalog?.url || "/api/catalog/download",
          size: pdfFile.size,
          sizeFormatted: `${(pdfFile.size / (1024 * 1024)).toFixed(2)} MB`,
          lastModified: new Date().toISOString(),
          category: catalogCategory,
          version: catalogVersion,
          status: "Active",
        };

        setCurrentCatalog(updated);
        onCatalogUpdated?.(updated);
        setPdfFile(null);
        if (pdfInputRef.current) pdfInputRef.current.value = "";

        setPdfAlert({
          type: "success",
          message: `Official B2B Catalog successfully updated and published! The public download button on the website now serves this latest file.`,
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
      className="catalog-uploader-wrapper mb-8"
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
              <span className="catalog-uploader-tag">WHOLESALE</span>
            </div>
            <p className="catalog-uploader-subtitle">
              Publish downloadable seasonal PDF catalogs for buyers, or batch-import products from spreadsheet.
            </p>
          </div>
        </div>

        {/* Controls: Mode Switcher + Collapse Toggle */}
        <div className="catalog-uploader-controls">
          <div className="catalog-tab-pill-group" role="tablist">
            <button
              type="button"
              className={`catalog-tab-pill ${activeTab === "catalog" ? "active" : ""}`}
              onClick={() => setActiveTab("catalog")}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z" />
              </svg>
              <span>PDF Catalog (Lookbook)</span>
            </button>
            <button
              type="button"
              className={`catalog-tab-pill ${activeTab === "csv" ? "active" : ""}`}
              onClick={() => setActiveTab("csv")}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polyline points="16 16 12 12 8 16" />
                <line x1="12" y1="12" x2="12" y2="21" />
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
              </svg>
              <span>Bulk Importer (CSV)</span>
            </button>
          </div>

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
                  <span><strong>Target:</strong> {currentCatalog.category || "All Categories"}</span>
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

          {/* Upload New Catalog Area: 2-Column Grid */}
          <div className="catalog-uploader-grid">
            {/* Left: Drag and Drop Zone */}
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
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
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
                  className="catalog-selected-file-box text-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-sm font-bold text-[#ff4d5a] mb-1">
                    Selected: {pdfFile.name} ({(pdfFile.size / 1024).toFixed(1)} KB)
                  </div>
                  <p className="catalog-dropzone-text-secondary">
                    Ready to publish. Fill details on the right and click Publish Catalog.
                  </p>
                  <div className="catalog-dropzone-badges">
                    <span className="catalog-spec-badge">PDF format</span>
                    <span className="catalog-spec-badge">Max 50 MB</span>
                    <span className="catalog-spec-badge">Auto-updates live link</span>
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

            {/* Right: Catalog Configuration Card */}
            <div className="catalog-metadata-card">
              <div className="catalog-meta-title">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                <span>Catalog Configuration</span>
              </div>

              <div className="catalog-form-field">
                <label className="catalog-field-label">Catalog Display Title</label>
                <input
                  type="text"
                  className="catalog-input"
                  placeholder="e.g. QuantumWear X B2B Master Catalog"
                  value={catalogTitle}
                  onChange={(e) => setCatalogTitle(e.target.value)}
                />
              </div>

              <div className="catalog-form-field">
                <label className="catalog-field-label">Target Category / Scope</label>
                <select
                  className="catalog-select"
                  value={catalogCategory}
                  onChange={(e) => setCatalogCategory(e.target.value)}
                >
                  <option value="All Categories">All Categories (Master Catalog)</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="catalog-form-field">
                <label className="catalog-field-label">Season / Version Tag</label>
                <input
                  type="text"
                  className="catalog-input"
                  placeholder="e.g. SS26-v2.6"
                  value={catalogVersion}
                  onChange={(e) => setCatalogVersion(e.target.value)}
                />
              </div>

              <button
                type="button"
                className="catalog-upload-submit-btn"
                onClick={handleUploadCatalog}
                disabled={isUploadingPdf || !pdfFile}
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
