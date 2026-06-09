# 유소영 포트폴리오 사이트

GitHub Pages로 배포하는 정적 포트폴리오 사이트입니다.

## 파일 구조

```
porfolio_site/
├── index.html          # 메인 페이지
├── css/
│   └── style.css       # 전체 스타일
├── js/
│   └── main.js         # 필터, 스크롤, 애니메이션
├── portfolio/
│   ├── projects.json   # 포트폴리오 카드/모달 메타데이터
│   └── projects/       # 프로젝트별 모달 본문 HTML
│       ├── business-insight-report.html
│       ├── formulation-automation.html
│       ├── research-trend-analysis.html
│       ├── vector-search-structure.html
│       └── global-lab-kpi-ssot.html
├── images/
│   ├── main.png        # Hero 배경
│   ├── profile.jpeg    # 프로필 사진
│   ├── portfolio1.png  # 포트폴리오 썸네일
│   ├── portfolio2.png
│   ├── portfolio3.png
│   ├── portfolio4.png
│   └── portfolio5.png
└── README.md
```

## 사이트 구성

- `Home`: Hero 영역
- `About`: 프로필, 연락처, 기술 역량
- `History`: 이력 영역
- `Portfolio`: 프로젝트 카드와 상세 모달

## 포트폴리오 카테고리

- `insight`
- `llm`
- `analysis`

Featured Portfolio는 `index.html`에 직접 카드와 모달을 쓰지 않고, `portfolio/projects.json`과 `portfolio/projects/*.html`을 기준으로 자동 생성합니다.

### 기존 프로젝트 내용 수정

특정 프로젝트 모달의 본문을 수정할 때는 아래 파일만 수정합니다.

- `portfolio/projects/business-insight-report.html`
- `portfolio/projects/formulation-automation.html`
- `portfolio/projects/research-trend-analysis.html`
- `portfolio/projects/vector-search-structure.html`
- `portfolio/projects/global-lab-kpi-ssot.html`

프로젝트 제목, 카테고리, 썸네일, 카드 태그를 바꿀 때는 `portfolio/projects.json`을 수정합니다.

### 신규 프로젝트 카드 추가

1. `portfolio/projects/새프로젝트.html` 파일을 만들고 모달 본문을 작성합니다.
2. `images/portfolioN.png` 형식으로 썸네일 이미지를 추가합니다.
3. `portfolio/projects.json`에 새 프로젝트 항목을 추가합니다.

한 프로젝트가 여러 카테고리에 속하면 `categories` 배열에 여러 값을 넣습니다.

```json
{
  "id": "modal6",
  "slug": "new-project",
  "title": "프로젝트 이름",
  "tag": "LLM · Analysis",
  "categories": ["llm", "analysis"],
  "tags": ["LLM", "Analysis"],
  "image": "images/portfolio6.png",
  "body": "portfolio/projects/new-project.html"
}
```

`id`, `image`, `body`는 서로 같은 프로젝트를 가리키도록 번호와 파일명을 맞춥니다.

## 포트폴리오 모달 기본 포맷

신규 프로젝트 모달은 `비즈니스 인사이트 리포트` 모달 구조를 기본 포맷으로 사용합니다. 모든 프로젝트는 가능한 한 같은 섹션 순서와 같은 CSS 클래스를 유지해, 카드별 상세 화면의 읽는 흐름이 일관되게 보이도록 합니다.

### 필수 섹션 순서

1. `기술 스택`
2. `프로젝트 설명`
3. `배경 및 목표`
4. `데이터 수집 및 전처리`
5. `분석 방법론`
6. `분석 결과 및 인사이트`
7. `비즈니스 제안 및 액션 아이템`

프로젝트 성격상 특정 섹션이 맞지 않더라도 섹션 자체는 유지하고, 제목 안에서 의미를 자연스럽게 조정합니다. 예를 들어 데이터 분석 프로젝트가 아닌 경우에도 `데이터 수집 및 전처리`에는 사용 자료, 입력 데이터, 문서, 시스템 로그 등 분석 또는 구현에 사용한 기반 정보를 정리합니다.

### 모달 작성 규칙

