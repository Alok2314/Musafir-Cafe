import { FeedbackItem } from '../types';

export const INITIAL_REVIEWS: FeedbackItem[] = [
  {
    id: 'rev-1',
    name: 'Aarav Sharma',
    email: 'aarav.s@gmail.com',
    orderId: 'MC-8210',
    rating: 5,
    message: 'The Kulhad Masala Chai paired with the Bombay Highway Toastie is pure magic. Musafir Cafe is my favorite corner in town to read and get work done. Exceptional service!',
    date: 'Yesterday',
    verified: true
  },
  {
    id: 'rev-2',
    name: 'Pooja Iyer',
    email: 'pooja.iyer@outlook.com',
    orderId: 'MC-8195',
    rating: 5,
    message: 'Being very picky about filter coffee, their traditional South Indian Filter Kaapi blown me away! Perfectly frothy and robust. The staff is warm and attentive.',
    date: '3 days ago',
    verified: true
  },
  {
    id: 'rev-3',
    name: 'Rohan Mehta',
    email: 'rohan.m@gmail.com',
    orderId: 'MC-8142',
    rating: 5,
    message: 'Ordered the Paneer Tikka Supreme Pizza and Hazelnut Cappuccino for delivery. Came piping hot in 25 mins in sturdy eco-packaging. Sourdough base was crisp and airy.',
    date: '1 week ago',
    verified: true
  },
  {
    id: 'rev-4',
    name: 'Dr. Tanya Sen',
    email: 'tanya.sen@hospital.org',
    orderId: 'MC-8089',
    rating: 5,
    message: 'The Gulab Jamun Cheesecake is heavenly! Such a brilliant Indian cafe fusion. The cozy ambiance with book corners makes you want to sit for hours.',
    date: '2 weeks ago',
    verified: true
  },
  {
    id: 'rev-5',
    name: 'Vikram Rajput',
    email: 'vikram.r@startup.in',
    orderId: 'MC-8051',
    rating: 4,
    message: 'Great spot for team meetings and solo work with fast Wi-Fi and ample plug points. The Crisp Royale Burger and Peach Iced Tea are top-notch.',
    date: '3 weeks ago',
    verified: true
  }
];

export const GALLERY_ITEMS = [
  {
    title: 'Cafe Main Lounge & Brew Bar',
    subtitle: 'Warm ambient lighting and handcrafted teak tables',
    category: 'Interior',
    image: '/src/assets/images/hero_musafir_cafe_1790988144996.jpg'
  },
  {
    title: 'Artisan Pour-Over & Latte Art',
    subtitle: 'Baristas crafting single-origin Arabica roasts',
    category: 'Coffee',
    image: '/src/assets/images/coffee_pour_latte_1790988158134.jpg'
  },
  {
    title: 'Gourmet Sourdough & Platter Kitchen',
    subtitle: 'Freshly baked breads and wood-fired crusts daily',
    category: 'Food',
    image: '/src/assets/images/fusion_food_spread_1790988169889.jpg'
  },
  {
    title: 'Reading & Co-working Corner',
    subtitle: 'Lush plants, bookshelves, and quiet cozy armchairs',
    category: 'Seating',
    image: '/src/assets/images/cafe_ambiance_gallery_1790988185503.jpg'
  },
  {
    title: 'Clay Oven & Slow Simmered Spices',
    subtitle: 'Steaming authentic Assam chai in traditional kulhad',
    category: 'Kitchen',
    image: '/src/assets/images/masala_chai_kulhad_1790988238055.jpg'
  },
  {
    title: 'Handcrafted Sweet Indulgences',
    subtitle: 'Warm Belgian dark chocolate and fusion treats',
    category: 'Desserts',
    image: '/src/assets/images/signature_dessert_1790988249113.jpg'
  }
];
