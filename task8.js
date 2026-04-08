const stageRoot = document.getElementById('task8-stage');
const progressBar = document.getElementById('task8-progress-bar');
const progressLabel = document.getElementById('task8-progress-label');

const countries = [
  'Россия', 'Казахстан', 'Беларусь', 'Германия', 'Франция', 'Италия',
  'Испания', 'Канада', 'США', 'Япония', 'Китай', 'Бразилия'
];

const state = {
  step: 0,
  personal: {
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    password: '',
    confirmPassword: ''
  },
  phone: {
    number: '',
    code: '',
    codeVisible: false,
    verified: false
  },
  payment: {
    cardParts: ['', '', '', ''],
    cardName: '',
    expiry: '',
    cvv: ''
  }
};

function setProgress(step) {
  const progressMap = {
    0: 0,
    1: 33,
    2: 66,
    3: 100,
    4: 100
  };
  progressBar.style.width = `${progressMap[step]}%`;
  progressLabel.textContent = step === 0 ? 'Шаг 0 из 3' : `Шаг ${Math.min(step, 3)} из 3`;
}

function renderWelcome() {
  state.step = 0;
  setProgress(0);
  stageRoot.innerHTML = `
    <section class="task8-stage-box">
      <h2 class="task8-title">Добро пожаловать</h2>
      <p class="task8-copy">
        Нажмите кнопку ниже, чтобы пройти регистрацию в три шага: персональные данные,
        подтверждение телефона и подключение способа оплаты.
      </p>
      <div class="task8-actions">
        <button class="task8-button" id="start-registration">Начать регистрацию</button>
      </div>
    </section>
  `;
  document.getElementById('start-registration').addEventListener('click', renderStepOne);
}

function renderCountries() {
  return countries.map(country => `<option value="${country}">${country}</option>`).join('');
}

function renderStepOne() {
  state.step = 1;
  setProgress(1);
  stageRoot.innerHTML = `
    <section class="task8-stage-box">
      <h2 class="task8-title">Шаг 1. Персональные данные</h2>
      <div class="task8-grid">
        <div class="task8-field">
          <label for="first-name">Имя</label>
          <input id="first-name" type="text" value="${state.personal.firstName}">
        </div>
        <div class="task8-field">
          <label for="last-name">Фамилия</label>
          <input id="last-name" type="text" value="${state.personal.lastName}">
        </div>
        <div class="task8-field full">
          <label for="email">Email</label>
          <input id="email" type="email" value="${state.personal.email}">
        </div>
        <div class="task8-field full">
          <label for="country">Страна</label>
          <select id="country">
            <option value="">Выберите страну</option>
            ${renderCountries()}
          </select>
        </div>
        <div class="task8-field">
          <label for="password">Пароль</label>
          <input id="password" type="password" value="${state.personal.password}">
        </div>
        <div class="task8-field">
          <label for="confirm-password">Подтверждение пароля</label>
          <input id="confirm-password" type="password" value="${state.personal.confirmPassword}">
        </div>
      </div>
      <div class="task8-note" id="step-one-note">Заполните все поля. Пароли должны совпадать.</div>
      <div class="task8-actions">
        <button class="task8-secondary" id="cancel-step-one">Отмена</button>
        <button class="task8-button" id="next-step-one" disabled>Далее</button>
      </div>
    </section>
  `;

  document.getElementById('country').value = state.personal.country;

  const inputs = ['first-name', 'last-name', 'email', 'country', 'password', 'confirm-password']
    .map(id => document.getElementById(id));

  function syncState() {
    state.personal.firstName = document.getElementById('first-name').value.trim();
    state.personal.lastName = document.getElementById('last-name').value.trim();
    state.personal.email = document.getElementById('email').value.trim();
    state.personal.country = document.getElementById('country').value;
    state.personal.password = document.getElementById('password').value;
    state.personal.confirmPassword = document.getElementById('confirm-password').value;

    const passwordsMatch = state.personal.password !== '' && state.personal.password === state.personal.confirmPassword;
    const allFilled = Object.values(state.personal).every(Boolean);
    document.getElementById('next-step-one').disabled = !(allFilled && passwordsMatch);
    document.getElementById('step-one-note').textContent = passwordsMatch || state.personal.confirmPassword === ''
      ? 'Заполните все поля. Пароли должны совпадать.'
      : 'Пароли не совпадают.';
  }

  inputs.forEach(input => input.addEventListener('input', syncState));
  document.getElementById('country').addEventListener('change', syncState);
  document.getElementById('cancel-step-one').addEventListener('click', renderWelcome);
  document.getElementById('next-step-one').addEventListener('click', renderStepTwo);
  syncState();
}

