export interface DeityData {
  id: string;
  name: string;
  alignment: 'Lawful Good' | 'Good' | 'Unaligned' | 'Evil' | 'Chaotic Evil';
  domain: string;
  description: string;
}

export const DEITIES: DeityData[] = [
  // ── Lawful Good ────────────────────────────────────────────────────────────
  {
    id: 'bahamut',
    name: 'Bahamut',
    alignment: 'Lawful Good',
    domain: 'Justice, Protection, Nobility',
    description:
      'The Platinum Dragon, god of justice, protection, and noble greatness. Paladins, fighters, and those who defend the innocent revere him. He opposes Tiamat in all things.',
  },
  {
    id: 'moradin',
    name: 'Moradin',
    alignment: 'Lawful Good',
    domain: 'Creation, Earth, Protection',
    description:
      'The Soul Forger, god of creation, artisans, and family. Dwarves and craftspeople pray to Moradin for strength and excellence in their work. He shaped the dwarves from stone and breathed life into them.',
  },

  // ── Good ───────────────────────────────────────────────────────────────────
  {
    id: 'avandra',
    name: 'Avandra',
    alignment: 'Good',
    domain: 'Change, Freedom, Luck, Travel',
    description:
      'She Who Makes the Path, goddess of change, luck, trade, and travel. Avandra favors the bold and rewards risk-takers. Halflings, travelers, and merchants hold her in high regard.',
  },
  {
    id: 'pelor',
    name: 'Pelor',
    alignment: 'Good',
    domain: 'Hope, Life, Strength, Sun',
    description:
      'The Sun God, master of sun, agriculture, time, and seasons. Pelor is the most widely worshipped god among common folk. He hates undead and all things that flee from the light.',
  },

  // ── Unaligned ─────────────────────────────────────────────────────────────
  {
    id: 'corellon',
    name: 'Corellon',
    alignment: 'Unaligned',
    domain: 'Arcana, Beauty, Art',
    description:
      'The Runecarver, god of beauty, art, magic, and the fey. Eladrin and elves reverence Corellon, as do arcane spellcasters who appreciate the aesthetic craft of magic.',
  },
  {
    id: 'erathis',
    name: 'Erathis',
    alignment: 'Unaligned',
    domain: 'Civilization, Invention, Law',
    description:
      'The Law-Bringer, goddess of civilization, invention, and law. Erathis drives mortals to build cities, establish laws, and work together. She and Melora are often in conflict over the spreading of civilization.',
  },
  {
    id: 'ioun',
    name: 'Ioun',
    alignment: 'Unaligned',
    domain: 'Arcana, Knowledge, Prophecy',
    description:
      'The Knowing Mistress, goddess of knowledge, skill, and prophecy. Wizards, sages, and scholars pray to Ioun. She opposes Vecna, the god of dark secrets.',
  },
  {
    id: 'kord',
    name: 'Kord',
    alignment: 'Unaligned',
    domain: 'Storm, Strength, Battle',
    description:
      'The Storm Lord, god of storms, battle, and strength. Kord loves physical prowess and rewards those who display bravery in battle. Fighters and athletes often pay homage to him.',
  },
  {
    id: 'melora',
    name: 'Melora',
    alignment: 'Unaligned',
    domain: 'Sea, Storm, Wilderness',
    description:
      'The Wildmother, goddess of the wilderness and the sea. Druids, rangers, sailors, and those who live off the land or sea honor Melora. She seeks to preserve the wild places from the encroachment of civilization.',
  },
  {
    id: 'raven-queen',
    name: 'The Raven Queen',
    alignment: 'Unaligned',
    domain: 'Death, Fate, Winter',
    description:
      'The goddess of death, fate, and winter, whose name is unknown. She rules over the Shadowfell and governs the passage of souls. She opposes the undead, which she sees as an abomination.',
  },
  {
    id: 'sehanine',
    name: 'Sehanine',
    alignment: 'Unaligned',
    domain: 'Illusion, Love, Moon',
    description:
      'The Moonbow, goddess of illusion, love, and the moon. Sehanine is the patron of the moon and of those who travel at night. Rogues, tricksters, and lovers often pay her respect.',
  },

  // ── Evil ──────────────────────────────────────────────────────────────────
  {
    id: 'asmodeus',
    name: 'Asmodeus',
    alignment: 'Evil',
    domain: 'Domination, Tyranny',
    description:
      'The Lord of the Nine Hells, god of tyranny and domination. Asmodeus rules the devils and seeks to bring all of creation under his iron control. His servants enslave and subjugate.',
  },
  {
    id: 'bane',
    name: 'Bane',
    alignment: 'Evil',
    domain: 'Conquest, Tyranny, War',
    description:
      'The Black Hand, god of conquest, tyranny, and war. Bane seeks the absolute domination of all people through military conquest. Warlords and conquerors pray to him for victory.',
  },
  {
    id: 'tiamat',
    name: 'Tiamat',
    alignment: 'Evil',
    domain: 'Greed, Envy, Wealth',
    description:
      'The Dragon Queen, goddess of wealth, greed, and envy. Tiamat commands chromatic dragons and drives them to hoard treasure and terrorize mortals. She is the eternal enemy of Bahamut.',
  },
  {
    id: 'torog',
    name: 'Torog',
    alignment: 'Evil',
    domain: 'Imprisonment, Torture, Underdark',
    description:
      'The King that Crawls, god of the Underdark, imprisonment, and torture. Torog is revered by slavers, jailors, and those who dwell in darkness. He despises all gods who walk freely under the open sky.',
  },
  {
    id: 'vecna',
    name: 'Vecna',
    alignment: 'Evil',
    domain: 'Secrets, Undeath',
    description:
      'The Undying King, god of undead and dark secrets. Vecna seeks to accumulate forbidden knowledge and power over death. He opposes Ioun, destroying knowledge that others might use.',
  },
  {
    id: 'zehir',
    name: 'Zehir',
    alignment: 'Evil',
    domain: 'Darkness, Poison, Serpents',
    description:
      'The Cloaked Serpent, god of darkness, poison, and serpents. Zehir is revered by yuan-ti and assassins. He opposes Avandra, viewing freedom as an obstacle to his schemes.',
  },

  // ── Chaotic Evil ──────────────────────────────────────────────────────────
  {
    id: 'gruumsh',
    name: 'Gruumsh',
    alignment: 'Chaotic Evil',
    domain: 'Destruction, Slaughter, Storms',
    description:
      'He Who Watches, god of slaughter and destruction. Gruumsh drives orcs to war and slaughter without mercy. His one-eyed visage and howl of war inspires terror on any battlefield.',
  },
  {
    id: 'lolth',
    name: 'Lolth',
    alignment: 'Chaotic Evil',
    domain: 'Darkness, Lies, Spiders',
    description:
      'The Spider Queen, goddess of shadow, lies, and spiders. Lolth rules the drow and weaves endless webs of intrigue and betrayal. She drives her followers to ruthless competition and cruelty.',
  },
  {
    id: 'tharizdun',
    name: 'Tharizdun',
    alignment: 'Chaotic Evil',
    domain: 'Darkness, Entropy, Madness',
    description:
      'The Chained God, imprisoned deity of madness and entropy. Tharizdun seeks to unravel the fabric of existence itself. His few cultists are driven to madness by their devotion to nothingness.',
  },
];

export function getDeityById(id: string): DeityData | undefined {
  return DEITIES.find((d) => d.id === id);
}

export const DEITY_ALIGNMENT_ORDER: DeityData['alignment'][] = [
  'Lawful Good',
  'Good',
  'Unaligned',
  'Evil',
  'Chaotic Evil',
];
