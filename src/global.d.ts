export {};

declare global {
  interface LenientGlobalVariableTypes {
    game: never; // the type doesn't matter
  }
}
