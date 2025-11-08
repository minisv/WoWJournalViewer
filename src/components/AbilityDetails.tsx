import React from 'react';
import type { EncounterDetail, Section, Locale } from '../types/types-index';

interface AbilityDetailsProps {
  encounterDetail: EncounterDetail;
  locale: Locale;
}

export const AbilityDetails: React.FC<AbilityDetailsProps> = ({
                                                                encounterDetail,
                                                                locale,
                                                              }) => {
  // 재귀적으로 섹션을 렌더링
  const renderSection = (section: Section, depth: number = 0) => {
    const marginLeft = depth * 20;
    const hasSpell = section.spell !== undefined;

    return (
      <div key={section.id} style={{ marginLeft: `${marginLeft}px` }} className="mb-4">
        <div className={`p-4 rounded-lg ${hasSpell ? 'bg-blue-900 bg-opacity-30 border border-blue-700' : 'bg-gray-800'}`}>
          <h4 className={`font-semibold mb-2 ${hasSpell ? 'text-wow-blue' : 'text-gray-300'}`}>
            {hasSpell && '⚡ '}
            {section.title[locale] || section.title.en_US}
          </h4>

          {section.spell && (
            <div className="mb-2 text-sm text-wow-gold">
              🔮 스킬 ID: {section.spell.id} | {section.spell.name[locale] || section.spell.name.en_US}
            </div>
          )}

          {section.body_text && (
            <p className="text-gray-300 text-sm whitespace-pre-wrap">
              {section.body_text[locale] || section.body_text.en_US}
            </p>
          )}
        </div>

        {section.sections && section.sections.length > 0 && (
          <div className="mt-2">
            {section.sections.map((subsection) => renderSection(subsection, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mb-8">
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
        <h2 className="text-3xl font-bold text-wow-purple mb-2">
          {encounterDetail.name[locale] || encounterDetail.name.en_US}
        </h2>

        {encounterDetail.description && (
          <p className="text-gray-300 mb-6">
            {encounterDetail.description[locale] || encounterDetail.description.en_US}
          </p>
        )}

        {/* 크리쳐 정보 */}
        {encounterDetail.creatures && encounterDetail.creatures.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-bold text-wow-gold mb-3">👹 등장 크리쳐</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {encounterDetail.creatures.map((creature) => (
                <div key={creature.id} className="bg-gray-800 p-3 rounded-lg">
                  <p className="text-white font-semibold">
                    {creature.name[locale] || creature.name.en_US}
                  </p>
                  <p className="text-sm text-gray-400">ID: {creature.id}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 보스 스킬 및 능력 */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-wow-gold mb-3">⚔️ 보스 스킬 & 능력</h3>
          {encounterDetail.sections && encounterDetail.sections.length > 0 ? (
            <div>
              {encounterDetail.sections.map((section) => renderSection(section))}
            </div>
          ) : (
            <p className="text-gray-400">이 보스의 스킬 정보가 없습니다.</p>
          )}
        </div>

        {/* 전리품 */}
        {encounterDetail.items && encounterDetail.items.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-bold text-wow-gold mb-3">💎 드랍 아이템</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {encounterDetail.items.map((item, index) => (
                <div key={index} className="bg-gray-800 p-3 rounded-lg">
                  <p className="text-wow-purple font-semibold">
                    {item.item.name[locale] || item.item.name.en_US}
                  </p>
                  <p className="text-sm text-gray-400">
                    ID: {item.item.id} | 수량: {item.quantity}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};