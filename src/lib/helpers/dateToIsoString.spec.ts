import { dateToIsoString } from './dateToIsoString';

describe('dateToIsoString', () => {
  it('should convert a Date object to an ISO string', () => {
    const date = new Date('2025-03-10T12:00:00.000Z');

    const result = dateToIsoString(date);

    expect(result).toBe(date.toISOString());
  });

  it('should return the input string unchanged if input is already a string', () => {
    const input = '2025-03-10T12:00:00.000Z';

    const result = dateToIsoString(input);

    expect(result).toBe(input);
  });

  it('should return an empty string when input is an empty string', () => {
    const input = '';

    const result = dateToIsoString(input);

    expect(result).toBe('');
  });

  it('should return the original value if input is a non-date string', () => {
    const input = 'random string';

    const result = dateToIsoString(input);

    expect(result).toBe(input);
  });

  it('should return "Invalid Date" when input is an invalid Date object', () => {
    const invalidDate = new Date('invalid date');

    const result = dateToIsoString(invalidDate);

    expect(result).toBe('Invalid Date');
  });
});
