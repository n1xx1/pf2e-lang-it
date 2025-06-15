import type {
  CanvasPF2e,
  ConfiguredConfig,
  GamePF2e,
  PF2ECONFIG,
} from "./types/global";

declare global {
  interface ConfigPF2e extends ConfiguredConfig {
    debug: ConfiguredConfig["debug"] & {
      ruleElement: boolean;
    };
    PF2E: typeof PF2ECONFIG;
    time: {
      roundTime: number;
    };
  }

  const CONFIG: ConfigPF2e;
  const canvas: CanvasPF2e;

  namespace globalThis {
    const game: GamePF2e;
    export import fa = foundry.applications;
    export import fav1 = foundry.appv1;
    export import fc = foundry.canvas;
    export import fd = foundry.documents;
    export import fh = foundry.helpers;
    export import fu = foundry.utils;
  }
}
