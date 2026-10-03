export type PetId = 'dog' | 'cat' | 'rabbit' | 'parrot';

export const petAssets: Record<PetId, { src: string; small: string; name: string; alt: string }> = {
  dog: { src: '/pets/dog-golden-retriever.webp', small: '/pets/dog-golden-retriever-small.webp', name: 'Golden Retriever', alt: 'A golden retriever puppy sitting with a bright, curious expression' },
  cat: { src: '/pets/cat-fluffy.webp', small: '/pets/cat-fluffy-small.webp', name: 'Fluffy cat', alt: 'A fluffy cream cat sitting with its soft tail tucked around its paws' },
  rabbit: { src: '/pets/rabbit-white.webp', small: '/pets/rabbit-white-small.webp', name: 'White rabbit', alt: 'A little white rabbit with upright ears' },
  parrot: { src: '/pets/parrot-colorful.webp', small: '/pets/parrot-colorful-small.webp', name: 'Colorful parrot', alt: 'A green parrot with a peach and yellow chest and bright, curious eyes' },
};
