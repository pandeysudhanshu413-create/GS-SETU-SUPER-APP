import { ServiceCategory } from '../types';

export const SUPER_APP_SERVICES: ServiceCategory[] = [
  {
    id: 'food',
    name: 'Food & Snacks',
    hindiName: 'स्वादिष्ट भोजन व नाश्ता',
    tagline: 'Fresh local food, Maggi, pasta & home kitchen treats',
    description: 'Order piping hot homemade food, Masala Maggi, creamy pasta, desi macaroni, and tea-time snacks delivered fresh in minutes from neighborhood kitchens and local cafes.',
    iconName: 'UtensilsCrossed',
    badge: 'Enabled',
    accentColor: '#168548',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=700&q=80',
    features: [
      'Live ordering & instant checkout enabled',
      'Masala Maggi, Cheese Maggi, Red & White Sauce Pasta',
      'Desi Macaroni & tea-time snacks',
      'Real-time order tracking with status updates',
      'Support village women home-cooks & local cafes'
    ],
    sampleItems: [
      { name: 'Masala Maggi', detail: 'Hot and tasty masala Maggi with Indian spices', priceHint: '₹35' },
      { name: 'Cheese Maggi', detail: 'Loaded with double cheese & oregano', priceHint: '₹60' },
      { name: 'Red Sauce Pasta', detail: 'Rich sun-ripened tomato basil sauce', priceHint: '₹60' },
      { name: 'White Sauce Pasta', detail: 'Creamy gourmet Bechamel & sweet corn', priceHint: '₹80' },
      { name: 'Masala Macaroni', detail: 'Home-style desi spicy macaroni', priceHint: '₹50' },
      { name: 'Chatpata Macaroni', detail: 'Extra spicy street-style macaroni', priceHint: '₹60' }
    ]
  },
  {
    id: 'stationery',
    name: 'Books & Stationery',
    hindiName: 'किताबें एवं स्टेशनरी',
    tagline: 'Notebooks, pens, school supplies & print services',
    description: 'Get school textbooks, competitive exam guides, register notebooks, gel pens, art stationery, and photocopies delivered right to your home or school.',
    iconName: 'BookOpen',
    badge: 'Coming Soon',
    accentColor: '#0284c7',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=700&q=80',
    features: [
      'School & college notebooks (Classmate & local brands)',
      'NCERT and state board textbooks & reference guides',
      'Ball pens, gel pens, geometry boxes & project charts',
      'Doorstep photocopy & document printing pickup'
    ],
    sampleItems: [
      { name: 'Spiral Notebook (180 pgs)', detail: 'Smooth ruled paper for students', priceHint: '₹45' },
      { name: 'Student Exam Stationery Kit', detail: '5 gel pens, ruler, eraser & sharpener', priceHint: '₹85' },
      { name: 'All-in-One NCERT Guide', detail: 'Class 9-12 Hindi & English mediums', priceHint: '₹180' },
      { name: 'A4 Color Project Sheets Pack', detail: '25 sheets multi-color craft paper', priceHint: '₹60' }
    ]
  },
  {
    id: 'fruits-veg',
    name: 'Fruits & Vegetables',
    hindiName: 'ताज़ा फल एवं सब्ज़ियां',
    tagline: 'Mandi fresh produce directly from local kisan',
    description: 'Empowering local farmers and vegetable growers to supply freshly harvested, chemical-free vegetables and seasonal fruits to your kitchen table every morning.',
    iconName: 'Apple',
    badge: 'Coming Soon',
    accentColor: '#15803d',
    image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=700&q=80',
    features: [
      'Direct farm-to-door fresh morning procurement',
      'Local seasonal greens, spinach, coriander & mint',
      'Fresh potatoes, onions, tomatoes, and ginger',
      'Seasonal fruits: Mangoes, Guavas, Papayas, Bananas'
    ],
    sampleItems: [
      { name: 'Daily Sabzi Basket (5kg)', detail: 'Potato, Onion, Tomato, Green Chilli & Coriander', priceHint: '₹140' },
      { name: 'Fresh Palak & Methi Bundle', detail: 'Directly harvested from village farm', priceHint: '₹25' },
      { name: 'Desi Red Carrots (1kg)', detail: 'Sweet, juicy and pesticide tested', priceHint: '₹35' },
      { name: 'Fresh Local Bananas (Dozen)', detail: 'Naturally ripened bananas', priceHint: '₹50' }
    ]
  },
  {
    id: 'grocery',
    name: 'Grocery & Daily Essentials',
    hindiName: 'किराना एवं दैनिक सामग्री',
    tagline: 'Spices, grains, pulses & trusted kirana essentials',
    description: 'Connect with your neighborhood trusted Kirana store for pure mustard oil, chakki fresh atta, pulses, bath soaps, tea leaves, and daily essentials.',
    iconName: 'ShoppingBag',
    badge: 'Coming Soon',
    accentColor: '#d97706',
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=700&q=80',
    features: [
      'Chakki fresh whole wheat atta & basmati rice',
      'Cold-pressed kacchi ghani mustard oil & pure desi ghee',
      'Whole Indian spices, turmeric, cumin & black pepper',
      'Detergents, soaps, toiletries & household cleaning'
    ],
    sampleItems: [
      { name: 'Chakki Fresh Sharbati Atta (5kg)', detail: 'Stone ground whole wheat flour', priceHint: '₹210' },
      { name: 'Desi Kacchi Ghani Mustard Oil (1L)', detail: 'Pure aromatic mustard oil in tin', priceHint: '₹145' },
      { name: 'Arhar / Toor Dal Premium (1kg)', detail: 'Unpolished protein-rich pulses', priceHint: '₹165' },
      { name: 'Assam Gold Tea Blend (500g)', detail: 'Strong aromatic village kadak chai', priceHint: '₹190' }
    ]
  },
  {
    id: 'transport',
    name: 'Transport & Local Auto',
    hindiName: 'स्थानीय ऑटो एवं यात्रा',
    tagline: 'Reliable auto-rickshaw, e-rickshaw & village rides',
    description: 'Book verified local auto-rickshaws, battery e-rickshaws, and mini luggage tempos for railway station drops, hospital visits, mandi transport, and inter-village travel.',
    iconName: 'Car',
    badge: 'Coming Soon',
    accentColor: '#7c3aed',
    image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=700&q=80',
    features: [
      'Transparent flat pricing without bargaining hassle',
      'Pre-scheduled rides for morning trains and clinic visits',
      'Luggage tempos for moving farm goods and shop stock',
      'Direct phone connect with local registered drivers'
    ],
    sampleItems: [
      { name: 'Town / Railway Station Drop', detail: 'Doorstep auto pickup for 1-4 passengers', priceHint: 'Est. ₹50-₹120' },
      { name: 'Inter-Village E-Rickshaw', detail: 'Eco-friendly short ride connecting nearby hamlets', priceHint: 'Est. ₹20-₹40' },
      { name: 'Mini Tempo Goods Cargo', detail: 'For agricultural crops, fertilizers & bulky cargo', priceHint: 'Est. ₹250+' }
    ]
  },
  {
    id: 'delivery-partners',
    name: 'Delivery Partners Network',
    hindiName: 'डिलीवरी साथी नेटवर्क',
    tagline: 'Empowering local youth with flexible daily earnings',
    description: 'Join the GS Setu neighborhood delivery fleet. Use your bicycle, motorcycle, or electric scooter to deliver packages, groceries, and food in your own locality.',
    iconName: 'Bike',
    badge: 'Coming Soon',
    accentColor: '#059669',
    image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=700&q=80',
    features: [
      'Earn ₹8,000 to ₹18,000 monthly in your spare hours',
      'Daily and weekly bank / UPI payouts directly',
      'No complicated English app — simple Hindi/vernacular UI',
      'Fuel allowance and medical accident safety cover'
    ],
    sampleItems: [
      { name: 'Part-Time Evening Fleet', detail: '4-5 hours post college or farming shift', priceHint: 'Earn ₹300-₹500/day' },
      { name: 'Full-Time Delivery Captain', detail: 'Flexible 8 hours covering town clusters', priceHint: 'Earn ₹800-₹1200/day' }
    ]
  },
  {
    id: 'workers',
    name: 'Workers & Daily Helpers',
    hindiName: 'कारीगर एवं सहायक सेवाएं',
    tagline: 'Electricians, plumbers, carpenters & local repair experts',
    description: 'Find trusted, background-verified local tradespersons for domestic electrical wiring, water motor repairs, borewell maintenance, carpentry, masonry, and painting.',
    iconName: 'Wrench',
    badge: 'Coming Soon',
    accentColor: '#e11d48',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=700&q=80',
    features: [
      'Certified village electricians for inverter, cooler & wiring',
      'Borewell & submersible pump repair specialists',
      'Local carpenters for doors, cots, desks & almirahs',
      'House painters, tile masons & sanitary plumbers'
    ],
    sampleItems: [
      { name: 'Electrician Visit & Diagnostic', detail: 'Switchboard, ceiling fan & wiring fix', priceHint: 'Visiting ₹100' },
      { name: 'Water Pump & Submersible Repair', detail: 'Starter coil, capacitor & pipe joint fixing', priceHint: 'Visiting ₹150' },
      { name: 'Carpenter Door & Furniture Repair', detail: 'Hinges, locks, table repair & wood polish', priceHint: 'Visiting ₹120' }
    ]
  },
  {
    id: 'other-services',
    name: 'Cyber & Local Business Services',
    hindiName: 'अन्य स्थानीय सेवाएं',
    tagline: 'Online forms, Aadhaar services, tailoring & farm repair',
    description: 'Extensible directory bringing village cyber cafes, boutique tailors, tractor mechanics, solar panel installers, and CSC government scheme application desks online.',
    iconName: 'Layers',
    badge: 'Coming Soon',
    accentColor: '#4f46e5',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=700&q=80',
    features: [
      'Government form filing, PM Kisan & scholarship assistance',
      'Custom blouse, salwar suit & kurta pajama tailoring',
      'Solar tubewell & rooftop panel maintenance',
      'Agricultural tractor and tiller equipment service'
    ],
    sampleItems: [
      { name: 'Government Scheme Form Filing', detail: 'PM Kisan, Ration Card, Voter ID & Certificates', priceHint: 'Service ₹50' },
      { name: 'Custom Village Tailoring', detail: 'Pick up fabric, precise stitching & drop back', priceHint: 'From ₹150' }
    ]
  }
];

export const POPULAR_LOCATIONS = [
  { id: 'loc-1', name: 'Rohania Village', district: 'Varanasi', state: 'Uttar Pradesh', pincode: '221108' },
  { id: 'loc-2', name: 'Phulpur Town', district: 'Prayagraj', state: 'Uttar Pradesh', pincode: '212402' },
  { id: 'loc-3', name: 'Sahjanwa Market', district: 'Gorakhpur', state: 'Uttar Pradesh', pincode: '273209' },
  { id: 'loc-4', name: 'Bakshi Ka Talab', district: 'Lucknow', state: 'Uttar Pradesh', pincode: '226201' },
  { id: 'loc-5', name: 'Danapur Cantt', district: 'Patna', state: 'Bihar', pincode: '801503' },
  { id: 'loc-6', name: 'Bithoor Heritage Village', district: 'Kanpur Nagar', state: 'Uttar Pradesh', pincode: '209217' },
  { id: 'loc-7', name: 'Chomu Rural Hub', district: 'Jaipur', state: 'Rajasthan', pincode: '303702' },
  { id: 'loc-8', name: 'Sikandrabad', district: 'Bulandshahr', state: 'Uttar Pradesh', pincode: '203205' }
];
