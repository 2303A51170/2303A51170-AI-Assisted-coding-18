import React, { createContext, Component } from 'react';

export const AppContext = createContext();

const PRODUCTS = [
  // === Electronics ===
  {
    id: 1,
    name: 'Samsung Galaxy S21 5G',
    category: 'Electronics',
    type: 'Smartphone',
    colors: ['Phantom Gray', 'Phantom White', 'Phantom Violet', 'Phantom Pink'],
    price: 69999,
    originalPrice: 89999,
    rating: 4.5,
    reviews: 2341,
    image: 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s21-5g-0.jpg',
    description: '6.2" Dynamic AMOLED 2X, 64MP Triple Camera, 5G Ready, 4000mAh Battery',
  },
  {
    id: 21,
    name: 'Samsung Galaxy S24 FE 5G (Graphite, 8GB RAM, 128GB Storage)',
    category: 'Electronics',
    type: 'Smartphone',
    colors: ['Graphite', 'Mint', 'Blue', 'Gray'],
    price: 39995,
    originalPrice: 59999,
    rating: 4.4,
    reviews: 1603,
    image: 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s24-fe-1.jpg',
    description: 'Exynos Processor, AI Camera Features, 5G, 120Hz Display, Long Battery Life',
  },
  {
    id: 22,
    name: 'Samsung Galaxy S24 5G (Onyx Black, 8GB RAM, 128GB Storage)',
    category: 'Electronics',
    type: 'Smartphone',
    colors: ['Onyx Black', 'Cobalt Violet', 'Amber Yellow', 'Marble Gray'],
    price: 43499,
    originalPrice: 74999,
    rating: 4.3,
    reviews: 166,
    image: 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s24-5g-sm-s921-1.jpg',
    description: 'Snapdragon 8 Gen 3, Advanced Nightography Camera, Galaxy AI, 5G Ready',
  },
  {
    id: 23,
    name: 'OnePlus 12R 5G (Cool Blue, 8GB RAM, 128GB Storage)',
    category: 'Electronics',
    type: 'Smartphone',
    colors: ['Cool Blue', 'Iron Gray', 'Sunset Dune'],
    price: 38999,
    originalPrice: 42999,
    rating: 4.5,
    reviews: 3249,
    image: 'https://fdn2.gsmarena.com/vv/pics/oneplus/oneplus-12r-1.jpg',
    description: 'Snapdragon 8 Gen 2, 120Hz AMOLED, 100W SUPERVOOC Charging, 5G',
  },
  {
    id: 24,
    name: 'Apple iPhone 15 (Black, 128GB)',
    category: 'Electronics',
    type: 'Smartphone',
    colors: ['Black', 'Blue', 'Green', 'Yellow', 'Pink'],
    price: 65999,
    originalPrice: 79900,
    rating: 4.6,
    reviews: 2012,
    image: 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-1.jpg',
    description: 'A16 Bionic, 48MP Main Camera, Dynamic Island, Super Retina XDR Display',
  },
  {
    id: 25,
    name: 'Google Pixel 8 (Obsidian, 8GB RAM, 128GB)',
    category: 'Electronics',
    type: 'Smartphone',
    colors: ['Obsidian', 'Hazel', 'Rose'],
    price: 52999,
    originalPrice: 75999,
    rating: 4.4,
    reviews: 948,
    image: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8-1.jpg',
    description: 'Google Tensor G3, 50MP Camera, 120Hz Actua Display, 7 Years of Updates',
  },
  {
    id: 26,
    name: 'Redmi Note 13 Pro+ 5G (Fusion Black, 8GB RAM, 256GB)',
    category: 'Electronics',
    type: 'Smartphone',
    colors: ['Fusion Black', 'Fusion White', 'Fusion Purple'],
    price: 31999,
    originalPrice: 35999,
    rating: 4.3,
    reviews: 1389,
    image: 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-note-13-pro-plus-1.jpg',
    description: '200MP Camera, 120W HyperCharge, Curved AMOLED Display, MediaTek Dimensity 7200-Ultra',
  },
  {
    id: 27,
    name: 'Nothing Phone (2a) 5G (Black, 8GB RAM, 128GB)',
    category: 'Electronics',
    type: 'Smartphone',
    colors: ['Black', 'White', 'Milk'],
    price: 23999,
    originalPrice: 27999,
    rating: 4.2,
    reviews: 734,
    image: 'https://fdn2.gsmarena.com/vv/pics/nothing/nothing-phone-2a-1.jpg',
    description: 'Dimensity 7200 Pro, Glyph Interface, 120Hz AMOLED, 50MP Dual Camera',
  },
  {
    id: 2,
    name: 'HP Pavilion Gaming Laptop',
    category: 'Electronics',
    type: 'Laptop',
    colors: ['Shadow Black', 'Mica Silver', 'Acid Green'],
    price: 62999,
    originalPrice: 75000,
    rating: 4.4,
    reviews: 1876,
    image: 'https://loremflickr.com/800/800/laptop?lock=2',
    description: 'Intel Core i5 10th Gen, 8GB RAM, 1TB HDD + 256GB SSD, NVIDIA GTX 1650',
  },
  {
    id: 3,
    name: 'Sony WH-1000XM4 Headphones',
    category: 'Electronics',
    type: 'Headphones',
    colors: ['Black', 'Silver', 'Midnight Blue'],
    price: 24990,
    originalPrice: 29990,
    rating: 4.7,
    reviews: 8923,
    image: 'https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SL1200_.jpg',
    description: 'Industry Leading Wireless Noise Cancelling, 30hr Battery, Hi-Res Audio',
  },
  {
    id: 4,
    name: 'GoPro HERO9 Black',
    category: 'Electronics',
    type: 'Action Camera',
    colors: ['Black', 'Arctic White'],
    price: 36800,
    originalPrice: 44990,
    rating: 4.6,
    reviews: 3421,
    image: 'https://m.media-amazon.com/images/I/61Iyd3w+bKL._AC_AA180_.jpg',
    description: '5K Video, 20MP Photos, Waterproof, HyperSmooth 3.0 Stabilization',
  },
  {
    id: 5,
    name: 'boAt Rockerz 450 Wireless Headphone',
    category: 'Electronics',
    type: 'Wireless Headphone',
    colors: ['Luscious Black', 'Aqua Blue', 'Hazel Beige', 'Sunset Orange'],
    price: 1299,
    originalPrice: 2990,
    rating: 4.3,
    reviews: 45230,
    image: 'https://loremflickr.com/800/800/headphones?lock=5',
    description: '15hr Playback, 40mm Drivers, Foldable Design, Padded Ear Cushions',
  },
  // === Fashion ===
  {
    id: 6,
    name: "Arrow Men's Cotton Formal Shirt",
    category: 'Fashion',
    type: "Men's Clothing",
    colors: ['Sky Blue', 'White', 'Navy', 'Maroon'],
    price: 999,
    originalPrice: 1999,
    rating: 4.2,
    reviews: 1234,
    image: 'https://loremflickr.com/800/800/formal-shirt?lock=6',
    description: '100% Cotton, Regular Fit, Half Sleeve, Available in Multiple Colors',
  },
  {
    id: 7,
    name: 'Nike Air Max 270 Running Shoes',
    category: 'Fashion',
    type: 'Footwear',
    colors: ['Black/White', 'Triple White', 'Red/Black', 'Navy/Orange'],
    price: 7995,
    originalPrice: 9995,
    rating: 4.4,
    reviews: 2156,
    image: 'https://loremflickr.com/800/800/running-shoes?lock=7',
    description: 'Air Cushioning, Breathable Mesh Upper, Durable Rubber Outsole',
  },
  {
    id: 8,
    name: "Women's Floral Wrap Maxi Dress",
    category: 'Fashion',
    type: "Women's Clothing",
    colors: ['Wine Red', 'Navy Blue', 'Olive Green', 'Pink'],
    price: 1299,
    originalPrice: 2499,
    rating: 4.3,
    reviews: 876,
    image: 'https://loremflickr.com/800/800/womens-dress?lock=8',
    description: 'V-Neck, Floral Print, Knee-Length, Perfect for Casual & Party Wear',
  },
  {
    id: 9,
    name: 'Ray-Ban Aviator Classic Sunglasses',
    category: 'Fashion',
    type: 'Accessories',
    colors: ['Gold/Green', 'Silver/Blue', 'Black/G15', 'Gunmetal'],
    price: 3490,
    originalPrice: 5990,
    rating: 4.5,
    reviews: 4532,
    image: 'https://loremflickr.com/800/800/sunglasses?lock=9',
    description: 'Polarized Lens, UV400 Protection, Metal Frame, Unisex',
  },
  // === Books ===
  {
    id: 10,
    name: 'Clean Code by Robert C. Martin',
    category: 'Books',
    type: 'Programming',
    colors: ['Paperback', 'Hardcover', 'Kindle'],
    price: 599,
    originalPrice: 899,
    rating: 4.8,
    reviews: 9876,
    image: 'https://m.media-amazon.com/images/I/41xShlnTZTL._SX376_BO1,204,203,200_.jpg',
    description: 'A Handbook of Agile Software Craftsmanship - Essential for every developer',
  },
  {
    id: 11,
    name: 'Atomic Habits by James Clear',
    category: 'Books',
    type: 'Self-Help',
    colors: ['Paperback', 'Hardcover', 'Kindle'],
    price: 349,
    originalPrice: 499,
    rating: 4.9,
    reviews: 15432,
    image: 'https://m.media-amazon.com/images/I/513Y5o-DYtL._SX328_BO1,204,203,200_.jpg',
    description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones',
  },
  {
    id: 12,
    name: 'The Alchemist by Paulo Coelho',
    category: 'Books',
    type: 'Fiction',
    colors: ['Paperback', 'Hardcover', 'Kindle'],
    price: 199,
    originalPrice: 350,
    rating: 4.7,
    reviews: 23456,
    image: 'https://m.media-amazon.com/images/I/51Z0nLAfLmL._SX331_BO1,204,203,200_.jpg',
    description: 'A magical fable about following your dream — International Bestseller',
  },
  // === Home & Kitchen ===
  {
    id: 13,
    name: 'Philips Air Fryer HD9252',
    category: 'Home & Kitchen',
    type: 'Kitchen Appliance',
    colors: ['Black', 'White', 'Silver'],
    price: 8995,
    originalPrice: 12995,
    rating: 4.5,
    reviews: 4532,
    image: 'https://loremflickr.com/800/800/air-fryer?lock=13',
    description: '1400W Power, 4.1L Capacity, Rapid Air Technology, Viva Collection',
  },
  {
    id: 14,
    name: 'Prestige Iris 750W Mixer Grinder',
    category: 'Home & Kitchen',
    type: 'Mixer Grinder',
    colors: ['Red/Black', 'White/Blue', 'Steel'],
    price: 2299,
    originalPrice: 3499,
    rating: 4.4,
    reviews: 6789,
    image: 'https://loremflickr.com/800/800/mixer-grinder?lock=14',
    description: '750W Motor, 3 Stainless Steel Jars, 3 Speed Settings + Pulse Function',
  },
  {
    id: 15,
    name: 'Milton Thermosteel Flask 1L',
    category: 'Home & Kitchen',
    type: 'Bottle & Flask',
    colors: ['Steel', 'Blue', 'Green', 'Copper'],
    price: 649,
    originalPrice: 1099,
    rating: 4.6,
    reviews: 12456,
    image: 'https://loremflickr.com/800/800/steel-flask?lock=15',
    description: '24 Hour Hot & Cold, Food Grade Stainless Steel, 100% Leak Proof',
  },
  // === Sports & Outdoors ===
  {
    id: 16,
    name: 'Boldfit Yoga Mat Anti-Slip',
    category: 'Sports',
    type: 'Yoga & Fitness',
    colors: ['Purple', 'Blue', 'Green', 'Black'],
    price: 799,
    originalPrice: 1299,
    rating: 4.3,
    reviews: 3421,
    image: 'https://loremflickr.com/800/800/yoga-mat?lock=16',
    description: '6mm Thick, Anti-Slip Surface, TPE Eco-Friendly Material, With Carry Strap',
  },
  {
    id: 17,
    name: 'Cosco Badminton Racket Set',
    category: 'Sports',
    type: 'Racket Sports',
    colors: ['Red/Black', 'Blue/White', 'Yellow/Black'],
    price: 1099,
    originalPrice: 1899,
    rating: 4.4,
    reviews: 2345,
    image: 'https://loremflickr.com/800/800/badminton-racket?lock=17',
    description: '2 Rackets + 3 Shuttlecocks + Carry Bag, Beginner to Intermediate',
  },
  // === Toys & Games ===
  {
    id: 18,
    name: 'LEGO Classic Creative Bricks',
    category: 'Toys',
    type: 'Building Blocks',
    colors: ['Classic', 'Pastel', 'Neon'],
    price: 2499,
    originalPrice: 3499,
    rating: 4.7,
    reviews: 5672,
    image: 'https://loremflickr.com/800/800/lego-toy?lock=18',
    description: '790 Pieces, Multiple Colors, Stimulates Creativity, Age 4+',
  },
  {
    id: 19,
    name: 'Hot Wheels 20-Car Gift Pack',
    category: 'Toys',
    type: 'Die-Cast Vehicles',
    colors: ['Multi-color', 'Flame Edition', 'Street Racer Edition'],
    price: 899,
    originalPrice: 1299,
    rating: 4.5,
    reviews: 3241,
    image: 'https://loremflickr.com/800/800/hot-wheels?lock=19',
    description: '20 Miniature Die-Cast Vehicles, 1:64 Scale, Ages 3+',
  },
  {
    id: 20,
    name: 'Funskool Monopoly Classic Board Game',
    category: 'Toys',
    type: 'Board Games',
    colors: ['Classic', 'Deluxe', 'Travel Edition'],
    price: 699,
    originalPrice: 999,
    rating: 4.5,
    reviews: 7832,
    image: 'https://m.media-amazon.com/images/I/81qcGnwGqLL._AC_SL1500_.jpg',
    description: 'For 2-6 Players, Ages 8+, Includes Board, Cards, Tokens & Dice',
  },
  {
    id: 28,
    name: 'Daikin 1.5 Ton 5 Star Inverter Split AC',
    category: 'Home & Kitchen',
    type: 'Air Conditioner',
    colors: ['White', 'Silver', 'Grey'],
    price: 42999,
    originalPrice: 58990,
    rating: 4.4,
    reviews: 2187,
    image: 'https://loremflickr.com/800/800/air-conditioner?lock=28',
    description: 'Copper Condenser, PM 2.5 Filter, 5-in-1 Convertible, Energy Efficient Inverter AC',
  },
  {
    id: 29,
    name: 'Samsung 55-inch 4K Ultra HD Smart LED TV',
    category: 'Electronics',
    type: 'Smart TV LED',
    colors: ['Black', 'Silver', 'Space Gray'],
    price: 54999,
    originalPrice: 72990,
    rating: 4.5,
    reviews: 3421,
    image: 'https://loremflickr.com/800/800/smart-led-tv?lock=29',
    description: 'Crystal 4K Processor, HDR, Voice Assistant Support, Smart Hub Apps, Dolby Audio',
  },
  {
    id: 30,
    name: 'Parle-G Original Gluco Biscuits (Pack of 1)',
    category: 'Home & Kitchen',
    type: 'Snacks',
    colors: ['Standard Pack'],
    price: 40,
    originalPrice: 45,
    rating: 4.6,
    reviews: 321,
    image: 'https://loremflickr.com/800/800/biscuit?lock=30',
    description: 'Popular tea-time glucose biscuits. Crisp, tasty and ready-to-eat snack pack.',
  },
];

class AppProvider extends Component {
  getInitialCart() {
    try { return JSON.parse(localStorage.getItem('amz_cart')) || []; }
    catch { return []; }
  }

  getInitialOrders() {
    try { return JSON.parse(localStorage.getItem('amz_orders')) || []; }
    catch { return []; }
  }

  state = {
    cart: this.getInitialCart(),
    orders: this.getInitialOrders(),
  };

  persistCart = (cart) => {
    localStorage.setItem('amz_cart', JSON.stringify(cart));
    this.setState({ cart });
  };

  addToCart = (product, qty = 1) => {
    const selectedColor = product.selectedColor || 'Default';
    const existing = this.state.cart.find(i => i.id === product.id && (i.selectedColor || 'Default') === selectedColor);
    let newCart;
    if (existing) {
      newCart = this.state.cart.map(i =>
        i.id === product.id && (i.selectedColor || 'Default') === selectedColor ? { ...i, qty: i.qty + qty } : i
      );
    } else {
      newCart = [...this.state.cart, { ...product, selectedColor, qty }];
    }
    this.persistCart(newCart);
  };

  removeFromCart = (productId) => {
    this.persistCart(this.state.cart.filter(i => i.id !== productId));
  };

  updateQty = (productId, qty) => {
    if (qty < 1) { this.removeFromCart(productId); return; }
    this.persistCart(this.state.cart.map(i =>
      i.id === productId ? { ...i, qty } : i
    ));
  };

  clearCart = () => {
    localStorage.removeItem('amz_cart');
    this.setState({ cart: [] });
  };

  placeOrder = (address, paymentMethod) => {
    const orderId = 'AMZ' + Date.now();
    const now = new Date();
    const formatTime = (d) => d.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    const expectedDelivery = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000));
    const trackingSteps = [
      { key: 'placed', label: 'Order Placed', time: formatTime(now), completed: true },
      { key: 'packed', label: 'Packed', time: formatTime(new Date(now.getTime() + (2 * 60 * 60 * 1000))), completed: true },
      { key: 'shipped', label: 'Shipped', time: formatTime(new Date(now.getTime() + (18 * 60 * 60 * 1000))), completed: false },
      { key: 'out_for_delivery', label: 'Out for Delivery', time: formatTime(new Date(now.getTime() + (54 * 60 * 60 * 1000))), completed: false },
      { key: 'delivered', label: 'Delivered', time: formatTime(expectedDelivery), completed: false },
    ];
    const order = {
      id: orderId,
      items: [...this.state.cart],
      address,
      paymentMethod,
      total: this.state.cart.reduce((s, i) => s + i.price * i.qty, 0),
      date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }),
      status: 'Order Placed',
      expectedDelivery: expectedDelivery.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }),
      trackingSteps,
      trackingProgress: 1,
    };
    const newOrders = [order, ...this.state.orders];
    localStorage.setItem('amz_orders', JSON.stringify(newOrders));
    this.clearCart();
    this.setState({ orders: newOrders });
    return orderId;
  };

  render() {
    return (
      <AppContext.Provider value={{
        products: PRODUCTS,
        cart: this.state.cart,
        orders: this.state.orders,
        addToCart: this.addToCart,
        removeFromCart: this.removeFromCart,
        updateQty: this.updateQty,
        clearCart: this.clearCart,
        placeOrder: this.placeOrder,
      }}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export default AppProvider;
