type DamageType =
  | "bludgeoning"
  | "piercing"
  | "slashing"
  | "bleed"
  | "vitality"
  | "void"
  | "acid"
  | "cold"
  | "electricity"
  | "fire"
  | "sonic"
  | "force"
  | "mental"
  | "poison"
  | "spirit"
  | "untyped";

type ArithmeticOperator = "+" | "-" | "*" | "/" | "%";

import terms = foundry.dice.terms;

export declare abstract class AbstractDamageRoll extends Roll {
  abstract get minimumValue(): number;
  abstract get expectedValue(): number;
  abstract get maximumValue(): number;
}

export declare class CheckRoll extends Roll {}

// legacy
export declare class StrikeAttackRoll extends CheckRoll {}

export declare class DamageRoll extends AbstractDamageRoll {
  constructor(formula: string, data?: {}, options?: {});
  get instances(): DamageInstance[];
  get minimumValue(): number;
  get expectedValue(): number;
  get maximumValue(): number;
  static override parse(
    formula: string,
    data: Record<string, unknown>,
  ): terms.RollTerm[];
}

type MaterialDamageEffect = keyof typeof CONFIG.PF2E.materialDamageEffects;

type CriticalDoublingRule = "double-damage" | "double-dice";

export declare class DamageInstance extends AbstractDamageRoll {
  kinds: Set<"damage" | "healing">;
  type: DamageType;
  persistent: boolean;
  materials: Set<MaterialDamageEffect>;
  critRule: CriticalDoublingRule | null;
  get minimumValue(): number;
  get expectedValue(): number;
  get maximumValue(): number;
  get head(): terms.RollTerm;
}

export interface ArithmeticExpressionData extends RollTermData {
  class?: "ArithmeticExpression";
  operator: ArithmeticOperator;
  operands: [RollTermData, RollTermData];
}

export declare class ArithmeticExpression extends terms.RollTerm<ArithmeticExpressionData> {
  operator: ArithmeticOperator;
  operands: [terms.RollTerm, terms.RollTerm];
  get expression(): string;
}

export interface GroupingData extends RollTermData {
  class?: "Grouping";
  term: RollTermData;
}

export declare class Grouping extends terms.RollTerm<GroupingData> {
  term: terms.RollTerm;
  get expression(): string;
}

export declare class InstancePool extends terms.PoolTerm {}

export interface IntermediateDieData extends RollTermData {
  class?: string;
  number: number | NumericTermData | FunctionTermData | GroupingData;
  faces: number | NumericTermData | FunctionTermData | GroupingData;
  die?: DieData | null;
}

export declare class IntermediateDie extends terms.RollTerm<IntermediateDieData> {
  number: number | terms.FunctionTerm | Grouping;
  faces: number | terms.FunctionTerm | Grouping;
  die: terms.Die | null;
  get expression(): string;
}
