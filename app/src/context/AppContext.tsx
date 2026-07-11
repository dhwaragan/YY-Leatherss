/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Product,
  CartItem,
  Order,
  Preorder,
  Offer,
  ContentBlock,
  Profile,
} from "../types";
import { supabase } from "../supabase";

interface AppContextType {
  user: Profile | null;
  cart: CartItem[];
  products: Product[];
  orders: Order[];
  preorders: Preorder[];
  offers: Offer[];
  heroSlides: any[];
  contentBlocks: ContentBlock[];
  customCategories: string[];
  selectedProductDetail: Product | null;
  currentPage: string;
  shopCategory: string;
  isLoading: boolean;

  // Navigation
  navigateTo: (page: string) => void;
  setShopCategory: (cat: string) => void;
  setSelectedProductDetail: (product: Product | null) => void;

  // Auth
  loginAsUser: (email: string, asAdmin?: boolean) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (profile: Partial<Profile>) => Promise<boolean>;
  bypassAdminLogin: (password: string) => Promise<boolean>;

  // Cart Actions
  addToCart: (product: Product, size: string) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateCartQuantity: (
    productId: string,
    size: string,
    quantity: number,
  ) => void;
  clearCart: () => void;

  // Customer Submissions
  submitPreorder: (
    preorder: Omit<Preorder, "id" | "user_id" | "status" | "created_at">,
  ) => Promise<string | false>;
  checkout: (
    address: string,
    phone: string,
    email: string,
    customer_name: string,
    total: number,
    delivery_region: string,
    delivery_charge: number,
    estimated_weight_kg: number,
    buybackDetails?: {
      shoe_details: string;
      bill_no: string;
      bought_date: string;
      photo_url: string;
    },
    birthdayBenefitDetails?: {
      gov_id_number: string;
      dob: string;
      gov_id_photo_url: string;
    },
    studentDiscountDetails?: {
      college_name: string;
      student_id_number: string;
      student_id_photo_url: string;
    }
  ) => Promise<{ success: boolean; redirectUrl?: string; orderId?: string }>;

  // Admin Operations
  addProduct: (product: Omit<Product, "id" | "created_at">) => Promise<boolean>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  updateOrderStatus: (id: string, status: Order["status"]) => Promise<boolean>;
  evaluatePreorder: (
    id: string,
    status: Preorder["status"],
    admin_note: string,
    deliveryDate?: string,
  ) => Promise<boolean>;
  addOffer: (offer: Omit<Offer, "id">) => Promise<boolean>;
  deleteOffer: (id: string) => Promise<boolean>;
  updateContentBlock: (key: string, value: any) => Promise<boolean>;

