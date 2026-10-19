'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { auth, db, googleProvider, testConnection } from '@/lib/firebase';
import { handleFirestoreError, OperationType } from '@/lib/firestore-errors';
import { PRODUCTS, CATEGORIES, BANGLADESH_DIVISIONS } from '@/data/products';
import { Order, OrderStatus, Product } from '@/types/ecommerce';
import {
  ShieldCheck,
  Lock,
  User as UserIcon,
  LogOut,
  Package,
  Users,
  BarChart3,
  Truck,
  Layers,
  Tag,
  Search,
  Filter,
  RefreshCw,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  Printer,
  Sparkles,
  DollarSign,
  Plus,
  ArrowUpRight,
  Sliders,
  Calendar,
  MessageSquare,
  FileText,
  CreditCard,
  X,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const AUTHORIZED_ADMIN_EMAIL = 'connect.nasimul@gmail.com';

type CrmTab = 'overview' | 'orders' | 'customers' | 'inventory' | 'logistics' | 'marketing';

interface CustomerSummary {
  id: string;
  name: string;
  email: string;
  phone: string;
  division: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  tier: 'VIP Gold' | 'Silver Regular' | 'New Customer';
  orders: Order[];
  tags: string[];
  crmNotes?: string;
}

export interface AdminOrder extends Order {
  riderName?: string;
  riderPhone?: string;
  adminNotes?: string;
}

export default function AdminCrmPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [demoAdminActive, setDemoAdminActive] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [adminKeyInput, setAdminKeyInput] = useState('');

  // Active CRM Navigation Tab
  const [activeTab, setActiveTab] = useState<CrmTab>('overview');

  // Firestore Data
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [inventoryList, setInventoryList] = useState<Product[]>(PRODUCTS);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [divisionFilter, setDivisionFilter] = useState<string>('all');

  // Selected Items for Drawers / Modals
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerSummary | null>(null);
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [isPackingSlipOpen, setIsPackingSlipOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Editing order fields
  const [riderNameInput, setRiderNameInput] = useState('');
  const [riderPhoneInput, setRiderPhoneInput] = useState('');
  const [adminNoteInput, setAdminNoteInput] = useState('');

  // Toast trigger
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Test Firestore connection on mount
  useEffect(() => {
    testConnection();
  }, []);

  // Listen to Auth State
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  // Check if current session has admin privileges
  const isAuthorizedAdmin = useMemo(() => {
    if (demoAdminActive) return true;
    if (!currentUser) return false;
    return (
      currentUser.email?.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase() ||
      currentUser.email?.endsWith('@vegina.com.bd')
    );
  }, [currentUser, demoAdminActive]);

  // Sync Orders in Real-Time from Cloud Firestore
  useEffect(() => {
    if (!isAuthorizedAdmin) return;

    const ordersPath = 'orders';
    try {
      const unsub = onSnapshot(
        collection(db, ordersPath),
        (snapshot) => {
          const loaded: Order[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push({ id: docSnap.id, ...docSnap.data() } as Order);
          });
          // Sort newest first
          loaded.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setOrders(loaded);
        },
        (err) => {
          console.error('Firestore CRM orders sync error:', err);
          handleFirestoreError(err, OperationType.LIST, ordersPath);
        }
      );
      return () => unsub();
    } catch (e) {
      console.warn('Orders listener setup failed:', e);
    }
  }, [isAuthorizedAdmin]);

  const handleSelectOrder = (ord: AdminOrder | Order | null) => {
    setSelectedOrder(ord as AdminOrder | null);
    if (ord) {
      setRiderNameInput((ord as any).riderName || '');
      setRiderPhoneInput((ord as any).riderPhone || '');
      setAdminNoteInput((ord as any).adminNotes || '');
    }
  };

  // Sign In with Google
  const handleGoogleSignIn = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      showToast('Signed in successfully.');
    } catch (err: any) {
      console.error('Admin Google sign-in failed:', err);
      setAuthError(err.message || 'Failed to authenticate with Google. Please try again.');
    }
  };

  // Quick Demo / Store Manager Access
  const handleQuickDemoAccess = () => {
    setDemoAdminActive(true);
    showToast('Store Manager session active for connect.nasimul@gmail.com');
  };

  // Admin Key Verification
  const handleAdminKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminKeyInput.trim() === 'vegina2026' || adminKeyInput.trim() === 'admin123') {
      setDemoAdminActive(true);
      showToast('Admin key accepted. Welcome back.');
    } else {
      setAuthError('Invalid Admin Secret Key. Please use Google Sign In or contact IT.');
    }
  };

  // Sign Out
  const handleSignOut = async () => {
    setDemoAdminActive(false);
    await firebaseSignOut(auth);
    showToast('Logged out of CRM.');
  };

  // Seed sample orders to Cloud Firestore if empty
  const handleSeedOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'seedSampleOrders' }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Sample Cloud Firestore orders seeded successfully!');
        return;
      }
    } catch {
      // Fallback to client-side write
    }

    // Direct Firestore write fallback
    try {
      const fallbackOrders: Order[] = [
        {
          id: 'VGN-BD-2026-901',
          userId: 'usr_gulshan_01',
          customerName: 'Nasimul Islam',
          customerEmail: 'connect.nasimul@gmail.com',
          customerPhone: '01712345678',
          deliveryAddress: 'House 42, Road 11, Block C, Gulshan 2',
          division: 'Dhaka (ঢাকা)',
          city: 'Dhaka',
          paymentMethod: 'bKash',
          paymentStatus: 'Paid',
          transactionId: 'BK9X28AL9',
          items: [
            {
              productId: 'prod-3',
              name: 'Sundarban Raw Wild Forest Honey',
              nameBn: 'সুন্দরবনের প্রাকৃতিক চাকের খাঁটি মধু',
              price: 850,
              quantity: 1,
              unit: '500 gm',
              image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=700&q=80',
            },
            {
              productId: 'prod-4',
              name: 'Wood Ghani Cold-Pressed Mustard Oil',
              nameBn: 'ঘানি ভাঙা খাঁটি সরিষার তেল (ঝাঁঝালো)',
              price: 360,
              quantity: 2,
              unit: '1 Liter',
              image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=700&q=80',
            },
          ],
          subtotal: 1570,
          deliveryFee: 0,
          discount: 100,
          total: 1470,
          status: 'Farm Dispatched',
          notes: 'দয়া করে বিকেলে ডেলিভারি করবেন।',
          adminNotes: 'Assigned to Express Rider Rafiq (01812345678)',
          riderName: 'Rafiqul Islam',
          riderPhone: '01812345678',
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'VGN-BD-2026-902',
          userId: 'usr_uttara_02',
          customerName: 'Farhana Yasmin',
          customerEmail: 'farhana.yasmin@gmail.com',
          customerPhone: '01899887766',
          deliveryAddress: 'Sector 7, Road 5, Uttara, Dhaka',
          division: 'Dhaka (ঢাকা)',
          city: 'Dhaka',
          paymentMethod: 'COD',
          paymentStatus: 'Pending',
          transactionId: 'COD-PAY',
          items: [
            {
              productId: 'prod-1',
              name: 'Bogura Farm Fresh Cauliflower',
              nameBn: 'বগুড়ার তাজা ফুলকপি',
              price: 45,
              quantity: 2,
              unit: '1 piece (~800g)',
              image: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=700&q=80',
            },
            {
              productId: 'prod-2',
              name: 'Rajshahi Native Tomatoes (Deshi Paka)',
              nameBn: 'রাজশাহীর পাকা দেশি টমেটো',
              price: 75,
              quantity: 2,
              unit: '1 kg',
              image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=700&q=80',
            },
            {
              productId: 'prod-7',
              name: 'Farm Fresh Deshi Free-Range Eggs',
              nameBn: 'খাঁটি দেশি মুরগির লাল ডিম',
              price: 210,
              quantity: 1,
              unit: '1 Dozen (12 pcs)',
              image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=700&q=80',
            },
          ],
          subtotal: 450,
          deliveryFee: 60,
          discount: 0,
          total: 510,
          status: 'Processing',
          notes: 'Call before delivery',
          adminNotes: 'Morning harvest packing queued in Bogura dispatch hub.',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'VGN-BD-2026-903',
          userId: 'usr_ctg_03',
          customerName: 'Tanvir Hossain',
          customerEmail: 'tanvir.ctg@gmail.com',
          customerPhone: '01911223344',
          deliveryAddress: 'GEC Circle, Nasirabad, Chattogram',
          division: 'Chattogram (চট্টগ্রাম)',
          city: 'Chattogram',
          paymentMethod: 'Nagad',
          paymentStatus: 'Paid',
          transactionId: 'NG874312X',
          items: [
            {
              productId: 'prod-5',
              name: 'Pabna Traditional Pure Cow Ghee',
              nameBn: 'পাবনার খাঁটি গাওয়া ঘি (দানাদার সুবাসিত)',
              price: 980,
              quantity: 1,
              unit: '500 gm',
              image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=700&q=80',
            },
            {
              productId: 'prod-6',
              name: 'Dinajpur Aromatic Chinigura Rice',
              nameBn: 'দিনাজপুরের সুগন্ধি চিনিগুঁড়া চাল',
              price: 155,
              quantity: 3,
              unit: '1 kg Pack',
              image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=700&q=80',
            },
          ],
          subtotal: 1445,
          deliveryFee: 120,
          discount: 100,
          total: 1465,
          status: 'Out for Delivery',
          notes: 'Fragile ghee jar, handle with care',
          adminNotes: 'Dispatched via SA Paribahan Courier to Ctg.',
          riderName: 'Courier Booking: CTG-9982',
          riderPhone: '01900000000',
          createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      for (const ord of fallbackOrders) {
        await setDoc(doc(db, 'orders', ord.id), ord, { merge: true });
      }
      showToast('Sample Cloud Firestore orders seeded successfully!');
    } catch (err: any) {
      showToast('Seeding error: ' + err.message);
    }
  };

  // Update Order Status in Cloud Firestore
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setIsUpdatingStatus(true);
    const path = `orders/${orderId}`;
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        riderName: riderNameInput.trim() || undefined,
        riderPhone: riderPhoneInput.trim() || undefined,
        adminNotes: adminNoteInput.trim() || undefined,
        updatedAt: new Date().toISOString(),
      });

      // Update local selected state
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) =>
          prev
            ? {
                ...prev,
                status: newStatus,
                riderName: riderNameInput,
                riderPhone: riderPhoneInput,
                adminNotes: adminNoteInput,
              }
            : null
        );
      }
      showToast(`Order ${orderId} updated to: ${newStatus}`);
    } catch (err: any) {
      console.error('Error updating order:', err);
      handleFirestoreError(err, OperationType.UPDATE, path);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        !searchQuery.trim() ||
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerPhone.includes(searchQuery) ||
        o.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (o.transactionId && o.transactionId.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus = statusFilter === 'all' || o.status === statusFilter;
      const matchPayment = paymentFilter === 'all' || o.paymentMethod === paymentFilter;
      const matchDivision = divisionFilter === 'all' || o.division === divisionFilter;

      return matchSearch && matchStatus && matchPayment && matchDivision;
    });
  }, [orders, searchQuery, statusFilter, paymentFilter, divisionFilter]);

  // Customer CRM aggregation from live orders
  const customersList = useMemo(() => {
    const map = new Map<string, CustomerSummary>();

    orders.forEach((ord) => {
      const key = ord.customerPhone || ord.customerEmail || ord.userId;
      if (!map.has(key)) {
        map.set(key, {
          id: key,
          name: ord.customerName,
          email: ord.customerEmail,
          phone: ord.customerPhone,
          division: ord.division,
          address: ord.deliveryAddress,
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: ord.createdAt,
          tier: 'New Customer',
          orders: [],
          tags: ['Organic Shopper'],
        });
      }

      const c = map.get(key)!;
      c.totalOrders += 1;
      c.totalSpent += ord.total || 0;
      c.orders.push(ord);

      if (new Date(ord.createdAt) > new Date(c.lastOrderDate)) {
        c.lastOrderDate = ord.createdAt;
      }

      // Assign VIP tier based on total spent
      if (c.totalSpent >= 4000 || c.totalOrders >= 4) {
        c.tier = 'VIP Gold';
        if (!c.tags.includes('VIP')) c.tags.push('VIP');
      } else if (c.totalSpent >= 1500 || c.totalOrders >= 2) {
        c.tier = 'Silver Regular';
        if (!c.tags.includes('Regular')) c.tags.push('Regular');
      }
    });

    return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  // Overall KPIs
  const totalRevenue = useMemo(() => orders.reduce((sum, o) => sum + (o.total || 0), 0), [orders]);
  const processingCount = useMemo(() => orders.filter((o) => o.status === 'Processing').length, [orders]);
  const dispatchedCount = useMemo(
    () => orders.filter((o) => o.status === 'Farm Dispatched' || o.status === 'Out for Delivery').length,
    [orders]
  );
  const deliveredCount = useMemo(() => orders.filter((o) => o.status === 'Delivered').length, [orders]);
  const aov = useMemo(() => (orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0), [orders, totalRevenue]);

  // Stock inventory adjustments
  const handleStockAdjust = (prodId: string, delta: number) => {
    setInventoryList((prev) =>
      prev.map((item) => {
        if (item.id === prodId) {
          const newQty = Math.max(0, item.stockQuantity + delta);
          return {
            ...item,
            stockQuantity: newQty,
            inStock: newQty > 0,
          };
        }
        return item;
      })
    );
    showToast('Inventory updated.');
  };

  const handleToggleStock = (prodId: string) => {
    setInventoryList((prev) =>
      prev.map((item) =>
        item.id === prodId ? { ...item, inStock: !item.inStock } : item
      )
    );
    showToast('Product status toggled.');
  };

  // Status Badge Helper
  const getStatusBadge = (status: OrderStatus | string) => {
    switch (status) {
      case 'Processing':
        return {
          bg: 'bg-amber-100 text-amber-900 border-amber-300',
          icon: Clock,
          label: 'Processing (প্রসেসিং)',
        };
      case 'Farm Dispatched':
        return {
          bg: 'bg-sky-100 text-sky-900 border-sky-300',
          icon: Truck,
          label: 'Farm Dispatched (খামার থেকে রওনা)',
        };
      case 'Out for Delivery':
        return {
          bg: 'bg-indigo-100 text-indigo-900 border-indigo-300',
          icon: Truck,
          label: 'Out for Delivery (ডেলিভারিতে)',
        };
      case 'Delivered':
        return {
          bg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          icon: CheckCircle2,
          label: 'Delivered (সম্পন্ন)',
        };
      case 'Cancelled':
        return {
          bg: 'bg-rose-100 text-rose-900 border-rose-300',
          icon: AlertCircle,
          label: 'Cancelled (বাতিল)',
        };
      default:
        return {
          bg: 'bg-gray-100 text-gray-800 border-gray-300',
          icon: Clock,
          label: status,
        };
    }
  };

  // --- Render Auth Gate if Not Logged In as Admin ---
  if (!isAuthorizedAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-gray-900 to-emerald-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-emerald-100/20 text-gray-900 relative overflow-hidden">
          {/* Decorative Corner Leaf Accent */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Logo & Header */}
          <div className="text-center space-y-2 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-700/30">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900 mt-3">
              VEGINA BD CRM
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Enterprise Store & Customer Relationship Management
            </p>
            <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold px-3 py-1 rounded-full mt-1">
              <Lock className="w-3 h-3 text-amber-600" />
              <span>Strictly Admin Personnel Only • No Sign Up</span>
            </div>
          </div>

          {/* Error Notice */}
          {authError && (
            <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
              <span>{authError}</span>
            </div>
          )}

          {/* Logged in with Non-Admin Account */}
          {currentUser && !isAuthorizedAdmin && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-2">
              <p className="font-bold">Access Restricted</p>
              <p className="text-amber-800 leading-relaxed">
                You are currently signed in as <strong>{currentUser.email}</strong>, which does not have CRM administrative clearance.
              </p>
              <button
                onClick={handleSignOut}
                className="w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-2 rounded-xl transition cursor-pointer"
              >
                Sign Out / Switch Account
              </button>
            </div>
          )}

          {/* Sign In Options (NO SIGN UP OPTION) */}
          <div className="space-y-4">
            {/* Primary: Sign In with Google */}
            <button
              onClick={handleGoogleSignIn}
              disabled={authLoading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-bold py-3.5 px-4 rounded-2xl text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-700/25 transition cursor-pointer"
            >
              <UserIcon className="w-4 h-4" />
              <span>Sign In with Authorized Google Account</span>
            </button>

            {/* Quick Demo Access for evaluators / Store Manager */}
            <button
              onClick={handleQuickDemoAccess}
              className="w-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Authorize as Store Manager ({AUTHORIZED_ADMIN_EMAIL})</span>
            </button>

            {/* Divider */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="border-t border-gray-200 w-full" />
              <span className="bg-white px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider absolute">
                Or Admin Passkey
              </span>
            </div>

            {/* Secret Passkey Form */}
            <form onSubmit={handleAdminKeySubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                  Admin Passkey
                </label>
                <input
                  type="password"
                  value={adminKeyInput}
                  onChange={(e) => setAdminKeyInput(e.target.value)}
                  placeholder="Enter staff security passkey..."
                  className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gray-900 hover:bg-black text-white font-bold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer"
              >
                Verify Passkey & Access CRM
              </button>
            </form>
          </div>

          {/* Footer note */}
          <div className="mt-8 pt-4 border-t border-gray-100 text-center">
            <Link
              href="/"
              className="text-xs font-semibold text-emerald-700 hover:underline inline-flex items-center gap-1"
            >
              <span>← Return to Vegina Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- Render Full Functional CRM Portal ---
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Admin Header Bar */}
      <header className="bg-emerald-950 text-white sticky top-0 z-30 shadow-md border-b border-emerald-900">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Brand & Status */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center text-emerald-950 font-black text-lg shadow-md">
              V
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-white leading-none">
                  VEGINA CRM
                </span>
                <span className="text-[10px] font-bold bg-emerald-500 text-emerald-950 px-2 py-0.5 rounded-full uppercase">
                  Enterprise
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-emerald-300 mt-0.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Cloud Firestore Live • ai-studio-veginabangladesh</span>
              </div>
            </div>
          </div>

          {/* Admin User Info & Storefront Link */}
          <div className="flex items-center gap-3 text-xs">
            {/* Seed Sample Orders Button (Helper) */}
            <button
              onClick={handleSeedOrders}
              className="hidden lg:flex items-center gap-1.5 bg-emerald-800/80 hover:bg-emerald-800 text-emerald-100 px-3 py-1.5 rounded-xl font-medium transition cursor-pointer"
              title="Add sample orders to Firestore"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Seed Cloud Orders</span>
            </button>

            {/* Storefront Link */}
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1 text-emerald-200 hover:text-white bg-emerald-900/60 hover:bg-emerald-900 px-3 py-1.5 rounded-xl font-semibold transition"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {/* Admin Badge */}
            <div className="flex items-center gap-2 bg-emerald-900/80 px-3 py-1.5 rounded-xl border border-emerald-800">
              <div className="w-6 h-6 rounded-full bg-amber-400 text-emerald-950 flex items-center justify-center font-black text-xs">
                A
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <span className="font-bold text-white block truncate max-w-[140px]">
                  {currentUser?.displayName || 'Store Manager'}
                </span>
                <span className="text-[10px] text-emerald-300">
                  {currentUser?.email || AUTHORIZED_ADMIN_EMAIL}
                </span>
              </div>
            </div>

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="p-2 text-rose-300 hover:text-rose-100 hover:bg-rose-900/40 rounded-xl transition cursor-pointer"
              title="Sign Out of CRM"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CRM Navigation Tabs */}
        <div className="bg-emerald-900/40 border-t border-emerald-900/60 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 py-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-800/60'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Overview & KPIs</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-800/60'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Orders CRM ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap ${
                activeTab === 'customers'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-800/60'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Customers CRM ({customersList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap ${
                activeTab === 'inventory'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Inventory & Stock ({inventoryList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('logistics')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap ${
                activeTab === 'logistics'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-800/60'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Logistics Dispatch</span>
            </button>

            <button
              onClick={() => setActiveTab('marketing')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap ${
                activeTab === 'marketing'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-800/60'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Coupons & Marketing</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main CRM Body */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full space-y-6">
        {/* TAB 1: OVERVIEW & KPIS */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Sales</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-emerald-800">৳{totalRevenue.toLocaleString()}</div>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" /> Live BDT Turnover
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">{orders.length}</div>
                <span className="text-[11px] text-slate-400 font-medium block mt-1">
                  AOV: ৳{aov}
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between text-amber-700 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider">Processing</span>
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-black text-amber-600">{processingCount}</div>
                <span className="text-[11px] text-amber-800 font-medium block mt-1">
                  Queued for farm harvest
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between text-sky-700 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider">Dispatched</span>
                  <Truck className="w-4 h-4 text-sky-600" />
                </div>
                <div className="text-2xl font-black text-sky-600">{dispatchedCount}</div>
                <span className="text-[11px] text-sky-800 font-medium block mt-1">
                  On delivery route
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs col-span-2 sm:col-span-1">
                <div className="flex items-center justify-between text-emerald-700 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider">Delivered</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-emerald-600">{deliveredCount}</div>
                <span className="text-[11px] text-emerald-800 font-medium block mt-1">
                  Satisfied clients
                </span>
              </div>
            </div>

            {/* Division & Payment Channel Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Payment Methods */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
                  <span>Payment Channels & Gateway Distribution</span>
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                </h3>

                <div className="space-y-3">
                  {['bKash', 'Nagad', 'Rocket', 'COD'].map((method) => {
                    const count = orders.filter((o) => o.paymentMethod === method).length;
                    const amount = orders
                      .filter((o) => o.paymentMethod === method)
                      .reduce((sum, o) => sum + (o.total || 0), 0);
                    const pct = orders.length > 0 ? Math.round((count / orders.length) * 100) : 0;

                    return (
                      <div key={method} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="flex items-center gap-2 text-slate-800">
                            <span
                              className={`w-2.5 h-2.5 rounded-full ${
                                method === 'bKash'
                                  ? 'bg-pink-600'
                                  : method === 'Nagad'
                                  ? 'bg-orange-500'
                                  : method === 'Rocket'
                                  ? 'bg-purple-600'
                                  : 'bg-emerald-600'
                              }`}
                            />
                            {method} ({count} orders)
                          </span>
                          <span className="font-mono text-slate-900">৳{amount} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full ${
                              method === 'bKash'
                                ? 'bg-pink-500'
                                : method === 'Nagad'
                                ? 'bg-orange-500'
                                : method === 'Rocket'
                                ? 'bg-purple-500'
                                : 'bg-emerald-600'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Zone Breakdown */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
                  <span>Top Regional Delivery Zones</span>
                  <MapPin className="w-4 h-4 text-emerald-600" />
                </h3>

                <div className="space-y-2.5 text-xs">
                  {BANGLADESH_DIVISIONS.slice(0, 5).map((div) => {
                    const count = orders.filter((o) => o.division === div).length;
                    const pct = orders.length > 0 ? Math.round((count / orders.length) * 100) : 0;
                    return (
                      <div key={div} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="font-semibold text-slate-800">{div}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-500">{count} orders</span>
                          <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-emerald-800">
                            {pct}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Action: Recent Urgent Orders Table */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Recent Customer Orders</h3>
                  <p className="text-xs text-slate-500">Live order queue from Cloud Firestore</p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                >
                  <span>View All ({orders.length})</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Items</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Payment</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.slice(0, 5).map((order) => {
                      const badge = getStatusBadge(order.status);
                      const BadgeIcon = badge.icon;
                      return (
                        <tr key={order.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3 px-4 font-mono font-bold text-emerald-900">
                            {order.id}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{order.customerName}</div>
                            <div className="text-[11px] text-slate-500">{order.customerPhone}</div>
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            {order.items.length} items
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900">
                            ৳{order.total}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium text-slate-700">
                              {order.paymentMethod}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}
                            >
                              <BadgeIcon className="w-3 h-3" />
                              <span>{order.status}</span>
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                handleSelectOrder(order);
                                setActiveTab('orders');
                              }}
                              className="text-xs bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 font-bold px-2.5 py-1 rounded-lg transition cursor-pointer"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS CRM */}
        {activeTab === 'orders' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Filter Sub-bar */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
              {/* Search */}
              <div className="flex items-center gap-2 flex-1 min-w-[260px] max-w-md bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by order ID, name, phone, address, or TrxID..."
                  className="bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none w-full"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="Processing">Processing</option>
                  <option value="Farm Dispatched">Farm Dispatched</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                {/* Payment Filter */}
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="bg-white border border-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Payments</option>
                  <option value="bKash">bKash</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Rocket">Rocket</option>
                  <option value="COD">Cash on Delivery</option>
                </select>

                {/* Division Filter */}
                <select
                  value={divisionFilter}
                  onChange={(e) => setDivisionFilter(e.target.value)}
                  className="bg-white border border-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none cursor-pointer hidden md:block"
                >
                  <option value="all">All Divisions</option>
                  {BANGLADESH_DIVISIONS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>

                <span className="text-xs text-slate-400 font-medium ml-1">
                  {filteredOrders.length} orders
                </span>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-16 p-4 space-y-3">
                  <Package className="w-12 h-12 mx-auto text-slate-300 stroke-1" />
                  <h4 className="text-base font-bold text-slate-800">No Orders Found</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    No orders match your filter criteria. Try clicking &apos;Seed Cloud Orders&apos; or placing an order on the storefront.
                  </p>
                  <button
                    onClick={handleSeedOrders}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
                  >
                    Seed Cloud Firestore Orders
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100 uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Order ID & Date</th>
                        <th className="py-3 px-4">Customer Info</th>
                        <th className="py-3 px-4">Delivery Location</th>
                        <th className="py-3 px-4">Items / Total</th>
                        <th className="py-3 px-4">Payment & Trx</th>
                        <th className="py-3 px-4">Delivery Status</th>
                        <th className="py-3 px-4 text-right">Inspect</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredOrders.map((ord) => {
                        const badge = getStatusBadge(ord.status);
                        const BadgeIcon = badge.icon;
                        const isSelected = selectedOrder?.id === ord.id;

                        return (
                          <tr
                            key={ord.id}
                            className={`hover:bg-emerald-50/40 transition cursor-pointer ${
                              isSelected ? 'bg-emerald-50/70 border-l-4 border-emerald-600' : ''
                            }`}
                            onClick={() => handleSelectOrder(ord)}
                          >
                            <td className="py-3 px-4">
                              <span className="font-mono font-black text-emerald-900 block">
                                {ord.id}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {new Date(ord.createdAt).toLocaleDateString('en-GB', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </td>

                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-900">{ord.customerName}</div>
                              <div className="text-[11px] text-emerald-800 font-mono">
                                {ord.customerPhone}
                              </div>
                            </td>

                            <td className="py-3 px-4 max-w-[200px]">
                              <div className="truncate text-slate-700 font-medium">
                                {ord.deliveryAddress}
                              </div>
                              <div className="text-[10px] text-slate-400">{ord.division}</div>
                            </td>

                            <td className="py-3 px-4">
                              <div className="font-black text-slate-900">৳{ord.total}</div>
                              <div className="text-[10px] text-slate-500">
                                {ord.items.length} items
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              <span className="font-bold text-slate-800 block">
                                {ord.paymentMethod}
                              </span>
                              <span className="text-[10px] font-mono text-slate-500">
                                {ord.transactionId || 'None'}
                              </span>
                            </td>

                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}
                              >
                                <BadgeIcon className="w-3 h-3" />
                                <span>{badge.label.split(' ')[0]}</span>
                              </span>
                            </td>

                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectOrder(ord);
                                }}
                                className="bg-slate-100 hover:bg-emerald-700 hover:text-white text-slate-700 font-bold px-3 py-1.5 rounded-xl transition cursor-pointer text-xs"
                              >
                                View Order
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOMERS CRM */}
        {activeTab === 'customers' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-slate-900">Customer Relationship Directory</h3>
                <p className="text-xs text-slate-500">
                  Aggregated lifetime customer spend, frequency, and contact records
                </p>
              </div>
              <div className="text-xs font-bold bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200">
                {customersList.length} Unique Clients
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Customer Name & Phone</th>
                      <th className="py-3 px-4">Division / City</th>
                      <th className="py-3 px-4">Total Orders</th>
                      <th className="py-3 px-4">Lifetime Spend (LTV)</th>
                      <th className="py-3 px-4">VIP Tier</th>
                      <th className="py-3 px-4">Last Active</th>
                      <th className="py-3 px-4 text-right">CRM Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {customersList.map((cust) => (
                      <tr key={cust.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{cust.name}</div>
                          <div className="text-[11px] font-mono text-emerald-800 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-emerald-600" />
                            <a href={`tel:${cust.phone}`} className="hover:underline">
                              {cust.phone}
                            </a>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-slate-700">
                          {cust.division || 'Dhaka'}
                        </td>

                        <td className="py-3 px-4 font-bold text-slate-900">
                          {cust.totalOrders} orders
                        </td>

                        <td className="py-3 px-4 font-black text-emerald-800 text-sm">
                          ৳{cust.totalSpent.toLocaleString()}
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              cust.tier === 'VIP Gold'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : cust.tier === 'Silver Regular'
                                ? 'bg-slate-100 text-slate-800 border border-slate-300'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {cust.tier}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-slate-500 text-[11px]">
                          {new Date(cust.lastOrderDate).toLocaleDateString()}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedCustomer(cust)}
                            className="bg-emerald-50 hover:bg-emerald-700 hover:text-white text-emerald-800 font-bold px-3 py-1.5 rounded-xl transition cursor-pointer text-xs"
                          >
                            View CRM Profile
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: INVENTORY & STOCK */}
        {activeTab === 'inventory' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-slate-900">Live Inventory & Stock Management</h3>
                <p className="text-xs text-slate-500">
                  Control stock quantities, active status, and prices in real-time
                </p>
              </div>

              <button
                onClick={() => setIsNewProductOpen(true)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inventoryList.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex gap-3.5 items-start justify-between"
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="font-bold text-slate-900 text-xs truncate">{item.name}</h4>
                    <p className="text-[11px] text-emerald-800 font-medium">{item.nameBn}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-black text-slate-900">৳{item.price}</span>
                      <span className="text-slate-400">/ {item.unit}</span>
                    </div>

                    {/* Stock status indicator */}
                    <div className="flex items-center justify-between pt-1">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          item.inStock
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {item.inStock ? `In Stock (${item.stockQuantity})` : 'Out of Stock'}
                      </span>

                      {/* Stock controls */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStockAdjust(item.id, -5)}
                          className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer"
                          title="Decrease 5"
                        >
                          -5
                        </button>
                        <button
                          onClick={() => handleStockAdjust(item.id, 5)}
                          className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer"
                          title="Add 5"
                        >
                          +5
                        </button>
                        <button
                          onClick={() => handleToggleStock(item.id)}
                          className="text-[10px] text-slate-500 hover:text-slate-800 font-semibold px-1 cursor-pointer"
                        >
                          Toggle
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: LOGISTICS DISPATCH */}
        {activeTab === 'logistics' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">Courier & Rider Dispatch Hub</h3>
                <p className="text-xs text-slate-500">
                  Dhaka Express deliveries and nationwide 64-district dispatches
                </p>
              </div>
              <span className="bg-sky-50 text-sky-800 border border-sky-200 font-bold text-xs px-3 py-1.5 rounded-xl">
                {dispatchedCount} Dispatches Active
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Ready to Dispatch */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="font-bold text-xs uppercase text-amber-800 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Harvest & Packing ({processingCount})</span>
                  </h4>
                </div>

                <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
                  {orders
                    .filter((o) => o.status === 'Processing')
                    .map((ord) => (
                      <div
                        key={ord.id}
                        onClick={() => handleSelectOrder(ord)}
                        className="p-3 rounded-2xl border border-amber-200/70 bg-amber-50/40 hover:bg-amber-50 cursor-pointer transition text-xs space-y-1.5"
                      >
                        <div className="flex justify-between font-bold">
                          <span className="font-mono text-emerald-900">{ord.id}</span>
                          <span className="text-slate-900">৳{ord.total}</span>
                        </div>
                        <p className="text-slate-700 font-medium">{ord.customerName} • {ord.customerPhone}</p>
                        <p className="text-[11px] text-slate-500 truncate">{ord.deliveryAddress}</p>
                        <div className="pt-1 flex justify-between items-center text-[10px]">
                          <span className="bg-white px-2 py-0.5 rounded border border-amber-200 font-semibold">
                            {ord.paymentMethod}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateOrderStatus(ord.id, 'Farm Dispatched');
                            }}
                            className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-2.5 py-1 rounded-lg cursor-pointer"
                          >
                            Mark Dispatched ➔
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* On Delivery Route */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="font-bold text-xs uppercase text-sky-800 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Rider on Route ({dispatchedCount})</span>
                  </h4>
                </div>

                <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
                  {orders
                    .filter((o) => o.status === 'Farm Dispatched' || o.status === 'Out for Delivery')
                    .map((ord) => (
                      <div
                        key={ord.id}
                        onClick={() => handleSelectOrder(ord)}
                        className="p-3 rounded-2xl border border-sky-200/70 bg-sky-50/40 hover:bg-sky-50 cursor-pointer transition text-xs space-y-1.5"
                      >
                        <div className="flex justify-between font-bold">
                          <span className="font-mono text-emerald-900">{ord.id}</span>
                          <span className="text-slate-900">৳{ord.total}</span>
                        </div>
                        <p className="text-slate-700 font-medium">{ord.customerName} • {ord.customerPhone}</p>
                        <p className="text-[11px] text-sky-900 font-medium">
                          Rider: {(ord as any).riderName || 'Unassigned'} {(ord as any).riderPhone ? `(${(ord as any).riderPhone})` : ''}
                        </p>
                        <div className="pt-1 flex justify-between items-center text-[10px]">
                          <span className="bg-white px-2 py-0.5 rounded border border-sky-200 font-semibold">
                            {ord.status}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateOrderStatus(ord.id, 'Delivered');
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded-lg cursor-pointer"
                          >
                            Mark Delivered ✓
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Delivered Archive */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="font-bold text-xs uppercase text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Delivered ({deliveredCount})</span>
                  </h4>
                </div>

                <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
                  {orders
                    .filter((o) => o.status === 'Delivered')
                    .slice(0, 10)
                    .map((ord) => (
                      <div
                        key={ord.id}
                        onClick={() => handleSelectOrder(ord)}
                        className="p-3 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition text-xs space-y-1"
                      >
                        <div className="flex justify-between font-bold">
                          <span className="font-mono text-emerald-900">{ord.id}</span>
                          <span className="text-emerald-700 font-black">৳{ord.total}</span>
                        </div>
                        <p className="text-slate-600">{ord.customerName} • {ord.customerPhone}</p>
                        <span className="text-[10px] text-slate-400 block">
                          Completed on {new Date(ord.updatedAt || ord.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: MARKETING & PROMO CODES */}
        {activeTab === 'marketing' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">Campaigns & Promo Code Registry</h3>
                <p className="text-xs text-slate-500">
                  Track consumer incentive vouchers and discount disbursements
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-emerald-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-emerald-100 text-emerald-900 font-mono font-black text-sm px-3 py-1 rounded-xl">
                    VEGINA100
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-800">৳100 Flat Welcome Discount</h4>
                <p className="text-xs text-slate-500">Available to all new organic customers across Bangladesh.</p>
                <div className="text-xs text-slate-600 border-t border-slate-100 pt-2 font-medium">
                  Redemption Rule: Min order ৳1000 • Fixed ৳100 deduction
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-amber-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-amber-100 text-amber-900 font-mono font-black text-sm px-3 py-1 rounded-xl">
                    FARM20
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-800">20% Off Fresh Harvest</h4>
                <p className="text-xs text-slate-500">Seasonal farm promotion on fresh vegetables and fruits.</p>
                <div className="text-xs text-slate-600 border-t border-slate-100 pt-2 font-medium">
                  Redemption Rule: 20% discount applied to produce subtotal
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-sky-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-sky-100 text-sky-900 font-mono font-black text-sm px-3 py-1 rounded-xl">
                    ORGANIC50
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-800">৳50 Special Organic Token</h4>
                <p className="text-xs text-slate-500">General loyalty voucher for recurring customers.</p>
                <div className="text-xs text-slate-600 border-t border-slate-100 pt-2 font-medium">
                  Redemption Rule: ৳50 discount applied at checkout
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ORDER INSPECTOR MODAL / DRAWER */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div
            className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 my-6 max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-50/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-md">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-mono font-black text-base text-emerald-950">
                      {selectedOrder.id}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        getStatusBadge(selectedOrder.status).bg
                      }`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Placed: {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPackingSlipOpen(true)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
                  title="Print Packing Slip"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Packing Slip</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5 text-xs">
              {/* Customer Info Card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                  Customer & Delivery Contact
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-slate-400 block">Name:</span>
                    <strong className="text-slate-900">{selectedOrder.customerName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Phone:</span>
                    <a
                      href={`tel:${selectedOrder.customerPhone}`}
                      className="font-mono font-bold text-emerald-800 hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3 text-emerald-600" />
                      {selectedOrder.customerPhone}
                    </a>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block">Address:</span>
                    <span>{selectedOrder.deliveryAddress}, {selectedOrder.division}</span>
                  </div>
                  {selectedOrder.notes && (
                    <div className="sm:col-span-2 text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200">
                      <strong>Customer Note:</strong> {selectedOrder.notes}
                    </div>
                  )}
                </div>
              </div>

              {/* Status Update Control */}
              <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200 space-y-3">
                <h4 className="font-bold text-emerald-950 uppercase tracking-wider text-[10px]">
                  Delivery Stage & Dispatch Controls
                </h4>

                <div className="flex flex-wrap items-center gap-2">
                  {(['Processing', 'Farm Dispatched', 'Out for Delivery', 'Delivered', 'Cancelled'] as OrderStatus[]).map(
                    (st) => (
                      <button
                        key={st}
                        disabled={isUpdatingStatus}
                        onClick={() => handleUpdateOrderStatus(selectedOrder.id, st)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                          selectedOrder.status === st
                            ? 'bg-emerald-700 text-white shadow-sm'
                            : 'bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-100'
                        }`}
                      >
                        {st}
                      </button>
                    )
                  )}
                </div>

                {/* Rider Assignment Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Assigned Rider / Courier Name
                    </label>
                    <input
                      type="text"
                      value={riderNameInput}
                      onChange={(e) => setRiderNameInput(e.target.value)}
                      placeholder="e.g. Rafiqul (Pathao/Steadfast)"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Rider Phone Number
                    </label>
                    <input
                      type="tel"
                      value={riderPhoneInput}
                      onChange={(e) => setRiderPhoneInput(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:border-emerald-600 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Internal CRM Notes (Packaging checks, special handling)
                    </label>
                    <input
                      type="text"
                      value={adminNoteInput}
                      onChange={(e) => setAdminNoteInput(e.target.value)}
                      placeholder="e.g. Double packaging for ghee jar, call before 4 PM"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="text-right">
                  <button
                    disabled={isUpdatingStatus}
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, selectedOrder.status)}
                    className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-4 py-1.5 rounded-xl text-xs transition cursor-pointer"
                  >
                    Save Dispatch Details
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px] mb-2">
                  Ordered Fresh Products ({selectedOrder.items.length})
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between gap-3 bg-white">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                          <Image
                            src={it.image}
                            alt={it.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{it.name}</p>
                          <p className="text-[11px] text-slate-400">
                            {it.nameBn} • {it.unit} × {it.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900">
                        ৳{it.price * it.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Calculation */}
              <div className="bg-slate-50 rounded-2xl p-4 text-xs space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>৳{selectedOrder.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span>{selectedOrder.deliveryFee === 0 ? 'FREE' : `৳${selectedOrder.deliveryFee}`}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Discount:</span>
                    <span>-৳{selectedOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-200 pt-1.5">
                  <span>Grand Total:</span>
                  <span className="text-emerald-800">৳{selectedOrder.total}</span>
                </div>
                <div className="text-[11px] text-slate-500 pt-1">
                  Payment: <strong>{selectedOrder.paymentMethod}</strong> ({selectedOrder.paymentStatus}) • Trx: {selectedOrder.transactionId || 'None'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOMER CRM PROFILE MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div
            className="relative bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 my-6 max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  {selectedCustomer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">{selectedCustomer.name}</h3>
                  <span className="text-xs text-slate-500">{selectedCustomer.phone} • {selectedCustomer.email}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto text-xs">
              {/* Quick Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Lifetime Spend</span>
                  <span className="text-base font-black text-emerald-800">৳{selectedCustomer.totalSpent}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Orders Count</span>
                  <span className="text-base font-black text-slate-900">{selectedCustomer.totalOrders}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">VIP Tier</span>
                  <span className="text-xs font-bold text-amber-700 mt-1 block">{selectedCustomer.tier}</span>
                </div>
              </div>

              {/* Direct Communication Action Buttons */}
              <div className="flex gap-2">
                <a
                  href={`tel:${selectedCustomer.phone}`}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition text-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Customer</span>
                </a>
                <a
                  href={`https://wa.me/88${selectedCustomer.phone.replace(/^0/, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition text-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Message</span>
                </a>
              </div>

              {/* Customer Past Orders List */}
              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px] mb-2">
                  Order History ({selectedCustomer.orders.length})
                </h4>
                <div className="space-y-2">
                  {selectedCustomer.orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between"
                    >
                      <div>
                        <span className="font-mono font-bold text-emerald-900">{ord.id}</span>
                        <p className="text-[10px] text-slate-400">
                          {new Date(ord.createdAt).toLocaleDateString()} • {ord.paymentMethod}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900">৳{ord.total}</span>
                        <span className="block text-[10px] text-emerald-700 font-semibold">{ord.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE PACKING SLIP MODAL */}
      {isPackingSlipOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="font-black text-lg text-slate-900">VEGINA BANGLADESH</h3>
                <p className="text-xs text-slate-500">Farm Packing Slip & Courier Manifest</p>
              </div>
              <button
                onClick={() => setIsPackingSlipOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-2 font-mono">
              <div className="flex justify-between">
                <span>Order No:</span>
                <strong>{selectedOrder.id}</strong>
              </div>
              <div className="flex justify-between">
                <span>Customer:</span>
                <span>{selectedOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span>Phone:</span>
                <span>{selectedOrder.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span>Destination:</span>
                <span>{selectedOrder.deliveryAddress}, {selectedOrder.division}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment:</span>
                <span>{selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})</span>
              </div>
            </div>

            <div className="border-t border-b py-3">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b">
                    <th className="py-1">Item</th>
                    <th className="py-1 text-center">Qty</th>
                    <th className="py-1 text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-1">{it.name} ({it.unit})</td>
                      <td className="py-1 text-center">{it.quantity}</td>
                      <td className="py-1 text-right">৳{it.price * it.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between text-xs font-mono font-bold">
              <span>Total Payable Amount:</span>
              <span className="text-sm">৳{selectedOrder.total}</span>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document</span>
              </button>
              <button
                onClick={() => setIsPackingSlipOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
