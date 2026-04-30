'use strict';

import { BaseRenderer } from './BaseRenderer.js';

class StatsRenderer extends BaseRenderer {
	constructor({ container, state }) {
		super({ container });
		this.state = state;
	}

	render() {
		this.clear();

		if (this.state.loading) {
			this.container.append(this.createEl('div', { text: 'Загрузка статистики…' }));
			return;
		}

		const s = this.state.getStats();

		const grid = this.createEl('div');
		grid.style.display = 'grid';
		grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(160px, 1fr))';
		grid.style.gap = '12px';

		grid.append(
			this._card('Всего', String(s.total)),
			this._card('Успешных', String(s.success)),
			this._card('Неудачных', String(s.failure)),
			this._card('Предстоящих', String(s.upcoming)),
			this._card('Успех, %', String(s.successPct)),
			this._card('Топ-ракета', s.topRocketName),
		);

		this.container.append(grid);
	}

	_card(label, value) {
		const wrap = this.createEl('div', { className: 'meta__item' });
		const l = this.createEl('div', { className: 'meta__label', text: label });
		const v = this.createEl('div', { text: value });
		wrap.append(l, v);
		return wrap;
	}
}

export { StatsRenderer };
