import './style.css'
import {
	getWorkTime,
	setWorkTime,
	getBreakTime,
	setBreakTime
} from './localStorage';

const $clock = document.querySelector('.clock');
const $clockBtn = document.querySelector('.clock-btn');
const $configBtn = document.querySelector('.config-btn');
const $currentStatus = document.querySelector('.current-status');
const $modal = document.querySelector('.modal');
const $closeModalBtn = document.querySelector('.close-modal-btn');
const $saveConfigBtn = document.querySelector('.save-config-btn');
const $workInput = document.querySelector('#work-time');
const $breakInput = document.querySelector('#break-time');

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
	$currentStatus.classList.add('blink');

	if (isWorkTime) {
		isWorkTime = false;
		$currentStatus.textContent = 'Break';
		timer.value = getBreakTime() * 60;
	} else {
		isWorkTime = true;
		$currentStatus.textContent = 'Work';
		timer.value = getWorkTime() * 60;
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
		$configBtn.disabled = true;
	} else {
		clearInterval(idInterval);
		$configBtn.disabled = false;
	}
});

$configBtn.addEventListener('click', () => {
	$modal.style.display = 'grid';
	$workInput.value = getWorkTime();
	$breakInput.value = getBreakTime();
});

$closeModalBtn.addEventListener('click', () => {
	$modal.style.display = 'none';
});

$currentStatus.addEventListener('animationend', () => {
	$currentStatus.classList.remove('blink');
});

$saveConfigBtn.addEventListener('click', () => {
	const workTime = parseInt($workInput.value, 10);
	const breakTime = parseInt($breakInput.value, 10);

	if ((workTime > 0 && workTime < 100) && (breakTime > 0 && breakTime < 100)) {
		setWorkTime(workTime);
		setBreakTime(breakTime);

		$modal.style.display = 'none';
		timer.value = isWorkTime
			? getWorkTime() * 60
			: getBreakTime() * 60;
	}
});

timer.value = getWorkTime() * 60;
