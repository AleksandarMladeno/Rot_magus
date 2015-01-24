/*global RM, ROT*/
RM.actors = {
  'elf': {
    'name': 'Elf',
    'tile': {
      'x': 24 * 12,
      'y': 21
    },
    'chance': 0,
    'health': 90,
    'mana': 100,
    'strength': 14,
    'wisdom': 0,
    'agility': 6,
    'precision': 15,
    'inventory': [
      'arrows',
      'bow',
      'dagger',
      'elvenCloak'
    ]
  },
  'zombie': {
    'name': 'Zombie',
    'tile': {
      'x': 0,
      'y': 21 * 2
    },
    'chance': 6,
    'health': 10,
    'mana': 0,
    'strength': 12,
    'wisdom': 0,
    'agility': 4,
    'precision': 10
  },
  'skeleton': {
    'name': 'Skeleton',
    'tile': {
      'x': 24,
      'y': 21 * 2
    },
    'chance': 5,
    'health': 30,
    'mana': 0,
    'strength': 7,
    'wisdom': 0,
    'agility': 4,
    'precision': 7
  },
  'goblin': {
    'name': 'Goblin',
    'tile': {
      'x': 24 * 2,
      'y': 21 * 2
    },
    'chance': 4,
    'health': 30,
    'mana': 0,
    'strength': 15,
    'wisdom': 0,
    'agility': 4,
    'precision': 12
  },
  'hobgoblin': {
    'name': 'Hobgoblin',
    'tile': {
      'x': 24 * 3,
      'y': 21 * 2
    },
    'chance': 3,
    'health': 10,
    'mana': 0,
    'strength': 10,
    'wisdom': 0,
    'agility': 4,
    'precision': 15
  },
  'troll': {
    'name': 'Troll',
    'tile': {
      'x': 24 * 4,
      'y': 21 * 2
    },
    'chance': 2,
    'health': 100,
    'mana': 0,
    'strength': 20,
    'wisdom': 0,
    'agility': 4,
    'precision': 7
  }
};