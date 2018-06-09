const Node = (val) => ({value: val, edges: {}})

const Graph = function() {
	this.storage = {}
}

Graph.prototype.addNode = function(val) { if(!this.storage[val]) this.storage[val] = Node(val); }

Graph.prototype.removeNode = function (val) { if(this.storage[val]) delete this.storage[val]; }

Graph.prototype.addEdge = function(fromNode, toNode) {
	if(!this.storage[fromNode]) this.addNode(fromNode);
	if(!this.storage[toNode]) this.addNode(toNode);
	this.storage[fromNode].edges[toNode] = this.storage[toNode];
	this.storage[toNode].edges[fromNode] = this.storage[fromNode];
};

Graph.prototype.removeEdge = function(fromNode, toNode) {
	delete this.storage[fromNode].edges[toNode]
	delete this.storage[toNode].edges[fromNode];
};

Graph.prototype.hasEdge = function(fromNode, toNode) { return Boolean(this.storage[fromNode].edges[toNode]) }

Graph.prototype.contains = function(nodeVal) { return Boolean(this.storage[nodeVal]); }

Graph.prototype.forEachNode = function(cb) {
	for (var key in this.storage) {
		cb(this.storage[key].value)
	}
};


const graphBfs = (node, cb) => {
	let myQ = [];
	node.visited = true;
	myQ.push(node);

	while(myQ.length) {
		let node = myQ.shift();
		
		cb(node);

		for(var edge in node.edges) {
			if(!edge.visited) {
				edge.visited = true;
				myQ.push(edge);
			}
		} //for
	}//while
}




const DirectedGraph = function() {
	this.storage = {}
}

DirectedGraph.prototype.addNode = function(val) { if(!this.storage[val]) this.storage[val] = Node(val); }

DirectedGraph.prototype.removeNode = function (val) { if(this.storage[val]) delete this.storage[val]; }

DirectedGraph.prototype.addEdge = function(fromNode, toNode) {
	if(!this.storage[fromNode]) this.addNode(fromNode);
	if(!this.storage[toNode]) this.addNode(toNode);
	this.storage[fromNode].edges[toNode] = this.storage[toNode];
};

DirectedGraph.prototype.removeEdge = function(fromNode, toNode) {
	delete this.storage[fromNode].edges[toNode]
};

DirectedGraph.prototype.hasEdge = function(fromNode, toNode) { return Boolean(this.storage[fromNode].edges[toNode]) }

DirectedGraph.prototype.contains = function(nodeVal) { return Boolean(this.storage[nodeVal]); }

DirectedGraph.prototype.forEachNode = function(cb) {
	for (var key in this.storage) {
		cb(this.storage[key].value)
	}
};


/*
Given a directed graph, write an algorithm to find out if there is a route between 2 nodes
 */

const areConnected = (nodeA, nodeB) => {
	
	const hasPath = (node1, node2) => {
		let myQ = [];
		let node = nodeA;
		node.visited = true;


		myQ.push(node);

		while(myQ.length) {
			let node = myQ.shift();
			if(node.value === nodeB.value) return true;
			
			else {
				for(var edge in node.edges) {
					if (!node.edges[edge].visited) {
						node.edges[edge].visited = true;
						myQ.push(node.edges[edge]);
					}
				}
			}
		}
		return false;
	}

	return hasPath(nodeA, nodeB) || hasPath(nodeB, nodeA);
}

