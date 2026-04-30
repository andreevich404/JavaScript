'use strict';

import { initWelcome, STORAGE_KEY, showMain } from './welcome.js';
import { bootstrapApp } from './bootstrap.js';

const savedName = sessionStorage.getItem(STORAGE_KEY);

function startMain(name) {
	bootstrapApp({ userName: name });
}

if (savedName) {
	showMain(savedName);
	startMain(savedName);
}
else {
	initWelcome((name) => {
		startMain(name);
	});
}
