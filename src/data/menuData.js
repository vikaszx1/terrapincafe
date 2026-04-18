export const menuCategories = [
  { id: 'starters', label: 'Starters' },
  { id: 'mains',    label: 'Mains' },
  { id: 'desserts', label: 'Desserts' },
  { id: 'wine',     label: 'Wine & Drinks' },
]

export const menuItems = {
  starters: [
    {
      name: 'Dungeness Crab Bisque',
      price: '$19',
      desc: 'Rich, creamy bisque of local Dungeness crab, finished with crème fraîche and fresh chives. Served with house sourdough.',
      tags: ['gf', 'sig'],
    },
    {
      name: 'Oysters on the Half Shell',
      price: '$22',
      desc: 'Half dozen Tomales Bay oysters, mignonette, house cocktail sauce, fresh lemon. Market freshness guaranteed.',
      tags: ['gf'],
    },
    {
      name: 'Roasted Beet Salad',
      price: '$16',
      desc: 'Heirloom beets, Point Reyes Blue, candied walnuts, arugula, citrus vinaigrette.',
      tags: ['vg', 'gf'],
    },
    {
      name: 'Clam Chowder',
      price: '$17',
      desc: 'New England–style with Pacific littlenecks, smoked bacon, Yukon Gold potatoes, house bread bowl.',
      tags: ['sig'],
    },
    {
      name: 'Burrata & Heirloom Tomato',
      price: '$18',
      desc: 'Petaluma burrata, seasonal heirloom tomatoes, basil oil, aged balsamic, Maldon salt.',
      tags: ['v', 'gf'],
    },
    {
      name: 'Crispy Calamari',
      price: '$17',
      desc: 'Lightly floured, flash-fried local squid, lemon aioli, pickled pepperoncini, fresh herbs.',
      tags: [],
    },
  ],
  mains: [
    {
      name: 'Pan-Seared Halibut',
      price: '$44',
      desc: 'Pacific halibut, spring pea purée, crispy capers, brown butter, microgreens. Sourced daily from Bodega Bay fishermen.',
      tags: ['gf', 'sig'],
    },
    {
      name: 'Grilled Sonoma Duck Breast',
      price: '$42',
      desc: 'Cherry-glazed Sonoma duck, roasted farro, wilted chard, duck jus reduction.',
      tags: ['gf'],
    },
    {
      name: 'Coastal Bouillabaisse',
      price: '$46',
      desc: 'Dungeness crab, clams, mussels, shrimp in saffron broth. Rouille, grilled baguette.',
      tags: ['sig'],
    },
    {
      name: 'Wild Mushroom Risotto',
      price: '$34',
      desc: 'Foraged Sonoma mushrooms, Arborio rice, Parmigiano-Reggiano, truffle oil, fresh thyme.',
      tags: ['vg', 'gf'],
    },
    {
      name: '12oz Niman Ranch Ribeye',
      price: '$56',
      desc: 'Dry-aged ribeye, roasted garlic butter, bordelaise, truffle frites, watercress.',
      tags: ['gf'],
    },
    {
      name: 'Seared Scallops',
      price: '$40',
      desc: 'Diver scallops, roasted corn succotash, bacon lardon, chive oil, lemon zest.',
      tags: ['gf', 'sig'],
    },
  ],
  desserts: [
    {
      name: 'Salted Caramel Pots de Crème',
      price: '$13',
      desc: 'Silky custard, sea salt caramel, vanilla Chantilly, hazelnut brittle.',
      tags: ['gf', 'sig'],
    },
    {
      name: 'Warm Chocolate Lava Cake',
      price: '$14',
      desc: 'Valrhona chocolate, molten center, Straus Family vanilla bean ice cream, raspberry coulis.',
      tags: ['v'],
    },
    {
      name: 'Seasonal Fruit Tart',
      price: '$12',
      desc: 'Buttery pastry shell, vanilla pastry cream, whichever fruit the season brings. Ask your server.',
      tags: ['v'],
    },
    {
      name: 'Artisan Cheese Board',
      price: '$22',
      desc: 'Three Northern California cheeses, honeycomb, marcona almonds, fig jam, walnut crisps.',
      tags: ['vg', 'gf'],
    },
  ],
  wine: [
    {
      name: 'Littorai Pinot Noir',
      price: '$22 / $88',
      desc: 'Sonoma Coast. Elegant, earthy Pinot with notes of dark cherry and forest floor. 2021 vintage.',
      tags: ['gf'],
    },
    {
      name: 'Flowers Chardonnay',
      price: '$19 / $76',
      desc: 'Sonoma Coast. Bright and mineral, with stone fruit and citrus. Perfect with our seafood menu.',
      tags: ['gf', 'sig'],
    },
    {
      name: 'House Rosé',
      price: '$13 / $52',
      desc: 'Dry Provençal-style rosé, strawberry, white peach. Our most-loved everyday pour.',
      tags: ['gf'],
    },
    {
      name: 'Coastal Spritz',
      price: '$14',
      desc: 'House-made elderflower cordial, Aperol, sparkling wine, fresh citrus, sea salt rim.',
      tags: ['vg'],
    },
    {
      name: 'Fog Point Negroni',
      price: '$16',
      desc: 'Hendrick\'s gin, Campari, Carpano Antica, kelp-infused simple syrup, expressed orange peel.',
      tags: ['sig'],
    },
    {
      name: 'Sparkling Water & Soft Drinks',
      price: '$5',
      desc: 'Topo Chico, house-made lemonades, seasonal switchel, and assorted non-alcoholic options.',
      tags: ['vg', 'gf'],
    },
  ],
}

export const tagLabels = {
  gf:  { label: 'GF',        className: 'tag-gf'  },
  vg:  { label: 'VG',        className: 'tag-vg'  },
  v:   { label: 'V',         className: 'tag-v'   },
  sig: { label: 'Signature', className: 'tag-sig' },
}
