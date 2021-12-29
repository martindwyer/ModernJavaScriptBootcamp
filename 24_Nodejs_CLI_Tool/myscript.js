const message = "hi there";

let counter = 0;

module.exports = {
  message,
  incrementCounter() {
    counter = counter + 1;
  },
  getCounter() {
    return counter;
  },
};
