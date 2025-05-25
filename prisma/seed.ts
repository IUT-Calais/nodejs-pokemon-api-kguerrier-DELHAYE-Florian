import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Supprime types, cartes et utilisateurs
  await prisma.type.deleteMany();
  await prisma.pokemonCard.deleteMany();
  await prisma.user.deleteMany();

  // Ajoute les types Pokémon
  await prisma.type.createMany({
    data: [
      { name: 'Normal' },
      { name: 'Fire' },
      { name: 'Water' },
      { name: 'Grass' },
      { name: 'Electric' },
      { name: 'Ice' },
      { name: 'Fighting' },
      { name: 'Poison' },
      { name: 'Ground' },
      { name: 'Flying' },
      { name: 'Psychic' },
      { name: 'Bug' },
      { name: 'Rock' },
      { name: 'Ghost' },
      { name: 'Dragon' },
      { name: 'Dark' },
      { name: 'Steel' },
      { name: 'Fairy' },
    ],
  });

  // Récupère le type "Normal"
  const normalType = await prisma.type.findUnique({ where: { name: 'Normal' } });
  if (!normalType) throw new Error('Type Normal non trouvé');

  // Crée Bulbizarre
  await prisma.pokemonCard.create({
    data: {
      name: 'Bulbizarre',
      pokedexId: 1,
      typeId: normalType.id,
      lifePoints: 45,
      weight: 6.9,
      size: 0.7,
      imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png',
    },
  });

  // Crée utilisateur admin
  await prisma.user.create({
    data: {
      email: 'admin@gmail.com',
      password: 'admin',
    },
  });

  console.log('Seed terminé !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
