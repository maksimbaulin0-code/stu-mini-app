const tg = window.Telegram?.WebApp;

const modal = document.getElementById('topup-modal');
const openTopup = document.getElementById('topup-open');
const closeTopup = document.getElementById('topup-close');
const topupForm = document.getElementById('topup-form');
const topupAmountInput = document.getElementById('topup-amount');
const topupResult = document.getElementById('topup-result');

if (tg) {
  tg.ready();
  tg.expand();
}

function showModal() {
  modal.classList.remove('hidden');
  topupAmountInput.focus();
}

function hideModal() {
  modal.classList.add('hidden');
}

openTopup.addEventListener('click', showModal);
closeTopup.addEventListener('click', hideModal);

modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    hideModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
    hideModal();
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

  topupResult.textContent = `Окно пополнения открыто: ${payload.amount} $`;
  topupResult.classList.remove('hidden');

  if (tg) {
    tg.HapticFeedback.notificationOccurred('success');
    tg.sendData(JSON.stringify(payload));
  }
});
