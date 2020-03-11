(function () {
  const scrollKey = 'sidebarScrollPosition';
  const sidebarEl = document.querySelector('.sidebar');
  const storedPosition = sessionStorage.getItem(scrollKey);

  if (storedPosition) {
    sidebarEl.scrollTop = Number(storedPosition);
  }

  sidebarEl.addEventListener('scroll', (event) => {
    sessionStorage.setItem(scrollKey, sidebarEl.scrollTop);
  });
}());
