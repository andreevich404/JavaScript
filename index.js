console.log('=========== Функции. ===========\n');
console.log('=========== Задание 1. ===========\n');

function subtractOutput(a, b) {
	console.log(`Разность чисел ${a} и ${b}: ${a - b}`);
}
function subtract(a, b) {
	return a - b;
}
subtractOutput(10, 4);

let result = subtract(15, 6);
console.log(`Разность чисел 15 и 6: ${result}`);

console.log('\n=========== Задание 2. ===========\n');

function greetByAge(age) {
	if (age < 18) {
		console.log('Привет, малыш!');
	}
	else {
		console.log('Здравствуйте, юноша!');
	}
}
greetByAge(12);
greetByAge(18);

console.log('\n=========== Задание 3. ===========\n');

function maxOfThree(a, b, c) {
	return Math.max(a, b, c);
}
console.log(maxOfThree(7, 12, 5));

console.log('\n=========== Задание 4. ===========\n');

let variable = 'Глобальная переменная';
function f() {
	let variable = 'Локальная переменная';
	console.log(variable);
}
f();
console.log(variable);
console.log('Внутри f() объявлена своя переменная variable, она видна только в функции и не меняет глобальную.');

console.log('\n=========== Задание 5. ===========\n');

function digits(x, y, z) {
	return (Math.max(x, y) + Math.max(x + y, z)) / (Math.pow((Math.max(0.5, x + z)), 2));
}
console.log(`u = ${digits(1, 2, 3)}`);

console.log('\n=========== Задание 6. ===========\n');

function polygonPerimeter(...coords) {
	if (coords.length % 2 !== 0) {
		throw new Error('Должно быть передано четное количество координат (x1, y1, ..., xn, yn).');
	}

	const n = coords.length / 2;
	if (n < 3) {
		throw new Error('Для многоугольника нужно минимум 3 вершины.');
	}

	let perimeter = 0;

	for (let i = 0; i < n; i++) {
		const x1 = coords[i * 2];
		const y1 = coords[i * 2 + 1];
		const next = (i + 1) % n;
		const x2 = coords[next * 2];
		const y2 = coords[next * 2 + 1];

		perimeter += Math.hypot(x2 - x1, y2 - y1);
	}

	return perimeter;
}
console.log('Периметр квадрата (ожидание 4):', polygonPerimeter(0, 0, 1, 0, 1, 1, 0, 1));
console.log('Периметр треугольника 3-4-5 (ожидание 12):', polygonPerimeter(0, 0, 3, 0, 0, 4));

console.log('\n=========== Задание 7. ===========\n');

function sequenceState(n) {
	if (!Number.isInteger(n) || n < 1) {
		throw new Error('n должно быть целым числом >= 1.');
	}

	if (n === 1) {
		return { term: 1, sum: 1 };
	}

	const prev = sequenceState(n - 1);
	const term = Math.sin(prev.sum);
	return { term, sum: prev.sum + term };
}

function sequenceNth(n) {
	return sequenceState(n).term;
}

console.log('a1 (ожидание 1):', sequenceNth(1));
console.log('a2 (ожидание sin(1)):', sequenceNth(2));
console.log('a3 (ожидание sin(1 + sin(1))):', sequenceNth(3));

console.log('Тест a2:', sequenceNth(2) === Math.sin(1));
console.log('Тест a3:', sequenceNth(3) === Math.sin(1 + Math.sin(1)));

console.log('\n=========== Массивы. ===========\n');
console.log('\n=========== Задание 1. ===========\n');

let arr1 = [];
arr1[0] = 10;
arr1[1] = 20;
arr1[2] = 30;
console.log(arr1[2]);
console.log(arr1.length);
arr1.splice(1, 1);
for (let i = 0; i < arr1.length; i++) {
	console.log(arr1[i]);
}

console.log('\n=========== Задание 2. ===========\n');
let countries = ['Россия', 'Казахстан', 'Беларусь'];
let population = [146000000, 19000000, 9300000];

function printCountriesFor(country, pop) {
	for (let i = 0; i < country.length; i++) {
		console.log(`${country[i]}: ${pop[i]}`);
	}
}

function printCountriesForIn(country, pop) {
	for (let i in country) {
		console.log(`${country[i]}: ${pop[i]}`);
	}
}

printCountriesFor(countries, population);
printCountriesForIn(countries, population);

console.log('\n=========== Задание 3. ===========\n');
let arr3 = ['January', 'February', 'March', 'April', 'May', 'June'];
let len = arr3.pop();
console.log(arr3.join(' '));
console.log(len);

