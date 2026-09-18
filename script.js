const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const bookingModal = $('#booking-modal');
const infoModal = $('#info-modal');
const infoTitle = $('#info-title');
const infoCopy = $('#info-copy');

function openModal(modal) {
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  const firstField = $('input, select, textarea', modal);
  if (firstField) window.setTimeout(() => firstField.focus(), 120);
}

function closeModal(modal) {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  if (![bookingModal, infoModal].some(item => item.classList.contains('is-open'))) document.body.classList.remove('modal-open');
}

$$('[data-open-booking]').forEach(button => {
  button.addEventListener('click', () => {
    const room = button.dataset.room;
    if (room) $('[name="room"]', bookingModal).value = room;
    openModal(bookingModal);
  });
});

$$('[data-open-experience], [data-open-note]').forEach(button => {
  button.addEventListener('click', () => {
    infoTitle.textContent = button.dataset.title;
    infoCopy.textContent = button.dataset.copy;
    openModal(infoModal);
  });
});

$$('[data-close-modal]').forEach(button => button.addEventListener('click', () => closeModal(button.closest('.modal'))));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeModal(bookingModal);
    closeModal(infoModal);
  }
});

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const toDateValue = date => date.toISOString().split('T')[0];
const checkIn = $('[name="checkin"]');
const checkOut = $('[name="checkout"]');
checkIn.min = toDateValue(today);
checkOut.min = toDateValue(tomorrow);
checkIn.addEventListener('change', () => {
  const nextDay = new Date(`${checkIn.value}T00:00:00`);
  nextDay.setDate(nextDay.getDate() + 1);
  checkOut.min = toDateValue(nextDay);
  if (checkOut.value && checkOut.value <= checkIn.value) checkOut.value = toDateValue(nextDay);
});

function showStatus(form, message) {
  const status = $('.form-status', form);
  status.textContent = message;
  window.setTimeout(() => { status.textContent = ''; }, 8000);
}

$('#booking-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const text = `Hello Nomadic Kashi, I would like to enquire about ${data.get('room')} from ${data.get('checkin')} to ${data.get('checkout')} for ${data.get('guests')}. My name is ${data.get('name')}.`;
  showStatus(form, 'Thanks — opening WhatsApp with your request…');
  window.open(`https://wa.me/916002786671?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  form.reset();
  checkIn.min = toDateValue(today);
  checkOut.min = toDateValue(tomorrow);
});

$('#contact-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const text = `Hello Nomadic Kashi, my name is ${data.get('name')}. ${data.get('message') || 'I would like to know more about a stay.'}`;
  showStatus(form, 'Thanks — opening WhatsApp with your enquiry…');
  window.open(`https://wa.me/916002786671?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  form.reset();
});

$$('.nav-trigger').forEach(trigger => {
  trigger.addEventListener('click', event => {
    event.stopPropagation();
    const group = trigger.closest('.nav-group');
    const isOpen = group.classList.contains('open');
    $$('.nav-group').forEach(item => item.classList.remove('open'));
    $$('.nav-trigger').forEach(item => item.setAttribute('aria-expanded', 'false'));
    if (!isOpen) {
      group.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
    }
  });
});
document.addEventListener('click', () => {
  $$('.nav-group').forEach(item => item.classList.remove('open'));
  $$('.nav-trigger').forEach(item => item.setAttribute('aria-expanded', 'false'));
});

const menuToggle = $('.menu-toggle');
const mobilePanel = $('.mobile-panel');
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!open));
  mobilePanel.classList.toggle('is-open', !open);
  mobilePanel.setAttribute('aria-hidden', String(open));
  document.body.classList.toggle('modal-open', !open);
});
$$('.mobile-panel a, .mobile-panel [data-open-booking]').forEach(link => link.addEventListener('click', () => {
  menuToggle.setAttribute('aria-expanded', 'false');
  mobilePanel.classList.remove('is-open');
  mobilePanel.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}));
