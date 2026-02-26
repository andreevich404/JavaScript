function ask_password(login, password, success, failure) {
	const normalizedLogin = String(login).toLowerCase();
	const normalizedPassword = String(password).toLowerCase();
	const vowels = new Set(['a', 'e', 'i', 'o', 'u', 'y']);

	function getConsonants(text) {
		let result = '';
		for (const ch of text) {
			if (ch >= 'a' && ch <= 'z' && !vowels.has(ch)) {
				result += ch;
			}
		}
		return result;
	}

	let vowelCount = 0;
	for (const ch of normalizedPassword) {
		if (vowels.has(ch)) {
			vowelCount++;
		}
	}

	const hasRightVowels = vowelCount === 3;
	const hasRightConsonants = getConsonants(normalizedPassword) === getConsonants(normalizedLogin);

	if (hasRightVowels && hasRightConsonants) {
		success(normalizedLogin);
		return;
	}

	if (!hasRightVowels && !hasRightConsonants) {
		failure(normalizedLogin, 'Everything is wrong');
		return;
	}

	if (!hasRightVowels) {
		failure(normalizedLogin, 'Wrong number of vowels');
		return;
	}

	failure(normalizedLogin, 'Wrong consonants');
}

function main(login, password) {
	ask_password(login, password,
		(userLogin) => {
			console.log(`Привет, ${userLogin}!`);
		},
		(userLogin, errorText) => {
			console.log(`Кто-то пытался притвориться пользователем ${userLogin}, но в пароле допустил ошибку: ${errorText.toUpperCase()}.`);
		},
	);
}

function runAskPassword(done) {
	main('login', 'aaalgn');
	main('login', 'luagon');
	main('login', 'aaalgx');
	main('login', 'lgn');
	main('login', 'abc');
	if (typeof done === 'function') {
		done();
	}
}

module.exports = {
	ask_password,
	main,
	runAskPassword,
};
