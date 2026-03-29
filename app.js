const tg = window.Telegram?.WebApp;

const mainScreen = document.getElementById('main-screen');
const topupScreen = document.getElementById('topup-screen');
const openTopup = document.getElementById('topup-open');
const backButton = document.getElementById('topup-back');
const topupForm = document.getElementById('topup-form');
const topupAmountInput = document.getElementById('topup-amount');
const topupResult = document.getElementById('topup-result');

if (tg) {
  tg.ready();
  tg.expand();
}

function openTopupScreen() {
  mainScreen.classList.add('hidden');
  topupScreen.classList.remove('hidden');
  topupAmountInput.focus();
}

function openMainScreen() {
  topupScreen.classList.add('hidden');
  mainScreen.classList.remove('hidden');
}

openTopup.addEventListener('click', openTopupScreen);
backButton.addEventListener('click', openMainScreen);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !topupScreen.classList.contains('hidden')) {
    openMainScreen();
  }
});

topupForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const amount = Number(topupAmountInput.value);
  if (!Number.isFinite(amount) || amount <= 0) {
    topupResult.textContent = 'Введите корректную сумму больше 0.';
    topupResult.classList.remove('hidden');
    return;
  }

  const payload = {
    type: 'topup',
    amount: amount.toFixed(2),
    currency: 'USD'
  };

  topupResult.textContent = `Пополнение создано: ${payload.amount} $`;
  topupResult.classList.remove('hidden');

  if (tg) {
    tg.HapticFeedback.notificationOccurred('success');
    tg.sendData(JSON.stringify(payload));
  }
});
