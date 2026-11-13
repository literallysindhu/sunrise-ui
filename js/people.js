const q = new URLSearchParams(location.search);
const tab = q.get('tab') || 'students';
const app = document.getElementById('app');
const modal = document.getElementById('modal');
const card = document.getElementById('modalCard');

const data = {
  students: [
    ['ADM2026-0501', 'Aarav Krishnan', 'Class 5 · A', '01', 'Ramesh Krishnan', '+91 98840 11223'],
    ['ADM2026-0502', 'Diya Krishnan', 'Class 5 · B', '02', 'Ramesh Krishnan', '+91 98840 11223'],
    ['ADM2026-0503', 'Karthik Senthil', 'Class 5 · A', '03', 'Anitha Senthil', '+91 98840 22334'],
    ['ADM2026-0601', 'Sneha Murugan', 'Class 6 · A', '01', 'Murugan Velu', '+91 98840 33445'],
    ['ADM2026-0602', 'Varun Chakravarthy', 'Class 6 · A', '02', 'S. Chakravarthy', '+91 98840 44556']
  ],
  parents: [
    ['Ramesh Krishnan', 'Father', '+91 98840 11223', 'ramesh.krishnan@gmail.com', 'Aarav Krishnan, Diya Krishnan'],
    ['Anitha Senthil', 'Mother', '+91 98840 22334', 'anitha.s@gmail.com', 'Karthik Senthil'],
    ['Murugan Velu', 'Father', '+91 98840 33445', 'murugan.velu@yahoo.com', 'Sneha Murugan']
  ],
  teachers: [
    ['EMP-0104', 'M. Saravanan', 'Mathematics, Science', 'Class 5-A, Class 6-A', '+91 98410 23456'],
    ['EMP-0108', 'K. Malathi', 'English, Tamil', 'Class 5-A, Class 5-B', '+91 98410 34567'],
    ['EMP-0112', 'S. Jayaraman', 'Science, Computer Science', 'Class 6-A', '+91 98410 45678']
  ]
};

const meta = {
  students: ['Student Directory', 'Manage student registrations, classroom assignments, and parent linkages', 'Enroll new student'],
  parents: ['Parent Registry', 'Manage guardian accounts, verify mobile OTP access, and link children', 'Register parent'],
  teachers: ['Faculty & Teachers', 'Manage teacher profiles, subject assignments, and timetable allocations', 'Add faculty member']
};

