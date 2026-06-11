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
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop',
    photoIds: ['1518709268805-4e9042af9f23'],
    stockQuantity: 25, lowStockThreshold: 10, unitCost: 6000, sold: 5, isAvailable: true
  },
  {
    name: 'Yellow Sunshine Rose',
    category: 'Roses',
    description: 'Bright yellow blooms that radiate joy, friendship, and new beginnings.',
    price: 13000,
    image: 'https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=600&auto=format&fit=crop',
    photoIds: ['1548094990-c16ca90f1f0d'],
    stockQuantity: 22, lowStockThreshold: 10, unitCost: 5200, sold: 3, isAvailable: true
  },
  {
    name: 'Pink Blush Rose',
    category: 'Roses',
    description: 'Soft pink petals with a delicate fragrance, perfect for expressing admiration.',
    price: 14000,
    image: 'https://images.unsplash.com/photo-1496062031456-07b8f162a322?w=600&auto=format&fit=crop',
    photoIds: ['1496062031456-07b8f162a322'],
    stockQuantity: 20, lowStockThreshold: 10, unitCost: 5600, sold: 8, isAvailable: true
  },
  {
    name: 'White Ivory Rose',
    category: 'Roses',
    description: 'Elegant white roses representing purity, innocence, and spiritual charm.',
    price: 16000,
    image: 'https://images.unsplash.com/photo-1559563362-c667ba5f5480?w=600&auto=format&fit=crop',
    photoIds: ['1559563362-c667ba5f5480'],
    stockQuantity: 18, lowStockThreshold: 8, unitCost: 6400, sold: 4, isAvailable: true
  },
  {
    name: 'Lavender Rose',
    category: 'Roses',
    description: 'Enchanting lavender blooms that signify love at first sight.',
    price: 17000,
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&auto=format&fit=crop',
    photoIds: ['1561181286-d3fee7d55364'],
    stockQuantity: 15, lowStockThreshold: 8, unitCost: 6800, sold: 6, isAvailable: true
  },
  {
    name: 'Orange Flame Rose',
    category: 'Roses',
    description: 'Vibrant orange roses full of energy, passion, and creative spirit.',
    price: 14500,
    image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=600&auto=format&fit=crop',
    photoIds: ['1582794543139-8ac9cb0f7b11'],
    stockQuantity: 17, lowStockThreshold: 8, unitCost: 5800, sold: 2, isAvailable: true
  },
  {
    name: 'Cream Rose Bouquet',
    category: 'Roses',
    description: 'Elegant cream roses, a timeless classic for weddings and celebrations.',
    price: 17000,
    image: 'https://images.unsplash.com/photo-1471086569966-db3eebc25a59?w=600&auto=format&fit=crop',
    photoIds: ['1471086569966-db3eebc25a59'],
    stockQuantity: 12, lowStockThreshold: 5, unitCost: 6800, sold: 3, isAvailable: true
  },
  {
    name: 'Classic Red Dozen',
    category: 'Roses',
    description: 'The timeless classic — a dozen perfect red roses wrapped in luxury.',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&auto=format&fit=crop',
    photoIds: ['1459411552884-841db9b3cc2a'],
    stockQuantity: 25, lowStockThreshold: 10, unitCost: 8800, sold: 10, isAvailable: true
  },

  // ===== TROPICAL =====
  {
    name: 'Bird of Paradise',
    category: 'Tropical',
    description: 'Exotic and striking flowers that resemble a bird in flight, symbolizing joy.',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1501746868-3f3e1a49c6d9?w=600&auto=format&fit=crop',
    photoIds: ['1501746868-3f3e1a49c6d9'],
    stockQuantity: 10, lowStockThreshold: 5, unitCost: 10000, sold: 3, isAvailable: true
  },
  {
    name: 'Anthurium',
    category: 'Tropical',
    description: 'Heart-shaped glossy red blooms that bring a touch of the tropics to any space.',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1566694271453-390536dd1f0d?w=600&auto=format&fit=crop',
    photoIds: ['1566694271453-390536dd1f0d'],
    stockQuantity: 12, lowStockThreshold: 5, unitCost: 8800, sold: 4, isAvailable: true
  },
  {
    name: 'Heliconia',
    category: 'Tropical',
    description: 'Stunning architectural flowers with vibrant colors representing great beauty.',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=600&auto=format&fit=crop',
    photoIds: ['1597848212624-a19eb35e2651'],
    stockQuantity: 8, lowStockThreshold: 4, unitCost: 11200, sold: 2, isAvailable: true
  },
  {
    name: 'Purple Orchid',
    category: 'Tropical',
    description: 'Exotic purple orchids adding luxury and mystery to any room.',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1486848521211-189f76f44c4b?w=600&auto=format&fit=crop',
    photoIds: ['1486848521211-189f76f44c4b'],
    stockQuantity: 6, lowStockThreshold: 3, unitCost: 10000, sold: 2, isAvailable: true
  },

  // ===== CLASSIC =====
  {
    name: 'Pink Tulip Dream',
    category: 'Classic',
    description: 'Graceful pink tulips representing perfect love and spring happiness.',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1490750967868-88df5691cc5e?w=600&auto=format&fit=crop',
    photoIds: ['1490750967868-88df5691cc5e'],
    stockQuantity: 20, lowStockThreshold: 8, unitCost: 4800, sold: 7, isAvailable: true
  },
  {
    name: 'White Elegant Lily',
    category: 'Classic',
    description: 'Pure white lilies symbolizing peace and purity for formal occasions.',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=600&auto=format&fit=crop',
    photoIds: ['1508193638397-1c4234db14d8'],
    stockQuantity: 8, lowStockThreshold: 5, unitCost: 7200, sold: 3, isAvailable: true
  },
  {
    name: 'Golden Sunflower',
    category: 'Classic',
    description: 'Large radiant sunflowers symbolizing loyalty and longevity.',
    price: 10000,
    image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=600&auto=format&fit=crop',
    photoIds: ['1597848212624-a19eb35e2651'],
    stockQuantity: 20, lowStockThreshold: 10, unitCost: 4000, sold: 8, isAvailable: true
  },
  {
    name: 'Pink Peony Perfection',
    category: 'Classic',
    description: 'Lush fragrant pink peonies, a seasonal favorite for weddings.',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1487530811015-780bab8b3621?w=600&auto=format&fit=crop',
    photoIds: ['1487530811015-780bab8b3621'],
    stockQuantity: 10, lowStockThreshold: 5, unitCost: 8800, sold: 3, isAvailable: true
  },
  {
    name: 'Wild Daisies',
    category: 'Classic',
    description: 'Simple sweet white daisies bringing meadow freshness to your home.',
    price: 7000,
    image: 'https://images.unsplash.com/photo-1502977249166-824b3a8a4d6d?w=600&auto=format&fit=crop',
    photoIds: ['1502977249166-824b3a8a4d6d'],
    stockQuantity: 40, lowStockThreshold: 10, unitCost: 2800, sold: 15, isAvailable: true
  },
  {
    name: 'Pink Stargazer Lily',
    category: 'Classic',
    description: 'Bold and fragrant stargazer lilies with stunning pink and white blooms.',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1507290439931-a861b5a38200?w=600&auto=format&fit=crop',
    photoIds: ['1507290439931-a861b5a38200'],
    stockQuantity: 10, lowStockThreshold: 5, unitCost: 8000, sold: 5, isAvailable: true
  },

  // ===== EXOTIC =====
  {
    name: 'Protea',
    category: 'Exotic',
    description: 'Ancient and dramatic proteas symbolizing change and transformation.',
    price: 30000,
    image: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=600&auto=format&fit=crop',
    photoIds: ['1455659817273-f96807779a8a'],
    stockQuantity: 8, lowStockThreshold: 3, unitCost: 12000, sold: 2, isAvailable: true
  },
  {
    name: 'Ranunculus',
    category: 'Exotic',
    description: 'Delicate multi-layered petals that look like tissue paper, representing radiant charm.',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1519163219899-21d2bb723b3e?w=600&auto=format&fit=crop',
    photoIds: ['1519163219899-21d2bb723b3e'],
    stockQuantity: 12, lowStockThreshold: 5, unitCost: 6000, sold: 4, isAvailable: true
  },
  {
    name: 'Anemone',
    category: 'Exotic',
    description: 'Striking flowers with dark centers symbolizing anticipation and protection.',
    price: 14000,
    image: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?w=600&auto=format&fit=crop',
    photoIds: ['1527061011665-3652c757a4d4'],
    stockQuantity: 10, lowStockThreshold: 5, unitCost: 5600, sold: 3, isAvailable: true
  },
  {
    name: 'Lisianthus',
    category: 'Exotic',
    description: 'Elegant and rose-like, lisianthus symbolize appreciation and lifelong bond.',
    price: 16000,
    image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=600&auto=format&fit=crop',
    photoIds: ['1508610048659-a06b669e3321'],
    stockQuantity: 9, lowStockThreshold: 4, unitCost: 6400, sold: 2, isAvailable: true
  },

  // ===== SEASONAL =====
  {
    name: 'Cherry Blossom',
    category: 'Seasonal',
    description: 'Ethereal pink blooms celebrating the fleeting beauty of life and new beginnings.',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1465189684280-6a8fa9b19a7a?w=600&auto=format&fit=crop',
    photoIds: ['1465189684280-6a8fa9b19a7a'],
    stockQuantity: 10, lowStockThreshold: 5, unitCost: 8000, sold: 4, isAvailable: true
  },
  {
    name: 'Blue Hydrangea',
    category: 'Seasonal',
    description: 'Stunning blue hydrangeas with voluminous petals for a dramatic display.',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&auto=format&fit=crop',
    photoIds: ['1561181286-d3fee7d55364'],
    stockQuantity: 12, lowStockThreshold: 5, unitCost: 8000, sold: 4, isAvailable: true
  },
  {
    name: 'Lavender Fields',
    category: 'Seasonal',
    description: 'Calming aromatic lavender perfect for relaxation and peace.',
    price: 9000,
    image: 'https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=600&auto=format&fit=crop',
    photoIds: ['1468327768560-75b778cbb551'],
    stockQuantity: 30, lowStockThreshold: 10, unitCost: 3600, sold: 12, isAvailable: true
  },
  {
    name: 'Winter Chrysanthemum',
    category: 'Seasonal',
    description: 'Resilient chrysanthemums that bloom beautifully in cooler weather.',
    price: 11000,
    image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=600&auto=format&fit=crop',
    photoIds: ['1508610048659-a06b669e3321'],
    stockQuantity: 18, lowStockThreshold: 5, unitCost: 4400, sold: 7, isAvailable: true
  },
  {
    name: 'Wisteria',
    category: 'Seasonal',
    description: 'Cascading purple blooms symbolizing longevity, wisdom, and creative spirit.',
    price: 24000,
    image: 'https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=600&auto=format&fit=crop',
    photoIds: ['1548094990-c16ca90f1f0d'],
    stockQuantity: 8, lowStockThreshold: 4, unitCost: 9600, sold: 2, isAvailable: true
  },

  // ===== SUCCULENTS =====
  {
    name: 'Echeveria Bouquet',
    category: 'Succulents',
    description: 'A unique arrangement of rosette-shaped succulents that last for months.',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1502977249166-824b3a8a4d6d?w=600&auto=format&fit=crop',
    photoIds: ['1502977249166-824b3a8a4d6d'],
    stockQuantity: 15, lowStockThreshold: 5, unitCost: 4800, sold: 3, isAvailable: true
  },
  {
    name: 'Mixed Green Arrangement',
    category: 'Succulents',
    description: 'A refreshing mix of diverse succulents and air plants in a decorative base.',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=600&auto=format&fit=crop',
    photoIds: ['1591886960571-74d43a9d4166'],
    stockQuantity: 10, lowStockThreshold: 4, unitCost: 6000, sold: 2, isAvailable: true
  },

  // ===== BOUQUETS =====
  {
    name: 'Grand Celebration Bouquet',
    category: 'Bouquets',
    description: 'Our most luxurious arrangement featuring a mix of finest seasonal blooms.',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=600&auto=format&fit=crop',
    photoIds: ['1591886960571-74d43a9d4166'],
    stockQuantity: 5, lowStockThreshold: 3, unitCost: 18000, sold: 2, isAvailable: true
  },
  {
    name: 'Peony & Rose Crown',
    category: 'Bouquets',
    description: 'An opulent mix of peonies and garden roses in blush and cream tones.',
    price: 38000,
    image: 'https://images.unsplash.com/photo-1519163219899-21d2bb723b3e?w=600&auto=format&fit=crop',
    photoIds: ['1519163219899-21d2bb723b3e'],
    stockQuantity: 6, lowStockThreshold: 3, unitCost: 15200, sold: 1, isAvailable: true
  },
  {
    name: 'Spring Mixed Bouquet',
    category: 'Bouquets',
    description: 'A vibrant mix of seasonal spring flowers in pastel shades.',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1487530811015-780bab8b3621?w=600&auto=format&fit=crop',
    photoIds: ['1487530811015-780bab8b3621'],
    stockQuantity: 8, lowStockThreshold: 4, unitCost: 10000, sold: 3, isAvailable: true
  },

  // ===== OTHER =====
  {
    name: 'Sweet Carnations',
    category: 'Other',
    description: 'Ruffled carnations in pink and white representing admiration and love.',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=600&auto=format&fit=crop',
    photoIds: ['1455659817273-f96807779a8a'],
    stockQuantity: 25, lowStockThreshold: 10, unitCost: 3400, sold: 9, isAvailable: true
  },
  {
    name: 'Forget Me Not',
    category: 'Other',
    description: 'Tiny delicate blue flowers symbolizing true love and faithful memories.',
    price: 7500,
    image: 'https://images.unsplash.com/photo-1465189684280-6a8fa9b19a7a?w=600&auto=format&fit=crop',
    photoIds: ['1465189684280-6a8fa9b19a7a'],
    stockQuantity: 30, lowStockThreshold: 10, unitCost: 3000, sold: 11, isAvailable: true
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    await Flower.deleteMany();
    console.log('Existing flowers removed.');

    await Flower.insertMany(flowers);
    console.log(`${flowers.length} flowers seeded successfully!`);

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
    console.log('Admin user created: admin@kevinsblooms.com / Admin2025');

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
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.env.MONGO_URI) {
  seedData();
} else {
  console.log('Please provide MONGO_URI in .env to seed data.');
}