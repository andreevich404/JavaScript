'use strict';

class BaseRenderer {
	constructor({ container }) {
		this.container = container;
	}

	clear() {
		this.container.replaceChildren();
	}

	createEl(tag, { className, text, attrs } = {}) {
		const el = document.createElement(tag);

		if (className) {
			el.className = className;
		}

		if (typeof text === 'string') {
			el.textContent = text;
		}

		if (attrs && typeof attrs === 'object') {
			for (const [ key, value ] of Object.entries(attrs)) {
				if (value === null || value === undefined) {
					continue;
				}

				el.setAttribute(key, String(value));
			}
		}

		return el;
	}
}

export { BaseRenderer };
