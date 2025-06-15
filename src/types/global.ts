import type Config from "@client/config.d.mts";
import type WallDocument from "@client/documents/wall.d.mts";
import type Game from "foundry-types/client/game.mjs";
import { Babele } from "./babele";
import type {
  ActiveEffectPF2e,
  ActorDeltaPF2e,
  ActorPF2e,
  ActorsPF2e,
  AmbientLightDocumentPF2e,
  AmbientLightPF2e,
  ChatLogPF2e,
  ChatMessagePF2e,
  CombatantPF2e,
  CompendiumDirectoryPF2e,
  EffectsCanvasGroupPF2e,
  EncounterPF2e,
  EncounterTrackerPF2e,
  HotbarPF2e,
  ItemPF2e,
  MacroPF2e,
  MeasuredTemplateDocumentPF2e,
  MeasuredTemplatePF2e,
  RegionBehaviorPF2e,
  RegionDocumentPF2e,
  RegionPF2e,
  ScenePF2e,
  TileDocumentPF2e,
  TokenDocumentPF2e,
  TokenPF2e,
  UserPF2e,
} from "./documents";
import type { ConditionManager } from "./system";

export interface GamePF2e
  extends Game<
    ActorPF2e<null>,
    ActorsPF2e<ActorPF2e<null>>,
    ChatMessagePF2e,
    EncounterPF2e,
    ItemPF2e<null>,
    MacroPF2e,
    ScenePF2e,
    UserPF2e
  > {
  pf2e: {
    ConditionManager: typeof ConditionManager;
  };
  babele: Babele;
}

export type ConfiguredConfig = Config<
  AmbientLightDocumentPF2e<ScenePF2e | null>,
  ActiveEffectPF2e<ActorPF2e | ItemPF2e | null>,
  ActorPF2e,
  ActorDeltaPF2e<TokenDocumentPF2e>,
  ChatLogPF2e,
  ChatMessagePF2e,
  EncounterPF2e,
  CombatantPF2e<EncounterPF2e | null, TokenDocumentPF2e>,
  EncounterTrackerPF2e<EncounterPF2e | null>,
  CompendiumDirectoryPF2e,
  HotbarPF2e,
  ItemPF2e,
  MacroPF2e,
  MeasuredTemplateDocumentPF2e,
  RegionDocumentPF2e,
  RegionBehaviorPF2e,
  TileDocumentPF2e,
  TokenDocumentPF2e,
  WallDocument<ScenePF2e | null>,
  ScenePF2e,
  UserPF2e,
  EffectsCanvasGroupPF2e
>;

export type StatusEffectIconTheme = "default" | "blackWhite";

type ConfigPreparationType =
  | "prepared"
  | "spontaneous"
  | "innate"
  | "focus"
  | "items"
  | "ritual";

type MagicTraditions = "arcane" | "divine" | "occult" | "primal";

type PreciousMaterial = string;

type MaterialDamageEffect = Extract<PreciousMaterial, string>;

export type EnergyDamageType =
  | "acid"
  | "cold"
  | "electricity"
  | "fire"
  | "force"
  | "sonic"
  | "vitality"
  | "void";

export type PhysicalDamageType =
  | "bleed"
  | "bludgeoning"
  | "piercing"
  | "slashing";

export type DamageType =
  | EnergyDamageType
  | PhysicalDamageType
  | "mental"
  | "poison"
  | "spirit"
  | "untyped";

export declare const PF2ECONFIG: {
  preparationType: Record<ConfigPreparationType, string>;
  magicTraditions: Record<MagicTraditions, string>;
  preciousMaterials: Record<PreciousMaterial, string>;
  materialDamageEffects: Record<MaterialDamageEffect, string>;
  damageTypes: Record<DamageType, string>;
};

export type CanvasPF2e = foundry.canvas.Canvas<
  ScenePF2e,
  AmbientLightPF2e<AmbientLightDocumentPF2e<ScenePF2e>>,
  MeasuredTemplatePF2e<MeasuredTemplateDocumentPF2e<ScenePF2e>>,
  TokenPF2e<TokenDocumentPF2e<ScenePF2e>>,
  EffectsCanvasGroupPF2e,
  RegionPF2e<RegionDocumentPF2e<ScenePF2e>>
>;
