'use strict';

const STORAGE_KEY = 'spacex_user_name';

function getEls() {
	const welcomeSection = document.getElementById('welcome');
	const mainSection = document.getElementById('main');
	const nameInput = document.getElementById('name-input');
	const btnNext = document.getElementById('btn-next');
	const greeting = document.getElementById('greeting');

	return {
		welcomeSection,
		mainSection,
		nameInput,
		btnNext,
		greeting,
	};
}

function showMain(name) {
	const els = getEls();

	els.greeting.textContent = `Привет, ${name}!`;
	els.welcomeSection.classList.add('hidden');
	els.mainSection.classList.remove('hidden');
}

function initWelcome(onSuccess) {
	const els = getEls();

	els.btnNext.disabled = els.nameInput.value.trim().length === 0;

	els.nameInput.addEventListener('input', () => {
		els.btnNext.disabled = els.nameInput.value.trim().length === 0;
	});

	els.btnNext.addEventListener('click', () => {
		const name = els.nameInput.value.trim();
		if (!name) {
			return;
		}

		sessionStorage.setItem(STORAGE_KEY, name);
		showMain(name);

		if (typeof onSuccess === 'function') {
			onSuccess(name);
		}
	});
}

export { initWelcome, STORAGE_KEY, showMain };
