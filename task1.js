// ── Прокси для обхода CORS (если потребуется) ──────────────────────────────
const PROXY = 'https://cors-anywhere.herokuapp.com/';

function proxyFetch(url, params) {
  return fetch(PROXY + url, params);
}

// ── Состояние ───────────────────────────────────────────────────────────────
let isFirstAttempt = true;
let currentAnimal = '';

// ── Элементы DOM ────────────────────────────────────────────────────────────
const screenWelcome  = document.getElementById('screen-welcome');
const screenAnimals  = document.getElementById('screen-animals');
const screenFact     = document.getElementById('screen-fact');

const welcomeTitle   = document.getElementById('welcome-title');
const welcomeName    = document.getElementById('welcome-name');
const welcomeButtons = document.getElementById('welcome-buttons');

const btnAccept      = document.getElementById('btn-accept');
const btnRetry       = document.getElementById('btn-retry');
const btnNewFact     = document.getElementById('btn-new-fact');
const btnBackAnimals = document.getElementById('btn-back-animals');
const factContent    = document.getElementById('fact-content');

// ── Вспомогательные ─────────────────────────────────────────────────────────
function showScreen(screen) {
  [screenWelcome, screenAnimals, screenFact].forEach(s => {
    s.hidden = (s !== screen);
  });
}

function makeSpinner() {
  const span = document.createElement('span');
  span.className = 'spinner';
  return span;
}

function showLoadingInEl(el, msg) {
  el.textContent = '';
  el.appendChild(makeSpinner());
  el.appendChild(document.createTextNode(' ' + msg));
}

// ── Получение случайного имени ───────────────────────────────────────────────
async function fetchRandomName() {
  const res = await fetch('https://randomuser.me/api/?nat=us,gb&inc=name');
  const data = await res.json();
  const { first, last } = data.results[0].name;
  return `${first} ${last}`;
}

// ── Отображение приветственного экрана ──────────────────────────────────────
async function showWelcomeScreen() {
  showScreen(screenWelcome);
  welcomeName.hidden = true;
  welcomeButtons.hidden = true;
  showLoadingInEl(welcomeTitle, 'Загрузка имени...');

  let name;
  try {
    name = await fetchRandomName();
  } catch {
    const fallback = ['River Fox', 'Sky Wolf', 'Moon Bird', 'Star Bear', 'Cloud Tiger'];
    name = fallback[Math.floor(Math.random() * fallback.length)];
  }

  // Формируем текст приветствия через DOM — без innerHTML
  welcomeTitle.textContent = isFirstAttempt
    ? 'Добро пожаловать, странник! Я буду звать тебя'
    : 'Хм... Тогда что насчёт';

  welcomeName.textContent = name + (isFirstAttempt ? ', ок?' : '?');
  welcomeName.hidden = false;
  welcomeButtons.hidden = false;
}

// ── Получение факта и картинки ───────────────────────────────────────────────
async function fetchAnimalData(animal) {
  const res = await fetch(`https://some-random-api.com/animal/${animal}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json(); // { fact: "...", image: "..." }
}

async function fetchFallbackData(animal) {
  if (animal === 'cat') {
    const [factRes, imgRes] = await Promise.all([
      fetch('https://catfact.ninja/fact'),
      fetch('https://api.thecatapi.com/v1/images/search')
    ]);
    const factData = await factRes.json();
    const imgData  = await imgRes.json();
    return { fact: factData.fact, image: imgData[0].url };
  }

  if (animal === 'dog') {
    const [imgRes, factRes] = await Promise.all([
      fetch('https://dog.ceo/api/breeds/image/random'),
      fetch('https://dogapi.dog/api/v2/facts?limit=1')
    ]);
    const imgData  = await imgRes.json();
    const factData = await factRes.json();
    return { fact: factData.data[0].attributes.body, image: imgData.message };
  }

  // Лисы — картинка + статичный факт
  const imgRes  = await fetch('https://randomfox.ca/floof/');
  const imgData = await imgRes.json();
  const foxFacts = [
    'Лисы используют магнитное поле Земли для охоты.',
    'Лисы умеют подражать звукам других животных.',
    'У лис вертикальные зрачки — совсем как у кошек.',
    'Лисий хвост называется «правило» и помогает балансировать.',
    'Лисы могут перепрыгнуть забор высотой почти 2 метра.'
  ];
  return {
    fact: foxFacts[Math.floor(Math.random() * foxFacts.length)],
    image: imgData.image
  };
}

// ── Рендер экрана с фактом через DOM API ────────────────────────────────────
async function loadFact(animal) {
  showScreen(screenFact);
  factContent.textContent = '';
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'empty-state';
  loadingDiv.appendChild(makeSpinner());
  loadingDiv.appendChild(document.createTextNode(' Загрузка...'));
  factContent.appendChild(loadingDiv);
  btnNewFact.disabled = true;

  let data;
  try {
    data = await fetchAnimalData(animal);
  } catch {
    try {
      data = await fetchFallbackData(animal);
    } catch (err) {
      factContent.textContent = '';
      const errDiv = document.createElement('div');
      errDiv.className = 'empty-state';
      errDiv.style.color = 'var(--danger)';
      errDiv.textContent = 'Не удалось загрузить данные. Проверьте подключение к интернету.';
      factContent.appendChild(errDiv);
      btnNewFact.disabled = false;
      return;
    }
  }

  // Сборка DOM без innerHTML
  factContent.textContent = '';

  const imgWrap = document.createElement('div');
  imgWrap.className = 'fact-image-wrap';

  const img = document.createElement('img');
  img.className = 'fact-image';
  img.src = data.image;
  img.alt = 'Фото животного';
  img.referrerPolicy = 'no-referrer';
  img.loading = 'lazy';
  imgWrap.appendChild(img);

  const factP = document.createElement('p');
  factP.className = 'fact-text';
  factP.textContent = '\u201C' + data.fact + '\u201D';

  factContent.appendChild(imgWrap);
  factContent.appendChild(factP);

  btnNewFact.disabled = false;
}

// ── Обработчики событий ──────────────────────────────────────────────────────
btnAccept.addEventListener('click', () => showScreen(screenAnimals));

btnRetry.addEventListener('click', () => {
  isFirstAttempt = false;
  showWelcomeScreen();
});

document.querySelectorAll('.animal-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentAnimal = btn.dataset.animal;
    loadFact(currentAnimal);
  });
});

btnNewFact.addEventListener('click', () => {
  if (currentAnimal) loadFact(currentAnimal);
});

btnBackAnimals.addEventListener('click', () => showScreen(screenAnimals));

// ── Старт ────────────────────────────────────────────────────────────────────
showWelcomeScreen();
