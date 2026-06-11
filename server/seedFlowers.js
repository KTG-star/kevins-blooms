const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Flower = require('./models/Flower');

dotenv.config();

const flowers = [
  {
    name: "Red Velvet Rose",
    category: "Roses",
    description: "Deep red, velvety petals that symbolize passionate love and timeless elegance.",
    price: 15000,
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop",
    photoIds: ["1518709268805-4e9042af9f23"],
    stockQuantity: 25,
    unitCost: 5000,
    lowStockThreshold: 5
  },
  {
    name: "Yellow Sunshine Rose",
    category: "Roses",
    description: "Bright yellow blooms that radiate joy, friendship, and new beginnings.",
    price: 13000,
    image: "https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=800&auto=format&fit=crop",
    photoIds: ["1548094990-c16ca90f1f0d"],
    stockQuantity: 22,
    unitCost: 4000,
    lowStockThreshold: 5
  },
  {
    name: "Pink Blush Rose",
    category: "Roses",
    description: "Soft pink petals with a delicate fragrance, perfect for expressing admiration.",
    price: 14000,
    image: "https://images.unsplash.com/photo-1496062031456-07b8f162a322?w=800&auto=format&fit=crop",
    photoIds: ["1496062031456-07b8f162a322"],
    stockQuantity: 20,
    unitCost: 4500,
    lowStockThreshold: 5
  },
  {
    name: "White Ivory Rose",
    category: "Roses",
    description: "Elegant white roses representing purity, innocence, and spiritual charm.",
    price: 16000,
    image: "https://images.unsplash.com/photo-1559563362-c667ba5f5480?w=800&auto=format&fit=crop",
    photoIds: ["1559563362-c667ba5f5480"],
    stockQuantity: 18,
    unitCost: 5000,
    lowStockThreshold: 5
  },
  {
    name: "Lavender Rose",
    category: "Roses",
    description: "Enchanting lavender blooms that signify enchantment and love at first sight.",
    price: 17000,
    image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop",
    photoIds: ["1561181286-d3fee7d55364"],
    stockQuantity: 15,
    unitCost: 5500,
    lowStockThreshold: 5
  },
  {
    name: "Orange Flame Rose",
    category: "Roses",
    description: "Vibrant orange roses full of energy, passion, and creative spirit.",
    price: 14500,
    image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=800&auto=format&fit=crop",
    photoIds: ["1582794543139-8ac9cb0f7b11"],
    stockQuantity: 17,
    unitCost: 4500,
    lowStockThreshold: 5
  },
  {
    name: "Bird of Paradise",
    category: "Tropical",
    description: "Exotic and striking, these flowers resemble a bird in flight, symbolizing joy and paradise.",
    price: 25000,
    image: "https://images.unsplash.com/photo-1622325996614-72750e334a19?w=800&auto=format&fit=crop",
    photoIds: ["1622325996614-72750e334a19"],
    stockQuantity: 12,
    unitCost: 8000,
    lowStockThreshold: 3
  },
  {
    name: "Anthurium",
    category: "Tropical",
    description: "Heart-shaped, glossy red blooms that bring a touch of the tropics to any space.",
    price: 22000,
    image: "https://images.unsplash.com/photo-1603507641040-5a3d76b107e3?w=800&auto=format&fit=crop",
    photoIds: ["1603507641040-5a3d76b107e3"],
    stockQuantity: 15,
    unitCost: 7000,
    lowStockThreshold: 3
  },
  {
    name: "Heliconia",
    category: "Tropical",
    description: "Stunning architectural flowers with vibrant colors, representing great beauty.",
    price: 28000,
    image: "https://images.unsplash.com/photo-1506456041131-72f5bc3901b0?w=800&auto=format&fit=crop",
    photoIds: ["1506456041131-72f5bc3901b0"],
    stockQuantity: 10,
    unitCost: 9000,
    lowStockThreshold: 3
  },
  {
    name: "Tulips",
    category: "Classic",
    description: "Graceful and colorful, tulips are the heralds of spring and symbols of perfect love.",
    price: 12000,
    image: "https://images.unsplash.com/photo-1490750967868-88df5691cc5e?w=800&auto=format&fit=crop",
    photoIds: ["1490750967868-88df5691cc5e"],
    stockQuantity: 30,
    unitCost: 3500,
    lowStockThreshold: 5
  },
  {
    name: "Peonies",
    category: "Classic",
    description: "Lush, rounded blooms with many petals, symbolizing prosperity and good fortune.",
    price: 22000,
    image: "https://images.unsplash.com/photo-1487530811015-780bab8b3621?w=800&auto=format&fit=crop",
    photoIds: ["1487530811015-780bab8b3621"],
    stockQuantity: 14,
    unitCost: 7000,
    lowStockThreshold: 3
  },
  {
    name: "Lilies",
    category: "Classic",
    description: "Elegant and fragrant, lilies represent majesty, purity, and refined beauty.",
    price: 18000,
    image: "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&auto=format&fit=crop",
    photoIds: ["1508193638397-1c4234db14d8"],
    stockQuantity: 18,
    unitCost: 5500,
    lowStockThreshold: 5
  },
  {
    name: "Sunflowers",
    category: "Classic",
    description: "Radiant yellow flowers that follow the sun, symbolizing loyalty and adoration.",
    price: 10000,
    image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800&auto=format&fit=crop",
    photoIds: ["1597848212624-a19eb35e2651"],
    stockQuantity: 25,
    unitCost: 3000,
    lowStockThreshold: 5
  },
  {
    name: "Daisies",
    category: "Classic",
    description: "Simple and sweet, daisies represent innocence, loyal love, and purity.",
    price: 8000,
    image: "https://images.unsplash.com/photo-1502977249166-824b3a8a4d6d?w=800&auto=format&fit=crop",
    photoIds: ["1502977249166-824b3a8a4d6d"],
    stockQuantity: 40,
    unitCost: 2500,
    lowStockThreshold: 8
  },
  {
    name: "Protea",
    category: "Exotic",
    description: "Ancient and dramatic, proteas symbolize change, transformation, and daring.",
    price: 30000,
    image: "https://images.unsplash.com/photo-1511208687438-2c5a5abb810c?w=800&auto=format&fit=crop",
    photoIds: ["1511208687438-2c5a5abb810c"],
    stockQuantity: 8,
    unitCost: 10000,
    lowStockThreshold: 3
  },
  {
    name: "Ranunculus",
    category: "Exotic",
    description: "Delicate, multi-layered petals that look like tissue paper, representing radiant charm.",
    price: 15000,
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop",
    photoIds: ["1518709268805-4e9042af9f23"],
    stockQuantity: 15,
    unitCost: 5000,
    lowStockThreshold: 3
  },
  {
    name: "Anemone",
    category: "Exotic",
    description: "Striking flowers with dark centers, symbolizing anticipation and protection against evil.",
    price: 14000,
    image: "https://images.unsplash.com/photo-1544833058-e70f9ca25c17?w=800&auto=format&fit=crop",
    photoIds: ["1544833058-e70f9ca25c17"],
    stockQuantity: 12,
    unitCost: 4500,
    lowStockThreshold: 3
  },
  {
    name: "Lisianthus",
    category: "Exotic",
    description: "Elegant and rose-like, lisianthus symbolize appreciation and a lifelong bond.",
    price: 16000,
    image: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=800&auto=format&fit=crop",
    photoIds: ["1562690868-60bbe7293e94"],
    stockQuantity: 14,
    unitCost: 5000,
    lowStockThreshold: 3
  },
  {
    name: "Cherry Blossom",
    category: "Seasonal",
    description: "Ethereal pink blooms that celebrate the fleeting beauty of life and new beginnings.",
    price: 20000,
    image: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&auto=format&fit=crop",
    photoIds: ["1522383225653-ed111181a951"],
    stockQuantity: 20,
    unitCost: 6500,
    lowStockThreshold: 5
  },
  {
    name: "Hydrangea",
    category: "Seasonal",
    description: "Lush clusters of flowers representing heartfelt emotion and gratitude.",
    price: 18000,
    image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop",
    photoIds: ["1561181286-d3fee7d55364"],
    stockQuantity: 16,
    unitCost: 6000,
    lowStockThreshold: 5
  },
  {
    name: "Wisteria",
    category: "Seasonal",
    description: "Cascading purple blooms symbolizing longevity, wisdom, and creative spirit.",
    price: 24000,
    image: "https://images.unsplash.com/photo-1542385151-efd9000785a0?w=800&auto=format&fit=crop",
    photoIds: ["1542385151-efd9000785a0"],
    stockQuantity: 10,
    unitCost: 8000,
    lowStockThreshold: 3
  },
  {
    name: "Echeveria Bouquet",
    category: "Succulents",
    description: "A unique arrangement of rosette-shaped succulents that last for months.",
    price: 12000,
    image: "https://images.unsplash.com/photo-1520302630591-df1c64ecb1c2?w=800&auto=format&fit=crop",
    photoIds: ["1520302630591-df1c64ecb1c2"],
    stockQuantity: 15,
    unitCost: 4000,
    lowStockThreshold: 3
  },
  {
    name: "Mixed Green Arrangement",
    category: "Succulents",
    description: "A refreshing mix of diverse succulents and air plants in a decorative base.",
    price: 15000,
    image: "https://images.unsplash.com/photo-1446071103084-c257b5f70672?w=800&auto=format&fit=crop",
    photoIds: ["1446071103084-c257b5f70672"],
    stockQuantity: 12,
    unitCost: 5000,
    lowStockThreshold: 3
  }
];

const seedFlowers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected...');

    await Flower.insertMany(flowers);
    console.log(`✅ ${flowers.length} flowers seeded successfully!`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedFlowers();