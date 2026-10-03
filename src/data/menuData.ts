import { MenuItem } from '../types';

export const MENU_ITEMS: MenuItem[] = [
  // COFFEE
  {
    id: 'c1',
    name: 'Artisan Hazelnut Cappuccino',
    category: 'Coffee',
    description: 'Double espresso shot balanced with silky steamed milk and subtle roasted hazelnut notes, topped with latte art.',
    price: 199,
    image: '/src/assets/images/coffee_pour_latte_1790988158134.jpg',
    rating: 4.9,
    reviewsCount: 142,
    ingredients: ['100% Arabica Espresso', 'Organic Milk', 'Natural Hazelnut Essence', 'Latte Foam'],
    veg: true,
    popular: true,
    prepTime: '6-8 mins',
    calories: '160 kcal'
  },
  {
    id: 'c2',
    name: 'Musafir Signature Cold Brew',
    category: 'Coffee',
    description: 'Slow-steeped for 18 hours using single-origin Chikmagalur beans. Smooth, chocolatey, low acidity.',
    price: 219,
    image: '/src/assets/images/coffee_pour_latte_1790988158134.jpg',
    rating: 4.8,
    reviewsCount: 98,
    ingredients: ['Single Origin Chikmagalur Arabica', 'Filtered Spring Water', 'Ice'],
    veg: true,
    popular: true,
    prepTime: '3-5 mins',
    calories: '15 kcal'
  },
  {
    id: 'c3',
    name: 'Traditional South Indian Filter Kaapi',
    category: 'Coffee',
    description: 'Authentic decoction brew with 80:20 plantation coffee and chicory, frothed high in brass davarah-tumbler.',
    price: 139,
    image: '/src/assets/images/coffee_pour_latte_1790988158134.jpg',
    rating: 4.9,
    reviewsCount: 210,
    ingredients: ['Peaberry Blend', 'Chicory 20%', 'Fresh Cream Milk', 'Jaggery/Sugar'],
    veg: true,
    popular: true,
    prepTime: '5-7 mins',
    calories: '140 kcal'
  },
  {
    id: 'c4',
    name: 'Caramel Crunch Frappé',
    category: 'Coffee',
    description: 'Blended icy rich espresso, decadent caramel drizzle, whipped cream rosette, and crunchy praline bits.',
    price: 249,
    image: '/src/assets/images/coffee_pour_latte_1790988158134.jpg',
    rating: 4.7,
    reviewsCount: 76,
    ingredients: ['Espresso', 'Salted Caramel', 'Full Cream Milk', 'Whipped Cream', 'Butter Praline'],
    veg: true,
    popular: false,
    prepTime: '6-8 mins',
    calories: '310 kcal'
  },

  // TEA
  {
    id: 't1',
    name: 'Musafir Special Kulhad Masala Chai',
    category: 'Tea',
    description: 'Slow-simmered Assam whole leaf tea with freshly crushed cardamom, ginger, cloves, and cinnamon in rustic terracotta.',
    price: 99,
    image: '/src/assets/images/masala_chai_kulhad_1790988238055.jpg',
    rating: 5.0,
    reviewsCount: 380,
    ingredients: ['Assam CTC Leaf', 'Fresh Ginger', 'Green Cardamom', 'Cinnamon', 'Full Cream Milk'],
    veg: true,
    popular: true,
    prepTime: '8-10 mins',
    calories: '110 kcal'
  },
  {
    id: 't2',
    name: 'Authentic Kashmiri Saffron Kahwa',
    category: 'Tea',
    description: 'Delicate green tea infused with Kashmiri saffron strands, crushed almonds, cardamom, and subtle wild honey.',
    price: 169,
    image: '/src/assets/images/masala_chai_kulhad_1790988238055.jpg',
    rating: 4.8,
    reviewsCount: 84,
    ingredients: ['Kashmiri Green Tea', 'Pure Mogra Saffron', 'Sliced Almonds', 'Green Cardamom', 'Cinnamon'],
    veg: true,
    popular: false,
    prepTime: '5-7 mins',
    calories: '65 kcal'
  },
  {
    id: 't3',
    name: 'Adrak Elaichi Kadak Chai',
    category: 'Tea',
    description: 'Bold, robust morning energizer with double-steeped ginger and aromatic pods for monsoon comfort.',
    price: 89,
    image: '/src/assets/images/masala_chai_kulhad_1790988238055.jpg',
    rating: 4.8,
    reviewsCount: 165,
    ingredients: ['Assam Leaf', 'Crushed Ginger', 'Cracked Cardamom', 'Milk', 'Brown Sugar'],
    veg: true,
    popular: false,
    prepTime: '7-9 mins',
    calories: '95 kcal'
  },

  // COLD DRINKS
  {
    id: 'cd1',
    name: 'Fresh Mint & Lime Mojito',
    category: 'Cold Drinks',
    description: 'Muddled mountain garden mint, freshly squeezed key lime, cane sugar syrup, and crisp sparkling club soda.',
    price: 159,
    image: '/src/assets/images/fusion_food_spread_1790988169889.jpg',
    rating: 4.7,
    reviewsCount: 92,
    ingredients: ['Fresh Spearmint', 'Key Lime', 'Sparkling Soda', 'Cane Sugar', 'Crushed Ice'],
    veg: true,
    popular: false,
    prepTime: '4-5 mins',
    calories: '85 kcal'
  },
  {
    id: 'cd2',
    name: 'Alphonso Mango Basil Cooler',
    category: 'Cold Drinks',
    description: 'Chilled Ratnagiri Alphonso mango puree with aromatic sweet basil seeds and a hint of black salt.',
    price: 189,
    image: '/src/assets/images/fusion_food_spread_1790988169889.jpg',
    rating: 4.9,
    reviewsCount: 114,
    ingredients: ['Alphonso Mango Pulp', 'Sabja Seeds (Sweet Basil)', 'Lemon Juice', 'Black Himalayan Salt', 'Chilled Soda'],
    veg: true,
    popular: true,
    prepTime: '5-6 mins',
    calories: '135 kcal'
  },
  {
    id: 'cd3',
    name: 'Wild Berry Peach Iced Tea',
    category: 'Cold Drinks',
    description: 'Slow-brewed Nilgiri black tea shaken with sweet peach nectar and wild mountain berry reduction over clear ice cubes.',
    price: 169,
    image: '/src/assets/images/fusion_food_spread_1790988169889.jpg',
    rating: 4.6,
    reviewsCount: 68,
    ingredients: ['Nilgiri Black Tea', 'Natural Peach Purée', 'Fresh Berries', 'Mint Sprig', 'Lemon'],
    veg: true,
    popular: false,
    prepTime: '4-5 mins',
    calories: '90 kcal'
  },

  // PIZZA
  {
    id: 'p1',
    name: 'Smoked Paneer Tikka Supreme Pizza',
    category: 'Pizza',
    description: 'Hand-tossed sourdough crust, spicy makhani sauce base, charred clay-oven paneer cubes, crisp bell peppers, and fresh mozzarella.',
    price: 349,
    image: '/src/assets/images/fusion_food_spread_1790988169889.jpg',
    rating: 4.9,
    reviewsCount: 220,
    ingredients: ['Sourdough Base', 'Clay Oven Paneer', 'San Marzano Tomato Sauce', 'Fior di Latte Mozzarella', 'Bell Peppers', 'Kasuri Methi'],
    veg: true,
    popular: true,
    prepTime: '15-18 mins',
    calories: '680 kcal'
  },
  {
    id: 'p2',
    name: 'Artisanal Margherita di Bufala',
    category: 'Pizza',
    description: 'Classic simplicity: Italian San Marzano plum tomato sauce, creamy fresh mozzarella, aromatic garden basil leaves, and cold-pressed extra virgin olive oil.',
    price: 299,
    image: '/src/assets/images/fusion_food_spread_1790988169889.jpg',
    rating: 4.8,
    reviewsCount: 156,
    ingredients: ['Wood-fired Dough', 'San Marzano Tomatoes', 'Fresh Mozzarella', 'Sweet Basil', 'EVOO'],
    veg: true,
    popular: false,
    prepTime: '12-15 mins',
    calories: '540 kcal'
  },
  {
    id: 'p3',
    name: 'Peri-Peri Roast Chicken Pizza',
    category: 'Pizza',
    description: 'Spiced shredded roast chicken, bird’s eye chili sauce, red onions, pickled jalapenos, and mozzarella on a golden bubbly crust.',
    price: 379,
    image: '/src/assets/images/fusion_food_spread_1790988169889.jpg',
    rating: 4.9,
    reviewsCount: 178,
    ingredients: ['Marinated Chicken Breast', 'Peri-Peri Glaze', 'Mozzarella', 'Red Onion', 'Pickled Jalapenos'],
    veg: false,
    popular: true,
    prepTime: '15-18 mins',
    calories: '720 kcal'
  },

  // BURGER
  {
    id: 'b1',
    name: 'The Musafir Crisp Royale Burger',
    category: 'Burger',
    description: 'Spiced herb potato & cheese crunchy patty with melted aged cheddar, house mint mayonnaise, crunchy iceberg lettuce, and sliced plum tomatoes in toasted brioche.',
    price: 229,
    image: '/src/assets/images/artisanal_burger_1790988224522.jpg',
    rating: 4.9,
    reviewsCount: 195,
    ingredients: ['Crispy Herb Potato Patty', 'Aged Cheddar Cheese', 'Mint Mayo', 'Butter Brioche Bun', 'Iceberg Lettuce', 'Pickles'],
    veg: true,
    popular: true,
    prepTime: '10-12 mins',
    calories: '490 kcal'
  },
  {
    id: 'b2',
    name: 'Tandoori Crispy Chicken Burger',
    category: 'Burger',
    description: 'Buttermilk fried chicken fillet dredged in fiery tandoori spices, topped with vinegar onion slaw, garlic aioli, and gherkins in a soft sesame bun.',
    price: 279,
    image: '/src/assets/images/artisanal_burger_1790988224522.jpg',
    rating: 4.8,
    reviewsCount: 140,
    ingredients: ['Crispy Chicken Thigh', 'Tandoori Dry Rub', 'Sirka Onion Slaw', 'Smoked Garlic Aioli', 'Brioche Bun'],
    veg: false,
    popular: true,
    prepTime: '12-14 mins',
    calories: '580 kcal'
  },
  {
    id: 'b3',
    name: 'Smoky Portobello & Cheddar Burger',
    category: 'Burger',
    description: 'Thick grilled balsamic portobello mushroom stuffed with creamy herb cheese, caramelized shallots, and peppery wild rocket.',
    price: 259,
    image: '/src/assets/images/artisanal_burger_1790988224522.jpg',
    rating: 4.7,
    reviewsCount: 88,
    ingredients: ['Portobello Mushroom', 'Caramelized Onion', 'Herb Cream Cheese', 'Wild Arugula', 'Multigrain Bun'],
    veg: true,
    popular: false,
    prepTime: '12-15 mins',
    calories: '420 kcal'
  },

  // SANDWICH
  {
    id: 's1',
    name: 'Bombay Highway Masala Toastie',
    category: 'Sandwich',
    description: 'Triple-decker grilled sourdough stuffed with spicy potato masala, crisp cucumber, beetroot, tangy mint chutney, and molten Amul cheese.',
    price: 189,
    image: '/src/assets/images/fusion_food_spread_1790988169889.jpg',
    rating: 4.9,
    reviewsCount: 230,
    ingredients: ['Country Sourdough', 'Spiced Potato Masala', 'Beetroot', 'Cucumber', 'Amul Butter & Cheese', 'Spicy Mint Chutney'],
    veg: true,
    popular: true,
    prepTime: '10-12 mins',
    calories: '410 kcal'
  },
  {
    id: 's2',
    name: 'Smoked Chicken & Pesto Panini',
    category: 'Sandwich',
    description: 'Herb-roasted chicken breast strips with freshly crushed pine-nut basil pesto, sundried tomatoes, and melted provolone in artisan ciabatta.',
    price: 249,
    image: '/src/assets/images/fusion_food_spread_1790988169889.jpg',
    rating: 4.8,
    reviewsCount: 110,
    ingredients: ['Artisan Ciabatta', 'Roast Chicken', 'Genovese Basil Pesto', 'Sundried Tomatoes', 'Provolone Cheese'],
    veg: false,
    popular: false,
    prepTime: '10-12 mins',
    calories: '460 kcal'
  },
  {
    id: 's3',
    name: 'Spinach, Corn & 3-Cheese Melt',
    category: 'Sandwich',
    description: 'Creamy sauteed garlic baby spinach, sweet American corn kernels, and a trio of mozzarella, cheddar, and gouda on sourdough toast.',
    price: 199,
    image: '/src/assets/images/fusion_food_spread_1790988169889.jpg',
    rating: 4.7,
    reviewsCount: 94,
    ingredients: ['Sourdough Slices', 'Baby Spinach', 'Sweet Corn', '3-Cheese Blend', 'Garlic Butter'],
    veg: true,
    popular: false,
    prepTime: '8-10 mins',
    calories: '390 kcal'
  },

  // SNACKS
  {
    id: 'sn1',
    name: 'Truffle & Parmesan Herb Fries',
    category: 'Snacks',
    description: 'Crispy skin-on golden potato shoestring fries tossed in aromatic white truffle oil, grated aged parmesan, and fresh rosemary sprigs with dip.',
    price: 179,
    image: '/src/assets/images/fusion_food_spread_1790988169889.jpg',
    rating: 4.8,
    reviewsCount: 135,
    ingredients: ['Idaho Potatoes', 'White Truffle Oil', 'Parmigiano-Reggiano', 'Rosemary', 'Garlic Mayo Dip'],
    veg: true,
    popular: false,
    prepTime: '8-10 mins',
    calories: '320 kcal'
  },
  {
    id: 'sn2',
    name: 'Artisan Cheesy Stuffed Garlic Bread',
    category: 'Snacks',
    description: 'Pull-apart oven-baked baguette loaded with melted garlic herb butter, bubbling mozzarella, and spicy jalapeno bits.',
    price: 199,
    image: '/src/assets/images/fusion_food_spread_1790988169889.jpg',
    rating: 4.9,
    reviewsCount: 160,
    ingredients: ['French Baguette', 'Roasted Garlic Butter', 'Mozzarella', 'Pickled Jalapenos', 'Oregano Seasoning'],
    veg: true,
    popular: true,
    prepTime: '10-12 mins',
    calories: '430 kcal'
  },

  // MAIN COURSE
  {
    id: 'm1',
    name: 'Truffle Mushroom Penne Alfredo',
    category: 'Main Course',
    description: 'Al dente penne pasta tossed in rich velvety parmesan cream sauce with sauteed cremini mushrooms, roasted garlic, and cracked black pepper.',
    price: 329,
    image: '/src/assets/images/fusion_food_spread_1790988169889.jpg',
    rating: 4.8,
    reviewsCount: 104,
    ingredients: ['Durum Wheat Penne', 'Cremini Mushrooms', 'Heavy Cream', 'Aged Parmesan', 'Roasted Garlic', 'Parsley'],
    veg: true,
    popular: false,
    prepTime: '14-16 mins',
    calories: '580 kcal'
  },
  {
    id: 'm2',
    name: 'Old Delhi Butter Chicken Rice Bowl',
    category: 'Main Course',
    description: 'Tender tandoor-charred chicken tikka simmered in creamy makhani gravy, served with fragrant jeera basmati rice, sirka onions, and mint raita.',
    price: 359,
    image: '/src/assets/images/fusion_food_spread_1790988169889.jpg',
    rating: 4.9,
    reviewsCount: 188,
    ingredients: ['Tandoori Chicken Tikka', 'Tomato Cream Makhani Gravy', 'Aged Basmati Rice', 'Pure Ghee', 'Pickled Onions'],
    veg: false,
    popular: true,
    prepTime: '15-18 mins',
    calories: '640 kcal'
  },

  // DESSERTS
  {
    id: 'd1',
    name: 'Sizzling Walnut Brownie with Vanilla Gelato',
    category: 'Desserts',
    description: 'Warm fudge walnut brownie served on a cast-iron skillet with rich Belgian dark chocolate ganache and a scoop of Madagascar vanilla bean ice cream.',
    price: 219,
    image: '/src/assets/images/signature_dessert_1790988249113.jpg',
    rating: 5.0,
    reviewsCount: 310,
    ingredients: ['Belgian Dark Chocolate 70%', 'Toasted Walnuts', 'Pure Butter', 'Vanilla Bean Gelato', 'Warm Ganache'],
    veg: true,
    popular: true,
    prepTime: '8-10 mins',
    calories: '450 kcal'
  },
  {
    id: 'd2',
    name: 'Signature Gulab Jamun Cheesecake',
    category: 'Desserts',
    description: 'Fusion indulgence featuring delicate saffron baked cheesecake centered around warm syrup-soaked miniature gulab jamuns and pistachio crumble.',
    price: 239,
    image: '/src/assets/images/signature_dessert_1790988249113.jpg',
    rating: 4.9,
    reviewsCount: 167,
    ingredients: ['Cream Cheese', 'Handcrafted Gulab Jamun', 'Graham Cracker Crust', 'Cardamom', 'Pistachio Flakes'],
    veg: true,
    popular: true,
    prepTime: '5 mins',
    calories: '380 kcal'
  },
  {
    id: 'd3',
    name: 'Belgian Dark Chocolate & Nutella Waffle',
    category: 'Desserts',
    description: 'Crispy golden Brussels-style malt waffle slathered with generous Nutella, fresh banana coins, toasted hazelnuts, and chocolate soft serve.',
    price: 229,
    image: '/src/assets/images/signature_dessert_1790988249113.jpg',
    rating: 4.8,
    reviewsCount: 122,
    ingredients: ['Crispy Malt Waffle', 'Nutella Hazelnut Spread', 'Fresh Banana', 'Toasted Hazelnuts', 'Dark Chocolate Shavings'],
    veg: true,
    popular: false,
    prepTime: '8-10 mins',
    calories: '490 kcal'
  }
];

