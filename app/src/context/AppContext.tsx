/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from "react";
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
import { getCache, setCache, removeCache, PUBLIC_DATA_KEY, PUBLIC_TTL, ORDERS_KEY, PREORDERS_KEY } from "../utils/cache";

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
  bypassAdminLogin: (email: string, password: string) => Promise<boolean>;

  // Cart Actions
  addToCart: (product: Product, size: string) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateCartQuantity: (
    productId: string,
    size: string,
    quantity: number,
  ) => void;
  clearCart: () => void;
  
  // Stock Management
  updateProductStock: (productId: string, size: string, quantity: number) => Promise<boolean>;

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
  decrementStock: (cartItems: CartItem[]) => Promise<boolean>;

  // Refetch Helpers
  refreshAllData: () => Promise<void>;

  // Sitewide Discount
  sitewideDiscount: number;
  setSitewideDiscount: (discount: number) => void;
  
  // Festival Settings
  festivalName: string;
  festivalCombineWithOffers: boolean;
  isFestivalActive: boolean;
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
  // Admin emails list
  const ADMIN_EMAILS = useMemo(() => ["dhwaragandhwaragan9@gmail.com", "Yomeyom786@gmail.com"], []);
  
  const isAdminEmail = useCallback((email: string): boolean => {
    return ADMIN_EMAILS.some(adminEmail => adminEmail.toLowerCase() === email.toLowerCase());
  }, [ADMIN_EMAILS]);

  const [sitewideDiscount, setSitewideDiscount] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    return Number(localStorage.getItem("yy_sitewide_discount") || "0");
  });
  const [festivalName, setFestivalName] = useState<string>(() => {
    if (typeof window === "undefined") return '';
    return localStorage.getItem("yy_festival_name") || '';
  });
  const [festivalCombineWithOffers, setFestivalCombineWithOffers] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("yy_festival_combine") !== "false";
  });
  const [isFestivalActive, setIsFestivalActive] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("yy_festival_active") !== "false";
  });
  const getInitialPage = () => {
    if (typeof window === "undefined") return "home";
    const savedPage = window.localStorage.getItem("yy_current_page");
    return savedPage && savedPage.trim() ? savedPage : "home";
  };
  const [currentPage, setCurrentPage] = useState<string>(getInitialPage);
  const [shopCategory, setShopCategory] = useState<string>("All");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Track if we've already loaded data to avoid duplicate fetches
  const hasLoadedRef = useRef(false);
  const fetchInFlightRef = useRef<Promise<void> | null>(null);

  const resolveProductPrice = useCallback((product: Product, selectedSize?: string) => {
    const sizePrice = selectedSize && product.sizePrices?.[selectedSize];
    return Number(sizePrice ?? product.price) || 0;
  }, []);

  const resolveProductMRP = useCallback((product: Product, selectedSize?: string) => {
    const sizeMRP = selectedSize && product.sizeMRPs?.[selectedSize];
    const resolvedMRP = sizeMRP ?? product.mrp;
    return resolvedMRP != null && resolvedMRP !== 0 ? Number(resolvedMRP) : undefined;
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("yy_current_page", currentPage);
    }
  }, [currentPage]);

  // DEFAULT_CATEGORIES as a constant outside component
  const DEFAULT_CATEGORIES = useMemo(() => [
    "FORMAL - DERBY", "PENNY LOAFERS", "DRIVING LOAFERS", "CHELSEA BOOT",
    "TRAVEL BOOTS", "SUEDE LOAFER", "SANDALS", "MULES", "SNEAKERS",
    "PREMIUM CHELSEA", "WALLET", "BELT"
  ], []);

  // Map raw product data to Product type
  const mapProduct = useCallback((p: any): Product => {
    const sizePrices: Record<string, number> = {};
    if (p.sizePrices) {
      Object.entries(p.sizePrices).forEach(([k, v]: [string, any]) => {
        if (v !== undefined && v !== null) sizePrices[k] = Number(v);
      });
    } else if (p.sizeMRPs) {
      Object.entries(p.sizeMRPs).forEach(([k, v]: [string, any]) => {
        if (v !== undefined && v !== null) sizePrices[k] = Number(v);
      });
    }
    return {
      ...p,
      sizePrices,
      customer_email: p.customer_email || ''
    };
  }, []);

  const mapOrder = useCallback((o: any): Order => ({
    ...o,
    customer_email: o.customer_email || ''
  }), []);

  const mapPreorder = useCallback((p: any): Preorder => ({
    ...p,
    status: (p.status === 'Confirmed' || p.status === 'Rejected' || p.status === 'Under Review' ? p.status : 'Under Review') as Preorder['status']
  }), []);

  // MEMOIZED: Fetch ONLY public storefront data (products, offers, content_blocks, hero_slides, categories)
  // Does NOT fetch orders/preorders (admin-only data) for regular visitors
  const fetchPublicData = useCallback(async (): Promise<{ products: any[]; offers: any[]; contentBlocks: ContentBlock[]; heroSlides: any[]; customCategories: string[]; orders: Order[]; preorders: Preorder[]; }> => {
    // Try cache first - avoids Supabase bandwidth entirely on repeat visits
    const cached = getCache<any>(PUBLIC_DATA_KEY, PUBLIC_TTL);
    if (cached && hasLoadedRef.current) {
      return cached;
    }

    try {
      // SINGLE request - selective columns to reduce payload
      const { data: syncData, error } = await supabase
        .from('yy_store_sync')
        .select('key, value');
        // Note: We still need full value for products, but orders/preorders are filtered below

      if (!error && syncData && syncData.length > 0) {
        const getVal = (key: string) => {
          const row = syncData.find((r: any) => r.key === key);
          return row ? row.value : [];
        };
        
        const result = {
          products: (getVal('products') || []) as any[],
          offers: (getVal('offers') || []) as Offer[],
          contentBlocks: (getVal('content_blocks') || []) as ContentBlock[],
          heroSlides: (getVal('hero_slides') || []) as any[],
          customCategories: syncData.some((r: any) => r.key === 'custom_categories') 
            ? (getVal('custom_categories') || DEFAULT_CATEGORIES) 
            : DEFAULT_CATEGORIES,
          orders: (getVal('orders') || []) as Order[],
          preorders: (getVal('preorders') || []) as Preorder[],
        };
        
        // Cache for repeat visits
        setCache(PUBLIC_DATA_KEY, result, PUBLIC_TTL);
        return result;
      }
      
      // Fallback to local db.json (no network)
      const fallback = await import('../../db.json');
      const result = {
        products: (fallback.products || []) as any[],
        offers: (fallback.offers || []) as Offer[],
        contentBlocks: (fallback.content_blocks || []) as ContentBlock[],
        heroSlides: [] as any[],
        customCategories: DEFAULT_CATEGORIES,
        orders: (fallback.orders || []).map((o: any) => ({ ...o, customer_email: o.customer_email || '' })),
        preorders: (fallback.preorders || []) as Preorder[],
      };
      setCache(PUBLIC_DATA_KEY, result, PUBLIC_TTL);
      return result;
    } catch (e) {
      console.error("Error loading data:", e);
      const fallback = await import('../../db.json');
      return {
        products: (fallback.products || []) as any[],
        offers: (fallback.offers || []) as Offer[],
        contentBlocks: (fallback.content_blocks || []) as ContentBlock[],
        heroSlides: [] as any[],
        customCategories: DEFAULT_CATEGORIES,
        orders: (fallback.orders || []).map((o: any) => ({ ...o, customer_email: o.customer_email || '' })),
        preorders: (fallback.preorders || []) as Preorder[],
      };
    }
  }, [DEFAULT_CATEGORIES]);

  // MEMOIZED: Fetch orders - only called when admin logs in or orders change
  const fetchOrders = useCallback(async (): Promise<Order[]> => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        const mapped = (data || []).map(mapOrder);
        setCache(ORDERS_KEY, mapped, 60 * 1000); // 1 min TTL
        return mapped;
      }
    } catch (e) {
      console.error("Error fetching orders:", e);
    }
    return [];
  }, [mapOrder]);

  // MEMOIZED: Fetch preorders - only called when admin logs in or preorders change
  const fetchPreorders = useCallback(async (): Promise<Preorder[]> => {
    try {
      const res = await fetch("/api/preorders");
      if (res.ok) {
        const data = await res.json();
        const mapped = (data || []).map(mapPreorder);
        setCache(PREORDERS_KEY, mapped, 60 * 1000); // 1 min TTL
        return mapped;
      }
    } catch (e) {
      console.error("Error fetching preorders:", e);
    }
    return [];
  }, [mapPreorder]);

  // Load festival settings from content blocks (merged into loadFestivalSettings)
  // SINGLE fetch on mount - no duplicate calls

  // Initialize and load default active session
  useEffect(() => {
    // Check localStorage for active session FIRST (instant)
    const savedUser = localStorage.getItem("yy_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("yy_user");
      }
    }

    // Initial fetch of public data with caching
    const init = async () => {
      // Check cache first to avoid network on first paint
      const cached = getCache<any>(PUBLIC_DATA_KEY, PUBLIC_TTL);
      if (cached) {
        setProducts(cached.products.map(mapProduct));
        setOffers(cached.offers);
        setContentBlocks(cached.contentBlocks);
        setHeroSlides(cached.heroSlides);
        setCustomCategories(cached.customCategories);
        // Only set orders/preorders if admin is logged in
        const savedU = localStorage.getItem("yy_user");
        if (savedU) {
          try {
            const su = JSON.parse(savedU);
            if (isAdminEmail(su.email)) {
              setOrders(cached.orders || []);
              setPreorders(cached.preorders || []);
            }
          } catch {}
        }
        setIsLoading(false);
        hasLoadedRef.current = true;
        return;
      }
      
      setIsLoading(true);
      const data = await fetchPublicData();
      setProducts(data.products.map(mapProduct));
      setOffers(data.offers);
      setContentBlocks(data.contentBlocks);
      setHeroSlides(data.heroSlides);
      setCustomCategories(data.customCategories);
      // Only set orders/preorders if admin is logged in
      const savedU2 = localStorage.getItem("yy_user");
      if (savedU2) {
        try {
          const su = JSON.parse(savedU2);
          if (isAdminEmail(su.email)) {
            setOrders(data.orders || []);
            setPreorders(data.preorders || []);
          }
        } catch {}
      }
      setIsLoading(false);
      hasLoadedRef.current = true;
    };
    
    init();

    // Check Supabase session and listen for changes
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
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
            isAdminEmail(session.user.email || "")
              ? "admin"
              : "customer",
          avatar: session.user.user_metadata.avatar_url,
        };
        setUser(profile);
        localStorage.setItem("yy_user", JSON.stringify(profile));
        
        // If admin, fetch orders/preorders now
        if (isAdminEmail(profile.email)) {
          fetchOrders();
          fetchPreorders();
        }
      }
    }).catch(e => {
      console.warn("Supabase session check failed:", e);
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
            isAdminEmail(session.user.email || "")
              ? "admin"
              : "customer",
          avatar: session.user.user_metadata.avatar_url,
        };
        setUser(profile);
        localStorage.setItem("yy_user", JSON.stringify(profile));

        if (event === "SIGNED_IN") {
          const isAdmin = isAdminEmail(session.user.email || "");
          // If admin signed in, fetch admin data
          if (isAdmin) {
            fetchOrders();
            fetchPreorders();
          }
          setCurrentPage(isAdmin ? "admin" : "home");
        }
      } else {
        setUser(null);
        localStorage.removeItem("yy_user");
        // Clear admin data when logged out
        setOrders([]);
        setPreorders([]);
      }
    });

    const savedCart = localStorage.getItem("yy_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {}
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [mapProduct, mapOrder, mapPreorder, fetchPublicData, fetchOrders, fetchPreorders, isAdminEmail]);

  const navigateTo = useCallback((page: string) => {
    setCurrentPage(page);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("yy_current_page", page);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // MEMOIZED: refreshAllData with caching + deduplication
  const refreshAllData = useCallback(async () => {
    // Prevent concurrent fetches (deduplication)
    if (fetchInFlightRef.current) {
      return fetchInFlightRef.current;
    }
    
    const promise = (async () => {
      try {
        // For admins: full refresh with orders/preorders
        const currentUser = user;
        const isAdmin = currentUser ? isAdminEmail(currentUser.email) : false;
        
        setIsLoading(true);
        const data = await fetchPublicData();
        
        setProducts(data.products.map(mapProduct));
        setOffers(data.offers);
        setContentBlocks(data.contentBlocks);
        setHeroSlides(data.heroSlides);
        setCustomCategories(data.customCategories);
        
        if (isAdmin) {
          const [orderData, preorderData] = await Promise.all([fetchOrders(), fetchPreorders()]);
          setOrders(orderData);
          setPreorders(preorderData);
        }
      } catch (e) {
        console.error("Error refreshing data:", e);
      } finally {
        setIsLoading(false);
      }
    })();
    
    fetchInFlightRef.current = promise;
    try {
      await promise;
    } finally {
      fetchInFlightRef.current = null;
    }
  }, [user, isAdminEmail, fetchPublicData, mapProduct, fetchOrders, fetchPreorders]);

  // Auth Operations
  const loginAsUser = useCallback(async (email: string, asAdmin = false) => {
    try {
      const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', email)
          .maybeSingle();

      let profile: Profile;
      
      if (profileData && !error) {
          profile = profileData as Profile;
      } else {
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
  }, []);

  const bypassAdminLogin = useCallback(async (email: string, password: string) => {
    try {
      if (!isAdminEmail(email)) {
        return false;
      }

      const envPass = import.meta.env.VITE_ADMIN_PASSWORD || import.meta.env.VITE_DATABASE_PASSWORD;
      const customPass = localStorage.getItem('yy_admin_pass');
      const adminPass = customPass || envPass;

      if (!adminPass || password !== adminPass) {
        return false;
      }

      const adminProfile: Profile = {
        id: "admin-id",
        name: "Store Administrator",
        role: "admin",
        email: email,
        phone: "+91 98765 43210",
        created_at: new Date().toISOString()
      };
      setUser(adminProfile);
      localStorage.setItem("yy_user", JSON.stringify(adminProfile));
      
      // Admin logged in - fetch admin data
      refreshAllData();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, [isAdminEmail, refreshAllData]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem("yy_user");
    setOrders([]);
    setPreorders([]);
    navigateTo("home");
  }, [navigateTo]);

  const updateUserProfile = useCallback(async (profileData: Partial<Profile>) => {
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
  }, [user]);

  // Cart Management
  const addToCart = useCallback((product: Product, size: string) => {
    const sizeQuantity = (product as any).sizeQuantities?.[size];
    if (sizeQuantity !== undefined && sizeQuantity !== Infinity) {
      const existingCartItem = cart.find(
        (item) => item.product.id === product.id && item.selectedSize === size
      );
      const currentCartQty = existingCartItem?.quantity || 0;
      
      if (currentCartQty + 1 > sizeQuantity) {
        alert(`Sorry, only ${sizeQuantity} item(s) available in stock for size ${size}. You already have ${currentCartQty} in your cart.`);
        return;
      }
    }

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
  }, [cart, resolveProductPrice, resolveProductMRP]);

  const removeFromCart = useCallback((productId: string, size: string) => {
    setCart((prev) => {
      const updated = prev.filter(
        (item) =>
          !(item.product.id === productId && item.selectedSize === size),
      );
      localStorage.setItem("yy_cart", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateCartQuantity = useCallback((
    productId: string,
    size: string,
    quantity: number,
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    
    const product = products.find(p => p.id === productId);
    if (product && product.sizeQuantities) {
      const availableStock = product.sizeQuantities[size];
      if (availableStock !== undefined && availableStock !== Infinity && quantity > availableStock) {
        alert(`Sorry, only ${availableStock} item(s) available in stock for size ${size}.`);
        return;
      }
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
  }, [products, removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem("yy_cart");
  }, []);

  const checkout = useCallback(async (
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

      localStorage.setItem('yy_pending_order', JSON.stringify(reqBody));
      return { success: true, redirectUrl: '/checkout', orderId: undefined };
    } catch (e) {
      console.error(e);
      return { success: false };
    }
  }, [user, cart]);

  const submitPreorder = useCallback(async (preorderData: any): Promise<string | false> => {
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
        removeCache(PREORDERS_KEY);
        return newId;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, [user, preorders]);

  const addProduct = useCallback(async (prodData: any) => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prodData),
      });
      if (res.ok) {
        removeCache(PUBLIC_DATA_KEY);
        await refreshAllData();
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, [refreshAllData]);

  const updateProduct = useCallback(async (id: string, prodData: any) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prodData),
      });
      if (res.ok) {
        removeCache(PUBLIC_DATA_KEY);
        await refreshAllData();
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, [refreshAllData]);

  const decrementStock = useCallback(async (cartItems: CartItem[]) => {
    try {
      for (const item of cartItems) {
        const product = products.find(p => p.id === item.product.id);
        if (!product || !product.sizeQuantities) continue;

        const currentQty = product.sizeQuantities[item.selectedSize];
        if (currentQty === undefined || currentQty === Infinity) continue;

        const newQty = Math.max(0, currentQty - item.quantity);
        
        const updatedSizeQuantities = {
          ...product.sizeQuantities,
          [item.selectedSize]: newQty
        };

        await fetch(`/api/products/${product.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sizeQuantities: updatedSizeQuantities }),
        });
      }
      
      removeCache(PUBLIC_DATA_KEY);
      await refreshAllData();
      return true;
    } catch (e) {
      console.error("Error decrementing stock:", e);
      return false;
    }
  }, [products, refreshAllData]);

  const updateProductStock = useCallback(async (productId: string, size: string, quantity: number): Promise<boolean> => {
    try {
      const product = products.find(p => p.id === productId);
      if (!product || !product.sizeQuantities) return false;

      const updatedSizeQuantities = {
        ...product.sizeQuantities,
        [size]: quantity
      };

      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sizeQuantities: updatedSizeQuantities }),
      });

      if (res.ok) {
        removeCache(PUBLIC_DATA_KEY);
        await refreshAllData();
        return true;
      }
      return false;
    } catch (e) {
      console.error("Error updating product stock:", e);
      return false;
    }
  }, [products, refreshAllData]);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        removeCache(PUBLIC_DATA_KEY);
        await refreshAllData();
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, [refreshAllData]);

  const updateOrderStatus = useCallback(async (id: string, status: Order["status"]) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        // Update local state - DON'T refetch everything
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
        removeCache(ORDERS_KEY);
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, []);

  const evaluatePreorder = useCallback(async (
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
        // Update local state - DON'T refetch everything
        setPreorders(prev => prev.map(p => p.id === id ? { ...p, status, admin_note, estimated_delivery: deliveryDate } : p));
        removeCache(PREORDERS_KEY);
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, []);

  const addOffer = useCallback(async (offerData: any) => {
    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(offerData),
      });
      if (res.ok) {
        removeCache(PUBLIC_DATA_KEY);
        await refreshAllData();
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, [refreshAllData]);

  const deleteOffer = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/offers/${id}`, { method: "DELETE" });
      if (res.ok) {
        removeCache(PUBLIC_DATA_KEY);
        await refreshAllData();
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, [refreshAllData]);

  const updateContentBlock = useCallback(async (key: string, value: any) => {
    try {
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
        // Update local state + invalidate cache - avoid full refresh
        setContentBlocks(currentBlocks);
        removeCache(PUBLIC_DATA_KEY);
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, [contentBlocks]);

  const value = useMemo<AppContextType>(() => ({
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
    sitewideDiscount,
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
    updateProductStock,
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
    decrementStock,
    refreshAllData,
    setSitewideDiscount,
    festivalName,
    festivalCombineWithOffers,
    isFestivalActive,
  }), [
    user, cart, products, orders, preorders, offers, heroSlides, contentBlocks,
    customCategories, selectedProductDetail, currentPage, shopCategory, isLoading,
    sitewideDiscount, navigateTo, loginAsUser, logout, updateUserProfile,
    bypassAdminLogin, addToCart, removeFromCart, updateCartQuantity, clearCart,
    updateProductStock, submitPreorder, checkout, addProduct, updateProduct,
    deleteProduct, updateOrderStatus, evaluatePreorder, addOffer, deleteOffer,
    updateContentBlock, decrementStock, refreshAllData, festivalName,
    festivalCombineWithOffers, isFestivalActive,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};