console.log('\n=========== Задание 4. ===========\n');
let a4 = [1, 2, 3, 4, 5, 6, 7];
let t = a4.slice(0, 3);
console.log(t);

console.log('\n=========== Задание 5. ===========\n');
let a5 = [1, 2, 3, 4, 5, 6, 7];
let d = a5.splice(1, 3);
console.log(a5);
console.log(d);

console.log('\n=========== Задание 6. ===========\n');
let a6 = [1, 2, 3, 4, 5];
console.log(a6.reverse());

console.log('\n=========== Задание 7. ===========\n');
let a7 = ['c', 5, 2, 'b', 3, 1, 4, 'a'];
a7.sort((x, y) => {
	let xNum = typeof x === 'number';
	let yNum = typeof y === 'number';

	if (xNum && yNum) return x - y;
	if (xNum && !yNum) return -1;
	if (!xNum && yNum) return 1;
	return String(x).localeCompare(String(y));
});
console.log(a7);

console.log('\n=========== Задание 8. ===========\n');
let a8 = [1, 2, 3, 4, 5];
console.log(a8.join('+'));

console.log('\n=========== Задание 9. ===========\n');
let a = [1, 2, 5, 4, 6];
let b = [8, 2, 5, 9, 5];
let merged = a.concat(b).sort((x, y) => x - y);
let mid = Math.floor(merged.length / 2);
let median = merged.length % 2 === 0 ? (merged[mid - 1] + merged[mid]) / 2 : merged[mid];
console.log(merged);
console.log(median);

console.log('\n=========== Задание 10. ===========\n');
let array = Array.from({ length: 10 }, () => Math.floor(Math.random() * 21) - 10);
let min10 = Math.min(...array);
let max10 = Math.max(...array);
let minIndex10 = array.indexOf(min10);
let maxIndex10 = array.indexOf(max10);
[array[minIndex10], array[maxIndex10]] = [array[maxIndex10], array[minIndex10]];
console.log(array);

console.log('\n=========== Задание 11. ===========\n');
let a11 = [9, 7, 7, 3, 1];
let isDesc = true;
let badIndex = -1;

for (let i = 1; i < a11.length; i++) {
	if (a11[i] > a11[i - 1]) {
		isDesc = false;
		badIndex = i;
		break;
	}
}

if (isDesc) {
	console.log([...a11].reverse());
}
else {
	console.log(badIndex);
}

console.log('\n=========== Задание 12. ===========\n');
let a12 = [4, -2, 5, 6, -10, 3, -8, 7];
for (let i = 0; i < a12.length; i++) {
	if (a12[i] > 0 && i % 2 !== 0) {
		a12[i] *= 3;
	}
	else if (a12[i] < 0 && i % 2 === 0) {
		a12[i] /= 5;
	}
}
console.log(a12);

console.log('\n=========== Задание 13. ===========\n');
let m13 = [
	[2, -6, 8, 1, 10],
	[7, -5, 0, 12, 3],
	[9, 4, -2, 6, -8],
	[5, 11, -4, 7, 2],
	[-1, 13, -7, 14, 15],
];

for (let i = 0; i < m13.length; i++) {
	for (let j = 0; j < m13[i].length; j++) {
		if (m13[i][j] >= -5 && m13[i][j] <= 7) {
			console.log(m13[i][j]);
		}
	}
}

console.log('\n=========== Задание 14. ===========\n');
let m14 = [
	[3, 1, 9, 4],
	[8, 2, 5, 7],
	[6, 0, 11, 10],
];

let sumRowMax = 0;
for (let i = 0; i < m14.length; i++) {
	sumRowMax += Math.max(...m14[i]);
}

let colCount = m[0].length;
let productColMin = 1;
for (let j = 0; j < colCount; j++) {
	let colMin = m[0][j];
	for (let i = 1; i < m.length; i++) {
		if (m[i][j] < colMin) colMin = m[i][j];
	}
	productColMin *= colMin;
}

console.log(sumRowMax);
console.log(productColMin);

console.log('\n=========== Задание 15. ===========\n');
let booksByAuthor = {
	'Пушкин': ['Евгений Онегин', 'Капитанская дочка'],
	'Есенин': ['Анна Снегина', 'Черный человек'],
	'Данцова': ['Маникюр для покойника', 'Крутые наследнички'],
};

for (let author in booksByAuthor) {
	console.log(author);
	console.log(booksByAuthor[author].join(', '));
}

