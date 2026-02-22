window.onload = function () {
  document.body.classList.add('loaded');

  headerTextSplitter();
  navObserver();
};

function headerTextSplitter() {
  const hs = document.querySelectorAll('h1, h2');
  hs.forEach(
    (h) =>
      (h.innerHTML =
        h.textContent
          .split(' ')
          .map((word, i) => `<span>${word}</span>`)
          .join(' ') + '<span>.</span>'),
  );
}

function navObserver() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => link.classList.remove('active'));
          const active = document.querySelector(`nav a[href="#${entry.target.id}"]`);
          if (active) {
            active.classList.add('active');
            history.replaceState(null, null, `#${entry.target.id}`);
          }
        }
      });
    },
    {
      threshold: 0,
      rootMargin: '-20% 0px -80% 0px',
    },
  );

  sections.forEach((s) => observer.observe(s));
}
