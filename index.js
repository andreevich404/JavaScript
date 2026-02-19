console.log('=== Задание 1 ===');
let user = {};
user.name = 'John';
user.surname = 'Smith';
user.name = 'Pete';
delete user.name;
console.log(user);

console.log('=== Задание 2 ===');
let myBrowser = {
	name: 'Microsoft Internet Explorer',
	version: '9.0',
};
for (let key in myBrowser) {
	console.log(`${key}: ${myBrowser[key]}`);
}

console.log('=== Задание 3 ===');
function isEmpty(obj) {
	for (let key in obj) {
		return false;
	}
	return true;
}
console.log(isEmpty({}));
console.log(isEmpty({ a: 1 }));

console.log('=== Задание 4 ===');
/*
'const' не позволяет переназначить переменную, но не запрещает изменять свойства объекта, на который она ссылается.
Поэтому это не вызовет ошибку, а просто изменит имя внутри объекта.
*/
const constUser = {
	name: 'John',
};
constUser.name = 'Pete';
console.log(constUser);
try {
	constUser = 123;
}
catch (error) {
	console.log(error.message);
}

console.log('=== Задание 5 ===');
function multiplyNumeric(obj) {
	for (let key in obj) {
		if (typeof obj[key] === 'number') {
			obj[key] *= 2;
		}
	}
}
let menu = {
	width: 200,
	height: 300,
	title: 'My menu',
};
multiplyNumeric(menu);
console.log(menu);

console.log('=== Задание 6 ===');
let calculator = {
	a: 0,
	b: 0,
	read(a, b) {
		this.a = a;
		this.b = b;
	},
	sum() {
		return this.a + this.b;
	},
	mul() {
		return this.a * this.b;
	},
};
calculator.read(3, 7);
console.log(calculator.sum());
console.log(calculator.mul());

console.log('=== Задание 7 ===');
let ladder = {
	step: 0,
	up() {
		this.step++;
		return this;
	},
	down() {
		this.step--;
		return this;
	},
	showStep() {
		console.log(this.step);
		return this;
	},
};
ladder.up().up().down().showStep().down().showStep();

console.log('=== Задание 8 ===');
function Browser(name, version) {
	this.name = name;
	this.version = version;
	this.aboutBrowser = function() {
		console.log(`Browser: ${this.name}, version: ${this.version}`);
	};
}
let myBrowser2 = new Browser('Microsoft Internet Explorer', '9.0');
console.log(myBrowser2.name);
console.log(myBrowser2.version);
myBrowser2.aboutBrowser();

console.log('=== Задание 9 ===');
function Employee(name, department, phone, salary) {
	this.name = name;
	this.department = department;
	this.phone = phone;
	this.salary = salary;
	this.showInfo = function() {
		console.log(`Имя: ${this.name}`);
		console.log(`Отдел: ${this.department}`);
		console.log(`Телефон: ${this.phone}`);
		console.log(`Зарплата: ${this.salary}`);
	};
}
let employee = new Employee('Иван', 'IT', '+7-900-000-00-00', 256256);
employee.showInfo();

console.log('=== Задание 10 ===');
function Calculator() {
	this.a = 0;
	this.b = 0;
	this.read = function(a, b) {
		this.a = a;
		this.b = b;
	};
	this.sum = function() {
		return this.a + this.b;
	};
	this.mul = function() {
		return this.a * this.b;
	};
}
let calculator2 = new Calculator();
calculator2.read(4, 6);
console.log(calculator2.sum());
console.log(calculator2.mul());

console.log('=== Задание 11 ===');
function Accumulator(startingValue) {
	this.value = startingValue;
	this.read = function(a) {
		this.value += a;
	};
}
let accumulator = new Accumulator(1);
accumulator.read(10);
accumulator.read(5);
console.log(accumulator.value);

console.log('=== Прототипы 1 ===');
/* rabbit.jumps возвращает true, так как свойство jumps есть в объекте rabbit.
delete rabbit.jumps удаляет свойство jumps из объекта rabbit, но оно все равно доступно через прототип animal, поэтому rabbit.jumps возвращает null.
delete animal.jumps удаляет свойство jumps из объекта animal, и теперь rabbit.jumps возвращает undefined, так как оно не найдено ни в rabbit, ни в его прототипе animal.
*/
{
	let animal = {
		jumps: null,
	};
	let rabbit = {
		__proto__: animal,
		jumps: true,
	};
	console.log('(1)', rabbit.jumps);
	delete rabbit.jumps;
	console.log('(2)', rabbit.jumps);
	delete animal.jumps;
	console.log('(3)', rabbit.jumps);
}

