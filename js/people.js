const q = new URLSearchParams(location.search);
const tab = q.get('tab') || 'students';
const app = document.getElementById('app');
const modal = document.getElementById('modal');
const card = document.getElementById('modalCard');

const data = {
  students: [
    ['ADM2026-0501', 'Aarav Krishnan', 'Class 5 · A', '01', 'Ramesh Krishnan', '+91 98840 11223', 'Active'],
    ['ADM2026-0502', 'Diya Krishnan', 'Class 5 · B', '02', 'Ramesh Krishnan', '+91 98840 11223', 'Active'],
    ['ADM2026-0503', 'Karthik Senthil', 'Class 5 · A', '03', 'Anitha Senthil', '+91 98840 22334', 'Active'],
    ['ADM2026-0601', 'Sneha Murugan', 'Class 6 · A', '01', 'Murugan Velu', '+91 98840 33445', 'Completed'],
    ['ADM2026-0602', 'Varun Chakravarthy', 'Class 6 · A', '02', 'S. Chakravarthy', '+91 98840 44556', 'Pending']
  ],
  parents: [
    ['Ramesh Krishnan', 'Father', '+91 98840 11223', 'ramesh.krishnan@gmail.com', 'Aarav Krishnan, Diya Krishnan', 'Active'],
    ['Anitha Senthil', 'Mother', '+91 98840 22334', 'anitha.s@gmail.com', 'Karthik Senthil', 'Active'],
    ['Murugan Velu', 'Father', '+91 98840 33445', 'murugan.velu@yahoo.com', 'Sneha Murugan', 'Active'],
    ['S. Chakravarthy', 'Father', '+91 98840 44556', 'chakravarthy.s@gmail.com', 'Varun Chakravarthy', 'Pending']
  ],
  teachers: [
    ['EMP-0104', 'M. Saravanan', 'Mathematics, Science', 'Class 5-A, Class 6-A', '+91 98410 23456', 'Active'],
    ['EMP-0108', 'K. Malathi', 'English, Tamil', 'Class 5-A, Class 5-B', '+91 98410 34567', 'Active'],
    ['EMP-0112', 'S. Jayaraman', 'Social Science, Computer Science', 'Class 6-A', '+91 98410 45678', 'Active']
  ]
};

const meta = {
  students: ['Student Directory', 'Manage student registrations, classroom assignments, and parent linkages', 'Enroll New Student'],
  parents: ['Parent Registry', 'Manage guardian accounts, verify mobile OTP access, and link children', 'Register Parent'],
  teachers: ['Faculty & Teachers', 'Manage teacher profiles, subject assignments, and timetable allocations', 'Add Faculty Member']
};

function statusClass(st) {
  const s = (st || 'Active').toLowerCase();
  if (s === 'active') return 'pill-active';
  if (s === 'completed') return 'pill-completed';
  if (s === 'pending') return 'pill-pending';
  return 'pill-inactive';
}

