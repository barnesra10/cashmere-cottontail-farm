// Central data for all breeds. Each entry drives its own page,
// the homepage grid, SEO structured data, and the animals-for-sale sections.
// Photos are placeholders — replace paths once real images are uploaded.

const breeds = [
  {
    id: 'valais-blacknose-sheep',
    slug: 'valais-blacknose-sheep',
    name: 'Valais Blacknose Sheep',
    shortName: 'Valais Blacknose',
    tagline: 'The world\'s cutest sheep — luxury fleece meets teddy-bear charm.',
    emoji: '🐑',
    heroColor: 'from-charcoal-600 to-charcoal-700',
    accentColor: 'sage',
    description: `Our Valais Blacknose sheep are the crown jewel of Cashmere Cottontail Farm. Originally from the Swiss canton of Valais, these magnificent animals are renowned for their striking black faces, spiral horns, and incredibly soft wool. We breed to VBSSA standards, focusing on correct facial markings, strong conformation, and gentle temperament.`,
    breedStandard: `Valais Blacknose are a dual-purpose breed prized for their distinctive black face and ear markings against bright white wool. Rams display impressive spiral horns. The wool is long, lustrous, and used in luxury textiles. We focus on symmetrical face markings, correct horn set, strong legs, and a calm, friendly disposition.`,
    careNote: 'Valais thrive in cooler climates and need twice-yearly shearing. They are naturally gentle and social, making them wonderful for hobby farms and families.',
    parents: [],
    available: [],
    upcoming: [],
    photos: []
  },
  {
    id: 'pygmy-goats',
    slug: 'pygmy-goats',
    name: 'Pygmy Goats',
    shortName: 'Pygmy Goats',
    tagline: 'Compact, playful, and endlessly entertaining companions.',
    emoji: '🐐',
    heroColor: 'from-sage-500 to-sage-600',
    accentColor: 'wheat',
    description: `Our Pygmy goats are bred for outstanding conformation, friendly temperament, and the stocky, cobby build that defines the breed. Whether you want a show-quality animal or simply the most charming backyard companion, our Pygmies deliver personality in a small package.`,
    breedStandard: `Pygmy goats should be stocky and compact with well-developed muscles. We breed for correct bite, strong pasterns, good breed character, and a friendly, outgoing disposition. Our breeding stock meets NPGA standards.`,
    careNote: 'Pygmies need a companion (never keep one alone), basic shelter, good hay, and minimal grain. They are hardy, low-maintenance, and adapt well to small acreages.',
    parents: [],
    available: [],
    upcoming: [],
    photos: []
  },
  {
    id: 'mini-rex-rabbits',
    slug: 'mini-rex-rabbits',
    name: 'Mini Rex Rabbits',
    shortName: 'Mini Rex',
    tagline: 'Velvet fur you have to feel to believe.',
    emoji: '🐇',
    heroColor: 'from-wheat-400 to-wheat-500',
    accentColor: 'charcoal',
    description: `Mini Rex rabbits are famous for their incredibly plush, velvety fur — a result of a recessive gene that causes each hair to stand upright. Our Mini Rex program focuses on dense, even coats, correct body type, and sweet temperaments that make them ideal pets or show animals.`,
    breedStandard: `The Mini Rex should weigh 3–4.5 lbs with a compact, well-rounded body. Fur is the hallmark — dense, plush, and uniform with excellent spring-back. We breed for correct fur quality, good head mount, and solid type across a variety of colors.`,
    careNote: 'Mini Rex are indoor- or outdoor-friendly, need a clean hutch or pen, quality hay, fresh greens, and regular nail trims. Their gentle nature makes them wonderful for children.',
    parents: [],
    available: [],
    upcoming: [],
    photos: []
  },
  {
    id: 'miniature-dachshunds',
    slug: 'miniature-dachshunds',
    name: 'Miniature Dachshunds',
    shortName: 'Mini Dachshunds',
    tagline: 'Big personality, small package — the iconic wiener dog.',
    emoji: '🐕',
    heroColor: 'from-charcoal-500 to-charcoal-600',
    accentColor: 'wheat',
    description: `Our Miniature Dachshund program is focused on health, temperament, and breed type. These spirited little dogs are loyal, courageous, and endlessly entertaining. We health-test all breeding stock and raise puppies in our home with early socialization and enrichment.`,
    breedStandard: `Miniature Dachshunds should be under 11 lbs at 12 months, with a long, muscular body, short legs, and confident carriage. We breed for correct proportions, sound movement, good topline, and the bold-yet-friendly temperament the breed is known for.`,
    careNote: 'Mini Dachshunds need regular exercise, a healthy weight to protect their long backs, and consistent training. They bond deeply with their families and make excellent house dogs.',
    parents: [],
    available: [],
    upcoming: [],
    photos: []
  },
  {
    id: 'silkie-chickens',
    slug: 'silkie-chickens',
    name: 'Silkie Chickens',
    shortName: 'Silkies',
    tagline: 'Fluffy, friendly, and fabulous — specializing in satin mottled varieties.',
    emoji: '🐔',
    heroColor: 'from-plaid-mid to-plaid-dark',
    accentColor: 'sage',
    description: `Our Silkie chicken flock specializes in rare and striking color varieties: satin mottled, black splits from mottled, and mottled. Silkies are known for their incredibly soft, fur-like plumage, gentle disposition, and excellent mothering instincts. They make outstanding pets, show birds, and backyard companions.`,
    breedStandard: `Silkies should have a round, full crest, five toes, feathered feet, black skin, and the characteristic silk-like plumage. Our satin line carries the satin gene for a glossy sheen on the feathers. We breed for correct type, good crests, and vibrant mottled patterning.`,
    careNote: 'Silkies need protection from rain (their feathers don\'t repel water like standard breeds), a dry coop, and predator-proof housing. They are docile, friendly, and wonderful with children.',
    parents: [],
    available: [],
    upcoming: [],
    photos: []
  }
];

export default breeds;
