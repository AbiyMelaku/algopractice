/*! algorithms v0.0.0 - MIT license */
'use strict';

//Reverse the provided string.
var reverseString = function (str) {
  return str.split('').reverse().join('');
  
}

//Factorialize a Number
var factorialize = function (num) {
  let product = 1;
  for(let i = 1; i <= num; i++){
    product *= i;  
  }
  return product;
  // your code goes here
}

//it should take a string and repeat it a number of times
var repeat = function(str, count) {
  // your code goes here
  let string = str
  while(count > 1){
    string += str;
    count--;
  }
  return string;
};
