'use strict';

class ErrorRenderer {
	constructor({ container }) {
		this.container = container;
	}

	show(message) {
		this.container.textContent = message || '';
		this.container.classList.remove('hidden');
	}

	clear() {
		this.container.textContent = '';
		this.container.classList.add('hidden');
	}
}

export { ErrorRenderer };
