import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Clock,
  Sparkles,
  ChevronRight,
  Package,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useInventory } from '../../context/InventoryContext';
import { searchSuggestions } from '../../lib/products';
import { storage } from '../../lib/storage';
import { formatCurrency } from '../../lib/utils';
import { CATEGORIES } from '../../data/categories';
import type { Product } from '../../types';

export function Header() {
  const { itemCount, pricing } = useCart();
  const { wishlistCount } = useWishlist();
  const { allProducts } = useInventory();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Sync recent searches from storage
  useEffect(() => {
    setRecentSearches(storage.getRecentSearches());
  }, []);

  // Update suggestions dynamically
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const results = searchSuggestions(searchQuery, allProducts, 5);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, allProducts]);

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    storage.addRecentSearch(searchQuery.trim());
    setRecentSearches(storage.getRecentSearches());
    setIsSearchOpen(false);
    navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleSelectRecent = (term: string) => {
    setSearchQuery(term);
    setIsSearchOpen(false);
    navigate(`/products?q=${encodeURIComponent(term)}`);
  };

  const handleSelectProduct = (product: Product) => {
    storage.addRecentSearch(product.name);
    setRecentSearches(storage.getRecentSearches());
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(`/products/${product.slug}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top Banner */}
      <div className="bg-emerald-800 text-white text-[11px] py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-600/60 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              Fresh Daily
            </span>
            <span>Free chilled shipping on all orders over $35 · Zero artificial preservatives</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-emerald-100">
            <Link to="/orders" className="hover:text-white transition-colors">
              Track Order
            </Link>
            <span>·</span>
            <span className="text-emerald-200">100% Organically Sourced</span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-serif font-black text-xl shadow-xs group-hover:bg-emerald-700 transition-colors">
            F
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-extrabold text-xl text-stone-900 tracking-tight leading-none">
              FreshCart
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 mt-0.5">
              Organic Pantry
            </span>
          </div>
        </Link>

        {/* Search Bar with Autocomplete Dropdown */}
        <div ref={searchContainerRef} className="flex-1 max-w-xl relative hidden md:block">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              id="header-search-input"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search organic fruits, artisan breads, farm milk, snacks..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-300 bg-stone-50/70 text-xs font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:bg-white transition-all"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Autocomplete & Recent Searches Dropdown */}
          {isSearchOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden z-50 p-2 space-y-2">
              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="space-y-1">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Product Matches
                  </div>
                  {suggestions.map((prod) => (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => handleSelectProduct(prod)}
                      className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-stone-50 transition-colors text-left group"
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-lg object-cover bg-stone-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-stone-900 group-hover:text-emerald-700 truncate">
                          {prod.name}
                        </p>
                        <p className="text-[11px] text-stone-400">
                          {prod.category} · {formatCurrency(prod.price)}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-stone-500 shrink-0" />
                    </button>
                  ))}
                </div>
              )}

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="pt-2 border-t border-stone-100">
                  <div className="flex items-center justify-between px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Recent Searches
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        storage.clearRecentSearches();
                        setRecentSearches([]);
                      }}
                      className="text-stone-400 hover:text-stone-700 normal-case"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 px-3 py-1.5">
                    {recentSearches.map((term, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectRecent(term)}
                        className="text-xs font-medium px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search All Link */}
              {searchQuery.trim() && (
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="w-full p-2.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs hover:bg-emerald-100 transition-colors text-center"
                >
                  Search all items matching "{searchQuery}" →
                </button>
              )}
            </div>
          )}
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Wishlist Icon */}
          <Link
            to="/wishlist"
            id="header-wishlist-link"
            className="p-2 rounded-xl text-stone-700 hover:bg-stone-100 relative transition-colors"
            title="Saved Wishlist"
            aria-label={`Wishlist with ${wishlistCount} items`}
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Account / Orders */}
          <Link
            to="/account"
            id="header-account-link"
            className="p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors hidden sm:flex items-center gap-1.5"
            title="Account & Orders"
          >
            <User className="w-5 h-5" />
            <span className="text-xs font-bold text-stone-700">Account</span>
          </Link>

          {/* Cart Button */}
          <Link
            to="/cart"
            id="header-cart-link"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs"
            aria-label={`Shopping Cart with ${itemCount} items`}
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-amber-400 text-stone-950 text-[10px] font-extrabold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="text-xs font-bold hidden sm:inline">
              {formatCurrency(pricing.grandTotal)}
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            id="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-stone-700 hover:bg-stone-100 md:hidden transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Navigation Subheader (Categories & Collections) */}
      <nav className="border-t border-stone-200/70 bg-stone-50/50 hidden md:block" aria-label="Main Navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs font-semibold text-stone-700 overflow-x-auto py-2.5">
          <div className="flex items-center gap-6">
            <Link
              to="/products"
              className="text-stone-900 hover:text-emerald-700 font-bold transition-colors whitespace-nowrap"
            >
              All Produce & Goods
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="hover:text-emerald-700 text-stone-600 transition-colors whitespace-nowrap"
              >
                {cat.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4 text-emerald-800 shrink-0 font-bold">
            <Link
              to="/products?discountOnly=true"
              className="flex items-center gap-1 hover:text-emerald-950 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Weekly Specials</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white p-4 space-y-4 animate-in slide-in-from-top duration-200">
          {/* Mobile Search input */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search groceries..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-300 text-xs"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          <div className="space-y-1 font-semibold text-sm">
            <Link
              to="/products"
              className="block px-3 py-2 rounded-lg text-stone-900 hover:bg-stone-50"
            >
              All Products
            </Link>
            <Link
              to="/products?discountOnly=true"
              className="block px-3 py-2 rounded-lg text-emerald-700 font-bold hover:bg-emerald-50"
            >
              Weekly Specials & Discounts
            </Link>
            <div className="pt-2 border-t border-stone-100">
              <span className="block px-3 py-1 text-[10px] font-bold uppercase text-stone-400">
                Categories
              </span>
              {CATEGORIES.map((c) => (
                <Link
                  key={c.id}
                  to={`/products?category=${c.slug}`}
                  className="block px-3 py-1.5 text-xs text-stone-600 hover:text-emerald-700"
                >
                  {c.name}
                </Link>
              ))}
            </div>
            <div className="pt-2 border-t border-stone-100">
              <Link
                to="/orders"
                className="flex items-center gap-2 px-3 py-2 text-xs text-stone-700 hover:bg-stone-50"
              >
                <Package className="w-4 h-4" /> Order History
              </Link>
              <Link
                to="/account"
                className="flex items-center gap-2 px-3 py-2 text-xs text-stone-700 hover:bg-stone-50"
              >
                <User className="w-4 h-4" /> Account Settings
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
