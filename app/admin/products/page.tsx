"use client";

import { useEffect, useMemo, useState } from "react";
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

const PRESET_IMAGES = [
  { label: "Leather Stitch Detail", url: "/images/triptych_leather_stitch.jpg" },
  { label: "Executive Leather Hide", url: "/images/grid_leather_hide.jpg" },
  { label: "Bags & Backpacks", url: "/images/grid_backpack.jpg" },
  { label: "Leather Jacket", url: "/images/grid_leather_jacket.jpg" },
  { label: "Activewear & Sportswear", url: "/images/grid_sportswear.jpg" },
  { label: "Tracksuit & Apparel", url: "/images/grid_tracksuit.jpg" },
  { label: "Industrial Workwear", url: "/images/grid_workwear.jpg" },
  { label: "Factory Craftsmanship", url: "/images/hero_factory_sewing.jpg" },
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

  // Form states
  const [activeProduct, setActiveProduct] = useState<ProductItem | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Leather Products",
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
      category: categories[0] || "Activewear",
      image: PRESET_IMAGES[0].url,
    });
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const newProd: ProductItem = {
      id: `prod-${Date.now()}`,
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      image: formData.image || "/images/grid_sportswear.jpg",
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
            description: formData.description.trim(),
            category: formData.category,
            image: formData.image,
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
                      // Fallback image if custom URL fails
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

      {/* ================= MODAL: ADD PRODUCT ================= */}
      {isAddModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box">
            <h2 className="admin-modal-title">Add New Product</h2>
            <form onSubmit={handleSaveAdd}>
              <div className="admin-form-group">
                <label className="admin-form-label">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hand-Stitched Leather Sets"
                  className="admin-form-input"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Description / Specs</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Premium Italian calfskin with reinforced edges"
                  className="admin-form-textarea"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Category</label>
                <select
                  className="admin-form-select"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Select Thumbnail Image</label>
                <select
                  className="admin-form-select"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                >
                  {PRESET_IMAGES.map((img) => (
                    <option key={img.url} value={img.url}>
                      {img.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn-cancel"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT PRODUCT ================= */}
      {isEditModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box">
            <h2 className="admin-modal-title">Edit Product</h2>
            <form onSubmit={handleSaveEdit}>
              <div className="admin-form-group">
                <label className="admin-form-label">Product Title</label>
                <input
                  type="text"
                  required
                  className="admin-form-input"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Description / Specs</label>
                <textarea
                  rows={3}
                  required
                  className="admin-form-textarea"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Category</label>
                <select
                  className="admin-form-select"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Select Thumbnail Image</label>
                <select
                  className="admin-form-select"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                >
                  {PRESET_IMAGES.map((img) => (
                    <option key={img.url} value={img.url}>
                      {img.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn-cancel"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CONFIRM REMOVE ================= */}
      {isRemoveModalOpen && activeProduct && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box">
            <h2 className="admin-modal-title">Remove Product</h2>
            <p style={{ color: "#a6a6b5", fontSize: "14px", lineHeight: "1.6", marginBottom: "20px" }}>
              Are you sure you want to remove &ldquo;{activeProduct.title}&rdquo;?
              This action will remove it from the catalog.
            </p>
            <div className="admin-modal-footer">
              <button
                type="button"
                className="admin-btn-cancel"
                onClick={() => setIsRemoveModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-btn-remove"
                style={{ padding: "9px 24px" }}
                onClick={handleConfirmRemove}
              >
                Confirm Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: MANAGE CATEGORIES ================= */}
      {isManageCatsModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box">
            <h2 className="admin-modal-title">Manage Categories</h2>

            {/* Add Category row */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <input
                type="text"
                placeholder="New category name..."
                className="admin-form-input"
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
                className="admin-btn-primary"
                onClick={handleAddCategory}
              >
                Add
              </button>
            </div>

            {/* Existing Categories list */}
            <div
              style={{
                maxHeight: "300px",
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
                      background: "#0c0c12",
                      borderRadius: "8px",
                      border: "1px solid #1f1f2c",
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

            <div className="admin-modal-footer">
              <button
                type="button"
                className="admin-btn-primary"
                onClick={() => setIsManageCatsModalOpen(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
