function add(a, b) {
	return new Promise((resolve, reject) => {
		if (
			a === undefined || b === undefined ||
			typeof a !== 'number' || typeof b !== 'number'
		) {
			reject(new Error(
				'Аргументы должны быть числами типа number. ' +
				`Получено: a=${a} (${typeof a}), b=${b} (${typeof b})`,
			));
			return;
		}
		resolve(a + b);
	});
}

function runPeriodicSum(initialA, b) {
	let count = 0;
	let currentA = initialA;

	function step() {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				add(currentA, b)
					.then(sum => {
						count++;
						console.log(`Итерация ${count}: ${currentA} + ${b} = ${sum}`);
						currentA = sum;
						if (count < 5) {
							resolve(step());
						}
						else {
							resolve(sum);
						}
					})
					.catch(reject);
			}, 2000);
		});
	}

	return step();
}

module.exports = { add, runPeriodicSum };
