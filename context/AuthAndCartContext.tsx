'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { auth, db, googleProvider, testConnection } from '@/lib/firebase';
import { handleFirestoreError, OperationType } from '@/lib/firestore-errors';
import { Product, CartItem, Order, UserProfile, OrderStatus } from '@/types/ecommerce';
import { PROMO_CODES } from '@/data/products';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AuthAndCartContextType {
  // Auth
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  userProfile: UserProfile | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  promoCode: string | null;
  promoError: string | null;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
  selectedDivision: string;
  setSelectedDivision: (div: string) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders
  orders: Order[];
  allAdminOrders: Order[];
  placeOrder: (orderPayload: {
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    city: string;
    paymentMethod: 'bKash' | 'Nagad' | 'Rocket' | 'COD';
    transactionId?: string;
    notes?: string;
  }) => Promise<string>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  recentOrder: Order | null;
  setRecentOrder: (order: Order | null) => void;

  // Modals & Drawers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAccountOpen: boolean;
  setIsAccountOpen: (open: boolean) => void;
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Language & Translation
  lang: 'en' | 'bn';
  toggleLang: () => void;
  t: (en: string, bn: string) => string;

  // Toast
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const AuthAndCartContext = createContext<AuthAndCartContextType | undefined>(undefined);

const ADMIN_EMAIL = 'connect.nasimul@gmail.com';

export function AuthAndCartProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem('vegina_cart');
        if (savedCart) return JSON.parse(savedCart);
      } catch {
        // ignore
      }
    }
    return [];
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedWishlist = localStorage.getItem('vegina_wishlist');
        if (savedWishlist) return JSON.parse(savedWishlist);
      } catch {
        // ignore
      }
    }
    return [];
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [allAdminOrders, setAllAdminOrders] = useState<Order[]>([]);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [selectedDivision, setSelectedDivision] = useState<string>('Dhaka (ঢাকা)');

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [recentOrder, setRecentOrder] = useState<Order | null>(null);

  // Language & Toast
  const [lang, setLang] = useState<'bn' | 'en'>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedLang = localStorage.getItem('vegina_lang');
        if (savedLang === 'en' || savedLang === 'bn') return savedLang;
      } catch {
        // ignore
      }
    }
    return 'bn';
  });
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'en' ? 'bn' : 'en'));
  }, []);

  const t = useCallback(
    (en: string, bn: string) => {
      return lang === 'bn' ? bn : en;
    },
    [lang]
  );

  // Initialize test connection on client boot
  useEffect(() => {
    testConnection();
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vegina_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Save wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vegina_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  // Save language to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vegina_lang', lang);
    } catch {
      // ignore
    }
  }, [lang]);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        // Fetch or create user profile
        const userPath = `users/${currentUser.uid}`;
        try {
          const profileDocRef = doc(db, 'users', currentUser.uid);
          const profileData: UserProfile = {
            uid: currentUser.uid,
            email: currentUser.email || '',
            displayName: currentUser.displayName || 'Customer',
            photoURL: currentUser.photoURL || '',
            role: currentUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'customer',
            createdAt: new Date().toISOString(),
          };
          setUserProfile(profileData);
          await setDoc(profileDocRef, profileData, { merge: true });
        } catch (error) {
          console.warn('Could not sync user profile to Firestore:', error);
        }

        // Attach user orders listener
        const ordersPath = 'orders';
        try {
          const ordersQuery = query(
            collection(db, ordersPath),
            where('userId', '==', currentUser.uid)
          );

          const unsubOrders = onSnapshot(
            ordersQuery,
            (snapshot) => {
              const loadedOrders: Order[] = [];
              snapshot.forEach((docSnap) => {
                loadedOrders.push({ id: docSnap.id, ...docSnap.data() } as Order);
              });
              // Sort descending by creation date
              loadedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
              setOrders(loadedOrders);
            },
            (error) => {
              handleFirestoreError(error, OperationType.GET, ordersPath);
            }
          );

          // Wishlist listener from Firestore
          const wishlistPath = 'wishlists';
          const wishlistQuery = query(
            collection(db, wishlistPath),
            where('userId', '==', currentUser.uid)
          );
          const unsubWishlist = onSnapshot(
            wishlistQuery,
            (snapshot) => {
              const ids: string[] = [];
              snapshot.forEach((docSnap) => {
                const data = docSnap.data();
                if (data.productId) ids.push(data.productId);
              });
              if (ids.length > 0) {
                setWishlist((prev) => Array.from(new Set([...prev, ...ids])));
              }
            },
            (error) => {
              console.warn('Wishlist sync warning:', error);
            }
          );

          return () => {
            unsubOrders();
            unsubWishlist();
          };
        } catch (error) {
          console.warn('Error setting up user queries:', error);
        }
      } else {
        setUserProfile(null);
        setOrders([]);
        setAllAdminOrders([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = useMemo(() => {
    if (!user) return false;
    return user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  }, [user]);

  // Admin orders listener
  useEffect(() => {
    if (!isAdmin || !user) return;
    const ordersPath = 'orders';
    try {
      const unsub = onSnapshot(
        collection(db, ordersPath),
        (snapshot) => {
          const allOrders: Order[] = [];
          snapshot.forEach((docSnap) => {
            allOrders.push({ id: docSnap.id, ...docSnap.data() } as Order);
          });
          allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setAllAdminOrders(allOrders);
        },
        (error) => {
          console.error('Admin orders listener error:', error);
        }
      );
      return () => unsub();
    } catch (err) {
      console.warn('Admin subscription error:', err);
    }
  }, [isAdmin, user]);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      showToast(lang === 'bn' ? 'গুগল দিয়ে সফলভাবে সাইন ইন হয়েছে!' : 'Signed in with Google successfully!', 'success');
    } catch (err: unknown) {
      console.error('Sign in error:', err);
      showToast(lang === 'bn' ? 'সাইন ইন করা সম্ভব হয়নি। আবার চেষ্টা করুন।' : 'Failed to sign in. Please try again.', 'error');
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      showToast(lang === 'bn' ? 'লগআউট সফল হয়েছে।' : 'Signed out successfully.', 'info');
    } catch (err: unknown) {
      console.error('Sign out error:', err);
    }
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(
      lang === 'bn'
        ? `${product.nameBn} কার্টে যোগ হয়েছে`
        : `Added ${product.name} to cart`,
      'success'
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast(lang === 'bn' ? 'পণ্যটি কার্ট থেকে সরানো হয়েছে' : 'Item removed from cart', 'info');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setPromoCode(null);
    setPromoError(null);
  };

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  // Delivery fee calculation
  const deliveryFee = useMemo(() => {
    if (subtotal === 0) return 0;
    if (subtotal >= 1500) return 0; // Free delivery over ৳1500!
    return selectedDivision.includes('Dhaka') ? 60 : 120;
  }, [subtotal, selectedDivision]);

  // Discount calculation
  const discount = useMemo(() => {
    if (!promoCode || !PROMO_CODES[promoCode]) return 0;
    const rule = PROMO_CODES[promoCode];
    if (rule.discountFixed) {
      return Math.min(rule.discountFixed, subtotal);
    }
    if (rule.discountPercent) {
      return Math.round((subtotal * rule.discountPercent) / 100);
    }
    return 0;
  }, [subtotal, promoCode]);

  const total = useMemo(() => {
    return Math.max(0, subtotal + deliveryFee - discount);
  }, [subtotal, deliveryFee, discount]);

  const applyPromo = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    if (PROMO_CODES[cleanCode]) {
      setPromoCode(cleanCode);
      setPromoError(null);
      showToast(
        lang === 'bn'
          ? `প্রোমো কোড '${cleanCode}' সফলভাবে প্রয়োগ হয়েছে!`
          : `Promo code '${cleanCode}' applied successfully!`,
        'success'
      );
      return true;
    } else {
      setPromoError(lang === 'bn' ? 'ভুল প্রোমো কোড। অনুগ্রহ করে সঠিক কোড দিন।' : 'Invalid promo code. Please check and try again.');
      return false;
    }
  };

  const removePromo = () => {
    setPromoCode(null);
    setPromoError(null);
  };

  // Wishlist operations
  const toggleWishlist = async (productId: string) => {
    const isPresent = wishlist.includes(productId);
    const newWishlist = isPresent
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId];
    setWishlist(newWishlist);

    showToast(
      isPresent
        ? lang === 'bn' ? 'উইশলিস্ট থেকে সরানো হয়েছে' : 'Removed from wishlist'
        : lang === 'bn' ? 'উইশলিস্টে যুক্ত করা হয়েছে' : 'Added to wishlist',
      'info'
    );

    // Sync to Firestore if user is logged in
    if (user) {
      const wishlistDocId = `${user.uid}_${productId}`;
      const path = `wishlists/${wishlistDocId}`;
      try {
        if (isPresent) {
          await deleteDoc(doc(db, 'wishlists', wishlistDocId));
        } else {
          await setDoc(doc(db, 'wishlists', wishlistDocId), {
            id: wishlistDocId,
            userId: user.uid,
            productId,
            createdAt: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.warn('Wishlist Firestore sync failed:', err);
      }
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Place Order
  const placeOrder = async (payload: {
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    city: string;
    paymentMethod: 'bKash' | 'Nagad' | 'Rocket' | 'COD';
    transactionId?: string;
    notes?: string;
  }): Promise<string> => {
    if (cart.length === 0) {
      throw new Error('Your cart is empty.');
    }

    const orderId = `VGN-BD-${Date.now().toString().slice(-6)}`;
    const effectiveUserId = user ? user.uid : `guest-${Date.now()}`;

    const orderData: Order = {
      id: orderId,
      userId: effectiveUserId,
      customerName: payload.customerName,
      customerEmail: user?.email || 'guest@vegina.com.bd',
      customerPhone: payload.customerPhone,
      deliveryAddress: payload.deliveryAddress,
      division: selectedDivision,
      city: payload.city || 'Dhaka',
      paymentMethod: payload.paymentMethod,
      paymentStatus: payload.paymentMethod === 'COD' ? 'Pending' : 'Paid',
      transactionId: payload.transactionId || (payload.paymentMethod === 'COD' ? 'COD-PAY' : `TRX-${Date.now()}`),
      items: cart.map((c) => ({
        productId: c.product.id,
        name: c.product.name,
        nameBn: c.product.nameBn,
        price: c.product.price,
        quantity: c.quantity,
        unit: c.product.unit,
        image: c.product.image,
      })),
      subtotal,
      deliveryFee,
      discount,
      total,
      status: 'Processing',
      notes: payload.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save order to Firestore if signed in
    if (user) {
      const path = `orders/${orderId}`;
      try {
        await setDoc(doc(db, 'orders', orderId), orderData);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, path);
      }
    } else {
      // Local fallback for guest order
      setOrders((prev) => [orderData, ...prev]);
    }

    // ── Google Sheets sync (fire-and-forget) ──────────────────────────
    try {
      const sheetsPayload = {
        orderId: orderData.id,
        createdAt: orderData.createdAt,
        // Customer Information
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        customerEmail: orderData.customerEmail,
        // Delivery Address
        division: orderData.division,
        city: orderData.city,
        deliveryAddress: orderData.deliveryAddress,
        // Payment
        paymentMethod: orderData.paymentMethod,
        paymentStatus: orderData.paymentStatus,
        transactionId: orderData.transactionId,
        // Order Summary
        items: orderData.items
          .map((i) => `${i.nameBn || i.name} x${i.quantity} (৳${i.price})`)
          .join(', '),
        subtotal: orderData.subtotal,
        deliveryFee: orderData.deliveryFee,
        discount: orderData.discount,
        total: orderData.total,
        status: orderData.status,
        notes: orderData.notes,
      };

      const sendToSheetsDirect = () => {
        const directUrl =
          process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL ||
          'https://script.google.com/macros/s/AKfycbyCB9GMx151wodvqD9qS2b-FEN6AgECTtvhXEVPsIyGxkut0c21yLd03t6YE0HI7mnmwQ/exec';
        fetch(directUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(sheetsPayload),
        }).catch((directErr) => console.warn('[Sheets] Direct sync failed:', directErr));
      };

      fetch('/api/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sheetsPayload),
      })
        .then((res) => {
          if (!res.ok) {
            sendToSheetsDirect();
          }
        })
        .catch(() => {
          sendToSheetsDirect();
        });
    } catch (err) {
      console.warn('[Sheets] Payload build error (non-critical):', err);
    }
    // ─────────────────────────────────────────────────────────────────

    setRecentOrder(orderData);
    clearCart();
    setIsCheckoutOpen(false);
    return orderId;
  };

  // Admin order status update
  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const path = `orders/${orderId}`;
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status,
        updatedAt: new Date().toISOString(),
      });
      showToast(
        lang === 'bn' ? `অর্ডারের স্ট্যাটাস পরিবর্তিত হয়েছে: ${status}` : `Order status updated to: ${status}`,
        'success'
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  return (
    <AuthAndCartContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        userProfile,
        signInWithGoogle,
        signOut,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        deliveryFee,
        discount,
        total,
        promoCode,
        promoError,
        applyPromo,
        removePromo,
        selectedDivision,
        setSelectedDivision,
        wishlist,
        toggleWishlist,
        isInWishlist,
        orders,
        allAdminOrders,
        placeOrder,
        updateOrderStatus,
        recentOrder,
        setRecentOrder,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAccountOpen,
        setIsAccountOpen,
        isAdminModalOpen,
        setIsAdminModalOpen,
        quickViewProduct,
        setQuickViewProduct,
        lang,
        toggleLang,
        t,
        toasts,
        showToast,
      }}
    >
      {children}
    </AuthAndCartContext.Provider>
  );
}

export function useAuthAndCart() {
  const context = useContext(AuthAndCartContext);
  if (!context) {
    throw new Error('useAuthAndCart must be used within an AuthAndCartProvider');
  }
  return context;
}
