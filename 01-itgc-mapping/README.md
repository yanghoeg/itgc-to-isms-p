# 01-itgc-mapping

ISMS-P 101개 인증기준을 회계법인 IT 감사인의 ITGC 시각으로 분류한 메인 콘텐츠.

## 분류 축

ITGC 표준 4영역(APD/PC/CO/PD)에 직접 매핑되는 정도에 따라 3 분류.

| 분류 | 의미 | 폴더 | 인증기준 수 |
|---|---|---|---|
| **1-direct** | ITGC가 직접 다루는 영역 (APD/PC/CO/PD에 직결) | [`1-direct/`](./1-direct/) | ~49 |
| **2-indirect** | ITGC가 간접 다루는 영역 (Entity-Level Controls) | [`2-indirect/`](./2-indirect/) | ~31 |
| **3-other** | ITGC가 거의 안 다루지만 참고 가치 있는 영역 (개인정보 처리단계) | [`3-other/`](./3-other/) | ~21 |
| **합계** | | | **101** |

## ITGC 약어

- **APD** — Access to Programs and Data (논리적 접근통제)
- **PC** — Program Changes (변경관리)
- **CO** — Computer Operations (운영·보안·사고대응·재해복구·물리)
- **PD** — Program Development (신규 도입·개발)
- **ELC** — Entity-Level Controls (전사수준통제)

## 페이지 구성

각 인증기준 페이지는 다음 6개 섹션으로 구성. 자세한 작성 규칙은 [`../00-meta/methodology.md`](../00-meta/methodology.md) §2 참조.

1. ISMS-P 인증기준 (요약)
2. ITGC 매핑 (영역 + 분류)
3. 실무 사례 (익명화)
4. KISA 표준 결함사례 (요약)
5. 시험 출제 패턴 (선택)
6. 관련 법령

> 작성 진행 중. 우선순위: APD → CO → PD → PC → ELC → 3장 개인정보. (실무 빈도 + 결함 발견 빈도 순)