console.log('=== Прототипы 2 ===');
/*
Когда мы вызываем rabbit.eat(), метод eat устанавливает свойство full на объекте rabbit, так как this внутри метода eat ссылается на объект, который вызвал метод (в данном случае rabbit). Поэтому rabbit.full становится true.
Свойство full не устанавливается на объекте animal, так как метод eat не изменяет прототип, а только объект, который его вызвал. Поэтому animal.full остается undefined.
Проверка rabbit.hasOwnProperty('full') возвращает true, так как свойство full действительно принадлежит объекту rabbit, а не его прототипу animal.
*/
{
	let animal = {
		eat() {
			this.full = true;
		},
	};
	let rabbit = { __proto__: animal };
	rabbit.eat();
	console.log('rabbit.full:', rabbit.full);
	console.log('animal.full:', animal.full);
	console.log('full у rabbit:', rabbit.hasOwnProperty('full'));
}

console.log('=== Прототипы 3 ===');
/*
Проблема заключается в том, что объекты speedyBad и lazyBad наследуют свойство stomach от hamsterBad.
Когда speedyBad.eat('apple') вызывается, он добавляет 'apple' в stomach, который является общим для всех объектов, наследующих от hamsterBad.
Поэтому и speedyBad.stomach, и lazyBad.stomach показывают ['apple'], что не соответствует ожидаемому поведению.

Исправление заключается в том, чтобы каждый объект (speedy и lazy) имел свою собственную копию свойства stomach.
Это достигается путем создания отдельного массива stomach для каждого объекта, вместо того чтобы наследовать его от hamster.
Теперь speedy.eat('apple') будет добавлять 'apple' только в stomach объекта speedy, а lazy.stomach останется пустым.
*/
{
	let hamsterBad = {
		stomach: [],
		eat(food) {
			this.stomach.push(food);
		},
	};
	let speedyBad = {
		__proto__: hamsterBad,
	};
	let lazyBad = {
		__proto__: hamsterBad,
	};
	speedyBad.eat('apple');
	console.log('Проблема speedy:', speedyBad.stomach);
	console.log('Проблема lazy:', lazyBad.stomach);

	let hamster = {
		eat(food) {
			this.stomach.push(food);
		},
	};
	let speedy = {
		__proto__: hamster,
		stomach: [],
	};
	let lazy = {
		__proto__: hamster,
		stomach: [],
	};
	speedy.eat('apple');
	console.log('Исправлено speedy:', speedy.stomach);
	console.log('Исправлено lazy:', lazy.stomach);
}

console.log('=== Прототипы 4 ===');
/*
В этом примере мы добавляем свойства color и size, а также метод write к прототипу String.
Это означает, что все строки в JavaScript будут иметь доступ к этим свойствам и методу.
Когда мы создаем строку s с помощью new String('Это строка'), она наследует эти свойства и метод от прототипа String.
Мы можем изменить цвет и размер для этой конкретной строки, а затем вызвать метод write, который выведет информацию о цвете, размере и самом тексте.
Когда мы создаем другую строку s2, она также наследует эти свойства и метод, но так как мы не изменяли их для s2, они будут иметь значения по умолчанию (color: 'black', size: '14px') при вызове метода write.
*/
{
	String.prototype.color = 'black';
	String.prototype.size = '14px';
	String.prototype.write = function() {
		console.log('Цвет текста: ' + this.color);
		console.log('Размер шрифта: ' + this.size);
		console.log('Текст: ' + this.toString());
	};

	let s = new String('Это строка');
	s.color = 'red';
	s.size = '18px';
	s.write();

	let s2 = new String('Вторая строка');
	s2.write();
}

