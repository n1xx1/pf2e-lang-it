export type ModuleDefinition = {
  module: string;
  lang: string;
  dir: string;
};

export type CompendiumMappingDefinition = Record<
  string,
  FieldMappingDefinition
>;

export type FieldMappingDefinition =
  | string
  | {
      path: string;
      converter: string;
    };

export type Converter<T = any> = (
  originalValue: T,
  translation: any,
  data: any,
  tc: TranslatedCompendium,
  translations: Record<string, unknown>
) => T;

declare global {
  class Babele {
    static instance?: Babele;

    static get(): Babele;

    modules: ModuleDefinition[];
    converters: Record<string, Converter>;
    packs: foundry.utils.Collection<TranslatedCompendium>;

    register(module: ModuleDefinition): void;

    registerConverters(converters: Record<string, Converter>): void;
  }

  class TranslatedCompendium {
    mapping: CompendiumMapping;

    translationsFor(data: any): any;
  }

  class CompendiumMapping {
    constructor(
      entityType: string,
      mapping?: CompendiumMappingDefinition,
      tc?: TranslatedCompendium
    );

    map(data: any, translations: any): any;
  }

  class FieldMapping {
    field: string;
    tc?: TranslatedCompendium;
    path: string;
    converter: Converter | null;
    dynamic: boolean;

    constructor(
      field: string,
      mapping: FieldMappingDefinition,
      tc?: TranslatedCompendium
    );
  }

  interface Game {
    babele: Babele;
  }
}
