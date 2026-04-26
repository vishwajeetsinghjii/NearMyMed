import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, Package, ChevronRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount } = useCart();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const deliveryFee = items.length > 0 ? 40 : 0;
  const total = getCartTotal() + deliveryFee;

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-[#080c14]' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center animate-fade-in-up">
          <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 ${isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'}`}>
            <ShoppingCart size={40} className={isDark ? 'text-blue-400' : 'text-blue-500'} />
          </div>
          <h2 className={`text-2xl font-black mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Your Cart is Empty</h2>
          <p className={`text-sm mb-8 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Browse medicines and add them to your cart</p>
          <button onClick={() => navigate('/search/name')}
            className="bg-blue-600 text-white font-bold px-8 py-4 rounded-2xl hover:bg-blue-500 transition shadow-lg neon-blue text-sm">
            Browse Medicines
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#080c14] bg-dark-grid' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`border-b ${isDark ? 'bg-gradient-to-b from-blue-600/10 to-transparent border-white/5' : 'bg-gradient-to-b from-blue-50 to-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <button onClick={() => navigate(-1)} className={`flex items-center gap-2 text-sm mb-4 transition ${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'}`}>
              <ShoppingCart size={26} className={isDark ? 'text-blue-400' : 'text-blue-500'} />
            </div>
            <div>
              <h1 className={`text-2xl md:text-4xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>Shopping Cart</h1>
              <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{getCartCount()} item{getCartCount() !== 1 ? 's' : ''} in your cart</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div key={item.id}
                className={`flex items-center gap-4 p-5 rounded-2xl border transition ${isDark ? 'glass border-white/8 hover:bg-white/5' : 'bg-white border-gray-200 hover:shadow-md'}`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'}`}>
                  💊
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.name}</h3>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>{item.brand} · {item.type}</p>
                  <p className={`text-sm font-black mt-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{item.priceDisplay}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${isDark ? 'glass border border-white/10 text-slate-400 hover:text-white' : 'bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200'}`}>
                    <Minus size={14} />
                  </button>
                  <span className={`w-10 text-center font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${isDark ? 'glass border border-white/10 text-slate-400 hover:text-white' : 'bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200'}`}>
                    <Plus size={14} />
                  </button>
                </div>
                <div className="text-right">
                  <p className={`font-black text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>₹{item.price * item.quantity}</p>
                  <button onClick={() => removeFromCart(item.id)}
                    className="text-red-400 hover:text-red-300 transition mt-1">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            <button onClick={clearCart}
              className={`text-xs font-semibold transition ${isDark ? 'text-slate-500 hover:text-red-400' : 'text-gray-500 hover:text-red-500'}`}>
              Clear entire cart
            </button>
          </div>

          {/* Order Summary */}
          <div className={`rounded-2xl border p-6 h-fit sticky top-24 ${isDark ? 'glass border-white/8' : 'bg-white border-gray-200 shadow-md'}`}>
            <h3 className={`font-black text-lg mb-5 ${isDark ? 'text-white' : 'text-gray-900'}`}>Order Summary</h3>
            <div className="space-y-3">
              <div className={`flex justify-between text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                <span>Subtotal ({getCartCount()} items)</span>
                <span className={isDark ? 'text-slate-200' : 'text-gray-800'}>₹{getCartTotal()}</span>
              </div>
              <div className={`flex justify-between text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                <span>Delivery Fee</span>
                <span className={isDark ? 'text-slate-200' : 'text-gray-800'}>₹{deliveryFee}</span>
              </div>
              <div className={`border-t pt-3 mt-3 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                <div className="flex justify-between font-black">
                  <span className={isDark ? 'text-white' : 'text-gray-900'}>Total</span>
                  <span className={isDark ? 'text-blue-400' : 'text-blue-600'}>₹{total}</span>
                </div>
              </div>
            </div>

            <button onClick={() => navigate('/checkout')}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-4 rounded-2xl mt-6 hover:bg-blue-500 transition shadow-lg neon-blue text-sm">
              Proceed to Checkout <ChevronRight size={16} />
            </button>

            <div className={`flex items-center gap-2 mt-4 px-2 ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
              <Package size={14} />
              <span className="text-xs">Free delivery on orders above ₹500</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

