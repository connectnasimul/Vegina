import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, setDoc } from 'firebase/firestore';

export async function GET() {
  try {
    const ordersSnap = await getDocs(collection(db, 'orders'));
    const orders: any[] = [];
    ordersSnap.forEach((d) => {
      orders.push({ id: d.id, ...d.data() });
    });
    return NextResponse.json({
      success: true,
      count: orders.length,
      orders,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Server Firestore orders fetch error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch orders from Cloud Firestore' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, orderId, status, adminNotes, riderName, riderPhone } = body;

    if (action === 'updateStatus' && orderId) {
      const orderRef = doc(db, 'orders', orderId);
      const updateData: any = {
        updatedAt: new Date().toISOString(),
      };
      if (status) updateData.status = status;
      if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
      if (riderName !== undefined) updateData.riderName = riderName;
      if (riderPhone !== undefined) updateData.riderPhone = riderPhone;

      await updateDoc(orderRef, updateData);
      return NextResponse.json({ success: true, message: `Order ${orderId} updated on server.` });
    }

    if (action === 'seedSampleOrders') {
      // Create authentic Bangladeshi sample orders if database is fresh
      const sampleOrders = [
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

      for (const order of sampleOrders) {
        await setDoc(doc(db, 'orders', order.id), order, { merge: true });
      }

      return NextResponse.json({ success: true, message: 'Sample CRM orders seeded in Firestore.' });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    console.error('Server Firestore action error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
