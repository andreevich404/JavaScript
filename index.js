/*
Задание 1.
*/
let firstName = 'Ivan';
let age = 25;
let isStudent = true;
let score = null;
let profile = { city: 'NY' };

console.log('\n================ Задание 1. ================');
console.log(typeof firstName);
console.log(typeof age);
console.log(typeof isStudent);
console.log(typeof score);
console.log(typeof profile);

/*
Задание 2.
*/
let firstValue = 10;
let secondValue = 20;
console.log('\n================ Задание 2. ================');
console.log(firstValue === secondValue);
console.log(firstValue < secondValue);
console.log(firstValue <= secondValue);
console.log(firstValue > secondValue);

/*
Задание 3.
*/
let a = false;
let b = null;
let c = undefined;
console.log('\n================ Задание 3. ================');
console.log(a);
console.log(b);
console.log(c);

/*
Задание 4.
*/
console.log('\n================ Задание 4. ================');
console.log('1' + 2 + 3);
console.log(1 + 2 + '3');
console.log('1' - 2);
console.log('1' + -2);
console.log('1' + '1' - '1');
console.log('foo' + -'bar');
console.log(0 == '0');
console.log(0.5 + 0.1 == 0.6);
console.log(0.1 + 0.2 == 0.3);
console.log(true + true + true == 3);
console.log(true == 1);
console.log(true === 1);
console.log(1 < 2 < 3);
console.log(3 > 2 > 1);
console.log(9007199254740991 + 1 == 9007199254740991 + 2);
console.log(Math.sqrt(-1) == Math.sqrt(-1));

/*
Задание 5.
*/
console.log('\n================ Задание 5. ================');
let str1 = 'Кто ';
let str2 = 'ты ';
let str3 = 'такой?';
let concatenation = str1 + str2 + str3;
console.log(concatenation);

/*
Задание 6.
*/
console.log('\n================ Задание 6. ================');
let str = '20';
let al = 5;
console.log(str + al);
console.log(str - al);
console.log(str * '2');
console.log(str / 2);

/*
Задание 7.
*/
console.log('\n================ Задание 7. ================');
let a2 = '12';
let b2 = '7.15';
let remainder = Math.round(Number(a2) % Number(b2));
console.log(remainder);

/*
Задание 8.
*/
console.log('\n================ Задание 8. ================');
let x = 5;
let result = (x ** 2 - 7 * x + 10) / (x ** 2 - 8 * x + 12);
console.log(result);

/*
Задание 9.
*/
console.log('\n================ Задание 9. ================');
let email = 'userexample.com';
if (!email.includes('@')) {
	console.log('Предупреждение: символ @ отсутствует в адресе электронной почты.');
}

/*
Управление потоком
*/
/*
Задание 1.
*/
console.log('\n================ Управление потоком. ================');
console.log('\n================ Задание 1. ================');
let ageP = 25;

if (ageP >= 18 && ageP <= 30) {
	console.log('Для молодежи');
}
else {
	console.log('Для всех возрастов');
}

if (ageP >= 18 && ageP <= 30) {
	console.log('Для молодежи');
}
else if (ageP >= 1 && ageP <= 17) {
	console.log('Для детей');
}
else {
	console.log('Для всех возрастов');
}

/*
Задание 2.
*/
console.log('\n================ Задание 2. ================');
let aP = 12;
let bP = 7;
let max = aP > bP ? aP : bP;
console.log(max);

/*
Задание 3.
*/
console.log('\n================ Задание 3. ================');
let crows = 4;
let ending = crows % 10;

switch (ending) {
case 1:
	console.log(`На ветке сидит ${crows} ворона`);
	break;
case 2:
case 3:
case 4:
	console.log(`На ветке сидит ${crows} вороны`);
	break;
default:
	console.log(`На ветке сидит ${crows} ворон`);
	break;
}

/*
Задание 4.
*/
console.log('\n================ Задание 4. ================');
let i = 1;
while (i <= 50) {
	if (i % 2 !== 0) console.log(i);
	i++;
}

for (let j = 1; j <= 50; j++) {
	if (j % 2 !== 0) console.log(j);
}

/*
Задание 5.
*/
console.log('\n================ Задание 5. ================');
let sum = 0;
for (let k = 1; k <= 15; k++) {
	if (k !== 5 && k !== 7) sum += k;
}
console.log(sum);

/*
Задание 6.
*/
console.log('\n================ Задание 6. ================');
let xP = 2;
let yP = 5;
let power = 1;
let n = 0;

while (n < yP) {
	power *= xP;
	n++;
}
console.log(power);
