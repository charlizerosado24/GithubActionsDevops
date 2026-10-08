const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const planets = require(path.join(__dirname, '..', 'public', 'data', 'planets.json'));

// Exercise idea: temporarily rename Earth in planets.json and run npm test; then restore its name.
test('there are eight planets', () => {
  assert.equal(planets.length, 8);
});

test('Earth is included', () => {
  assert.ok(planets.some((planet) => planet.name === 'Earth'));
});

test('every planet has the required nonempty fields', () => {
  for (const planet of planets) {
    for (const field of ['id', 'name', 'color', 'description']) {
      assert.equal(typeof planet[field], 'string', `${planet.id || 'Planet'} needs a string ${field}`);
      assert.ok(planet[field].trim().length > 0, `${planet.id || 'Planet'} needs a nonempty ${field}`);
    }
  }
});

test('planet IDs are unique', () => {
  const ids = planets.map((planet) => planet.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('planet colors use six-digit hex format', () => {
  for (const planet of planets) {
    assert.match(planet.color, /^#[0-9a-fA-F]{6}$/, `${planet.name} color must look like #48a9e6`);
  }
});
