// Installed npm packages: jquery underscore request express
// jade shelljs passport http sys lodash async mocha chai sinon
// sinon-chai moment connect validator restify ejs ws co when
// helmet wrench brain mustache should backbone forever debug jsdom

const assert = require('assert');
const util = require('util');
const _ = require('underscore');

// var evens = _.reject([1, 2, 3, 4, 5, 6], (num) => num % 2 != 0);

// /**
//  * Problem N
//  * 2018--
//  *
//  *
//  */
// const problemN = new Problem(
//     "Problem N",
//     [
//         {input: [], expected: undefined}
//     ]);
//
// (() => {
//     // problemN.test(undefined, "");
// })();
//
// // -----------------------------------------------------------------------------
//
// (() => {
//     // problemN.test(undefined, "");
// })();

class Problem {
    /**
     * Creates a new testable problem.
     *
     * @param   name    The problem's name.
     * @param   tests   The tests to perform on solutions.
     * @param   enabled true if testing is enabled; false otherwise.
     */
    constructor(name, tests, enabled = true) {
        this.name = name;
        this.tests = tests;
        this.enabled = enabled;
    }

    /**
     * Tests a solution to the problem.
     *
     * @param   callback    The function for the solution.
     * @param   name        The solution's name. Default is the callback's name.
     * @param   printStack  If the stack trace of any exceptions should be
     *                      printed.
     */
    test(callback, name, printStack = false) {
        if (!this.enabled)
            return;

        name = (typeof name !== "undefined") ? name : callback.name;
        let failed = 0;

        for (let t of this.tests) {
            try {
                // Lambda to preserve "this" context. Deep copy to prevent callbacks from mutating each other's args.
                assert.deepStrictEqual((() => callback.apply(this, Problem.deepCopy(t.input)))(), t.expected);
            } catch (e) {
                ++failed;
                console.error(`[${this.name}] ${name}`);
                console.error(`    Input: ${Problem.inspect(t.input)}`);
                console.error(`    Expected: ${Problem.inspect(t.expected)}`);

                if (e instanceof assert.AssertionError) {
                    console.error(`    Actual: ${Problem.inspect(e.actual)}`);
                } else if (printStack){
                    console.error(Problem.indent(e.stack));
                } else {
                    console.error(`    ${e.name}: ${e.message}`);
                }
            }
        }

        if (failed)
            console.error(`[${this.name}] ${name} - Failed ${failed} out of ${this.tests.length} tests.`);
        else
            console.log(`[${this.name}] ${name} - Passed all tests!`);
    }

    /**
     * Performs a deep copy on an object.
     *
     * @param   obj     The object to copy.
     * @returns         A copy of the object.
     */
    static deepCopy(obj) {
        let output, v, key;
        output = Array.isArray(obj) ? [] : {};

        for (key in obj) {
            v = obj[key];
            output[key] = (typeof v === "object") ? this.deepCopy(v) : v;
        }

        return output;
    }

    /**
     * Indents every line of a string with spaces.
     *
     * @param   str     The string to indent.
     * @param   size    The amount of chars by which to indent.
     * @returns         The indented string.
     */
    static indent(str, size = 4) {
        return str.replace(/^(?!\s*$)/mg, " ".repeat(size));
    }

    /**
     * Gets a string representation of an object.
     *
     * Determines if the string contains multiple lines. If it does, a newline
     * is prepended and every line is indented.
     *
     * @param   obj     The string to check.
     * @returns         The string representation of the object.
     */
    static inspect(obj) {
        const str = util.inspect(obj, false, null);

        for (let count = -1, index = 0; index !== -1; count++, index = str.indexOf('\n', index + 1))
            if (count > 1)
                return this.indent("\n" + str, 8);

        return str;
    }
}

/**
 * Problem 1
 *
 * Determine if a string has all unique characters.
 */
const problem1 = new Problem("Problem 1", [
    {input: ["abcd"], expected: true},
    {input: ["abca"], expected: false}], false);

(() => {
    function isUnique2(string) {
        let mySet = new Set();
        for (let char of string) {
            if (mySet.has(char)) return false;
            else mySet.add(char);
            // made a boo boo -- not sure how to check if set has duplicate
            // I see
        }
        return true;
    }

    problem1.test(isUnique2);
})();

/**
 * Problem 2
 * 2018-04-25
 *
 * Determine if 2 strings are a permutation each other.
 */
const problem2 = new Problem(
    "Problem 2",
    [
        {input: ["abcda", "aadcb"], expected: true},
        {input: ["abcda", "aadcba"], expected: false},
        {input: ["abca", "aadcba"], expected: false}
    ], false);

(() => {
    function perm(str1, str2) {
        let map = new Map();

        if (str1.length !== str2.length)
            return false;

        // Create a map of characters and how many times they appear in the string.
        for (let i = 0; i < str1.length; ++i) {
            let c = str1.charAt(i);

            // Increment the value in the map i.e. 1 more char seen.
            // TODO: Could call get() and check if it's undefined instead of using has();
            if (map.has(c)) {
                let val = map.get(c);
                map.set(c, ++val);
            } else {
                map.set(c, 1);
            }
        }

        for (let i = 0; i < str2.length; ++i) {
            let c = str2.charAt(i);
            let count = map.get(c);

            // Either the first string doesn't have this char, or there are no more "spots" for this char.
            if (typeof count == "undefined" || count === 0) {
                return false;
            }

            map.set(c, --count);
        }

        return true;
    }

    problem2.test(perm, "Mark");
})();

// -----------------------------------------------------------------------------

(() => {
    function perm2(str1, str2) {
        if (str1.length !== str2.length) return false;

        var dict = {};

        for (var i = 0; i < str1.length; i++) {
            var charStr1 = str1[i];
            var charStr2 = str2[i];

            if (dict.hasOwnProperty(charStr1)) {
                dict[charStr1] = dict[charStr1]++;
            } else {
                dict[charStr1] = 0;
            }

            if (dict.hasOwnProperty(charStr2)) {
                dict[charStr2] = dict[charStr2]--;
            } else {
                dict[charStr2] = 0;
            }
        }

        for (var key in dict) {
            if (dict[key] != 0) return false;
        }

        return true;
    }

    problem2.test(perm2, "Anonpunk");
})();

/**
 * Problem 3
 * 2018-04-25
 *
 * A rat has to follow a path that will give it the most cheese. It follows a
 * path until there's no cheese left ahead. It starts at the most optimal
 * centre. It cannot move diagonally.
 *
 * Create a function which returns the total cheese eaten from following the
 * correct path.
 *
 * Correct path: 7 -> 8 -> 7 -> 5 (27 total)
 */
const maze = [
    [5, 7, 8, 4, 3],
    [0, 0, 7, 0, 2],
    [4, 6, 3, 4, 9],
    [3, 1, 0, 5, 9]
];

const problem3 = new Problem(
    "Problem 3",
    [{input: [maze], expected: 27}], false);

(() => {
    let matrix;

    // Gets the optimal centre position of a array.
    function getCentreX(array) {
        const len = array.length;

        if (len % 2 === 0) {
            const secondI = len / 2;
            const second = array[secondI];

            const firstI = secondI - 1;
            const first = array[firstI];

            if (first > second)
                return firstI;

            return secondI;
        }

        return (len - 1) / 2;
    }

    // Gets the optimal centre position of a 2D array.
    function getCentre(array) {
        const len = array.length;

        if (len % 2 === 0) {
            const secondI = len / 2;
            const second = array[secondI];

            const firstI = secondI - 1;
            const first = array[firstI];

            const fCentreX = getCentreX(first);
            const sCentreX = getCentreX(second);

            if (first[fCentreX] > second[sCentreX])
                return { x: fCentreX, y: firstI };

            return { x: sCentreX, y: secondI }
        }

        const centreY = (len - 1) / 2;

        return { x: getCentreX(array[centreY]), y: centreY };
    }

    // Gets the value at the given position.
    function getValue(pos) {
        try {
            return matrix[pos.y][pos.x];
        } catch(e) {
            return undefined;
        }
    }

    function isBad(val) {
        return typeof val === "undefined" || val === null || Number.isNaN(val);
    }

    // Determines the most optimal position to move to.
    function getNext(pos) {
        let moves = [];

        const up = { x: pos.x, y: pos.y + 1 };
        up.value = getValue(up);
        moves.push(up);

        const down = { x: pos.x, y: pos.y - 1 };
        down.value = getValue(down);
        moves.push(down);

        const left = { x: pos.x - 1, y: pos.y };
        left.value = getValue(left);
        moves.push(left);

        const right = { x: pos.x + 1, y: pos.y };
        right.value = getValue(right);
        moves.push(right);

        moves.sort(function(a, b) {
            // console.log(a.value + ", " + b.value);

            if (a.value === b.value)
                return 0;

            if (isBad(a.value))
                return 1;

            if (isBad(b.value))
                return -1;

            return b.value - a.value;
        }); // Ascending order sort by value.

        // Set previous position to undefined.
        try {
            matrix[pos.y][pos.x] = undefined;
        } catch (e) {
            // do nothing?
        }

        return moves[0];
    }

    function play(m) {
        matrix = m;
        let cheese = 0;
        let currentPos = getCentre(matrix);
        currentPos.value = getValue(currentPos);

        do {
            cheese += currentPos.value;
            currentPos = getNext(currentPos);
        } while (typeof currentPos.value !== "undefined" && currentPos.value !== 0);

        return cheese;
    }

    problem3.test(play, "Mark");
})();

// -----------------------------------------------------------------------------

(() => {
    function getCenter(matrix) {
        var height = matrix.length -1;
        var width = matrix[0].length -1;

        // var heightEven = false;
        // var widthEven = false;
        // if(height % 2 === 0) heightEven = true;
        // if(width % 2 === 0) widthEven = true;

        // if(heightEven && widthEven) {

        // }

        var a = Math.floor(height/2);
        var b = Math.floor(width/2);
        // console.log(height, width, getValueAtCoord({x: width, y: height}, matrix));
        // console.log(a, b, getValueAtCoord({x: b, y: a}, matrix));

        return {
            x: b,
            y: a
        }

    }


    function getSurrondings(p, matrix) {
        var dict = {};

        function checkUp() {
            //decrease row
            //bound min 0
            if(p.y > 0) {
                valCellAbove = matrix[p.y - 1][p.x];
                dict[valCellAbove] = {x: p.x, y: p.y - 1};
            }
        }

        function checkRight() {
            //increase col
            //bound max = matrix[0].length - 1
            if(p.x < matrix[0].length -1) {
                valCellRight = matrix[p.y][p.x + 1];
                dict[valCellRight] = {x: p.x + 1, y: p.y};
            }
        }

        function checkDown() {
            //increase row
            // bound max = matrix.length - 1
            if(p.y < matrix.length -1) {
                valCellDown = matrix[p.y + 1][p.x];
                dict[valCellDown] = {x: p.x, y: p.y + 1};
            }
        }

        function checkLeft() {
            //decrease col
            //bound = 0
            if(p.x > 0) {
                valCellLeft = matrix[p.y][p.x - 1];
                dict[valCellLeft] = {x: p.x - 1, y: p.y};
            }
        }

        checkUp();
        checkRight();
        checkDown();
        checkLeft();

        return dict;
    }

    function getMaxCoord(coordDict) {
        let maxVal = Math.max(...Object.keys(coordDict).map(numStr => Number(numStr)));
        return coordDict[maxVal]
    }

    function getValueAtCoord(p, matrix) {
        console.log(p, matrix);
        return matrix[p.y][p.x];
    }

    function setPreviousCellToZero(p, matrix) {
        matrix[p.y][p.x] = 0;
    }


    // check if we are at a place where rat can't move further
    function checkForWhenToStop(coordDict) {
        var sum = 0;
        var vals = Object.keys(coordDict).map(k => Number(k));

        for (var i = 0; i < vals.length; i++) {
            sum += vals[i];
        }

        return sum === 0;
    }

    //  -------------- RECURSER

    // Let the mouse loose
    var score = 0;

    function play(startingCoord, matrix) {
        // add curr value to score
        var val = matrix[startingCoord.y][startingCoord.x]
        score = score + val;

        // get coordinates and values for neighboring cells
        var surroundings = getSurrondings(startingCoord, matrix);
        // check if the rat can't move forward anymore // if true exit out of the recurser
        if(checkForWhenToStop(surroundings, matrix, startingCoord)) return;
        else {
            // check next best cell to move to
            var nextBestCellCoords = getMaxCoord(surroundings);
            // set previous cell to zero
            setPreviousCellToZero(startingCoord, matrix);
            // recurse using the new coord;
            play(nextBestCellCoords, matrix);
        }
    }

    problem3.test(
        (matrix) => {
            play(getCenter(matrix), matrix);
            return score;
        },
        "Anonpunk");
})();

/**
 * Problem 4
 * 2018-04-26
 *
 * Given a string, check if it's a permutation of a palindrome. A palindrome is
 * a phrase that is the same forward as it is reversed e.g. "racecar".
 */
const problem4 = new Problem(
    "Problem 4",
    [
        {input: ["tact coa"], expected: true},
        {input: ["tactcooa"], expected: true},
        {input: ["tactcooabbbe"], expected: false},
        {input: ["aabbccddee"], expected: true},
        {input: ["aabbcddee"], expected: true},
        {input: ["aabfghddee"], expected: false},
        {input: ["aabfgddee"], expected: false},
        {input: ["aabfddee"], expected: false},
        {input: ["aabddee"], expected: true},
        {input: ["Are we not pure? “No sir!” Panama’s moody Noriega brags. “It is garbage!” Irony dooms a man; a prisoner up to new era."], expected: true},
        {input: ["Barge in! Relate mere war of 1991 for a were-metal Ernie grab!"], expected: true}
    ], false);

(() => {
    function palindromePermute(str) {
        var dict = {},
            total = 0,
            cleanStr = str.replace(/[^a-zA-Z]/g, '');

        for (var i = 0; i < cleanStr.length; i++) {
            var currLetter = cleanStr[i];

            if (dict.hasOwnProperty(currLetter)) dict[currLetter] += 1;
            else dict[currLetter] = 1;

        }

        for (var key in dict) {
            total += dict[key] % 2;
        }

        return cleanStr.length % 2 === 0 ? (total === 0) : (total === 1);
    }

    problem4.test(palindromePermute, "Anonpunk");
})();

