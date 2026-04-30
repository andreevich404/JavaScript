'use strict';

function safeDateMs(dateUtc) {
	const ms = Date.parse(dateUtc);
	if (Number.isNaN(ms)) {
		return 0;
	}

	return ms;
}

function formatUtcShort(iso) {
	if (!iso) {
		return '';
	}

	const ms = Date.parse(iso);
	if (!Number.isFinite(ms)) {
		return String(iso);
	}

	const s = new Date(ms).toLocaleString('ru-RU', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		timeZone: 'UTC',
	});

	return `${s} UTC`;
}

class Launch {
	constructor(raw, { rocketsById }) {
		this.id = raw?.id ?? '';
		this.name = raw?.name ?? 'Unknown';
		this.flightNumber = raw?.flight_number ?? null;
		this.dateUtc = raw?.date_utc ?? '';
		this.dateUtcMs = safeDateMs(this.dateUtc);
		this.success = raw?.success ?? null;
		this.upcoming = Boolean(raw?.upcoming);
		this.details = raw?.details ?? '';
		this.missionName = raw?.mission_name ?? '';
		this.missionOrbitName = raw?.mission_orbit_name ?? '';
		this.missionOrbitAbbrev = raw?.mission_orbit_abbrev ?? '';
		this.windowStartUtc = raw?.window_start ?? '';
		this.windowEndUtc = raw?.window_end ?? '';
		this.netPrecision = raw?.net_precision ?? '';
		this.probability = typeof raw?.probability === 'number' ? raw.probability : null;
		this.weatherConcerns = raw?.weather_concerns ?? '';
		this.padName = raw?.pad_name ?? '';
		this.padLocationName = raw?.pad_location_name ?? '';
		this.padMapUrl = raw?.pad_map_url ?? '';
		this.padTimezone = raw?.pad_timezone ?? '';
		this.launchProvider = raw?.launch_provider ?? '';
		this.statusApiName = raw?.status_api_name ?? '';
		this.failReason = raw?.fail_reason ?? '';
		this.webcastLive = Boolean(raw?.webcast_live);
		this.hashtag = raw?.hashtag ?? '';
		this.slug = raw?.slug ?? '';
		this.rocketId = raw?.rocket ?? '';
		this.links = {
			wikipedia: raw?.links?.wikipedia ?? '',
			webcast: raw?.links?.webcast ?? '',
			article: raw?.links?.article ?? '',
		};
		this.linkRows = Array.isArray(raw?.link_rows) ? raw.link_rows : [];

		this._rocketsById = rocketsById || {};
	}

	getYear() {
		if (!this.dateUtcMs) {
			return null;
		}

		return new Date(this.dateUtcMs).getUTCFullYear();
	}

	getDateLabel() {
		if (!this.dateUtcMs) {
			return '—';
		}

		return new Date(this.dateUtcMs).toLocaleDateString('ru-RU', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		});
	}

	getRocket() {
		return this._rocketsById[this.rocketId] || null;
	}

	getRocketName() {
		const rocket = this.getRocket();
		return rocket ? rocket.getDisplayName() : '—';
	}

	getFlightDisplay() {
		if (this.flightNumber === null || this.flightNumber === undefined || this.flightNumber === '') {
			return '—';
		}

		return String(this.flightNumber);
	}

	getOrbitLabel() {
		const n = this.missionOrbitName;
		const a = this.missionOrbitAbbrev;

		if (n && a) {
			return `${n} (${a})`;
		}

		return n || a || '—';
	}

	getPadLabel() {
		const parts = [];

		if (this.padName && this.padName !== 'Unknown Pad') {
			parts.push(this.padName);
		}

		if (this.padLocationName) {
			parts.push(this.padLocationName);
		}

		if (this.padTimezone) {
			parts.push(this.padTimezone.replace(/_/g, ' '));
		}

		return parts.length ? parts.join(' · ') : '—';
	}

	getWindowLabel() {
		const a = formatUtcShort(this.windowStartUtc);
		const b = formatUtcShort(this.windowEndUtc);

		if (a && b && a !== b) {
			return `${a} — ${b}`;
		}

		return a || b || '—';
	}

	getNetPrecisionLabel() {
		return this.netPrecision || '—';
	}

	getProbabilityLabel() {
		if (this.probability === null) {
			return '—';
		}

		return `${this.probability}%`;
	}

	getWeatherConcernsLabel() {
		return this.weatherConcerns || '—';
	}

	getLaunchProviderLabel() {
		return this.launchProvider || '—';
	}

	getStatusCatalogLabel() {
		return this.statusApiName || '—';
	}

	getFailReasonLabel() {
		return this.failReason || '';
	}

	isSuccessful() {
		return this.success === true;
	}

	isFailed() {
		return this.success === false;
	}

	getStatusKey() {
		if (this.upcoming) {
			return 'upcoming';
		}

		if (this.isSuccessful()) {
			return 'success';
		}

		if (this.isFailed()) {
			return 'failure';
		}

		return 'unknown';
	}

	getStatusLabel() {
		const key = this.getStatusKey();

		if (key === 'success') {
			return 'Успешно';
		}

		if (key === 'failure') {
			return 'Неудача';
		}

		if (key === 'upcoming') {
			return 'Предстоит';
		}

		return '—';
	}
}

export { Launch };
