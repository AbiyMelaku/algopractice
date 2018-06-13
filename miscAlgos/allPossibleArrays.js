
/*
 	A binary search tree was created by traversing through an array from left to right an inserting each element.  Given a BST with distinct elements, print all possible arrays that could've lead to this tree 

	Example: 
	Input:    
			    2
			  /   \
			 1	   3	

	Output: [1,2,3],  [2,3,1]
 
 */


var arr = []


function subTreeCombo(subTree) {
	var comboArr = [];

	if(subTree.left && subTree.right) {
			arr.push([subTree.value, subTree.left.value, subTree.right.value])
	} else if (subTree.left) {
			arr.push([subTree.value, subTree.left.value])
	} else if (subTree.right) {
			arr.push([subTree.value, subTree.right.value])
	} else {
		comboArr.push([subTree.value])
	}

	return comboArr;
}


const allPossibleArrays = (root) => {
	// if root has right and left
}

var myBST = new BST(2);
myBST.insert(1);
myBST.insert(3);

console.log(JSON.stringify(myBST));
