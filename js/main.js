// ===========================
// Navbar 스크롤 효과
// ===========================
window.addEventListener('scroll', () => {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  if (window.scrollY > 50) {
    nav.style.backgroundColor = 'rgba(20, 20, 40, 0.98)';
    nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.3)';
  } else {
    nav.style.backgroundColor = 'rgba(20, 20, 40, 0.95)';
    nav.style.boxShadow = 'none';
  }
});

// ===========================
// 포트폴리오 필터
// ===========================
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter.toLowerCase();

    portfolioItems.forEach(item => {
      const categories = item.dataset.category.toLowerCase().split(' ');
      if (filter === 'all' || categories.includes(filter)) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// ===========================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// 애니메이션 대상 요소들
document.querySelectorAll('.skill-card, .timeline-item, .portfolio-item').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// ===========================
// 총 경력 기간 자동 계산
// ===========================
(function () {
  const periods = [
    { start: [2021, 2], end: [2021, 9] },
    { start: [2021, 9], end: [2025, 2] },
    { start: [2025, 2], end: null }, // 재직 중
  ];

  const now = new Date();
  const curYear = now.getFullYear();
  const curMonth = now.getMonth() + 1;

  let totalMonths = 0;
  periods.forEach(({ start, end }) => {
    const [ey, em] = end ? end : [curYear, curMonth];
    totalMonths += (ey - start[0]) * 12 + (em - start[1]);
  });

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const label = `총 ${years}년${months > 0 ? ' ' + months + '개월' : ''}`;

  const badge = document.querySelector('.history-total');
  if (badge) badge.textContent = label;
})();

// ===========================
// 부드러운 스크롤 (앵커 링크)
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 70; // navbar 높이
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });

      // 모바일 메뉴 닫기
      const navCollapse = document.getElementById('navbarNav');
      if (navCollapse && navCollapse.classList.contains('show')) {
        navCollapse.classList.remove('show');
      }
    }
  });
});
