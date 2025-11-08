import React from 'react';
import type { Instance, Locale } from '../types/types-index';

interface InstanceListProps {
  instances: Instance[];
  selectedInstance: number | null;
  onSelectInstance: (instanceId: number) => void;
  locale: Locale;
}

export const InstanceList: React.FC<InstanceListProps> = ({
                                                            instances,
                                                            selectedInstance,
                                                            onSelectInstance,
                                                          }) => {
  // 던전과 레이드 분류
  const dungeons = instances.filter((inst) => inst.category.type === 'DUNGEON');
  const raids = instances.filter((inst) => inst.category.type === 'RAID');

  const renderInstanceGroup = (title: string, instanceList: Instance[]) => {
    if (instanceList.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-xl font-bold text-wow-purple mb-3">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {instanceList.map((instance) => (
            <button
              key={instance.id}
              onClick={() => onSelectInstance(instance.id)}
              className={`p-3 rounded-lg border transition-all text-left ${
                selectedInstance === instance.id
                  ? 'border-wow-gold bg-wow-gold bg-opacity-10'
                  : 'border-gray-700 bg-gray-800 hover:border-wow-gold'
              }`}
            >
              <p className="text-sm text-gray-400 mt-1">
                {instance.name}<br/>
                보스: {instance.encounters.length}개
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-wow-gold mb-4">던전 & 레이드</h2>
      {renderInstanceGroup('🏰 던전 (Dungeons)', dungeons)}
      {renderInstanceGroup('🔥 레이드 (Raids)', raids)}
    </div>
  );
};