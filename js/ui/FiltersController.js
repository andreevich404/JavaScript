'use strict';

class FiltersController {
	constructor({ state, searchInput, yearSelect, statusSelect, resetButton }) {
		this.state = state;
		this.searchInput = searchInput;
		this.yearSelect = yearSelect;
		this.statusSelect = statusSelect;
		this.resetButton = resetButton;

		this._yearsKey = '';
	}

	init() {
		this._renderYears();

		this.searchInput.addEventListener('input', () => {
			this.state.setFilter({ search: this.searchInput.value });
		});

		this.searchInput.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') {
				this.searchInput.value = '';
				this.state.setFilter({ search: '' });
			}
		});

		this.yearSelect.addEventListener('change', () => {
			this.state.setFilter({ year: this.yearSelect.value });
		});

		this.statusSelect.addEventListener('change', () => {
			this.state.setFilter({ status: this.statusSelect.value });
		});

		this.resetButton.addEventListener('click', () => {
			this.searchInput.value = '';
			this.yearSelect.value = 'all';
			this.statusSelect.value = 'all';
			this.state.setFilter({
				search: '',
				year: 'all',
				status: 'all',
			});
		});

		this.state.onChange(() => {
			this._renderYears();
		});
	}

	_renderYears() {
		const years = this.state.getYears();
		const yearsKey = years.join('|');

		if (yearsKey === this._yearsKey && this.yearSelect.childNodes.length) {
			return;
		}

		this.yearSelect.replaceChildren();

		const optAll = document.createElement('option');
		optAll.value = 'all';
		optAll.textContent = 'Все';
		this.yearSelect.append(optAll);

		for (const y of years) {
			const opt = document.createElement('option');
			opt.value = String(y);
			opt.textContent = String(y);
			this.yearSelect.append(opt);
		}

		this.yearSelect.value = this.state.filters.year;
		this._yearsKey = yearsKey;
	}
}

export { FiltersController };
