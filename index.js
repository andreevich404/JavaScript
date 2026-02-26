const { runAskPassword } = require('./ask_password');
const { runCallbackNotification } = require('./callbackNotification');
const { runComputeSequential } = require('./computeSequential');

console.log('=== Этап 1: ask_password ===');
runAskPassword(() => {
	console.log('');
	console.log('=== Этап 2: callback/notification ===');
	runCallbackNotification(() => {
		console.log('');
		console.log('=== Этап 3: computeSequential ===');
		runComputeSequential(() => {
			console.log('');
			console.log('=== Все этапы завершены ===');
		});
	});
});
