export {};

declare class ConditionManager {
  static initialize(): void;
}

declare global {
  interface LenientGlobalVariableTypes {
    game: never; // the type doesn't matter
  }

  interface Game {
    pf2e: {
      ConditionManager: typeof ConditionManager;
    };
  }
}
