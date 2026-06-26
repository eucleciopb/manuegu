import type { Gift } from '../types';

export interface GiftSeed {
  name: string;
  price: number;
  image_url: string;
}

const img = {
  kitchen: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
  tableware: 'https://images.unsplash.com/photo-1603199501966-5516a3e7e82c?w=400&h=300&fit=crop',
  glasses: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop',
  cups: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca1d?w=400&h=300&fit=crop',
  cutlery: 'https://images.unsplash.com/photo-1603199501966-5516a3e7e82c?w=400&h=300&fit=crop',
  pots: 'https://images.unsplash.com/photo-1584990347499-76d280a3c8a1?w=400&h=300&fit=crop',
  pans: 'https://images.unsplash.com/photo-1584990347499-76d280a3c8a1?w=400&h=300&fit=crop',
  baking: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=300&fit=crop',
  storage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
  bathroom: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop',
  bedroom: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop',
  serving: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
  appliances: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&h=300&fit=crop',
  coffee: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=300&fit=crop',
  vacuum: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&h=300&fit=crop',
  microwave: 'https://images.unsplash.com/photo-1585659722983-d1d4a8b1d4e8?w=400&h=300&fit=crop',
  iron: 'https://images.unsplash.com/photo-1582735689369-0f77d0b1f608?w=400&h=300&fit=crop',
  bbq: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
  trash: 'https://images.unsplash.com/photo-1622431351416-acce0be616e3?w=400&h=300&fit=crop',
  organizer: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
};

export const GIFTS_CATALOG: GiftSeed[] = [
  // Cozinha
  { name: '🍷 Jogo de taças', price: 120, image_url: img.glasses },
  { name: '🥤 Jogo de copos', price: 90, image_url: img.cups },
  { name: '🍽️ Jogo de pratos (20 peças)', price: 320, image_url: img.tableware },
  { name: '🍴 Conjunto de talheres', price: 220, image_url: img.cutlery },
  { name: '🍝 Escorredor de macarrão', price: 60, image_url: img.kitchen },
  { name: '🥫 Potes herméticos', price: 140, image_url: img.storage },
  { name: '🔪 Tábua de carne', price: 80, image_url: img.kitchen },
  { name: '🥄 Kit concha, espátula e colher de silicone', price: 90, image_url: img.kitchen },
  { name: '🍳 Jogo de panelas', price: 650, image_url: img.pots },
  { name: '🍲 Panela de pressão', price: 220, image_url: img.pots },
  { name: '🍳 Frigideira antiaderente', price: 180, image_url: img.pans },
  { name: '🥧 Assadeira', price: 90, image_url: img.baking },
  { name: '🎂 Forma de bolo', price: 70, image_url: img.baking },
  { name: '🫗 Jarra para água/suco', price: 70, image_url: img.cups },
  { name: '🧺 Panos de prato', price: 60, image_url: img.kitchen },
  { name: '🥫 Abridor de latas e garrafas', price: 40, image_url: img.kitchen },
  { name: '🍽️ Escorredor de louças', price: 140, image_url: img.kitchen },
  { name: '☕ Conjunto de xícaras', price: 180, image_url: img.coffee },
  { name: '🧽 Kit pia de cozinha (porta detergente, porta esponja e dispenser)', price: 90, image_url: img.organizer },
  { name: '🗑️ Lixeira para cozinha', price: 120, image_url: img.trash },
  { name: '🍚 Porta mantimentos', price: 140, image_url: img.storage },
  { name: '🧂 Porta temperos', price: 90, image_url: img.storage },
  { name: '🔪 Faqueiro para churrasco', price: 180, image_url: img.bbq },
  // Banheiro
  { name: '🛁 Jogo de toalhas', price: 250, image_url: img.bathroom },
  { name: '🚿 Tapete para banheiro', price: 70, image_url: img.bathroom },
  { name: '🗑️ Lixeira', price: 60, image_url: img.trash },
  { name: '🪥 Porta-escovas de dente', price: 50, image_url: img.bathroom },
  { name: '🧴 Porta-sabonete líquido', price: 50, image_url: img.bathroom },
  { name: '🧺 Cesto para roupas', price: 120, image_url: img.organizer },
  // Quarto
  { name: '🛌 Jogo de cama', price: 320, image_url: img.bedroom },
  { name: '❄️ Edredom', price: 350, image_url: img.bedroom },
  { name: '🧣 Cobertor', price: 250, image_url: img.bedroom },
  { name: '☁️ Par de travesseiros', price: 180, image_url: img.bedroom },
  { name: '👕 Kit de cabides', price: 60, image_url: img.organizer },
  { name: '🧺 Organizador de gavetas', price: 90, image_url: img.organizer },
  // Mesa e Servir
  { name: '🍲 Travessa de vidro', price: 120, image_url: img.serving },
  { name: '🧀 Petisqueira', price: 120, image_url: img.serving },
  { name: '🍽️ Jogo americano', price: 100, image_url: img.serving },
  { name: '🧺 Toalha de mesa', price: 180, image_url: img.serving },
  { name: '☕ Xícaras para café', price: 120, image_url: img.coffee },
  { name: '🍰 Boleira de vidro', price: 140, image_url: img.serving },
  { name: '🧊 Balde para gelo', price: 100, image_url: img.serving },
  // Eletroportáteis
  { name: '🥪 Sanduicheira', price: 180, image_url: img.appliances },
  { name: '🥤 Liquidificador', price: 280, image_url: img.appliances },
  { name: '☕ Cafeteira', price: 320, image_url: img.coffee },
  { name: '🍟 Air Fryer', price: 650, image_url: img.appliances },
  { name: '👔 Ferro de passar', price: 180, image_url: img.iron },
  { name: '💧 Purificador de água', price: 500, image_url: img.appliances },
  { name: '📡 Micro-ondas', price: 600, image_url: img.microwave },
  { name: '🍚 Panela elétrica de arroz', price: 260, image_url: img.appliances },
  { name: '🧹 Aspirador de pó', price: 450, image_url: img.vacuum },
  { name: '🔥 Grill elétrico', price: 250, image_url: img.bbq },
  { name: '🍖 Churrasqueira elétrica', price: 350, image_url: img.bbq },
  { name: '🍞 Torradeira', price: 180, image_url: img.appliances },
  { name: '🥣 Mixer 3 em 1', price: 220, image_url: img.appliances },
];

export function buildMockGifts(): Gift[] {
  return GIFTS_CATALOG.map((gift, index) => ({
    id: `gift-${index + 1}`,
    ...gift,
    purchase_url: null,
    status: 'available' as const,
    created_at: new Date().toISOString(),
  }));
}
