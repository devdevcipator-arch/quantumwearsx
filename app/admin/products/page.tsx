"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ProductItem,
  SubcategoryItem,
  DEFAULT_PRODUCTS,
  fetchProductsFromDb,
  fetchCategoriesFromDb,
  fetchSubcategoriesFromDb,
  getDefaultSubcategoriesList,
  addProductToDb,
  updateProductInDb,
  removeProductFromDb,
  addCategoryToDb,
  updateCategoryOrderInDb,
  renameCategoryInDb,
  deleteCategoryFromDb,
  addSubcategoryToDb,
  renameSubcategoryInDb,
  deleteSubcategoryFromDb,
  uploadProductImage,
  setStoredSubcategory,
  setStoredProductExtras,
} from "@/lib/products-service";

export type { ProductItem, SubcategoryItem };

const INITIAL_CATEGORIES = [
  "Activewear",
  "Sportswear",
  "Streetwear",
  "Safety Wear",
  "Leather Products",
  "Custom Bags",
];

const INITIAL_PRODUCTS: ProductItem[] = DEFAULT_PRODUCTS;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<string[]>(INITIAL_CATEGORIES);
  const [subcategories, setSubcategories] = useState<SubcategoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("All Products");
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  // Supabase & Cloud status
  const [dbConnected, setDbConnected] = useState(false);
  const [isDbLoading, setIsDbLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSecFile1, setSelectedSecFile1] = useState<File | null>(null);
  const [selectedSecFile2, setSelectedSecFile2] = useState<File | null>(null);
  const [selectedSecFile3, setSelectedSecFile3] = useState<File | null>(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [isManageCatsModalOpen, setIsManageCatsModalOpen] = useState(false);

  // Manage Categories & Subcategories draft state
  const [draftCategories, setDraftCategories] = useState<string[]>(INITIAL_CATEGORIES);
  const [activeManageCategory, setActiveManageCategory] = useState<string>(INITIAL_CATEGORIES[0]);
  const [draftSubcategories, setDraftSubcategories] = useState<SubcategoryItem[]>([]);
  const [newCatInput, setNewCatInput] = useState("");
  const [newSubcatInput, setNewSubcatInput] = useState("");
  const [editingCatIndex, setEditingCatIndex] = useState<number | null>(null);
  const [editingCatValue, setEditingCatValue] = useState("");
  const [editingSubcatId, setEditingSubcatId] = useState<string | null>(null);
  const [editingSubcatValue, setEditingSubcatValue] = useState("");

  // File input refs for uploading primary and 3 secondary images
  const addFileInputRef = useRef<HTMLInputElement>(null);
  const addSecFileRef1 = useRef<HTMLInputElement>(null);
  const addSecFileRef2 = useRef<HTMLInputElement>(null);
  const addSecFileRef3 = useRef<HTMLInputElement>(null);

  const editFileInputRef = useRef<HTMLInputElement>(null);
  const editSecFileRef1 = useRef<HTMLInputElement>(null);
  const editSecFileRef2 = useRef<HTMLInputElement>(null);
  const editSecFileRef3 = useRef<HTMLInputElement>(null);

  // Form states for Add/Edit
  const [activeProduct, setActiveProduct] = useState<ProductItem | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    long_description: "",
    category: "",
    subcategory: "",
    image: "/images/triptych_leather_stitch.jpg",
    secondary_image_1: "",
    secondary_image_2: "",
    secondary_image_3: "",
  });

  // Load from Supabase on mount (with localStorage cache fallback)
  useEffect(() => {
    async function loadData() {
      setIsDbLoading(true);
      try {
        const [dbProds, dbCats, dbSubs] = await Promise.all([
          fetchProductsFromDb(),
          fetchCategoriesFromDb(),
          fetchSubcategoriesFromDb(),
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
          setActiveManageCategory(dbCats[0]);
          try {
            localStorage.setItem("qw_admin_categories", JSON.stringify(dbCats));
          } catch {}
        }
        if (dbSubs && dbSubs.length > 0) {
          setSubcategories(dbSubs);
          setDraftSubcategories(dbSubs);
          try {
            localStorage.setItem("qw_admin_subcategories", JSON.stringify(dbSubs));
          } catch {}
        } else {
          const defaults = getDefaultSubcategoriesList();
          setSubcategories(defaults);
          setDraftSubcategories(defaults);
        }
        setDbConnected(true);
      } catch (err) {
        console.warn("Supabase fetch fallback to local cache", err);
        try {
          const savedProducts = localStorage.getItem("qw_admin_products");
          if (savedProducts) setProducts(JSON.parse(savedProducts));
          const savedCats = localStorage.getItem("qw_admin_categories");
          if (savedCats) {
            const parsedCats = JSON.parse(savedCats);
            setCategories(parsedCats);
            setDraftCategories(parsedCats);
            if (parsedCats.length > 0) setActiveManageCategory(parsedCats[0]);
          }
          const savedSubs = localStorage.getItem("qw_admin_subcategories");
          if (savedSubs) {
            const parsedSubs = JSON.parse(savedSubs);
            setSubcategories(parsedSubs);
            setDraftSubcategories(parsedSubs);
          } else {
            const defaults = getDefaultSubcategoriesList();
            setSubcategories(defaults);
            setDraftSubcategories(defaults);
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

  const saveSubcategories = (updated: SubcategoryItem[]) => {
    setSubcategories(updated);
    setDraftSubcategories(updated);
    try {
      localStorage.setItem("qw_admin_subcategories", JSON.stringify(updated));
    } catch {}
  };

  // Primary image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, image: previewUrl }));
    }
  };

  // Secondary images (3 slots) upload handler
  const handleSecImageUpload = (slot: 1 | 2 | 3, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (slot === 1) {
        setSelectedSecFile1(file);
        setFormData((prev) => ({ ...prev, secondary_image_1: previewUrl }));
      } else if (slot === 2) {
        setSelectedSecFile2(file);
        setFormData((prev) => ({ ...prev, secondary_image_2: previewUrl }));
      } else if (slot === 3) {
        setSelectedSecFile3(file);
        setFormData((prev) => ({ ...prev, secondary_image_3: previewUrl }));
      }
    }
  };

  const handleRemoveSecImage = (slot: 1 | 2 | 3) => {
    if (slot === 1) {
      setSelectedSecFile1(null);
      setFormData((prev) => ({ ...prev, secondary_image_1: "" }));
      if (addSecFileRef1.current) addSecFileRef1.current.value = "";
      if (editSecFileRef1.current) editSecFileRef1.current.value = "";
    } else if (slot === 2) {
      setSelectedSecFile2(null);
      setFormData((prev) => ({ ...prev, secondary_image_2: "" }));
      if (addSecFileRef2.current) addSecFileRef2.current.value = "";
      if (editSecFileRef2.current) editSecFileRef2.current.value = "";
    } else if (slot === 3) {
      setSelectedSecFile3(null);
      setFormData((prev) => ({ ...prev, secondary_image_3: "" }));
      if (addSecFileRef3.current) addSecFileRef3.current.value = "";
      if (editSecFileRef3.current) editSecFileRef3.current.value = "";
    }
  };

  // Handle category change in forms to sync default subcategory
  const handleCategoryChange = (newCat: string) => {
    const matchingSubs = subcategories.filter(
      (s) => s.category.toLowerCase() === newCat.toLowerCase()
    );
    setFormData((prev) => ({
      ...prev,
      category: newCat,
      subcategory: matchingSubs[0]?.name || "",
    }));
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
        prod.category.toLowerCase().includes(q) ||
        (prod.subcategory && prod.subcategory.toLowerCase().includes(q));
      return matchesTab && matchesSearch;
    });
  }, [products, selectedTab, searchQuery]);

  // Handlers for Add
  const handleOpenAdd = () => {
    setSelectedFile(null);
    setSelectedSecFile1(null);
    setSelectedSecFile2(null);
    setSelectedSecFile3(null);
    const initialCat = categories[0] || "Activewear";
    const matchingSubs = subcategories.filter(
      (s) => s.category.toLowerCase() === initialCat.toLowerCase()
    );
    setFormData({
      title: "",
      description: "",
      long_description: "",
      category: initialCat,
      subcategory: matchingSubs[0]?.name || "",
      image: "/images/triptych_leather_stitch.jpg",
      secondary_image_1: "",
      secondary_image_2: "",
      secondary_image_3: "",
    });
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || isSaving) return;

    setIsSaving(true);
    let finalImageUrl = formData.image || "/images/triptych_leather_stitch.jpg";
    let finalSec1 = formData.secondary_image_1 || "";
    let finalSec2 = formData.secondary_image_2 || "";
    let finalSec3 = formData.secondary_image_3 || "";

    try {
      if (selectedFile) {
        try {
          finalImageUrl = await uploadProductImage(selectedFile);
        } catch (uploadErr) {
          console.warn("Storage upload failed, falling back to local image:", uploadErr);
        }
      }

      if (selectedSecFile1) {
        try {
          finalSec1 = await uploadProductImage(selectedSecFile1);
        } catch (uploadErr) {
          console.warn("Secondary image 1 upload failed:", uploadErr);
        }
      }

      if (selectedSecFile2) {
        try {
          finalSec2 = await uploadProductImage(selectedSecFile2);
        } catch (uploadErr) {
          console.warn("Secondary image 2 upload failed:", uploadErr);
        }
      }

      if (selectedSecFile3) {
        try {
          finalSec3 = await uploadProductImage(selectedSecFile3);
        } catch (uploadErr) {
          console.warn("Secondary image 3 upload failed:", uploadErr);
        }
      }

      const category = formData.category || (categories[0] || "Activewear");
      const subcategory = formData.subcategory || "";
      const description =
        formData.description.trim() ||
        `${subcategory || category} · Premium handcrafted specification`;
      const longDescription = formData.long_description.trim();
      const secImages = [finalSec1, finalSec2, finalSec3].filter(Boolean);

      let savedProd: ProductItem;
      try {
        savedProd = await addProductToDb({
          title: formData.title.trim(),
          description,
          long_description: longDescription,
          category,
          subcategory,
          image: finalImageUrl,
          secondary_image_1: finalSec1,
          secondary_image_2: finalSec2,
          secondary_image_3: finalSec3,
          secondary_images: secImages,
        });
      } catch (dbErr) {
        console.warn("DB insert fallback to local:", dbErr);
        savedProd = {
          id: `prod-${Date.now()}`,
          title: formData.title.trim(),
          description,
          long_description: longDescription,
          category,
          subcategory,
          image: finalImageUrl,
          secondary_image_1: finalSec1,
          secondary_image_2: finalSec2,
          secondary_image_3: finalSec3,
          secondary_images: secImages,
        };
      }

      setStoredSubcategory(savedProd.id, savedProd.title, subcategory);
      setStoredProductExtras(savedProd.id, savedProd.title, {
        long_description: longDescription,
        secondary_image_1: finalSec1,
        secondary_image_2: finalSec2,
        secondary_image_3: finalSec3,
        secondary_images: secImages,
      });

      saveProducts([savedProd, ...products]);
      setIsAddModalOpen(false);
      setSelectedFile(null);
      setSelectedSecFile1(null);
      setSelectedSecFile2(null);
      setSelectedSecFile3(null);
    } finally {
      setIsSaving(false);
    }
  };

  // Handlers for Edit
  const handleOpenEdit = (prod: ProductItem) => {
    setSelectedFile(null);
    setSelectedSecFile1(null);
    setSelectedSecFile2(null);
    setSelectedSecFile3(null);
    setActiveProduct(prod);
    setFormData({
      title: prod.title,
      description: prod.description,
      long_description: prod.long_description || "",
      category: prod.category,
      subcategory: prod.subcategory || "",
      image: prod.image,
      secondary_image_1: prod.secondary_image_1 || (prod.secondary_images?.[0] || ""),
      secondary_image_2: prod.secondary_image_2 || (prod.secondary_images?.[1] || ""),
      secondary_image_3: prod.secondary_image_3 || (prod.secondary_images?.[2] || ""),
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProduct || !formData.title.trim() || isSaving) return;

    setIsSaving(true);
    let finalImageUrl = formData.image || activeProduct.image;
    let finalSec1 = formData.secondary_image_1 || activeProduct.secondary_image_1 || "";
    let finalSec2 = formData.secondary_image_2 || activeProduct.secondary_image_2 || "";
    let finalSec3 = formData.secondary_image_3 || activeProduct.secondary_image_3 || "";

    try {
      if (selectedFile) {
        try {
          finalImageUrl = await uploadProductImage(selectedFile);
        } catch (uploadErr) {
          console.warn("Storage upload failed, falling back:", uploadErr);
        }
      }

      if (selectedSecFile1) {
        try {
          finalSec1 = await uploadProductImage(selectedSecFile1);
        } catch (uploadErr) {
          console.warn("Secondary image 1 upload failed:", uploadErr);
        }
      }

      if (selectedSecFile2) {
        try {
          finalSec2 = await uploadProductImage(selectedSecFile2);
        } catch (uploadErr) {
          console.warn("Secondary image 2 upload failed:", uploadErr);
        }
      }

      if (selectedSecFile3) {
        try {
          finalSec3 = await uploadProductImage(selectedSecFile3);
        } catch (uploadErr) {
          console.warn("Secondary image 3 upload failed:", uploadErr);
        }
      }

      const category = formData.category || activeProduct.category;
      const subcategory = formData.subcategory || "";
      const description =
        formData.description.trim() ||
        `${subcategory || category} · Premium handcrafted specification`;
      const longDescription = formData.long_description.trim();
      const secImages = [finalSec1, finalSec2, finalSec3].filter(Boolean);

      try {
        await updateProductInDb(activeProduct.id, {
          title: formData.title.trim(),
          description,
          long_description: longDescription,
          category,
          subcategory,
          image: finalImageUrl,
          secondary_image_1: finalSec1,
          secondary_image_2: finalSec2,
          secondary_image_3: finalSec3,
          secondary_images: secImages,
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
              long_description: longDescription,
              category,
              subcategory,
              image: finalImageUrl,
              secondary_image_1: finalSec1,
              secondary_image_2: finalSec2,
              secondary_image_3: finalSec3,
              secondary_images: secImages,
            }
          : p
      );

      setStoredSubcategory(activeProduct.id, formData.title.trim(), subcategory);
      setStoredProductExtras(activeProduct.id, formData.title.trim(), {
        long_description: longDescription,
        secondary_image_1: finalSec1,
        secondary_image_2: finalSec2,
        secondary_image_3: finalSec3,
        secondary_images: secImages,
      });

      saveProducts(updated);
      setIsEditModalOpen(false);
      setActiveProduct(null);
      setSelectedFile(null);
      setSelectedSecFile1(null);
      setSelectedSecFile2(null);
      setSelectedSecFile3(null);
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

  // Handlers for Manage Categories & Subcategories
  const handleOpenManageCats = () => {
    setDraftCategories([...categories]);
    setDraftSubcategories([...subcategories]);
    setActiveManageCategory(categories[0] || "Activewear");
    setNewCatInput("");
    setNewSubcatInput("");
    setEditingCatIndex(null);
    setEditingCatValue("");
    setEditingSubcatId(null);
    setEditingSubcatValue("");
    setIsManageCatsModalOpen(true);
  };

  const handleAddCategory = () => {
    const trimmed = newCatInput.trim();
    if (!trimmed) return;
    if (draftCategories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      setNewCatInput("");
      return;
    }
    // Newly created category appears at the TOP
    const updatedCats = [trimmed, ...draftCategories];
    setDraftCategories(updatedCats);
    setActiveManageCategory(trimmed);
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
        if (activeManageCategory === oldName) {
          setActiveManageCategory(trimmed);
        }

        // Update linked subcategories in draft state
        const updatedSubs = draftSubcategories.map((s) =>
          s.category === oldName ? { ...s, category: trimmed } : s
        );
        setDraftSubcategories(updatedSubs);
        saveSubcategories(updatedSubs);

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
    const newCats = draftCategories.filter((_, i) => i !== index);
    setDraftCategories(newCats);

    if (activeManageCategory === catToDelete) {
      setActiveManageCategory(newCats[0] || "");
    }

    // Also remove subcategories linked to this category
    const remainingSubs = draftSubcategories.filter((s) => s.category !== catToDelete);
    setDraftSubcategories(remainingSubs);
    saveSubcategories(remainingSubs);

    if (selectedTab === catToDelete) {
      setSelectedTab("All Products");
    }
  };

  // Subcategories management handlers
  const handleAddSubcategory = async () => {
    const trimmed = newSubcatInput.trim();
    if (!trimmed || !activeManageCategory) return;

    // Check duplicate under this category
    const exists = draftSubcategories.some(
      (s) =>
        s.category.toLowerCase() === activeManageCategory.toLowerCase() &&
        s.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      setNewSubcatInput("");
      return;
    }

    const currentCatSubs = draftSubcategories.filter(
      (s) => s.category.toLowerCase() === activeManageCategory.toLowerCase()
    );
    const otherSubs = draftSubcategories.filter(
      (s) => s.category.toLowerCase() !== activeManageCategory.toLowerCase()
    );

    const newSubItem: SubcategoryItem = {
      id: `sub-${Date.now()}`,
      name: trimmed,
      category: activeManageCategory,
      display_order: 0,
    };

    // Prepend so newly created subcategory appears at the TOP
    const updated = [newSubItem, ...currentCatSubs, ...otherSubs];
    setDraftSubcategories(updated);
    saveSubcategories(updated);
    setNewSubcatInput("");

    try {
      await addSubcategoryToDb(trimmed, activeManageCategory, 0);
    } catch (e) {
      console.warn("Error inserting subcategory into DB:", e);
    }
  };

  const handleStartEditSubcategory = (sub: SubcategoryItem) => {
    setEditingSubcatId(sub.id);
    setEditingSubcatValue(sub.name);
  };

  const handleSaveEditSubcategory = async (sub: SubcategoryItem) => {
    const trimmed = editingSubcatValue.trim();
    if (!trimmed || trimmed === sub.name) {
      setEditingSubcatId(null);
      setEditingSubcatValue("");
      return;
    }

    const oldName = sub.name;
    const updated = draftSubcategories.map((s) =>
      s.id === sub.id ? { ...s, name: trimmed } : s
    );
    setDraftSubcategories(updated);
    saveSubcategories(updated);

    // Update products with this subcategory
    const updatedProds = products.map((p) =>
      p.category === sub.category && p.subcategory === oldName
        ? { ...p, subcategory: trimmed }
        : p
    );
    saveProducts(updatedProds);

    try {
      await renameSubcategoryInDb(oldName, trimmed, sub.category);
    } catch (e) {
      console.warn("Error renaming subcategory in DB:", e);
    }

    setEditingSubcatId(null);
    setEditingSubcatValue("");
  };

  const handleDeleteSubcategory = async (sub: SubcategoryItem) => {
    const updated = draftSubcategories.filter((s) => s.id !== sub.id);
    setDraftSubcategories(updated);
    saveSubcategories(updated);

    // Clear subcategory from affected products
    const updatedProds = products.map((p) =>
      p.category === sub.category && p.subcategory === sub.name
        ? { ...p, subcategory: "" }
        : p
    );
    saveProducts(updatedProds);

    try {
      await deleteSubcategoryFromDb(sub.name, sub.category);
    } catch (e) {
      console.warn("Error deleting subcategory from DB:", e);
    }
  };

  const handleSaveManageCats = async () => {
    setIsSaving(true);
    try {
      // Find additions and update order for all draft categories
      for (let i = 0; i < draftCategories.length; i++) {
        const cat = draftCategories[i];
        if (!categories.includes(cat)) {
          try {
            await addCategoryToDb(cat, i);
          } catch (e) {
            console.warn("DB add category error:", e);
          }
        } else {
          try {
            await updateCategoryOrderInDb(cat, i);
          } catch (e) {}
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
      saveSubcategories(draftSubcategories);
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
    setEditingSubcatId(null);
    setEditingSubcatValue("");
    setNewSubcatInput("");
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
          <img src="/images/logo.png" alt="QuantumWearX Logo" className="admin-brand-icon" />
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
              placeholder="Search products, categories, subcategories..."
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
          {categories.slice(0, 3).map((cat) => (
            <button
              key={cat}
              type="button"
              className={`admin-tab-btn ${
                selectedTab === cat ? "active" : ""
              }`}
              onClick={() => setSelectedTab(cat)}
            >
              {cat}
            </button>
          ))}

          {/* More categories dropdown */}
          {categories.length > 3 && (
            <div className="admin-more-cats-dropdown">
              <button
                type="button"
                className={`admin-tab-btn ${
                  categories.slice(3).includes(selectedTab) ? "active" : ""
                }`}
                onClick={() => setMoreDropdownOpen((prev) => !prev)}
              >
                {categories.slice(3).includes(selectedTab)
                  ? selectedTab
                  : "More categories"}{" "}
                ▾
              </button>
              {moreDropdownOpen && (
                <div className="admin-dropdown-menu">
                  {categories.slice(3).map((cat) => (
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
          )}
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
                    <div className="admin-product-meta-row">
                      <span className="admin-product-cat-pill">{prod.category}</span>
                      {prod.subcategory && (
                        <span className="admin-product-subcat-pill">
                          {prod.subcategory}
                        </span>
                      )}
                    </div>
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
                Enter the details and subcategory for your new product
              </p>
            </div>

            <form onSubmit={handleSaveAdd}>
              {/* Field 1: PRIMARY PRODUCT IMAGE */}
              <div className="add-product-form-group">
                <label className="add-product-label">PRIMARY SHOWCASE IMAGE</label>
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
                    <span>UPLOAD PRIMARY IMAGE</span>
                  </button>
                </div>
              </div>

              {/* Field 1b: 3 SECONDARY GALLERY IMAGES */}
              <div className="add-product-form-group">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <label className="add-product-label" style={{ marginBottom: 0 }}>
                    SECONDARY IMAGES (3 GALLERY VIEWS)
                  </label>
                  <span style={{ fontSize: "11px", color: "#8a8a9e" }}>
                    Thumbnails in product detail switcher
                  </span>
                </div>
                <div className="add-product-secondary-images-grid">
                  {/* Slot 1 */}
                  <div
                    className={`add-product-sec-card ${formData.secondary_image_1 ? "has-image" : ""}`}
                    onClick={() => addSecFileRef1.current?.click()}
                  >
                    <span className="add-product-sec-badge">VIEW 1</span>
                    {formData.secondary_image_1 ? (
                      <>
                        <img
                          src={formData.secondary_image_1}
                          alt="Secondary view 1"
                          className="add-product-sec-preview"
                        />
                        <div className="add-product-sec-overlay">
                          <button
                            type="button"
                            className="add-product-sec-remove"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveSecImage(1);
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="add-product-sec-placeholder">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        <span>Upload View 1</span>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={addSecFileRef1}
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => handleSecImageUpload(1, e)}
                    />
                  </div>

                  {/* Slot 2 */}
                  <div
                    className={`add-product-sec-card ${formData.secondary_image_2 ? "has-image" : ""}`}
                    onClick={() => addSecFileRef2.current?.click()}
                  >
                    <span className="add-product-sec-badge">VIEW 2</span>
                    {formData.secondary_image_2 ? (
                      <>
                        <img
                          src={formData.secondary_image_2}
                          alt="Secondary view 2"
                          className="add-product-sec-preview"
                        />
                        <div className="add-product-sec-overlay">
                          <button
                            type="button"
                            className="add-product-sec-remove"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveSecImage(2);
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="add-product-sec-placeholder">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        <span>Upload View 2</span>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={addSecFileRef2}
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => handleSecImageUpload(2, e)}
                    />
                  </div>

                  {/* Slot 3 */}
                  <div
                    className={`add-product-sec-card ${formData.secondary_image_3 ? "has-image" : ""}`}
                    onClick={() => addSecFileRef3.current?.click()}
                  >
                    <span className="add-product-sec-badge">VIEW 3</span>
                    {formData.secondary_image_3 ? (
                      <>
                        <img
                          src={formData.secondary_image_3}
                          alt="Secondary view 3"
                          className="add-product-sec-preview"
                        />
                        <div className="add-product-sec-overlay">
                          <button
                            type="button"
                            className="add-product-sec-remove"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveSecImage(3);
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="add-product-sec-placeholder">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        <span>Upload View 3</span>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={addSecFileRef3}
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => handleSecImageUpload(3, e)}
                    />
                  </div>
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

              {/* Field 3a: SHORT DESCRIPTION (UNDER PRODUCT TITLE) */}
              <div className="add-product-form-group">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <label className="add-product-label" style={{ marginBottom: 0 }}>
                    SHORT DESCRIPTION
                  </label>
                  <span style={{ fontSize: "11px", color: "#8a8a9e" }}>
                    Shown directly underneath product title
                  </span>
                </div>
                <textarea
                  rows={2}
                  placeholder="Enter concise 1-2 sentence overview for the product header"
                  className="add-product-textarea"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              {/* Field 3b: LONG DESCRIPTION (PRODUCT OVERVIEW & SPECIFICATIONS) */}
              <div className="add-product-form-group">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <label className="add-product-label" style={{ marginBottom: 0 }}>
                    LONG DESCRIPTION
                  </label>
                  <span style={{ fontSize: "11px", color: "#8a8a9e" }}>
                    Overview &amp; specs (separate paragraphs with blank lines)
                  </span>
                </div>
                <textarea
                  rows={5}
                  placeholder="Enter comprehensive paragraphs detailing engineering, materials, private label branding, and Sialkot manufacturing QA..."
                  className="add-product-textarea"
                  style={{ minHeight: "110px", lineHeight: "1.5" }}
                  value={formData.long_description}
                  onChange={(e) =>
                    setFormData({ ...formData, long_description: e.target.value })
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
                    onChange={(e) => handleCategoryChange(e.target.value)}
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

              {/* Field 5: SUBCATEGORY (LINKED TO SELECTED CATEGORY) */}
              <div className="add-product-form-group">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <label className="add-product-label" style={{ marginBottom: 0 }}>
                    SUBCATEGORY
                  </label>
                  <span style={{ fontSize: "11px", color: "#727284" }}>
                    Linked to {formData.category || "category"}
                  </span>
                </div>
                <div className="add-product-select-wrapper">
                  <select
                    className="add-product-select"
                    value={formData.subcategory}
                    onChange={(e) =>
                      setFormData({ ...formData, subcategory: e.target.value })
                    }
                  >
                    <option value="">Select subcategory (Optional)</option>
                    {subcategories
                      .filter(
                        (s) =>
                          s.category.toLowerCase() ===
                          (formData.category || "").toLowerCase()
                      )
                      .map((sub) => (
                        <option key={sub.id || sub.name} value={sub.name}>
                          {sub.name}
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

      {/* ================= MODAL: EDIT PRODUCT ================= */}
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
                Update the details and subcategory for this product
              </p>
            </div>

            <form onSubmit={handleSaveEdit}>
              {/* Field 1: PRIMARY PRODUCT IMAGE */}
              <div className="add-product-form-group">
                <label className="add-product-label">PRIMARY SHOWCASE IMAGE</label>
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
                    <span>UPLOAD PRIMARY IMAGE</span>
                  </button>
                </div>
              </div>

              {/* Field 1b: 3 SECONDARY GALLERY IMAGES */}
              <div className="add-product-form-group">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <label className="add-product-label" style={{ marginBottom: 0 }}>
                    SECONDARY IMAGES (3 GALLERY VIEWS)
                  </label>
                  <span style={{ fontSize: "11px", color: "#8a8a9e" }}>
                    Thumbnails in product detail switcher
                  </span>
                </div>
                <div className="add-product-secondary-images-grid">
                  {/* Slot 1 */}
                  <div
                    className={`add-product-sec-card ${formData.secondary_image_1 ? "has-image" : ""}`}
                    onClick={() => editSecFileRef1.current?.click()}
                  >
                    <span className="add-product-sec-badge">VIEW 1</span>
                    {formData.secondary_image_1 ? (
                      <>
                        <img
                          src={formData.secondary_image_1}
                          alt="Secondary view 1"
                          className="add-product-sec-preview"
                        />
                        <div className="add-product-sec-overlay">
                          <button
                            type="button"
                            className="add-product-sec-remove"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveSecImage(1);
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="add-product-sec-placeholder">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        <span>Upload View 1</span>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={editSecFileRef1}
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => handleSecImageUpload(1, e)}
                    />
                  </div>

                  {/* Slot 2 */}
                  <div
                    className={`add-product-sec-card ${formData.secondary_image_2 ? "has-image" : ""}`}
                    onClick={() => editSecFileRef2.current?.click()}
                  >
                    <span className="add-product-sec-badge">VIEW 2</span>
                    {formData.secondary_image_2 ? (
                      <>
                        <img
                          src={formData.secondary_image_2}
                          alt="Secondary view 2"
                          className="add-product-sec-preview"
                        />
                        <div className="add-product-sec-overlay">
                          <button
                            type="button"
                            className="add-product-sec-remove"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveSecImage(2);
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="add-product-sec-placeholder">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        <span>Upload View 2</span>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={editSecFileRef2}
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => handleSecImageUpload(2, e)}
                    />
                  </div>

                  {/* Slot 3 */}
                  <div
                    className={`add-product-sec-card ${formData.secondary_image_3 ? "has-image" : ""}`}
                    onClick={() => editSecFileRef3.current?.click()}
                  >
                    <span className="add-product-sec-badge">VIEW 3</span>
                    {formData.secondary_image_3 ? (
                      <>
                        <img
                          src={formData.secondary_image_3}
                          alt="Secondary view 3"
                          className="add-product-sec-preview"
                        />
                        <div className="add-product-sec-overlay">
                          <button
                            type="button"
                            className="add-product-sec-remove"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveSecImage(3);
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="add-product-sec-placeholder">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        <span>Upload View 3</span>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={editSecFileRef3}
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => handleSecImageUpload(3, e)}
                    />
                  </div>
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

              {/* Field 3a: SHORT DESCRIPTION (UNDER PRODUCT TITLE) */}
              <div className="add-product-form-group">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <label className="add-product-label" style={{ marginBottom: 0 }}>
                    SHORT DESCRIPTION
                  </label>
                  <span style={{ fontSize: "11px", color: "#8a8a9e" }}>
                    Shown directly underneath product title
                  </span>
                </div>
                <textarea
                  rows={2}
                  placeholder="Enter concise 1-2 sentence overview for the product header"
                  className="add-product-textarea"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              {/* Field 3b: LONG DESCRIPTION (PRODUCT OVERVIEW & SPECIFICATIONS) */}
              <div className="add-product-form-group">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <label className="add-product-label" style={{ marginBottom: 0 }}>
                    LONG DESCRIPTION
                  </label>
                  <span style={{ fontSize: "11px", color: "#8a8a9e" }}>
                    Overview &amp; specs (separate paragraphs with blank lines)
                  </span>
                </div>
                <textarea
                  rows={5}
                  placeholder="Enter comprehensive paragraphs detailing engineering, materials, private label branding, and Sialkot manufacturing QA..."
                  className="add-product-textarea"
                  style={{ minHeight: "110px", lineHeight: "1.5" }}
                  value={formData.long_description}
                  onChange={(e) =>
                    setFormData({ ...formData, long_description: e.target.value })
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
                    onChange={(e) => handleCategoryChange(e.target.value)}
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

              {/* Field 5: SUBCATEGORY (LINKED TO SELECTED CATEGORY) */}
              <div className="add-product-form-group">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <label className="add-product-label" style={{ marginBottom: 0 }}>
                    SUBCATEGORY
                  </label>
                  <span style={{ fontSize: "11px", color: "#727284" }}>
                    Linked to {formData.category || "category"}
                  </span>
                </div>
                <div className="add-product-select-wrapper">
                  <select
                    className="add-product-select"
                    value={formData.subcategory}
                    onChange={(e) =>
                      setFormData({ ...formData, subcategory: e.target.value })
                    }
                  >
                    <option value="">Select subcategory (Optional)</option>
                    {subcategories
                      .filter(
                        (s) =>
                          s.category.toLowerCase() ===
                          (formData.category || "").toLowerCase()
                      )
                      .map((sub) => (
                        <option key={sub.id || sub.name} value={sub.name}>
                          {sub.name}
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
                style={{
                  padding: "12px 28px",
                  borderRadius: "12px",
                  ...(isSaving ? { opacity: 0.7, cursor: "not-allowed" } : {}),
                }}
                onClick={handleConfirmRemove}
                disabled={isSaving}
              >
                {isSaving ? "REMOVING..." : "CONFIRM REMOVE"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: MANAGE CATEGORIES & SUBCATEGORIES ================= */}
      {isManageCatsModalOpen && (
        <div
          className="admin-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCancelManageCats();
          }}
        >
          <div className="manage-cats-modal-box expanded">
            {/* Header */}
            <div className="manage-cats-header">
              <div>
                <h2 className="manage-cats-title">Manage Categories &amp; Subcategories</h2>
                <p className="manage-cats-subtitle">
                  Configure store categories and manage linked subcategories
                </p>
              </div>
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

            {/* Split layout: Categories on Left, Subcategories on Right */}
            <div className="manage-cats-layout">
              {/* LEFT COLUMN: Categories */}
              <div className="manage-cats-col">
                <label className="manage-cats-section-label">
                  CATEGORIES ({draftCategories.length})
                </label>
                <div className="manage-cats-add-row">
                  <input
                    type="text"
                    placeholder="New category..."
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
                    <span>+ ADD</span>
                  </button>
                </div>

                <div className="manage-cats-list">
                  {draftCategories.map((cat, idx) => {
                    const subsCount = draftSubcategories.filter(
                      (s) => s.category.toLowerCase() === cat.toLowerCase()
                    ).length;
                    const isActive = activeManageCategory.toLowerCase() === cat.toLowerCase();

                    return (
                      <div
                        key={`${cat}-${idx}`}
                        className={`manage-cats-item ${isActive ? "active" : ""}`}
                        onClick={() => setActiveManageCategory(cat)}
                        style={{ cursor: "pointer" }}
                      >
                        {editingCatIndex === idx ? (
                          <input
                            type="text"
                            autoFocus
                            className="manage-cats-inline-input"
                            value={editingCatValue}
                            onClick={(e) => e.stopPropagation()}
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
                          <div className="manage-cats-name-wrapper">
                            <span className="manage-cats-name">{cat}</span>
                            <span className="manage-cats-sub-badge">
                              {subsCount} {subsCount === 1 ? "sub" : "subs"}
                            </span>
                          </div>
                        )}

                        <div
                          className="manage-cats-actions"
                          onClick={(e) => e.stopPropagation()}
                        >
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
                              width="15"
                              height="15"
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
                          <button
                            type="button"
                            className="manage-cats-action-btn delete"
                            aria-label={`Delete ${cat}`}
                            onClick={() => handleDeleteCategory(idx)}
                          >
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.1"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT COLUMN: Subcategories of activeManageCategory */}
              <div className="manage-cats-col">
                <label className="manage-cats-section-label">
                  SUBCATEGORIES · {activeManageCategory.toUpperCase()}
                </label>
                <div className="manage-cats-add-row">
                  <input
                    type="text"
                    placeholder={`Add subcategory to ${activeManageCategory}...`}
                    className="manage-cats-input"
                    value={newSubcatInput}
                    onChange={(e) => setNewSubcatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSubcategory();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="manage-cats-btn-add"
                    onClick={handleAddSubcategory}
                  >
                    <span>+ ADD</span>
                  </button>
                </div>

                <div className="manage-cats-list">
                  {draftSubcategories.filter(
                    (s) =>
                      s.category.toLowerCase() ===
                      activeManageCategory.toLowerCase()
                  ).length === 0 ? (
                    <div className="manage-subcats-empty">
                      No subcategories for {activeManageCategory} yet.
                      <br />
                      Type a name above and click ADD.
                    </div>
                  ) : (
                    draftSubcategories
                      .filter(
                        (s) =>
                          s.category.toLowerCase() ===
                          activeManageCategory.toLowerCase()
                      )
                      .map((sub) => (
                        <div key={sub.id} className="manage-cats-item">
                          {editingSubcatId === sub.id ? (
                            <input
                              type="text"
                              autoFocus
                              className="manage-cats-inline-input"
                              value={editingSubcatValue}
                              onChange={(e) => setEditingSubcatValue(e.target.value)}
                              onBlur={() => handleSaveEditSubcategory(sub)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleSaveEditSubcategory(sub);
                                } else if (e.key === "Escape") {
                                  setEditingSubcatId(null);
                                }
                              }}
                            />
                          ) : (
                            <span className="manage-cats-name">{sub.name}</span>
                          )}

                          <div className="manage-cats-actions">
                            <button
                              type="button"
                              className="manage-cats-action-btn"
                              aria-label={`Edit ${sub.name}`}
                              onClick={() => {
                                if (editingSubcatId === sub.id) {
                                  handleSaveEditSubcategory(sub);
                                } else {
                                  handleStartEditSubcategory(sub);
                                }
                              }}
                            >
                              <svg
                                width="15"
                                height="15"
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
                            <button
                              type="button"
                              className="manage-cats-action-btn delete"
                              aria-label={`Delete ${sub.name}`}
                              onClick={() => handleDeleteSubcategory(sub)}
                            >
                              <svg
                                width="15"
                                height="15"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.1"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div
              className="manage-cats-footer"
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <button
                type="button"
                className="manage-cats-btn-cancel"
                onClick={handleCancelManageCats}
                disabled={isSaving}
                style={{ width: "auto", minWidth: "120px" }}
              >
                CANCEL
              </button>
              <button
                type="button"
                className="manage-cats-btn-save"
                onClick={handleSaveManageCats}
                disabled={isSaving}
                style={{
                  width: "auto",
                  minWidth: "160px",
                  ...(isSaving ? { opacity: 0.7, cursor: "not-allowed" } : {}),
                }}
              >
                {isSaving ? "SAVING CHANGES..." : "SAVE CHANGES"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
