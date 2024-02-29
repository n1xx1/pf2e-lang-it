import { ID } from ".";
import { libWrapper } from "./libwrapper";

declare global {
  interface CONFIG {
    TextEditor: {
      enrichers: {
        pattern: RegExp;
        enricher: Enricher;
      }[];
    };
  }

  interface EnrichmentOptions {
    async?: boolean;
    secrets?: boolean;
    documents?: boolean;
    links?: boolean;
    rolls?: boolean;
    rollData?: Record<string, unknown>;
  }

  type Enricher = (
    match: RegExpMatchArray,
    options: EnrichmentOptions,
  ) => Promise<HTMLElement | null>;

  interface InstancePool {
    rolls: DamageInstance[];
  }

  interface DamageRollConstructor {
    new (formula: string, data?: {}, options?: {}): DamageRoll;
    parse(formula: string, data: Record<string, unknown>): InstancePool;
  }

  interface AbstractDamageRoll extends Roll {}

  interface DamageRoll extends AbstractDamageRoll {
    instances: DamageInstance[];
  }

  interface DamageInstance extends AbstractDamageRoll {
    head: RollTerm;
  }
}

export function setupDamageRollExtension() {
  const DamageRoll = CONFIG.Dice.rolls.find(
    (cls) => cls.name === "DamageRoll",
  ) as DamageRollConstructor | undefined;
  if (!DamageRoll) {
    return;
  }

  const formatLabelInstances = (label: string, formula: string) => {
    if (!label.match(/\$[1-9]/)) {
      return label;
    }

    const roll = ((): DamageRoll | null => {
      try {
        return new DamageRoll(formula!);
      } catch {
        return null;
      }
    })();

    if (!roll) {
      return label;
    }

    const instances = roll.instances;
    for (let i = instances.length - 1; i >= 0; i--) {
      const instance = instances[i];
      label = label.replace(`$${i + 1}`, instance.head.expression);
    }
    return label;
  };

  libWrapper!.register(
    ID,
    "TextEditor._createInlineRoll",
    async function (
      wrapped,
      match: RegExpMatchArray,
      rollData: Record<string, unknown>,
      options: any,
    ) {
      const anchor: HTMLAnchorElement = await wrapped(match, rollData, options);
      const formula = anchor?.dataset.formula;
      const rollModes = ["roll", ...Object.values(CONST.DICE_ROLL_MODES)];
      if (!formula || !rollModes.includes(anchor.dataset.mode ?? "")) {
        return anchor;
      }

      const label = [...anchor.childNodes].find(
        (node) => node.nodeType == Node.TEXT_NODE,
      ) as Text | undefined;
      if (!label || !label.textContent) {
        return anchor;
      }

      label.textContent = formatLabelInstances(label.textContent, formula);
      return anchor;
    },
  );

  const damageEnricher = CONFIG.TextEditor.enrichers.find((x) =>
    x.pattern.source.includes("Damage"),
  );
  if (damageEnricher) {
    const originalEnricher = damageEnricher.enricher;
    damageEnricher.enricher = async (data, options) => {
      const anchor = await originalEnricher(data, options);

      const formula = anchor?.dataset.formula;
      if (!formula) {
        return anchor;
      }

      const label = anchor.querySelector("span");
      if (!label || !label.textContent) {
        return anchor;
      }

      label.textContent = formatLabelInstances(label.textContent, formula);
      return anchor;
    };
  }
}
