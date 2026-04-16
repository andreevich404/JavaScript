import { getData } from './humansData.js';

// ── Состояние ────────────────────────────────────────────────────────────────
let allHumans    = [];   // полный набор данных (не теряется при смене фильтра)
let genderFilter = 'all';
let editingId    = null;
let nextId       = 1;

// ── Элементы DOM ─────────────────────────────────────────────────────────────
const loadBtn          = document.getElementById('load-btn');
const addBtn           = document.getElementById('add-btn');
const deleteSelectedBtn= document.getElementById('delete-selected-btn');
const tableContainer   = document.getElementById('table-container');
const modalBackdrop    = document.getElementById('modal-backdrop');
const modalTitle       = document.getElementById('modal-title');
const modalClose       = document.getElementById('modal-close');
const modalCancel      = document.getElementById('modal-cancel');
const humanForm        = document.getElementById('human-form');

const fFirstName = document.getElementById('f-firstName');
const fLastName  = document.getElementById('f-lastName');
const fAge       = document.getElementById('f-age');
const fGender    = document.getElementById('f-gender');
const fAddress   = document.getElementById('f-address');
const fPhone     = document.getElementById('f-phone');

// ── Фильтрация ────────────────────────────────────────────────────────────────
function getFiltered() {
  if (genderFilter === 'all') return allHumans;
  return allHumans.filter(h => h.gender === genderFilter);
}

// ── Цветовое кодирование по возрасту ─────────────────────────────────────────
function rowClass(age) {
  if (age < 18)  return 'row-young';
  if (age <= 60) return 'row-adult';
  return 'row-senior';
}

function ageBadgeClass(age) {
  if (age < 18)  return 'age-badge age-young';
  if (age <= 60) return 'age-badge age-adult';
  return 'age-badge age-senior';
}

const GENDER_LABEL = { male: 'Мужской', female: 'Женский' };

// ── Рендер таблицы через DOM API ─────────────────────────────────────────────
function renderTable() {
  const filtered = getFiltered();
  tableContainer.textContent = '';

  if (!allHumans.length) {
    const msg = document.createElement('div');
    msg.className = 'empty-state';
    msg.textContent = 'Нажмите «Загрузить» для получения данных';
    tableContainer.appendChild(msg);
    deleteSelectedBtn.hidden = true;
    return;
  }

  if (!filtered.length) {
    const msg = document.createElement('div');
    msg.className = 'empty-state';
    msg.textContent = 'Нет записей для выбранного фильтра';
    tableContainer.appendChild(msg);
    deleteSelectedBtn.hidden = true;
    return;
  }

  // Обёртка с горизонтальным скроллом
  const scroll = document.createElement('div');
  scroll.className = 'table-scroll';

  const table = document.createElement('table');
  table.className = 'humans-table';

  // Заголовок
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');

  const thCheck = document.createElement('th');
  const checkAll = document.createElement('input');
  checkAll.type = 'checkbox';
  checkAll.id = 'check-all';
  thCheck.appendChild(checkAll);
  headerRow.appendChild(thCheck);

  ['Имя', 'Фамилия', 'Возраст', 'Пол', 'Адрес', 'Телефон', 'Действия'].forEach(label => {
    const th = document.createElement('th');
    th.textContent = label;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Тело таблицы
  const tbody = document.createElement('tbody');

  filtered.forEach(human => {
    const tr = document.createElement('tr');
    tr.className = rowClass(human.age);
    tr.dataset.id = human.id;

    // Чекбокс
    const tdCheck = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'row-check';
    checkbox.dataset.id = human.id;
    checkbox.addEventListener('change', onCheckboxChange);
    tdCheck.appendChild(checkbox);
    tr.appendChild(tdCheck);

    // Данные
    [human.firstName, human.lastName].forEach(val => {
      const td = document.createElement('td');
      td.textContent = val;
      tr.appendChild(td);
    });

    // Возраст с бейджем
    const tdAge = document.createElement('td');
    const badge = document.createElement('span');
    badge.className = ageBadgeClass(human.age);
    badge.textContent = human.age;
    tdAge.appendChild(badge);
    tr.appendChild(tdAge);

    // Пол
    const tdGender = document.createElement('td');
    tdGender.textContent = GENDER_LABEL[human.gender] || human.gender;
    tr.appendChild(tdGender);

    // Адрес, Телефон
    [human.address, human.phone].forEach(val => {
      const td = document.createElement('td');
      td.textContent = val;
      tr.appendChild(td);
    });

    // Кнопки действий
    const tdActions = document.createElement('td');
    tdActions.className = 'action-cell';

    const editBtn = document.createElement('button');
    editBtn.className = 'icon-btn';
    editBtn.textContent = '✏️';
    editBtn.title = 'Редактировать';
    editBtn.addEventListener('click', () => openEditModal(human.id));

    const delBtn = document.createElement('button');
    delBtn.className = 'icon-btn';
    delBtn.textContent = '🗑️';
    delBtn.title = 'Удалить';
    delBtn.addEventListener('click', () => deleteOne(human.id));

    tdActions.appendChild(editBtn);
    tdActions.appendChild(delBtn);
    tr.appendChild(tdActions);

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  scroll.appendChild(table);
  tableContainer.appendChild(scroll);

  // «Выбрать всё»
  checkAll.addEventListener('change', () => {
    document.querySelectorAll('.row-check').forEach(cb => { cb.checked = checkAll.checked; });
    deleteSelectedBtn.hidden = !checkAll.checked;
  });

  deleteSelectedBtn.hidden = true;
}

function onCheckboxChange() {
  const any = [...document.querySelectorAll('.row-check')].some(cb => cb.checked);
  deleteSelectedBtn.hidden = !any;
}

// ── Загрузка данных ───────────────────────────────────────────────────────────
loadBtn.addEventListener('click', async () => {
  loadBtn.textContent = '⏳ Загрузка...';
  loadBtn.disabled = true;
  addBtn.disabled = true;

  try {
    const humans = await getData();
    allHumans = humans.map(h => ({ ...h, id: nextId++ }));
    renderTable();
    addBtn.disabled = false;
  } catch (err) {
    tableContainer.textContent = '';
    const errDiv = document.createElement('div');
    errDiv.className = 'empty-state';
    errDiv.style.color = 'var(--danger)';
    errDiv.textContent = 'Ошибка загрузки: ' + err.message;
    tableContainer.appendChild(errDiv);
  } finally {
    loadBtn.textContent = '⬇ Загрузить';
    loadBtn.disabled = false;
  }
});

// ── Фильтр по полу ────────────────────────────────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    genderFilter = btn.dataset.filter;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderTable();
  });
});

