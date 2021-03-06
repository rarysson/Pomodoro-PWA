import {
	getWorkTime,
	setWorkTime,
	getBreakTime,
	setBreakTime
} from './localStorage.js';

const $clock = document.querySelector('.clock');
const $clockBtn = document.querySelector('.clock-btn');
const $configBtn = document.querySelector('.config-btn');
const $currentStatus = document.querySelector('.current-status');
const $modal = document.querySelector('.modal');
const $closeModalBtn = document.querySelector('.close-modal-btn');
const $saveConfigBtn = document.querySelector('.save-config-btn');
const $workInput = document.querySelector('#work-time');
const $breakInput = document.querySelector('#break-time');
const $allowNotificationBtn = document.querySelector('.allow-notification-btn');

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

function getTimeInSeconds(time) {
	return time * 60;
}

function resetClock() {
	clearInterval(idInterval);
	clockIsRunning = false;
	$clockBtn.textContent = 'Start';
	$currentStatus.classList.add('blink');
	$configBtn.disabled = false;

	if (Notification.permission === 'granted') {
		new Notification('Pomodoro', {
			icon: 'icons/512.png',
			body: isWorkTime ? 'Finished work timer' : 'Finished break timer',
			vibrate: [200, 100, 200, 100, 200, 100, 400],
		});
	}

	if (isWorkTime) {
		isWorkTime = false;
		$currentStatus.textContent = 'Break';
		timer.value = getTimeInSeconds(getBreakTime());
	} else {
		isWorkTime = true;
		$currentStatus.textContent = 'Work';
		timer.value = getTimeInSeconds(getWorkTime());
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
			? getTimeInSeconds(getWorkTime())
			: getTimeInSeconds(getBreakTime());
	}
});

$allowNotificationBtn.addEventListener('click', () => {
	Notification.requestPermission();
});

timer.value = getTimeInSeconds(getWorkTime());

if (Notification.permission === 'default' || Notification.permission === 'denied') {
	$allowNotificationBtn.style.display = 'block';
}

async function loadServiceWorker() {
	try {
		await navigator.serviceWorker.register("sw.js");
	} catch (error) {
		console.error('Error while registering: ' + error.message);
	}
}

loadServiceWorker();
