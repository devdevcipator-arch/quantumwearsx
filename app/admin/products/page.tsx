"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

export interface ProductItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
}

const INITIAL_CATEGORIES = [
  "Activewear",
  "Sportswear",
  "Streetwear",
  "Safety Wear",
  "Leather Products",
  "Custom Bags",
  "Denim & Casual",
  "Jackets & Outerwear",
  "Accessories",
  "Tactical Wear",
  "Gym Clothing",
  "Compression Wear",
  "Footwear",
  "Handbags",
  "Duffle Bags",
  "Tech Packs",
  "Tracksuits",
  "Workwear",
];

const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: "prod-1",
    title: "Hand-Stitched Leather Sets",
    description: "Premium Italian calfskin with reinforced edges",
    category: "Leather Products",
    image: "/images/triptych_leather_stitch.jpg",
  },
  {
    id: "prod-2",
    title: "Executive Briefcase",
    description: "Full-grain leather with dedicated laptop sleeve",
    category: "Custom Bags",
    image: "/images/grid_backpack.jpg",
  },
  {
    id: "prod-3",
    title: "Noir Watch Strap",
    description: "Hand-crafted exotic leather pattern",
    category: "Leather Products",
    image: "/images/grid_leather_hide.jpg",
  },
  {
    id: "prod-4",
    title: "Signature Desk Mat",
    description: "Spacious minimalist workspace essential",
    category: "Leather Products",
    image: "/images/grid_leather_jacket.jpg",
  },
  {
    id: "prod-5",
    title: "Engineered Compression Gym T-Shirt",
    description: "Moisture-wicking four-way stretch fabric with ergonomic flatlock seams",
    category: "Activewear",
    image: "/images/grid_sportswear.jpg",
  },
  {
    id: "prod-6",
    title: "Pro Performance Athletic Tracksuit",
    description: "Custom breathable poly-spandex blend built for high-intensity training",
    category: "Sportswear",
    image: "/images/grid_tracksuit.jpg",
  },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<string[]>(INITIAL_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("All Products");
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [isManageCatsModalOpen, setIsManageCatsModalOpen] = useState(false);

  // File input refs for uploading images
  const addFileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [activeProduct, setActiveProduct] = useState<ProductItem | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: "/images/triptych_leather_stitch.jpg",
  });
  const [newCatInput, setNewCatInput] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem("qw_admin_products");
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      }
      const savedCats = localStorage.getItem("qw_admin_categories");
      if (savedCats) {
        setCategories(JSON.parse(savedCats));
      }
    } catch {
      // Fallback to initial
    }
  }, []);

  const saveProducts = (updated: ProductItem[]) => {
    setProducts(updated);
    try {
      localStorage.setItem("qw_admin_products", JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
  };

  const saveCategories = (updated: string[]) => {
    setCategories(updated);
    try {
      localStorage.setItem("qw_admin_categories", JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
  };

  // Image upload handler via FileReader
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setFormData((prev) => ({ ...prev, image: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Filter products by tab & search query
  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return products.filter((prod) => {
      const matchesTab =
        selectedTab === "All Products" ||
        prod.category.toLowerCase() === selectedTab.toLowerCase();
      const matchesSearch =
        !q ||
        prod.title.toLowerCase().includes(q) ||
        prod.description.toLowerCase().includes(q) ||
        prod.category.toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }, [products, selectedTab, searchQuery]);

  // Handlers for Add
  const handleOpenAdd = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      image: "/images/triptych_leather_stitch.jpg",
    });
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const newProd: ProductItem = {
      id: `prod-${Date.now()}`,
      title: formData.title.trim(),
      description:
        formData.description.trim() ||
        `${formData.category || "Custom"} · Premium handcrafted specification`,
      category: formData.category || "Leather Products",
      image: formData.image || "/images/triptych_leather_stitch.jpg",
    };

    saveProducts([newProd, ...products]);
    setIsAddModalOpen(false);
  };

  // Handlers for Edit
  const handleOpenEdit = (prod: ProductItem) => {
    setActiveProduct(prod);
    setFormData({
      title: prod.title,
      description: prod.description,
      category: prod.category,
      image: prod.image,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProduct || !formData.title.trim()) return;

    const updated = products.map((p) =>
      p.id === activeProduct.id
        ? {
            ...p,
            title: formData.title.trim(),
            description:
              formData.description.trim() ||
              `${formData.category} · Premium handcrafted specification`,
            category: formData.category || p.category,
            image: formData.image || p.image,
          }
        : p
    );

    saveProducts(updated);
    setIsEditModalOpen(false);
    setActiveProduct(null);
  };

  // Handlers for Remove
  const handleOpenRemove = (prod: ProductItem) => {
    setActiveProduct(prod);
    setIsRemoveModalOpen(true);
  };

  const handleConfirmRemove = () => {
    if (!activeProduct) return;
    const updated = products.filter((p) => p.id !== activeProduct.id);
    saveProducts(updated);
    setIsRemoveModalOpen(false);
    setActiveProduct(null);
  };

  // Handlers for Categories
  const handleAddCategory = () => {
    const trimmed = newCatInput.trim();
    if (!trimmed || categories.includes(trimmed)) return;
    saveCategories([...categories, trimmed]);
    setNewCatInput("");
  };

  const handleRemoveCategory = (catToRemove: string) => {
    if (categories.length <= 1) return;
    saveCategories(categories.filter((c) => c !== catToRemove));
    if (selectedTab === catToRemove) setSelectedTab("All Products");
  };

  // Additional categories for "More categories" dropdown
  const moreCategories = categories.filter(
    (c) => c !== "Activewear" && c !== "Sportswear"
  );

  return (
    <div className="admin-layout-root">
      {/* 1. Left Sidebar */}
      <aside className="admin-sidebar" aria-label="Admin Navigation">
        <div className="admin-sidebar-header">
          <div className="admin-brand-icon">Q</div>
          <span className="admin-brand-name">QuantumWear X</span>
        </div>

        <nav className="admin-nav">
          <button type="button" className="admin-nav-item active">
            <svg
              className="admin-nav-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            <span>Products</span>
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <Link href="/products" className="admin-back-link">
            <span>← View Public Store</span>
          </Link>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="admin-main-content">
        {/* Top Header */}
        <div className="admin-top-bar">
          <h1 className="admin-page-title">Product Management</h1>
        </div>

        {/* Stats Row */}
        <div className="admin-stats-grid">
          {/* Total Products Card */}
          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-label">Total Products</div>
              <div className="admin-stat-number">
                {products.length > 6 ? products.length : "1,248"}
              </div>
            </div>
            <div className="admin-stat-icon-box" aria-hidden="true">
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
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
          </div>

          {/* Total Categories Card */}
          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-label">Total Categories</div>
              <div className="admin-stat-number">{categories.length}</div>
            </div>
            <div className="admin-stat-icon-box" aria-hidden="true">
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
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="admin-actions-bar">
          {/* Search Box */}
          <div className="admin-search-wrapper">
            <svg
              className="admin-search-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.5" y2="16.5" />
            </svg>
            <input
              type="search"
              className="admin-search-input"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search products"
            />
          </div>

          {/* Buttons */}
          <div className="admin-buttons-group">
            <button
              type="button"
              className="admin-btn-primary"
              onClick={handleOpenAdd}
            >
              <span>+ ADD NEW PRODUCT</span>
            </button>
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={() => setIsManageCatsModalOpen(true)}
            >
              <span>+ MANAGE CATEGORIES</span>
            </button>
          </div>
        </div>

        {/* Categories Tab Navigation */}
        <div className="admin-tabs-row" role="tablist">
          <button
            type="button"
            className={`admin-tab-btn ${
              selectedTab === "All Products" ? "active" : ""
            }`}
            onClick={() => setSelectedTab("All Products")}
          >
            All Products
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${
              selectedTab === "Activewear" ? "active" : ""
            }`}
            onClick={() => setSelectedTab("Activewear")}
          >
            Activewear
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${
              selectedTab === "Sportswear" ? "active" : ""
            }`}
            onClick={() => setSelectedTab("Sportswear")}
          >
            Sportswear
          </button>

          {/* More categories dropdown */}
          <div className="admin-more-cats-dropdown">
            <button
              type="button"
              className={`admin-tab-btn ${
                moreCategories.includes(selectedTab) ? "active" : ""
              }`}
              onClick={() => setMoreDropdownOpen((prev) => !prev)}
            >
              {moreCategories.includes(selectedTab)
                ? selectedTab
                : "More categories"}{" "}
              ▾
            </button>
            {moreDropdownOpen && (
              <div className="admin-dropdown-menu">
                {moreCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`admin-dropdown-item ${
                      selectedTab === cat ? "active" : ""
                    }`}
                    onClick={() => {
                      setSelectedTab(cat);
                      setMoreDropdownOpen(false);
                    }}
                  >
                    <span>{cat}</span>
                    {selectedTab === cat && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Cards List */}
        <div className="admin-products-list">
          {filteredProducts.length === 0 ? (
            <div className="admin-empty-state">
              <p>No products found matching &ldquo;{searchQuery}&rdquo;</p>
            </div>
          ) : (
            filteredProducts.map((prod) => (
              <div key={prod.id} className="admin-product-card">
                <div className="admin-product-left">
                  <img
                    src={prod.image}
                    alt={prod.title}
                    className="admin-product-img"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/images/grid_sportswear.jpg";
                    }}
                  />
                  <div className="admin-product-info">
                    <h3 className="admin-product-title">{prod.title}</h3>
                    <p className="admin-product-desc">{prod.description}</p>
                  </div>
                </div>

                <div className="admin-product-actions">
                  <button
                    type="button"
                    className="admin-btn-edit"
                    onClick={() => handleOpenEdit(prod)}
                  >
                    EDIT
                  </button>
                  <button
                    type="button"
                    className="admin-btn-remove"
                    onClick={() => handleOpenRemove(prod)}
                  >
                    REMOVE
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* ================= MODAL: ADD PRODUCT (MATCHING SCREENSHOT) ================= */}
      {isAddModalOpen && (
        <div
          className="admin-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddModalOpen(false);
          }}
        >
          <div className="add-product-modal-box">
            {/* Header */}
            <div className="add-product-modal-header">
              <h2 className="add-product-modal-title">Add New Product</h2>
              <p className="add-product-modal-subtitle">
                Enter the details for your new product
              </p>
            </div>

            <form onSubmit={handleSaveAdd}>
              {/* Field 1: PRODUCT IMAGE */}
              <div className="add-product-form-group">
                <label className="add-product-label">PRODUCT IMAGE</label>
                <div className="add-product-image-container">
                  <img
                    src={formData.image || "/images/triptych_leather_stitch.jpg"}
                    alt="Product preview"
                    className="add-product-bg-preview"
                  />
                  <input
                    type="file"
                    ref={addFileInputRef}
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                  />
                  <button
                    type="button"
                    className="add-product-upload-btn"
                    onClick={() => addFileInputRef.current?.click()}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M4 4h3l2-2h6l2 2h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm8 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                    </svg>
                    <span>UPLOAD IMAGE</span>
                  </button>
                </div>
              </div>

              {/* Field 2: PRODUCT NAME */}
              <div className="add-product-form-group">
                <label className="add-product-label">PRODUCT NAME</label>
                <input
                  type="text"
                  required
                  placeholder="Enter product name"
                  className="add-product-input"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              {/* Field 3: CATEGORY */}
              <div className="add-product-form-group">
                <label className="add-product-label">CATEGORY</label>
                <div className="add-product-select-wrapper">
                  <select
                    className="add-product-select"
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option value="" disabled>
                      Select category
                    </option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="add-product-select-arrow"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="add-product-footer">
                <button
                  type="button"
                  className="add-product-btn-cancel"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  CANCEL
                </button>
                <button type="submit" className="add-product-btn-submit">
                  ADD PRODUCT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT PRODUCT (MATCHING SCREENSHOT STYLE) ================= */}
      {isEditModalOpen && activeProduct && (
        <div
          className="admin-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsEditModalOpen(false);
          }}
        >
          <div className="add-product-modal-box">
            {/* Header */}
            <div className="add-product-modal-header">
              <h2 className="add-product-modal-title">Edit Product</h2>
              <p className="add-product-modal-subtitle">
                Update the details for this product
              </p>
            </div>

            <form onSubmit={handleSaveEdit}>
              {/* Field 1: PRODUCT IMAGE */}
              <div className="add-product-form-group">
                <label className="add-product-label">PRODUCT IMAGE</label>
                <div className="add-product-image-container">
                  <img
                    src={formData.image || "/images/triptych_leather_stitch.jpg"}
                    alt="Product preview"
                    className="add-product-bg-preview"
                  />
                  <input
                    type="file"
                    ref={editFileInputRef}
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                  />
                  <button
                    type="button"
                    className="add-product-upload-btn"
                    onClick={() => editFileInputRef.current?.click()}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M4 4h3l2-2h6l2 2h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm8 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                    </svg>
                    <span>UPLOAD IMAGE</span>
                  </button>
                </div>
              </div>

              {/* Field 2: PRODUCT NAME */}
              <div className="add-product-form-group">
                <label className="add-product-label">PRODUCT NAME</label>
                <input
                  type="text"
                  required
                  placeholder="Enter product name"
                  className="add-product-input"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              {/* Field 3: CATEGORY */}
              <div className="add-product-form-group">
                <label className="add-product-label">CATEGORY</label>
                <div className="add-product-select-wrapper">
                  <select
                    className="add-product-select"
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option value="" disabled>
                      Select category
                    </option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="add-product-select-arrow"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="add-product-footer">
                <button
                  type="button"
                  className="add-product-btn-cancel"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  CANCEL
                </button>
                <button type="submit" className="add-product-btn-submit">
                  UPDATE PRODUCT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CONFIRM REMOVE ================= */}
      {isRemoveModalOpen && activeProduct && (
        <div
          className="admin-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsRemoveModalOpen(false);
          }}
        >
          <div className="add-product-modal-box">
            <div className="add-product-modal-header">
              <h2 className="add-product-modal-title">Remove Product</h2>
              <p className="add-product-modal-subtitle">
                Are you sure you want to remove &ldquo;{activeProduct.title}&rdquo;?
              </p>
            </div>
            <p
              style={{
                color: "#a6a6b5",
                fontSize: "14px",
                lineHeight: "1.6",
                marginBottom: "24px",
              }}
            >
              This action will remove the product from the catalog. You can always re-add it later.
            </p>
            <div className="add-product-footer">
              <button
                type="button"
                className="add-product-btn-cancel"
                onClick={() => setIsRemoveModalOpen(false)}
              >
                CANCEL
              </button>
              <button
                type="button"
                className="admin-btn-remove"
                style={{ padding: "12px 28px", borderRadius: "12px" }}
                onClick={handleConfirmRemove}
              >
                CONFIRM REMOVE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: MANAGE CATEGORIES ================= */}
      {isManageCatsModalOpen && (
        <div
          className="admin-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsManageCatsModalOpen(false);
          }}
        >
          <div className="add-product-modal-box">
            <div className="add-product-modal-header">
              <h2 className="add-product-modal-title">Manage Categories</h2>
              <p className="add-product-modal-subtitle">
                Add, organize, or remove product categories
              </p>
            </div>

            {/* Add Category row */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <input
                type="text"
                placeholder="New category name..."
                className="add-product-input"
                style={{ padding: "10px 14px" }}
                value={newCatInput}
                onChange={(e) => setNewCatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCategory();
                  }
                }}
              />
              <button
                type="button"
                className="add-product-btn-submit"
                style={{ padding: "10px 20px" }}
                onClick={handleAddCategory}
              >
                Add
              </button>
            </div>

            {/* Existing Categories list */}
            <div
              style={{
                maxHeight: "280px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {categories.map((cat) => {
                const count = products.filter(
                  (p) => p.category.toLowerCase() === cat.toLowerCase()
                ).length;
                return (
                  <div
                    key={cat}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      background: "#08080c",
                      borderRadius: "8px",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 600, color: "#fff", fontSize: "14px" }}>
                        {cat}
                      </span>
                      <span style={{ fontSize: "12px", color: "#7a7a8d", marginLeft: "8px" }}>
                        ({count} {count === 1 ? "product" : "products"})
                      </span>
                    </div>
                    {categories.length > 1 && (
                      <button
                        type="button"
                        style={{
                          background: "none",
                          border: "none",
                          color: "#eb4553",
                          cursor: "pointer",
                          fontSize: "12px",
                          fontWeight: 700,
                        }}
                        onClick={() => handleRemoveCategory(cat)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="add-product-footer">
              <button
                type="button"
                className="add-product-btn-submit"
                onClick={() => setIsManageCatsModalOpen(false)}
              >
                DONE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
