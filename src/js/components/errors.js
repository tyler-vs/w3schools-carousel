// Custom error
class InvalidSelectorError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidSelectorError";
  }
}