- 모달 헤더는 `.portfolio-modal-tag`, `.portfolio-modal-title`, `.portfolio-modal-close` 구조를 유지합니다.
- 본문은 `.portfolio-modal-body > .portfolio-modal-info > .portfolio-modal-info-item` 구조를 사용합니다.
- 각 섹션 제목은 `.info-label`을 사용하고, Font Awesome 아이콘을 함께 넣습니다.
- 기술 스택은 `.info-tags` 안에 `.tech-tag`로 작성합니다.
- 핵심 성과 수치가 있으면 `.impact-grid`와 `.impact-card`를 사용해 상단에 요약합니다.
- 핵심 문장 강조는 `<span class="highlight-phrase">...</span>`를 사용합니다.
- 배경이나 목표처럼 요약 강조가 필요한 문단은 `.goal-box`를 사용합니다.
- 방법론은 `.method-stack` 안에 `.method-block` 단위로 묶습니다.
- 결과와 인사이트는 `.insight-block` 단위로 묶고, 결론 문장은 `.insight-callout`을 사용합니다.
- 액션 아이템은 `.action-list`를 사용합니다.
- 불릿은 한 항목에 하나의 메시지만 담고, 긴 문단을 여러 불릿으로 쪼개 가독성을 유지합니다.
- 강조 색상이나 카드 색상은 CSS 공통 클래스를 따르고, 인라인 스타일로 개별 프로젝트만 다르게 꾸미지 않습니다.
- 모달 ID, 카드 `data-bs-target`, 썸네일 파일명은 같은 번호를 사용합니다. 예: `modal6`, `portfolio6.png`.

### 신규 프로젝트 본문 템플릿

프로젝트별 HTML 파일은 전체 모달 껍데기를 포함하지 않습니다. 아래처럼 `.portfolio-modal-info`부터 작성합니다.

```html
<div class="portfolio-modal-info">
  <div class="portfolio-modal-info-item">
    <span class="info-label"><i class="fas fa-layer-group me-2"></i>기술 스택</span>
    <div class="info-tags">
      <span class="tech-tag">Python</span>
      <span class="tech-tag">SQL</span>
    </div>
  </div>

  <div class="portfolio-modal-info-item">
    <span class="info-label"><i class="fas fa-align-left me-2"></i>프로젝트 설명</span>
    <p class="desc-lead">프로젝트의 문제 정의와 핵심 접근을 2~3문장으로 요약합니다.</p>
    <p class="info-desc">구체적인 수행 방식과 사용자 또는 비즈니스 관점의 의미를 설명합니다.</p>
    <div class="impact-grid">
      <div class="impact-card">
        <span class="impact-value">핵심 수치</span>
        <span class="impact-label">성과 설명</span>
      </div>
    </div>
  </div>

  <div class="portfolio-modal-info-item">
    <span class="info-label"><i class="fas fa-bullseye me-2"></i>배경 및 목표</span>
    <p class="goal-box">문제의 배경, 원인 진단, 달성하려는 목표를 작성합니다.</p>
  </div>

  <div class="portfolio-modal-info-item">
    <span class="info-label"><i class="fas fa-database me-2"></i>데이터 수집 및 전처리</span>
    <div class="two-column-block">
      <div>
        <h6 class="info-subtitle">데이터 수집</h6>
        <ul class="info-list">
          <li>사용한 데이터 또는 자료를 작성합니다.</li>
        </ul>
      </div>
      <div>
        <h6 class="info-subtitle">전처리</h6>
        <ul class="info-list">
          <li>정제, 통합, 지표 생성 등 준비 과정을 작성합니다.</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="portfolio-modal-info-item">
    <span class="info-label"><i class="fas fa-flask me-2"></i>분석 방법론</span>
    <div class="method-stack">
      <div class="method-block">
        <h6 class="info-subtitle">방법론 제목</h6>
        <ul class="info-list">
          <li>사용한 분석, 모델링, 설계 방법을 작성합니다.</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="portfolio-modal-info-item">
    <span class="info-label"><i class="fas fa-chart-line me-2"></i>분석 결과 및 인사이트</span>
    <div class="insight-block">
      <h6 class="info-subtitle">인사이트 주제</h6>
      <ul class="info-list">
        <li>분석 결과와 해석을 작성합니다.</li>
      </ul>
      <p class="insight-callout">결론 또는 핵심 판단을 작성합니다.</p>
    </div>
  </div>

  <div class="portfolio-modal-info-item">
    <span class="info-label"><i class="fas fa-lightbulb me-2"></i>비즈니스 제안 및 액션 아이템</span>
    <ul class="action-list">
      <li>결과를 바탕으로 제안한 실행 항목을 작성합니다.</li>
    </ul>
  </div>
</div>
```

`projects.json`과 개별 HTML 파일은 `fetch`로 불러오기 때문에 로컬 확인 시 HTML 파일을 직접 열지 말고 서버를 실행합니다.

```bash
python3 -m http.server 8000
```

---

## 배포

원격 저장소는 `soyoung-yu/soyoung-yu.github.io`입니다. 변경 후 아래 순서로 배포합니다.

```bash
git add .
git commit -m "Update portfolio site"
git push origin main
```

배포 후 `https://soyoung-yu.github.io`에서 확인할 수 있습니다.
