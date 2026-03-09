function runTask1() {
	return new Promise(resolve => {
		console.log('--- Задание 1 ---');

		let promise = new Promise(function(resolve, reject) {
			resolve(1);
			setTimeout(() => resolve(2), 1000);
		});

		promise.then(value => {
			console.log('Результат:', value);
			console.log('Вывод: 1');
			console.log('Причина: промис переходит в состояние fulfilled только один раз.');
			console.log('После первого вызова resolve(1) промис уже завершён,');
			console.log('повторный вызов resolve(2) через 1 секунду игнорируется.');
			resolve();
		});
	});
}

module.exports = { runTask1 };
