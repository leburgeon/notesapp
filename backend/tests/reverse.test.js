// Imports the testing function supplied by node:test
const { test } = require('node:test')
// Nodes assert module used for asserting the results of a test
const assert = require('node:assert')

// Fucntion to be tested
const reverse = require('../utils/for_testing').reverse


test('reverse of a', () => {
  const result = reverse('a')

  assert.strictEqual(result, 'a')
})

test('reverse of react', () => {
  const result = reverse('react')

  assert.strictEqual(result, 'tcaer')
})

test('reverse of saippuakauppias', () => {
  const result = reverse('saippuakauppias')

  assert.strictEqual(result, 'saippuakauppias')
})