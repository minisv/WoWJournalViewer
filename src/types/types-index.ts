// TypeScript 타입 정의

export type Locale = 'ko_KR' | 'en_US' | 'zh_TW' | 'zh_CN' | 'ja_JP' | 'de_DE' | 'es_ES' | 'fr_FR' | 'it_IT' | 'pt_BR' | 'ru_RU';

export interface LocalizedString {
  ko_KR?: string;
  en_US?: string;
  zh_TW?: string;
  zh_CN?: string;
  ja_JP?: string;
  de_DE?: string;
  es_ES?: string;
  fr_FR?: string;
  it_IT?: string;
  pt_BR?: string;
  ru_RU?: string;
}

export interface KeyValue {
  key: {
    href: string;
  };
  name: LocalizedString;
  id: number;
}

export interface Expansion {
  id: number;
  name: LocalizedString;
  key: {
    href: string;
  };
}

export interface Instance {
  id: number;
  name: LocalizedString;
  map: {
    name: LocalizedString;
    id: number;
  };
  area?: {
    name: LocalizedString;
  };
  description?: LocalizedString;
  encounters: Encounter[];
  expansion: KeyValue;
  location: {
    name: LocalizedString;
  };
  modes: Array<{
    mode: {
      type: string;
      name: LocalizedString;
    };
    players: number;
    is_tracked: boolean;
  }>;
  media: {
    key: {
      href: string;
    };
    id: number;
  };
  minimum_level: number;
  category: {
    type: string;
  };
}

export interface Encounter {
  id: number;
  name: LocalizedString;
  description?: LocalizedString;
  key: {
    href: string;
  };
}

export interface EncounterDetail {
  id: number;
  name: LocalizedString;
  description: LocalizedString;
  creatures: Array<{
    id: number;
    name: LocalizedString;
    creature_display: {
      key: {
        href: string;
      };
      id: number;
    };
  }>;
  items: Array<{
    item: {
      key: {
        href: string;
      };
      name: LocalizedString;
      id: number;
    };
    quantity: number;
  }>;
  sections: Section[];
  instance: KeyValue;
  category: {
    type: string;
  };
  modes: Array<{
    mode: {
      type: string;
      name: LocalizedString;
    };
    players: number;
    is_tracked: boolean;
  }>;
}

export interface Section {
  id: number;
  title: LocalizedString;
  body_text?: LocalizedString;
  sections?: Section[];
  creature_display?: {
    key: {
      href: string;
    };
    id: number;
  };
  spell?: {
    key: {
      href: string;
    };
    name: LocalizedString;
    id: number;
  };
}

export interface ApiResponse<T> {
  _links: {
    self: {
      href: string;
    };
  };
  [key: string]: T | any;
}