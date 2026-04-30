'use strict';

import { BaseRenderer } from './BaseRenderer.js';

function statusBadgeClass(key) {
	if (key === 'success') {
		return 'badge badge--success';
	}

	if (key === 'failure') {
		return 'badge badge--failure';
	}

	if (key === 'upcoming') {
		return 'badge badge--upcoming';
	}

	return 'badge';
}

class TableRenderer extends BaseRenderer {
	constructor({ container, state, modal }) {
		super({ container });
		this.state = state;
		this.modal = modal;
		this._wired = false;
	}

	render() {
		if (!this._wired) {
			this._wire();
			this._wired = true;
		}

		this.clear();

		if (this.state.loading) {
			this.container.append(this.createEl('div', { text: 'Загрузка...' }));
			return;
		}

		const launches = this.state.getVisibleLaunches();

		if (!launches.length) {
			this.container.append(this.createEl('div', { text: 'Ничего не найдено.' }));
			return;
		}

		const table = this.createEl('table', { className: 'table' });
		table.append(this._thead(), this._tbody(launches));
		this.container.append(table);
	}

	_thead() {
		const thead = this.createEl('thead');
		const tr = this.createEl('tr');

		tr.append(
			this._thNumber(),
			this._th('Название', 'name'),
			this._th('Ракета', 'rocket'),
			this._th('Дата', 'date'),
			this._th('Статус', 'status'),
			this.createEl('th', { text: 'Действия', attrs: { 'data-col': 'actions' } }),
		);

		thead.append(tr);
		return thead;
	}

	_th(text, col) {
		const th = this.createEl('th', { text, attrs: { 'data-col': col } });
		const isActive = this.state.sort.column === col;
		if (isActive) {
			th.textContent = `${text} ${this.state.sort.direction === 'asc' ? '↑' : '↓'}`;
		}

		return th;
	}

	_thNumber() {
		const th = this.createEl('th', {
			text: '№',
			attrs: {
				'data-col': 'number',
				title: 'Порядковый номер попытки запуска у выбранного оператора (agency_launch_attempt_count в Launch Library)',
			},
		});
		const isActive = this.state.sort.column === 'number';
		if (isActive) {
			th.textContent = `№ ${this.state.sort.direction === 'asc' ? '↑' : '↓'}`;
		}

		return th;
	}

	_tbody(launches) {
		const tbody = this.createEl('tbody');

		for (const l of launches) {
			const tr = this.createEl('tr', { attrs: { 'data-launch-id': l.id } });

			const statusKey = l.getStatusKey();
			const status = this.createEl('span', { className: statusBadgeClass(statusKey), text: l.getStatusLabel() });

			const btnStar = this.createEl('button', {
				className: this.state.isFavorite(l.id) ? 'star-btn is-on' : 'star-btn',
				text: this.state.isFavorite(l.id) ? '★' : '☆',
				attrs: { type: 'button', 'data-action': 'favorite', title: 'Избранное' },
			});

			tr.append(
				this.createEl('td', { text: l.getFlightDisplay() }),
				this.createEl('td', { text: l.name }),
				this.createEl('td', { text: l.getRocketName() }),
				this.createEl('td', { text: l.getDateLabel() }),
				this._tdNode(status),
				this._tdNode(btnStar),
			);

			tbody.append(tr);
		}

		return tbody;
	}

	_tdNode(node) {
		const td = this.createEl('td');
		td.append(node);
		return td;
	}

	_wire() {
		this.container.addEventListener('click', (e) => {
			const th = e.target.closest('th');
			if (th && th.dataset.col && th.dataset.col !== 'actions') {
				this.state.setSort({ column: th.dataset.col });
				return;
			}

			const btn = e.target.closest('button');
			if (btn && btn.dataset.action === 'favorite') {
				const tr = btn.closest('tr');
				if (tr && tr.dataset.launchId) {
					this.state.toggleFavorite(tr.dataset.launchId);
				}

				return;
			}

			const tr = e.target.closest('tr');
			if (tr && tr.dataset.launchId) {
				const launch = this.state.launches.find((x) => x.id === tr.dataset.launchId);
				this.modal.open(launch);
			}
		});
	}
}

export { TableRenderer };
