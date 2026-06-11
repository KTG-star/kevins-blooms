import React, { useState, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import flowersData from '../data/flowers.json';

const ITEMS_PER_PAGE = 12;

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState('Most Popular');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const categories = ['All', 'Roses', 'Tropical', 'Classic', 'Exotic', 'Seasonal', 'Succulents', 'Bouquets', 'Other'];

  const filtered = useMemo(() => {
    let result = [...flowersData];

    // Filter by category
    if (category !== 'All') {
      result = result.filter((f) => f.category === category);
    }

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (f) => f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sort === 'Price Low-High') result.sort((a, b) => a.price - b.price);
    else if (sort === 'Price High-Low') result.sort((a, b) => b.price - a.price);
    // 'Most Popular' and others keep original order

    return result;
  }, [category, search, sort]);

  const pages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Map JSON shape to what ProductCard expects (adds _id from id)
  const flowers = paginated.map((f) => ({ ...f, _id: f.id }));

  return (
    <div className="pt-32 pb-24 px-6 bg-bloom-cream dark:bg-dark-bg min-h-screen">
      <SEO
        title={`Shop ${category !== 'All' ? category : ''} Blooms`}
        description={`Browse our premium collection of ${category !== 'All' ? category : 'fresh flowers'}. Hand-crafted bouquets delivered straight to your door.`}
      />
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-bloom-green/60 dark:text-white/40 mb-12">
          <Link to="/" className="hover:text-bloom-pink transition-colors">Home</Link>
          <ChevronDown size={10} className="-rotate-90 opacity-40" />
          <span className="text-bloom-green/40 dark:text-white/20">Collection</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-cormorant text-bloom-green dark:text-white mb-4"
          >
            The Flower <span className="italic">Collection</span>
          </motion.h1>
          <p className="text-bloom-green/60 dark:text-white/60 italic">
            Find the perfect bloom for any story you want to tell.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-12 glass p-4 rounded-3xl">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setSearchParams({ category: cat });
                  setPage(1);
                }}
                className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  category === cat
                    ? 'bg-bloom-green text-white'
                    : 'bg-white/40 dark:bg-white/10 text-bloom-green dark:text-white hover:bg-white/60 dark:hover:bg-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-bloom-green/40" size={18} />
              <input
                type="text"
                placeholder="Search flowers..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/40 dark:bg-white/5 dark:text-white border-none focus:ring-2 focus:ring-bloom-green/20 placeholder:text-bloom-green/20"
              />
            </div>

            <div className="relative group">
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="appearance-none bg-white/40 dark:bg-white/5 dark:text-white border-none py-3 pl-6 pr-12 rounded-2xl text-sm font-medium text-bloom-green focus:ring-2 focus:ring-bloom-green/20"
              >
                <option>Most Popular</option>
                <option>Price Low-High</option>
                <option>Price High-Low</option>
                <option>Newest</option>
                <option>Highest Rated</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-bloom-green/40 pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${category}-${search}-${sort}-${page}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {flowers.map((flower) => (
              <ProductCard key={flower._id} flower={flower} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Pagination */}
        {pages > 1 && (
          <div className="mt-16 flex justify-center gap-4">
            {[...Array(pages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-12 h-12 rounded-full font-bold transition-all ${
                  page === i + 1
                    ? 'bg-bloom-green text-white'
                    : 'bg-white/40 dark:bg-white/10 text-bloom-green dark:text-white hover:bg-white/60 dark:hover:bg-white/20'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

        {/* Empty state */}
        {flowers.length === 0 && (
          <div className="text-center py-24">
            <p className="text-2xl font-cormorant text-bloom-green/40 italic">
              No flowers found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;