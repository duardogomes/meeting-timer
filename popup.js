let participants = [];
let currentIndex = 0;
let remainingSeconds = 0;
let intervalId = null;

const participantInput = document.getElementById('participant-input');
const addParticipantBtn = document.getElementById('add-participant');
const participantsList = document.getElementById('participants-list');
const minutesInput = document.getElementById('minutes-input');
const currentSpeakerDiv = document.getElementById('current-speaker');
const timerDisplay = document.getElementById('timer-display');
const startButton = document.getElementById('start-button');
const nextButton = document.getElementById('next-button');
const resetButton = document.getElementById('reset-button');
const newDailyButton = document.getElementById('new-daily');

// ----- STORAGE -----
function saveParticipants() {
  chrome.storage.sync.set(
    { meetingParticipants: participants, meetingCurrentIndex: currentIndex },
    () => {}
  );
}

function loadParticipants() {
  chrome.storage.sync.get(
    { meetingParticipants: null, meetingCurrentIndex: 0 },
    (data) => {
      if (data.meetingParticipants && data.meetingParticipants.length > 0) {
        participants = data.meetingParticipants;
        currentIndex = data.meetingCurrentIndex || 0;
      } else {
        // default Dev 1..Dev 5
        participants = [
          { name: 'Dev 1', done: false },
          { name: 'Dev 2', done: false },
          { name: 'Dev 3', done: false },
          { name: 'Dev 4', done: false },
          { name: 'Dev 5', done: false }
        ];
        currentIndex = 0;
      }
      updateCurrentSpeaker();
      renderParticipants();
    }
  );
}

// ----- RENDER -----
function renderParticipants() {
  participantsList.innerHTML = '';
  participants.forEach((p, index) => {
    const li = document.createElement('li');

    const nameSpan = document.createElement('span');
    nameSpan.textContent = p.name + (p.done ? ' ✓' : '');
    if (index === currentIndex) nameSpan.style.fontWeight = 'bold';

    nameSpan.addEventListener('click', () => {
      currentIndex = index;
      updateCurrentSpeaker();
      renderParticipants();
      saveParticipants();
    });

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'X';
    removeBtn.className = 'remove-btn';
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      participants.splice(index, 1);
      if (currentIndex >= participants.length) currentIndex = 0;
      updateCurrentSpeaker();
      renderParticipants();
      saveParticipants();
    });

    li.appendChild(nameSpan);
    li.appendChild(removeBtn);
    participantsList.appendChild(li);
  });
}

function updateCurrentSpeaker() {
  if (participants[currentIndex]) {
    currentSpeakerDiv.textContent = 'Falando agora: ' + participants[currentIndex].name;
  } else {
    currentSpeakerDiv.textContent = 'Nenhum participante';
  }
}

// ----- TIMER -----
function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return m + ':' + s;
}

function updateTimerDisplay() {
  timerDisplay.textContent = formatTime(remainingSeconds);
}

function startTimer() {
  if (!participants[currentIndex]) return;
  if (intervalId) clearInterval(intervalId);

  const minutes = parseInt(minutesInput.value, 10) || 1;
  remainingSeconds = minutes * 60;
  timerDisplay.style.color = 'black';
  updateTimerDisplay();

  intervalId = setInterval(() => {
    remainingSeconds--;
    updateTimerDisplay();
    if (remainingSeconds <= 0) {
      clearInterval(intervalId);
      intervalId = null;
      timerDisplay.style.color = 'red';
      participants[currentIndex].done = true;
      renderParticipants();
      saveParticipants();
    }
  }, 1000);
}

function nextSpeaker() {
  if (participants.length === 0) return;
  participants[currentIndex].done = true;
  currentIndex = (currentIndex + 1) % participants.length;
  timerDisplay.style.color = 'black';
  startTimer();
  updateCurrentSpeaker();
  renderParticipants();
  saveParticipants();
}

// ----- EVENTOS -----
addParticipantBtn.addEventListener('click', () => {
  const name = participantInput.value.trim();
  if (!name) return;
  participants.push({ name, done: false });
  participantInput.value = '';
  if (participants.length === 1) currentIndex = 0;
  updateCurrentSpeaker();
  renderParticipants();
  saveParticipants();
});

participantInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addParticipantBtn.click();
  }
});

startButton.addEventListener('click', startTimer);
nextButton.addEventListener('click', nextSpeaker);

resetButton.addEventListener('click', () => {
  if (intervalId) clearInterval(intervalId);
  intervalId = null;
  remainingSeconds = 0;
  timerDisplay.style.color = 'black';
  updateTimerDisplay();
});

newDailyButton.addEventListener('click', () => {
  participants.forEach(p => p.done = false);
  currentIndex = 0;
  updateCurrentSpeaker();
  renderParticipants();
  saveParticipants();
});

document.addEventListener('DOMContentLoaded', () => {
  loadParticipants();
  updateTimerDisplay();
});
