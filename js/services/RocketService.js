'use strict';

import { ApiService } from './ApiService.js';
import { Rocket } from '../models/Rocket.js';

class RocketService extends ApiService {
	constructor() {
		super({ baseUrl: 'https://ll.thespacedevs.com' });
		this._cache = null;
	}

	_isLocalMode() {
		try {
			const q = new URLSearchParams(window.location.search);
			return q.get('source') === 'local';
		}
		catch {
			return false;
		}
	}

	async _fetchLocalJson(path) {
		const res = await fetch(path, { headers: { accept: 'application/json' } });
		if (!res.ok) {
			throw new Error(`HTTP ${res.status} ${res.statusText} @ ${path}`);
		}
		return res.json();
	}

	_mapLl2ConfigToRocketRaw(raw) {
		const id = raw?.id ?? '';
		const manufacturer = raw?.manufacturer ?? null;
		const country = manufacturer?.country?.[0]?.alpha_3_code
			|| manufacturer?.country?.[0]?.alpha_2_code
			|| manufacturer?.country_code
			|| '';

		return {
			id: String(id),
			name: raw?.full_name || raw?.name || 'Unknown',
			description: raw?.description || '',
			first_flight: raw?.maiden_flight || '',
			country,
			cost_per_launch: raw?.launch_cost ?? null,
		};
	}

	populateFromLl2Launches(rawLaunches) {
		const rocketsById = {};

		for (const raw of rawLaunches) {
			const cfg = raw?.rocket?.configuration;
			if (!cfg?.id) {
				continue;
			}

			const id = String(cfg.id);
			if (rocketsById[id]) {
				continue;
			}

			rocketsById[id] = new Rocket(this._mapLl2ConfigToRocketRaw(cfg));
		}

		this._cache = rocketsById;
		return rocketsById;
	}

	async getRockets() {
		if (this._cache) {
			return this._cache;
		}

		if (!this._isLocalMode()) {
			return {};
		}

		const local = await this._fetchLocalJson('./rockets-local.json');
		const items = Array.isArray(local) ? local : (Array.isArray(local?.results) ? local.results : []);
		const rocketsById = {};

		for (const raw of items) {
			const rocket = new Rocket(this._mapLl2ConfigToRocketRaw(raw));
			rocketsById[rocket.id] = rocket;
		}

		this._cache = rocketsById;
		return rocketsById;
	}
}

export { RocketService };