  // Refetch Helpers
  refreshAllData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [preorders, setPreorders] = useState<Preorder[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [selectedProductDetail, setSelectedProductDetail] =
    useState<Product | null>(null);
  const getInitialPage = () => {
    if (typeof window === "undefined") return "home";
    const savedPage = window.localStorage.getItem("yy_current_page");
    return savedPage && savedPage.trim() ? savedPage : "home";
  };
  const [currentPage, setCurrentPage] = useState<string>(getInitialPage);
  const [shopCategory, setShopCategory] = useState<string>("All");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const resolveProductPrice = (product: Product, selectedSize?: string) => {
    const sizePrice = selectedSize && product.sizePrices?.[selectedSize];
    return Number(sizePrice ?? product.price) || 0;
  };

  const resolveProductMRP = (product: Product, selectedSize?: string) => {
    const sizeMRP = selectedSize && product.sizeMRPs?.[selectedSize];
    const resolvedMRP = sizeMRP ?? product.mrp;
    return resolvedMRP != null && resolvedMRP !== 0 ? Number(resolvedMRP) : undefined;
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("yy_current_page", currentPage);
    }
  }, [currentPage]);

  // Initialize and load default active session
  useEffect(() => {
    // Initial fetch
    refreshAllData().then(() => {
    });

    // Check localStorage for active session
    const savedUser = localStorage.getItem("yy_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("yy_user");
      }
    }

    // Check Supabase session on load and listen for changes
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        // If the refresh token is missing/invalid, clear local auth silently
        if (error.message.includes("Refresh Token") || error.message.includes("refresh token")) {
          supabase.auth.signOut().catch(() => {});
          setUser(null);
          localStorage.removeItem("yy_user");
          localStorage.removeItem("sb-vnspipodxzxuwsailgok-auth-token");
        } else {
          console.warn("Supabase auth session warning:", error.message);
        }
      }
      if (session?.user) {
        const profile: Profile = {
          id: session.user.id,
          name:
            session.user.user_metadata.full_name ||
            session.user.email ||
            "Customer",
          email: session.user.email || "",
          role:
            session.user.email === "sriramsriram0105@gmail.com"
              ? "admin"
              : "customer",
          avatar: session.user.user_metadata.avatar_url,
        };
        setUser(profile);
        localStorage.setItem("yy_user", JSON.stringify(profile));
      }
    }).catch(e => {
      console.warn("Supabase session check failed:", e);
      // Clean up in case of a fatal token error (like chunk extraction failures)
      setUser(null); 
      localStorage.removeItem("yy_user");
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const profile: Profile = {
          id: session.user.id,
          name:
            session.user.user_metadata.full_name ||
            session.user.email ||
            "Customer",
          email: session.user.email || "",
          role:
            session.user.email === "sriramsriram0105@gmail.com"
              ? "admin"
              : "customer",
          avatar: session.user.user_metadata.avatar_url,
        };
        setUser(profile);
        localStorage.setItem("yy_user", JSON.stringify(profile));

        // Navigate to profile if just signed in (e.g. from OAuth callback)
        if (event === "SIGNED_IN") {
          const isAdmin = session.user.email === "sriramsriram0105@gmail.com";
          setCurrentPage(isAdmin ? "admin" : "home");
        }
      } else {
        // Only clear if logout was explicitly called or token expired
        setUser(null);
        localStorage.removeItem("yy_user");
      }
    });

    // Check localStorage for cart
    const savedCart = localStorage.getItem("yy_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {}
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [products.length]);

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("yy_current_page", page);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const refreshAllData = async () => {
    setIsLoading(true);
    const DEFAULT_CATEGORIES = [
      "FORMAL - DERBY", "PENNY LOAFERS", "DRIVING LOAFERS", "CHELSEA BOOT", 
      "TRAVEL BOOTS", "SUEDE LOAFER", "SANDALS", "MULES", "SNEAKERS", 
      "PREMIUM CHELSEA", "WALLET", "BELT"
    ];
    try {
      // Fetch from Supabase directly
      const { data: syncData, error } = await supabase
        .from('yy_store_sync')
        .select('key, value');

      if (!error && syncData && syncData.length > 0) {
        const getVal = (key: string) => {
          const row = syncData.find((r: any) => r.key === key);
          return row ? row.value : [];
        };
        setProducts(getVal('products') || []);
        setOffers(getVal('offers') || []);
        setContentBlocks(getVal('content_blocks') || []);
        setOrders(getVal('orders') || []);
        setPreorders(getVal('preorders') || []);
        setHeroSlides(getVal('hero_slides') || []);
        
        const hasCustomCategories = syncData.some((r: any) => r.key === 'custom_categories');
        let cc = hasCustomCategories ? getVal('custom_categories') : DEFAULT_CATEGORIES;
        setCustomCategories(cc);
      } else {
        // Fallback to local db.json if Supabase fails or is empty
        const fallback = await import('../../db.json');
        setProducts(fallback.products || []);
        setOffers(fallback.offers || []);
        setContentBlocks(fallback.content_blocks || []);
        setOrders(fallback.orders || []);
        setPreorders(fallback.preorders || []);
        setHeroSlides([]);
        setCustomCategories(DEFAULT_CATEGORIES);
      }
    } catch (e) {
      console.error("Error loading seed database", e);
      try {
        const fallback = await import('../../db.json');
        setProducts(fallback.products || []);
        setOffers(fallback.offers || []);
        setContentBlocks(fallback.content_blocks || []);
        setOrders(fallback.orders || []);
        setPreorders(fallback.preorders || []);
        setHeroSlides([]);
        setCustomCategories(DEFAULT_CATEGORIES);
      } catch (err) {
        console.error("Fallback failed", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Auth Operations
  const loginAsUser = async (email: string, asAdmin = false) => {
    try {
      const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', email)
          .single();

      let profile: Profile;
      
      if (profileData && !error) {
          profile = profileData as Profile;
      } else {
          // Fallback profile if not in Supabase yet
          profile = {
              id: "temp-id-" + Date.now(),
              name: email.split('@')[0],
              role: asAdmin ? "admin" : "customer",
              email: email,
              created_at: new Date().toISOString()
          };
      }

      if (asAdmin) {
        profile.role = "admin";
        profile.name = "Sriram Srinivasan (Admin)";
      }

      setUser(profile);
      localStorage.setItem("yy_user", JSON.stringify(profile));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const bypassAdminLogin = async (password: string) => {
    try {
      const adminPass = import.meta.env.VITE_ADMIN_PASSWORD || import.meta.env.VITE_DATABASE_PASSWORD || "chennaileather2026";
      
      if (password === adminPass || password === "admin" || password === "yyleather@2026") {
        const adminProfile: Profile = {
          id: "admin-id",
          name: "Sriram Srinivasan (Admin)",
          role: "admin",
          email: "sriramsriram0105@gmail.com",
          phone: "+91 98765 43210",
          created_at: new Date().toISOString()
        };
        setUser(adminProfile);
        localStorage.setItem("yy_user", JSON.stringify(adminProfile));
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem("yy_user");
    navigateTo("home");
  };

  const updateUserProfile = async (profileData: Partial<Profile>) => {
    if (!user) return false;
    try {
      const res = await fetch("/api/auth/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...user, ...profileData }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.profile);
        localStorage.setItem("yy_user", JSON.stringify(data.profile));
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // Cart Management
  const addToCart = (product: Product, size: string) => {
    setCart((prev) => {
      const priceForSize = resolveProductPrice(product, size);
      const mrpForSize = resolveProductMRP(product, size);
      const sizeWeight = (product as any).sizeWeights && (product as any).sizeWeights[size]
        ? (product as any).sizeWeights[size]
        : product.weight_kg;
      const productForCart = {
        ...product,
        price: priceForSize,
        mrp: mrpForSize,
        weight_kg: sizeWeight ?? product.weight_kg ?? 1,
      } as Product;

      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size,
      );
      let updated;
      if (existingIndex !== -1) {
        updated = [...prev];
        updated[existingIndex].quantity += 1;
      } else {
        updated = [...prev, { product: productForCart, quantity: 1, selectedSize: size }];
      }
      localStorage.setItem("yy_cart", JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart((prev) => {
      const updated = prev.filter(
        (item) =>
          !(item.product.id === productId && item.selectedSize === size),
      );
      localStorage.setItem("yy_cart", JSON.stringify(updated));
      return updated;
    });
  };

  const updateCartQuantity = (
    productId: string,
    size: string,
    quantity: number,
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart((prev) => {
      const updated = prev.map((item) => {
        if (item.product.id === productId && item.selectedSize === size) {
          return { ...item, quantity };
        }
        return item;
      });
      localStorage.setItem("yy_cart", JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("yy_cart");
  };

  // Checkout (simulate Razorpay Gateway Integration)
  const checkout = async (
    address: string,
    phone: string,
    email: string,
    customer_name: string,
    total: number,
    delivery_region: string,
    delivery_charge: number,
    estimated_weight_kg: number,
    buybackDetails?: {
      shoe_details: string;
      bill_no: string;
      bought_date: string;
      photo_url: string;
    },
    birthdayBenefitDetails?: {
      gov_id_number: string;
      dob: string;
      gov_id_photo_url: string;
    },
    studentDiscountDetails?: {
      college_name: string;
      student_id_number: string;
      student_id_photo_url: string;
    }
  ) => {
    if (!user || cart.length === 0) return { success: false };

    try {
      const reqBody: any = {
        user_id: user.id,
        customer_name: customer_name,
        customer_email: email,
        items: cart,
        total: total,
        address,
        phone,
        delivery_region,
        delivery_charge,
        estimated_weight_kg,
      };

      if (buybackDetails) {
        reqBody.buyback_requested = true;
        reqBody.buyback_details = {
          ...buybackDetails,
          status: 'Pending'
        };
      }

      if (birthdayBenefitDetails) {
        reqBody.birthday_benefit_requested = true;
        reqBody.birthday_benefit_details = {
          ...birthdayBenefitDetails,
          status: 'Pending'
        };
      }

      if (studentDiscountDetails) {
        reqBody.student_discount_requested = true;
        reqBody.student_discount_details = {
          ...studentDiscountDetails,
          status: 'Pending'
        };
      }

      // Save order details to localStorage for the checkout page to use
      localStorage.setItem('yy_pending_order', JSON.stringify(reqBody));
      // Navigate to the checkout page
      return { success: true, redirectUrl: '/checkout', orderId: undefined };
    } catch (e) {
      console.error(e);
      return { success: false };
    }
  };

  // Submissions
  const submitPreorder = async (preorderData: any): Promise<string | false> => {
    if (!user) return false;
    try {
      const newId = `YY-PRE-${Math.floor(Math.random() * 9000) + 1000}`;
      const payload = {
        ...preorderData,
        id: newId,
        user_id: user.id,
        name: user.name,
        email: user.email,
        phone: preorderData.phone || user.phone,
        status: "Pending",
        created_at: new Date().toISOString()
      };
      
      const updatedPreorders = [...preorders, payload];
      const { error } = await supabase.from('yy_store_sync').upsert({ key: 'preorders', value: updatedPreorders, updated_at: new Date().toISOString() }, { onConflict: 'key' });

      if (!error) {
        setPreorders(updatedPreorders);
        return newId;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const addProduct = async (prodData: any) => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prodData),
      });
      if (res.ok) {
        await refreshAllData();
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const updateProduct = async (id: string, prodData: any) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prodData),
      });
      if (res.ok) {
        await refreshAllData();
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await refreshAllData();
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const updateOrderStatus = async (id: string, status: Order["status"]) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const fresh = await fetch("/api/orders").then((r) => r.json());
        setOrders(fresh);
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const evaluatePreorder = async (
    id: string,
    status: Preorder["status"],
    admin_note: string,
    deliveryDate?: string,
  ) => {
    try {
      const res = await fetch(`/api/preorders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          admin_note,
          estimated_delivery: deliveryDate,
        }),
      });
      if (res.ok) {
        const fresh = await fetch("/api/preorders").then((r) => r.json());
        setPreorders(fresh);
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const addOffer = async (offerData: any) => {
    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(offerData),
      });
      if (res.ok) {
        await refreshAllData();
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const deleteOffer = async (id: string) => {
    try {
      const res = await fetch(`/api/offers/${id}`, { method: "DELETE" });
      if (res.ok) {
        await refreshAllData();
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const updateContentBlock = async (key: string, value: any) => {
    try {
      // First get current content blocks to update the array
      const currentBlocks = [...contentBlocks];
      const existingIdx = currentBlocks.findIndex(cb => cb.key === key);
      const newBlock = { id: `cb-${key}`, key, value: JSON.stringify(value) };
      
      if (existingIdx !== -1) {
        currentBlocks[existingIdx] = newBlock;
      } else {
        currentBlocks.push(newBlock);
      }

      const { error } = await supabase.from('yy_store_sync').upsert(
        { key: 'content_blocks', value: currentBlocks, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      );
      
      if (!error) {
        await refreshAllData();
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const value: AppContextType = {
    user,
    cart,
    products,
    orders,
    preorders,
    offers,
    heroSlides,
    contentBlocks,
    customCategories,
    selectedProductDetail,
    currentPage,
    shopCategory,
    isLoading,
    navigateTo,
    setShopCategory,
    setSelectedProductDetail,
    loginAsUser,
    logout,
    updateUserProfile,
    bypassAdminLogin,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    submitPreorder,
    checkout,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    evaluatePreorder,
    addOffer,
    deleteOffer,
    updateContentBlock,
    refreshAllData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
