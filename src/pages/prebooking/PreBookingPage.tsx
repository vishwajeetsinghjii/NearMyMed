import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, AlertTriangle, CheckCircle, MapPin, User, Phone, FileText, Zap, Package, ArrowLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import emailjs from "@emailjs/browser";

const emergencyMedicines = [
  { id: 'paracetamol-500', name: 'Paracetamol 500mg', brand: 'Calpol', price: 12, priceDisplay: '₹12', type: 'Tablet', purpose: 'Fever & Pain Relief' },
  { id: 'salbutamol-inhaler', name: 'Salbutamol Inhaler', brand: 'Asthalin', price: 135, priceDisplay: '₹135', type: 'Inhaler', purpose: 'Asthma Emergency' },
  { id: 'ondansetron-4', name: 'Ondansetron 4mg', brand: 'Emeset', price: 25, priceDisplay: '₹25', type: 'Tablet', purpose: 'Severe Nausea/Vomiting' },
  { id: 'cetirizine-10', name: 'Cetirizine 10mg', brand: 'Cetzine', price: 10, priceDisplay: '₹10', type: 'Tablet', purpose: 'Allergic Reaction' },
  { id: 'omeprazole-20', name: 'Omeprazole 20mg', brand: 'Prilosec', price: 32, priceDisplay: '₹32', type: 'Capsule', purpose: 'Severe Acidity' },
  { id: 'diclofenac-50', name: 'Diclofenac 50mg', brand: 'Voveran', price: 22, priceDisplay: '₹22', type: 'Tablet', purpose: 'Acute Pain/Inflammation' },
  { id: 'levocetirizine-5', name: 'Levocetirizine 5mg', brand: 'Xyzal', price: 15, priceDisplay: '₹15', type: 'Tablet', purpose: 'Severe Allergy' },
  { id: 'domperidone-10', name: 'Domperidone 10mg', brand: 'Domstal', price: 14, priceDisplay: '₹14', type: 'Tablet', purpose: 'Nausea Emergency' },
];

const emergencyReasons = [
  'Severe allergic reaction (anaphylaxis)',
  'Diabetic emergency (hypo/hyperglycemia)',
  'Heart condition / Chest pain',
  'High fever in child (>103°F)',
  'Asthma / Breathing difficulty',
  'Severe pain (injury/accident)',
  'Post-surgical medicine urgency',
  'Severe vomiting / dehydration',
  'Seizure / Epilepsy episode',
  'Other emergency reason',
];

const urgencyLevels = [
  { value: 'critical', label: '🔴 Critical', desc: 'Need within 30 minutes', time: '< 30 min', color: 'red' },
  { value: 'high', label: '🟠 High', desc: 'Need within 1 hour', time: '< 1 hour', color: 'orange' },
  { value: 'standard', label: '🟡 Standard', desc: 'Need within 3 hours', time: '< 3 hours', color: 'yellow' },
];

