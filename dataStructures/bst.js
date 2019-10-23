 Implement a function to check if a binary tree is balanced.  For the purpose of this question, a balance tree is a tree such that the heights of the two sub-tress of any node never differ by more than one. 
 		3
   / \
  9  20
    /  \
   15   7
	True


  		 1
      / \
     2   2
    / \
   3   3
  / \
 4   4

	false
 */

const btHeight = (root, height = 0) => {
	if(!root) return 0;
  if (!root.left && !root.right) return height;
  return Math.max(
    (root.left && btHeight(root.left, height + 1)),
    (root.right && btHeight(root.right, height + 1))
  )
}

const balancedBT = (root) => {
    if (root.left && !balancedBT(root.left)) return false;
    if (root.right && !balancedBT(root.right)) return false;
    
    return Math.abs(btHeight(root.left, 0) - btHeight(root.right, 0)) <= 1
}
