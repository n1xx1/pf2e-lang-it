import { fromPackPf2 } from "./converter-from-pack";

Hooks.once("init", () => {
  if (typeof Babele === "undefined") {
    return;
  }

  Babele.get().register({
    module: "pf2e-lang-it",
    lang: "it",
    dir: "lang/compendiums",
  });

  Babele.get().registerConverters({
    "pf2e-lang-it-fromPack": fromPackPf2,
  });
});
