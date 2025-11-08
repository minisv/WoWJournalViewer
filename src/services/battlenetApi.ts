import axios from 'axios';
import type { Locale, Expansion, Instance, EncounterDetail } from '../types/types-index';

class BattleNetApiService {
  private clientId: string = '';
  private clientSecret: string = '';
  private region: string = 'kr';
  private accessToken: string = '';
  private tokenExpiry: number = 0;

  /**
   * Client ID와 Client Secret 설정
   */
  setClientInfo(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    // 기존 토큰 초기화
    this.accessToken = '';
    this.tokenExpiry = 0;
  }

  /**
   * 지역 설정 (기본값: kr)
   */
  setRegion(region: string) {
    this.region = region;
  }

  /**
   * OAuth 토큰 발급
   */
  async getAccessToken(): Promise<string> {
    // 입력값 검증
    if (!this.clientId || !this.clientSecret) {
      throw new Error('Client ID와 Client Secret을 먼저 설정해주세요.');
    }

    // 토큰이 유효하면 재사용
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const credentials = btoa(`${this.clientId}:${this.clientSecret}`);
      const response = await axios.post(
        `https://${this.region}.battle.net/oauth/token`,
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      this.accessToken = response.data.access_token;
      // 토큰 만료 시간 설정 (응답에서 받은 시간 - 5분 여유)
      this.tokenExpiry = Date.now() + (response.data.expires_in - 300) * 1000;
      return this.accessToken;
    } catch (error) {
      console.error('토큰 발급 실패:', error);
      throw new Error('Battle.Net 인증에 실패했습니다. Client ID와 Secret을 확인해주세요.');
    }
  }

  /**
   * API 요청 헬퍼
   */
  private async request<T>(endpoint: string, locale: Locale = 'ko_KR'): Promise<T> {
    const token = await this.getAccessToken();
    const response = await axios.get<T>(
      `https://${this.region}.api.blizzard.com${endpoint}`,
      {
        params: {
          namespace: `static-${this.region}`,
          locale: locale,
          access_token: token,
        },
      }
    );
    return response.data;
  }

  /**
   * 확장팩 목록 조회
   */
  async getExpansions(locale: Locale = 'ko_KR'): Promise<Expansion[]> {
    const data = await this.request<any>('/data/wow/journal-expansion/index', locale);
    return data.tiers || [];
  }

  /**
   * 특정 확장팩의 인스턴스 목록 조회
   */
  async getInstancesByExpansion(expansionId: number, locale: Locale = 'ko_KR'): Promise<Instance[]> {
    const instancesData = await this.request<any>('/data/wow/journal-instance/index', locale);
    const allInstances = instancesData.instances || [];

    // 각 인스턴스의 상세 정보를 가져와서 확장팩별로 필터링
    const detailedInstances = await Promise.all(
      allInstances.map(async (instance: any) => {
        try {
          const detail = await this.getInstanceDetail(instance.id, locale);
          return detail;
        } catch (error) {
          console.error(`인스턴스 ${instance.id} 조회 실패:`, error);
          return null;
        }
      })
    );

    return detailedInstances.filter(
      (instance): instance is Instance =>
        instance !== null && instance.expansion.id === expansionId
    );
  }

  /**
   * 인스턴스 상세 정보 조회
   */
  async getInstanceDetail(instanceId: number, locale: Locale = 'ko_KR'): Promise<Instance> {
    return await this.request<Instance>(`/data/wow/journal-instance/${instanceId}`, locale);
  }

  /**
   * 보스(Encounter) 상세 정보 조회
   */
  async getEncounterDetail(encounterId: number, locale: Locale = 'ko_KR'): Promise<EncounterDetail> {
    return await this.request<EncounterDetail>(`/data/wow/journal-encounter/${encounterId}`, locale);
  }

  /**
   * 던전과 레이드 분류
   */
  categorizeInstances(instances: Instance[]): { dungeons: Instance[]; raids: Instance[] } {
    const dungeons = instances.filter(instance => instance.category.type === 'DUNGEON');
    const raids = instances.filter(instance => instance.category.type === 'RAID');
    return { dungeons, raids };
  }

  /**
   * 인증 여부 확인
   */
  isAuthenticated(): boolean {
    return !!this.clientId && !!this.clientSecret;
  }
}

export const battleNetApi = new BattleNetApiService();