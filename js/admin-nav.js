(() => {
  const params = new URLSearchParams(location.search);
  if (params.has('enter') || params.has('welcome') || params.has('logout')) {
    document.body.classList.add('portal-splash');
    try {
      history.replaceState({}, '', location.pathname);
    } catch (_) {}
  }

  const host = document.querySelector('.sa-sidebar,.people-sidebar,.att-side,.a-side,[data-admin-nav]');
  if (!host) return;

  const page = location.pathname.split('/').pop() || 'super-admin.html';
  let key = 'dashboard';
  if (page === 'people.html') key = params.get('tab') || 'students';
  else if (page === 'admin-attendance.html') key = 'attendance';
  else if (page === 'academic-sessions.html') key = 'sessions';
  else if (page === 'classes-sections.html') key = 'classes';
  else if (page === 'subjects-teachers.html') key = 'subjects';
  else if (page === 'student-promotions.html') key = 'promotions';
  else if (page === 'admin-timetable.html') key = 'timetable';
  else if (page === 'admin-examinations.html') key = 'examinations';
  else if (page === 'admin-study-materials.html') key = 'materials';
  else if (page === 'admin-online-tests.html') key = 'tests';
  else if (page === 'admin-diary.html') key = 'diary';
  else if (page === 'admin-calendar.html') key = 'calendar';
  else if (page === 'admin-feedback.html') key = 'feedback';
  else if (page === 'admin-notifications.html') key = 'notifications';
  else if (page === 'admin-settings.html') key = 'settings';
  else if (page === 'notice-board.html') key = 'notices';
  else if (page === 'admin-placeholder.html') key = params.get('section') || 'dashboard';

  const activeRole = localStorage.getItem('sunrise-admin-role') || 'Super Admin';
  const item = (name, href, id, icon, badge = '') =>
    `<a href="${href}" data-key="${id}"><i class="nav-ico">${icon}</i><span>${name}</span>${badge}</a>`;

  const nav = `<aside class="unified-sidebar" aria-label="School administration navigation">
    <a href="index.html" class="unified-brand" style="text-decoration:none;color:inherit">
      <span class="unified-logo">S</span>
      <div>
        <strong>Sunrise School</strong>
        <small>CAMPUS ERP</small>
      </div>
    </a>
    <div class="unified-role">Active Role <b>${activeRole}</b></div>
    ${item('School Dashboard', 'super-admin.html', 'dashboard', '▦')}
    <details data-group="people">
      <summary><i class="nav-ico">♙</i><span>People Directory</span></summary>
      ${item('Students', 'people.html?tab=students', 'students', '•')}
      ${item('Parents', 'people.html?tab=parents', 'parents', '•')}
      ${item('Teachers', 'people.html?tab=teachers', 'teachers', '•')}
    </details>
    ${item('Attendance', 'admin-attendance.html', 'attendance', '✓')}
    <details data-group="academics">
      <summary><i class="nav-ico">🎓</i><span>Academics</span></summary>
      ${item('Academic Sessions', 'academic-sessions.html', 'sessions', '•')}
      ${item('Classes & Sections', 'classes-sections.html', 'classes', '•')}
      ${item('Subjects & Teachers', 'subjects-teachers.html', 'subjects', '•')}
      ${item('Student Promotions', 'student-promotions.html', 'promotions', '•')}
      ${item('Timetable', 'admin-timetable.html', 'timetable', '•')}
      ${item('Examinations', 'admin-examinations.html', 'examinations', '•')}
      ${item('Study Materials', 'admin-study-materials.html', 'materials', '•')}
      ${item('Online Tests', 'admin-online-tests.html', 'tests', '•')}
    </details>
    ${item('Diary & Homework', 'admin-diary.html', 'diary', '✎')}
    ${item('Notice Board', 'notice-board.html', 'notices', '✉')}
    ${item('School Calendar', 'admin-calendar.html', 'calendar', '▤')}
    ${item('Parent Feedback', 'admin-feedback.html', 'feedback', '💬', '<b class="nav-count-badge">1</b>')}
    ${item('Notifications', 'admin-notifications.html', 'notifications', '🔔')}
    ${item('School Settings', 'admin-settings.html', 'settings', '⚙')}
    <a href="index.html?logout=1" class="unified-logout"><i class="nav-ico">↪</i><span>Log out →</span></a>
    <div class="unified-footer">Sunrise Edu v2.4 <span>● Connected</span></div>
  </aside>`;

  host.outerHTML = nav;

  const active = document.querySelector(`.unified-sidebar [data-key="${key}"]`);
  if (active) {
    active.classList.add('active');
    const group = active.closest('details');
    if (group) group.open = true;
  }

  const topActions = document.querySelector('[class$="-top-actions"]');
  if (topActions && !topActions.querySelector('.admin-top-logout')) {
    const logoutBtn = document.createElement('a');
    logoutBtn.href = 'index.html?logout=1';
    logoutBtn.className = 'admin-top-logout';
    logoutBtn.textContent = 'Log out →';
    topActions.appendChild(logoutBtn);
  }

  const uiHost = document.createElement('div');
  uiHost.innerHTML = `
    <div class="global-confirm-backdrop" id="globalConfirmModal">
      <div class="global-confirm-card" role="dialog" aria-modal="true" aria-labelledby="gcTitle">
        <h3 id="gcTitle">Confirm Action</h3>
        <p id="gcMessage">Are you sure you want to proceed with this action?</p>
        <div class="global-confirm-actions">
          <button type="button" class="gc-btn-cancel" id="gcCancelBtn">Cancel</button>
          <button type="button" class="gc-btn-confirm" id="gcConfirmBtn">Confirm</button>
        </div>
      </div>
    </div>
    <div class="global-toast-banner" id="globalToastBanner" role="status" aria-live="polite">
      <span class="gt-icon">✓</span>
      <span id="globalToastText">Action completed successfully.</span>
    </div>
  `;
  document.body.appendChild(uiHost);

  const gcModal = document.getElementById('globalConfirmModal');
  const gcTitle = document.getElementById('gcTitle');
  const gcMessage = document.getElementById('gcMessage');
  const gcCancelBtn = document.getElementById('gcCancelBtn');
  const gcConfirmBtn = document.getElementById('gcConfirmBtn');
  const gtBanner = document.getElementById('globalToastBanner');
  const gtText = document.getElementById('globalToastText');

  let pendingConfirmFn = null;

  window.sunriseConfirm = function(opts = {}) {
    gcTitle.textContent = opts.title || 'Confirm Action';
    gcMessage.textContent = opts.message || 'Are you sure you want to proceed?';
    gcConfirmBtn.textContent = opts.confirmText || 'Confirm';
    gcConfirmBtn.classList.toggle('danger', Boolean(opts.danger));
    pendingConfirmFn = opts.onConfirm || null;
    gcModal.classList.add('open');
  };

  function closeGcModal() {
    gcModal.classList.remove('open');
    pendingConfirmFn = null;
  }

  gcCancelBtn.addEventListener('click', closeGcModal);
  gcModal.addEventListener('click', e => {
    if (e.target === gcModal) closeGcModal();
  });

  gcConfirmBtn.addEventListener('click', () => {
    const fn = pendingConfirmFn;
    closeGcModal();
    if (typeof fn === 'function') fn();
  });

  let toastTimer = null;
  window.sunriseToast = function(msg) {
    gtText.textContent = msg;
    gtBanner.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => gtBanner.classList.remove('show'), 3200);
  };
})();
