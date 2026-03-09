function asyncTermPromise(name, calc) {
	return function(x) {
		return new Promise(resolve => {
			setTimeout(() => {
				const value = calc(x);
				console.log(`${name}(x) = ${value}`);
				resolve(value);
			}, Math.floor(Math.random() * 400));
		});
	};
}

const f1 = asyncTermPromise('f1', (x) => x * x);
const f2 = asyncTermPromise('f2', (x) => 2 * x);
const f3 = asyncTermPromise('f3', () => -2);
const f4 = asyncTermPromise('f4', (x) => x);
const f5 = asyncTermPromise('f5', () => 5);
const f6 = asyncTermPromise('f6', (x) => -x);

function computeFSequentialPromise(x, funcs) {
	let sum = 0;
	return funcs.reduce((chain, fn, i) => {
		return chain
			.then(() => fn(x))
			.then(value => {
				sum += value;
				console.log(`Промежуточный результат после f${i + 1}: ${sum}`);
			});
	}, Promise.resolve()).then(() => sum);
}

function runComputeSequentialPromise() {
	const x = 3;

	console.log('=== n = 2 ===');
	return computeFSequentialPromise(x, [f1, f2])
		.then(result => {
			console.log(`F(${x}) = ${result}`);
			console.log('');
			console.log('=== n = 4 ===');
			return computeFSequentialPromise(x, [f1, f2, f3, f4]);
		})
		.then(result => {
			console.log(`F(${x}) = ${result}`);
			console.log('');
			console.log('=== n = 6 ===');
			return computeFSequentialPromise(x, [f1, f2, f3, f4, f5, f6]);
		})
		.then(result => {
			console.log(`F(${x}) = ${result}`);
		});
}

module.exports = {
	asyncTermPromise,
	f1, f2, f3, f4, f5, f6,
	computeFSequentialPromise,
	runComputeSequentialPromise,
};