export default function PreBookingPage() {
  const { isDark } = useTheme();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: select, 2: details, 3: confirmed
  const [selectedMeds, setSelectedMeds] = useState<string[]>([]);
  const [form, setForm] = useState({
    reason: '', customReason: '', urgency: 'high',
    patientName: '', patientAge: '', patientPhone: '', patientAddress: '',
  });

  const toggleMed = (id: string) => {
    setSelectedMeds(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  const handleConfirm = async () => {
    // Add selected meds to cart
    selectedMeds.forEach(id => {
      const med = emergencyMedicines.find(m => m.id === id);
      if (med) addToCart({ id: med.id, name: med.name, brand: med.brand, price: med.price, priceDisplay: med.priceDisplay, type: med.type });
    });
    await sendEmails();
    setStep(3);
  };





  const generateItemsHTML = () => {
  return selectedMeds.map(id => {
    const med = emergencyMedicines.find(m => m.id === id);
    if (!med) return '';
    return `
      <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #eee;">
        <span>${med.name}</span>
        <span>₹${med.price}</span>
      </div>
    `;
  }).join('');
};

const sendEmails = async () => {
  try {
    const templateParams = {
      user_name: form.patientName,
      user_email: form.patientEmail,
      order_id: `EM-${Date.now()}`,
      total: selectedMeds.length,
      items_html: generateItemsHTML(),
    };

    await emailjs.send(
      "service_yb3clca",
      "template_q1zcqaq",
      templateParams,
      "-xTNLGloxlRg2ibDS"
    );

    await emailjs.send(
      "service_yb3clca",
      "template_9h1ixfv",
      templateParams,
      "-xTNLGloxlRg2ibDS"
    );

    console.log("Emails sent successfully");
  } catch (error) {
    console.error("Email error:", error);
  }
};






  const inputClass = `w-full px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 transition ${isDark ? 'glass border border-white/10 text-white placeholder-slate-500 focus:ring-blue-500/40' : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500/30'}`;

  // ── SUCCESS ──
  if (step === 3) {
    const urgencyInfo = urgencyLevels.find(u => u.value === form.urgency) || urgencyLevels[1];
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#080c14]' : 'bg-gray-50'}`}>
        <div className="text-center animate-fade-in-up max-w-lg mx-auto px-4">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${isDark ? 'bg-green-500/20 border-2 border-green-400/40' : 'bg-green-100 border-2 border-green-300'}`}>
            <CheckCircle size={48} className="text-green-400" />
          </div>
          <h1 className={`text-3xl font-black mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Pre-Booking Confirmed! 🚀</h1>
          <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Your emergency medicines are being prepared</p>

          <div className={`rounded-2xl border p-6 text-left mb-8 ${isDark ? 'glass border-white/8' : 'bg-white border-gray-200 shadow-md'}`}>
            <div className="space-y-3 text-sm">
              <div className={`flex justify-between ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                <span>Patient</span><span className={isDark ? 'text-white' : 'text-gray-900'}>{form.patientName}</span>
              </div>
              <div className={`flex justify-between ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                <span>Reason</span><span className={`text-right max-w-[200px] ${isDark ? 'text-white' : 'text-gray-900'}`}>{form.reason === 'Other emergency reason' ? form.customReason : form.reason}</span>
              </div>
              <div className={`flex justify-between ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                <span>Urgency</span><span className="font-bold text-orange-400">{urgencyInfo.label} · {urgencyInfo.time}</span>
              </div>
              <div className={`flex justify-between ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                <span>Medicines</span><span className={isDark ? 'text-white' : 'text-gray-900'}>{selectedMeds.length} item{selectedMeds.length !== 1 ? 's' : ''}</span>
              </div>
              <div className={`flex justify-between ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                <span>Estimated Delivery</span><span className="font-bold text-green-400">{urgencyInfo.time}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => navigate('/cart')} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-500 transition text-sm">View Cart</button>
            <button onClick={() => navigate('/')} className={`px-6 py-3 rounded-xl font-bold text-sm transition border ${isDark ? 'glass border-white/10 text-slate-300' : 'bg-gray-100 border-gray-200 text-gray-700'}`}>Back to Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#080c14] bg-dark-grid' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`border-b ${isDark ? 'bg-gradient-to-b from-orange-600/15 via-red-500/5 to-transparent border-white/5' : 'bg-gradient-to-b from-orange-50 to-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <button onClick={() => navigate(-1)} className={`flex items-center gap-2 text-sm mb-4 transition ${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${isDark ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-orange-50 border border-orange-200'}`}>
              <Clock size={26} className={isDark ? 'text-orange-400' : 'text-orange-500'} />
            </div>
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${isDark ? 'bg-orange-500/15 text-orange-300 border-orange-500/30' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>Emergency Pre-Order</span>
          </div>
          <h1 className={`text-2xl md:text-4xl font-black mt-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Pre-Book Emergency Medicines</h1>
          <p className={`text-sm mt-2 max-w-xl ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Pre-order essential medicines for emergencies. Your order will be prioritized and prepared for fast delivery.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Steps indicator */}
        <div className="flex items-center gap-4 mb-8">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= s
                ? 'bg-blue-600 text-white' : (isDark ? 'bg-white/5 text-slate-500 border border-white/10' : 'bg-gray-200 text-gray-500')}`}>{s}</div>
              <span className={`text-sm font-semibold ${step >= s ? (isDark ? 'text-white' : 'text-gray-900') : (isDark ? 'text-slate-500' : 'text-gray-400')}`}>{s === 1 ? 'Select Medicines' : 'Patient Details'}</span>
              {s === 1 && <div className={`w-12 h-0.5 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div>
            <h2 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Select Emergency Medicines</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
              {emergencyMedicines.map(med => (
                <button key={med.id} onClick={() => toggleMed(med.id)}
                  className={`p-4 rounded-2xl border text-left transition ${selectedMeds.includes(med.id)
                    ? (isDark ? 'border-blue-500/40 bg-blue-500/10 neon-blue' : 'border-blue-400 bg-blue-50 shadow-md')
                    : (isDark ? 'glass border-white/8 hover:border-white/20' : 'bg-white border-gray-200 hover:border-gray-300')
                  }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">💊</span>
                    {selectedMeds.includes(med.id) && <CheckCircle size={16} className="text-blue-400" />}
                  </div>
                  <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{med.name}</p>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>{med.brand} · {med.purpose}</p>
                  <p className={`text-sm font-black mt-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{med.priceDisplay}</p>
                </button>
              ))}
            </div>

            <button onClick={() => navigate('/search/name')}
              className={`text-sm font-semibold mb-8 transition ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}>
              + Browse more medicines →
            </button>

            {selectedMeds.length > 0 && (
              <button onClick={() => setStep(2)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white font-bold px-8 py-4 rounded-2xl hover:bg-blue-500 transition shadow-lg neon-blue text-sm">
                Continue with {selectedMeds.length} medicine{selectedMeds.length !== 1 ? 's' : ''} <ChevronRight size={16} />
              </button>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="max-w-2xl">
            <button onClick={() => setStep(1)} className={`flex items-center gap-2 text-sm mb-6 transition ${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
              <ArrowLeft size={16} /> Change medicines
            </button>

            {/* Reason */}
            <div className={`rounded-2xl border p-6 mb-6 ${isDark ? 'glass border-white/8' : 'bg-white border-gray-200 shadow-sm'}`}>
              <div className="flex items-center gap-2 mb-4">
                <FileText size={18} className={isDark ? 'text-orange-400' : 'text-orange-500'} />
                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Reason for Emergency *</h3>
              </div>
              <select value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} className={inputClass + ' mb-3'}>
                <option value="">Select reason...</option>
                {emergencyReasons.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              {form.reason === 'Other emergency reason' && (
                <textarea value={form.customReason} onChange={e => setForm({ ...form, customReason: e.target.value })} placeholder="Describe your emergency..." className={inputClass} rows={3} />
              )}
            </div>

            {/* Urgency */}
            <div className={`rounded-2xl border p-6 mb-6 ${isDark ? 'glass border-white/8' : 'bg-white border-gray-200 shadow-sm'}`}>
              <div className="flex items-center gap-2 mb-4">
                <Zap size={18} className={isDark ? 'text-yellow-400' : 'text-yellow-500'} />
                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Urgency Level *</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {urgencyLevels.map(u => (
                  <button key={u.value} onClick={() => setForm({ ...form, urgency: u.value })}
                    className={`p-4 rounded-xl border text-left transition ${form.urgency === u.value
                      ? (isDark ? `border-${u.color}-500/40 bg-${u.color}-500/10` : `border-${u.color}-400 bg-${u.color}-50`)
                      : (isDark ? 'border-white/8 hover:border-white/20' : 'border-gray-200 hover:border-gray-300')
                    }`}>
                    <p className="font-bold text-sm">{u.label}</p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>{u.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Patient Info */}
            <div className={`rounded-2xl border p-6 mb-6 ${isDark ? 'glass border-white/8' : 'bg-white border-gray-200 shadow-sm'}`}>
              <div className="flex items-center gap-2 mb-4">
                <User size={18} className={isDark ? 'text-blue-400' : 'text-blue-500'} />
                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Patient Details *</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold mb-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Patient Name</label>
                  <input value={form.patientName} onChange={e => setForm({ ...form, patientName: e.target.value })} placeholder="Full name" className={inputClass} />
                </div>
                <div>
                  <label className={`block text-xs font-bold mb-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Age</label>
                  <input value={form.patientAge} onChange={e => setForm({ ...form, patientAge: e.target.value })} placeholder="Age" className={inputClass} type="number" />
                </div>
                <div>
                  <label className={`block text-xs font-bold mb-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Phone</label>
                  <input value={form.patientPhone} onChange={e => setForm({ ...form, patientPhone: e.target.value })} placeholder="+91 XXXXX XXXXX" className={inputClass} />
                </div>


<div>
  <label className={`block text-xs font-bold mb-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
    Email
  </label>
  <input
    value={form.patientEmail}
    onChange={e => setForm({ ...form, patientEmail: e.target.value })}
    placeholder="Enter email"
    className={inputClass}
    type="email"
  />
</div>



                <div className="sm:col-span-2">
                  <label className={`block text-xs font-bold mb-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Delivery Address</label>
                  <textarea value={form.patientAddress} onChange={e => setForm({ ...form, patientAddress: e.target.value })} placeholder="Full address for delivery" className={inputClass} rows={2} />
                </div>
              </div>
            </div>

            <button onClick={handleConfirm}
              disabled={!form.reason || !form.patientName || !form.patientPhone}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition shadow-lg ${
                !form.reason || !form.patientName || !form.patientPhone
                  ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  : 'bg-orange-600 text-white hover:bg-orange-500'
              }`}>
              <Package size={18} /> Confirm Pre-Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
