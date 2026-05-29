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
// 경력 기간 자동 계산
// ===========================
(function () {
  const now = new Date();
  const curYear = now.getFullYear();
  const curMonth = now.getMonth() + 1;

  function calcMonths(startStr, endStr, nextStartStr) {
    const [sy, sm] = startStr.split('-').map(Number);

    if (!endStr) {
      // 재직 중: 현재 월 포함
      return (curYear - sy) * 12 + (curMonth - sm) + 1;
    }

    const [ey, em] = endStr.split('-').map(Number);

    if (nextStartStr) {
      const [ny, nm] = nextStartStr.split('-').map(Number);
      if (ey === ny && em === nm) {
        // 퇴사월 = 다음 직장 입사월 → 다음 직장에만 포함
        return (ey - sy) * 12 + (em - sm);
      }
    }

    // 퇴사월과 다음 입사월이 다르거나 마지막 직장 → 퇴사월 포함
    return (ey - sy) * 12 + (em - sm) + 1;
  }

  function formatDuration(months) {
    const y = Math.floor(months / 12);
    const m = months % 12;
    if (y > 0 && m > 0) return `${y}년 ${m}개월`;
    if (y > 0) return `${y}년`;
    return `${m}개월`;
  }

  // 각 회사 재직 기간 표시 + 총합 계산
  const items = document.querySelectorAll('.career-timeline .timeline-item');
  let totalMonths = 0;

  items.forEach((item, i) => {
    const start = item.dataset.start;
    const end = item.dataset.end || null;
    const nextStart = items[i + 1] ? items[i + 1].dataset.start : null;
    if (!start) return;

    const months = calcMonths(start, end, nextStart);
    totalMonths += months;

    const badge = item.querySelector('.timeline-duration');
    if (badge) badge.textContent = formatDuration(months);
  });

  const totalBadge = document.querySelector('.history-total');
  if (totalBadge) totalBadge.textContent = `총 ${formatDuration(totalMonths)}`;
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
