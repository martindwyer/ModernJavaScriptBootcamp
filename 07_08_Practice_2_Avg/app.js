// Write a function to find the average value in an array of numbers
//avg([0,50]) //25
//avg([75,76,80,95,100]) //85.2

const avg = (arr) => {
  let sum = 0;
  for (let n of arr) {
    sum += n;
  }

  return sum / arr.length;
};
