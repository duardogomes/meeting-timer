let participants = [];
let currentIndex = 0;
let remainingSeconds = 0;
let intervalId = null;

let participantInput, addParticipantBtn, participantsList, minutesInput, currentSpeakerDiv, timerDisplay, startButton, nextButton, resetButton, newDailyButton, soundCheckbox, themeSelect;

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar elementos DOM
  participantInput = document.getElementById('participant-input');
  addParticipantBtn = document.getElementById('add-participant');
  participantsList = document.getElementById('participants-list');
  minutesInput = document.getElementById('minutes-input');
  currentSpeakerDiv = document.getElementById('current-speaker');
  timerDisplay = document.getElementById('timer-display');
  startButton = document.getElementById('start-button');
  nextButton = document.getElementById('next-button');
  resetButton = document.getElementById('reset-button');
  newDailyButton = document.getElementById('new-daily');
  soundCheckbox = document.getElementById('sound-checkbox');
  themeSelect = document.getElementById('theme-select');

  // Carregar participantes e atualizar UI
  loadParticipants();
  updateTimerDisplay();

  // Adicionar event listeners
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

  soundCheckbox.addEventListener('change', saveParticipants);
  themeSelect.addEventListener('change', () => {
    applyTheme(themeSelect.value);
    saveParticipants();
  });
});

// ----- STORAGE -----
function saveParticipants() {
  chrome.storage.sync.set({
    meetingParticipants: participants,
    meetingCurrentIndex: currentIndex,
    meetingMinutes: minutesInput.value,
    meetingSeconds: document.getElementById('seconds-input').value,
    soundEnabled: soundCheckbox.checked,
    theme: themeSelect.value
  }, () => {});
}

function loadParticipants() {
  chrome.storage.sync.get(
    { 
      meetingParticipants: null, 
      meetingCurrentIndex: 0,
      meetingMinutes: 2,
      meetingSeconds: 30,
      soundEnabled: true,
      theme: 'default'
    },
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
      // recarregar tempos
      minutesInput.value = data.meetingMinutes || 2;
      document.getElementById('seconds-input').value = data.meetingSeconds || 30;
      soundCheckbox.checked = data.soundEnabled !== false; // default true
      themeSelect.value = data.theme || 'default';
      applyTheme(data.theme || 'default');
    }
  );
}

// ----- THEME -----
function applyTheme(theme) {
  document.body.className = theme;
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

  remainingSeconds = getTotalSeconds();
  if (remainingSeconds <= 0) {
    remainingSeconds = 60; // fallback 1 min
  }
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
      alertEndOfTime(); // beep + flash
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

function alertEndOfTime() {
  // beep
  if (soundCheckbox.checked) {
    const audio = document.getElementById('beep-audio');
    if (audio) {
      // algumas vezes é bom resetar para o início
      audio.currentTime = 0;
      audio.play().catch(() => {}); // ignora erro se o navegador bloquear
    }
  }

  // alerta visual no timer
  timerDisplay.classList.remove('flash-alert'); // reset
  void timerDisplay.offsetWidth; // força reflow para reiniciar animação
  timerDisplay.classList.add('flash-alert');
}

function getTotalSeconds() {
  const minutes = parseInt(minutesInput.value, 10) || 0;
  const seconds = parseInt(document.getElementById('seconds-input').value, 10) || 0;
  return minutes * 60 + seconds;
}