function csv() {
  const quote = value => '"' + value.replaceAll('"', '""') + '"';
  const headers = [...app.querySelectorAll('thead th')].map(cell => quote(cell.textContent.trim())).join(',');
  const rows = [...app.querySelectorAll('tbody tr.data-row')]
    .filter(row => row.style.display !== 'none')
    .map(row => [...row.querySelectorAll('td')].slice(0, -1).map(cell => quote(cell.textContent.replace(/\s+/g, ' ').trim())).join(','));
  const blob = new Blob([[headers, ...rows].join('\n')], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = tab + '-filtered-directory.csv';
  a.click();
  URL.revokeObjectURL(a.href);
  if (window.sunriseToast) window.sunriseToast(`Exported ${rows.length} ${tab} records to CSV.`);
}

function openForm() {
  const labels = tab === 'students'
    ? ['Full Student Name', 'Admission Number', 'Class & Section (e.g. Class 5 · A)', 'Roll Number', 'Parent Name', 'Parent Mobile Phone']
    : tab === 'parents'
      ? ['Full Guardian Name', 'Relationship (Father / Mother)', 'Registered Mobile Number', 'Email Address', 'Linked Children Names']
      : ['Full Faculty Name', 'Employee ID (e.g. EMP-0115)', 'Assigned Subjects', 'Assigned Classes', 'Mobile Number'];

  card.innerHTML =
    '<header><h2>' + meta[tab][2] + '</h2><button class="close" onclick="closeModal()">✕</button></header>' +
    '<form id="addRecordForm"><div class="form-grid">' +
    labels.map((x, idx) => '<label class="' + (idx === 0 ? 'full' : '') + '">' + x + ' *<input required id="field_' + idx + '" placeholder="Enter ' + x.toLowerCase() + '"></label>').join('') +
    '</div><div class="modal-actions"><button type="button" onclick="closeModal()">Cancel</button><button type="submit">Save Record</button></div></form>';
  modal.classList.add('open');

  document.getElementById('addRecordForm').addEventListener('submit', e => {
    e.preventDefault();
    const vals = labels.map((_, idx) => document.getElementById('field_' + idx).value.trim());
    if (tab === 'students') {
      data.students.unshift([vals[1] || 'ADM2026-0599', vals[0], vals[2] || 'Class 5 · A', vals[3] || '09', vals[4] || 'Parent', vals[5] || '+91 98840 00000', 'Active']);
    } else if (tab === 'parents') {
      data.parents.unshift([vals[0], vals[1] || 'Guardian', vals[2] || '+91 98840 00000', vals[3] || 'parent@email.com', vals[4] || 'Student', 'Active']);
    } else {
      data.teachers.unshift([vals[1] || 'EMP-0120', vals[0], vals[2] || 'Mathematics', vals[3] || 'Class 5-A', vals[4] || '+91 98410 00000', 'Active']);
    }
    closeModal();
    render();
    if (window.sunriseToast) window.sunriseToast(`Added "${vals[0]}" to ${meta[tab][0]}.`);
  });
}

function details(i) {
  const row = data[tab][i];
  const name = tab === 'students' ? row[1] : tab === 'parents' ? row[0] : row[1];
  const st = row[row.length - 1];
  card.innerHTML =
    '<header><h2>' + name + ' Profile</h2><button class="close" onclick="closeModal()">✕</button></header>' +
    '<div class="detail-box">' +
    row.slice(0, -1).map((x, j) => '<div><b>' + ['ID / Primary', 'Name / Role', 'Class / Contact', 'Roll / Email', 'Contact / Wards', 'Mobile'][j] + ':</b> ' + x + '</div>').join('') +
    '<div style="margin-top:8px"><b>Status:</b> <span class="pill ' + statusClass(st) + '">' + st + '</span></div></div>' +
    '<div class="modal-actions"><button type="button" onclick="closeModal()">Close</button></div>';
  modal.classList.add('open');
}

function toggleRowStatus(i) {
  const row = data[tab][i];
  const name = tab === 'students' ? row[1] : tab === 'parents' ? row[0] : row[1];
  const current = row[row.length - 1];
  const next = current === 'Active' ? 'Inactive' : 'Active';

  if (window.sunriseConfirm) {
    window.sunriseConfirm({
      title: 'Change Status?',
      message: `Update status for ${name} from "${current}" to "${next}"?`,
      confirmText: 'Update Status',
      onConfirm: () => {
        row[row.length - 1] = next;
        render();
        if (window.sunriseToast) window.sunriseToast(`${name} marked as ${next}.`);
      }
    });
  }
}

function removeRow(i) {
  const row = data[tab][i];
  const name = tab === 'students' ? row[1] : tab === 'parents' ? row[0] : row[1];

  if (window.sunriseConfirm) {
    window.sunriseConfirm({
      title: 'Delete Directory Record?',
      message: `Are you sure you want to remove ${name} from ${meta[tab][0]}?`,
      confirmText: 'Delete Record',
      danger: true,
      onConfirm: () => {
        data[tab].splice(i, 1);
        render();
        if (window.sunriseToast) window.sunriseToast(`Removed ${name} from directory.`);
      }
    });
  }
}

function closeModal() {
  modal.classList.remove('open');
}

function render() {
  const heads = tab === 'students'
    ? ['Adm No.', 'Student Name', 'Class & Sec', 'Roll', 'Parent / Contact', 'Status', 'Actions']
    : tab === 'parents'
      ? ['Parent Name', 'Contact Details', 'Linked Wards / Students', 'Portal Status', 'Actions']
      : ['Emp ID', 'Faculty Member', 'Subjects Taught', 'Assigned Classes', 'Contact', 'Status', 'Actions'];

  const rows = data[tab].map((r, i) => {
    const st = r[r.length - 1];
    const badge = '<span class="pill ' + statusClass(st) + '">' + st + '</span>';
    if (tab === 'students') {
      return '<tr class="data-row" data-status="' + st.toLowerCase() + '"><td class="id">' + r[0] + '</td><td><span class="avatar-sm">' + r[1].split(' ').map(x => x[0]).join('') + '</span><strong>' + r[1] + '</strong><small class="sub">DOB: 2016-04-12</small></td><td>' + r[2] + '</td><td>' + r[3] + '</td><td>' + r[4] + '<small class="sub">' + r[5] + '</small></td><td>' + badge + '</td><td class="row-actions"><button onclick="details(' + i + ')" title="View Profile">View</button><button onclick="toggleRowStatus(' + i + ')">Toggle</button><button class="danger-btn" onclick="removeRow(' + i + ')">Delete</button></td></tr>';
    }
    if (tab === 'parents') {
      return '<tr class="data-row" data-status="' + st.toLowerCase() + '"><td><span class="avatar-sm">' + r[0][0] + '</span><strong>' + r[0] + '</strong><small class="sub">' + r[1] + '</small></td><td>' + r[2] + '<small class="sub">' + r[3] + '</small></td><td>' + r[4].split(', ').map(x => '<span class="tag">' + x + '</span>').join('') + '</td><td>' + badge + '</td><td class="row-actions"><button onclick="details(' + i + ')">View</button><button onclick="toggleRowStatus(' + i + ')">Toggle Access</button><button class="danger-btn" onclick="removeRow(' + i + ')">Delete</button></td></tr>';
    }
    return '<tr class="data-row" data-status="' + st.toLowerCase() + '"><td class="id">' + r[0] + '</td><td><span class="avatar-sm">' + r[1][0] + '</span><strong>' + r[1] + '</strong></td><td>' + r[2].split(', ').map(x => '<span class="tag">' + x + '</span>').join('') + '</td><td>' + r[3].split(', ').map(x => '<span class="tag">' + x + '</span>').join('') + '</td><td>' + r[4] + '<small class="sub">faculty@sunriseschool.edu.in</small></td><td>' + badge + '</td><td class="row-actions"><button onclick="details(' + i + ')">View</button><button onclick="toggleRowStatus(' + i + ')">Toggle</button><button class="danger-btn" onclick="removeRow(' + i + ')">Delete</button></td></tr>';
  }).join('');

  app.innerHTML =
    '<section class="people-heading"><div><h1>' + meta[tab][0] + '</h1><p>' + meta[tab][1] + '</p></div><div class="toolbar"><button class="tool" onclick="csv()">⇩ Export CSV</button><button class="tool primary" onclick="openForm()">＋ ' + meta[tab][2] + '</button></div></section>' +
    '<section class="filters"><input id="dirSearchInput" placeholder="⌕ Search ' + tab + ' by name, ID, or phone…"><select id="dirClassSelect"><option value="all classes">All Classes</option><option value="class 5">Class 5</option><option value="class 6">Class 6</option></select><select id="dirStatusSelect"><option value="all">All Statuses</option><option value="active">Active</option><option value="completed">Completed</option><option value="pending">Pending</option><option value="inactive">Inactive</option></select><b id="dirCountLabel">Total: ' + data[tab].length + ' ' + tab + '</b></section>' +
    '<section class="directory"><table><thead><tr>' + heads.map(x => '<th>' + x + '</th>').join('') + '</tr></thead><tbody id="dirTableBody">' + rows + '<tr id="dirEmptyRow" style="display:none"><td colspan="' + heads.length + '" style="text-align:center;padding:36px 20px"><strong>No matching ' + tab + ' records found</strong><small class="sub">Try adjusting your search or filter criteria above.</small></td></tr></tbody></table><div class="pager" id="dirPager">Showing ' + data[tab].length + ' of ' + data[tab].length + ' entries</div></section>';

  const filterInput = document.getElementById('dirSearchInput');
  const classFilter = document.getElementById('dirClassSelect');
  const statusFilter = document.getElementById('dirStatusSelect');
  const emptyRow = document.getElementById('dirEmptyRow');
  const pager = document.getElementById('dirPager');

  function applyFilters() {
    const needle = filterInput.value.trim().toLowerCase();
    const selectedClass = classFilter.value.toLowerCase();
    const selectedStatus = statusFilter.value.toLowerCase();
    let visibleCount = 0;

    app.querySelectorAll('tbody tr.data-row').forEach(row => {
      const text = row.textContent.toLowerCase();
      const rowStatus = row.dataset.status || 'active';
      const matchesText = !needle || text.includes(needle);
      const matchesClass = selectedClass === 'all classes' || text.includes(selectedClass);
      const matchesStatus = selectedStatus === 'all' || rowStatus === selectedStatus;
      const show = matchesText && matchesClass && matchesStatus;
      row.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });

    emptyRow.style.display = visibleCount === 0 ? '' : 'none';
    pager.textContent = `Showing ${visibleCount} of ${data[tab].length} entries`;
  }

  filterInput.addEventListener('input', applyFilters);
  classFilter.addEventListener('change', applyFilters);
  statusFilter.addEventListener('change', applyFilters);
}

render();