export const CATEGORIES = [
  'All',
  'Coffee',
  'Tea',
  'Cold Drinks',
  'Pizza',
  'Burger',
  'Sandwich',
  'Snacks',
  'Main Course',
  'Desserts'
] as const;

export const FEATURED_CATEGORIES = [
  {
    name: 'Coffee',
    count: '4+ blends',
    description: 'Espresso, pour-over & cold brews',
    image: '/src/assets/images/coffee_pour_latte_1790988158134.jpg'
  },
  {
    name: 'Tea',
    count: '3+ styles',
    description: 'Kulhad masala chai & Kashmiri kahwa',
    image: '/src/assets/images/masala_chai_kulhad_1790988238055.jpg'
  },
  {
    name: 'Pizza',
    count: '3+ creations',
    description: 'Wood-fired sourdough crusts',
    image: '/src/assets/images/fusion_food_spread_1790988169889.jpg'
  },
  {
    name: 'Burger',
    count: '3+ styles',
    description: 'Brioche buns & crispy spiced patties',
    image: '/src/assets/images/artisanal_burger_1790988224522.jpg'
  },
  {
    name: 'Sandwich',
    count: '3+ varieties',
    description: 'Bombay toasties & grilled panini',
    image: '/src/assets/images/fusion_food_spread_1790988169889.jpg'
  },
  {
    name: 'Desserts',
    count: '3+ treats',
    description: 'Sizzling brownies & fusion cheesecakes',
    image: '/src/assets/images/signature_dessert_1790988249113.jpg'
  }
];
