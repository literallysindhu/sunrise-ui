(() => {
  const tabs = document.querySelector('.tabs');
  if (tabs && !tabs.querySelector('.logout-link')) {
    const wrap = document.createElement('div');
    wrap.className = 'nav-actions';
    wrap.innerHTML = '<a class="logout-link" href="landing.html?logout=1">Log out →</a>';
    tabs.appendChild(wrap);
  }

  const profile = localStorage.getItem('sunrise-profile');
  if (profile !== 'diya') return;

  const changes = [
    ['Aarav Krishnan', 'Diya Krishnan'],
    ['Aarav’s', 'Diya’s'],
    ['Aarav', 'Diya'],
    ['Class 5-A', 'Class 5-B'],
    ['Roll no. 01', 'Roll no. 02'],
    ['ADM2026-0501', 'ADM2026-0502'],
    ['₹12,500', '₹13,000']
  ];

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach(node => {
    let value = node.nodeValue;
    changes.forEach(([from, to]) => {
      value = value.split(from).join(to);
    });
    node.nodeValue = value;
  });
})();
