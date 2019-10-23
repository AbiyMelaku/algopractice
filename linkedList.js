const Node = (val) => ({value: val, next: null});

/*
	Linked List
 */

const LinkedList = function() {
  this.list = {};
  this.head = null;
  this.tail = null;
}

LinkedList.prototype.addToTail = (val) => {
  var newNode = new Node(val);

  if (!this.head && !this.tail) this.head = this.tail = newNode;
  else {
    this.tail.next = newNode;
    this.tail = newNode;
  }
};

LinkedList.prototype.removeHead = () => {
  if (this.head) {
    oldHead = this.head;
    this.head = this.head.next;
    return oldHead.value;
  }
};


/*
	BST
 */


const BST = function(val) {
  this.value = val;
  this.left = null;
  this.right = null;
}

BST.prototype.add = function(val) {
    let node = new BST(val);
    if (val < this.value) {
      if(this.left)  this.left.add(val);
      else this.left = node;
    }
    else if (val > this.value) {
      if (this.right) this.right.add(val);
      else this.right = node;
    }
}

BST.prototype.contains = function(tgt) {
    if (this.value === tgt) return true;
    else if (tgt < this.value && this.left) return this.left.contains(tgt);
    else if (tgt > this.value && this.right) return this.right.contains(tgt);
    else return false;
}

BST.prototype.applyCallback =  function(cb) {
    if(this.left) this.left.applyCallback(cb);
    cb(this.value);
    if(this.right) this.right.applyCallback(cb);
}
    
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


console.log('\n==================================\n');
console.log(' Given a binary tree, design an algorithm which creates a linked list of all the nodes at each depth (eg: a tree with depth D, will have 3 linked lists)  ');
console.log('\n==================================\n');

function treeToLinkedList (root, cb) {
	let myQ = [];
	let myQ2 = [];
	let level = 0
	myQ.push(root)


	while(myQ.length) {
		let node = myQ.shift();
		myQ2.push(node);
		console.log('>>>>>>>>', myQ);
		cb(node);

		while(node === null) {
			myQ.push(null);
			myQ.push(null);
			node = myQ.shift();
		}

		if(node.left) myQ.push(node.left)
		else myQ.push(null);

		if(node.right) myQ.push(node.right);
		else myQ.push(null);
	}
}


/*
    5
 /    \
2      7
 \     /\
  3   6  8
   \
    4


*/

let myBst = new BST(5);

myBst.add(2);
myBst.add(3);
myBst.add(7);
myBst.add(6);
myBst.add(4);
myBst.add(8);

console.log('\n==================================\n');
console.log(' Executed all assertions for a queue ');
console.log('\n==================================\n');



treeToLinkedList(myBst, node => console.log(node));

console.log('\n==================================\n');
console.log(' Executed all assertions for a queue ');
console.log('\n==================================\n');

/*
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
 */