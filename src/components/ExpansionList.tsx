import React from 'react';
import type { Expansion, Locale } from '../types/types-index';

interface ExpansionListProps {
  expansions: Expansion[];
  selectedExpansion: number | null;
  onSelectExpansion: (expansionId: number) => void;
  locale: Locale;
  loading?: boolean;
}

export const ExpansionList: React.FC<ExpansionListProps> = ({
                                                              expansions,
                                                              selectedExpansion,
                                                              onSelectExpansion,
                                                              loading = false,
                                                            }) => {
  if (expansions.length === 0 && !loading) {
    return (
      <div className="mb-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
        <p className="text-gray-400">로드된 확장팩이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-wow-gold mb-4">📚 확장팩 선택</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {expansions.map((expansion) => {
          const isSelected = selectedExpansion === expansion.id;

          return (
            <button
              key={expansion.id}
              onClick={() => onSelectExpansion(expansion.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                isSelected
                  ? 'border-wow-blue bg-wow-blue bg-opacity-20 shadow-lg shadow-wow-blue'
                  : 'border-gray-700 bg-gray-800 hover:border-wow-blue hover:shadow-md hover:shadow-wow-blue'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mt-1">
                    {expansion.name}
                  </p>
                </div>
                {isSelected && (
                  <span className="text-wow-gold text-lg ml-2">✓</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};