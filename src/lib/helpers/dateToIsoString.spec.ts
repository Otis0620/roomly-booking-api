import { dateToIsoString } from './dateToIsoString';

describe('dateToIsoString', () => {
  it('should convert a Date object to an ISO string', () => {
    // Arrange
    const date = new Date('2025-03-10T12:00:00.000Z');

    // Act
    const result = dateToIsoString(date);

    // Assert
    expect(result).toBe(date.toISOString());
  });

  it('should return the input string unchanged if input is already a string', () => {
    // Arrange
    const input = '2025-03-10T12:00:00.000Z';

    // Act
    const result = dateToIsoString(input);

    // Assert
    expect(result).toBe(input);
  });

  it('should return an empty string when input is an empty string', () => {
    // Arrange
    const input = '';

    // Act
    const result = dateToIsoString(input);

    // Assert
    expect(result).toBe('');
  });

  it('should return the original value if input is a non-date string', () => {
    // Arrange
    const input = 'random string';

    // Act
    const result = dateToIsoString(input);

    // Assert
    expect(result).toBe(input);
  });

  it('should return "Invalid Date" when input is an invalid Date object', () => {
    // Arrange
    const invalidDate = new Date('invalid date');

    // Act
    const result = dateToIsoString(invalidDate);

    // Assert
    expect(result).toBe('Invalid Date');
  });
});
