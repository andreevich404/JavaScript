'use strict';

import { BaseRenderer } from './BaseRenderer.js';

class ModalRenderer extends BaseRenderer {
	constructor({ container, state }) {
		super({ container });
		this.state = state;
		this._onKeyDown = this._onKeyDown.bind(this);
		this._isOpen = false;
	}

	open(launch) {
		if (!launch) {
			return;
		}

		this._isOpen = true;
		this.container.classList.remove('hidden');
		this.container.setAttribute('aria-hidden', 'false');
		this.clear();

		const modal = this.createEl('div', {
			className: 'modal',
			attrs: { role: 'dialog', 'aria-modal': 'true' },
		});

		const header = this.createEl('div', { className: 'modal__header' });
		const titleWrap = this.createEl('div');
		const title = this.createEl('div', { className: 'modal__title', text: launch.name });
		const sub = this.createEl('div', {
			className: 'badge',
			text: `${launch.getDateLabel()} · ${launch.getStatusLabel()}`,
		});
		sub.style.marginTop = '8px';
		titleWrap.append(title, sub);

		const btnClose = this.createEl('button', {
			className: 'modal__close',
			text: '×',
			attrs: { type: 'button', 'aria-label': 'Закрыть' },
		});
		btnClose.addEventListener('click', () => {
			this.close();
		});

		header.append(titleWrap, btnClose);

		const meta = this.createEl('div', { className: 'meta modal__meta' });

		const rows = [
			[ 'Оператор', launch.getLaunchProviderLabel() ],
			[ '№ попытки у оператора', launch.getFlightDisplay() ],
			[ 'Миссия', launch.missionName || '—' ],
			[ 'Ракета', launch.getRocketName() ],
			[ 'Орбита', launch.getOrbitLabel() ],
			[ 'Окно запуска (UTC)', launch.getWindowLabel() ],
			[ 'Точность времени NET', launch.getNetPrecisionLabel() ],
			[ 'Вероятность пуска', launch.getProbabilityLabel() ],
			[ 'Погода и замечания', launch.getWeatherConcernsLabel() ],
			[ 'Стартовый комплекс', launch.getPadLabel() ],
			[ 'Статус в Launch Library', launch.getStatusCatalogLabel() ],
		];

		if (launch.webcastLive) {
			rows.push([ 'Трансляция', 'Запланирован прямой эфир' ]);
		}

		if (launch.hashtag) {
			rows.push([ 'Хэштег', `#${launch.hashtag.replace(/^#/, '')}` ]);
		}

		const fail = launch.getFailReasonLabel();
		if (fail) {
			rows.push([ 'Причина неудачи', fail ]);
		}

		for (const [ label, value ] of rows) {
			meta.append(this._metaItem(label, value));
		}

		const rocket = launch.getRocket();
		const rocketBlock = this.createEl('div', { className: 'modal__section' });
		const rocketTitle = this.createEl('div', { className: 'meta__label', text: 'Ракета подробнее' });
		rocketBlock.append(rocketTitle);

		if (!rocket) {
			rocketBlock.append(this.createEl('div', {
				className: 'modal__muted',
				text: 'Нет данных о конфигурации в локальном каталоге.',
			}));
		}
		else {
			const sum = rocket.getSummary();
			if (sum) {
				rocketBlock.append(this.createEl('div', { className: 'modal__muted', text: sum }));
			}

			if (rocket.description) {
				rocketBlock.append(this.createEl('div', { className: 'modal__detail-text', text: rocket.description }));
			}
			else if (!sum) {
				rocketBlock.append(this.createEl('div', {
					className: 'modal__muted',
					text: 'Расширенное описание ракеты недоступно.',
				}));
			}
		}

		const details = this.createEl('div', { className: 'modal__section' });
		const detailsLabel = this.createEl('div', { className: 'meta__label', text: 'Описание миссии' });
		const detailsText = this.createEl('div', {
			className: 'modal__detail-text',
			text: launch.details || 'Описание пока не добавлено в Launch Library.',
		});
		details.append(detailsLabel, detailsText);

		const mapLink = launch.padMapUrl
			? this.createEl('div', { className: 'modal__section modal__section--compact' })
			: null;
		if (mapLink) {
			const ml = this.createEl('a', {
				className: 'link-btn',
				text: 'Открыть карту площадки',
				attrs: { href: launch.padMapUrl, target: '_blank', rel: 'noreferrer' },
			});
			mapLink.append(ml);
		}

		const links = this._links(launch);

		modal.append(header, meta, rocketBlock, details);
		if (mapLink) {
			modal.append(mapLink);
		}

		modal.append(links);
		this.container.append(modal);

		this.container.addEventListener('click', (e) => {
			if (e.target === this.container) {
				this.close();
			}
		}, { once: true });

		document.addEventListener('keydown', this._onKeyDown);
	}

	_metaItem(label, value) {
		const wrap = this.createEl('div', { className: 'meta__item' });
		const l = this.createEl('div', { className: 'meta__label', text: label });
		const v = this.createEl('div', { className: 'meta__value', text: value });
		wrap.append(l, v);
		return wrap;
	}

	_links(launch) {
		const wrap = this.createEl('div', { className: 'modal__section' });
		const label = this.createEl('div', { className: 'meta__label', text: 'Ссылки и материалы' });
		const links = this.createEl('div', { className: 'links' });

		for (const row of launch.linkRows) {
			if (!row?.href) {
				continue;
			}

			const a = this.createEl('a', {
				className: 'link-btn',
				text: row.label || 'Ссылка',
				attrs: { href: row.href, target: '_blank', rel: 'noreferrer' },
			});
			links.append(a);
		}

		if (!links.childNodes.length) {
			const empty = this.createEl('div', { className: 'modal__muted', text: 'Ссылки пока не добавлены к этому запуску.' });
			wrap.append(label, empty);
			return wrap;
		}

		wrap.append(label, links);
		return wrap;
	}

	close() {
		if (!this._isOpen) {
			return;
		}

		this._isOpen = false;
		this.clear();
		this.container.classList.add('hidden');
		this.container.setAttribute('aria-hidden', 'true');
		document.removeEventListener('keydown', this._onKeyDown);
	}

	_onKeyDown(e) {
		if (e.key === 'Escape') {
			this.close();
		}
	}
}

export { ModalRenderer };