console.log('=== Прототипы 5 ===');
/*
При создании rabbit он наследует eats: true от прототипа, и изменения прототипа или удаление свойств не влияют на уже созданные экземпляры,
так как они продолжают ссылаться на исходный прототип.
*/
{
	function buildRabbit() {
		function Rabbit() {}
		Rabbit.prototype = { eats: true };
		let rabbit = new Rabbit();
		return { Rabbit, rabbit };
	}

	{
		let { Rabbit, rabbit } = buildRabbit();
		Rabbit.prototype = {};
		console.log('Rabbit.prototype = {} =>', rabbit.eats);
	}
	{
		let { Rabbit, rabbit } = buildRabbit();
		Rabbit.prototype.eats = false;
		console.log('Rabbit.prototype.eats = false =>', rabbit.eats);
	}
	{
		let { rabbit } = buildRabbit();
		delete rabbit.eats;
		console.log('delete rabbit.eats =>', rabbit.eats);
	}
	{
		let { Rabbit, rabbit } = buildRabbit();
		delete Rabbit.prototype.eats;
		console.log('delete Rabbit.prototype.eats =>', rabbit.eats);
	}
}

console.log('=== Классы 1 ===');
{
	class Clock {
		constructor(hours, minutes, seconds) {
			this.hours = hours;
			this.minutes = minutes;
			this.seconds = seconds;
		}

		showTime() {
			const h = String(this.hours).padStart(2, '0');
			const m = String(this.minutes).padStart(2, '0');
			const s = String(this.seconds).padStart(2, '0');
			console.log(`${h}:${m}:${s}`);
		}
	}

	let clock = new Clock(9, 5, 7);
	clock.showTime();
}

console.log('=== Классы 2 ===');
{
	class Animal {
		constructor(name) {
			this.name = name;
		}
	}
	class Rabbit extends Animal {
		constructor(name) {
			// Вызываем super для передачи параметра в конструктор родителя
			super(name);
			this.created = Date.now();
		}
	}
	let rabbit = new Rabbit('Белый кролик');
	console.log(rabbit.name);
}

console.log('=== Классы 3 ===');
{
	class Clock {
		constructor(template) {
			this.template = template;
		}
		render() {
			let date = new Date();
			let hours = date.getHours();
			if (hours < 10) hours = '0' + hours;
			let mins = date.getMinutes();
			if (mins < 10) mins = '0' + mins;
			let secs = date.getSeconds();
			if (secs < 10) secs = '0' + secs;
			let output = this.template
				.replace('h', hours)
				.replace('m', mins)
				.replace('s', secs);
			console.log(output);
		}
		stop() {
			clearInterval(this.timer);
		}
		start() {
			this.render();
			this.timer = setInterval(() => this.render(), 1000);
		}
	}

	class ExtendedClock extends Clock {
		constructor(template, precision = 1000) {
			super(template);
			this.precision = precision;
		}

		start() {
			this.render();
			this.timer = setInterval(() => this.render(), this.precision);
		}
	}

	let extendedClock = new ExtendedClock('h:m:s', 300);
	extendedClock.start();
	setTimeout(() => {
		extendedClock.stop();
		console.log('ExtendedClock stopped');
	}, 1100);
}

console.log('=== Классы 4 ===');
{
	class Stock {
		constructor() {
			this.nextSerial = 0;
			this.boxes = new Map();
		}

		add(w, v) {
			const serial = this.nextSerial++;
			this.boxes.set(serial, { serial, w, v });
			return serial;
		}

		getByW(minW) {
			return this.#takeBox('w', minW);
		}

		getByV(minV) {
			return this.#takeBox('v', minV);
		}

		#takeBox(field, minValue) {
			let candidate = null;
			for (let box of this.boxes.values()) {
				if (box[field] >= minValue) {
					if (candidate === null) {
						candidate = box;
					}
					else if (box[field] < candidate[field]) {
						candidate = box;
					}
					else if (box[field] === candidate[field] && box.serial > candidate.serial) {
						candidate = box;
					}
				}
			}

			if (candidate === null) {
				return -1;
			}

			this.boxes.delete(candidate.serial);
			return candidate.serial;
		}
	}

	let stock = new Stock();
	console.log('add:', stock.add(10, 100));
	console.log('add:', stock.add(8, 120));
	console.log('add:', stock.add(12, 90));
	console.log('add:', stock.add(10, 140));
	console.log('getByW(9):', stock.getByW(9));
	console.log('getByV(100):', stock.getByV(100));
	console.log('getByW(11):', stock.getByW(11));
	console.log('getByV(200):', stock.getByV(200));
}