function renderStepTwo() {
  state.step = 2;
  setProgress(2);
  stageRoot.innerHTML = `
    <section class="task8-stage-box">
      <h2 class="task8-title">Шаг 2. Подтверждение телефона</h2>
      <div class="task8-grid">
        <div class="task8-field full">
          <label for="phone-number">Телефон</label>
          <input id="phone-number" type="tel" placeholder="+7 (999) 999-99-99" value="${state.phone.number}">
        </div>
      </div>
      <div class="task8-actions">
        <button class="task8-secondary" id="back-step-two">Назад</button>
        <button class="task8-button" id="send-code">Отправить</button>
      </div>
      <div id="code-block" class="task8-note" ${state.phone.codeVisible ? '' : 'hidden'}>
        <div class="task8-grid">
          <div class="task8-field full">
            <label for="phone-code">Код подтверждения</label>
            <input id="phone-code" type="text" maxlength="4" placeholder="Введите 4 цифры" value="${state.phone.code}">
          </div>
        </div>
        <div class="task8-actions">
          <button class="task8-button" id="check-code">Проверить</button>
          <button class="task8-button" id="next-step-two" ${state.phone.verified ? '' : 'disabled'}>Далее</button>
        </div>
      </div>
    </section>
  `;

  document.getElementById('back-step-two').addEventListener('click', renderStepOne);
  document.getElementById('send-code').addEventListener('click', () => {
    const phone = document.getElementById('phone-number').value.trim();
    const digits = phone.replace(/\D/g, '');
    state.phone.number = phone;
    if (digits.length < 10) {
      alert('Введите корректный номер телефона.');
      return;
    }
    state.phone.codeVisible = true;
    state.phone.verified = false;
    renderStepTwo();
  });

  if (state.phone.codeVisible) {
    document.getElementById('check-code').addEventListener('click', () => {
      const code = document.getElementById('phone-code').value.trim();
      state.phone.code = code;
      state.phone.verified = /^\d{4}$/.test(code);
      if (!state.phone.verified) {
        alert('Введите любое четырёхзначное число.');
      }
      renderStepTwo();
    });

    const nextButton = document.getElementById('next-step-two');
    if (nextButton) {
      nextButton.addEventListener('click', renderStepThree);
    }
  }
}

function renderStepThree() {
  state.step = 3;
  setProgress(3);
  stageRoot.innerHTML = `
    <section class="task8-stage-box">
      <h2 class="task8-title">Шаг 3. Способ оплаты</h2>
      <div class="task8-grid">
        <div class="task8-field full">
          <label>Номер карты</label>
          <div class="task8-card-inputs">
            <input class="card-part" type="text" maxlength="4" value="${state.payment.cardParts[0]}">
            <input class="card-part" type="text" maxlength="4" value="${state.payment.cardParts[1]}">
            <input class="card-part" type="text" maxlength="4" value="${state.payment.cardParts[2]}">
            <input class="card-part" type="text" maxlength="4" value="${state.payment.cardParts[3]}">
          </div>
        </div>
        <div class="task8-field full">
          <label for="card-name">Имя владельца</label>
          <input id="card-name" type="text" value="${state.payment.cardName}">
        </div>
        <div class="task8-field">
          <label for="card-expiry">Срок действия</label>
          <input id="card-expiry" type="text" placeholder="MM/YY" value="${state.payment.expiry}">
        </div>
        <div class="task8-field">
          <label for="card-cvv">CVV</label>
          <input id="card-cvv" type="password" maxlength="3" value="${state.payment.cvv}">
        </div>
      </div>
      <div class="task8-actions">
        <button class="task8-secondary" id="back-step-three">Назад</button>
        <button class="task8-button" id="finish-registration" disabled>Завершить</button>
      </div>
    </section>
  `;

  document.getElementById('back-step-three').addEventListener('click', renderStepTwo);

  const partInputs = Array.from(document.querySelectorAll('.card-part'));
  partInputs.forEach((input, index) => {
    input.addEventListener('input', () => {
      state.payment.cardParts[index] = input.value.replace(/\D/g, '').slice(0, 4);
      input.value = state.payment.cardParts[index];
      if (input.value.length === 4 && partInputs[index + 1]) {
        partInputs[index + 1].focus();
      }
      syncPaymentState();
    });
  });

  ['card-name', 'card-expiry', 'card-cvv'].forEach(id => {
    document.getElementById(id).addEventListener('input', syncPaymentState);
  });

  document.getElementById('finish-registration').addEventListener('click', renderSuccess);

  function syncPaymentState() {
    state.payment.cardName = document.getElementById('card-name').value.trim();
    state.payment.expiry = document.getElementById('card-expiry').value.trim();
    state.payment.cvv = document.getElementById('card-cvv').value.trim();

    const validCard = state.payment.cardParts.every(part => /^\d{4}$/.test(part));
    const validExpiry = /^\d{2}\/\d{2}$/.test(state.payment.expiry);
    const validCvv = /^\d{3}$/.test(state.payment.cvv);
    const validName = state.payment.cardName.length > 1;

    document.getElementById('finish-registration').disabled = !(validCard && validExpiry && validCvv && validName);
  }

  syncPaymentState();
}

function renderSuccess() {
  state.step = 4;
  setProgress(4);
  stageRoot.innerHTML = `
    <section class="task8-stage-box">
      <div class="task8-success">
        <h2 class="task8-title">Регистрация завершена</h2>
        <p class="task8-copy">Данные успешно сохранены. Вы можете начать регистрацию заново.</p>
      </div>
      <div class="task8-actions">
        <button class="task8-button" id="restart-registration">Начать заново</button>
      </div>
    </section>
  `;

  document.getElementById('restart-registration').addEventListener('click', () => {
    state.phone = { number: '', code: '', codeVisible: false, verified: false };
    state.payment = { cardParts: ['', '', '', ''], cardName: '', expiry: '', cvv: '' };
    renderWelcome();
  });
}

renderWelcome();
