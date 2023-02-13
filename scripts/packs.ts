import { CompendiumMappingDefinition } from "../src/babele";

const ID = "pf2e-lang-it";

const actorMappings: CompendiumMappingDefinition = {
  name: "name",
  description: "system.description.value",
  items: {
    path: "items",
    converter: `${ID}-fromPack`,
  },
  hazardDisable: "system.details.disable",
  hazardReset: "system.details.reset",
  hazardRoutine: "system.details.routine",
  npcSpeed: {
    path: "system.attributes.speed",
    converter: `${ID}-speed`,
  },
  npcOtherSpeeds: {
    path: "system.attributes.speed.otherSpeeds",
    converter: `${ID}-otherSpeeds`,
  },
  npcHp: "system.attributes.hp.details",
  npcAc: "system.attributes.ac.details",
  npcAllSaves: "system.attributes.allSaves.value",
  npcSenses: "system.traits.senses.value",
};

const itemMappings: CompendiumMappingDefinition = {
  name: "name",
  description: "system.description.value",
};

const itemFeatsMappings: CompendiumMappingDefinition = {
  ...itemMappings,
  featPrerequisites: {
    converter: `${ID}-list`,
    path: "system.prerequisites.value",
  },
};

const itemSpellMappings: CompendiumMappingDefinition = {
  ...itemMappings,
  spellMaterials: "system.materials.value",
  spellTarget: "system.target.value",
  spellCost: "system.cost.value",
  spellRange: {
    converter: `${ID}-range`,
    path: "system.range.value",
  },
  spellTime: {
    converter: `${ID}-time`,
    path: "system.time.value",
  },
  spellDuration: {
    converter: `${ID}-time`,
    path: "system.duration.value",
  },
  spellArea: "system.area.details",
  spellHeightening: {
    converter: `${ID}-heightening`,
    path: "system.heightening.levels",
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
  "spells-srd": itemSpellMappings,
  actionspf2e: itemFeatsMappings,
  ancestries: itemFeatsMappings,
  ancestryfeatures: itemFeatsMappings,
  backgrounds: itemFeatsMappings,
  classes: itemFeatsMappings,
  classfeatures: itemFeatsMappings,
  "familiar-abilities": itemFeatsMappings,
  "feats-srd": itemFeatsMappings,
  heritages: itemFeatsMappings,
  "bestiary-effects": itemFeatsMappings,
  domains: itemFeatsMappings,
  "boons-and-curses": itemFeatsMappings,
  conditionitems: itemFeatsMappings,
  "campaign-effects": itemFeatsMappings,
  "equipment-effects": itemFeatsMappings,
  "other-effects": itemFeatsMappings,
  "feat-effects": itemFeatsMappings,
  // "pathfinder-society-boons": {},
  "spell-effects": itemFeatsMappings,
  "equipment-srd": itemFeatsMappings,
  deities: itemFeatsMappings,
  // "iconics": {},
  // "paizo-pregens": {},
  // "rollable-tables": {},
  // "criticaldeck": {},
  // "hero-point-deck": {},
  journals: journalMappings,
  "gmg-srd": itemFeatsMappings,
  // "action-macros": {},
  // "pf2e-macros": {},
  "bestiary-ability-glossary-srd": itemFeatsMappings,
  "bestiary-family-ability-glossary": itemFeatsMappings,
  "adventure-specific-actions": itemFeatsMappings,
};
