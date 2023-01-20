import { CompendiumMappingDefinition } from "../src/babele";

const actorMappings: CompendiumMappingDefinition = {
  name: "name",
  description: "system.description.value",
  items: {
    path: "items",
    converter: "pf2e-lang-it-fromPack",
  },
  hazardDisable: "system.details.disable",
  hazardReset: "system.details.reset",
  hazardRoutine: "system.details.routine",
};

const itemMappings: CompendiumMappingDefinition = {
  name: "name",
  description: "system.description.value",
  spellMaterials: "system.materials.value",
  spellTarget: "system.target.value",
  spellCost: "system.cost.value",
  spellRange: {
    converter: "pf2e-lang-it-range",
    path: "system.range.value",
  },
  spellTime: {
    converter: "pf2e-lang-it-time",
    path: "system.time.value",
  },
  featPrerequisites: {
    converter: "pf2e-lang-it-list",
    path: "system.prerequisites.value",
  },
};

const journalMappings: CompendiumMappingDefinition = {
  name: "name",
  description: "content",
  pages: {
    path: "pages",
    converter: "pages",
  },
};

export const packs: Record<string, CompendiumMappingDefinition> = {
  "abomination-vaults-bestiary": actorMappings,
  "age-of-ashes-bestiary": actorMappings,
  "agents-of-edgewatch-bestiary": actorMappings,
  // "april-fools-bestiary": {},
  "book-of-the-dead-bestiary": actorMappings,
  "blood-lords-bestiary": actorMappings,
  // "blog-bestiary": {},
  "extinction-curse-bestiary": actorMappings,
  "fall-of-plaguestone-bestiary": actorMappings,
  "fists-of-the-ruby-phoenix-bestiary": actorMappings,
  hazards: actorMappings,
  "lost-omens-impossible-lands-bestiary": actorMappings,
  "lost-omens-mwangi-expanse-bestiary": actorMappings,
  "lost-omens-monsters-of-myth-bestiary": actorMappings,
  "lost-omens-travel-guide-bestiary": actorMappings,
  "malevolence-bestiary": actorMappings,
  "menace-under-otari-bestiary": actorMappings,
  "npc-gallery": actorMappings,
  "one-shot-bestiary": actorMappings,
  "outlaws-of-alkenstar-bestiary": actorMappings,
  "kingmaker-bestiary": actorMappings,
  "pathfinder-bestiary": actorMappings,
  "pathfinder-bestiary-2": actorMappings,
  "pathfinder-bestiary-3": actorMappings,
  "pathfinder-dark-archive": actorMappings,
  // "pfs-introductions-bestiary": {},
  // "pfs-season-1-bestiary": {},
  // "pfs-season-2-bestiary": {},
  // "pfs-season-3-bestiary": {},
  // "pfs-season-4-bestiary": {},
  "quest-for-the-frozen-flame-bestiary": actorMappings,
  "shadows-at-sundown-bestiary": actorMappings,
  "strength-of-thousands-bestiary": actorMappings,
  "the-slithering-bestiary": actorMappings,
  "troubles-in-otari-bestiary": actorMappings,
  "night-of-the-gray-death-bestiary": actorMappings,
  "crown-of-the-kobold-king-bestiary": actorMappings,
  vehicles: actorMappings,
  actionspf2e: itemMappings,
  ancestries: itemMappings,
  ancestryfeatures: itemMappings,
  backgrounds: itemMappings,
  classes: itemMappings,
  classfeatures: itemMappings,
  "familiar-abilities": itemMappings,
  "feats-srd": itemMappings,
  heritages: itemMappings,
  "spells-srd": itemMappings,
  "bestiary-effects": itemMappings,
  domains: itemMappings,
  "boons-and-curses": itemMappings,
  conditionitems: itemMappings,
  "campaign-effects": itemMappings,
  "equipment-effects": itemMappings,
  "other-effects": itemMappings,
  "feat-effects": itemMappings,
  // "pathfinder-society-boons": {},
  "spell-effects": itemMappings,
  "equipment-srd": itemMappings,
  deities: itemMappings,
  // "iconics": {},
  // "paizo-pregens": {},
  // "rollable-tables": {},
  // "criticaldeck": {},
  // "hero-point-deck": {},
  journals: journalMappings,
  "gmg-srd": itemMappings,
  // "action-macros": {},
  // "pf2e-macros": {},
  "bestiary-ability-glossary-srd": itemMappings,
  "bestiary-family-ability-glossary": itemMappings,
  "adventure-specific-actions": itemMappings,
};