// -----------------------------------------------------------------------------

(() => {
    function isPalindromePermutation(str) {
        const map = new Map();
        str = str.toLowerCase().replace(/[^0-9a-z]/gi, ""); // Removes non-alpha chars.

        // Create a character frequency map.
        for (let i = 0; i < str.length; ++i) {
            const c = str.charAt(i);

            // Increment the char's count. If it doesn't exist, set to 1.
            map.has(c) ? map.set(c, map.get(c) + 1) : map.set(c, 1);
        }

        // String has an odd amount of characters.
        if (str.length % 2 !== 0) {
            const oddKey = [...map.keys()].find(k => map.get(k) % 2 !== 0);

            map.delete(oddKey);
        }

        // Check if all of the map's values are even.
        return [...map.values()].every(val => val % 2 === 0);
    }

    problem4.test(isPalindromePermutation, "Mark");
})();

/**
 * Problem 5
 * 2018-04-26
 *
 * Determine if two strings differ by one edit or less. An edit is an insertion,
 * deletion, or replacement of one character.
 */
const problem5 = new Problem(
    "Problem 5",
    [
        {input: ["pale", "ple"], expected: true},
        {input: ["pale", "pale"], expected: true},
        {input: ["pales", "pale"], expected: true},
        {input: ["pale", "bale"], expected: true},
        {input: ["pale", "bake"], expected: false},
        {input: ["pale", "epal"], expected: false},
        {input: ["pale", "plb"], expected: false},
    ], false);

(() => {
    function editAway(s1, s2) {
        if(Math.abs(s1.length - s2.length) > 1) return false;
        var longer, shorter, editCount = 0, j = 0;

        if (s1.length > s2.length || s1.length == s2.length) {
            longer = s1;
            shorter = s2;
        } else {
            longer = s2;
            shorter = s1;
        }

        for(var i = 0; i < longer.length; i++) {
            if(longer[i] !== shorter[j]) {
                editCount++;
                if(editCount > 1) return false;
                if(longer.length === shorter.length) {j++}
            } else {
                j++;
            }
        }
        return true;
    }

    problem5.test(editAway, "Anonpunk");
})();

// -----------------------------------------------------------------------------

(() => {
    function isOneEditAway(str1, str2) {
        // Length differs by more than 1.
        const lenDiff = Math.abs(str1.length - str2.length);

        if (lenDiff > 1)
            return false;

        if (lenDiff === 0) {
            // For a given index, true if the chars at that index are the same;
            // false otherwise.
            const arr = [];

            for (let i = 0; i < str2.length; ++i) {
                arr.push(str1.charAt(i) === str2.charAt(i));
            }

            // Checks if one or less occurrences of false.
            return arr.reduce((acc, val) => acc + (val === false), 0) <= 1;
        }

        if (str1.length > str2.length) {
            const temp = str1;
            str1 = str2;
            str2 = temp;
        }

        let edits = 0;

        for (let i = 0; i < str2.length; ++i) {
            const c1 = str1.charAt(i);

            // Unequal
            // c1 is not out of bounds (not one insertion away).
            // The next character in the longer string does not equal c1 (not one deletion away).
            if (c1 !==  str2.charAt(i) && c1 && c1 !== str2.charAt(i + 1)) {
                ++edits;
            }
        }

        return edits <= 1;
    }

    problem5.test(isOneEditAway, "Mark");
})();

/**
 * Problem 6
 * 2018-04-25
 *
 * Compress a string. If the compressed string is not smaller than original
 * string, return the original string. Assume the string has only lower &
 * upper-case letters. Letters differing by case are considered distinct.
 */
const problem6 = new Problem(
    "Problem 6",
    [
        {input: ["aabcccccaaa"], expected: "a2b1c5a3"},
        {input: ["helloworld"], expected: "helloworld"},
        {input: ["zzzzoozzllllfffffeeff"], expected: "z4o2z2l4f5e2f2"},
        {input: ["aaAAaabBbb"], expected: "aaAAaabBbb"},
        {input: ["a"], expected: "a"},
        {input: [""], expected: ""},
        {input: ["aa"], expected: "aa"}
    ], false);

(() => {
    function compress(str) {
        let output = "";
        let prevChar = "";
        let count = 1;

        for (let i = 0; i < str.length; ++i) {
            const c = str.charAt(i);

            if (!prevChar) { // Initialisation.
                prevChar = c;
            } else if (c === prevChar) { // Same as previous; increments counter.
                ++count;
            } else { // New char. Builds and appends string for previous char sequence.
                output += prevChar + count;
                prevChar = c;
                count = 1;
            }
        }

        output += prevChar + count; // Appends the final char sequence.

        // Returns the original string if it's shorter.
        return output.length < str.length ? output : str;
    }

    problem6.test(compress, "Mark");
})();

// -----------------------------------------------------------------------------

(() => {

    function stringCompression(str) {
        var newStr = "";
        var startIndex = 0;
        //if(!str.length) return null;

        for(var i = 0; i < str.length; i++) {
            var currLetter = str[i];
            if(str[i+1] !== currLetter) {
                newStr += currLetter + (i+1 - startIndex);
                startIndex = i+1;
            }
        }
        return newStr.length >= str.length? str: newStr;
    }
    problem6.test(stringCompression, "Anonpunk");
})();

/**
 * Problem 7
 * 2018-04-26
 *
 * Rotate a matrix 90° in place.
 */
const image = [
    ["a", "b", "c", "d"],
    ["e", "f", "g", "h"],
    ['i', 'j', 'k', 'l'],
    ["m", "n", "o", "p"]
];

const imageRotated = [
    ["m", "i", "e", "a"],
    ["n", "j", "f", "b"],
    ['o', 'k', 'g', 'c'],
    ["p", 'l', 'h', 'd']
];

const problem7 = new Problem(
    "Problem 7",
    [
        {input: [image], expected: imageRotated}
    ], false);

(() => {
    function rotate(matrix) {
        let out = [[], [], [], []];
        for (let y = 0; y < matrix.length; ++y) {
            for (let a = 0, b = matrix.length - 1; a < matrix.length; ++a, --b) {
                out[y][a] = matrix[b][y];
            }
        }
        return out;
    }

    problem7.test(rotate, "Mark");
})();

// -----------------------------------------------------------------------------

(() => {
    // problem7.test(undefined, "");
})();

/**
 * Problem 8
 * 2018-04-26
 *
 * Given an array of integers, every element appears twice except for one.
 * Find that single one.
 */
const problem8 = new Problem(
    "Problem 8",
    [
        {input: [[2, 3, 2, 4, 4, 5, 8, 8, 5]], expected: 3},
        {input: [[5, 1, 1, 2, 7, 7, 2, 3, 3, 8, 5]], expected: 8},
        {input: [[13, 13, 49]], expected: 49}
    ], false);

(() => {
    function findSingle(arr) {
        let frequencies = [];
        for (let i = 0; i < arr.length; ++i) {
            const num = arr[i];
            if (typeof frequencies[num] === "undefined")
                frequencies[num] = 1;
            else
                ++frequencies[num];
        }
        return frequencies.findIndex((e) => e === 1);
    }

    problem8.test(findSingle, "Mark");
})();

// -----------------------------------------------------------------------------

(() => {
    function singleNumber(nums) {
        var myObj = {};
        var num;
        for(var i = 0; i < nums.length; i++) {
            if(myObj[nums[i]]) delete myObj[nums[i]];
            else myObj[nums[i]] = 1;
        }
        return Number(Object.keys(myObj)[0]);
    }
    problem8.test(singleNumber, "Anonpunk");

})();
/**
 * Problem 9
 * 2018-04-30
 *
 * Write an algorithm such that if an element in an MxN matrix is 0, its  entire
 * row and column are set to 0.
 */
const problem9 = new Problem(
    "Problem 9",
    [
        {
            input: [[
                [93, 432, 0],
                [77, 231, 3],
                [113, 932, 3894]
            ]],
            expected: [
                [0, 0, 0],
                [77, 231, 0],
                [113, 932, 0]
            ]
        },
        {
            input: [[
                [11, 90, 12, 13],
                [95, 32, 0, 3],
                [21, 55, 38, 84]
            ]],
            expected: [
                [11, 90, 0, 13],
                [0, 0, 0, 0],
                [21, 55, 0, 84]
            ]
        },
        {
            input: [[
                [1, 0, 1, 0, 1],
                [1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1],
                [1, 1, 1, 0, 1]
            ]],
            expected: [
                [0, 0, 0, 0, 0],
                [1, 0, 1, 0, 1],
                [1, 0, 1, 0, 1],
                [0, 0, 0, 0, 0]
            ]
        }
    ], false);

(() => {
    function setZero(matrix) {
        const cols = new Set(); // Columns indexes which should be zeroed.

        for (const row of matrix) {
            let hasZero = false;

            for (const [x, col] of row.entries()) {
                if (col === 0) {
                    hasZero = true; // Mark the row to be filled with zeros.
                    cols.add(x); // Added to set of columns which should be zeroed.
                }

                /*if (cols.has(x))
                    col = 0; // Sets the column to 0.*/
            }

            if (hasZero)
                row.fill(0); // Sets the whole row to 0.
        }

        // Loops again because there could be earlier rows that need to have
        // columns set to 0.
        for (const row of matrix) {
            for (const [x, col] of row.entries()) {
                if (cols.has(x))
                    row[x] = 0; // Sets the column to 0.
            }
        }

        return matrix;
    }

    problem9.test(setZero, "Mark");
})();

// -----------------------------------------------------------------------------

(() => {
    const printMatrix = matrix => {
        for(let i = 0; i < matrix.length; i++) {
            let row = ""

            for (let j = 0; j < matrix[0].length; j++) {
                let currCell = matrix[i][j];
                if (j === 0) row += ' | ';
                row += currCell + ' | ';
                if (j === matrix[0].length - 1) row += "\n"
            }

            console.log(row);
        }
    }

    const checkNumber = (num, currCell) => num === currCell;

    const setZero = (matrix, num) => {
        var ignoreRow = [];
        var ignoreCol = [];
        printMatrix(matrix);

        console.log(' ---------------')

        for(let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                let currCell = matrix[i][j];
                if ((!ignoreRow.includes(i) || !ignoreCol.includes(j)) && checkNumber(currCell, 0)) {
                    ignoreRow.push(i);
                    ignoreCol.push(j);
                }
            }
        }

        for(let k = 0; k < matrix.length; k++) {
            for (let l = 0; l < matrix[0].length; l++) {
                let currCell = matrix[k][l];
                if(ignoreRow.includes(k)) matrix[k][l] = 0;
                if(ignoreCol.includes(l)) matrix[k][l] = 0;
            }
        }

        return matrix;
    }

    problem9.test(setZero, "Anon");
})();

/**
 * Problem 10
 * 2018-05-02
 *
 * Write code to remove duplicates for a singly linked list.
 */
(() => {
    class Node {
        constructor(data) {
            this.next = null;
            this.data = data;
        }
    }

    /**
     * A singly-linked list.
     */
    class LinkedList {
        /**
         * Constructs the container with the contents of the given array.
         *
         * @param {T[]} values  An array with the contents from which to construct
         *                      the container.
         */
        constructor(values) {
            this.head = null;
            this.tail = null;
            this._size = 0;

            if (typeof values !== "undefined")
                for (const val of values)
                    this.push_back(val);
        }

        /**
         * Returns the number of elements.
         */
        get size() {
            return this._size;
        }

        /**
         * Adds an element to the end.
         *
         * @param   {T} value   The element to add.
         */
        push_back(value) {
            const nodeNew = new Node(value);

            if (this._size === 0)
                this.head = nodeNew;
            else
                this.tail.next = nodeNew;

            this.tail = nodeNew;
            ++this._size;
        }

        /**
         * Removes the last element.
         *
         * @returns {T}     The removed element.
         */
        pop_front() {
            const out = this.head.data;
            const next = this.head.next;

            if (next === null) {
                this.head = null;
                this.tail = null;
            } else {
                this.head = next;
            }

            --this._size;
            return out;
        }

        /**
         * Determines if the container contains an element with the given value.
         *
         * @param   {T} value   The value to search for.
         * @returns {boolean}   <code>true</code> if the value was found;
         *                      <code>false</code> otherwise.
         */
        contains(value) {
            for (const e of this)
                if (e === value)
                    return true;

            return false;
        }

        /**
         * Removes duplicate elements. Only the first element of the equal elements
         * remains.
         */
        unique() {
            const set = new Set();

            for (const e of this) {
                set.add(e);
            }

            const list = new LinkedList(set);
            this.head = list.head;
        }

        *[Symbol.iterator]() {
            for (let node = this.head; node !== null; node = node.next) {
                yield node.data;
            }
        }
    }

    function test(values) {
        const list = new LinkedList(values);

        if (values.length != list.size)
            throw new Error("Element count mismatch.");

        let i = 0;

        for (let e of list) {
            if (e !== values[i])
                throw new Error("Content mismatch.");

            ++i;
        }

        if (!list.contains(values[values.length - 1]))
            throw new Error("Contains assertion failed.");

        list.unique();
        const unique = values.filter((val, idx, arr) => arr.indexOf(val) === idx);

        if (values.length != list.size)
            throw new Error("Unique element count mismatch.");

        let j = 0;

        for (let e of list) {
            if (e !== unique[j])
                throw new Error("Unique content mismatch.");

            ++j;
        }
    }

    /*test([1, 7, 3, 42, 9, 3, 1, 93, 9, 6, 3]);
    test([1, 1, 1, 2, 1, 0, 2]);
    test(["a", "b", "c", "d", "e"]);
    test(["a", "b", "c", "car", "atom", "c"]);

    console.log("[Problem 10] Mark - Passed all tests!");*/
})();

// -----------------------------------------------------------------------------

