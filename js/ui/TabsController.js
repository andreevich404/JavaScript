'use strict';

class TabsController {
	constructor({ state, container }) {
		this.state = state;
		this.container = container;
	}

	init() {
		this.container.addEventListener('click', (e) => {
			const btn = e.target.closest('button');
			if (!btn || !btn.dataset.tab) {
				return;
			}

			this.state.setFilter({ tab: btn.dataset.tab });
		});

		this.state.onChange(() => {
			this._sync();
		});

		this._sync();
	}

	_sync() {
		const active = this.state.filters.tab;
		const buttons = this.container.querySelectorAll('button[data-tab]');

		for (const b of buttons) {
			if (b.dataset.tab === active) {
				b.classList.add('is-active');
			}
			else {
				b.classList.remove('is-active');
			}
		}
	}
}

export { TabsController };
