#!/usr/bin/env node
/**
 * Sincroniza a lista de presentes no Supabase.
 * Uso: node scripts/seed-gifts.mjs
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function loadEnv() {
  const envPath = join(root, '.env');
  const env = {};
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) env[match[1].trim()] = match[2].trim();
  }
  return env;
}

const GIFTS = [
  ['🍷 Jogo de taças', 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop', 120],
  ['🥤 Jogo de copos', 'https://images.unsplash.com/photo-1514228742587-6b1558fcca1d?w=400&h=300&fit=crop', 90],
  ['🍽️ Jogo de pratos (20 peças)', 'https://images.unsplash.com/photo-1603199501966-5516a3e7e82c?w=400&h=300&fit=crop', 320],
  ['🍴 Conjunto de talheres', 'https://images.unsplash.com/photo-1603199501966-5516a3e7e82c?w=400&h=300&fit=crop', 220],
  ['🍝 Escorredor de macarrão', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', 60],
  ['🥫 Potes herméticos', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', 140],
  ['🔪 Tábua de carne', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', 80],
  ['🥄 Kit concha, espátula e colher de silicone', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', 90],
  ['🍳 Jogo de panelas', 'https://images.unsplash.com/photo-1584990347499-76d280a3c8a1?w=400&h=300&fit=crop', 650],
  ['🍲 Panela de pressão', 'https://images.unsplash.com/photo-1584990347499-76d280a3c8a1?w=400&h=300&fit=crop', 220],
  ['🍳 Frigideira antiaderente', 'https://images.unsplash.com/photo-1584990347499-76d280a3c8a1?w=400&h=300&fit=crop', 180],
  ['🥧 Assadeira', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=300&fit=crop', 90],
  ['🎂 Forma de bolo', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=300&fit=crop', 70],
  ['🫗 Jarra para água/suco', 'https://images.unsplash.com/photo-1514228742587-6b1558fcca1d?w=400&h=300&fit=crop', 70],
  ['🧺 Panos de prato', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', 60],
  ['🥫 Abridor de latas e garrafas', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', 40],
  ['🍽️ Escorredor de louças', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', 140],
  ['☕ Conjunto de xícaras', 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=300&fit=crop', 180],
  ['🧽 Kit pia de cozinha (porta detergente, porta esponja e dispenser)', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop', 90],
  ['🗑️ Lixeira para cozinha', 'https://images.unsplash.com/photo-1622431351416-acce0be616e3?w=400&h=300&fit=crop', 120],
  ['🍚 Porta mantimentos', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', 140],
  ['🧂 Porta temperos', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', 90],
  ['🔪 Faqueiro para churrasco', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop', 180],
  ['🛁 Jogo de toalhas', 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop', 250],
  ['🚿 Tapete para banheiro', 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop', 70],
  ['🗑️ Lixeira', 'https://images.unsplash.com/photo-1622431351416-acce0be616e3?w=400&h=300&fit=crop', 60],
  ['🪥 Porta-escovas de dente', 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop', 50],
  ['🧴 Porta-sabonete líquido', 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop', 50],
  ['🧺 Cesto para roupas', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop', 120],
  ['🛌 Jogo de cama', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop', 320],
  ['❄️ Edredom', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop', 350],
  ['🧣 Cobertor', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop', 250],
  ['☁️ Par de travesseiros', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop', 180],
  ['👕 Kit de cabides', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop', 60],
  ['🧺 Organizador de gavetas', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop', 90],
  ['🍲 Travessa de vidro', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop', 120],
  ['🧀 Petisqueira', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop', 120],
  ['🍽️ Jogo americano', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop', 100],
  ['🧺 Toalha de mesa', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop', 180],
  ['☕ Xícaras para café', 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=300&fit=crop', 120],
  ['🍰 Boleira de vidro', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop', 140],
  ['🧊 Balde para gelo', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop', 100],
  ['🥪 Sanduicheira', 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&h=300&fit=crop', 180],
  ['🥤 Liquidificador', 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&h=300&fit=crop', 280],
  ['☕ Cafeteira', 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=300&fit=crop', 320],
  ['🍟 Air Fryer', 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&h=300&fit=crop', 650],
  ['👔 Ferro de passar', 'https://images.unsplash.com/photo-1582735689369-0f77d0b1f608?w=400&h=300&fit=crop', 180],
  ['💧 Purificador de água', 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&h=300&fit=crop', 500],
  ['📡 Micro-ondas', 'https://images.unsplash.com/photo-1585659722983-d1d4a8b1d4e8?w=400&h=300&fit=crop', 600],
  ['🍚 Panela elétrica de arroz', 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&h=300&fit=crop', 260],
  ['🧹 Aspirador de pó', 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&h=300&fit=crop', 450],
  ['🔥 Grill elétrico', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop', 250],
  ['🍖 Churrasqueira elétrica', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop', 350],
  ['🍞 Torradeira', 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&h=300&fit=crop', 180],
  ['🥣 Mixer 3 em 1', 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&h=300&fit=crop', 220],
];

async function main() {
  const env = loadEnv();
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.error('Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env');
    process.exit(1);
  }

  const sb = createClient(url, key);

  const { data: reserved } = await sb.from('gift_reservations').select('gift_id');
  const reservedIds = new Set((reserved ?? []).map((r) => r.gift_id));

  const { data: allGifts } = await sb.from('gifts').select('id, status');
  const toDelete = (allGifts ?? [])
    .filter((g) => g.status === 'available' && !reservedIds.has(g.id))
    .map((g) => g.id);

  if (toDelete.length > 0) {
    const { error } = await sb.from('gifts').delete().in('id', toDelete);
    if (error) throw new Error(error.message);
    console.log(`Removidos ${toDelete.length} presentes antigos.`);
  }

  const rows = GIFTS.map(([name, image_url, price]) => ({
    name,
    image_url,
    price,
    status: 'available',
  }));

  const { error: insertError } = await sb.from('gifts').insert(rows);
  if (insertError) throw new Error(insertError.message);

  const { count } = await sb.from('gifts').select('*', { count: 'exact', head: true });
  console.log(`OK: ${GIFTS.length} presentes inseridos. Total no banco: ${count}`);
}

main().catch((err) => {
  console.error('Erro:', err.message);
  process.exit(1);
});