(() => {
    const Node = val => ({ value: val, next: null });

    const LinkedList = () => {
        var list = {};
        list.head = null;
        list.tail = null;


        list.addToTail = (val) => {
            let newTail = Node(val);
            if (!list.head) {
                list.head = list.tail = newTail;
            } else {
                list.tail.next = newTail;
                list.tail = newTail;
            }
        };

        list.removeHead = () => {
            let oldHead = list.head;
            let newHead = list.head.next;

            list.head = newHead;
            return oldHead.value;
        };

        list.returnHeadNode = () => list.head;

        list.contains = (tgt) => {
            let node = list.head;

            while (node) {
                if (node.value === tgt) return true;
                else {
                    node = node.next;
                }
            }
            return false;
        };

        return list;
    };

    // check if value of current node is in dict
    // no?
    //  add to dict
    //  set prev pointer to current node
    //  move node pointer to currentNode.next
    // yes?
    // do not reset previous pointer
    // set prevoius pointer's next node to currentNode.next
    // move node pointer to currNode.next
    // prevNode = node;
    const removeDuplicates = (headNode) => {
        let dict = {};
        let returnNode = headNode;
        let prevNode = null;
        let currNode = headNode;

        while (currNode) {

            if (dict[currNode.value]) {
                prevNode.next = currNode.next;
            } else {
                dict[currNode.value] = true;
                prevNode = currNode;
            }
            currNode = currNode.next;
        }

        return returnNode;
    };

    function test() {
        let myList = LinkedList();
        myList.addToTail("F");
        myList.addToTail("O");
        myList.addToTail("L");
        myList.addToTail("L");
        myList.addToTail("O");
        myList.addToTail("W");
        myList.addToTail("U");
        myList.addToTail("P");
        myList.addToTail("P");
        myList.addToTail("P");
        myList.addToTail("P");
        console.log(myList.head);

        console.log(myList.contains("W"));
        console.log(myList.contains("E"));
        // console.log(myList.removeHead());
        // console.log(myList.removeHead());
        var x = myList.returnHeadNode();

        console.log(JSON.stringify(removeDuplicates(x), 0, 2));
    }

    // test();
})();

/**
 * Problem 11
 * 2018-05-03
 *
 * Return kth to last element of a singly linked list.
 */
const problem11 = new Problem(
    "Problem 11",
    [
        {
            input: [[1, 7, 3, 42, 9, 3, 1, 93, 9, 6, 3], 3],
            expected: 9
        },
        {
            input: [[1, 1, 1, 2, 1, 0, 2], 2],
            expected: 0
        },
        {
            input: [["a", "b", "c", "d", "e"], 4],
            expected: "b"
        },
        {
            input: [["a", "b", "c", "car", "atom", "c"], 6],
            expected: "a"
        }
    ], false);

(() => {
    class Node {
        constructor(data) {
            this.next = null;
            this.data = data;
        }
    }
    /**
     * A singly-linked list.
     */
    class LinkedList {
        /**
         * Constructs the container with the contents of the given array.
         *
         * @param {T[]} values  An array with the contents from which to construct
         *                      the container.
         */
        constructor(values) {
            this.head = null;
            this.tail = null;
            this._size = 0;
            if (typeof values !== "undefined")
                for (const val of values)
                    this.push_back(val);
        }
        /**
         * Returns the number of elements.
         */
        get size() {
            return this._size;
        }
        /**
         * Adds an element to the end.
         *
         * @param   {T} value   The element to add.
         */
        push_back(value) {
            const nodeNew = new Node(value);
            if (this._size === 0)
                this.head = nodeNew;
            else
                this.tail.next = nodeNew;
            this.tail = nodeNew;
            ++this._size;
        }
        /**
         * Removes the last element.
         *
         * @returns {T}     The removed element.
         */
        pop_front() {
            const out = this.head.data;
            const next = this.head.next;
            if (next === null) {
                this.head = null;
                this.tail = null;
            }
            else {
                this.head = next;
            }
            --this._size;
            return out;
        }
        /**
         * Determines if the container contains an element with the given value.
         *
         * @param   {T} value   The value to search for.
         * @returns {boolean}   <code>true</code> if the value was found;
         *                      <code>false</code> otherwise.
         */
        contains(value) {
            for (const e of this)
                if (e === value)
                    return true;
            return false;
        }

        *[Symbol.iterator]() {
            for (let node = this.head; node !== null; node = node.next) {
                yield node.data;
            }
        }
    }

    function getNthLast(values, n) {
        const list = new LinkedList(values);
        let i = 0;
        let target = list.size - n;

        for (const e of list) {
            if (i == target)
                return e;

            ++i;
        }

        return null;
    }

    function getN2thLast(n) {
        let node1 = undefined;
        let node2 = undefined;

        for (let node = this.head, i = 0; node !== null; node = node.next, ++i) {
            if (i === 0)
                node1 = node;

            if (i === n) {

                node2 = node;
            }

            if (node2 === null)
                return node1.value;
        }
    }

    problem11.test(getNthLast, "Mark");
})();

// -----------------------------------------------------------------------------

(() => {
      const returnKthToLastElement = (k, head) => {
          let count = 0;
          let chaser = null;
          let node = head;

          while (node.next) {
            node = node.next

            if (count === k)
                chaser = head;

            if (chaser)
                chaser = chaser.next;

            count++;
          }

          return chaser.value;
    }

    // console.log('>>>', returnKthToLastElement(2, x));
})();

/**
 * Problem 12
 * 2018-05-03
 *
 * Delete a node from the middle of a singly-linked list.
 */
(() => {
    function remove(node) {
        node.data = node.next.data;
        node.next = node.next.next;
    }
})();

// -----------------------------------------------------------------------------

(() => {
    var list = {
      value: 'a',
      next: {
        value: 'b',
        next: {
          value: 'c',
          next: {
            value: 'd',
            next: {
              value: 'e',
              next: null
            }
          }
        }
      }
    }

    function remove() {
        console.log(list.next.next);
        nodeToDelete = list.next.next;
        deleteNode(nodeToDelete);

        console.log(JSON.stringify(list, 0, 2));
    }

    // remove();
})();

/**
 * Problem 13
 * 2018-05-03
 *
 * Determine if a singly-linked list is cyclical. If it is, find which node
 * is cyclical.
 */
(() => {
    /*isCyclical() {
        return this.tail.next !== null;
    }

    getCyclicalNode() {
        return this.tail.next;
    }

    public getCyclicalNode() {
        let set: Set = new Set();

        for (let node = this.head; node !== null; set.add(node), node = node.next) {
            if (set.has(node))
                return node;
        }

        return null;
    }

    test(["A", "B", "B", "C", "D", "E", "F", "H"]);

    constructor(values?: T[] | Set<T>) { // TODO: Make it accept any iterable type.
        if (typeof values === "undefined")
            return;

        let i: number = 0;
        let cyclical: Node<T> = null;

        for (const val of values) { // loops input array
            const node: Node<T> = this.push_back(val); // add node and save it

            if (i == 2) {
                cyclical = node;
            }

            ++i;
        }

        this.tail.next = cyclical;
    }*/
})();

// -----------------------------------------------------------------------------

(() => {
    var node7 = {value: 'g', next: null}
    var node6 = {value: 'f', next: node7}
    var node5 = {value: 'e', next: node6}
    var node4 = {value: 'd', next: node5}
    var node3 = {value: 'c', next: node4}
    var node2 = {value: 'b', next: node3}
    var node1 = {value: 'a', next: node2}

    node7.next = node3;

    const loopDetector = headNode => {
        let runner = headNode.next;
        let chaser = headNode;

        while (headNode.next) {
            if (runner === chaser)
                return true;
            else {
                runner = runner.next.next;
                chaser = chaser.next;
            }
        }

        return false;
    };

    // console.log('>>>', loopDetector(node1));

    const loopDetector2 = headNode => {
        let runner = headNode.next;
        let chaser = headNode;
        let isCyclical = true;

        let myMap = new Map();

        /*while (headNode.next) {
            if (runner === chaser) {
                // console.log(myArr);
                isCyclical = true;
                // chaser === runner;
                break;
            }
            else {
                myMap.set(chaser, true);
                runner = runner.next.next;
                chaser = chaser.next;
            }
        }

        isCyclical = false;*/

        // if (isCyclical) {
        while (true) {
            if (myMap.has(chaser))
                return chaser;
            else {
                myMap.set(chaser, chaser);
                chaser = chaser.next;
            }
        }

        return null;
    };

    // console.log('>>>', loopDetector2(node1));
})();

/**
 * Problem 14
 * 2018-05-04
 *
 * Determine if two singly-linked list intersect. Return the intersecting node.
 */
(() => {
    class Node {
        constructor(data) {
            this.next = null;
            this.data = data;
        }
    }

    function test() {
        // Simulates singly-linked lists for the test..
        const head1 = new Node(1);
        head1.next = new Node(2);
        head1.next.next = new Node(3);
        head1.next.next.next = new Node(4);

        const head2 = new Node(99);
        head2.next = new Node(98);
        head2.next.next = new Node(97);
        head2.next.next.next = head1.next.next; // Intersection.
        // head2.next.next.next = new Node<number>(96);
        // head2.next.next.next.next = new Node<number>(95);

        // Start of actual algorithm.
        let node1 = head1; // Node used for traversing the 1st list.
        let node2 = head2; // Node used for traversing the 2nd list.
        let prevEnd1 = false; // Previous iteration reached the end of the 1st list.
        let prevEnd2 = false; // Previous iteration reached the end of the 2nd list.

        while (true) {
            if (prevEnd1 && prevEnd2)
                return null; // Full cycle complete. Both lists at their heads so no intersect was found.

            if (node1 === node2)
                return node1; // Found an intersection!

            if (node1.next) { // Advances the node to the next one.
                node1 = node1.next;
                prevEnd1 = false;
            } else { // If there is no next, goes back to the head.
                node1 = head1;
                prevEnd1 = true;
            }

            if (node2.next) {
                node2 = node2.next;
                prevEnd2 = false;
            } else {
                node2 = head2;
                prevEnd2 = true;
            }
        }
    }

    // console.log(test());
})();

// -----------------------------------------------------------------------------

(() => {
    var node7 = {value: 'g', next: null}
    var node6 = {value: 'f', next: node7}
    var node5 = {value: 'e', next: node6}
    var node4 = {value: 'd', next: node5}
    var node3 = {value: 'c', next: node4}
    var node2 = {value: 'b', next: node3}
    var node1 = {value: 'a', next: node2}

    var node11 = {value: 'k', next: node4}
    var node10 = {value: 'j', next: node11}
    var node9 = {value: 'i', next: node10}
    var node8 = {value: 'h', next: node9}

    const intersectingList = (list1, list2) => {
        let myMap = new Map(),
            pointer1 = list1,
            pointer2 = list2;

        if (pointer1 === pointer2) return pointer1;

        while (pointer1 || pointer2) {
            if (pointer1 && !myMap.has(pointer1))
                myMap.set(pointer1, 1);
            else if (pointer1 && myMap.get(pointer1) === 2)
                return pointer1;

            if (pointer2 && !myMap.has(pointer2))
                myMap.set(pointer2, 2);
            else if (pointer2 && myMap.get(pointer1) === 1)
                return pointer2;

            pointer1 = pointer1.next;
            pointer2 = pointer2.next;
        }

        return null;
    };

    // console.log('<<<<<>>>>', intersectingList(node8, node1));
})();

/**
 * Problem 15
 * 2018-05-04
 *
 * Check if a linked list is a palindrome.
 */
const problem15 = new Problem(
    "Problem 15",
    [
        {input: ["Are we not pure? “No sir!” Panama’s moody Noriega brags. “It is garbage!” Irony dooms a man; a prisoner up to new era."], expected: true},
        {input: ["Barge in! Relate mere war of 1991 for a were-metal Ernie grab!"], expected: true},
        {input: ["bef123"], expected: false},
        {input: ["abccbaa"], expected: false}
    ], false);

(() => {
    class Node {
        constructor(data) {
            this.next = null;
            this.data = data;
        }
    }

    function isPalindrome(str) {
        str = str.toLowerCase().replace(/[^0-9a-z]/gi, ""); // Removes non-alpha chars.
        let head = null;
        let tail = null;

        for (const c of str) {
            let node = new Node(c);
            if (head === null)
                head = node;
            else
                tail.next = node;

            tail = node;
        }

        let s = "";

        for (let node = head; node !== null; node = node.next) {
            s += node.data;
        }

        return s === s.split("").reverse().join("");
    }

    problem15.test(isPalindrome, "Mark");
})();

// -----------------------------------------------------------------------------

(() => {
    var node7 = {value: 'g', next: null}
    var node6 = {value: 'f', next: node7}
    var node5 = {value: 'e', next: node6}
    var node4 = {value: 'd', next: node5}
    var node3 = {value: 'c', next: node4}
    var node2 = {value: 'b', next: node3}
    var node1 = {value: 'a', next: node2}

    var node11 = {value: 'k', next: node4}
    var node10 = {value: 'j', next: node11}
    var node9 = {value: 'i', next: node10}
    var node8 = {value: 'h', next: node9}

    var node36 = {value: 'r', next: null}
    var node35 = {value: 'a', next: node36}
    var node34 = {value: 'c', next: node35}
    var node33 = {value: 'e', next: node34}
    var node32 = {value: 'c', next: node33}
    var node31 = {value: 'a', next: node32}
    var node30 = {value: 'r', next: node31}

    var node47 = {value: 'r', next: null}
    var node46 = {value: 'a', next: node47}
    var node45 = {value: 'c', next: node46}
    var node44 = {value: 'e', next: node45}
    var node44 = {value: 'e', next: node44}
    var node42 = {value: 'c', next: node44}
    var node41 = {value: 'a', next: node42}
    var node40 = {value: 'r', next: node31}

    const isPlaindromeList = headNode => {
        let arr = [];
        let node = headNode;
        while (node) {
            arr.push(node.value);
            node = node.next;
        }

        for (var i = 0; i <= Math.floor(arr.length/2); i++) {
            var pointer1 = arr[i];
            var pointer2 = arr[arr.length - i -1];
            console.log(`${pointer1} | ${pointer2}`);
            if (pointer1 !== pointer2) return false;
        }

        return true;
    }

    //console.log(isPlaindromeList(node30));
    //console.log(isPlaindromeList(node40));
    //console.log(isPlaindromeList(node1));
})();

/**
 * Problem 16
 * 2018-05-04
 *
 * Find the sum of two singly-linked lists in which the digits of the addends
 * are stored in reverse order. Output the sum in a new linked list with its
 * digits also reversed.
 */
