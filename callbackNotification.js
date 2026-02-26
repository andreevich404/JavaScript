function readConfig(name, callback) {
	setTimeout(() => {
		console.log('(1) config from ' + name + ' loaded');
		callback();
	}, Math.floor(Math.random() * 1000));
}

function doQuery(statement, callback) {
	setTimeout(() => {
		console.log('(2) SQL query executed: ' + statement);
		callback();
	}, Math.floor(Math.random() * 1000));
}

function httpGet(url, callback) {
	setTimeout(() => {
		console.log('(3) Page retrieved: ' + url);
		callback();
	}, Math.floor(Math.random() * 1000));
}

function readFile(path, callback) {
	setTimeout(() => {
		console.log('(4) Readme file from ' + path + ' loaded');
		callback();
	}, Math.floor(Math.random() * 1000));
}

function done() {
	console.log('It is done!');
}

function runWithCallbacks(onDone) {
	console.log('start callbacks');
	readConfig('myConfig', () => {
		doQuery('select * from cities', () => {
			httpGet('http://google.com', () => {
				readFile('README.md', () => {
					done();
					if (typeof onDone === 'function') {
						onDone();
					}
				});
			});
		});
	});
	console.log('end callbacks');
}

function runWithNotifications(onDone) {
	function onConfigLoaded() {
		doQuery('select * from cities', onQueryDone);
	}

	function onQueryDone() {
		httpGet('http://google.com', onPageLoaded);
	}

	function onPageLoaded() {
		readFile('README.md', onFileLoaded);
	}

	function onFileLoaded() {
		done();
		if (typeof onDone === 'function') {
			onDone();
		}
	}

	console.log('start notifications');
	readConfig('myConfig', onConfigLoaded);
	console.log('end notifications');
}

function runCallbackNotification(doneCallback) {
	runWithCallbacks(() => {
		runWithNotifications(() => {
			if (typeof doneCallback === 'function') {
				doneCallback();
			}
		});
	});
}

module.exports = {
	runWithCallbacks,
	runWithNotifications,
	runCallbackNotification,
};
