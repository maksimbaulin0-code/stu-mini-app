const MONTH_LABELS = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь'
];

const monthSelect = document.getElementById('month');
const daySelect = document.getElementById('day');
const timeSelect = document.getElementById('time');
const form = document.getElementById('booking-form');
const result = document.getElementById('result');

const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
}

function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function fillMonths() {
  const now = new Date();
  for (let offset = 0; offset < 12; offset += 1) {
    const date = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    const option = document.createElement('option');
    option.value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    option.textContent = `${MONTH_LABELS[date.getMonth()]} ${date.getFullYear()}`;
    monthSelect.append(option);
  }
}

function fillDays() {
  daySelect.innerHTML = '';
  const [year, month] = monthSelect.value.split('-').map(Number);
  const total = daysInMonth(year, month - 1);
  const now = new Date();

  for (let d = 1; d <= total; d += 1) {
    const option = document.createElement('option');
    option.value = String(d).padStart(2, '0');
    option.textContent = `${d}`;

    const isPastDay =
      year === now.getFullYear() &&
      month === now.getMonth() + 1 &&
      d < now.getDate();

    option.disabled = isPastDay;
    daySelect.append(option);
  }

  const firstAvailable = Array.from(daySelect.options).find((opt) => !opt.disabled);
  if (firstAvailable) {
    daySelect.value = firstAvailable.value;
  }
}

function fillTimes() {
  timeSelect.innerHTML = '';
  const slots = [];
  for (let hour = 9; hour <= 21; hour += 1) {
    slots.push(`${String(hour).padStart(2, '0')}:00`);
    if (hour !== 21) {
      slots.push(`${String(hour).padStart(2, '0')}:30`);
    }
  }

  slots.forEach((slot) => {
    const option = document.createElement('option');
    option.value = slot;
    option.textContent = slot;
    timeSelect.append(option);
  });
}

function formatBookingText({ monthValue, day, time }) {
  const [year, month] = monthValue.split('-');
  return `Вы записаны на ${day}.${month}.${year} в ${time}`;
}

fillMonths();
fillDays();
fillTimes();

monthSelect.addEventListener('change', fillDays);

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const payload = {
    monthValue: monthSelect.value,
    day: daySelect.value,
    time: timeSelect.value
  };

  const text = formatBookingText(payload);
  result.textContent = text;
  result.classList.remove('hidden');

  localStorage.setItem('studio-booking', JSON.stringify(payload));

  if (tg) {
    tg.MainButton.setText('Отправить запись');
    tg.MainButton.show();
    tg.MainButton.onClick(() => tg.sendData(JSON.stringify(payload)));
    tg.HapticFeedback.notificationOccurred('success');
  }
});

const saved = localStorage.getItem('studio-booking');
if (saved) {
  const parsed = JSON.parse(saved);
  if (parsed.monthValue) {
    monthSelect.value = parsed.monthValue;
    fillDays();
  }
  if (parsed.day) {
    daySelect.value = parsed.day;
  }
  if (parsed.time) {
    timeSelect.value = parsed.time;
  }
}
