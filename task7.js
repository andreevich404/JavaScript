const UNIT = 100;
const REST_TIME = 5;

const delay = (units) => new Promise(resolve => setTimeout(resolve, units * UNIT));

async function doTask(name, taskNum, prepTime, defenseTime) {
	console.log(`${name} started the ${taskNum} task.`);
	await delay(prepTime);
	console.log(`${name} moved on to the defense of the ${taskNum} task.`);
	await delay(defenseTime);
	console.log(`${name} completed the ${taskNum} task.`);
}

async function processCandidate(name, prep1, defense1, prep2, defense2) {
	await doTask(name, 1, prep1, defense1);
	console.log(`${name} is resting.`);
	await delay(REST_TIME);
	await doTask(name, 2, prep2, defense2);
}

async function interviews(...candidates) {
	await Promise.all(
		candidates.map(([name, prep1, def1, prep2, def2]) =>
			processCandidate(name, prep1, def1, prep2, def2),
		),
	);
}

async function runTask7() {
	await interviews(
		['Ivan', 5, 2, 7, 2],
		['John', 3, 4, 5, 1],
		['Sophia', 4, 2, 5, 1],
	);
}

module.exports = { interviews, runTask7 };
