# 나의 포트폴리오 사이트

레퍼런스: [parkeunsang.github.io](https://parkeunsang.github.io)

## 파일 구조

```
porfolio_site/
├── index.html          # 메인 페이지
├── css/
│   └── style.css       # 스타일시트
├── js/
│   └── main.js         # 포트폴리오 필터, 스크롤 애니메이션 등
├── images/
│   ├── profile.jpg     # 프로필 사진 (직접 추가)
│   ├── portfolio1.png  # 포트폴리오 이미지들 (직접 추가)
│   └── ...
└── README.md
```

## 커스터마이징 방법

### 1. 개인 정보 수정 (`index.html`)
- `홍길동` → 본인 이름으로 변경
- `your@email.com` → 본인 이메일
- `yourusername` → GitHub 아이디
- About Me, History 섹션 내용 수정

### 2. 이미지 추가 (`images/` 폴더)
- `profile.jpg` : 프로필 사진 (정사각형 권장)
- `portfolio1.png` ~ `portfolio6.png` : 포트폴리오 썸네일 이미지

### 3. 포트폴리오 항목 추가/수정
`index.html`의 `#portfolio-grid` 안에 아래 형식으로 추가:
```html
<div class="col-md-4 col-sm-6 mb-4 portfolio-item" data-category="web-application">
  <div class="portfolio-card" data-bs-toggle="modal" data-bs-target="#modalN">
    <img src="images/portfolioN.png" alt="프로젝트 이름" />
    <div class="portfolio-overlay">
      <span class="portfolio-tag">WEB-APPLICATION</span>
      <h6>프로젝트 이름</h6>
    </div>
  </div>
</div>
```
카테고리 값: `web-application` / `data-analysis` / `others`

---

## GitHub Pages 배포 방법

1. GitHub에서 `[username].github.io` 이름으로 새 레포지토리 생성
2. 이 폴더의 파일들을 해당 레포에 push

```bash
git init
git add .
git commit -m "Initial portfolio site"
git remote add origin https://github.com/[username]/[username].github.io.git
git push -u origin main
```

3. 레포 Settings → Pages → Source: `main` 브랜치 선택 → Save
4. 약 1~2분 후 `https://[username].github.io` 에서 확인
