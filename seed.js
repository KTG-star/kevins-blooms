require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Flower = require('./models/Flower');
const User = require('./models/User');
const ActivityLog = require('./models/ActivityLog');

const flowers = [
  // ===== ROSES =====
  {
    name: 'Red Velvet Rose',
    category: 'Roses',
    description: 'Deep red velvety petals that symbolize passionate love and timeless elegance.',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1533616688419-b7a585564566?w=600&auto=format&fit=crop',
    photoIds: ['1533616688419-b7a585564566'],
    stockQuantity: 25, lowStockThreshold: 10, unitCost: 6000, sold: 15, isAvailable: true
  },
  {
    name: 'Pink Blush Rose',
    category: 'Roses',
    description: 'Soft pink petals with a delicate fragrance, perfect for expressing admiration.',
    price: 14000,
    image: 'https://images.unsplash.com/photo-1552686789-952485ed9e94?w=600&auto=format&fit=crop',
    photoIds: ['1552686789-952485ed9e94'],
    stockQuantity: 20, lowStockThreshold: 10, unitCost: 5600, sold: 18, isAvailable: true
  },
  {
    name: 'White Ivory Rose',
    category: 'Roses',
    description: 'Elegant white roses representing purity, innocence, and spiritual charm.',
    price: 16000,
    image: 'https://images.unsplash.com/photo-1531875456634-3f541a2b4d4e?w=600&auto=format&fit=crop',
    photoIds: ['1531875456634-3f541a2b4d4e'],
    stockQuantity: 18, lowStockThreshold: 8, unitCost: 6400, sold: 12, isAvailable: true
  },
  {
    name: 'Yellow Sunshine Rose',
    category: 'Roses',
    description: 'Bright yellow blooms that radiate joy, friendship, and new beginnings.',
    price: 13000,
    image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600&auto=format&fit=crop',
    photoIds: ['1602928321679-560bb453f190'],
    stockQuantity: 22, lowStockThreshold: 10, unitCost: 5200, sold: 20, isAvailable: true
  },
  {
    name: 'Orange Flame Rose',
    category: 'Roses',
    description: 'Vibrant orange roses full of energy, passion, and creative spirit.',
    price: 14500,
    image: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=600&auto=format&fit=crop',
    photoIds: ['1596436889106-be35e843f974'],
    stockQuantity: 17, lowStockThreshold: 8, unitCost: 5800, sold: 10, isAvailable: true
  },
  {
    name: 'Classic Red Dozen',
    category: 'Roses',
    description: 'The timeless classic — a dozen perfect red roses wrapped in luxury.',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=600&auto=format&fit=crop',
    photoIds: ['1582794543139-8ac9cb0f7b11'],
    stockQuantity: 25, lowStockThreshold: 10, unitCost: 8800, sold: 25, isAvailable: true
  },

  // ===== TROPICAL =====
  {
    name: 'Bird of Paradise',
    category: 'Tropical',
    description: 'Exotic and striking flowers that resemble a bird in flight, symbolizing joy.',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1551893478-d7363716d46d?w=600&auto=format&fit=crop',
    photoIds: ['1551893478-d7363716d46d'],
    stockQuantity: 10, lowStockThreshold: 5, unitCost: 10000, sold: 8, isAvailable: true
  },
  {
    name: 'Anthurium',
    category: 'Tropical',
    description: 'Heart-shaped glossy red blooms that bring a touch of the tropics to any space.',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1603483015505-c4bf2f47a61d?w=600&auto=format&fit=crop',
    photoIds: ['1603483015505-c4bf2f47a61d'],
    stockQuantity: 12, lowStockThreshold: 5, unitCost: 8800, sold: 6, isAvailable: true
  },
  {
    name: 'Purple Orchid',
    category: 'Tropical',
    description: 'Exotic purple orchids adding luxury and mystery to any room.',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=600&auto=format&fit=crop',
    photoIds: ['1525310072745-f49212b5ac6d'],
    stockQuantity: 6, lowStockThreshold: 3, unitCost: 10000, sold: 9, isAvailable: true
  },
  {
    name: 'White Phalaenopsis Orchid',
    category: 'Tropical',
    description: 'Elegant white moth orchids representing pure love and beauty.',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1567606901814-e056d6dc2ab9?w=600&auto=format&fit=crop',
    photoIds: ['1567606901814-e056d6dc2ab9'],
    stockQuantity: 6, lowStockThreshold: 3, unitCost: 11200, sold: 5, isAvailable: true
  },

  // ===== CLASSIC =====
  {
    name: 'Pink Tulip Dream',
    category: 'Classic',
    description: 'Graceful pink tulips representing perfect love and spring happiness.',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=600&auto=format&fit=crop',
    photoIds: ['1520763185298-1b434c919102'],
    stockQuantity: 20, lowStockThreshold: 8, unitCost: 4800, sold: 14, isAvailable: true
  },
  {
    name: 'White Elegant Lily',
    category: 'Classic',
    description: 'Pure white lilies symbolizing peace and purity for formal occasions.',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1572454530994-4eb132f084c7?w=600&auto=format&fit=crop',
    photoIds: ['1572454530994-4eb132f084c7'],
    stockQuantity: 8, lowStockThreshold: 5, unitCost: 7200, sold: 11, isAvailable: true
  },
  {
    name: 'Golden Sunflower',
    category: 'Classic',
    description: 'Large radiant sunflowers symbolizing loyalty and longevity.',
    price: 10000,
    image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=600&auto=format&fit=crop',
    photoIds: ['1597848212624-a19eb35e2651'],
    stockQuantity: 20, lowStockThreshold: 10, unitCost: 4000, sold: 22, isAvailable: true
  },
  {
    name: 'Pink Peony Perfection',
    category: 'Classic',
    description: 'Lush fragrant pink peonies, a seasonal favorite for weddings.',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&auto=format&fit=crop',
    photoIds: ['1561181286-d3fee7d55364'],
    stockQuantity: 10, lowStockThreshold: 5, unitCost: 8800, sold: 16, isAvailable: true
  },
  {
    name: 'Wild Daisies',
    category: 'Classic',
    description: 'Simple sweet white daisies bringing meadow freshness to your home.',
    price: 7000,
    image: 'https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?w=600&auto=format&fit=crop',
    photoIds: ['1560717789-0ac7c58ac90a'],
    stockQuantity: 40, lowStockThreshold: 10, unitCost: 2800, sold: 19, isAvailable: true
  },
  {
    name: 'Pink Stargazer Lily',
    category: 'Classic',
    description: 'Bold and fragrant stargazer lilies with stunning pink and white blooms.',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&auto=format&fit=crop',
    photoIds: ['1614594975525-e45190c55d0b'],
    stockQuantity: 10, lowStockThreshold: 5, unitCost: 8000, sold: 13, isAvailable: true
  },

  // ===== EXOTIC =====
  {
    name: 'Protea',
    category: 'Exotic',
    description: 'Ancient and dramatic proteas symbolizing change and transformation.',
    price: 30000,
    image: 'https://images.unsplash.com/photo-1507206138804-d53ca36c84b1?w=600&auto=format&fit=crop',
    photoIds: ['1507206138804-d53ca36c84b1'],
    stockQuantity: 8, lowStockThreshold: 3, unitCost: 12000, sold: 5, isAvailable: true
  },
  {
    name: 'Ranunculus',
    category: 'Exotic',
    description: 'Delicate multi-layered petals representing radiant charm.',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1568142345564-bd4e773727bf?w=600&auto=format&fit=crop',
    photoIds: ['1568142345564-bd4e773727bf'],
    stockQuantity: 12, lowStockThreshold: 5, unitCost: 6000, sold: 7, isAvailable: true
  },
  {
    name: 'Anemone',
    category: 'Exotic',
    description: 'Striking flowers with dark centers symbolizing anticipation.',
    price: 14000,
    image: 'https://images.unsplash.com/photo-1574220468388-751280362cf5?w=600&auto=format&fit=crop',
    photoIds: ['1574220468388-751280362cf5'],
    stockQuantity: 10, lowStockThreshold: 5, unitCost: 5600, sold: 6, isAvailable: true
  },
  {
    name: 'Lisianthus',
    category: 'Exotic',
    description: 'Elegant and rose-like, lisianthus symbolize appreciation and lifelong bond.',
    price: 16000,
    image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=600&auto=format&fit=crop',
    photoIds: ['1563241527-3004b7be0ffd'],
    stockQuantity: 9, lowStockThreshold: 4, unitCost: 6400, sold: 4, isAvailable: true
  },

  // ===== SEASONAL =====
  {
    name: 'Cherry Blossom',
    category: 'Seasonal',
    description: 'Ethereal pink blooms celebrating the fleeting beauty of life.',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?w=600&auto=format&fit=crop',
    photoIds: ['1522748906645-95d8adfd52c7'],
    stockQuantity: 10, lowStockThreshold: 5, unitCost: 8000, sold: 8, isAvailable: true
  },
  {
    name: 'Blue Hydrangea',
    category: 'Seasonal',
    description: 'Stunning blue hydrangeas with voluminous petals for a dramatic display.',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1501686637492-cfa4cdbbcc52?w=600&auto=format&fit=crop',
    photoIds: ['1501686637492-cfa4cdbbcc52'],
    stockQuantity: 12, lowStockThreshold: 5, unitCost: 8000, sold: 6, isAvailable: true
  },
  {
    name: 'Lavender Fields',
    category: 'Seasonal',
    description: 'Calming aromatic lavender perfect for relaxation and peace.',
    price: 9000,
    image: 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?w=600&auto=format&fit=crop',
    photoIds: ['1528183429752-a97d0bf99b5a'],
    stockQuantity: 30, lowStockThreshold: 10, unitCost: 3600, sold: 17, isAvailable: true
  },
  {
    name: 'Winter Chrysanthemum',
    category: 'Seasonal',
    description: 'Resilient chrysanthemums that bloom beautifully in cooler weather.',
    price: 11000,
    image: 'https://images.unsplash.com/photo-1572454508935-77987bba53ee?w=600&auto=format&fit=crop',
    photoIds: ['1572454508935-77987bba53ee'],
    stockQuantity: 18, lowStockThreshold: 5, unitCost: 4400, sold: 9, isAvailable: true
  },
  {
    name: 'Wisteria',
    category: 'Seasonal',
    description: 'Cascading purple blooms symbolizing longevity and wisdom.',
    price: 24000,
    image: 'https://images.unsplash.com/photo-1541094033018-91771f28b493?w=600&auto=format&fit=crop',
    photoIds: ['1541094033018-91771f28b493'],
    stockQuantity: 8, lowStockThreshold: 4, unitCost: 9600, sold: 5, isAvailable: true
  },

  // ===== SUCCULENTS =====
  {
    name: 'Echeveria Bouquet',
    category: 'Succulents',
    description: 'A unique arrangement of rosette-shaped succulents that last for months.',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1509435033235-42a8b981b2d1?w=600&auto=format&fit=crop',
    photoIds: ['1509435033235-42a8b981b2d1'],
    stockQuantity: 15, lowStockThreshold: 5, unitCost: 4800, sold: 7, isAvailable: true
  },
  {
    name: 'Mixed Green Arrangement',
    category: 'Succulents',
    description: 'A refreshing mix of diverse succulents and air plants.',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=600&auto=format&fit=crop',
    photoIds: ['1512428813834-c702c7702b78'],
    stockQuantity: 10, lowStockThreshold: 4, unitCost: 6000, sold: 4, isAvailable: true
  },

  // ===== BOUQUETS =====
  {
    name: 'Grand Celebration Bouquet',
    category: 'Bouquets',
    description: 'Our most luxurious arrangement featuring a mix of finest seasonal blooms.',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&auto=format&fit=crop',
    photoIds: ['1561181286-d3fee7d55364'],
    stockQuantity: 5, lowStockThreshold: 3, unitCost: 18000, sold: 12, isAvailable: true
  },
  {
    name: 'Peony & Rose Crown',
    category: 'Bouquets',
    description: 'An opulent mix of peonies and garden roses in blush and cream tones.',
    price: 38000,
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&auto=format&fit=crop',
    photoIds: ['1526047932273-341f2a7631f9'],
    stockQuantity: 6, lowStockThreshold: 3, unitCost: 15200, sold: 9, isAvailable: true
  },
  {
    name: 'Spring Mixed Bouquet',
    category: 'Bouquets',
    description: 'A vibrant mix of seasonal spring flowers in pastel shades.',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=600&auto=format&fit=crop',
    photoIds: ['1591886960571-74d43a9d4166'],
    stockQuantity: 8, lowStockThreshold: 4, unitCost: 10000, sold: 11, isAvailable: true
  },

  // ===== OTHER =====
  {
    name: 'Sweet Carnations',
    category: 'Other',
    description: 'Ruffled carnations in pink and white representing admiration and love.',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1550950158-d0d960dff51b?w=600&auto=format&fit=crop',
    photoIds: ['1550950158-d0d960dff51b'],
    stockQuantity: 25, lowStockThreshold: 10, unitCost: 3400, sold: 13, isAvailable: true
  },
  {
    name: 'Forget Me Not',
    category: 'Other',
    description: 'Tiny delicate blue flowers symbolizing true love and faithful memories.',
    price: 7500,
    image: 'https://images.unsplash.com/photo-1543785734-4b6e564642f8?w=600&auto=format&fit=crop',
    photoIds: ['1543785734-4b6e564642f8'],
    stockQuantity: 30, lowStockThreshold: 10, unitCost: 3000, sold: 10, isAvailable: true
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear old records entirely so no castle duplicates exist
    await Flower.deleteMany();
    console.log('Existing old flowers removed successfully.');

    await Flower.insertMany(flowers);
    console.log(`${flowers.length} fresh flowers seeded successfully!`);

    await User.deleteMany({ role: 'admin' });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin2025', salt);
    await User.create({
      fullName: 'Kevin Admin',
      username: 'kevinAdmin',
      email: 'admin@kevinsblooms.com',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('Admin user created.');

    await ActivityLog.deleteMany();
    const adminUser = await User.findOne({ email: 'admin@kevinsblooms.com' });
    await ActivityLog.insertMany([
      {
        user: adminUser._id,
        role: 'manager',
        action: 'UPDATE_STOCK',
        targetType: 'Flower',
        details: 'Manager replenished Red Velvet Rose stock.',
        metadata: { item: 'Red Velvet Rose', qty: 50 }
      }
    ]);
    console.log('Activity logs seeded.');
    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error(`Error during seeding: ${error.message}`);
    process.exit(1);
  }
};

if (process.env.MONGO_URI) {
  seedData();
} else {
  console.log('Please provide MONGO_URI in .env to seed data.');
}