function csv() {
  const quote = value => '"' + value.replaceAll('"', '""') + '"';
  const headers = [...app.querySelectorAll('thead th')].map(cell => quote(cell.textContent.trim())).join(',');
  const rows = [...app.querySelectorAll('tbody tr')]
    .filter(row => row.style.display !== 'none')
    .map(row => [...row.querySelectorAll('td')].slice(0, -1).map(cell => quote(cell.textContent.replace(/\s+/g, ' ').trim())).join(','));
  const blob = new Blob([[headers, ...rows].join('\n')], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = tab + '-filtered-directory.csv';
  a.click();
  URL.revokeObjectURL(a.href);
}

function openForm() {
  const labels = tab === 'students'
    ? ['First name', 'Last name', 'Admission number', 'Roll number', 'Gender', 'Date of birth', 'Class', 'Section', 'Parent name', 'Parent mobile phone']
    : tab === 'parents'
      ? ['Full name', 'Registered phone number', 'Email address', 'Relationship', 'Residential address', 'Linked children']
      : ['Full name', 'Employee ID', 'Official email', 'Mobile number', 'Academic qualification', 'Assigned subjects', 'Assigned classes'];

  card.innerHTML =
    '<header><h2>' + meta[tab][2] + '</h2><button class="close" onclick="closeModal()">×</button></header>' +
    '<div class="form-grid">' +
    labels.map(x => '<label class="' + ((x.includes('address') || x.includes('qualification')) ? 'full' : '') + '">' + x + ' *<input placeholder="Enter ' + x.toLowerCase() + '"></label>').join('') +
    '</div>' +
    '<div class="modal-actions"><button onclick="closeModal()">Cancel</button><button onclick="closeModal()">Save record</button></div>';
  modal.classList.add('open');
}

function details(i) {
  const row = data[tab][i];
  const name = tab === 'students' ? row[1] : tab === 'parents' ? row[0] : row[1];
  card.innerHTML =
    '<header><h2>' + name + ' profile</h2><button class="close" onclick="closeModal()">×</button></header>' +
    '<div class="detail-box">' +
    row.map((x, j) => '<div><b>' + ['ID', 'Name', 'Class / role', 'Roll / subjects', 'Contact', 'Parent / linked wards'][j] + ':</b> ' + x + '</div>').join('') +
    '<div><span class="pill">Active</span></div></div>' +
    '<div class="modal-actions"><button onclick="closeModal()">Close</button></div>';
  modal.classList.add('open');
}

function closeModal() {
  modal.classList.remove('open');
}

function render() {
  const heads = tab === 'students'
    ? ['Adm no.', 'Student name', 'Class & sec', 'Roll', 'Parent / contact', 'Status', 'Actions']
    : tab === 'parents'
      ? ['Parent name', 'Contact details', 'Linked wards / students', 'App access', 'Actions']
      : ['Emp ID', 'Faculty member', 'Subjects taught', 'Assigned classes', 'Contact', 'Status', 'Actions'];

  const rows = data[tab].map((r, i) =>
    tab === 'students'
      ? '<tr><td class="id">' + r[0] + '</td><td><span class="avatar-sm">' + r[1].split(' ').map(x => x[0]).join('') + '</span>' + r[1] + '<small class="sub">DOB: 2016-04-12</small></td><td>' + r[2] + '</td><td>' + r[3] + '</td><td>' + r[4] + '<small class="sub">' + r[5] + '</small></td><td><span class="pill">Active</span></td><td class="row-actions"><button onclick="details(' + i + ')">◉</button><button>✎</button></td></tr>'
      : tab === 'parents'
        ? '<tr><td><span class="avatar-sm">' + r[0][0] + '</span>' + r[0] + '<small class="sub">' + r[1] + '</small></td><td>' + r[2] + '<small class="sub">' + r[3] + '</small></td><td>' + r[4].split(', ').map(x => '<span class="tag">' + x + '</span>').join('') + '</td><td><span class="pill">Active</span></td><td class="row-actions"><button onclick="details(' + i + ')">◉</button><button>Toggle access</button></td></tr>'
        : '<tr><td class="id">' + r[0] + '</td><td><span class="avatar-sm">' + r[1][0] + '</span>' + r[1] + '</td><td>' + r[2].split(', ').map(x => '<span class="tag">' + x + '</span>').join('') + '</td><td>' + r[3].split(', ').map(x => '<span class="tag">' + x + '</span>').join('') + '</td><td>' + r[4] + '<small class="sub">teacher@sunrise.edu.in</small></td><td><span class="pill">Active</span></td><td class="row-actions"><button onclick="details(' + i + ')">◉</button><button>Toggle</button></td></tr>'
  ).join('');

  app.innerHTML =
    '<section class="people-heading"><div><h1>' + meta[tab][0] + '</h1><p>' + meta[tab][1] + '</p></div><div class="toolbar"><button class="tool" onclick="csv()">⇩ Export CSV</button><button class="tool primary" onclick="openForm()">＋ ' + meta[tab][2] + '</button></div></section>' +
    '<section class="filters"><input placeholder="⌕ Search ' + tab + '…"><select><option>All classes</option><option>Class 5</option><option>Class 6</option></select><b>Total: ' + data[tab].length + ' ' + tab + '</b></section>' +
    '<section class="directory"><table><thead><tr>' + heads.map(x => '<th>' + x + '</th>').join('') + '</tr></thead><tbody>' + rows + '</tbody></table><div class="pager">Showing 1 - ' + data[tab].length + ' of ' + data[tab].length + ' entries</div></section>';
}

render();

const filterInput = app.querySelector('.filters input');
const classFilter = app.querySelector('.filters select');

function applyFilters() {
  const needle = filterInput.value.trim().toLowerCase();
  const selected = classFilter.value.toLowerCase();
  app.querySelectorAll('tbody tr').forEach(row => {
    const text = row.textContent.toLowerCase();
    const matchesText = !needle || text.includes(needle);
    const matchesClass = selected === 'all classes' || text.includes(selected);
    row.style.display = matchesText && matchesClass ? '' : 'none';
  });
}

filterInput.addEventListener('input', applyFilters);
classFilter.addEventListener('change', applyFilters);
