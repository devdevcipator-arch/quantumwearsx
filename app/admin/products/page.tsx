"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  fetchProductsFromDb,
  fetchCategoriesFromDb,
  addProductToDb,
  updateProductInDb,
  removeProductFromDb,
  addCategoryToDb,
  renameCategoryInDb,
  deleteCategoryFromDb,
  uploadProductImage,
} from "@/lib/products-service";

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
];

const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: "prod-1",
    title: "Gym T-shirts and tank tops",
    description: "Custom breathable athletic fabrics engineered for gym performance and durability",
    category: "Activewear",
    image: "/images/grid_sportswear.jpg",
  },
  {
    id: "prod-2",
    title: "Football and hockey uniforms",
    description: "Reinforced tear-resistant match jerseys and socks with vivid all-over sublimation printing",
    category: "Sportswear",
    image: "/images/grid_sportswear.jpg",
  },
  {
    id: "prod-3",
    title: "Oversized T-shirts",
    description: "Vintage-washed heavyweight combed cotton tees featuring dropped shoulders and custom fit blocks",
    category: "Streetwear",
    image: "/images/hero_factory_sewing.jpg",
  },
  {
    id: "prod-4",
    title: "High-visibility safety vests",
    description: "ANSI/ISEA 107 Class 2 certified mesh and solid polyester safety vests with silver reflective tape",
    category: "Safety Wear",
    image: "/images/grid_workwear.jpg",
  },
  {
    id: "prod-5",
    title: "Leather jackets",
    description: "Handcrafted 100% genuine top-grain cowhide and sheepskin leather jackets with antique YKK hardware",
    category: "Leather Products",
    image: "/images/grid_leather_jacket.jpg",
  },
  {
    id: "prod-6",
    title: "Backpacks",
    description: "High-density Cordura daypacks with waterproof zippers, ergonomic straps, and laptop sleeves",
    category: "Custom Bags",
    image: "/images/grid_backpack.jpg",
  },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<string[]>(INITIAL_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("All Products");
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  // Supabase & Cloud status
  const [dbConnected, setDbConnected] = useState(false);
  const [isDbLoading, setIsDbLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [isManageCatsModalOpen, setIsManageCatsModalOpen] = useState(false);

  // Manage Categories draft state
  const [draftCategories, setDraftCategories] = useState<string[]>(INITIAL_CATEGORIES);
  const [newCatInput, setNewCatInput] = useState("");
  const [editingCatIndex, setEditingCatIndex] = useState<number | null>(null);
  const [editingCatValue, setEditingCatValue] = useState("");

  // File input refs for uploading images
  const addFileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Form states for Add/Edit
  const [activeProduct, setActiveProduct] = useState<ProductItem | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: "/images/triptych_leather_stitch.jpg",
  });

  // Load from Supabase on mount (with localStorage cache fallback)
  useEffect(() => {
    async function loadData() {
      setIsDbLoading(true);
      try {
        const [dbProds, dbCats] = await Promise.all([
          fetchProductsFromDb(),
          fetchCategoriesFromDb(),
        ]);

        if (dbProds && dbProds.length > 0) {
          setProducts(dbProds);
          try {
            localStorage.setItem("qw_admin_products", JSON.stringify(dbProds));
          } catch {}
        }
        if (dbCats && dbCats.length > 0) {
          setCategories(dbCats);
          setDraftCategories(dbCats);
          try {
            localStorage.setItem("qw_admin_categories", JSON.stringify(dbCats));
          } catch {}
        }
        setDbConnected(true);
      } catch (err) {
        console.warn("Supabase fetch fallback to local cache", err);
        try {
          const savedProducts = localStorage.getItem("qw_admin_products");
          if (savedProducts) setProducts(JSON.parse(savedProducts));
          const savedCats = localStorage.getItem("qw_admin_categories");
          if (savedCats) {
            setCategories(JSON.parse(savedCats));
            setDraftCategories(JSON.parse(savedCats));
          }
        } catch {}
      } finally {
        setIsDbLoading(false);
      }
    }

    loadData();
  }, []);

  const saveProducts = (updated: ProductItem[]) => {
    setProducts(updated);
    try {
      localStorage.setItem("qw_admin_products", JSON.stringify(updated));
    } catch {}
  };

  const saveCategories = (updated: string[]) => {
    setCategories(updated);
    try {
      localStorage.setItem("qw_admin_categories", JSON.stringify(updated));
    } catch {}
  };

  // Image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, image: previewUrl }));
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
    setSelectedFile(null);
    setFormData({
      title: "",
      description: "",
      category: categories[0] || "Leather Products",
      image: "/images/triptych_leather_stitch.jpg",
    });
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || isSaving) return;

    setIsSaving(true);
    let finalImageUrl = formData.image || "/images/triptych_leather_stitch.jpg";

    try {
      if (selectedFile) {
        try {
          finalImageUrl = await uploadProductImage(selectedFile);
        } catch (uploadErr) {
          console.warn("Storage upload failed, falling back to local image:", uploadErr);
        }
      }

      const category = formData.category || (categories[0] || "Leather Products");
      const description =
        formData.description.trim() ||
        `${category} · Premium handcrafted specification`;

      let savedProd: ProductItem;
      try {
        savedProd = await addProductToDb({
          title: formData.title.trim(),
          description,
          category,
          image: finalImageUrl,
        });
      } catch (dbErr) {
        console.warn("DB insert fallback to local:", dbErr);
        savedProd = {
          id: `prod-${Date.now()}`,
          title: formData.title.trim(),
          description,
          category,
          image: finalImageUrl,
        };
      }

      saveProducts([savedProd, ...products]);
      setIsAddModalOpen(false);
      setSelectedFile(null);
    } finally {
      setIsSaving(false);
    }
  };

  // Handlers for Edit
  const handleOpenEdit = (prod: ProductItem) => {
    setSelectedFile(null);
    setActiveProduct(prod);
    setFormData({
      title: prod.title,
      description: prod.description,
      category: prod.category,
      image: prod.image,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProduct || !formData.title.trim() || isSaving) return;

    setIsSaving(true);
    let finalImageUrl = formData.image || activeProduct.image;

    try {
      if (selectedFile) {
        try {
          finalImageUrl = await uploadProductImage(selectedFile);
        } catch (uploadErr) {
          console.warn("Storage upload failed, falling back:", uploadErr);
        }
      }

      const category = formData.category || activeProduct.category;
      const description =
        formData.description.trim() ||
        `${category} · Premium handcrafted specification`;

      try {
        await updateProductInDb(activeProduct.id, {
          title: formData.title.trim(),
          description,
          category,
          image: finalImageUrl,
        });
      } catch (dbErr) {
        console.warn("DB update fallback to local:", dbErr);
      }

      const updated = products.map((p) =>
        p.id === activeProduct.id
          ? {
              ...p,
              title: formData.title.trim(),
              description,
              category,
              image: finalImageUrl,
            }
          : p
      );

      saveProducts(updated);
      setIsEditModalOpen(false);
      setActiveProduct(null);
      setSelectedFile(null);
    } finally {
      setIsSaving(false);
    }
  };

  // Handlers for Remove
  const handleOpenRemove = (prod: ProductItem) => {
    setActiveProduct(prod);
    setIsRemoveModalOpen(true);
  };

  const handleConfirmRemove = async () => {
    if (!activeProduct || isSaving) return;
    setIsSaving(true);
    try {
      try {
        await removeProductFromDb(activeProduct.id);
      } catch (dbErr) {
        console.warn("DB delete fallback to local:", dbErr);
      }
      const updated = products.filter((p) => p.id !== activeProduct.id);
      saveProducts(updated);
      setIsRemoveModalOpen(false);
      setActiveProduct(null);
    } finally {
      setIsSaving(false);
    }
  };

  // Handlers for Manage Categories
  const handleOpenManageCats = () => {
    setDraftCategories([...categories]);
    setNewCatInput("");
    setEditingCatIndex(null);
    setEditingCatValue("");
    setIsManageCatsModalOpen(true);
  };

  const handleAddCategory = () => {
    const trimmed = newCatInput.trim();
    if (!trimmed) return;
    if (draftCategories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      setNewCatInput("");
      return;
    }
    setDraftCategories([...draftCategories, trimmed]);
    setNewCatInput("");
  };

  const handleStartEditCategory = (index: number, currentName: string) => {
    setEditingCatIndex(index);
    setEditingCatValue(currentName);
  };

  const handleSaveEditCategory = async (index: number) => {
    const trimmed = editingCatValue.trim();
    if (
      trimmed &&
      !draftCategories.some(
        (c, i) => i !== index && c.toLowerCase() === trimmed.toLowerCase()
      )
    ) {
      const updated = [...draftCategories];
      const oldName = updated[index];
      updated[index] = trimmed;
      setDraftCategories(updated);

      if (oldName !== trimmed) {
        try {
          await renameCategoryInDb(oldName, trimmed);
        } catch (e) {
          console.warn("Error renaming in DB:", e);
        }

        const updatedProducts = products.map((p) =>
          p.category === oldName ? { ...p, category: trimmed } : p
        );
        saveProducts(updatedProducts);
      }
    }
    setEditingCatIndex(null);
    setEditingCatValue("");
  };

  const handleDeleteCategory = (index: number) => {
    if (draftCategories.length <= 1) return;
    const catToDelete = draftCategories[index];
    setDraftCategories(draftCategories.filter((_, i) => i !== index));
    if (selectedTab === catToDelete) {
      setSelectedTab("All Products");
    }
  };

  const handleSaveManageCats = async () => {
    setIsSaving(true);
    try {
      // Find additions
      for (let i = 0; i < draftCategories.length; i++) {
        const cat = draftCategories[i];
        if (!categories.includes(cat)) {
          try {
            await addCategoryToDb(cat, i);
          } catch (e) {
            console.warn("DB add category error:", e);
          }
        }
      }

      // Find deletions
      for (const oldCat of categories) {
        if (!draftCategories.includes(oldCat)) {
          try {
            await deleteCategoryFromDb(oldCat);
          } catch (e) {
            console.warn("DB delete category error:", e);
          }
        }
      }

      saveCategories(draftCategories);
      if (!draftCategories.includes(selectedTab) && selectedTab !== "All Products") {
        setSelectedTab("All Products");
      }
      setIsManageCatsModalOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelManageCats = () => {
    setIsManageCatsModalOpen(false);
    setEditingCatIndex(null);
    setEditingCatValue("");
    setNewCatInput("");
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
          <div>
            {isSaving ? (
              <div className="admin-db-status syncing">
                <span className="admin-db-dot" />
                <span>Saving to Supabase...</span>
              </div>
            ) : dbConnected ? (
              <div className="admin-db-status">
                <span className="admin-db-dot" />
                <span>Supabase Live DB</span>
              </div>
            ) : isDbLoading ? (
              <div className="admin-db-status syncing">
                <span className="admin-db-dot" />
                <span>Connecting to Supabase...</span>
              </div>
            ) : null}
          </div>
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
              onClick={handleOpenManageCats}
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

              {/* Field 3: DESCRIPTION */}
              <div className="add-product-form-group">
                <label className="add-product-label">DESCRIPTION</label>
                <textarea
                  rows={3}
                  placeholder="Enter product description or specifications"
                  className="add-product-textarea"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              {/* Field 4: CATEGORY */}
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
                  disabled={isSaving}
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="add-product-btn-submit"
                  disabled={isSaving}
                  style={isSaving ? { opacity: 0.7, cursor: "not-allowed" } : undefined}
                >
                  {isSaving ? "SAVING..." : "ADD PRODUCT"}
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

              {/* Field 3: DESCRIPTION */}
              <div className="add-product-form-group">
                <label className="add-product-label">DESCRIPTION</label>
                <textarea
                  rows={3}
                  placeholder="Enter product description or specifications"
                  className="add-product-textarea"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              {/* Field 4: CATEGORY */}
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
                  disabled={isSaving}
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="add-product-btn-submit"
                  disabled={isSaving}
                  style={isSaving ? { opacity: 0.7, cursor: "not-allowed" } : undefined}
                >
                  {isSaving ? "SAVING..." : "UPDATE PRODUCT"}
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
                disabled={isSaving}
              >
                CANCEL
              </button>
              <button
                type="button"
                className="admin-btn-remove"
                style={{ padding: "12px 28px", borderRadius: "12px", ...(isSaving ? { opacity: 0.7, cursor: "not-allowed" } : {}) }}
                onClick={handleConfirmRemove}
                disabled={isSaving}
              >
                {isSaving ? "REMOVING..." : "CONFIRM REMOVE"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: MANAGE CATEGORIES (MATCHING SCREENSHOT) ================= */}
      {isManageCatsModalOpen && (
        <div
          className="admin-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCancelManageCats();
          }}
        >
          <div className="manage-cats-modal-box">
            {/* Header */}
            <div className="manage-cats-header">
              <h2 className="manage-cats-title">Manage Categories</h2>
              <button
                type="button"
                className="manage-cats-close-btn"
                onClick={handleCancelManageCats}
                aria-label="Close"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* ADD NEW CATEGORY section */}
            <div>
              <label className="manage-cats-section-label">
                ADD NEW CATEGORY
              </label>
              <div className="manage-cats-add-row">
                <input
                  type="text"
                  placeholder="e.g. Compression Gear"
                  className="manage-cats-input"
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
                  className="manage-cats-btn-add"
                  onClick={handleAddCategory}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span>ADD</span>
                </button>
              </div>
            </div>

            {/* EXISTING CATEGORIES section */}
            <div style={{ flex: 1, minHeight: 0 }}>
              <label className="manage-cats-section-label">
                EXISTING CATEGORIES
              </label>
              <div className="manage-cats-list">
                {draftCategories.map((cat, idx) => (
                  <div key={`${cat}-${idx}`} className="manage-cats-item">
                    {editingCatIndex === idx ? (
                      <input
                        type="text"
                        autoFocus
                        className="manage-cats-inline-input"
                        value={editingCatValue}
                        onChange={(e) => setEditingCatValue(e.target.value)}
                        onBlur={() => handleSaveEditCategory(idx)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleSaveEditCategory(idx);
                          } else if (e.key === "Escape") {
                            setEditingCatIndex(null);
                          }
                        }}
                      />
                    ) : (
                      <span className="manage-cats-name">{cat}</span>
                    )}

                    <div className="manage-cats-actions">
                      {/* Edit Button */}
                      <button
                        type="button"
                        className="manage-cats-action-btn"
                        aria-label={`Edit ${cat}`}
                        onClick={() => {
                          if (editingCatIndex === idx) {
                            handleSaveEditCategory(idx);
                          } else {
                            handleStartEditCategory(idx, cat);
                          }
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        className="manage-cats-action-btn delete"
                        aria-label={`Delete ${cat}`}
                        onClick={() => handleDeleteCategory(idx)}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="manage-cats-footer">
              <button
                type="button"
                className="manage-cats-btn-save"
                onClick={handleSaveManageCats}
                disabled={isSaving}
                style={isSaving ? { opacity: 0.7, cursor: "not-allowed" } : undefined}
              >
                {isSaving ? "SAVING CHANGES..." : "SAVE CHANGES"}
              </button>
              <button
                type="button"
                className="manage-cats-btn-cancel"
                onClick={handleCancelManageCats}
                disabled={isSaving}
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
