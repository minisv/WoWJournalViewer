import React from 'react';
import type { Encounter, Locale } from '../types/types-index';

interface EncounterListProps {
  encounters: Encounter[];
  selectedEncounter: number | null;
  onSelectEncounter: (encounterId: number) => void;
  locale: Locale;
}

export const EncounterList: React.FC<EncounterListProps> = ({
                                                              encounters,
                                                              selectedEncounter,
                                                              onSelectEncounter,
                                                              locale,
                                                            }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-wow-gold mb-4">보스 선택</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {encounters.map((encounter) => (
          <button
            key={encounter.id}
            onClick={() => onSelectEncounter(encounter.id)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedEncounter === encounter.id
                ? 'border-wow-purple bg-wow-purple bg-opacity-20'
                : 'border-gray-700 bg-gray-800 hover:border-wow-purple'
            }`}
          >
            <h4 className="font-semibold text-white text-center">
              {encounter.name[locale] || encounter.name.en_US}
            </h4>
          </button>
        ))}
      </div>
    </div>
  );
};