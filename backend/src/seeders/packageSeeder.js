import db from '../models/index.js';

const { PackageEvent } = db;

const seedPackages = async () => {
  try {
    console.log('--- Syncing Database ---');
    await db.sequelize.sync();
    
    console.log('--- Seeding Packages ---');

    await PackageEvent.destroy({ where: {} });

    // --- 1. TICKET CATEGORY ---
    const ticketData = [
      { 
        name: 'Tiket Masuk (Weekday)', 
        price: 35000, 
        mimountShare: 5000,
        day: 'weekday', 
        desc: 'Tiket masuk area camping mandiri (bawa tenda sendiri).',
        features: [
          { text: 'Akses area camping harian', icon: 'check' },
          { text: 'Toilet & Mushola', icon: 'check' },
          { text: 'Parkir kendaraan', icon: 'check' }
        ]
      },
      { 
        name: 'Tiket Masuk (Weekend)', 
        price: 45000, 
        mimountShare: 5000,
        day: 'weekend', 
        desc: 'Tiket masuk area camping mandiri (bawa tenda sendiri).', 
        featured: true,
        badge: 'Favorit',
        features: [
          { text: 'Akses area camping harian', icon: 'check' },
          { text: 'Toilet & Mushola', icon: 'check' },
          { text: 'Keamanan 24 jam', icon: 'check' }
        ]
      },
    ];

    for (const t of ticketData) {
      await PackageEvent.create({
        name: t.name,
        description: t.desc,
        category: 'ticket',
        pricePerPax: t.price,
        mimountShare: t.mimountShare,
        minPax: 1,
        maxPax: 500,
        areaType: 'General Area',
        dayType: t.day,
        packageType: 'ekonomi',
        isActive: true,
        isFeatured: t.featured || false,
        badgeText: t.badge || '',
        features: t.features,
        imageUrl: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=2070&auto=format&fit=crop'
      });
    }

    // --- 2. COMMUNITY / GATHERING CATEGORY ---
    const commData = [
      { 
        name: 'Paket Ekonomis Gathering', 
        price: 175000, 
        mimountShare: 75000,
        desc: 'Minimal 25 pax. Solusi hemat untuk gathering komunitas Anda.',
        features: [
          { text: 'Lahan area camping', icon: 'check' },
          { text: 'Tenda dome (kap. ±5 orang)', icon: 'check' },
          { text: 'Matras & Lampu Tenda', icon: 'check' },
          { text: 'Makan 3x (Box)', icon: 'restaurant' },
          { text: 'Coffee break 1x', icon: 'coffee' },
          { text: 'Api unggun besar', icon: 'bolt' }
        ]
      },
      { 
        name: 'Paket Plus Gathering', 
        price: 250000, 
        mimountShare: 100000,
        desc: 'Minimal 25 pax. Paket paling populer dengan fasilitas tempat tidur lebih nyaman.', 
        featured: true, 
        badge: 'Populer',
        features: [
          { text: 'Semua fasilitas Ekonomis', icon: 'check' },
          { text: 'Kasur busa fullset', icon: 'add', highlight: true },
          { text: 'Kabel roll per tenda', icon: 'bolt', highlight: true },
          { text: 'Coffee break 2x', icon: 'add', highlight: true }
        ]
      },
      { 
        name: 'Paket Full Gathering', 
        price: 375000, 
        mimountShare: 150000,
        desc: 'Minimal 25 pax. Paket premium dengan layanan buffet dan kambing guling.',
        badge: 'Eksklusif',
        features: [
          { text: 'Semua fasilitas Plus', icon: 'check' },
          { text: 'Makan Buffet (Prasmanan)', icon: 'restaurant', highlight: true },
          { text: 'Kambing Guling (±50 porsi)', icon: 'restaurant', highlight: true },
          { text: 'Live Music / Sound System', icon: 'bolt', highlight: true }
        ]
      }
    ];

    for (const c of commData) {
      await PackageEvent.create({
        name: c.name,
        description: c.desc,
        category: 'community',
        pricePerPax: c.price,
        mimountShare: c.mimountShare,
        minPax: 25,
        maxPax: 200,
        areaType: 'Exclusive Area',
        dayType: 'weekend',
        packageType: 'full',
        isActive: true,
        isFeatured: c.featured || false,
        badgeText: c.badge || '',
        features: c.features,
        imageUrl: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=2026&auto=format&fit=crop'
      });
    }

    // --- 3. AREA & CAMPING CATEGORY ---
    const areaData = [
      { name: 'Area A (Top View) - Weekday Full', price: 450000, mimountShare: 50000, day: 'weekday', type: 'full', area: 'Area A', featured: true, badge: 'View Utama', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByi39NW8bA4KGVMjTY_7OxauQyemH3TTz0gIeoHBUpVoN2-rg0T6CsSBdY7gr85eHbBdOixpwyZ6sxLtWdkfGuWMYcyuSm8YDOF-HNIurWMWezybYHGYeot1qHUPocPQ8TFNS4qjkTA63E2uVH9oZbUeOcDmxDo7XxnLNAW3_8ypQZtFzd8bo3Aa_0aOemdT2kjatDdyG5qt5iQFFAG2tQVthXDiAndPix9JsTb8k_vJnEg1vIhLtSHf1J3s5uHcBUUaNLIn7qXdlY' },
      { name: 'Area A (Top View) - Weekend Full', price: 600000, mimountShare: 50000, day: 'weekend', type: 'full', area: 'Area A', featured: true, badge: 'View Utama', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByi39NW8bA4KGVMjTY_7OxauQyemH3TTz0gIeoHBUpVoN2-rg0T6CsSBdY7gr85eHbBdOixpwyZ6sxLtWdkfGuWMYcyuSm8YDOF-HNIurWMWezybYHGYeot1qHUPocPQ8TFNS4qjkTA63E2uVH9oZbUeOcDmxDo7XxnLNAW3_8ypQZtFzd8bo3Aa_0aOemdT2kjatDdyG5qt5iQFFAG2tQVthXDiAndPix9JsTb8k_vJnEg1vIhLtSHf1J3s5uHcBUUaNLIn7qXdlY' },
      { name: 'Area B & C (Reguler) - Weekday Full', price: 400000, mimountShare: 50000, day: 'weekday', type: 'full', area: 'Area B & C', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5DgB5LUFdpWZ9s5izPcpkK9scsF9lYDqOeRHSmPo7Kr0IZ8lRnKp6Z7iyQ2PIPmQ4L8vKXS9rWPIULADEIyRbuZdD1KrkA8Xdap4ieUhZPUh76j8-9zBLXp_YgDXGXl9okBzyUSLYLkNVOqCuBDmi6hSyfav-t-ZtLL3htzp6bfQltYoQ5BiQUR2xdgTtAD4-2_m2ELIYWYnQWaNXzamOT7W0tPer3LfpgWBDzyBk4JWrAcdD-zTuwOTQwiUk71cJs4aCh68fykXN' },
    ];

    for (const a of areaData) {
      await PackageEvent.create({
        name: a.name,
        description: `Nikmati sensasi camping di ${a.area} dengan fasilitas lengkap dan pemandangan asri.`,
        category: 'area',
        pricePerPax: a.price,
        mimountShare: a.mimountShare,
        minPax: 1,
        maxPax: 10,
        areaType: a.area,
        dayType: a.day,
        packageType: a.type,
        isActive: true,
        isFeatured: a.featured || false,
        badgeText: a.badge || 'Reguler',
        imageUrl: a.img,
        features: [
          { text: 'Tiket masuk camping', icon: 'check' },
          { text: 'Sewa lahan & Tenda', icon: 'check' },
          { text: 'Toilet & Mushola', icon: 'check' },
          { text: 'Alat tidur (SB, Matras)', icon: 'check' }
        ]
      });
    }

    // --- 4. TRACKING CATEGORY ---
    const trackingData = [
      { name: 'Tracking Curug (Air Terjun)', price: 75000, mimountShare: 15000, desc: 'Petualangan menyusuri sungai menuju Curug tersembunyi.', img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071&auto=format&fit=crop' },
      { name: 'Tracking Puncak Spec Camp', price: 125000, mimountShare: 25000, desc: 'Sunrise tracking menuju titik tertinggi Spec Camp.', featured: true, badge: 'Best View', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop' }
    ];

    for (const tr of trackingData) {
      await PackageEvent.create({
        name: tr.name,
        description: tr.desc,
        category: 'tracking',
        pricePerPax: tr.price,
        mimountShare: tr.mimountShare,
        minPax: 2,
        maxPax: 50,
        areaType: 'Nature Trail',
        dayType: 'weekday',
        packageType: 'full',
        isActive: true,
        isFeatured: tr.featured || false,
        badgeText: tr.badge || '',
        imageUrl: tr.img,
        features: [
          { text: 'Local Guide', icon: 'check' },
          { text: 'Air Mineral & Snack', icon: 'restaurant' },
          { text: 'Tiket masuk kawasan', icon: 'check' }
        ]
      });
    }

    console.log('--- Seeding Completed Successfully ---');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding packages:', error);
    process.exit(1);
  }
};

seedPackages();
