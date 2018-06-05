const Node = (val) => ({value: val, edges: []})

const Graph = function() {
	this.storage = {}
}

Graph.prototype.addNode = function(val) { this.storage[val] = Node(val); }

Graph.prototype.removeNode = function (val) { delete this.storage[val]; }

Graph.prototype.addEdge = function(fromNode, toNode) {
	if(!this.storage[fromNode]) this.addNode(fromNode);
	if(!this.storage[toNode]) this.addNode(toNode);
	this.storage[fromNode].edges.push(toNode);
	this.storage[toNode].edges.push(fromNode);
};

Graph.prototype.removeEdge = function(fromNode, toNode) {
	var indexOfTo = this.storage[fromNode].edges.indexOf(toNode);
	var indexOfFrom = this.storage[toNode].edges.indexOf(fromNode);

	this.storage[fromNode].edges.splice(indexOfTo, 1);
	this.storage[toNode].edges.splice(indexOfFrom, 1);
};

Graph.prototype.hasEdge = function(fromNode, toNode) { return this.storage[fromNode].edges.indexOf(toNode) > -1 ? true : false; }

Graph.prototype.contains = function(nodeVal) { return Boolean(this.storage[nodeVal]); }

Graph.prototype.forEachNode = function(cb) {
	for (var key in this.storage) {
		cb(this.storage[key].value)
	}
};



