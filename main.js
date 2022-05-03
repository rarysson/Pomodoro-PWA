import './style.css'

const $clock = document.querySelector('.clock');
const $clockBtn = document.querySelector('.clock-btn');
const $currentStatus = document.querySelector('.current-status');

let idInterval;
let clockIsRunning = false;
let isWorkTime = true;

let timer = new Proxy({ value: 0 }, {
	set(target, prop, value) {
		if (prop === 'value' && value >= 0) {
			const getFormattedNumber = number => number >= 10 ? number : `0${number}`;

			let minutes = getFormattedNumber(Math.floor(value / 60));
			let seconds = getFormattedNumber(value % 60);

			target.value = value;
			$clock.textContent = `${minutes}:${seconds}`;

			return true;
		}

		return false;
	}
});

function resetClock() {
	clearInterval(idInterval);
	clockIsRunning = false;
	$clockBtn.textContent = 'Start';

	if (isWorkTime) {
		isWorkTime = false;
		$currentStatus.textContent = 'Break';
		timer.value = 5;
	} else {
		isWorkTime = true;
		$currentStatus.textContent = 'Work';
		timer.value = 5;
	}
}

$clockBtn.addEventListener('click', () => {
	clockIsRunning = !clockIsRunning;
	$clockBtn.textContent = clockIsRunning ? 'Stop' : 'Start';

	if (clockIsRunning) {
		idInterval = setInterval(() => {
			if (clockIsRunning) {
				timer.value--;

				if (!timer.value) {
					resetClock();
				}
			}
		}, 1000);
	} else {
		clearInterval(idInterval);
	}
});

timer.value = 5;
