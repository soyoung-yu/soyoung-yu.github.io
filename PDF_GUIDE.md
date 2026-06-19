# 포트폴리오 PDF 생성 가이드

## 개요
`generate_portfolio_pdf.py` 스크립트를 실행하면 현재 포트폴리오 사이트의 모든 프로젝트 내용을 PDF로 변환합니다.
출력 파일: `~/Desktop/portfolio_soyoung.pdf`

---

## 실행 방법

```bash
cd /Users/soyoung.yu/Desktop/workspace/porfolio_site
python3 generate_portfolio_pdf.py
```

---

## PDF 구성

| 페이지 | 내용 |
|--------|------|
| 1 | 커버 (이름 · 직함 · 연도) |
| 2 | 목차 (회사별 · 프로젝트 목록) |
| 3~ | 프로젝트 상세 (회사별 구분, 프로젝트마다 새 페이지) |

### 디자인 규칙
- **폰트**: Pretendard (Regular / SemiBold / Bold) — `fonts/` 폴더에 저장됨
- **색상**: 메인 퍼플 `#7c6aff`, 다크 `#1a1a2e`
- **프로젝트 제목**: 다크 배경 콜아웃 박스 (왼쪽 보라색 액센트 바)
- **들여쓰기 계층**: 섹션 레이블 → 본문/소제목 → 불릿 → 서브불릿

---

## 새 프로젝트 추가 시 PDF 반영 방법

1. `portfolio/projects.json`에 새 프로젝트 항목 추가 (`disabled: true` 없이)
2. `portfolio/projects/<slug>.html` 파일 작성
3. 스크립트 실행 → 자동으로 PDF에 포함됨

> `"disabled": true` 플래그가 있는 카드는 PDF에서 제외됩니다.

---

## HTML → PDF 매핑 규칙

| HTML 클래스 | PDF 표현 |
|------------|---------|
| `.info-label` | 섹션 헤더 (보라 ◆ + 텍스트) |
| `.tech-tag` | `[태그명]` 형식 나열 |
| `.info-desc`, `.desc-lead` | 본문 텍스트 |
| `.goal-box` | 연보라 배경 인용 박스 |
| `.info-subtitle` | Bold 소제목 |
| `.info-sub-label` | 보라색 소분류 레이블 |
| `ul > li` | • 불릿 리스트 |
| `ul > li > ul > li` | – 서브 불릿 (추가 들여쓰기) |
| `.highlight-phrase` | 보라색 강조 텍스트 |
| `.stat-em` | Bold 보라색 수치 |
| `.impact-grid` | 2열 수치 카드 테이블 |
| `.insight-block` | 인사이트 블록 (소제목 + 리스트) |
| `.insight-callout` | → 보라 배경 강조 문장 |
| `.method-stack` / `.method-block` | 방법론 블록 순서대로 나열 |
| `.two-column-block` | 2열 → 순서대로 나열 |

---

## 파일 구조

```
porfolio_site/
├── generate_portfolio_pdf.py   # PDF 생성 스크립트
├── fonts/
│   ├── Pretendard-Regular.ttf
│   ├── Pretendard-SemiBold.ttf
│   └── Pretendard-Bold.ttf
├── portfolio/
│   ├── projects.json           # 프로젝트 목록 (순서 = PDF 순서)
│   └── projects/
│       └── *.html              # 각 프로젝트 상세 내용
└── PDF_GUIDE.md                # 이 문서
```

---

## 의존성

```bash
pip3 install reportlab beautifulsoup4
```

> `fonts/` 폴더가 없거나 폰트 파일이 없을 경우 스크립트가 실행되지 않습니다.
> Pretendard 폰트는 https://github.com/orioncactus/pretendard 에서 다운로드 가능합니다.
