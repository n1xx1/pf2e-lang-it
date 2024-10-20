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
  var game: GamePF2e;
}
