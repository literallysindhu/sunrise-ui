(() => {
  const params = new URLSearchParams(location.search);
  if (params.has('enter') || params.has('welcome') || params.has('logout')) {
    document.body.classList.add('portal-splash');
    try { history.replaceState({}, '', location.pathname); } catch (_) {}
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
  const item = (name, href, id, icon) => `<a href="${href}" data-key="${id}"><i>${icon}</i>${name}</a>`;
  const nav = `<aside class="unified-sidebar" aria-label="School administration navigation">
    <div class="unified-brand"><span class="unified-logo">S</span><div><strong>Sunrise School</strong><small>SCHOOL ADMIN</small></div></div>
    <div class="unified-role">Active role <b>School Admin</b></div>
    ${item('School Dashboard','super-admin.html','dashboard','▦')}
    <details data-group="people"><summary>♧ People</summary>${item('Students','people.html?tab=students','students','•')}${item('Parents','people.html?tab=parents','parents','•')}${item('Teachers','people.html?tab=teachers','teachers','•')}</details>
    ${item('Attendance','admin-attendance.html','attendance','▣')}
    <details data-group="academics"><summary>▱ Academics</summary>${item('Academic Sessions','academic-sessions.html','sessions','•')}${item('Classes & Sections','classes-sections.html','classes','•')}${item('Subjects & Teachers','subjects-teachers.html','subjects','•')}${item('Student Promotions','student-promotions.html','promotions','•')}${item('Timetable','admin-timetable.html','timetable','•')}${item('Examinations','admin-examinations.html','examinations','•')}${item('Study Materials','admin-study-materials.html','materials','•')}${item('Online Tests','admin-online-tests.html','tests','•')}</details>
    ${item('Diary & Homework','admin-diary.html','diary','✎')}
    ${item('Notice Board','notice-board.html','notices','⌁')}
    ${item('School Calendar','admin-calendar.html','calendar','▤')}
    ${item('Parent Feedback','admin-feedback.html','feedback','▢')}
    ${item('Notifications','admin-notifications.html','notifications','♧')}
    ${item('School Settings','admin-settings.html','settings','⚙')}
    <a href="index.html?logout=1" class="unified-logout"><i>↪</i>Log out →</a>
    <div class="unified-footer">Sunrise Edu v2.4 <span>● Connected</span></div></aside>`;
  host.outerHTML = nav;
  const active = document.querySelector(`.unified-sidebar [data-key="${key}"]`);
  if (active) { active.classList.add('active'); const group = active.closest('details'); if (group) group.open = true; }
  const topActions = document.querySelector('[class$="-top-actions"]');
  if (topActions && !topActions.querySelector('.admin-top-logout')) {
    const logoutBtn = document.createElement('a');
    logoutBtn.href = 'index.html?logout=1';
    logoutBtn.className = 'admin-top-logout';
    logoutBtn.textContent = 'Log out →';
    topActions.appendChild(logoutBtn);
  }
})();
