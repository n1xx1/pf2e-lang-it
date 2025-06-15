import ChatLog from "@client/applications/sidebar/tabs/chat.mjs";
import CombatTracker from "@client/applications/sidebar/tabs/combat-tracker.mjs";
import CompendiumDirectory from "@client/applications/sidebar/tabs/compendium-directory.mjs";
import Hotbar from "@client/applications/ui/hotbar.mjs";
import EffectsCanvasGroup from "@client/canvas/groups/effects.mjs";
import { Region } from "@client/canvas/placeables/_module.mjs";
import AmbientLight from "@client/canvas/placeables/light.mjs";
import MeasuredTemplate from "@client/canvas/placeables/template.mjs";
import Actors from "@client/documents/collections/actors.mjs";

class TokenDocumentPF2e<
  TParent extends ScenePF2e | null = ScenePF2e | null,
> extends TokenDocument<TParent> {}

interface TokenDocumentPF2e<TParent extends ScenePF2e | null = ScenePF2e | null>
  extends TokenDocument<TParent> {}

export { TokenDocumentPF2e };

export class ActorPF2e<
  TParent extends TokenDocumentPF2e | null = TokenDocumentPF2e | null,
> extends Actor<TParent> {}

export class ActorsPF2e<
  TActor extends ActorPF2e<null>,
> extends Actors<TActor> {}

export class ChatMessagePF2e extends ChatMessage {}

export class EncounterPF2e extends Combat {}

export class ItemPF2e<
  TParent extends ActorPF2e | null = ActorPF2e | null,
> extends Item<TParent> {}

export class MacroPF2e extends Macro {}

class ScenePF2e extends Scene {}
interface ScenePF2e extends Scene {}

export { ScenePF2e };

export class UserPF2e extends User {}

export interface UserPF2e extends User {
  character: ActorPF2e<null> | null;
}

export class AmbientLightDocumentPF2e<
  TParent extends ScenePF2e | null = ScenePF2e | null,
> extends AmbientLightDocument<TParent> {}

export class ActiveEffectPF2e<
  TParent extends ActorPF2e | ItemPF2e | null,
> extends ActiveEffect<TParent> {}

export class ActorDeltaPF2e<
  TParent extends TokenDocumentPF2e | null,
> extends ActorDelta<TParent> {}

export class ChatLogPF2e extends ChatLog {}

export class CombatantPF2e<
  TParent extends EncounterPF2e | null = EncounterPF2e | null,
  TTokenDocument extends TokenDocumentPF2e | null = TokenDocumentPF2e | null,
> extends Combatant<TParent, TTokenDocument> {}

export class EncounterTrackerPF2e<
  TEncounter extends EncounterPF2e | null,
> extends CombatTracker<TEncounter> {}

export class CompendiumDirectoryPF2e extends CompendiumDirectory {}

export class HotbarPF2e extends Hotbar<MacroPF2e> {}

export class MeasuredTemplateDocumentPF2e<
  TParent extends ScenePF2e | null = ScenePF2e | null,
> extends MeasuredTemplateDocument<TParent> {}

class RegionDocumentPF2e<
  TParent extends ScenePF2e | null = ScenePF2e | null,
> extends RegionDocument<TParent> {}

interface RegionDocumentPF2e<
  TParent extends ScenePF2e | null = ScenePF2e | null,
> extends RegionDocument<TParent> {
  get object(): RegionPF2e<this>;
}

export { RegionDocumentPF2e };

export class RegionBehaviorPF2e<
  TParent extends RegionDocumentPF2e | null = RegionDocumentPF2e | null,
> extends RegionBehavior<TParent> {}

export class TileDocumentPF2e<
  TParent extends ScenePF2e | null = ScenePF2e | null,
> extends TileDocument<TParent> {}

export class EffectsCanvasGroupPF2e extends EffectsCanvasGroup {}

export class AmbientLightPF2e<
  TDocument extends AmbientLightDocumentPF2e = AmbientLightDocumentPF2e,
> extends AmbientLight<TDocument> {}

export class MeasuredTemplatePF2e<
  TDocument extends MeasuredTemplateDocumentPF2e<ScenePF2e | null> = MeasuredTemplateDocumentPF2e<ScenePF2e | null>,
> extends MeasuredTemplate<TDocument> {}

class TokenPF2e<
  TDocument extends TokenDocumentPF2e<any> = TokenDocumentPF2e,
> extends fc.placeables.Token<TDocument> {}

interface TokenPF2e<
  TDocument extends TokenDocumentPF2e<any> = TokenDocumentPF2e,
> extends fc.placeables.Token<TDocument> {}

export { TokenPF2e };

export class RegionPF2e<
  TDocument extends RegionDocumentPF2e = RegionDocumentPF2e,
> extends Region<TDocument> {}
