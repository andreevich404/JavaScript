async function wait() {
	await new Promise(resolve => setTimeout(resolve, 1000));
	return 10;
}

// Решение использовать then т.к вызов async-функции возвращает Promise,
function f() {
	wait().then(result => {
		console.log('Результат из f():', result);
	});
}

async function runTask6() {
	console.log('Вызываем f() — внутри используется .then() вместо await:');
	f();
	await new Promise(resolve => setTimeout(resolve, 1100));
}

module.exports = { wait, f, runTask6 };
