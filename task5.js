const { readConfig, doQuery, httpGet, readFile, done } = require('./task2');
const { f1, f2, f3, f4, f5, f6 } = require('./task3');
const { add } = require('./task4');

// --- Задание 2 через async/await ---
async function runWithAsync() {
	console.log('start async/await');
	await readConfig('myConfig');
	await doQuery('select * from cities');
	await httpGet('http://google.com');
	await readFile('README.md');
	done();
	console.log('end async/await');
}

// --- Задание 3 через async/await ---
async function computeFSequentialAsync(x, funcs) {
	let sum = 0;
	for (let i = 0; i < funcs.length; i++) {
		const value = await funcs[i](x);
		sum += value;
		console.log(`Промежуточный результат после f${i + 1}: ${sum}`);
	}
	return sum;
}

async function runComputeSequentialAsync() {
	const x = 3;

	console.log('=== n = 2 ===');
	const result1 = await computeFSequentialAsync(x, [f1, f2]);
	console.log(`F(${x}) = ${result1}`);
	console.log('');

	console.log('=== n = 4 ===');
	const result2 = await computeFSequentialAsync(x, [f1, f2, f3, f4]);
	console.log(`F(${x}) = ${result2}`);
	console.log('');

	console.log('=== n = 6 ===');
	const result3 = await computeFSequentialAsync(x, [f1, f2, f3, f4, f5, f6]);
	console.log(`F(${x}) = ${result3}`);
}

// --- Задание 4 через async/await ---
async function runPeriodicSumAsync(initialA, b) {
	let count = 0;
	let currentA = initialA;

	while (count < 5) {
		await new Promise(resolve => setTimeout(resolve, 2000));
		const sum = await add(currentA, b);
		count++;
		console.log(`Итерация ${count}: ${currentA} + ${b} = ${sum}`);
		currentA = sum;
	}

	return currentA;
}

async function runTask5() {
	console.log('--- async/await версия задания 2 ---');
	await runWithAsync();

	console.log('\n--- async/await версия задания 3 ---');
	await runComputeSequentialAsync();

	console.log('\n--- async/await версия задания 4 (успешное выполнение) ---');
	await runPeriodicSumAsync(3, 5);
	console.log('Периодическое суммирование завершено');

	console.log('\n--- async/await версия задания 4 (вызов ошибки) ---');
	try {
		await runPeriodicSumAsync('abc', 5);
	}
	catch (err) {
		console.log('Ошибка (async/await):', err.message);
	}
}

module.exports = {
	runWithAsync,
	computeFSequentialAsync,
	runPeriodicSumAsync,
	runTask5,
};
