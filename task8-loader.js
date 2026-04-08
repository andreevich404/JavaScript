(function runLoader() {
  const loaderBar = document.getElementById('loader-bar');
  const loaderText = document.getElementById('loader-text');
  const loaderScreen = document.getElementById('loader-screen');

  let progress = 0;
  const step = 5;
  const interval = setInterval(() => {
    progress += step;
    loaderBar.style.width = `${progress}%`;
    loaderText.textContent = `${progress}%`;

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        const app = document.getElementById('task8-app');
        loaderScreen.style.display = 'none';
        if (app) {
          app.hidden = false;
        }
      }, 100);
    }
  }, 100);
})();
