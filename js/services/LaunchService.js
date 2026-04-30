'use strict';

import { ApiService } from './ApiService.js';
import { Launch } from '../models/Launch.js';

class LaunchService extends ApiService {
	constructor({ rocketService }) {
		super({ baseUrl: 'https://ll.thespacedevs.com' });
		this.rocketService = rocketService;
		this._cacheKey = 'launch_library_launches_cache';
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

	_readCache() {
		try {
			const raw = localStorage.getItem(this._cacheKey);
			const parsed = raw ? JSON.parse(raw) : null;

			if (!parsed || !Array.isArray(parsed.items) || typeof parsed.savedAt !== 'number') {
				return null;
			}

			if (!parsed.items.length) {
				return null;
			}

			const ageMs = Date.now() - parsed.savedAt;
			if (ageMs < 30 * 60 * 1000) {
				this._writeCache(parsed.items);
				return parsed.items;
			}

			return null;
		}
		catch {
			return null;
		}
	}

	_writeCache(items) {
		try {
			localStorage.setItem(this._cacheKey, JSON.stringify({
				savedAt: Date.now(),
				items,
			}));
		}
		catch {
			return;
		}
	}

	_primaryLl2Links(raw) {
		const infoList = raw?.info_urls || raw?.infoURLs || [];
		const vidList = raw?.vid_urls || raw?.vidURLs || [];

		const firstInfo = Array.isArray(infoList) ? infoList.find((x) => x?.url) : null;
		const firstVid = Array.isArray(vidList) ? vidList.find((x) => x?.url) : null;

		const programInfoUrl = raw?.program?.[0]?.info_url || '';
		const lsp = raw?.launch_service_provider;
		const lspInfoUrl = typeof lsp === 'object' && lsp ? (lsp.info_url || '') : '';

		const wikipedia = raw?.program?.[0]?.wiki_url
			|| raw?.pad?.wiki_url
			|| raw?.rocket?.configuration?.manufacturer?.wiki_url
			|| (typeof lsp === 'object' && lsp ? (lsp.wiki_url || '') : '')
			|| '';

		return {
			wikipedia,
			webcast: firstVid?.url || '',
			article: firstInfo?.url || programInfoUrl || lspInfoUrl || '',
		};
	}

	_collectLinkRows(raw, primary) {
		const rows = [];
		const seen = new Set();

		const push = (label, href) => {
			if (!href || typeof href !== 'string') {
				return;
			}

			if (seen.has(href)) {
				return;
			}

			seen.add(href);
			rows.push({ label, href });
		};

		push('Wikipedia', primary.wikipedia);
		push('Трансляция / видео', primary.webcast);
		push('Страница миссии', primary.article);
		push('FlightClub', raw?.flightclub_url);
		push('Карта стартового комплекса', raw?.pad?.map_url);
		push('Карточка в Launch Library', raw?.url);

		const infoList = raw?.info_urls || raw?.infoURLs || [];
		const vidList = raw?.vid_urls || raw?.vidURLs || [];

		if (Array.isArray(vidList)) {
			for (const entry of vidList) {
				const label = entry?.title ? `${entry.title} · видео` : 'Видео';
				push(label, entry?.url);
			}
		}

		if (Array.isArray(infoList)) {
			for (const entry of infoList) {
				const label = entry?.title || entry?.source || 'Материал';
				push(label, entry?.url);
			}
		}

		return rows;
	}

	_mapLl2ToLaunchRaw(raw) {
		const statusName = String(raw?.status?.name || '');
		const statusAbbrev = String(raw?.status?.abbrev || '').toLowerCase();
		const dateUtc = raw?.net || '';
		const dateMs = Date.parse(dateUtc);
		const isFuture = Number.isFinite(dateMs) && dateMs > Date.now();

		let success = null;
		if (statusAbbrev === 'success' || /\bsuccessful\b/i.test(statusName)) {
			success = true;
		}
		else if (statusAbbrev === 'failure' || /\bfailure\b/i.test(statusName) || /\bfailed\b/i.test(statusName)) {
			success = false;
		}

		const upcoming = success === null ? isFuture : false;

		const rocketConfigId = raw?.rocket?.configuration?.id
			? String(raw.rocket.configuration.id)
			: (raw?.rocket?.id ? String(raw.rocket.id) : '');

		const flightNumber = raw?.flight_number ?? raw?.launch_library_id ?? raw?.agency_launch_attempt_count ?? null;

		const lsp = raw?.launch_service_provider;
		const launchProvider = typeof lsp === 'object' && lsp?.name
			? lsp.name
			: (typeof lsp === 'string' ? lsp : '');

		const netPrec = raw?.net_precision;
		const netPrecisionLabel = typeof netPrec === 'object' && netPrec?.name
			? netPrec.name
			: (typeof netPrec === 'string' ? netPrec : '');

		const statusApiName = typeof raw?.status === 'string'
			? raw.status
			: (raw?.status?.name || '');

		const primaryLinks = this._primaryLl2Links(raw);
		const linkRows = this._collectLinkRows(raw, primaryLinks);

		const orbit = raw?.mission?.orbit;

		return {
			id: raw?.id ?? '',
			name: raw?.name ?? 'Unknown',
			flight_number: flightNumber,
			date_utc: dateUtc,
			success,
			upcoming,
			details: raw?.mission?.description || '',
			mission_name: raw?.mission?.name || '',
			mission_orbit_name: orbit?.name || '',
			mission_orbit_abbrev: orbit?.abbrev || '',
			window_start: raw?.window_start || '',
			window_end: raw?.window_end || '',
			net_precision: netPrecisionLabel,
			probability: typeof raw?.probability === 'number' ? raw.probability : null,
			weather_concerns: raw?.weather_concerns || '',
			pad_name: raw?.pad?.name || '',
			pad_location_name: raw?.pad?.location?.name || '',
			pad_map_url: raw?.pad?.map_url || '',
			pad_timezone: raw?.pad?.location?.timezone_name || '',
			launch_provider: launchProvider,
			status_api_name: statusApiName,
			fail_reason: raw?.failreason || '',
			webcast_live: Boolean(raw?.webcast_live),
			hashtag: raw?.hashtag || '',
			slug: raw?.slug || '',
			rocket: rocketConfigId,
			links: primaryLinks,
			link_rows: linkRows,
		};
	}

	async _fetchAllLaunchPages() {
		if (this._isLocalMode()) {
			const local = await this._fetchLocalJson('./launches.json');
			const items = Array.isArray(local) ? local : (Array.isArray(local?.results) ? local.results : []);
			return items;
		}

		const cached = this._readCache();
		if (cached) {
			return cached;
		}

		const [ previous, upcoming ] = await Promise.all([
			this.fetchJson('/2.3.0/launches/previous/?mode=normal&ordering=-net&limit=45'),
			this.fetchJson('/2.3.0/launches/upcoming/?mode=normal&ordering=net&limit=40'),
		]);

		const items = [
			...(Array.isArray(previous?.results) ? previous.results : []),
			...(Array.isArray(upcoming?.results) ? upcoming.results : []),
		];

		const byId = new Map();
		for (const it of items) {
			if (it?.id) {
				byId.set(it.id, it);
			}
		}

		const merged = Array.from(byId.values());
		if (merged.length) {
			this._writeCache(merged);
		}
		return merged;
	}

	async loadWithRockets() {
		const data = await this._fetchAllLaunchPages();
		let rocketsById;

		if (this._isLocalMode()) {
			rocketsById = await this.rocketService.getRockets();
		}
		else {
			rocketsById = this.rocketService.populateFromLl2Launches(data);
		}

		const launches = [];

		for (const raw of data) {
			launches.push(new Launch(this._mapLl2ToLaunchRaw(raw), { rocketsById }));
		}

		launches.sort((a, b) => b.dateUtcMs - a.dateUtcMs);
		return { launches, rocketsById };
	}
}

export { LaunchService };
