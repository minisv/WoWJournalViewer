import React from 'react';
import type { Locale } from '../types/types-index';

interface LanguageSelectorProps {
  currentLocale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

const languages: { code: Locale; name: string; flag: string }[] = [
  { code: 'ko_KR', name: '한국어', flag: '🇰🇷' },
  { code: 'en_US', name: 'English', flag: '🇺🇸' },
  { code: 'zh_TW', name: '繁體中文', flag: '🇹🇼' },
  { code: 'zh_CN', name: '简体中文', flag: '🇨🇳' },
  { code: 'ja_JP', name: '日本語', flag: '🇯🇵' },
  { code: 'de_DE', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es_ES', name: 'Español', flag: '🇪🇸' },
  { code: 'fr_FR', name: 'Français', flag: '🇫🇷' },
  { code: 'it_IT', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt_BR', name: 'Português', flag: '🇧🇷' },
  { code: 'ru_RU', name: 'Русский', flag: '🇷🇺' },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
                                                                    currentLocale,
                                                                    onLocaleChange,
                                                                  }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        언어 선택 / Select Language
      </label>
      <select
        value={currentLocale}
        onChange={(e) => onLocaleChange(e.target.value as Locale)}
        className="w-full max-w-xs px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-wow-blue"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};