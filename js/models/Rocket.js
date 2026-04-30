'use strict';

class Rocket {
	constructor(raw) {
		this.id = raw?.id ?? '';
		this.name = raw?.name ?? 'Unknown';
		this.description = raw?.description ?? '';
		this.firstFlight = raw?.first_flight ?? '';
		this.country = raw?.country ?? '';
		this.costPerLaunch = raw?.cost_per_launch ?? null;
	}

	getDisplayName() {
		return this.name || 'Unknown';
	}

	getSummary() {
		const parts = [];

		if (this.firstFlight) {
			parts.push(`Первый полёт: ${this.firstFlight}`);
		}

		if (this.country) {
			parts.push(`Страна: ${this.country}`);
		}

		if (typeof this.costPerLaunch === 'number') {
			parts.push(`Стоимость запуска: $${this.costPerLaunch.toLocaleString('en-US')}`);
		}

		return parts.join(' • ');
	}
}

export { Rocket };
