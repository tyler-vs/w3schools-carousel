// Custom error
class InvalidSelectorError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidSelectorError";
  }
}


// Custom error
class UnsupportedBrowserError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnsupportedBrowserError";
  }
}

export {InvalidSelectorError, UnsupportedBrowserError};