const problem16 = new Problem(
    "Problem 16",
    [
        {input: [[5, 9, 2], [7, 1, 6], [2, 1, 9]], expected: true},
        {input: [[0, 5], [0, 6], [0, 1, 1]], expected: true},
        {input: [[0, 5], [0, 6, 5], [0, 1, 6]], expected: true},
        {input: [[5, 9, 2], [7, 1, 6, 6], [2, 1, 9, 6]], expected: true}
    ], false);

(() => {
    class Node {
        constructor(data) {
            this.next = null;
            this.data = data;
        }
    }

    function construct(values) {
        let head = null;
        let tail = null;

        for (const val of values) {
            let node = new Node(val);

            if (head === null)
                head = node;
            else
                tail.next = node;

            tail = node;
        }

        return head;
    }

    function sum(values, values2) {
        let h1 = construct(values);
        let h2 = construct(values2);

        let head = null;
        let tail = null;
        let carry = false;

        for (let n1 = h1, n2 = h2; n1 || n2 || carry; n1 = n1 ? n1.next : null, n2 = n2 ? n2.next : null) {
            let sum = (n1 ? n1.data : 0) + (n2 ? n2.data : 0) + (carry ? 1 : 0);
            carry = false;

            if (sum > 9) {
                sum -= 10;
                carry = true;
            }

            let node = new Node(sum);

            if (head === null)
                head = node;
            else
                tail.next = node;

            tail = node;
        }

        return head;
    }

    function test(values, values2, expected) {
        let sH = sum(values, values2);
        let eH = construct(expected);

        try {
            for (let sN = sH, eN = eH; sN || eN; sN = sN.next, eN = eN.next) {
                if (sN.data !== eN.data)
                    return false;
            }
        } catch (_a) {
            return false; // Most likely differing lengths.
        }

        // console.log(JSON.stringify(sH, 0, 2));
    }

    problem16.test(test, "Mark");
})();

// -----------------------------------------------------------------------------

(() => {
    var node56 = {value: 5, next: null};
    var node55 = {value: 0, next: node56};

    var node51 = {value: 6, next: null};
    var node50 = {value: 0, next: node51};

    const sumLists = (head1, head2) => {
        let head = null;
        let tail = null;
        let carry = 0;
        let listVal = 0;

        while (head1 || head2 || carry) {
            let sum = (head1 ? head1.value : 0) + (head2 ?  head2.value : 0) + carry;

            if (sum > 9) {
                listVal = sum - 10;
                carry = 1;
            } else {
                listVal = sum;
                carry = 0;
            }

            // Build the resulting list with the sum
            let newNode = {value: listVal, next: null};
            if (tail === null) {
                tail = newNode;
                head = newNode;
            } else {
                tail.next = newNode;
                tail = newNode;
            }

            // move pointers
            head1 = head1 ? head1.next : null;
            head2 = head2 ? head2.next : null;
        }

        console.log(JSON.stringify(head, 0, 2));

        return head;
    }

    // sumLists(node50, node55);
})();

/**
 * Problem 17
 * 2018-05-07
 *
 * Use a single array to implement 3 stacks.
 */
(() => {
    /**
     * A container which provides first-in, last-out behaviour.
     */
    class Stack {
        /**
         * Constructs a Stack using the given partition of an array for storage.
         *
         * @param   {T[]}     array   The array to use for storage.
         * @param   {number}  start   The start index of the array's partition.
         * @param   {number}  end     The end index of the array's partition.
         * @param   {T[]}     values  The values with which to initialise the container.
         */
        constructor(array, start, end, values) {
            this._size = 0;

            if (start < 0 || end >= array.length)
                throw "Start or end index is out of the array's range";

            this.array = array;
            this.maxSize = end - (start === 0 ? -1 : --start);
            this._top = start; // Subtracts one because push assumes current top is full.

            if (typeof values !== "undefined") {
                if (values.length > this.maxSize)
                    throw "Value's length is greater than allocated storage.";

                for (const val of values)
                    this.push(val);
            }
        }

        /**
         * Inserts an element at the top.
         *
         * @param   {T} value   The element to insert.
         */
        push(value) {
            if (this._size > this.maxSize)
                throw "Cannot insert an element into a full stack.";

            ++this._size;
            ++this._top;
            this.array[this._top] = value;
        }

        /**
         * Removes the top element.
         *
         * @returns {T} The removed element.
         */
        pop() {
            if (this._size === 0)
                throw "Cannot remove an element from an empty stack.";

            const temp = this.array[this._top];
            this.array[this._top] = null;
            --this._size;
            --this._top;

            return temp;
        }

        /**
         * Accesses the top element.
         * @returns {T}     The top element.
         */
        top() {
            if (this._size === 0)
                throw "Cannot retrieve an element from an empty stack.";

            return this.array[this._top];
        }

        /**
         * The number of elements contained.
         *
         * @returns {number}    The number of elements contained.
         */
        get size() {
            return this._size;
        }
    }

    function test() {
        const array = new Array(15);
        const stack1 = new Stack(array, 0, 4);
        const stack2 = new Stack(array, 5, 11);
        const stack3 = new Stack(array, 12, 14);

        stack1.push(1);
        stack1.push(2);
        stack1.push(3);
        stack1.push(4);
        console.log(`[Stack 1] pop: ${stack1.pop()}`);
        stack1.push(5);
        stack1.push(6);

        for (let i = 0; i < 5; ++i) {
            console.log(`[Stack 1] ${i}: ${array[i]}`);
        }

        stack2.push(55);
        stack2.push(66);
        console.log(`[Stack 2] pop: ${stack2.pop()}`);
        stack2.push(77);
        stack2.push(88);
        console.log(`[Stack 2] pop: ${stack2.pop()}`);
        stack2.push(99);
        stack2.push(100);
        console.log(`[Stack 1] pop: ${stack1.pop()}`);
        stack2.push(111);
        console.log(`[Stack 1] pop: ${stack1.pop()}`);
        console.log(`[Stack 1] pop: ${stack1.pop()}`);
        stack2.push(122);
        stack2.push(133);

        for (let i = 5; i < 12; ++i) {
            console.log(`[Stack 2] ${i}: ${array[i]}`);
        }

        stack3.push(733);
        console.log(`[Stack 2] pop: ${stack2.pop()}`);
        stack3.push(744);
        console.log(`[Stack 1] pop: ${stack1.pop()}`);
        console.log(`[Stack 3] pop: ${stack3.pop()}`);
        stack3.push(755);
        stack3.push(766);

        console.log(stack3.size);

        stack3.push(6666666);
        stack3.push(7777777);
        stack3.push(76576);
        console.log(stack3.size);
        console.log(`[Stack 3] pop: ${stack3.pop()}`);

        for (let i = 12; i < 15; ++i) {
            console.log(`[Stack 3] ${i}: ${array[i]}`);
        }
    }

    // test();
})();

// -----------------------------------------------------------------------------

(() => {

})();

/**
 * Problem 18
 * 2018-05-08
 *
 * Implement a stack.
 */
const problem18 = new Problem(
    "Problem 18",
    [
        {input: [], expected: true}
    ]);

(() => {
    class Stack {
        /**
         * Constructs a Stack.
         *
         * @param   {T[]}     values    The values with which to initialise the container.
         */
        constructor(values) {
            this._top = -1;
            this.array = [];

            if (typeof values !== "undefined") {
                for (const val of values)
                    this.push(val);
            }
        }

        /**
         * Inserts an element at the top.
         *
         * @param   {T} value   The element to insert.
         */
        push(value) {
            ++this._top;
            this.array[this._top] = value;
        }

        /**
         * Removes the top element.
         *
         * @returns {T} The removed element.
         */
        pop() {
            if (this.size === 0)
                throw "Cannot remove an element from an empty stack.";

            const temp = this.array[this._top];
            this.array[this._top] = null;
            --this.array.length;
            --this._top;

            return temp;
        }

        /**
         * Accesses the top element.
         * @returns {T}     The top element.
         */
        top() {
            if (this.size === 0)
                throw "Cannot retrieve an element from an empty stack.";

            return this.array[this._top];
        }

        /**
         * The number of elements contained.
         *
         * @returns {number}    The number of elements contained.
         */
        get size() {
            return this.array.length;
        }
    }

    function test() {
        const stack1 = new Stack();
        stack1.push(1);
        stack1.push(2);
        stack1.push(3);
        stack1.push(4);
        console.log(`size: ${stack1.size}`);

        console.log(`pop: ${stack1.pop()}`);
        console.log(`top: ${stack1.top()}`);
        console.log(`size: ${stack1.size}`);

        stack1.push(5);
        stack1.push(6);
        console.log(`top: ${stack1.top()}`);
        console.log(`size: ${stack1.size}`);

        // Wont throw if dynamic, old test.
        try {
            stack1.push(7);
            console.log(`size: ${stack1.size}`);
        } catch (e) {
            console.log(e);
        }

        while (true) {
            try {
                console.log(`pop: ${stack1.pop()}`);
            } catch (e) {
                console.log(e);
                break;
            }
        }

        try {
            console.log(`size: ${stack1.size}`);
            console.log(`top: ${stack1.top()}`);
        } catch (e) {
            console.log(e);
        }
    }

    // test();
})();

// -----------------------------------------------------------------------------

(() => {
    var FunctionalStack = () => {
        var someInstance = {};
        var storage = {};
        var length = 0;

        someInstance.push = (val) => {
            storage[length] = val;
            length++;

            return length;
        };

        someInstance.pop = () => {
            if (length > 0) {
                length--;
                return storage[length];
            }

            return null;
        };

        someInstance.size = () => length;

        return someInstance;
    };

    function test() {
        let myFunctionalStack = FunctionalStack();
        console.log(myFunctionalStack.size());
        console.assert(myFunctionalStack.pop() === null, 'should equal null');  //null
        console.log(myFunctionalStack.push('a'));
        console.log(myFunctionalStack.push('b'));
        console.log(myFunctionalStack.push('c'));
        console.log(myFunctionalStack.push('d'));
        console.log(myFunctionalStack.push('e'));
        console.assert(myFunctionalStack.pop() === 'e', 'should equal e');  //e
        console.log(myFunctionalStack.push('f'));
        console.log(myFunctionalStack.push('g'));
        console.assert(myFunctionalStack.pop() === 'g', 'should equal g');  //g
        console.assert(myFunctionalStack.pop() === 'f', 'should equal f');  //f
        console.assert(myFunctionalStack.pop() === 'd', 'should equal d');  //d
        console.assert(myFunctionalStack.pop() === 'c', 'should equal c');  //c
        console.assert(myFunctionalStack.pop() === 'b', 'should equal b');  //b
        console.assert(myFunctionalStack.pop() === 'a', 'should equal a');  //a
        console.assert(myFunctionalStack.pop() === null, 'should equal null');  //e
        console.log(myFunctionalStack.push('a'));
        console.log(myFunctionalStack.push('b'));
        console.assert(myFunctionalStack.pop() === 'b', 'should equal b');  //b

        console.log(myFunctionalStack);
    }

    // test();
})();

/**
 * Problem 19
 * 2018-05-08
 *
 * Implement a queue.
 */
const problem19 = new Problem(
    "Problem 19",
    [
        {input: [], expected: true}
    ]);
(() => {
    class Queue {
        constructor(size, values) {
            this.array = [];

            if (size < 1)
                throw "Size cannot be less than 1.";

            this._front = size;
            this.back = size;
            this.maxSize = size + 1; // Always keep one empty space.

            if (typeof values !== "undefined") {
                if (values.length > this.maxSize)
                    throw "Value's length is greater than this container's maximum size.";

                for (const val of values)
                    this.push(val);
            }
        }
        push(value) {
            if (this.full)
                throw "Cannot insert an element into a full queue.";

            this.back = (this.back + 1) % this.maxSize; // Circles to 0 if at the end; otherwise increments.
            this.array[this.back] = value;
        }

        pop() {
            if (this.empty)
                throw "Cannot remove an element from an empty queue.";

            this._front = (this._front + 1) % this.maxSize; // Circles to 0 if at the end; otherwise increments.
            const temp = this.array[this._front];
            this.array[this._front] = null;

            return temp;
        }

        get empty() {
            return this._front === this.back;
        }

        get full() {
            return this._front === (this.back + 1) % this.maxSize;
        }

        get front() {
            if (this.empty)
                throw "Cannot retrieve the front element from an empty queue.";

            return this.array[(this._front + 1) % this.maxSize];
        }
    }

    function test() {
        const queue = new Queue(5);

        console.log(`empty: ${queue.empty}`);

        queue.push(1);
        queue.push(2);
        queue.push(3);
        queue.push(4);

        console.log(`empty: ${queue.empty}`);
        console.log(`pop: ${queue.pop()}`);
        console.log(`front: ${queue.front}`);
        console.log(`full: ${queue.full}`);

        queue.push(5);
        queue.push(6);
        console.log(`front: ${queue.front}`);

        try {
            console.log(`full: ${queue.full}`);
            queue.push(7);
        } catch (e) {
            console.log(e);
        }

        while (true) {
            try {
                console.log(`pop: ${queue.pop()}`);
            } catch (e) {
                console.log(e);
                break;
            }
        }

        try {
            console.log(`front: ${queue.front}`);
        } catch (e) {
            console.log(e);
        }

        console.log(`empty: ${queue.empty}`);
    }

    // test();
})();

// -----------------------------------------------------------------------------