// ── CRUD: удаление ────────────────────────────────────────────────────────────
function deleteOne(id) {
  allHumans = allHumans.filter(h => h.id !== id);
  renderTable();
}

deleteSelectedBtn.addEventListener('click', () => {
  const selectedIds = new Set(
    [...document.querySelectorAll('.row-check:checked')].map(cb => Number(cb.dataset.id))
  );
  allHumans = allHumans.filter(h => !selectedIds.has(h.id));
  renderTable();
});

// ── CRUD: модальное окно (добавление / редактирование) ───────────────────────
addBtn.addEventListener('click', () => {
  editingId = null;
  modalTitle.textContent = 'Добавить запись';
  humanForm.reset();
  openModal();
});

function openEditModal(id) {
  const human = allHumans.find(h => h.id === id);
  if (!human) return;
  editingId = id;
  modalTitle.textContent = 'Редактировать запись';
  fFirstName.value = human.firstName;
  fLastName.value  = human.lastName;
  fAge.value       = human.age;
  fGender.value    = human.gender;
  fAddress.value   = human.address;
  fPhone.value     = human.phone;
  openModal();
}

function openModal()  { modalBackdrop.hidden = false; fFirstName.focus(); }
function closeModal() { modalBackdrop.hidden = true; }

modalClose.addEventListener('click', closeModal);
modalCancel.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', e => { if (e.target === modalBackdrop) closeModal(); });

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !modalBackdrop.hidden) closeModal();
});

humanForm.addEventListener('submit', e => {
  e.preventDefault();

  const human = {
    firstName: fFirstName.value.trim(),
    lastName:  fLastName.value.trim(),
    age:       Number(fAge.value),
    gender:    fGender.value,
    address:   fAddress.value.trim(),
    phone:     fPhone.value.trim()
  };

  if (!human.firstName || !human.lastName || !human.age || !human.address || !human.phone) {
    return; // Базовая проверка заполненности
  }

  if (editingId !== null) {
    const idx = allHumans.findIndex(h => h.id === editingId);
    if (idx !== -1) allHumans[idx] = { ...human, id: editingId };
  } else {
    allHumans.push({ ...human, id: nextId++ });
  }

  closeModal();
  renderTable();
  addBtn.disabled = false;
});
