const trigger = document.getElementById('newCircular');
const menu = document.getElementById('circularMenu');

if (trigger && menu) {
  trigger.addEventListener('click', () => menu.classList.toggle('open'));
  document.addEventListener('click', event => {
    if (!event.target.closest('.circular-actions')) {
      menu.classList.remove('open');
    }
  });
}
