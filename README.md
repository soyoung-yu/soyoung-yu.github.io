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
├── images/
│   ├── main.png        # Hero 배경
│   ├── profile.jpeg    # 프로필 사진
│   ├── portfolio1.png  # 포트폴리오 썸네일
│   ├── portfolio2.png
│   ├── portfolio3.png
│   └── portfolio4.png
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

한 프로젝트가 여러 카테고리에 속하면 공백으로 구분합니다.

```html
<div class="col-md-4 col-sm-6 mb-4 portfolio-item" data-category="llm analysis">
  <div class="portfolio-card" data-bs-toggle="modal" data-bs-target="#modalN" style="background-image: url('images/portfolioN.png'); background-size: cover; background-position: center;">
    <div class="portfolio-overlay">
      <div class="portfolio-tags">
        <span class="portfolio-tag">LLM</span>
        <span class="portfolio-tag">Analysis</span>
      </div>
      <h6>프로젝트 이름</h6>
    </div>
  </div>
</div>
```

카드를 추가할 때는 같은 번호의 상세 모달도 함께 추가해야 합니다.

---

## 배포

원격 저장소는 `soyoung-yu/soyoung-yu.github.io`입니다. 변경 후 아래 순서로 배포합니다.

```bash
git add .
git commit -m "Update portfolio site"
git push origin main
```

배포 후 `https://soyoung-yu.github.io`에서 확인할 수 있습니다.
