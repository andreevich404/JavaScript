'use strict';

const FAVORITES_KEY = 'spacex_favorites';

function readFavorites() {
	try {
		const raw = localStorage.getItem(FAVORITES_KEY);
		if (!raw) {
			return new Set();
		}

		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) {
			return new Set();
		}

		return new Set(parsed.filter((x) => typeof x === 'string'));
	}
	catch {
		return new Set();
	}
}

function writeFavorites(favorites) {
	try {
		localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favorites)));
	}
	catch {
		return;
	}
}

class AppState {
	constructor({ userName }) {
		this.userName = userName || '';
		this.launches = [];
		this.rocketsById = {};
		this.favorites = readFavorites();

		this.filters = {
			search: '',
			year: 'all',
			status: 'all',
			tab: 'all',
		};

		this.sort = {
			column: 'date',
			direction: 'desc',
		};

		this.loading = false;
		this.error = '';
		this._events = new EventTarget();
	}

	onChange(handler) {
		this._events.addEventListener('state:change', handler);
	}

	_emit() {
		this._events.dispatchEvent(new CustomEvent('state:change'));
	}

	setLoading(isLoading) {
		this.loading = Boolean(isLoading);
		this._emit();
	}

	setError(message) {
		this.error = message || '';
		this._emit();
	}

	getError() {
		return this.error;
	}

	setData({ launches, rocketsById }) {
		this.launches = Array.isArray(launches) ? launches : [];
		this.rocketsById = rocketsById || {};
		this.loading = false;
		this.error = '';
		this._emit();
	}

	setFilter(partial) {
		this.filters = {
			...this.filters,
			...partial,
		};
		this._emit();
	}

	setSort({ column }) {
		const nextDirection = this.sort.column === column && this.sort.direction === 'asc'
			? 'desc'
			: 'asc';

		this.sort = {
			column,
			direction: nextDirection,
		};
		this._emit();
	}

	toggleFavorite(launchId) {
		if (this.favorites.has(launchId)) {
			this.favorites.delete(launchId);
		}
		else {
			this.favorites.add(launchId);
		}

		writeFavorites(this.favorites);
		this._emit();
	}

	isFavorite(launchId) {
		return this.favorites.has(launchId);
	}

	getYears() {
		const years = new Set();
		for (const l of this.launches) {
			const y = l.getYear();
			if (typeof y === 'number') {
				years.add(y);
			}
		}

		return Array.from(years).sort((a, b) => b - a);
	}

	getVisibleLaunches() {
		const filtered = this._applyFilters(this.launches);
		const sorted = this._applySort(filtered);

		if (this.filters.tab === 'favorites') {
			return sorted.filter((l) => this.favorites.has(l.id));
		}

		return sorted;
	}

	_applyFilters(launches) {
		const search = this.filters.search.trim().toLowerCase();
		const year = this.filters.year;
		const status = this.filters.status;

		return launches.filter((l) => {
			if (search && !l.name.toLowerCase().includes(search)) {
				return false;
			}

			if (year !== 'all' && String(l.getYear()) !== String(year)) {
				return false;
			}

			if (status !== 'all' && l.getStatusKey() !== status) {
				return false;
			}

			return true;
		});
	}

	_applySort(launches) {
		const dir = this.sort.direction === 'asc' ? 1 : -1;
		const col = this.sort.column;
		const items = launches.slice();

		items.sort((a, b) => {
			if (col === 'name') {
				return a.name.localeCompare(b.name, 'ru') * dir;
			}

			if (col === 'rocket') {
				return a.getRocketName().localeCompare(b.getRocketName(), 'ru') * dir;
			}

			if (col === 'status') {
				return a.getStatusKey().localeCompare(b.getStatusKey(), 'ru') * dir;
			}

			if (col === 'number') {
				return ((a.flightNumber || 0) - (b.flightNumber || 0)) * dir;
			}

			return (a.dateUtcMs - b.dateUtcMs) * dir;
		});

		return items;
	}

	getStats() {
		const launches = this.getVisibleLaunches();
		let success = 0;
		let failure = 0;
		let upcoming = 0;
		const rocketCounts = {};

		for (const l of launches) {
			if (l.upcoming) {
				upcoming += 1;
			}
			else if (l.success === true) {
				success += 1;
			}
			else if (l.success === false) {
				failure += 1;
			}

			if (l.rocketId) {
				rocketCounts[l.rocketId] = (rocketCounts[l.rocketId] || 0) + 1;
			}
		}

		const finished = success + failure;
		const successPct = finished > 0 ? Math.round((success / finished) * 1000) / 10 : 0;

		let topRocketId = '';
		let topCount = 0;
		for (const [ rocketId, count ] of Object.entries(rocketCounts)) {
			if (count > topCount) {
				topCount = count;
				topRocketId = rocketId;
			}
		}

		const topRocket = topRocketId ? this.rocketsById[topRocketId] : null;

		return {
			total: launches.length,
			success,
			failure,
			upcoming,
			successPct,
			topRocketName: topRocket ? topRocket.getDisplayName() : '—',
		};
	}
}

export { AppState };
