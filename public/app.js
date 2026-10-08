const planetList = document.querySelector('#planet-list');
const planetName = document.querySelector('#planet-name');
const planetDescription = document.querySelector('#planet-description');
const resetButton = document.querySelector('#reset-button');
const missionForm = document.querySelector('#mission-form');
const missionPlanet = document.querySelector('#mission-planet');
const missionNote = document.querySelector('#mission-note');
const missionList = document.querySelector('#mission-list');
const missionStatus = document.querySelector('#mission-status');
const clearMissionsButton = document.querySelector('#clear-missions');
const missionStorageKey = 'solar-system-missions';

let planets = [];
let missions = loadSavedMissions();

function loadSavedMissions() {
  try {
    const saved = JSON.parse(localStorage.getItem(missionStorageKey) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveMissions() {
  try {
    localStorage.setItem(missionStorageKey, JSON.stringify(missions));
    return true;
  } catch {
    return false;
  }
}

function renderMissions() {
  missionList.replaceChildren();
  missionStatus.textContent = missions.length
    ? `${missions.length} planet${missions.length === 1 ? '' : 's'} in your mission log.`
    : 'No planets added yet.';

  missions.forEach((mission, index) => {
    const entry = document.createElement('li');
    entry.className = 'mission-entry';

    const details = document.createElement('div');
    const name = document.createElement('strong');
    name.textContent = mission.name;
    details.append(name);
    if (mission.note) {
      const note = document.createElement('span');
      note.className = 'mission-entry-note';
      note.textContent = mission.note;
      details.append(note);
    }

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'remove-mission';
    removeButton.textContent = 'Remove';
    removeButton.setAttribute('aria-label', `Remove ${mission.name} from mission log`);
    removeButton.addEventListener('click', () => {
      missions.splice(index, 1);
      saveMissions();
      renderMissions();
    });

    entry.append(details, removeButton);
    missionList.append(entry);
  });
}

function selectPlanet(id) {
  const selected = planets.find((planet) => planet.id === id);
  if (!selected) return;

  planetName.textContent = selected.name;
  planetDescription.textContent = selected.description;
  planetList.querySelectorAll('.planet-button').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.planet === id));
  });
}

function renderPlanets() {
  planetList.replaceChildren();
  missionPlanet.replaceChildren(new Option('Choose a planet', ''));
  planets.forEach((planet, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'planet-button';
    button.dataset.planet = planet.id;
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-label', `Show ${planet.name} details`);

    const circle = document.createElement('span');
    circle.className = 'planet';
    circle.setAttribute('aria-hidden', 'true');
    circle.style.setProperty('--planet-color', planet.color);
    circle.style.setProperty('--planet-size', `${Math.min(42, 18 + index * 3)}px`);

    const label = document.createElement('span');
    label.className = 'planet-label';
    label.textContent = planet.name;

    button.append(circle, label);
    button.addEventListener('click', () => selectPlanet(planet.id));
    planetList.append(button);

    missionPlanet.add(new Option(planet.name, planet.id));
  });
}

async function loadPlanets() {
  try {
    const response = await fetch('./data/planets.json');
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);
    planets = await response.json();
    renderPlanets();
    selectPlanet('earth');
  } catch (error) {
    planetList.innerHTML = '<p class="error-message">Planet data could not be loaded. Check the server and data file, then refresh.</p>';
    console.error(error);
  }
}

resetButton.addEventListener('click', () => selectPlanet('earth'));
missionForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const selected = planets.find((planet) => planet.id === missionPlanet.value);
  if (!selected) return;

  missions.push({ name: selected.name, note: missionNote.value.trim() });
  const saved = saveMissions();
  renderMissions();
  missionForm.reset();
  missionStatus.textContent = saved
    ? `${selected.name} added to your mission log.`
    : `${selected.name} added for now. Your browser could not save this log.`;
});
clearMissionsButton.addEventListener('click', () => {
  missions = [];
  saveMissions();
  renderMissions();
});
renderMissions();
loadPlanets();