(() => {
    var LLNode = function (val) {
        return {value: val, next: null};
    };

    var LinkedList = function () {
        this.head = null;
        this.tail = null;

        this.addToTail = function (val) {
            let newNode = LLNode(val);
            if (this.head === null) {
                this.head = this.tail = newNode;
            } else {
                this.tail.next = newNode;
                this.tail = newNode;
            }
        };

        this.removeHead = function () {
            if (this.head) {
                let nodeToReturn = this.head;
                this.head = this.head.next;
                return nodeToReturn.value;
            } else {
                return null;
            }
        }
    };

    var Queue = function () {
        this.storage = new LinkedList();
        this.enqueue = function(val) { return this.storage.addToTail(val) };
        this.dequeue = function() { return this.storage.removeHead() } ;
    };

    function test() {
        let myQueue = new Queue();
        // console.log(myQueue.size());
        console.assert(myQueue.dequeue() === null, 'should equal null');  //null
        console.log(myQueue.enqueue('a'));
        console.log(myQueue.enqueue('b'));
        console.log(myQueue.enqueue('c'));
        console.log(myQueue.enqueue('d'));
        console.log(myQueue.enqueue('e'));
        console.assert(myQueue.dequeue() === 'a', 'should equal a');  //e
        console.log(myQueue.enqueue('f'));
        console.log(myQueue.enqueue('g'));
        console.assert(myQueue.dequeue() === 'b', 'should equal b');  //g
        console.assert(myQueue.dequeue() === 'c', 'should equal c');  //f
        console.assert(myQueue.dequeue() === 'd', 'should equal d');  //d
        console.assert(myQueue.dequeue() === 'e', 'should equal e');  //c
        console.assert(myQueue.dequeue() === 'f', 'should equal f');  //b
        console.assert(myQueue.dequeue() === 'g', 'should equal g');  //a
        console.assert(myQueue.dequeue() === null, 'should equal null');  //e
        console.log(myQueue.enqueue('a'));
        console.assert(myQueue.dequeue() === 'a', 'should equal a');  //b
        console.log(myQueue.enqueue('b'));
        console.log(myQueue.enqueue('c'));
        console.assert(myQueue.dequeue() === 'b', 'should equal b');  //b

        console.log(myQueue);
    }

    // test();
})();

/**
 * Problem 20
 * 2018-05-09
 *
 * A bracket is considered to be any one of the following characters:
 * (, ), {, }, [, or ].
 *
 * Two brackets are considered to be a matched pair if the an opening bracket
 * (i.e., (, [, or {) occurs to the left of a closing bracket (i.e., ), ], or })
 * of the exact same type. There are three types of matched pairs of brackets:
 * [], {}, and ().
 *
 * A matching pair of brackets is not balanced if the set of brackets it
 * encloses are not matched. For example, {[(])} is not balanced because the
 * contents in between { and } are not balanced. The pair of square brackets
 * encloses a single, unbalanced opening bracket, (, and the pair of parentheses
 * encloses a single, unbalanced closing square bracket, ].
 *
 * By this logic, we say a sequence of brackets is considered to be balanced if
 * the following conditions are met:
 *
 *     It contains no unmatched brackets.
 *     The subset of brackets enclosed within the confines of a matched pair of
 *     brackets is also a matched pair of brackets.
 *
 * Given  strings of brackets, determine whether each sequence of brackets is
 * balanced. If a string is balanced, print YES on a new line; otherwise, print
 * NO on a new line.
 */
const problem20 = new Problem(
    "Problem 20",
    [
        {input: ["{[()]}"], expected: true},
        {input: ["{[(])}"], expected: false},
        {input: ["{{[[(())]]}}"], expected: true},
        {input: ["{{[()[(())]]}}"], expected: true},
        {input: ["[](){}"], expected: true}
    ], false);

(() => {
    /**
     * A container which provides first-in, last-out behaviour.
     */
    class Stack {
        /**
         * Constructs a Stack.
         *
         * @param   {T[]}     values    The values with which to initialise the container.
         */
        constructor(values) {
            this.array = [];
            this._top = -1;

            if (typeof values !== "undefined") {
                for (const val of values)
                    this.push(val);
            }
        }

        /**
         * Inserts an element at the top.
         *
         * @param   {T} value   The element to insert.
         */
        push(value) {
            ++this._top;
            this.array[this._top] = value;
        }

        /**
         * Removes the top element.
         *
         * @returns {T} The removed element.
         */
        pop() {
            if (this.size === 0)
                throw "Cannot remove an element from an empty stack.";

            const temp = this.array[this._top];
            this.array[this._top] = null;
            --this.array.length;
            --this._top;

            return temp;
        }

        /**
         * Accesses the top element.
         *
         * @returns {T}     The top element.
         */
        get top() {
            if (this.size === 0)
                throw "Cannot retrieve an element from an empty stack.";

            return this.array[this._top];
        }

        /**
         * The number of elements contained.
         *
         * @returns {number}    The number of elements contained.
         */
        get size() {
            return this.array.length;
        }
    }

    function isBalanced(brackets) {
        const stack = new Stack();
        const left = new Set(["(", "[", "{"]);
        const right = new Set([")", "]", "}"]);

        for (const c of brackets) {
            if (left.has(c)) {
                stack.push(c); // Pushes only left characters.
            } else if (right.has(c) && Math.abs(c.charCodeAt(0) - stack.top.charCodeAt(0)) <= 2) {
                stack.pop(); // Is a right bracket and the top of the stack is its left pair.
            } else {
                return false; // Invalid character or right bracket doesn't match left.
            }
        }

        return stack.size === 0; // If not empty, it means there are dangling left chars.
    }

    problem20.test(isBalanced, "Mark");
})();

// -----------------------------------------------------------------------------

(() => {
    var Stack = function() {
        this.length = 0;
        this.storage = {};
    };

    Stack.prototype.size = function() {
        return this.length;
    };

    Stack.prototype.push = function(val) {
        this.storage[this.length] = val;
        this.length++;
        return this.length;
    };

    Stack.prototype.pop = function() {
        if (this.length > 0) {
            var result = this.storage[this.length - 1];
            this.length--;
            return result;
        }

        return null;
    };

    // Method 1
    function balParen2(str) {
        let dict = {
            "{": "}",
            "[": "]",
            "(": ")"
        };

        for (var i = 0; i < str.length / 2; i++) {
            if (dict[str[i]] !== str[str.length - i - 1]) return false;
        }

        return true;
    }

    // Method 2
    function balParen(str) {
        let dict = {
            "{": "}",
            "[": "]",
            "(": ")"
        };

        let len = str.length;
        if (len % 2 !== 0) return false;

        let midPoint = len / 2;
        let i = 0;
        let j = midPoint;

        let stack1 = new Stack();
        let stack2 = new Stack();

        while (i < midPoint) {
            stack1.push(str[i]);
            i++;
        }

        while (len > j) {
            stack2.push(str[len - 1]);
            len--;
        }

        for (let k = 0; k < midPoint; k++) {
            if (dict[stack1.pop()] !== stack2.pop()) return false;
        }

        // console.log(JSON.stringify(stack1.storage, 0, 2));
        // console.log(JSON.stringify(stack2.storage, 0, 2));

        return true;
    }

    problem20.test(balParen, "Anonpunk");
    problem20.test(balParen2, "Anonpunk");
})();

/**
 * Problem 21
 * 2018-05-10
 *
 * A left rotation operation on an array of size n shifts each of the array's
 * elements 1 unit to the left.
 */
const problem21 = new Problem(
    "Problem 21",
    [
        {input: [[1, 2, 3, 4, 5], 2], expected: [3, 4, 5, 1, 2]},
        {input: [[1, 2, 3, 4, 5], 4], expected: [5, 1, 2, 3, 4]},
        {input: [[1, 2, 3, 4, 5], 5], expected: [1, 2, 3, 4, 5]},
        {input: [[1, 2, 3, 4, 5], 7], expected: [3, 4, 5, 1, 2]},
        {input: [[1, 2, 3, 4, 5], 0], expected: [1, 2, 3, 4, 5]}
    ], false);

(() => {
    function shift(array, shifts) {
        shifts = shifts % array.length;

        if (shifts === 0 || array.length === 0)
            return array;

        return array.slice(shifts).concat(array.slice(0, shifts));
    }

    function shift2(array, shifts) {
        shifts = shifts % array.length;

        if (shifts === 0 || array.length === 0)
            return array;

        const out = [];

        for (let i = shifts; i < array.length; ++i)
            out.push(array[i]);

        for (let i = 0; i < shifts; ++i)
            out.push(array[i]);

        return out;
    }

    function shift3(array, shifts) {
        shifts = shifts % array.length;

        if (shifts === 0 || array.length === 0)
            return array;

        function s(val, destIdx) {
            let temp = array[destIdx];
            array[destIdx] = val;

            if (destIdx === 0) {
                --shifts;
                temp = array[0];
                destIdx = array.length;
            }

            if (shifts !== 0)
                s(temp, destIdx - 1);
        }

        s(array[0], array.length - 1);

        return array;
    }

    problem21.test(shift, "Mark");
    problem21.test(shift2, "Mark");
    problem21.test(shift3, "Mark");
})();

// -----------------------------------------------------------------------------

(() => {
    function leftRotate(arr, n) {
      if (n > arr.length) { n = n % arr.length; }
      return arr.slice(n).concat(arr.slice(0,n));
    }
    
    problem21.test(leftRotate, "Anonpunk");
})();

/**
 * Problem 22
 * 2018-05-14
 *
 * Add a function min to your stack class which returns the minimum element.
 * Push, Pop and min should all operate in O(1) time.
 */
(() => {
    /**
     * A container which provides first-in, last-out behaviour.
     */
    class StackBase {
        /**
         * Constructs a Stack.
         *
         * @param   {T[]}     values    The values with which to initialise the container.
         */
        constructor(values) {
            this.array = [];
            this._top = -1;

            if (typeof values !== "undefined") {
                for (const val of values)
                    this.push(val);
            }
        }
        /**
         * Inserts an element at the top.
         *
         * @param   {T} value   The element to insert.
         */
        push(value) {
            ++this._top;
            this.array[this._top] = value;
        }
        /**
         * Removes the top element.
         *
         * @returns {T} The removed element.
         */
        pop() {
            if (this.size === 0)
                throw "Cannot remove an element from an empty stack.";

            const temp = this.array[this._top];
            this.array[this._top] = null;
            --this.array.length;
            --this._top;

            return temp;
        }
        /**
         * Accesses the top element.
         *
         * @returns {T}     The top element.
         */
        get top() {
            if (this.size === 0)
                throw "Cannot retrieve an element from an empty stack.";

            return this.array[this._top];
        }
        /**
         * The number of elements contained.
         *
         * @returns {number}    The number of elements contained.
         */
        get size() {
            return this.array.length;
        }
    }

    /**
     * A container which provides first-in, last-out behaviour.
     */
    class Stack extends StackBase {
        /**
         * Inserts an element at the top.
         *
         * @param   {T} value   The element to insert.
         */
        push(value) {
            super.push(value);

            if (typeof this.mins === "undefined")
                this.mins = new StackBase();

            if (this.mins.size === 0 || value < this.mins.top.value)
                this.mins.push({ index: this._top, value: value });
        }

        /**
         * Removes the top element.
         *
         * @returns {T} The removed element.
         */
        pop() {
            if (this.size === 0)
                throw "Cannot remove an element from an empty stack.";

            if (this._top === this.mins.top.index)
                this.mins.pop();

            return super.pop();
        }

        /**
         * Gets the element with the smallest value.
         *
         * @returns {T} The smallest element.
         */
        get min() {
            return this.mins.top.value;
        }
    }

    function test() {
        const stack = new Stack([8, 3, 4, 2, 7, 6]);

        console.log(stack.min);

        stack.pop();
        console.log(stack.min);

        stack.pop();
        console.log(stack.min);

        stack.pop();
        console.log(stack.min);

        stack.pop();
        console.log(stack.min);

        stack.pop();
        console.log(stack.min);
    }
    
    function test2() {
        const stack = new Stack();
        
        stack.push(3);
        stack.push(2);
        stack.push(9);
        console.log(stack.min === 2, 'should equal 2');
        stack.push(10);
        stack.push(-1);
        stack.push(-8);
        stack.push(20);
        console.log(stack.min === -8, 'should equal -8');
        console.log(stack.pop() === 20, 'should equal 20');
        console.log(stack.pop() === -8, 'should equal -8');
        console.log(stack.top === -1, 'should equal -1');  
        console.log(stack.min === -1, 'should equal -1');
    }

    // test();
    // tet2();
})();

// -----------------------------------------------------------------------------

(() => {
    function Stack() {
        this.storage = {};
        this.minVal = [];
        this.length = 0;
        
        const setMin = (val) => {
            if (this.minVal[this.minVal.length -1] >= val) {
                this.minVal.push(val);
            }
        }
        //push
        this.push = (val) => {
                if (!this.length) this.minVal.push(val);
                else setMin(val);

                this.storage[this.length] = val;
                this.length++;
                return this.length;
        }
        //pop
        this.pop = () => {
            if (this.length > 0) {
                let returnVal = this.storage[this.length - 1];
                
                if (returnVal === this.minVal[this.minVal.length-1]) this.minVal.pop();
                
                delete this.storage[this.length - 1];
                this.length--;
                return returnVal;
            } else {
                return null;
            }
        }
        //size
        this.size = () => this.length;
        //peek
        this.peek = () => this.storage[this.length - 1];
        //min
        this.min = () => this.minVal[this.minVal.length - 1] || 'Stack is empty';
    }

    function test() {
        let myStack2 = new Stack();

        console.log(myStack2.size() === 0, 'should equal 0');
        console.log(myStack2.pop() === null, 'should equal null');  //null

        myStack2.push(3);
        myStack2.push(2);
        myStack2.push(9);
        console.log(myStack2.min() === 2, 'should equal 2');
        myStack2.push(10);
        myStack2.push(-1);
        myStack2.push(-8);
        myStack2.push(20);
        console.log(myStack2.min() === -8, 'should equal -8');
        console.log(myStack2.pop() === 20, 'should equal 20');
        console.log(myStack2.pop() === -8, 'should equal -8');
        console.log(myStack2.peek() === -1, 'should equal -1');  
        console.log(myStack2.min() === -1, 'should equal -1');
        
        console.log(myStack2);
    }
    
    // test();
})();

/**
 * Problem 23
 * 2018-05-16
 *
 * Write a program to sort a stack such that the smallest items are on the top. 
 * You can use an additional temporary stack, but you may not copy the elements 
 * into any other data structure (such as an array). The stack supports the 
 * following operations: push, pop, peek, isEmpty.
 */
const problem23 = new Problem(
    "Problem 23",
    [
//         {input: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1]},
//         {input: [[5, 4, 3, 2, 1]], expected: [5, 4, 3, 2, 1]},
//         {input: [[3, 5, 4, 1, 2]], expected: [5, 4, 3, 2, 1]},
//         {input: [[6, 7, -1, 2, 0, 3]], expected: [7, 6, 3, 2, 0, -1]},
        {input: [[3, 5, 4, 4, 1, 2, 2]], expected: [5, 4, 4, 3, 2, 2, 1]},
    ], false);

