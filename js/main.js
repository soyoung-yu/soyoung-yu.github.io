// ===========================
// Navbar 스크롤 효과
// ===========================
window.addEventListener('scroll', () => {
  const nav = document.getElementById('mainNav');
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
    // 활성 버튼 변경
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    portfolioItems.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// ===========================
// 스크롤 애니메이션 (Intersection Observer)
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
      if (navCollapse.classList.contains('show')) {
        navCollapse.classList.remove('show');
      }
    }
  });
});
