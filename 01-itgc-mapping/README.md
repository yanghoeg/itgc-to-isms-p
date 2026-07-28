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

각 인증기준 페이지는 다음 4개 본문 섹션으로 구성. 자세한 작성 규칙은 [`../00-meta/methodology.md`](../00-meta/methodology.md) §2 참조.

1. **ISMS-P 기준 요약** — 인증기준·주요 확인사항·결함사례 요약
2. **ITGC 매핑** — 분류와 ITGC 영역
3. **IT감사에서는 이렇게** — ISMS 요구와 ITGC 테스트 절차
4. **Q&A** — 작성자의 한국 비금융 ITGC 실무 판단

각 페이지 상단에는 KISA 기준 판본과 공식 기준 요약·작성자 실무 판단의 구분을 표시하고, 하단에는 관련 인증기준과 법규·표준을 정리한다.

> 2026-07-26 기준 101개 인증기준의 1차 본문 작성을 완료했다. 전체 목록과 상세 페이지 링크는 [`MATRIX.md`](./MATRIX.md)에서 확인한다.
