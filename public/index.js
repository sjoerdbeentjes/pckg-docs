(function () {
  const scrollKey = 'sidebarScrollPosition';
  const sidebarEl = document.querySelector('.sidebar');
  const searchInputEl = document.querySelector('input[type="search"]');
  const packageEls = document.querySelectorAll('.sidebar ul li');
  const storedPosition = sessionStorage.getItem(scrollKey);
  const formEl = document.querySelector('.sidebar form');

  if (storedPosition) {
    sidebarEl.scrollTop = Number(storedPosition);
  }

  sidebarEl.addEventListener('scroll', () => {
    sessionStorage.setItem(scrollKey, sidebarEl.scrollTop);
  });

  searchInputEl.addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();

    packageEls.forEach((packageEl) => {
      const name = packageEl.getAttribute('data-name');
      const match = name.includes(query.toLowerCase());

      if (match) {
        packageEl.classList.remove('hidden');
      } else {
        packageEl.classList.add('hidden');
      }
    });
  });

  formEl.addEventListener('submit', (event) => {
    event.preventDefault();
  });
}());