(() => {
    /**
     * A container which provides first-in, last-out behaviour.
     */
    class Stack {
        /**
         * Constructs a Stack.
         *
         * @param   {T[]}     values    The values with which to initialise the container.
         */
        constructor(values) {
            this.array = [];
            this._top = -1;
            
            if (typeof values !== "undefined") {
                for (const val of values)
                    this.push(val);
            }
        }

        /**
         * Inserts an element at the top.
         *
         * @param   {T} value   The element to insert.
         */
        push(value) {
            ++this._top;
            this.array[this._top] = value;
        }

        /**
         * Removes the top element.
         *
         * @returns {T} The removed element.
         */
        pop() {
            if (this.size === 0)
                throw "Cannot remove an element from an empty stack.";

            const temp = this.array[this._top];
            this.array[this._top] = null;
            --this.array.length;
            --this._top;

            return temp;
        }

        /**
         * Accesses the top element.
         *
         * @returns {T}     The top element.
         */
        get top() {
            if (this.size === 0)
                throw "Cannot retrieve an element from an empty stack.";
            
            return this.array[this._top];
        }

        /**
         * The number of elements contained.
         *
         * @returns {number}    The number of elements contained.
         */
        get size() {
            return this.array.length;
        }

        /**
         * Determines if the Stack contains no elements.
         *
         * @returns {boolean}  true if empty; false otherwise.
         */
        get empty() {
            return this.array.length === 0;
        }
    }

    function sort(stack) {
        const stackTemp = new Stack();

        while (!stack.empty) {
            const top = stack.pop();

            if (stackTemp.empty || top <= stackTemp.top) {
                stackTemp.push(top);
            } else {
                let count = 0;

                while (!stackTemp.empty && top > stackTemp.top) {
                    stack.push(stackTemp.pop());
                    ++count;
                }

                stackTemp.push(top);

                while (count > 0) {
                    stackTemp.push(stack.pop());
                    --count;
                }
            }
        }

        return stackTemp;
    }

    function testSort(values) {
        const stack = sort(new Stack(values));
        const out = [];

        while (!stack.empty) {
            out.push(stack.pop());
        }

        return out.reverse();
    }

    problem23.test(testSort, "Mark");
})();

// -----------------------------------------------------------------------------

(() => {
        function Stack() {
        this.storage = {};
        this.minVal = [];
        this.length = 0;

        const setMin = (val) => {
            if (this.minVal[this.minVal.length - 1] >= val) {
                this.minVal.push(val);
            }
        }
        //push
        this.push = (val) => {
            if (!this.length) this.minVal.push(val);
            else setMin(val);

            this.storage[this.length] = val;
            this.length++;
            return this.length;
        }
        //pop
        this.pop = () => {
            if (this.length > 0) {
                let returnVal = this.storage[this.length - 1];

                if (returnVal === this.minVal[this.minVal.length - 1]) this.minVal.pop();

                delete this.storage[this.length - 1];
                this.length--;
                return returnVal;
            } else {
                return null;
            }
        }
        //size
        this.size = () => this.length;
        //peek
        this.peek = () => this.storage[this.length - 1];
        //min
        this.min = () => this.minVal[this.minVal.length - 1] || 'Stack is empty';
        //isEmpty
        this.isEmpty = () => this.length < 1;
    }
  
  
    function create(values) {
      const stack = new Stack();

      for (const v of values)
          stack.push(v);

      return stack;
    }

    function testSort(values) {
        const stack = stackSorter(create(values));
        const out = [];

        while (!stack.isEmpty()) {
            out.push(stack.pop());
        }

        return out.reverse();
    }
    
    function stackSorter(stack) {
        let tempStack = new Stack();
        
        while (!stack.isEmpty()) {
            let len = 0;
            let currSmallest = stack.pop(); // 1 
                      
            while (!stack.isEmpty()) {  // [4,4,5,3]
                let newPoppedItem = stack.pop();
                len++;
                
                if (currSmallest <= newPoppedItem) {
                    tempStack.push(newPoppedItem);
                } else {
                    tempStack.push(currSmallest); // [3,5,4,4,2,2]
                    currSmallest = newPoppedItem;
                }
            } // end while

            for (let j = 0; j < len; ++j) {
                stack.push(tempStack.pop()); // [2,2,4,4,5,3]
            }

            tempStack.push(currSmallest); // [, 1]
        } // end while

        while (!tempStack.isEmpty()) {
            stack.push(tempStack.pop());
        }

        return stack;
    }
    
    problem23.test(testSort, "Anonpunk"); 
})();

/**
 * Problem 24
 * 2018-05-18
 *
 * Implement a queue using two stacks.
 */
const problem24 = new Problem(
    "Problem 24",
    [
        {input: [], expected: undefined}
    ]);

(() => {
    // problem24.test(undefined, "");
})();

// -----------------------------------------------------------------------------

(() => {
    function Stack() {
        this.storage = {};
        this.minVal = [];
        this.length = 0;

        const setMin = (val) => {
            if (this.minVal[this.minVal.length - 1] >= val) {
                this.minVal.push(val);
            }
        }
        //push
        this.push = (val) => {
            if (!this.length) this.minVal.push(val);
            else setMin(val);

            this.storage[this.length] = val;
            this.length++;
            return this.length;
        }
        //pop
        this.pop = () => {
            if (this.length > 0) {
                let returnVal = this.storage[this.length - 1];

                if (returnVal === this.minVal[this.minVal.length - 1]) this.minVal.pop();

                delete this.storage[this.length - 1];
                this.length--;
                return returnVal;
            } else {
                return null;
            }
        }

        this.size = () => this.length;
        this.peek = () => this.storage[this.length - 1];
        this.min = () => this.minVal[this.minVal.length - 1] || 'Stack is empty';
        this.isEmpty = () => this.length < 1;
    }
  
    const Queue = function () {
      let stack1 = new Stack();
      let stack2 = new Stack();

      // enqueue
      this.enqueue = (input) =>  {
        if (Array.isArray(input)) input.forEach((item) => stack1.push(item));
        else stack1.push(input);
      }
      // dequeue
      this.dequeue = () => {
        if (this.size()) {
          // check if there are items in stack 2
          if (stack2.size() > 0) return stack2.pop();
          // stack 2 is empty; check stack 1
          else if (stack1.size() === 1) { return stack1.pop() }
          // stack2 is empty and stack 1 has more than 1 items
          else {
            while(stack1.size()) {
              stack2.push(stack1.pop());
            }
            return stack2.pop();
          }          
        } else return null;
      }
      
      this.size = () =>  stack1.size() + stack2.size(); 
      this.isEmpty = () => this.size() === 0; 
    }

    function test() {
        console.log('\n==================================\n');
        console.log(' Implement a queue using 2 stacks  ');
        console.log('\n==================================\n');
        
        let myQueue = new Queue();
        // console.log(myQueue.size());
        console.assert(myQueue.dequeue() === null, 'should equal null'); //null
        myQueue.enqueue(['a', 'b', 'c', 'd', 'e']);
        console.log(myQueue);
        console.assert(myQueue.size() === 5, 'should equal 5');
        console.assert(myQueue.dequeue() === 'a', 'should equal a');
        console.assert(myQueue.size() === 4, 'should equal 4');
        myQueue.enqueue(['f', 'g']);  


        console.assert(myQueue.dequeue() === 'b', 'should equal b'); 
        console.assert(myQueue.dequeue() === 'c', 'should equal c'); 
        console.assert(myQueue.dequeue() === 'd', 'should equal d'); 
        console.assert(myQueue.dequeue() === 'e', 'should equal e'); 
        console.assert(myQueue.size() === 2, 'should equal 2');
        console.assert(myQueue.isEmpty() === false, 'should equal false');
        console.assert(myQueue.dequeue() === 'f', 'should equal f'); 
        console.assert(myQueue.dequeue() === 'g', 'should equal g'); 
        console.assert(myQueue.dequeue() === null, 'should equal null'); 
        console.assert(myQueue.size() === 0, 'should equal 0');
        console.assert(myQueue.isEmpty() === true, 'should equal true');

        myQueue.enqueue('a');
        console.assert(myQueue.dequeue() === 'a', 'should equal a'); 
        myQueue.enqueue('b');
        myQueue.enqueue('c');
        console.assert(myQueue.dequeue() === 'b', 'should equal b'); 

        console.log(myQueue);

        console.log('\n==================================\n');
        console.log(' Executed all assertions for a queue ');
        console.log('\n==================================\n');
    }  
    
    // test();
})();

/**
 * Problem 25
 * 2018-05-18
 *
 * Implement a queue using two stacks.
 */
(() => {
    /**
     * A container which provides first-in, last-out behaviour.
     */
    class Stack {
        /**
         * Constructs a Stack.
         *
         * @param   {T[]}     values    The values with which to initialise the container.
         */
        constructor(values) {
            this.array = [];
            this._top = -1;

            if (typeof values !== "undefined") {
                for (const val of values)
                    this.push(val);
            }
        }

        /**
         * Inserts an element at the top.
         *
         * @param   {T} value   The element to insert.
         */
        push(value) {
            ++this._top;
            this.array[this._top] = value;
        }

        /**
         * Removes the top element.
         *
         * @returns {T} The removed element.
         */
        pop() {
            if (this.size === 0)
                throw "Cannot remove an element from an empty stack.";

            const temp = this.array[this._top];
            this.array[this._top] = null;
            --this.array.length;
            --this._top;

            return temp;
        }

        /**
         * Accesses the top element.
         *
         * @returns {T}     The top element.
         */
        get top() {
            if (this.size === 0)
                throw "Cannot retrieve an element from an empty stack.";
            return this.array[this._top];
        }

        /**
         * The number of elements contained.
         *
         * @returns {number}    The number of elements contained.
         */
        get size() {
            return this.array.length;
        }

        /**
         * Determines if the Stack contains no elements.
         *
         * @returns {boolean}  true if empty; false otherwise.
         */
        get empty() {
            return this.array.length === 0;
        }
    }

    class StackSet {
        /**
         * Constructs a Stack set.
         *
         * @param             maxSize   The maximum size of one stack.
         * @param   {T[]}     values    The values with which to initialise the container.
         */
        constructor(maxSize, values) {
            this.stacks = new Stack();
            this._size = 0;
            this.maxSize = maxSize;

            if (typeof values !== "undefined") {
                for (const val of values)
                    this.push(val);
            }
        }

        /**
         * Inserts an element at the back.
         *
         * @param   {T} value   The element to insert.
         */
        push(value) {
            if (this.empty || this.stacks.top.size === this.maxSize)
                this.stacks.push(new Stack());

            this.stacks.top.push(value);
            ++this._size;
        }

        /**
         * Removes the top element.
         *
         * @returns {T} The removed element.
         */
        pop() {
            if (this.empty)
                throw "Cannot remove an element from an empty stack.";
            
            const temp = this.stacks.top.pop();
            
            if (this.stacks.top.empty)
                this.stacks.pop();
            
            --this._size;
            
            return temp;
        }
        /**
         * Accesses the top element.
         *
         * @returns {T}     The top element.
         */
        get top() {
            if (this.empty)
                throw "Cannot retrieve an element from an empty stack.";
            
            return this.stacks.top.top;
        }

        /**
         * The number of elements contained.
         *
         * @returns {number}    The number of elements contained.
         */
        get size() {
            return this._size;
        }

        /**
         * Determines if the Stack contains no elements.
         *
         * @returns {boolean}  true if empty; false otherwise.
         */
        get empty() {
            return this.size === 0;
        }
    }

    function test() {
        const maxSize = 3;
        const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const stack = new StackSet(maxSize, values);

        assert.deepStrictEqual(stack.size, values.length, "Stack size does not equal amount of values with which it was initialised.");

        for (let i = values.length - 1; i >= 0; --i) {
            const top = stack.pop();
            assert.deepStrictEqual(top, values[i], `Element at index ${i} and top of stack are not equal.`);
            // console.log(top);
        }

        stack.push(7);
        assert.deepStrictEqual(stack.pop(), 7);

        stack.push(9);
        stack.push(12);
        stack.push(3);
        stack.push(13);

        assert.deepStrictEqual(stack.pop(), 13);
        assert.deepStrictEqual(stack.pop(), 3);
    }

    // test();
})();

// -----------------------------------------------------------------------------

(() => {
    const SetOfStacks = function () {
      let arrayOfStacks = [];
      const maxLength = 5
      this.push = (item) => {
        if(!arrayOfStacks.length || arrayOfStacks[arrayOfStacks.length - 1].size() === maxLength) {
          // create new stack 
          let stack = new Stack();
          stack.push(item);
          arrayOfStacks.push(stack);
        } else {
          arrayOfStacks[arrayOfStacks.length -1].push(item);
        }
      }
      this.pop = () =>  {
        if(!arrayOfStacks.length) return null
        else {
          let stack = arrayOfStacks[this.stackCount() - 1]
          var valToReturn = stack.pop();
          if(!arrayOfStacks[this.stackCount() - 1].size()) arrayOfStacks.pop();
          return valToReturn;
        }
      }

      this.stackCount = () => arrayOfStacks.length;
    }   

    
    function test() {
        console.log('\n==================================\n');
        console.log(' Implement SetOfStacks ');
        console.log('\n==================================\n');
        
        let mySetOfStack = new SetOfStacks();

        // console.assert(mySetOfStack.size() === 0, 'should equal 0');
        console.assert(mySetOfStack.pop() === null, 'should equal null'); //null
        mySetOfStack.push('a');
        mySetOfStack.push('b');
        mySetOfStack.push('c');
        mySetOfStack.push('d');
        mySetOfStack.push('e');

        // console.assert(mySetOfStack.peek() === 'e', 'should equal e');
        console.assert(mySetOfStack.pop() === 'e', 'should equal e');
        // console.assert(mySetOfStack.peek() === 'd', 'should equal d');
        mySetOfStack.push('f');
        mySetOfStack.push('g');
        console.assert(mySetOfStack.pop() === 'g', 'should equal g');
        console.assert(mySetOfStack.pop() === 'f', 'should equal f');
        console.assert(mySetOfStack.pop() === 'd', 'should equal d');
        console.assert(mySetOfStack.pop() === 'c', 'should equal c');
        console.assert(mySetOfStack.pop() === 'b', 'should equal b');
        console.assert(mySetOfStack.pop() === 'a', 'should equal a');
        console.assert(mySetOfStack.pop() === null, 'should equal null');
        mySetOfStack.push('a');
        mySetOfStack.push('b');
        console.assert(mySetOfStack.pop() === 'b', 'should equal b');
        // console.assert(mySetOfStack.peek() === 'a', 'should equal a');
        // console.assert(mySetOfStack.size() === 1, 'should equal 1');
        console.assert(mySetOfStack.pop() === 'a', 'should equal a');
        // console.assert(mySetOfStack.isEmpty() === true, 'should equal true');
        console.assert(mySetOfStack.pop() === null, 'should equal null');
        // console.assert(mySetOfStack.size() === 0, 'should equal 0');
        // console.assert(mySetOfStack.isEmpty() === true, 'should equal true');
        console.assert(mySetOfStack.pop() === null, 'should equal null');
        console.assert(mySetOfStack.pop() === null, 'should equal null');
        // console.assert(mySetOfStack.isEmpty() === true, 'should equal true');

        console.log('\n==================================\n');
        console.log(' Executed all assertions for a SetOfStacks ');
        console.log('\n==================================\n');
    }
    
    // test();
})();

