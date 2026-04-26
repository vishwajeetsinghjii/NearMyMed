import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, User, MapPin, Phone, Mail, CheckCircle, Shield, Package } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useOrderHistory } from '../../context/OrderHistoryContext';
import emailjs from "@emailjs/browser";

export default function CheckoutPage() {
  const { items, getCartTotal, getCartCount, clearCart } = useCart();
  const { isDark } = useTheme();
  const { addOrder } = useOrderHistory();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: details, 2: confirm, 3: success
  const [form, setForm] = useState({
    fullName: '', phone: '', email: '', age: '', gender: '',
    address1: '', address2: '', city: '', state: '', pinCode: '',
    paymentMethod: 'cod',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const deliveryFee = getCartTotal() >= 500 ? 0 : 40;
  const total = getCartTotal() + deliveryFee;

  if (items.length === 0 && step !== 3) {
    navigate('/cart');
    return null;
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.phone.trim() || form.phone.length < 10) e.phone = 'Valid phone number required';
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'Valid email required';
    if (!form.age.trim()) e.age = 'Age is required';
    if (!form.gender) e.gender = 'Select gender';
    if (!form.address1.trim()) e.address1 = 'Address is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.state.trim()) e.state = 'State is required';
    if (!form.pinCode.trim() || form.pinCode.length < 6) e.pinCode = 'Valid PIN code required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) setStep(2);
  };

const handleConfirm = () => {
  const newOrderId = addOrder({
    items: items.map(i => ({ ...i })),
    subtotal: getCartTotal(),
    deliveryFee,
    total,
    paymentMethod: form.paymentMethod,
    deliveryAddress: {
      fullName: form.fullName,
      phone: form.phone,
      email: form.email,
      address1: form.address1,
      address2: form.address2,
      city: form.city,
      state: form.state,
      pinCode: form.pinCode,
    },
  });

  // 🔥 ONLY THIS LINE ADDED
  sendEmails(newOrderId);

  setGeneratedOrderId(newOrderId);
  clearCart();
  setStep(3);
};

  const [generatedOrderId, setGeneratedOrderId] = useState('');
  const orderId = generatedOrderId || `NMM-${Date.now().toString(36).toUpperCase()}`;

  const inputClass = `w-full px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 transition ${isDark ? 'glass border border-white/10 text-white placeholder-slate-500 focus:ring-blue-500/40 focus:border-blue-500/30' : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500/30 focus:border-blue-400'}`;
  const labelClass = `block text-xs font-bold mb-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`;
  const errorClass = 'text-xs text-red-400 mt-1';



    // 🔥 EMAIL FUNCTION
const generateItemsHTML = () => {
  return items.map(item => `
    <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #eee;">
      <span>${item.name} × ${item.quantity}</span>
      <span>₹${item.price * item.quantity}</span>
    </div>
  `).join('');
};

const sendEmails = (orderId: string) => {
  console.log("FORM EMAIL:", form.email);
  console.log("PARAMS:", templateParams);
  const templateParams = {
    user_name: form.fullName,
    user_email: form.email, // IMPORTANT (for sending)
    order_id: orderId,
    total: total,
    items_html: generateItemsHTML(), // 🔥 THIS IS NEW
  };

  // USER EMAIL
  emailjs.send(
    "service_yb3clca",
    "template_q1zcqaq",
    templateParams,
    "-xTNLGloxlRg2ibDS"
  ).then(() => {
    console.log("User email sent");
  }).catch(err => console.error("User email error:", err));

  // ADMIN EMAIL
  emailjs.send(
    "service_yb3clca",
    "template_9h1ixfv",
    templateParams,
    "-xTNLGloxlRg2ibDS"
  ).then(() => {
    console.log("Admin email sent");
  }).catch(err => console.error("Admin email error:", err));
};



  // ── SUCCESS ──
  if (step === 3) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#080c14]' : 'bg-gray-50'}`}>
        <div className="text-center animate-fade-in-up max-w-md mx-auto px-4">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${isDark ? 'bg-green-500/20 border-2 border-green-400/40' : 'bg-green-100 border-2 border-green-300'}`}>
            <CheckCircle size={48} className="text-green-400" />
          </div>
          <h1 className={`text-3xl font-black mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Order Placed! 🎉</h1>
          <p className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Your order has been confirmed successfully</p>
          <div className={`inline-block px-5 py-2 rounded-full text-sm font-bold mb-8 ${isDark ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
            Order ID: {orderId}
          </div>
          <div className={`rounded-2xl border p-6 text-left mb-8 ${isDark ? 'glass border-white/8' : 'bg-white border-gray-200 shadow-md'}`}>
            <div className="space-y-3 text-sm">
              <div className={`flex justify-between ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                <span>Delivery To</span><span className={isDark ? 'text-white' : 'text-gray-900'}>{form.fullName}</span>
              </div>
              <div className={`flex justify-between ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                <span>Phone</span><span className={isDark ? 'text-white' : 'text-gray-900'}>{form.phone}</span>
              </div>
              <div className={`flex justify-between ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                <span>Payment</span><span className={isDark ? 'text-white' : 'text-gray-900'}>{form.paymentMethod === 'cod' ? 'Cash on Delivery' : form.paymentMethod === 'upi' ? 'UPI Payment' : 'Credit/Debit Card'}</span>
              </div>
              <div className={`flex justify-between ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                <span>Estimated Delivery</span><span className={`font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>Within 2-4 hours</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => navigate('/orders')} className="bg-violet-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-violet-500 transition text-sm">View Orders</button>
            <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-500 transition text-sm">Back to Home</button>
            <button onClick={() => navigate('/search/name')} className={`px-8 py-3 rounded-xl font-bold text-sm transition border ${isDark ? 'glass border-white/10 text-slate-300 hover:text-white' : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'}`}>Continue Shopping</button>
          </div>
        </div>
      </div>
    );
  }

  // ── CONFIRM ──
  if (step === 2) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-[#080c14] bg-dark-grid' : 'bg-gray-50'}`}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <button onClick={() => setStep(1)} className={`flex items-center gap-2 text-sm mb-6 transition ${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
            <ArrowLeft size={16} /> Back to Details
          </button>
          <h1 className={`text-3xl font-black mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>Confirm Order</h1>

          {/* Items */}
          <div className={`rounded-2xl border p-5 mb-6 ${isDark ? 'glass border-white/8' : 'bg-white border-gray-200 shadow-sm'}`}>
            <h3 className={`font-bold text-sm mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>📦 Items ({getCartCount()})</h3>
            {items.map(item => (
              <div key={item.id} className={`flex justify-between py-2 text-sm border-b last:border-0 ${isDark ? 'border-white/5 text-slate-300' : 'border-gray-100 text-gray-700'}`}>
                <span>{item.name} × {item.quantity}</span>
                <span className="font-bold">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          {/* Delivery */}
          <div className={`rounded-2xl border p-5 mb-6 ${isDark ? 'glass border-white/8' : 'bg-white border-gray-200 shadow-sm'}`}>
            <h3 className={`font-bold text-sm mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>🚚 Delivery Details</h3>
            <div className={`space-y-2 text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
              <p><strong className={isDark ? 'text-white' : 'text-gray-900'}>{form.fullName}</strong> · {form.phone}</p>
              <p>{form.address1}{form.address2 ? ', ' + form.address2 : ''}</p>
              <p>{form.city}, {form.state} - {form.pinCode}</p>
            </div>
          </div>

          {/* Total */}
          <div className={`rounded-2xl border p-5 mb-8 ${isDark ? 'glass border-white/8' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="space-y-2 text-sm">
              <div className={`flex justify-between ${isDark ? 'text-slate-400' : 'text-gray-600'}`}><span>Subtotal</span><span>₹{getCartTotal()}</span></div>
              <div className={`flex justify-between ${isDark ? 'text-slate-400' : 'text-gray-600'}`}><span>Delivery</span><span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span></div>
              <div className={`border-t pt-2 flex justify-between font-black text-lg ${isDark ? 'border-white/10 text-white' : 'border-gray-200 text-gray-900'}`}>
                <span>Total</span><span className={isDark ? 'text-blue-400' : 'text-blue-600'}>₹{total}</span>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>Payment: {form.paymentMethod === 'cod' ? 'Cash on Delivery' : form.paymentMethod === 'upi' ? 'UPI Payment' : 'Credit/Debit Card'}</p>
            </div>
          </div>

          <button onClick={handleConfirm}
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-black py-4 rounded-2xl hover:bg-green-500 transition shadow-xl text-sm">
            <CheckCircle size={18} /> Place Order · ₹{total}
          </button>
        </div>
      </div>
    );
  }

  // ── FORM ──
  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#080c14] bg-dark-grid' : 'bg-gray-50'}`}>
      <div className={`border-b ${isDark ? 'bg-gradient-to-b from-blue-600/10 to-transparent border-white/5' : 'bg-gradient-to-b from-blue-50 to-white border-gray-200'}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button onClick={() => navigate('/cart')} className={`flex items-center gap-2 text-sm mb-4 transition ${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
            <ArrowLeft size={16} /> Back to Cart
          </button>
          <h1 className={`text-2xl md:text-4xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>Checkout</h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Fill in your details for delivery</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info */}
            <div className={`rounded-2xl border p-6 ${isDark ? 'glass border-white/8' : 'bg-white border-gray-200 shadow-sm'}`}>
              <div className="flex items-center gap-2 mb-5">
                <User size={18} className={isDark ? 'text-blue-400' : 'text-blue-500'} />
                <h2 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Personal Information</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={labelClass}>Full Name *</label>
                  <input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} placeholder="Enter your full name" className={inputClass} />
                  {errors.fullName && <p className={errorClass}>{errors.fullName}</p>}
                </div>
                <div>
                  <label className={labelClass}>Phone Number *</label>
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" className={inputClass} type="tel" />
                  {errors.phone && <p className={errorClass}>{errors.phone}</p>}
                </div>
                <div>
                  <label className={labelClass}>Email *</label>
                  <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" className={inputClass} type="email" />
                  {errors.email && <p className={errorClass}>{errors.email}</p>}
                </div>
                <div>
                  <label className={labelClass}>Age *</label>
                  <input value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} placeholder="e.g. 25" className={inputClass} type="number" />
                  {errors.age && <p className={errorClass}>{errors.age}</p>}
                </div>
                <div>
                  <label className={labelClass}>Gender *</label>
                  <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} className={inputClass}>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && <p className={errorClass}>{errors.gender}</p>}
                </div>
              </div>
            </div>

            {/* Address */}
            <div className={`rounded-2xl border p-6 ${isDark ? 'glass border-white/8' : 'bg-white border-gray-200 shadow-sm'}`}>
              <div className="flex items-center gap-2 mb-5">
                <MapPin size={18} className={isDark ? 'text-green-400' : 'text-green-500'} />
                <h2 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Delivery Address</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={labelClass}>Address Line 1 *</label>
                  <input value={form.address1} onChange={e => setForm({ ...form, address1: e.target.value })} placeholder="House/Flat No., Building, Street" className={inputClass} />
                  {errors.address1 && <p className={errorClass}>{errors.address1}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Address Line 2</label>
                  <input value={form.address2} onChange={e => setForm({ ...form, address2: e.target.value })} placeholder="Landmark, Area (optional)" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>City *</label>
                  <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="City" className={inputClass} />
                  {errors.city && <p className={errorClass}>{errors.city}</p>}
                </div>
                <div>
                  <label className={labelClass}>State *</label>
                  <input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} placeholder="State" className={inputClass} />
                  {errors.state && <p className={errorClass}>{errors.state}</p>}
                </div>
                <div>
                  <label className={labelClass}>PIN Code *</label>
                  <input value={form.pinCode} onChange={e => setForm({ ...form, pinCode: e.target.value })} placeholder="6-digit PIN" className={inputClass} type="text" maxLength={6} />
                  {errors.pinCode && <p className={errorClass}>{errors.pinCode}</p>}
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className={`rounded-2xl border p-6 ${isDark ? 'glass border-white/8' : 'bg-white border-gray-200 shadow-sm'}`}>
              <div className="flex items-center gap-2 mb-5">
                <CreditCard size={18} className={isDark ? 'text-violet-400' : 'text-violet-500'} />
                <h2 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Payment Method</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { value: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when you receive' },
                  { value: 'upi', label: 'UPI Payment', icon: '📱', desc: 'GPay, PhonePe, Paytm' },
                  { value: 'card', label: 'Credit/Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' },
                ].map(pm => (
                  <button key={pm.value} onClick={() => setForm({ ...form, paymentMethod: pm.value })}
                    className={`p-4 rounded-xl border text-left transition ${form.paymentMethod === pm.value
                      ? (isDark ? 'border-blue-500/40 bg-blue-500/10 neon-blue' : 'border-blue-400 bg-blue-50 shadow-sm')
                      : (isDark ? 'border-white/8 hover:border-white/20' : 'border-gray-200 hover:border-gray-300')
                    }`}>
                    <div className="text-2xl mb-2">{pm.icon}</div>
                    <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{pm.label}</p>
                    <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>{pm.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className={`rounded-2xl border p-6 h-fit sticky top-24 ${isDark ? 'glass border-white/8' : 'bg-white border-gray-200 shadow-md'}`}>
            <h3 className={`font-black text-lg mb-5 ${isDark ? 'text-white' : 'text-gray-900'}`}>Order Summary</h3>
            <div className="space-y-2 mb-5">
              {items.map(item => (
                <div key={item.id} className={`flex justify-between text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  <span className="truncate mr-2">{item.name} × {item.quantity}</span>
                  <span className="font-semibold">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className={`border-t pt-3 space-y-2 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
              <div className={`flex justify-between text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                <span>Subtotal</span><span>₹{getCartTotal()}</span>
              </div>
              <div className={`flex justify-between text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                <span>Delivery</span><span>{deliveryFee === 0 ? <span className="text-green-400 font-bold">FREE</span> : `₹${deliveryFee}`}</span>
              </div>
              <div className={`border-t pt-3 flex justify-between font-black text-lg ${isDark ? 'border-white/10 text-white' : 'border-gray-200 text-gray-900'}`}>
                <span>Total</span><span className={isDark ? 'text-blue-400' : 'text-blue-600'}>₹{total}</span>
              </div>
            </div>

            <button onClick={handleSubmit}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-4 rounded-2xl mt-6 hover:bg-blue-500 transition shadow-lg neon-blue text-sm">
              Review Order
            </button>

            <div className={`flex items-center gap-2 mt-4 px-2 ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
              <Shield size={14} />
              <span className="text-xs">Your data is encrypted and secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
