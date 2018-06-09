describe('graph', function() {
  var graph;

  beforeEach(function() {
    graph = new Graph();
  });

  it('should have methods named "addNode", "contains", "removeNode", "addEdge", "hasEdge", "removeEdge" and "forEachNode"', function() {
    expect(graph.addNode).to.be.a("function");
    expect(graph.contains).to.be.a("function");
    expect(graph.removeNode).to.be.a("function");
    expect(graph.hasEdge).to.be.a("function");
    expect(graph.addEdge).to.be.a("function");
    expect(graph.removeEdge).to.be.a("function");
    expect(graph.forEachNode).to.be.a("function");
  });

  it('should store values as nodes that were inserted', function() {
    graph.addNode(1);
    expect(graph.contains(1)).to.equal(true);
  });

  it('should remove nodes that were inserted', function() {
    graph.addNode(2);
    expect(graph.contains(2)).to.equal(true);
    graph.removeNode(2);
    expect(graph.contains(2)).to.equal(false);
  });

  it('should create edges between two nodes', function() {
    graph.addNode(2);
    graph.addNode(1);
    graph.addNode(3);
    graph.addEdge(3, 2);
    expect(graph.hasEdge(3, 2)).to.equal(true);
    expect(graph.hasEdge(3, 1)).to.equal(false);
  });

  it('should remove edges between nodes', function() {
    graph.addNode(4);
    graph.addNode(5);
    graph.addEdge(5, 4);
    expect(graph.hasEdge(4, 5)).to.equal(true);
    graph.removeEdge(5, 4);
    expect(graph.hasEdge(4, 5)).to.equal(false);
  });

  it('should execute a callback on each node in the graph', function() {
    var connectToFive = function(item) {
      graph.addEdge(item, 5);
    };
    graph.addNode(5);
    graph.addNode(2);
    graph.addNode(1);
    graph.addNode(3);
    graph.forEachNode(connectToFive);
    expect(graph.hasEdge(2, 5)).to.equal(true);
    expect(graph.hasEdge(1, 5)).to.equal(true);
    expect(graph.hasEdge(3, 5)).to.equal(true);
    expect(graph.hasEdge(5, 5)).to.equal(true);
  });


  it('should return a boolen if a path exists in the graph', function() {

    /*
      
      a -> b
      b -> c 
      c -> a
  
      a -> d 
      d -> e

     */
    var myDirectedGraph = new DirectedGraph();
    var connectToFive = function(item) {
      myDirectedGraph.addEdge(item, 5);
    };
    myDirectedGraph.addNode('a');
    myDirectedGraph.addNode('b');
    myDirectedGraph.addNode('c');
    myDirectedGraph.addNode('d');
    myDirectedGraph.addNode('e');
    myDirectedGraph.addEdge('a', 'b');
    myDirectedGraph.addEdge('b', 'c');
    myDirectedGraph.addEdge('c', 'a');
    myDirectedGraph.addEdge('a', 'd');
    myDirectedGraph.addEdge('d', 'e');


    console.log(myDirectedGraph);
    expect(areConnected(myDirectedGraph.storage['a'], myDirectedGraph.storage['b'])).to.equal(true);
    expect(areConnected(myDirectedGraph.storage['a'], myDirectedGraph.storage['c'])).to.equal(false);
    expect(areConnected(myDirectedGraph.storage['a'], myDirectedGraph.storage['e'])).to.equal(true);

    expect(myDirectedGraph.hasEdge('a', 'b')).to.equal(true);
    expect(myDirectedGraph.hasEdge('b', 'c')).to.equal(true);
    expect(myDirectedGraph.hasEdge('c', 'a')).to.equal(true);
    expect(myDirectedGraph.hasEdge('a', 'd')).to.equal(true);
    expect(myDirectedGraph.hasEdge('d', 'e')).to.equal(true);

    expect(myDirectedGraph.hasEdge('d', 'a')).to.equal(false);
    expect(myDirectedGraph.hasEdge('b', 'a')).to.equal(false);
    expect(myDirectedGraph.hasEdge('a', 'c')).to.equal(false);
    expect(myDirectedGraph.hasEdge('e', 'd')).to.equal(false);
    expect(myDirectedGraph.hasEdge('b', 'e')).to.equal(false);
    expect(myDirectedGraph.hasEdge('b', 'd')).to.equal(false);


  });
});