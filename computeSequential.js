function asyncTerm(name, calc) {
	return function(x, callback) {
		setTimeout(() => {
			const value = calc(x);
			console.log(`${name}(x) = ${value}`);
			callback(value);
		}, Math.floor(Math.random() * 400));
	};
}

const f1 = asyncTerm('f1', (x) => x * x);
const f2 = asyncTerm('f2', (x) => 2 * x);
const f3 = asyncTerm('f3', () => -2);
const f4 = asyncTerm('f4', (x) => x);
const f5 = asyncTerm('f5', () => 5);
const f6 = asyncTerm('f6', (x) => -x);

function computeFSequential(x, funcs, onDone) {
	let i = 0;
	let sum = 0;

	function notifyNext() {
		if (i === funcs.length) {
			onDone(sum);
			return;
		}

		funcs[i](x, (termValue) => {
			sum += termValue;
			console.log(`Промежуточный результат после f${i + 1}: ${sum}`);
			i++;
			notifyNext();
		});
	}

	notifyNext();
}

function runComputeSequential(done) {
	const x = 3;

	console.log('=== n = 2 ===');
	computeFSequential(x, [f1, f2], (result) => {
		console.log(`F(${x}) = ${result}`);
		console.log('');

		console.log('=== n = 4 ===');
		computeFSequential(x, [f1, f2, f3, f4], (result2) => {
			console.log(`F(${x}) = ${result2}`);
			console.log('');

			console.log('=== n = 6 ===');
			computeFSequential(x, [f1, f2, f3, f4, f5, f6], (result3) => {
				console.log(`F(${x}) = ${result3}`);
				if (typeof done === 'function') {
					done();
				}
			});
		});
	});
}

module.exports = {
	asyncTerm,
	computeFSequential,
	runComputeSequential,
};