/**
 * Problem 26
 * 2018-05-21
 * 
 * Create a tree class with the following methods: addChild, contains.
 */
const problem26 = new Problem(
    "Problem 26",
    [
        {input: [], expected: true}
    ]);

(() => {
    class Node {
        constructor(value) {
            this.left = null;
            this._right = null;
            this._thread = null;
            this._threaded = false;
            this.value = value;
        }

        get right() {
            return this._right;
        }

        set right(val) {
            this._right = val;
            this._threaded = false;
        }

        get thread() {
            return this._thread;
        }

        set thread(val) {
            this._thread = val;
            this._threaded = true;
        }

        get threaded() {
            return this._threaded;
        }

        getLeftmost() {
            let prev = null;
            let node = this;

            while (node) {
                prev = node;
                node = node.left;
            }

            return prev;
        }
    }

    /**
     * A binary search tree.
     */
    class Bst {
        constructor(values) {
            this.root = null;

            if (typeof values !== "undefined") {
                for (const val of values)
                    this.add(val);
            }
        }

        add(val) {
            const node = new Node(val);

            if (!this.root)
                this.root = node;
            else
                this._add(node, this.root);
        }

        _add(node, parent) {
            if (node.value < parent.value) {
                if (parent.left)
                    this._add(node, parent.left);
                else {
                    parent.left = node;
                    node.thread = parent;
                }
            } else {
                if (parent.right)
                    this._add(node, parent.right);
                else {
                    parent.right = node;
                    node.thread = parent.thread;
                }
            }
        }

        contains(val) {
            let node = this.root;

            while (node) {
                if (val === node.value)
                    return true;
                
                if (val < node.value)
                    node = node.left;
                else
                    node = node.right;
            }

            return false;
        }

        applyCallback(callback) {
            let node = this.root.getLeftmost();

            while (node) {
                const ret = callback(node.value);

                if (typeof ret !== "undefined")
                    node.value = ret;
                
                if (node.threaded)
                    node = node.thread;
                else if (node.right)
                    node = node.right.getLeftmost();
            }
        }
    }

    function testVals(bst, values) {
        for (const val of values) {
            assert.deepStrictEqual(
                true,
                bst.contains(val),
                "BST does not contain a value with which it was initialised.");
        }

        assert.deepStrictEqual(
            false,
            bst.contains(99),
            "BST contains a value that was never added.");
    }

    function test() {
        let values = [8, 10, 3, 1, 6, 7, 4, 10, 14, 13];
        const bst = new Bst(values);

        // console.log(util.inspect(bst, false, null));
        testVals(bst, values);

        const callback = v => ++v;
        values = values.map(callback);
        bst.applyCallback(callback);

        testVals(bst, values);
    }

    // test();
})();

// -----------------------------------------------------------------------------

(() => {
    // problem26.test(undefined, "");

    const BST = function (val) {
      this.value = val;
      this.left = null;
      this.right = null;
  
      this.add = (val) => {
        let node = new BST(val);
//         if(this.left === null && this.right === null) this.value = val;
//         else {
          if (val < this.value) {
            if(this.left)  this.left.add(val);
            else this.left = node;
          }
          else if (val > this.value) {
            if (this.right) this.right.add(val);
            else this.right = node;
          }          
       // }
                                                                        

      };
      this.contains = (tgt)=> {
        if (this.value === tgt) return true;
        else if (tgt < this.value && this.left) return this.left.contains(tgt);
        else if (tgt > this.value && this.right) return this.right.contains(tgt);
        else return false;
      }

      this.applyCallback = (cb) => {
        if(this.left) this.left.applyCallback(cb);
        cb(this.value);
        if(this.right) this.right.applyCallback(cb);
      }
    }


//     BST.prototype.add = function(val) {
//         let node = new BST(val);
//         if (val < this.value) {
//           if(this.left)  this.left.add(val);
//           else this.left = node;
//         }
//         else if (val > this.value) {
//           if (this.right) this.right.add(val);
//           else this.right = node;
//         }
//     }
    
//     BST.prototype.contains = function(tgt) {
//         if (this.value === tgt) return true;
//         else if (tgt < this.value && this.left) return this.left.contains(tgt);
//         else if (tgt > this.value && this.right) return this.right.contains(tgt);
//         else return false;
//     }
    
//     BST.prototype.applyCallback =  function(cb) {
//         if(this.left) this.left.applyCallback(cb);
//         cb(this.value);
//         if(this.right) this.right.applyCallback(cb);
//     }
    
  
    
    
    
    
/*
           5
           
        /\   /\
       2  3  6 7
           \    /\
            4     8     

*/ 
    function testVals(bst, values) {
        for (const val of values) {
            assert.deepStrictEqual(
                true,
                bst.contains(val),
                "BST does not contain a value with which it was initialised.");
        }

        assert.deepStrictEqual(
            false,
            bst.contains(99),
            "BST contains a value that was never added.");
    }

    function test() {
        let values = [8, 10, 3, 1, 6, 7, 4, 10, 14, 13];
        const bst = new BST(8);
        
        for (const v of values.slice(1))
            bst.add(v);

        // console.log(util.inspect(bst, false, null));
        testVals(bst, values);

        const callback = v => ++v;
        values = values.map(callback);
        bst.applyCallback(callback);

        testVals(bst, values);
        console.log("done");
    }
    
    function test2() {
        let myBst = new BST(5);
    
        myBst.add(2);
        myBst.add(3);
        myBst.add(7);
        myBst.add(6);
        myBst.add(4);
        myBst.add(8);

        console.assert((myBst.left.right.value) === 3, 'should equal 3');
        console.assert((myBst.right.left.value) === 6, 'should equal 6');
        console.assert((myBst.right.right.value) === 8, 'should equal 8');
        myBst.add(7);
        console.assert((myBst.contains(7)) === true, 'should equal true');
        console.assert((myBst.contains(6)) === true, 'should equal true');
        console.assert((myBst.contains(8)) === true, 'should equal false');
        console.assert((myBst.contains(9)) === false, 'should equal false');


        let array = [];
        let func = function(value) { array.push(value * 2); };
        myBst.applyCallback(func);
        console.log(array);
        console.assert(_.isEqual(array, [4, 6, 8, 10, 12, 14, 16]), 'should equal true');
        console.log('>>>>>>>>>>>>>');
        console.log(myBst);
    }
    
   // test2();
})();

/**
 * Problem 27
 * 2018-05-22
 *
 * Perform a pre-order traversal of a binary tree. It must print the values in 
 * the tree's pre-order traversal as a single line of space-separated values.
 */
(() => {
    class Node {
        constructor(value) {
            this.left = null;
            this._right = null;
            this._thread = null;
            this._threaded = false;
            this.value = value;
        }

        get right() {
            return this._right;
        }

        set right(val) {
            this._right = val;
            this._threaded = false;
        }

        get thread() {
            return this._thread;
        }

        set thread(val) {
            this._thread = val;
            this._threaded = true;
        }

        get threaded() {
            return this._threaded;
        }

        getLeftmost() {
            let prev = null;
            let node = this;
            
            while (node) {
                prev = node;
                node = node.left;
            }
            
            return prev;
        }
    }

    /**
     * A binary search tree.
     */
    class Bst {
        constructor(values) {
            this.root = null;
            
            if (typeof values !== "undefined") {
                for (const val of values)
                    this.add(val);
            }
        }

        add(val) {
            const node = new Node(val);
            
            if (!this.root)
                this.root = node;
            else
                this._add(node, this.root);
        }

        _add(node, parent) {
            if (node.value < parent.value) {
                if (parent.left)
                    this._add(node, parent.left);
                else {
                    parent.left = node;
                    node.thread = parent;
                }
            } else {
                if (parent.right)
                    this._add(node, parent.right);
                else {
                    parent.right = node;
                    node.thread = parent.thread;
                }
            }
        }

        contains(val) {
            let node = this.root;
            
            while (node) {
                if (val === node.value)
                    return true;
                if (val < node.value)
                    node = node.left;
                else
                    node = node.right;
            }
            
            return false;
        }

        applyCallback(callback) {
            let node = this.root.getLeftmost();
            
            while (node) {
                const ret = callback(node.value);
                
                if (typeof ret !== "undefined")
                    node.value = ret;
                
                if (node.threaded)
                    node = node.thread;
                else if (node.right)
                    node = node.right.getLeftmost();
            }
        }

        * iteratePreOrder(node) {
            yield node.value;
            
            if (node.left)
                yield* this.iteratePreOrder(node.left);
            
            if (node.right)
                yield* this.iteratePreOrder(node.right);
        }

        * [Symbol.iterator]() {
            yield* this.iteratePreOrder(this.root);
        }
    }

    function test() {
        let values = [8, 10, 3, 1, 6, 7, 4, 10, 14, 13];
        const bst = new Bst(values);
        
        let out = "";
        
        for (const val of bst) {
            out += val + " ";
        }
        
        console.log(out.trimRight());
    }

    // test();
})();

// -----------------------------------------------------------------------------

(() => {
  function preOrder(root) {
      var str = "";
      function traverse(node) {
          str += node.data + " "
          if(node.left) traverse(node.left);
          if(node.right) traverse(node.right);            
      }
      traverse(root);
      console.log(str);
  }

})();

/**
 * Problem 28
 * 2018-05-22
 *
 * Find the depth/height of a BST.
 */
const problem28 = new Problem(
    "Problem 28",
    [
        {input: [[8, 10, 3, 1, 6, 7, 4, 14, 13]], expected: 3},
        {input: [[50, 17, 76, 9, 23, 54, 14, 19, 72, 12, 67]], expected: 4}
    ], false);

(() => {
    class Node {
        constructor(value) {
            this.left = null;
            this._right = null;
            this._thread = null;
            this._threaded = false;
            this.value = value;
        }

        get right() {
            return this._right;
        }

        set right(val) {
            this._right = val;
            this._threaded = false;
        }

        get thread() {
            return this._thread;
        }

        set thread(val) {
            this._thread = val;
            this._threaded = true;
        }

        get threaded() {
            return this._threaded;
        }

        getLeftmost() {
            let prev = null;
            let node = this;
            while (node) {
                prev = node;
                node = node.left;
            }
            return prev;
        }
    }

    /**
     * A binary search tree.
     */
    class Bst {
        constructor(values) {
            this.root = null;
            if (typeof values !== "undefined") {
                for (const val of values)
                    this.add(val);
            }
        }

        add(val) {
            const node = new Node(val);
            if (!this.root)
                this.root = node;
            else
                this._add(node, this.root);
        }

        _add(node, parent) {
            if (node.value < parent.value) {
                if (parent.left)
                    this._add(node, parent.left);
                else {
                    parent.left = node;
                    node.thread = parent;
                }
            }
            else {
                if (parent.right)
                    this._add(node, parent.right);
                else {
                    parent.right = node;
                    node.thread = parent.thread;
                }
            }
        }

        contains(val) {
            let node = this.root;
            while (node) {
                if (val === node.value)
                    return true;
                if (val < node.value)
                    node = node.left;
                else
                    node = node.right;
            }
            return false;
        }

        applyCallback(callback) {
            let node = this.root.getLeftmost();
            while (node) {
                const ret = callback(node.value);
                if (typeof ret !== "undefined")
                    node.value = ret;
                if (node.threaded)
                    node = node.thread;
                else if (node.right)
                    node = node.right.getLeftmost();
            }
        }

        * depth(node = this.root, depth = 0) {
            yield depth;
            
            if (node.left)
                yield* this.depth(node.left, depth + 1);
            
            if (node.right)
                yield* this.depth(node.right, depth + 1);
        }

        * iteratePreOrder(node) {
            yield node.value;
            if (node.left)
                yield* this.iteratePreOrder(node.left);
            if (node.right)
                yield* this.iteratePreOrder(node.right);
        }

        * [Symbol.iterator]() {
            yield* this.iteratePreOrder(this.root);
        }
    }

    function test(values) {
        const bst = new Bst(values);
        
        return Math.max(...bst.depth());
    }

    problem28.test(test, "Mark");
})();

// -----------------------------------------------------------------------------

(() => {

function treeHeight(root) {
  let leftHeight = 0;
  let rightHeight = 0;
  let leftNode = root;  
  let rightNode = root;  
  
  while(leftNode) {
    leftHeight++;
    leftNode = node.left;
  }
  
  while(rightNode) {
    rightHeight++;
    rightNode = node.right;
  }

    console.log(leftHeight > rightHeight? leftHeight : rightHeight)
}
  
  
function treeHeight(root) {
  let leftHeight = 0;
  let rightHeight = 0;
    function traverse(node) {
        if(node.left) {
            leftHeight++;
            traverse(node.left);
        }
        if(node.right) {
            rightHeight++;
            traverse(node.right);
        }
    }
    traverse(root);
    console.log(leftHeight > rightHeight? leftHeight : rightHeight)
}  
  
})();

/**
 * Problem 29
 * 2018-05-23
 *
 * Print the values of the outer-most nodes from left to right.
 */
