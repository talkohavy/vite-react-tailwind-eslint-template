import type { Person } from '../types';

export function validatePerson(person: Person) {
  // Validate that id is a positive number
  if (!person.id || person.id <= 0 || !Number.isInteger(person.id)) {
    throw new Error('Person ID must be a positive integer');
  }

  // Validate that name is provided
  if (!person.name || person.name.trim() === '') {
    throw new Error('Person name is required');
  }

  // Validate that age is a positive number
  if (person.age < 0 || !Number.isInteger(person.age)) {
    throw new Error('Person age must be a non-negative integer');
  }
}
