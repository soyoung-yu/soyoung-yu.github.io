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
// Scroll Fade-in Animation
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

function observeFadeIn(elements) {
  elements.forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });
}

observeFadeIn(document.querySelectorAll('.skill-card, .timeline-item'));

// ===========================
// 포트폴리오 데이터 렌더링
// ===========================
const PROJECTS_DATA_URL = 'portfolio/projects.json';

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderPortfolioCard(project) {
  const categories = escapeHtml(project.categories.join(' '));
  const tags = project.tags
    .map(tag => `<span class="portfolio-tag">${escapeHtml(tag)}</span>`)
    .join('');

  return `
        <div class="col-md-4 col-sm-6 mb-4 portfolio-item" data-category="${categories}">
          <div class="portfolio-card" data-bs-toggle="modal" data-bs-target="#${escapeHtml(project.id)}" style="background-image: url('${escapeHtml(project.image)}'); background-size: cover; background-position: center;">
            <div class="portfolio-overlay">
              <div class="portfolio-tags">
                ${tags}
              </div>
              <h6>${escapeHtml(project.title)}</h6>
            </div>
          </div>
        </div>`;
}

function renderCompanySection(company, projects) {
  const cards = projects.map(renderPortfolioCard).join('');
  return `
    <div class="portfolio-company-section" data-company="${escapeHtml(company)}">
      <div class="portfolio-company-header">
        <span class="portfolio-company-label">${escapeHtml(company)}</span>
      </div>
      <div class="row portfolio-company-grid">
        ${cards}
      </div>
    </div>`;
}

function renderPortfolioModal(project, bodyHtml) {
  return `
  <div class="modal fade" id="${escapeHtml(project.id)}" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content portfolio-modal-content">
        <div class="portfolio-modal-header">
          <div class="portfolio-modal-tag">${escapeHtml(project.tag)}</div>
          <h4 class="portfolio-modal-title">${escapeHtml(project.title)}</h4>
          <button type="button" class="portfolio-modal-close" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-times"></i></button>
        </div>
        <div class="portfolio-modal-body">
${bodyHtml}
        </div>
      </div>
    </div>
  </div>`;
}

function bindPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter.toLowerCase();

      document.querySelectorAll('.portfolio-company-section').forEach(section => {
        const items = section.querySelectorAll('.portfolio-item');
        let visibleCount = 0;

        items.forEach(item => {
          const categories = item.dataset.category.toLowerCase().split(' ');
          if (filter === 'all' || categories.includes(filter)) {
            item.classList.remove('hidden');
            visibleCount++;
          } else {
            item.classList.add('hidden');
          }
        });

        section.classList.toggle('hidden', visibleCount === 0);
      });
    });
  });
}

function bindPortfolioModalScrollReset() {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('shown.bs.modal', () => {
      const modalBody = modal.querySelector('.portfolio-modal-body');
      if (modalBody) modalBody.scrollTop = 0;
    });
  });
}

async function loadProjectBody(project) {
  const response = await fetch(project.body);
  if (!response.ok) {
    throw new Error(`Failed to load ${project.body}`);
  }
  return response.text();
}

async function renderPortfolio() {
  const grid = document.getElementById('portfolio-grid');
  const modals = document.getElementById('portfolio-modals');
  if (!grid || !modals) return;

  try {
    const response = await fetch(PROJECTS_DATA_URL);
    if (!response.ok) {
      throw new Error(`Failed to load ${PROJECTS_DATA_URL}`);
    }

    const allProjects = await response.json();
    const projects = allProjects.filter(p => !p.disabled);
    const bodies = await Promise.all(projects.map(loadProjectBody));

    // 회사별로 그룹핑 (JSON 순서 유지)
    const companiesOrder = [];
    const byCompany = {};
    projects.forEach(project => {
      const company = project.company || '기타';
      if (!byCompany[company]) {
        byCompany[company] = [];
        companiesOrder.push(company);
      }
      byCompany[company].push(project);
    });

    grid.innerHTML = companiesOrder
      .map(company => renderCompanySection(company, byCompany[company]))
      .join('');

    modals.innerHTML = projects
      .map((project, index) => renderPortfolioModal(project, bodies[index]))
      .join('');

    bindPortfolioFilters();
    bindPortfolioModalScrollReset();
    observeFadeIn(document.querySelectorAll('.portfolio-item'));
  } catch (error) {
    console.error(error);
    grid.innerHTML = '<p class="portfolio-load-error">포트폴리오를 불러오지 못했습니다.</p>';
  }
}

renderPortfolio();

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
    const nextStart = i > 0 ? items[i - 1].dataset.start : null;
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
