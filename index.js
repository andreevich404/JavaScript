const { runTask1 } = require('./task1');
const { runWithPromises } = require('./task2');
const { runComputeSequentialPromise } = require('./task3');
const { runPeriodicSum } = require('./task4');
const { runTask5 } = require('./task5');
const { runTask6 } = require('./task6');
const { runTask7 } = require('./task7');

async function main() {
	console.log('=== Задание 1: Promise разрешается только один раз ===');
	await runTask1();

	console.log('\n=== Задание 2: Промисификация функций ===');
	await runWithPromises();

	console.log('\n=== Задание 3: Последовательное вычисление F(x) через промисы ===');
	await runComputeSequentialPromise();

	console.log('\n=== Задание 4: Периодическое сложение (успешное выполнение) ===');
	await runPeriodicSum(3, 5);
	console.log('Периодическое суммирование завершено');

	console.log('\n=== Задание 4: Периодическое сложение (вызов ошибки) ===');
	await runPeriodicSum('abc', 5).catch(err => {
		console.log('Ошибка:', err.message);
	});

	console.log('\n=== Задание 5: Переписанные функции через async/await ===');
	await runTask5();

	console.log('\n=== Задание 6: Результат async-функции в обычной функции ===');
	await runTask6();

	console.log('\n=== Задание 7: Симуляция собеседования ===');
	await runTask7();
}

main().catch(console.error);
