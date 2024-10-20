export declare class TokenDocumentPF2e<
  TParent extends ScenePF2e | null = ScenePF2e | null,
> extends TokenDocument<TParent> {}

export declare class ActorPF2e<
  TParent extends TokenDocumentPF2e | null = TokenDocumentPF2e | null,
> extends Actor<TParent> {}

export declare class ActorsPF2e<
  TActor extends ActorPF2e<null>,
> extends Actors<TActor> {}

export declare class ChatMessagePF2e extends ChatMessage {}

export declare class EncounterPF2e extends Combat {}

export declare class ItemPF2e<
  TParent extends ActorPF2e | null = ActorPF2e | null,
> extends Item<TParent> {}

export declare class MacroPF2e extends Macro {}

export declare class ScenePF2e extends Scene {}

export declare class UserPF2e extends User<ActorPF2e<null>> {}

export declare class AmbientLightDocumentPF2e<
  TParent extends ScenePF2e | null = ScenePF2e | null,
> extends AmbientLightDocument<TParent> {}

export declare class ActiveEffectPF2e<
  TParent extends ActorPF2e | ItemPF2e | null,
> extends ActiveEffect<TParent> {}

export declare class ActorDeltaPF2e<
  TParent extends TokenDocumentPF2e | null,
> extends ActorDelta<TParent> {}

export declare class ChatLogPF2e extends ChatLog<ChatMessagePF2e> {}

export declare class CombatantPF2e<
  TParent extends EncounterPF2e | null = EncounterPF2e | null,
  TTokenDocument extends TokenDocumentPF2e | null = TokenDocumentPF2e | null,
> extends Combatant<TParent, TTokenDocument> {}

export declare class EncounterTrackerPF2e<
  TEncounter extends EncounterPF2e | null,
> extends CombatTracker<TEncounter> {}

export declare class CompendiumDirectoryPF2e extends CompendiumDirectory {}

export declare class HotbarPF2e extends Hotbar<MacroPF2e> {}

export declare class MeasuredTemplateDocumentPF2e<
  TParent extends ScenePF2e | null = ScenePF2e | null,
> extends MeasuredTemplateDocument<TParent> {}

export declare class RegionDocumentPF2e<
  TParent extends ScenePF2e | null = ScenePF2e | null,
> extends RegionDocument<TParent> {}

export declare class RegionBehaviorPF2e<
  TParent extends RegionDocumentPF2e | null = RegionDocumentPF2e | null,
> extends RegionBehavior<TParent> {}

export declare class TileDocumentPF2e<
  TParent extends ScenePF2e | null = ScenePF2e | null,
> extends TileDocument<TParent> {}

export declare class EffectsCanvasGroupPF2e extends EffectsCanvasGroup {}

export declare class AmbientLightPF2e<
  TDocument extends AmbientLightDocumentPF2e = AmbientLightDocumentPF2e,
> extends AmbientLight<TDocument> {}

export declare class MeasuredTemplatePF2e<
  TDocument extends MeasuredTemplateDocumentPF2e<ScenePF2e | null> = MeasuredTemplateDocumentPF2e<ScenePF2e | null>,
> extends MeasuredTemplate<TDocument> {}

export declare class TokenPF2e<
  TDocument extends TokenDocumentPF2e = TokenDocumentPF2e,
> extends Token<TDocument> {}

export declare class RegionPF2e<
  TDocument extends RegionDocumentPF2e = RegionDocumentPF2e,
> extends Region<TDocument> {}

export declare class RulerPF2e<
  TToken extends TokenPF2e | null = TokenPF2e | null,
> extends Ruler<TToken, UserPF2e> {}
