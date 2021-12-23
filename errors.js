/**
 * errors.js
 *
 */

// Custom error
class InvalidSelectorError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidSelectorError";
  }
}

class InvalidCSSNameError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidCSSNameError";
  }
}
