import { readFileSync } from 'fs';
import path from 'path';
import { act } from '@testing-library/react';

const breeds = [
  { name: "Bicon Frise" },
  { name: "Bolognese" },
  { name: "Coton de Tulear" },
  { name: "Havanese" },
  { name: "Maltese" }
]

const doggos = JSON.parse(
  readFileSync(path.join(__dirname, 'res.json')).toString()
)

export const ANIMALS = ["dog", "cat", "bird"];
export const _breeds = breeds;
export const _dogs = doggos.animals;

const mock = {
  breeds: jest.fn(() => {
    return {
      then: callback => act(() => callback({ breeds })) // promise like object
    }
  }), // spyFunction
  animals: jest.fn(() => {
    return {
      then: callback => act(() => callback(doggos)) // promise like object
    }
  })
}

export default mock;