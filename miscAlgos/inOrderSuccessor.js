/*
 Write an algorithm to find the next node (i.e. in-order successor) of a given node in a binary search tree. You may assume that each node has a link to its parent. 
 */

const Node = (val) => ({
  value: val,
  left: null,
  right: null,
  parent: null
})

const Node = (val) => ({
  value: val,
  left: null,
  right: null,
  parent: null
})

const findNode = (root, tgt) => {
  if (root.value === tgt) return root;
  else if (root.value < tgt && root.right) return findNode(root.right, tgt);
  else if (root.value > tgt && root.left) return findNode(root.left, tgt);
  else return null;
}

const inOrderSuccessor = (root, tgt) => {
  // Search node
  let tgtNode = findNode(root, tgt);
  let successor = null;
  let parent = root;
  if (tgtNode === null) return null;

  //Case 1: Node has right subtree
  if (tgtNode.right) {
    // keep going left 
    successor = tgtNode.right
    while (successor && successor.left) {
      successor = successor.left
    }
    return successor;
  } else {
    // Case 2: No right sub tree
    while (parent !== tgtNode) {
      if (tgtNode.value < parent.value) {
        successor = parent;
        parent = parent.left;
      } else {
        parent = parent.right;
      }
    }
    return successor;
  }
}

const inOrderSuccessor = (root, tgt) => {
  let lastNodeWasTgt = false;
  let successor = null;

  const recurser = (root, tgt, cb) => {
    if (successor) return;
    if (root.left) recurser(root.left, tgt);
    if (lastNodeWasTgt) cb(root);
    if (root.right) recurser(root.right, tgt);
  }

  function returnSuccessor(node) {
    successor = node;
  }

  recurser(root, tgt, returnSuccessor);
  return successor;
}