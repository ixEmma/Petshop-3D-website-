export type CategoryId = 'all' | 'dogs' | 'cats' | 'small-pets' | 'birds';
export type Product = {
  id: string; name: string; type: string; price: string; image: string;
  color: string; categories: CategoryId[]; description: string; details: string[];
};

export const products: Product[] = [
  { id: 'daily-goodness', name: 'Daily goodness', type: 'The everyday dog food', price: '$24', image: '/products/daily-goodness.webp', color: 'peach', categories: ['dogs'], description: 'A beautifully simple concept for the most eagerly anticipated part of a dog’s day. A pantry-worthy bag, made to belong beside their favorite bowl.', details: ['Dog food concept · 1 kg', 'Resealable paper-look packaging', 'Illustrative product; recipe and feeding information are not finalized'] },
  { id: 'good-tug', name: 'The good tug', type: 'A little give. A lot of play.', price: '$16', image: '/products/good-tug.webp', color: 'sage', categories: ['dogs'], description: 'For the “one more game” kind of dog. A generous knot, a satisfying twist and an invitation to put your phone down for a while.', details: ['Cotton rope toy concept', 'For supervised games together', 'Choose toys to suit your pet’s size and play style'] },
  { id: 'fresh-start', name: 'Fresh start', type: 'A tidy little grooming ritual', price: '$22', image: '/products/fresh-start.webp', color: 'butter', categories: ['dogs'], description: 'A quiet moment in a usually muddy life. Our dog grooming concept keeps the everyday routine simple, with an easy-to-hold bottle and considered packaging.', details: ['Dog grooming product concept · 250 ml', 'Formula and use instructions are not finalized', 'This concept makes no health or treatment claims'] },
  { id: 'everyday-bowl', name: 'The everyday bowl', type: 'Good taste, all around', price: '$28', image: '/products/everyday-bowl.webp', color: 'sand', categories: ['dogs', 'cats', 'small-pets', 'birds'], description: 'A pleasingly simple place for daily rituals. This ceramic bowl concept pairs a low profile with a warm, earthy finish. Choose the right dimensions for your companion.', details: ['Glazed ceramic bowl concept', 'A low-profile everyday shape', 'Final sizing and suitability would be confirmed before sale'] },
];

export const categoryLabels: Record<CategoryId, string> = { all: 'All good things', dogs: 'Dogs', cats: 'Cats', 'small-pets': 'Small pets', birds: 'Birds' };
