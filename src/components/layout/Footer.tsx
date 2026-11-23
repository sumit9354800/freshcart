import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ShieldCheck, Truck, RefreshCw, Mail, CheckCircle } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { useNotification } from '../../context/NotificationContext';

export function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { showToast } = useNotification();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) {
      showToast({
        type: 'error',
        title: 'Invalid Email',
        message: 'Please enter a valid email address to subscribe.',
      });
      return;
    }

    setIsSubscribed(true);
    showToast({
      type: 'success',
      title: 'Subscribed to FreshCart Organics',
      message: 'You have been enrolled in our seasonal harvest updates and coupon digests!',
    });
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      {/* Value Badges Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-stone-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800/60 text-emerald-400 flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Certified Organic</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Directly vetted partner farms practicing regenerative agriculture.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800/60 text-emerald-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Cold-Chain Delivery</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Eco-insulated chill boxes keeping produce crisp and dairy cold.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800/60 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Freshness Guarantee</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Not fully delighted? Instant local replacement without hassle.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800/60 text-emerald-400 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Zero Single-Use Plastic</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Biodegradable paper bags and returnable glass milk jars.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Links Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-serif font-black text-lg">
                F
              </div>
              <span className="font-serif font-bold text-lg text-white tracking-tight">
                FreshCart Grocery
              </span>
            </div>
            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              Curating heirloom fruits, artisanal sourdoughs, pastured dairy, and pantry staples
              sourced directly from honest family growers.
            </p>
            {/* Newsletter */}
            <div className="pt-2">
              <p className="text-xs font-bold text-stone-200 mb-2">Join our Weekly Harvest Newsletter</p>
              {isSubscribed ? (
                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>Thank you! You are subscribed to weekly offers.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-stone-800 border border-stone-700 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Join</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Categories Column */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-stone-100 mb-3">
              Shop Categories
            </h5>
            <ul className="space-y-2 text-xs text-stone-400">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/products?category=${cat.slug}`}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-stone-100 mb-3">
              Shopping Tools
            </h5>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link to="/products" className="hover:text-emerald-400 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?discountOnly=true" className="hover:text-emerald-400 transition-colors">
                  Discount Deals
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-emerald-400 transition-colors">
                  My Shopping Basket
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-emerald-400 transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-emerald-400 transition-colors">
                  Track Past Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Account & Policies */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-stone-100 mb-3">
              Account & Info
            </h5>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link to="/account" className="hover:text-emerald-400 transition-colors">
                  My Profile & Addresses
                </Link>
              </li>
              <li>
                <span className="text-stone-500">Free delivery threshold: $35.00</span>
              </li>
              <li>
                <span className="text-stone-500">Sales tax applied: 5.0%</span>
              </li>
              <li>
                <span className="text-stone-500">Standard delivery: 2-3 business days</span>
              </li>
              <li>
                <span className="text-stone-500">Local storage persistence: Active</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-stone-800 text-[11px] text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} Alfa Solution. Built with high craftsmanship and local state persistence.</p>
        <div className="flex items-center gap-4 text-stone-400">
          <span>100% Local Sandbox Simulation</span>
          <span>·</span>
          <span>No external telemetry</span>
        </div>
      </div>
    </footer>
  );
}
