/*! algorithms v0.0.0 - MIT license */
'use strict';

// Reverse the provided string.
const reverseString = function (str) {
  // your code goes here
};

// Reverse only the vowels in the provided string.
const reverseVowels = function (str) {
  // your code goes here
};

// Factorialize a Number
const factorialize = function (num) {
  // your code goes here
};

/*
Calculate the sum of two integers a and b, but you are not allowed to use the operator + and -. Example: Given a = 1 and b = 2, return 3.
*/
const getSum = function (a, b) {    
  // your code goes here
};

/*
Given an array of integers, return indices of the two numbers such that they add up to a specific target. You may assume that each input would have exactly one solution. Example: Given arr = [2, 7, 11, 15], target = 9,
Because arr[0] + arr[1] = 2 + 7 = 9, return [0, 1].
*/
const twoSum = function (arr, tgt) {
  // your code goes here
};

/*
Given an array of integers, every element appears twice except for one. Find that single one.

Note:
Your algorithm should have a linear runtime complexity. Could you implement it without using extra memory?
*/
const singleNumber = function (arr) {
  // your code goes here
};

//it should take a string and repeat it a number of times
const repeat = function (str, count) {
  // your code goes here
};

/*
  Test if a string has all unique characters
  Return a boolean value 
*/

const isUnique = function (s) {
  // your code goes here
};

/*
  Test if a string is a palindrome
  Return a boolean value 
*/

const isPalindrome = function (s) {
  // your code goes here
};

/*
  Test if string 2 is a permutation of string 1
  Return a boolean value 
*/

const isPermutation = function (s1, s2) {
  // your code goes here
};

/*
  Test if a string has a permutation which is a palindrome
  Return a boolean value 
*/

const hasPalindromePermutation = function (str) {
  // your code goes here
};

/*
  Given an array with sub-arrays, all of which hold numbers, return the sum
  of all the numbers in the array  
*/

const arraySum = function (arr) {
  // your code goes here
};

/*
*/

const allPermutations = function (s) {
  // body...
  var results = [];
  var recurser = function (combo, rest) {
    if(rest.length === 0) {results.push(combo); return;}
    for(var i = 0; i < rest.length; i++) {
      recurser(combo + rest[i], rest.slice(0,i).concat(rest.slice(i+1)))
    }
  }
  recurser("", s);
  console.log(results);
  return results;
}