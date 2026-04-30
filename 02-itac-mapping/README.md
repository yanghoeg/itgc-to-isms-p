# 02-itac-mapping

ITAC(IT Application Controls, 응용 통제) → ISMS-P 매핑.

ITGC가 정보시스템 인프라·접근·변경의 **일반 통제**라면, ITAC는 개별 응용프로그램(ERP·HR·회계·SCM 등) 안에서 **개별 트랜잭션의 정합성·완전성·정확성·타당성**을 보장하는 통제다.

> 작성 진행 중. ITGC 영역(`01-itgc-mapping/`) 우선. ITAC는 ITGC가 일정 수준 채워진 후 본격 매핑.

## 1. ITAC란 무엇인가

| 비교 항목 | ITGC | ITAC |
|---|---|---|
| 통제 대상 | 정보시스템 인프라·접근·변경·운영 | 응용 시스템 내부의 개별 트랜잭션 |
| 적용 범위 | 시스템 전반 (OS·DB·네트워크·앱 공통) | 응용 시스템별·프로세스별로 다름 |
| 통제 성격 | Pervasive control (전반) | Process-level control (프로세스 단위) |
| 회계감사 의존도 | 자동통제 신뢰의 **전제 조건** | ITGC 신뢰가 확보되면 자동통제 1건 샘플로 검증 |
| 표준 분류 | 4영역 합의 강함 (APD/PC/CO/PD) | **표준 분류 약함** (아래 §3 참조) |
| 식별 방법 | 시스템 단위로 점검 항목 list화 | 비즈니스 프로세스 risk 분석에서 도출 |

**핵심 관계**: ITGC가 약하면 ITAC도 신뢰 못함. ITGC가 effective여야 ITAC 자동통제를 1건 샘플로 검증 가능 (AICPA SAS 39 / PCAOB AS 2315).

## 2. ITAC 예시

| 프로세스 | 자동통제 예시 | 통제 성격 |
|---|---|---|
| 매출 (O2C) | 신용한도 초과 시 자동 hold, 단가·할인율 마스터 강제 적용, 세금계산서 자동 발행 | 입력 검증·계산·출력 |
| 매입 (P2P) | 발주 → 입고 → 송장 3-way matching, 단가 차이 임계 초과 시 결재 routing | 입력 검증·승인 routing |
| 재고 | 음수 재고 차단, 원가 계산 자동 (선입선출/이동평균), BOM 기반 자재 소요량 계산 | 검증·계산 |
| 결산 | 마감 후 전표 입력 차단, 마감 차이 자동 분개, IFRS/K-IFRS 자동 환산 | 권한·계산 |
| HR/급여 | 4대보험·소득세 자동 산정, 휴가 잔여 자동 차감, 퇴직금 자동 누적 | 계산 |
| 일반 (cross-process) | 사용자 권한별 화면·필드 lock, 필수 입력 항목 강제, 마스터 데이터 변경 승인 routing | 권한·검증 |

이 자동통제들은 모두 응용 시스템(ERP) 안에 코드 또는 설정으로 구현되어 있음. ITGC(시스템 변경관리)가 통제되면 한번 검증한 자동통제가 1년 내내 동일하게 작동한다고 신뢰 가능.

## 3. 회계사 세상의 ITAC 분류 — 왜 표준이 약한가

ITGC는 4영역 합의(APD/PC/CO/PD)가 강한데, ITAC는 그렇지 않다. 회계사 세상에서 자주 인용되는 분류:

| 출처 | 분류 | 비고 |
|---|---|---|
| **COBIT 4.1 (가장 클래식)** | 3영역: Input / Processing / Output | 1990년대~. 가장 자주 인용되지만 너무 일반적 |
| **빅4 방법론 일반화 (CACIR)** | 5영역: Configuration / Authorization / Calculation / Interface / Report(IPE) | 빅4 내부 방법론마다 약간씩 다름. 표준화된 명칭 X |
| **PCAOB AS 2201** | "Automated controls"라는 큰 묶음만 사용 | 카테고리 명시 X. risk-based로 개별 식별 |
| **AICPA SAS 145** | Application controls를 "configuration / calculation / validation / restriction" trait로 설명 | 분류 카테고리는 아님 |
| **한국 회계법인 실무** | 프로세스별(매출/매입/재고/결산/HR)로 묶음 | 영역 분류 X. risk-based 식별 |

**왜 양획 기억에 "몇 개 의미 없이" 남았는가**:
- ITAC 분류는 ITGC만큼 강한 합의가 없음
- 빅4도 내부적으로 분류명이 다름 (Configuration vs Configurable Control 등)
- 한국 회계법인 실무는 "프로세스별 자동통제 list"가 디폴트라 카테고리 자체를 잘 안 씀
- 한국어로 "응용 통제 분류" 검색하면 1차 자료 거의 없음

### 본 레포의 입장 — CACIR은 reference만, 매핑은 프로세스 단위

CACIR(또는 그 변종)이 빅4 방법론에서 사실상 국룰처럼 인용되지만, 본 레포는 **CACIR을 매핑 축으로 사용하지 않는다.** 이유:

1. **분류해도 검증 절차가 안 갈라진다** — ITGC 4영역(APD/PC/CO/PD)은 분류하면 검증 절차가 실제로 달라진다 (접근 권한 검토 ≠ 변경 승인 검토 ≠ 백업 점검 ≠ 개발방법론). CACIR은 분류해놓고 정작 검증 단계에서는 "자동통제 1건 샘플 + ITGC 일반통제 의존"으로 다 똑같이 처리한다. **분류가 절차를 바꾸지 않으면 그 분류는 죽은 분류다.**
2. **한 통제가 여러 카테고리에 동시에 걸친다** — 예: 신용한도 자동 hold = Configuration(임계 설정) + Authorization(권한 routing) + Validation(검증) 모두 해당. 카테고리 boundary가 안 잡힌다. ITGC 4영역은 한 통제가 한 영역에만 떨어진다.
3. **표준 명칭이 아니다** — PCAOB AS 2201, AICPA SAS 145 어디에도 "CACIR"이라는 명칭은 없다. 빅4 internal slang이고, 빅4마다 명칭이 약간씩 다르다 (CACIR / CARS / CAVR / Configurable Controls 등). 한국에 표준 번역도 없다.
4. **한국 회계법인 실무는 이미 프로세스 단위로 돌아간다** — 매출주기·매입주기·재고·결산·HR·급여 단위로 risk를 식별하고 그 안에서 자동통제를 도출하는 게 디폴트다. CACIR 분류를 한 번 더 거치는 건 실무 부가가치 없는 추가 작업이다.

따라서 본 레포의 ITAC 매핑은 **프로세스 단위(매출/매입/재고/결산/HR)로 자동통제를 카탈로그화**하고, ISMS-P 인증기준과 직접 매핑한다. CACIR 분류는 본 README에 reference로 한 번만 언급하고, 개별 매핑 페이지에서는 사용하지 않는다.

## 4. KISA ISMS-P에서의 ITAC

**KISA 안내서에 ITAC 카테고리 명시 없음.** ITAC는 회계감사 개념이라 KISA가 직접 다루지 않음.

다만 ISMS-P 인증기준 중 일부는 **응용 시스템 단위 통제와 직접 겹침** — ITAC 영역과 매핑 가능:

| ISMS-P 인증기준 | 주로 걸리는 프로세스 | 매핑 근거 |
|---|---|---|
| 2.6.3 응용프로그램 접근 | 전 프로세스 (cross-process) | 응용 시스템 사용자별 화면·기능·메뉴 권한 통제 (SoD 포함) |
| 2.6.4 데이터베이스 접근 | 전 프로세스 (cross-process) | 응용 시스템 → DB 데이터 접근 통제 |
| 2.8.1 보안 요구사항 정의 | 전 프로세스 (설계 단계) | 응용 시스템 설계 단계 자동통제 요구사항 명문화 |
| 2.8.2 보안 요구사항 검토 및 시험 | 전 프로세스 (검수 단계) | 자동통제 설정값·로직 검토 및 UAT |
| 2.8.3 시험과 운영 환경 분리 | (간접) | ITAC 검증 환경의 신뢰성 전제 — ITGC와 겹침 |
| 2.8.5 소스 프로그램 관리 | (간접) | ITAC 코드 변경 통제 — ITGC와 겹침 |
| 2.8.6 운영환경 이관 | (간접) | ITAC 변경 → 운영 반영 통제 — ITGC와 겹침 |
| 2.9.1 변경관리 | (간접) | ITAC 변경 통제 — ITGC와 겹침 |
| 2.10.4 전자거래 및 핀테크 보안 | 매출(O2C) · 결제 | 전자거래 트랜잭션 정합성·계산·검증 |

**구조적 관계**:
- 2.8.x·2.9.1은 ITGC 변경관리(PC) 영역과도 겹치는데, ITAC 관점에서는 "자동통제 코드 변경 시 통제"로 재해석
- 2.6.3·2.6.4는 ITGC 접근통제(APD) 영역과도 겹치는데, ITAC 관점에서는 "응용 시스템 내 권한 분리(SoD)"로 재해석

같은 인증기준이 ITGC 시각·ITAC 시각에서 다르게 읽힌다. 본 레포는 양 시각에서 모두 다룸.

## 5. 본 레포에서 ITAC를 다루는 방식

ITAC 매핑은 ITGC와 다르게 다음 순서로 작성 (**프로세스 단위로 일관**):

1. **프로세스별 자동통제 카탈로그** — 매출/매입/재고/결산/HR 5개 프로세스별로 빈출 자동통제 정리
2. **각 통제의 통제 성격 기술** — 임계값 설정인지 / 권한 routing인지 / 계산 로직인지 / 인터페이스 정합성인지 / IPE인지 (자유 기술. CACIR 같은 카테고리 강제 분류 X)
3. **ISMS-P 인증기준 매핑** — 위 §4 표 확장
4. **ITGC 의존성** — 어느 ITGC 영역(주로 PC·APD)이 effective여야 신뢰 가능한지 명시
5. **결함 사례** — KISA 안내서에는 ITAC 사례가 거의 없음. 빅4 결함 패턴 참고 (NDA 회피 위해 일반화)

## 6. 작성 우선순위

ITGC 영역(`01-itgc-mapping/`) 30개 이상 작성 완료 후 본격 시작. 그 전에는 본 README + 5개 프로세스별 placeholder만 유지.

예상 페이지 (placeholder 단계):
- `processes/o2c-매출.md`
- `processes/p2p-매입.md`
- `processes/inventory-재고.md`
- `processes/closing-결산.md`
- `processes/hr-payroll-급여.md`

## 관련 참조

- AICPA SAS 145 (Risk Assessment) — application controls 식별
- PCAOB AS 2201 (Internal Control over Financial Reporting)
- COBIT 5 / COBIT 2019 — DSS06 Manage Business Process Controls
- ISACA IT Audit Framework (ITAF)
