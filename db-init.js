require('dotenv').config();
const { Pool } = require('pg');

// Initialize PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Product data
const products = [
  {
    name: 'Tonerin',
    description: 'A Tonerin egyedülálló természetes összetevőkkel támogatja a szív- és érrendszer egészségét. Kiemelkedő minőségű, klinikailag vizsgált formula, amely támogathatja a szív funkcióit és a vérkeringést.',
    rating: 5.0,
    review_count: 147,
    pros: ['Kiváló összetevők', 'Gyors eredmények', 'Minimális mellékhatások', 'Klinikailag tesztelt', 'Magas hatóanyag-tartalom', 'Természetes formula'],
    cons: ['Prémium árfekvés', 'Napi kétszeri szedés szükséges'],
    image_url: 'https://images.unsplash.com/photo-1612490566683-0b3ceabea435'
  },
  {
    name: 'CardioForte',
    description: 'A CardioForte egy hatékony, természetes alapú formula, amely támogatja a szív működését és az érrendszer egészségét. Omega-3 zsírsavakban és antioxidánsokban gazdag.',
    rating: 4.5,
    review_count: 98,
    pros: ['Erős antioxidáns hatás', 'Vegán formula', 'Kedvező ár', 'Nincs kellemetlen halolaj íz', 'Hosszú távú használatra biztonságos'],
    cons: ['Lassabb hatás', 'Nagyméretű kapszulák', 'Egyes felhasználóknál enyhe emésztési panaszok'],
    image_url: 'https://images.unsplash.com/photo-1492127042590-8094c493b510'
  },
  {
    name: 'VitaHeart',
    description: 'A VitaHeart egy Q10-koenzimben és vitaminokban gazdag formula, amely támogatja a szívizom normál működését és az egészséges vérkeringést.',
    rating: 4.0,
    review_count: 76,
    pros: ['Magas Q10 tartalom', 'Komplex vitamin összetétel', 'Könnyen lenyelhető', 'Gyorsan érezhető energianövelő hatás'],
    cons: ['Napi kétszeri adagolás', 'Enyhe mellékhatások', 'Közepes árfekvés'],
    image_url: 'https://images.unsplash.com/photo-1612490689975-c062b1bdcec7'
  },
  {
    name: 'ArteriaClean',
    description: 'Az ArteriaClean egy gyógynövény-alapú kardiovaszkuláris támogató formula, amely elsősorban az érfalak egészségére és a vérkeringés javítására összpontosít.',
    rating: 3.5,
    review_count: 53,
    pros: ['Kiemelkedő polifenol tartalom', 'Intenzív hatás', 'Gyógynövény alapú', 'Erős értágító hatás'],
    cons: ['Gyakoribb mellékhatások', 'Étkezés közben szedendő', 'Más gyógyszerekkel kölcsönhatásba léphet'],
    image_url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7'
  },
  {
    name: 'CardioBalance',
    description: 'A CardioBalance egy gazdaságos árkategóriába tartozó táplálék-kiegészítő, amely alap szintű támogatást nyújt a szív- és érrendszer egészségének.',
    rating: 3.0,
    review_count: 41,
    pros: ['Megfizethető ár', 'Könnyen elérhető', 'Biztonságos összetevők', 'Egyszerű adagolás', 'Kezdőknek ideális'],
    cons: ['Alacsonyabb hatóanyag-tartalom', 'Mérsékelt hatékonyság', 'Hiányzó advanced összetevők', 'Gyenge biofelszívódás'],
    image_url: 'https://images.unsplash.com/photo-1605464370799-719bc1bfba78'
  }
];

// Reviews data
const reviews = [
  {
    product_id: 1, // Tonerin
    name: 'Nagy István',
    rating: 5,
    comment: 'Már egy hónap után érezhető javulás! Sokkal energikusabbnak érzem magam, és a vérnyomásom is stabilabb.'
  },
  {
    product_id: 1, // Tonerin
    name: 'Kovács Anita',
    rating: 5,
    comment: 'Évek óta kerestem valami természetes megoldást, ami támogatja a szív egészségét. A Tonerin valóban beváltotta a hozzá fűzött reményeket.'
  },
  {
    product_id: 1, // Tonerin
    name: 'Tóth Gábor',
    rating: 4,
    comment: 'Kiváló termék, bár az ára valóban magas. Ennek ellenére megéri, mert érezhető a hatása.'
  },
  {
    product_id: 2, // CardioForte
    name: 'Szabó Júlia',
    rating: 5,
    comment: 'Vegánként nehéz jó Omega-3 forrást találni. Ez a termék tökéletes megoldás, és nincs kellemetlen utóíze.'
  },
  {
    product_id: 2, // CardioForte
    name: 'Kiss Tamás',
    rating: 4,
    comment: 'Jó termék, de időbe telik, mire érezhető a hatása. Nagyjából 6 hét után kezdtem észrevenni a pozitív változásokat.'
  },
  {
    product_id: 3, // VitaHeart
    name: 'Varga Katalin',
    rating: 4,
    comment: 'A Q10 miatt választottam, és nem csalódtam. Több energiám van, és edzés után gyorsabban regenerálódom.'
  },
  {
    product_id: 4, // ArteriaClean
    name: 'Molnár Béla',
    rating: 3,
    comment: 'Erős hatása van, de sajnos nálam gyomorpanaszokat okozott. Étkezés közben szedve jobb, de még így is érzem.'
  },
  {
    product_id: 5, // CardioBalance
    name: 'Horváth Eszter',
    rating: 3,
    comment: 'Az árához képest megfelelő. Nem várhatunk csodát, de alap támogatásra jó lehet.'
  }
];

// Initialize database
async function initializeDatabase() {
  try {
    // Connect to the database
    const client = await pool.connect();
    console.log('Connected to PostgreSQL database');

    // Insert products
    for (const product of products) {
      const result = await client.query(
        `INSERT INTO products (name, description, rating, review_count, pros, cons, image_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO NOTHING
         RETURNING id`,
        [
          product.name, 
          product.description, 
          product.rating, 
          product.review_count, 
          product.pros, 
          product.cons, 
          product.image_url
        ]
      );
      console.log(`Added product: ${product.name}`);
    }

    // Insert reviews
    for (const review of reviews) {
      await client.query(
        `INSERT INTO user_reviews (product_id, name, rating, comment)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT DO NOTHING`,
        [review.product_id, review.name, review.rating, review.comment]
      );
      console.log(`Added review by ${review.name}`);
    }

    client.release();
    console.log('Database initialization completed');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the function
initializeDatabase();