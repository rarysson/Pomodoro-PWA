export function getWorkTime() {
	let time = localStorage.getItem('work-time');

	if (!time) {
		setWorkTime(25);
		time = 25;
	}

	return parseInt(time, 10);
}

export function setWorkTime(time) {
	localStorage.setItem('work-time', time);
}

export function getBreakTime() {
	let time = localStorage.getItem('break-time');

	if (!time) {
		setBreakTime(5);
		time = 5;
	}

	return parseInt(time, 10);
}

export function setBreakTime(time) {
	localStorage.setItem('break-time', time);
}
