const Node = (val) => ({value: val, edges: {}})

const Graph = function() {
	this.storage = {}
}

Graph.prototype.addNode = function(val) { if(!this.storage[val]) this.storage[val] = Node(val); }

Graph.prototype.removeNode = function (val) { if(this.storage[val]) delete this.storage[val]; }

Graph.prototype.addEdge = function(fromNode, toNode) {
	if(!this.storage[fromNode]) this.addNode(fromNode);
	if(!this.storage[toNode]) this.addNode(toNode);
	this.storage[fromNode].edges[toNode] = true;
	this.storage[toNode].edges[fromNode] = true;
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