const problem29 = new Problem(
    "Problem 29",
    [
        {input: [[8, 10, 3, 1, 6, 7, 4, 14, 13]], expected: [1, 3, 8, 10, 14]},
        {input: [[50, 17, 76, 9, 23, 54, 14, 19, 72, 12, 67]], expected: [9, 17, 50, 76]},
        {input: [[25, 20, 36, 10, 22, 30, 40, 5, 12, 28, 38, 48, 1, 8, 15, 45, 50]], expected: [1, 5, 10, 20, 25, 36, 40, 48, 50]}
    ], false);

(() => {
    class Node {
        constructor(value) {
            this.left = null;
            this._right = null;
            this._thread = null;
            this._threaded = false;
            this.value = value;
        }

        get right() {
            return this._right;
        }

        set right(val) {
            this._right = val;
            this._threaded = false;
        }

        get thread() {
            return this._thread;
        }

        set thread(val) {
            this._thread = val;
            this._threaded = true;
        }

        get threaded() {
            return this._threaded;
        }

        getLeftmost() {
            let prev = null;
            let node = this;

            while (node) {
                prev = node;
                node = node.left;
            }

            return prev;
        }
    }

    /**
     * A binary search tree.
     */
    class Bst {
        constructor(values) {
            this.root = null;
            if (typeof values !== "undefined") {
                for (const val of values)
                    this.add(val);
            }
        }

        add(val) {
            const node = new Node(val);

            if (!this.root)
                this.root = node;
            else
                this._add(node, this.root);
        }

        _add(node, parent) {
            if (node.value < parent.value) {
                if (parent.left)
                    this._add(node, parent.left);
                else {
                    parent.left = node;
                    node.thread = parent;
                }
            } else {
                if (parent.right)
                    this._add(node, parent.right);
                else {
                    parent.right = node;
                    node.thread = parent.thread;
                }
            }
        }

        getTopView() {
            let node = this.root;
            let out = [this.root.value];

            while (node) {
                if (node.left) {
                    node = node.left;
                    out.push(node.value);
                } else {
                    break;
                }
            }

            out.reverse();
            node = this.root;

            while (node) {
                if (node.right) {
                    node = node.right;
                    out.push(node.value);
                } else {
                    break;
                }
            }

            return out;
        }
    }

    function test(values) {
        const bst = new Bst(values);

        return bst.getTopView();
    }
    
    function test2(values) {
        const bst = new Bst(values);
        
        function getTopView(node) {
            let arr = [];
            let leftNode = node;
            let rightNode = node;

            while(leftNode && leftNode.left) {
                leftNode = leftNode.left;
                arr.push(leftNode.value);
            }
          
            arr.reverse().push(node.value);
            
            while(rightNode && rightNode.right) {
              rightNode = rightNode.right;
              arr.push(rightNode.value);
            }
            
            return arr;
        }
        
        return getTopView(bst.root);
    }
    
    problem29.test(test, "Mark");
    problem29.test(test2, "Anonpunk");
})();

// -----------------------------------------------------------------------------

(() => {  
  const topView = node => {
    let arr = [];
    let leftNode = node;
    let rightNode = node;

    while(leftNode && leftNode.left) {
        leftNode = leftNode.left;
        arr.push(leftNode.value);
    }
    arr.push(node.value);
    while(rightNode && rightNode.right) {
      rightNode = rightNode.right;
      arr.push(rightNode.value);
    }
    return arr;
  }
})();

/**
 * Problem 30
 * 2018-05-23
 *
 * Print out a breadth-first search iteration of a BST.
 */
const problem30 = new Problem(
    "Problem 30",
    [
        {input: [[8, 10, 3, 1, 6, 7, 4, 14, 13]], expected: [8, 3, 10, 1, 6, 14, 4, 7, 13]},
        {input: [[50, 17, 76, 9, 23, 54, 14, 19, 72, 12, 67]], expected: [50, 17, 76, 9, 23, 54, 14, 19, 72, 12, 67]},
        {input: [[25, 20, 36, 10, 22, 30, 40, 5, 12, 28, 38, 48, 1, 8, 15, 45, 50]], expected: [25, 20, 36, 10, 22, 30, 40, 5, 12, 28, 38, 48, 1, 8, 15, 45, 50]},
    ], false);

(() => {
    class LLNode {
        constructor(value) {
            this.value = value;
        }
    }

    class Queue {
        constructor(values) {
            this._front = null;
            this.back = null;

            if (typeof values !== "undefined") {
                for (const val of values)
                    this.push(val);
            }
        }

        push(value) {
            const temp = new LLNode(value);

            if (!this.back) {
                this._front = temp;
                this.back = temp;
            } else {
                this.back.next = temp;
                this.back = temp;
            }
        }

        pop() {
            if (this.empty)
                throw "Cannot remove an element from an empty queue.";

            const temp = this._front;
            this._front = temp.next;

            if (!this._front)
                this.back = null;

            return temp.value;
        }

        get empty() {
            return !this._front;
        }

        get front() {
            if (this.empty)
                throw "Cannot retrieve the front element from an empty queue.";

            return this._front.value;
        }
    }

    class Node {
        constructor(value) {
            this.left = null;
            this._right = null;
            this._thread = null;
            this._threaded = false;
            this.value = value;
        }

        get right() {
            return this._right;
        }

        set right(val) {
            this._right = val;
            this._threaded = false;
        }

        get thread() {
            return this._thread;
        }

        set thread(val) {
            this._thread = val;
            this._threaded = true;
        }

        get threaded() {
            return this._threaded;
        }

        getLeftmost() {
            let prev = null;
            let node = this;

            while (node) {
                prev = node;
                node = node.left;
            }

            return prev;
        }
    }

    /**
     * A binary search tree.
     */
    class Bst {
        constructor(values) {
            this.root = null;

            if (typeof values !== "undefined") {
                for (const val of values)
                    this.add(val);
            }
        }

        add(val) {
            const node = new Node(val);

            if (!this.root)
                this.root = node;
            else
                this._add(node, this.root);
        }

        _add(node, parent) {
            if (node.value < parent.value) {
                if (parent.left)
                    this._add(node, parent.left);
                else {
                    parent.left = node;
                    node.thread = parent;
                }
            }
            else {
                if (parent.right)
                    this._add(node, parent.right);
                else {
                    parent.right = node;
                    node.thread = parent.thread;
                }
            }
        }

        * [Symbol.iterator]() {
            const queue = new Queue([this.root]);

            while (!queue.empty) {
                let node = queue.pop();
                yield node.value;

                if (node.left) {
                    queue.push(node.left);
                }

                if (node.right) {
                    queue.push(node.right);
                }
            }
        }
    }

    function test(values) {
        const bst = new Bst(values);
        
        return [...bst];
    }
    
    function test2(values) {
        const bst = new Bst(values);
        
        function bfTraversal(root) {
            var output = [];
            var myQ = []
            myQ.push(root);

            while(myQ.length) {
              let node = myQ.shift();
              output.push(node.value);
                
              if(node.left) 
                  myQ.push(node.left)
                
              if(node.right) 
                  myQ.push(node.right)
            }
            
            return output;
        }
        
        return bfTraversal(bst.root);
    }

    problem30.test(test, "Mark");
    problem30.test(test2, "Anonpunk");
})();

// -----------------------------------------------------------------------------

(() => {
  function bfTraversal(root) {
    var output = [];
    var myQ = []
    myQ.push(root);

    while(myQ.length) {
      node = myQ.shift();
      output.push(node.value);
      if(node.left) {myQ.push(node.left)}
      if(node.right) {myQ.push(node.right)}
    }
    console.log(output);
  }
})();

/**
 * Problem 31
 * 2018-05-24
 *
 *
 */
const problem31 = new Problem(
    "Problem 31",
    [
        {input: [[8, 10, 3, 1, 6, 7, 4, 14, 13], 1, 6], expected: 3},
        {input: [[8, 10, 3, 1, 6, 7, 4, 14, 13], 1, 7], expected: 3},
        {input: [[8, 10, 3, 1, 6, 7, 4, 14, 13], 4, 7], expected: 6},
        {input: [[8, 10, 3, 1, 6, 7, 4, 14, 13], 4, 3], expected: 8},
        {input: [[8, 10, 3, 1, 6, 7, 4, 14, 13], 4, 13], expected: 8},
        {input: [[8, 10, 3, 1, 6, 7, 4, 14, 13], 14, 13], expected: 10},
        {input: [[8, 10, 3, 1, 6, 7, 4, 14, 13], 3, 10], expected: 8},
        {input: [[8, 10, 3, 1, 6, 7, 4, 14, 13], 3, 14], expected: 8}
    ]);

(() => {
    /**
     * A BST node.
     */
    class Node {
        constructor(value) {
            this.left = null;
            this._right = null;
            this._thread = null;
            this._threaded = false;
            this.value = value;
        }

        get right() {
            return this._right;
        }

        set right(val) {
            this._right = val;
            this._threaded = false;
        }

        get thread() {
            return this._thread;
        }

        set thread(val) {
            this._thread = val;
            this._threaded = true;
        }

        get threaded() {
            return this._threaded;
        }

        getLeftmost() {
            let prev = null;
            let node = this;

            while (node) {
                prev = node;
                node = node.left;
            }

            return prev;
        }
    }

    /**
     * A binary search tree.
     */
    class Bst {
        constructor(values) {
            this.root = null;

            if (typeof values !== "undefined") {
                for (const val of values)
                    this.add(val);
            }
        }

        add(val) {
            const node = new Node(val);

            if (!this.root)
                this.root = node;
            else
                this._add(node, this.root);
        }

        _add(node, parent) {
            if (node.value < parent.value) {
                if (parent.left)
                    this._add(node, parent.left);
                else {
                    parent.left = node;
                    node.thread = parent;
                }
            } else {
                if (parent.right)
                    this._add(node, parent.right);
                else {
                    parent.right = node;
                    node.thread = parent.thread;
                }
            }
        }

        getParents(val) {
            const stack = [];
            let node = this.root;

            while (node) {
                if (val === node.value)
                    return stack;

                stack.push(node);

                if (val < node.value)
                    node = node.left;
                else
                    node = node.right;
            }

            return null; // This is returned when the node is not found.
        }

        lca(x, y) {
            let xParents = this.getParents(x);
            let yParents = this.getParents(y);

            // Ensures xParents is the shorter stack.
            // Swaps the variables if xParents is currently the longer one.
            if (xParents.length > yParents.length) {
                let temp = xParents;
                xParents = yParents;
                yParents = temp;
            }

            // Bring the longer stack to the same length as the shorter one.
            while (yParents.length > xParents.length)
                yParents.pop();

            while (xParents.length > 0 && yParents.length > 0) {
                const xVal = xParents.pop().value;

                if (xVal === yParents.pop().value)
                    return xVal;
            }

            return this.root.value;
        }

        lca2(x, y) {
            const stack = this.getParents(x);

            if (stack === null)
                throw new Error(`The tree does not contain the value '${x}'.`);

            let node = this.root;
            let i = 0;

            // Node isn't null.
            // Node is not y.
            // index is still within stack's range.
            // Node is equal to the value in the stack at the current index.
            while (node && node.value != y && i < stack.length && stack[i].value === node.value) {
                if (y < node.value)
                    node = node.left;
                else
                    node = node.right;
                ++i;
            }

            // Kind of pointless because this method relies on the assumption that y exists anyway.
            if (node === null)
                throw new Error(`The tree does not contain the value '${y}'.`);

            return i === 0 ? this.root.value : stack[i - 1].value;
        }
    }

    function test(values, x, y) {
        const bst = new Bst(values);

        const lca = bst.lca(x, y);
        const lca2 = bst.lca2(x, y);
        const lca2Flipped = bst.lca2(y, x);
        
        if (lca != lca2)
            throw new Error(`Mismatch with lca2: ${lca} != ${lca2}`);

        if (lca2 != lca2Flipped)
            throw new Error(`Mismatch when arguments flipped: ${lca2} != ${lca2Flipped}`);

        return lca;
    }
    
    function lca(root, v1, v2) {
        // if v1 > node.val && v2 > node.value | traverse right
        // if v1 < node.val && v2 < node.value | traverse left
        if (v1 > root.value && v2 > root.value) { // traverse right
          // console.log('right');
          return find(root.right, v1, v2, root.value);   
        } else if (v1 < root.value && v2 < root.value) { // traverse left
          // console.log('left');
          return find(root.left, v1, v2, root.value);   
        } else {
          // if v1 > node.val && v2 < node.value | return root
          // if v1 < node.val && v2 > node.value | return root
          return root.value
        }


        function find(node, tgt1, tgt2, prev) {
          if (node.value === tgt1 || node.value === tgt2) return prev;
          else {
            if (node.left) {
                const result = find(node.left, tgt1, tgt2, node.value);
                
                if (result)
                    return result;
            }
              
            if (node.right) {
                const result = find(node.right, tgt1, tgt2, node.value);
                
                if (result)
                    return result;
            }
          }
        }
    }

    problem31.test(test, "Mark");
    // problem31.test((values, x, y) => lca(new Bst(values).root, x, y), "Anonpunk");
})();

// -----------------------------------------------------------------------------

(() => {
  function lca(root, v1, v2) {

    // if v1 > node.val && v2 > node.value | traverse right
    // if v1 < node.val && v2 < node.value | traverse left
    if (v1 > root.value && v2 > root.value) { // traverse right
      console.log('right');
      return find(root.right, v1, v2, root.value);   
    } else if (v1 < root.value && v2 < root.value) { // traverse left
      console.log('left');
      return find(root.left, v1, v2, root.value);   
    } else {
      // if v1 > node.val && v2 < node.value | return root
      // if v1 < node.val && v2 > node.value | return root
      return root.value
    }


    function find(node, tgt1, tgt2, prev) {
      if (node.value === tgt1 || node.value === tgt2) return prev;
      if (!node) return prev;
      else {
        if (node.left) return find(node.left, tgt1, tgt2, node.value);
        if (node.right) return find(node.right, tgt1, tgt2, node.value);
      }
    }

  }

})();

/**
 * Problem 32
 * 2018-05-30
 *
 *
 */
const problem32 = new Problem(
    "Problem 32",
    [
        {input: [], expected: true}
    ]);

(() => {
    // problem32.test(undefined, "");
})();

// -----------------------------------------------------------------------------

(() => {
  
  // problem32.test(undefined, "");
})();