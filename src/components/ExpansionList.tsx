import React from 'react';
import type { Expansion, Locale } from '../types/types-index';

interface ExpansionListProps {
  expansions: Expansion[];
  selectedExpansion: number | null;
  onSelectExpansion: (expansionId: number) => void;
  locale: Locale;
}

export const ExpansionList: React.FC<ExpansionListProps> = ({
                                                              expansions,
                                                              selectedExpansion,
                                                              onSelectExpansion,
                                                              locale,
                                                            }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-wow-gold mb-4">확장팩 선택</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {expansions.map((expansion) => (
          <button
            key={expansion.id}
            onClick={() => onSelectExpansion(expansion.id)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedExpansion === expansion.id
                ? 'border-wow-blue bg-wow-blue bg-opacity-20'
                : 'border-gray-700 bg-gray-800 hover:border-wow-blue'
            }`}
          >
            <h3 className="text-lg font-semibold text-white">
              {expansion.name[locale] || expansion.name.en_US}
            </h3>
          </button>
        ))}
      </div>
    </div>
  );
};