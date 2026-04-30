'use strict';

import { AppState } from './state/AppState.js';
import { LaunchService } from './services/LaunchService.js';
import { RocketService } from './services/RocketService.js';
import { TableRenderer } from './renderers/TableRenderer.js';
import { ModalRenderer } from './renderers/ModalRenderer.js';
import { StatsRenderer } from './renderers/StatsRenderer.js';
import { FiltersController } from './ui/FiltersController.js';
import { TabsController } from './ui/TabsController.js';
import { ErrorRenderer } from './renderers/ErrorRenderer.js';

async function bootstrapApp({ userName }) {
	const state = new AppState({
		userName,
	});

	const rocketService = new RocketService();
	const launchService = new LaunchService({ rocketService });

	const modal = new ModalRenderer({
		container: document.getElementById('modal-root'),
		state,
	});

	const table = new TableRenderer({
		container: document.getElementById('table'),
		state,
		modal,
	});

	const stats = new StatsRenderer({
		container: document.getElementById('stats'),
		state,
	});

	const error = new ErrorRenderer({
		container: document.getElementById('error'),
	});

	const filters = new FiltersController({
		state,
		searchInput: document.getElementById('search-input'),
		yearSelect: document.getElementById('year-select'),
		statusSelect: document.getElementById('status-select'),
		resetButton: document.getElementById('btn-reset'),
	});

	const tabs = new TabsController({
		state,
		container: document.querySelector('.tabs'),
	});

	state.onChange(() => {
		error.clear();
		table.render();
		stats.render();
	});

	filters.init();
	tabs.init();
	table.render();
	stats.render();

	try {
		state.setLoading(true);
		const { launches, rocketsById } = await launchService.loadWithRockets();
		state.setData({ launches, rocketsById });
	}
	catch (err) {
		state.setLoading(false);
		const details = err instanceof Error ? err.message : String(err);
		state.setError(`Не удалось загрузить расписание запусков (Launch Library). Попробуйте обновить страницу. (${details})`);
		error.show(state.getError());
	}
}

export { bootstrapApp };
