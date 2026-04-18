export const menuCategories = [
  { id: 'starters', label: 'Starters'      },
  { id: 'mains',    label: 'Main Courses'  },
  { id: 'desserts', label: 'Desserts'      },
  { id: 'wine',     label: 'Wine & Drinks' },
]

export const menuItems = {
  starters: [
    {
      name:  'Crudo of Hamachi',
      price: '$18',
      desc:  'Grated Carrots & Radishes, Basil, Lemon Juice, Sesame Oil',
      tags:  ['gf'],
    },
    {
      name:  'Caesar Salad',
      price: '$15',
      desc:  'Eggless Dressing, Romaine Lettuce, Parmesan Cheese, Croutons',
      tags:  ['v'],
    },
    {
      name:  'Roasted Asparagus & Maitake Mushroom Salad',
      price: '$19',
      desc:  'Mixed Lettuces, Chopped Eggs, Pistachios, Manchego Cheese, Ranch Dressing',
      tags:  ['v', 'gf'],
    },
    {
      name:  'Purée of Leek & Potato Soup',
      price: '$14',
      desc:  'Parmesan Cheese & Sourdough Croutons',
      tags:  ['v'],
    },
    {
      name:  'Pan Roasted Hokkaido Scallops',
      price: '$24',
      desc:  'Sunchoke Purée, Pickled Shiitake Mushroom, Fennel, Radish, Arugula',
      tags:  ['gf', 'sig'],
    },
    {
      name:  'Salad of Charred Octopus and Roasted Cauliflower',
      price: '$24',
      desc:  'Smoked Pepper Aioli, Brussels Sprouts, Arugula, Toasted Almonds',
      tags:  ['gf'],
    },
    {
      name:  'Dungeness Crab Cake',
      price: '$26',
      desc:  'Orange Segments, Avocado, Mixed Lettuces, Remoulade Sauce',
      tags:  ['sig'],
    },
  ],
  mains: [
    {
      name:  'Mediterranean Fish Stew',
      price: '$36',
      desc:  'Salmon, Rock Cod, Calamari, Mussels, Potatoes, Tomato & Fennel Broth',
      tags:  ['gf', 'sig'],
    },
    {
      name:  'Pan Roasted Petrale Sole',
      price: '$40',
      desc:  'Black Rice, Roasted Carrots & Mushrooms, Lettuce, Lemon Butter Sauce',
      tags:  ['gf'],
    },
    {
      name:  'Homemade Campanelle Pasta',
      price: '$35',
      desc:  'Lamb Sausage, English Peas, Mint, Spinach, Feta Cheese',
      tags:  [],
    },
    {
      name:  'Liberty Farms Duck Breast',
      price: '$40',
      desc:  'Sautéed Cabbage, Shiitake Mushrooms, Fingerling Potatoes, Duck Jus',
      tags:  ['gf'],
    },
    {
      name:  'Akaushi American Wagyu Strip Steak',
      price: '$54',
      desc:  'Potato Purée, Sautéed Broccolini & King Trumpet Mushrooms, Bordelaise Sauce',
      tags:  ['gf', 'sig'],
    },
    {
      name:  "Beeler's Duroc Pork Chop",
      price: '$40',
      desc:  'Bluelake Beans, Roasted Mushrooms, Braised Leeks, Farro, Almonds',
      tags:  [],
    },
  ],
  desserts: [
    {
      name:  'Carrot Cake',
      price: '$14',
      desc:  'Cream Cheese Frosting, Toasted Coconut Chips, Candied Walnuts, Vanilla Bean Sauce',
      tags:  ['v'],
    },
    {
      name:  'Crème Fraîche Cheese Cake',
      price: '$14',
      desc:  'Raspberry & Vanilla Sauce',
      tags:  ['v'],
    },
    {
      name:  'Sourdough Bread Pudding',
      price: '$14',
      desc:  'Roasted Pears, Caramel & Vanilla Bean Sauce, Whipped Cream, Candied Pecans',
      tags:  ['v', 'sig'],
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
