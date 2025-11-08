import React, { useState, useEffect } from 'react';
import { LanguageSelector } from './components/LanguageSelector';
import { ExpansionList } from './components/ExpansionList';
import { InstanceList } from './components/InstanceList';
import { EncounterList } from './components/EncounterList';
import { AbilityDetails } from './components/AbilityDetails';
import { battleNetApi } from './services/battlenetApi';
import type { Locale, Expansion, Instance, EncounterDetail } from './types/types-index';

function App() {
  // 인증 정보 상태
  const [clientId, setClientId] = useState<string>('');
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // UI 상태
  const [locale, setLocale] = useState<Locale>('ko_KR');
  const [expansions, setExpansions] = useState<Expansion[]>([]);
  const [selectedExpansion, setSelectedExpansion] = useState<number | null>(null);
  const [instances, setInstances] = useState<Instance[]>([]);
  const [selectedInstance, setSelectedInstance] = useState<number | null>(null);
  const [selectedEncounter, setSelectedEncounter] = useState<number | null>(null);
  const [encounterDetail, setEncounterDetail] = useState<EncounterDetail | null>(null);

  // 상태 플래그
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Client ID와 Secret 업데이트 시 battleNetApi에 설정
   */
  useEffect(() => {
    if (clientId && clientSecret) {
      battleNetApi.setClientInfo(clientId, clientSecret);
      setIsAuthenticated(true);
      setError(null);
    } else {
      setIsAuthenticated(false);
    }
  }, [clientId, clientSecret]);

  /**
   * 초기 확장팩 목록 로드 (인증 후)
   */
  useEffect(() => {
    if (isAuthenticated) {
      loadExpansions();
    }
  }, [isAuthenticated, locale]);

  /**
   * 인증 정보 제출 핸들러
   */
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId.trim() || !clientSecret.trim()) {
      setError('Client ID와 Client Secret을 입력해주세요.');
      return;
    }
    battleNetApi.setClientInfo(clientId, clientSecret);
    setIsAuthenticated(true);
    loadExpansions();
  };

  /**
   * 확장팩 목록 로드
   */
  const loadExpansions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await battleNetApi.getExpansions(locale);
      setExpansions(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '확장팩 목록을 불러오는데 실패했습니다.';
      setError(errorMessage);
      console.error(err);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 확장팩 선택 시 인스턴스 목록 로드
   */
  useEffect(() => {
    if (selectedExpansion && isAuthenticated) {
      loadInstances(selectedExpansion);
    }
  }, [selectedExpansion, locale, isAuthenticated]);

  /**
   * 인스턴스 목록 로드
   */
  const loadInstances = async (expansionId: number) => {
    setLoading(true);
    setError(null);
    setSelectedInstance(null);
    setSelectedEncounter(null);
    setEncounterDetail(null);
    try {
      const data = await battleNetApi.getInstancesByExpansion(expansionId, locale);
      setInstances(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '인스턴스 목록을 불러오는데 실패했습니다.';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 보스 선택 시 상세 정보 로드
   */
  useEffect(() => {
    if (selectedEncounter && isAuthenticated) {
      loadEncounterDetail(selectedEncounter);
    }
  }, [selectedEncounter, locale, isAuthenticated]);

  /**
   * 보스 상세 정보 로드
   */
  const loadEncounterDetail = async (encounterId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await battleNetApi.getEncounterDetail(encounterId, locale);
      setEncounterDetail(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '보스 정보를 불러오는데 실패했습니다.';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 확장팩 선택 핸들러
   */
  const handleExpansionSelect = (expansionId: number) => {
    setSelectedExpansion(expansionId);
  };

  /**
   * 인스턴스 선택 핸들러
   */
  const handleInstanceSelect = (instanceId: number) => {
    setSelectedInstance(instanceId);
    setSelectedEncounter(null);
    setEncounterDetail(null);
  };

  /**
   * 보스 선택 핸들러
   */
  const handleEncounterSelect = (encounterId: number) => {
    setSelectedEncounter(encounterId);
  };

  /**
   * 초기화 핸들러
   */
  const handleReset = () => {
    setClientId('');
    setClientSecret('');
    setIsAuthenticated(false);
    setExpansions([]);
    setSelectedExpansion(null);
    setInstances([]);
    setSelectedInstance(null);
    setSelectedEncounter(null);
    setEncounterDetail(null);
    setError(null);
  };

  const selectedInstanceData = instances.find((inst) => inst.id === selectedInstance);

  return (
    <div className="min-h-screen bg-wow-dark text-white">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-wow-gold mb-2">
            ⚔️ WoW Journal Viewer
          </h1>
          <p className="text-gray-400">
            World of Warcraft 던전 & 레이드 보스 스킬 뷰어
          </p>
        </header>

        {/* 인증 영역 - 미인증 상태 */}
        {!isAuthenticated && (
          <div className="mb-8 bg-gray-900 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-wow-gold mb-4">🔐 Battle.Net 인증</h2>
            <p className="text-gray-300 mb-4">
              Battle.Net API를 사용하려면 Client ID와 Client Secret을 입력해주세요.
            </p>
            <p className="text-gray-400 text-sm mb-6">
              📖 <a
              href="https://develop.battle.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-wow-blue hover:underline"
            >
              Battle.Net Developer Portal
            </a>에서 Application을 생성하고 인증 정보를 발급받을 수 있습니다.
            </p>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Client ID
                </label>
                <input
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="예: a1b2c3d4e5f6g7h8i9j0"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-wow-blue"
                  autoComplete="off"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Client Secret
                </label>
                <input
                  type="password"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  placeholder="••••••••••••••••••••"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-wow-blue"
                  autoComplete="off"
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-2 bg-wow-blue hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
              >
                🔓 인증
              </button>
            </form>

            {error && (
              <div className="mt-4 bg-red-900 bg-opacity-50 border border-red-700 rounded-lg p-4">
                <p className="text-red-200">{error}</p>
              </div>
            )}
          </div>
        )}

        {/* 인증 성공 영역 - 인증 후 */}
        {isAuthenticated && (
          <>
            {/* 인증 정보 표시 및 초기화 */}
            <div className="mb-6 flex justify-between items-center bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-2">
                <span className="text-wow-gold text-lg">✅</span>
                <span className="text-gray-300">
                  인증됨 | Client ID: <span className="text-wow-blue font-mono">{clientId.substring(0, 8)}...</span>
                </span>
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
              >
                🔓 로그아웃
              </button>
            </div>

            {/* 언어 선택 */}
            <LanguageSelector currentLocale={locale} onLocaleChange={setLocale} />

            {/* 에러 메시지 */}
            {error && (
              <div className="bg-red-900 bg-opacity-50 border border-red-700 rounded-lg p-4 mb-6">
                <p className="text-red-200">{error}</p>
              </div>
            )}

            {/* 로딩 상태 */}
            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-wow-blue"></div>
                <p className="mt-4 text-gray-400">로딩 중...</p>
              </div>
            )}

            {/* 확장팩 목록 */}
            {!loading && expansions.length > 0 && (
              <ExpansionList
                expansions={expansions}
                selectedExpansion={selectedExpansion}
                onSelectExpansion={handleExpansionSelect}
                locale={locale}
              />
            )}

            {/* 인스턴스 목록 */}
            {!loading && selectedExpansion && instances.length > 0 && (
              <InstanceList
                instances={instances}
                selectedInstance={selectedInstance}
                onSelectInstance={handleInstanceSelect}
                locale={locale}
              />
            )}

            {/* 보스 목록 */}
            {!loading && selectedInstanceData && (
              <EncounterList
                encounters={selectedInstanceData.encounters}
                selectedEncounter={selectedEncounter}
                onSelectEncounter={handleEncounterSelect}
                locale={locale}
              />
            )}

            {/* 보스 상세 정보 */}
            {!loading && encounterDetail && (
              <AbilityDetails encounterDetail={encounterDetail} locale={locale} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;