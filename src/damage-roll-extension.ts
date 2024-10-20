import { ID } from ".";
import { libWrapper } from "./libwrapper";
import { DamageType } from "./types/global";
import type * as types from "./types/rolls";

export function setupDamageRollExtension() {
  loadRollClasses();

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

const damageMap: Record<
  Exclude<DamageType, "untyped">,
  string | { singular: string; plural: string }
> = {
  acid: "da acido",
  bleed: "da sanguinamento",
  cold: "da freddo",
  electricity: "da elettricità",
  fire: "da fuoco",
  force: "da forza",
  poison: "da veleno",
  spirit: "da spirito",
  bludgeoning: {
    plural: "contundenti",
    singular: "contundente",
  },
  piercing: {
    plural: "perforanti",
    singular: "perforante",
  },
  slashing: {
    plural: "taglienti",
    singular: "tagliente",
  },
  mental: {
    plural: "mentali",
    singular: "mentale",
  },
  sonic: {
    plural: "sonori",
    singular: "sonoro",
  },
  vitality: {
    plural: "positivi",
    singular: "positivo",
  },
  void: {
    plural: "negativi",
    singular: "negativo",
  },
};

let CheckRoll: typeof types.CheckRoll;
let StrikeAttackRoll: typeof types.StrikeAttackRoll;
let DamageRoll: typeof types.DamageRoll;
let DamageInstance: typeof types.DamageInstance;
let ArithmeticExpression: typeof types.ArithmeticExpression;
let Grouping: typeof types.Grouping;
let InstancePool: typeof types.InstancePool;
let IntermediateDie: typeof types.IntermediateDie;

function loadRollClasses() {
  const rolls = Object.fromEntries(CONFIG.Dice.rolls.map((c) => [c.name, c]));
  const terms = CONFIG.Dice.termTypes;

  CheckRoll = rolls.CheckRoll as any;
  StrikeAttackRoll = rolls.StrikeAttackRoll as any;
  DamageRoll = rolls.DamageRoll as any;
  DamageInstance = rolls.DamageInstance as any;
  ArithmeticExpression = terms.ArithmeticExpression as any;
  Grouping = terms.Grouping as any;
  InstancePool = terms.InstancePool as any;
  IntermediateDie = terms.IntermediateDie as any;
}

function damageInstanceFormula(
  instance: types.DamageInstance,
): [expr: string, damage: string, flavor: string] {
  const plural = instance.isDeterministic && instance.expectedValue !== 1;
  let parts: string[] = [];
  if (instance.type !== "untyped") {
    const type = damageMap[instance.type];
    parts.push(
      typeof type === "string" ? type : type[plural ? "plural" : "singular"],
    );
  }
  if (instance.persistent && instance.type !== "bleed") {
    parts.push(plural ? "persistenti" : "persistente");
  }
  return [
    instance.head.expression,
    plural ? "danni" : "danno",
    parts.join(" "),
  ];
}

function damageRollFormula(roll: types.DamageRoll) {
  // Backward compatibility for pre-instanced damage rolls
  const firstInstance = roll.instances.at(0);
  if (!firstInstance) {
    return roll.formula;
  } else if (
    roll.instances.length === 1 &&
    firstInstance.head instanceof Grouping
  ) {
    const instanceFormula = damageInstanceFormula(firstInstance)
      .filter((x) => !!x)
      .join(" ");
    return instanceFormula.startsWith("(")
      ? instanceFormula.slice(1).replace(/\)([^)]*)$/i, "$1")
      : instanceFormula;
  }

  return roll.instances
    .map((i) =>
      damageInstanceFormula(i)
        .filter((x) => !!x)
        .join(" "),
    )
    .join(" più ");
}

function formatLabelInstances(label: string, formula: string) {
  if (!label.match(/(\$|\#[tTlL])[1-9]/) || label !== "#") {
    return label;
  }

  const roll = ((): types.DamageRoll | null => {
    try {
      return new DamageRoll(formula!);
    } catch {
      return null;
    }
  })();

  if (!roll) {
    return label;
  }

  if (label === "#") {
    return damageRollFormula(roll);
  }

  const instances = roll.instances;
  for (let i = instances.length - 1; i >= 0; i--) {
    const [expression, damage, type] = damageInstanceFormula(instances[i]);
    label = label.replace(`(\\$|#[tTlL])${i + 1}`, (m, k) => {
      switch (k) {
        case "$":
          return expression;
        case "#t":
        case "#T":
          return type;
        case "#l":
        case "#L":
          return damage;
        default:
          return m;
      }
    });
  }
  return label;
}
