"use strict";

/*
This Javascript code implements a Canvas demonstration of a Binary Search Tree with maximal depth = 4  
*/

var Debugger = function() { };// create  object
  Debugger.log = function(message) {
  try {
    console.log(message);
  } catch(exception) {
    return;
  }
}

function canvasSupport() {
  return !!document.createElement('canvas').getContext;
} 

function canvasApp() {

  var tree = null;// Binary Search Tree object
  var treeSave = null;

  function Node(key) {
    this.mKey = key;
    this.mLeft = null;
    this.mRight = null;
    this.mParent = null;   
  }// Node 

  // Node augmentation
  function DisplayNode(key) {
    Node.call(this, key);
  }// DisplayNode

  DisplayNode.prototype = new Node();
  DisplayNode.prototype.mRadius = 15;
  DisplayNode.prototype.xPos = 0;
  DisplayNode.prototype.yPos = 0;
  DisplayNode.prototype.yConnU = 0;
  DisplayNode.prototype.yConnD = 0;
  DisplayNode.prototype.mIndex = 0;
  DisplayNode.prototype.mDepth = 0;
  DisplayNode.prototype.updateGeometry = function() {
    this.xPos = xPos[this.mDepth][this.mIndex];// matrix mDepth x mIndex  
    this.yPos = yPos[this.mDepth];
    this.yConnU = this.yPos - this.mRadius;
    this.yConnD = this.yPos + this.mRadius;
  };


  // Tree base class
  function Tree() {// build an empty tree     
    this.mRoot = null;// build an empty tree

    this.clone = function(src) {
      // breadthFirstWalk based
      var queue = [];// src side 
      var queueP = [];// this side
      var x, last;//src side            
      var prevC;// this side
      var newnode = null; 
      if (src.mRoot == null) return;// src tree is empty
      queue.push(src.mRoot);
      last = null;
      prevC = null;
        
      while (queue.length > 0) {
        x = queue.shift();// walk on src
        newnode = new DisplayNode(x.mKey);              
        newnode.mParent = null;
        newnode.mLeft = null;
        newnode.mRight = null;                 
        if (x == src.mRoot) {// special case                 
          this.mRoot = newnode;
        } else {
          if (last.mParent != x.mParent) {// new parent needed
            prevC = queueP.shift();          
          } 
          if (x == x.mParent.mLeft) {// x is a left child
            prevC.mLeft = newnode;
          } else {// x is a right child
            prevC.mRight = newnode;                 
          }// if
          newnode.mParent = prevC;
        }// if             
        if (x.mLeft != null) {
          queue.push(x.mLeft);
        } 
        if (x.mRight != null) {
          queue.push(x.mRight);
        } 
        queueP.push(newnode);
        last = x;// src side          
      }
      return;
    };

    this.clear = function() {
      // based on breadthFirstWalk
      var queue = [];
      var x;
      if (this.mRoot == null) { 
        return; 
      }// tree is empty
      queue.push(this.mRoot);

      while (queue.length > 0) {    
        x = queue.shift();             
        if (x.mLeft != null) {
          queue.push(x.mLeft);
        } 
        if (x.mRight != null) {
          queue.push(x.mRight);
        } 
        if (x != null) {              
          x = null;// delete current node
        }               
      }// while
      this.mRoot = null;                 
    };

    this.search = function(node, key) {// search for a key, return a node, null when key not found
      while (node != null && key != node.mKey) {
        if (key < node.mKey) {
          node = node.mLeft;
        } else{ 
          node = node.mRight;
        }// if
      }// while
      return node; 
    };// search

    this.minimum = function(node) {// minimum of node subtree
      while (node.mLeft != null) {
        node = node.mLeft;
      }
      return node;
    };

    this.maximum = function(node) {// maximum of node subtree
      while (node.mRight != null) {
        node = node.mRight;
      }
      return node;
    };

    this.successor = function(node) {// successor of node
      if (node.mRight != null) {
        return this.minimum(node.mRight);
      }
      var ptr = node.mParent;
      while (ptr != null && node == ptr.mRight) {
        node = ptr; 
        ptr = ptr.mParent;
      }
      return ptr;
    };// successor

    this.predecessor = function(node) {// predecessor of node
      if (node.mLeft != null) {
        return this.maximum(node.mLeft);
      }
      var ptr = node.mParent;
      while (ptr != null && node == ptr.mLeft) {
        node = ptr; 
        ptr = ptr.mParent;
      }
      return ptr;
    };// predecessor

    this.insert = function(x) {// try to insert a new key, return true if insert allowed, false if not allowed
      var ptr = null;
      var ptr1 = this.mRoot;    

      if (this.mRoot == null) {// empty tree      
        this.mRoot = x;
        this.mRoot.mParent = null;
        this.mRoot.mLeft = null;
        this.mRoot.mRight = null;
        return;
      }// if

      while (ptr1 != null) {
        ptr = ptr1;
        if (x.mKey < ptr1.mKey) {
          ptr1 = ptr1.mLeft;
        } else {
          ptr1 = ptr1.mRight;
        }// if            
      } // while     

      x.mParent = ptr; 

      if (x.mKey < ptr.mKey) {
        ptr.mLeft = x;
      } else {
        ptr.mRight = x;
      }// if
      return true;
    };// insert

    this.remove = function(z) {// z is a node, not a key
      var y = null;
       
      if (z == this.mRoot && z.mLeft == null && z.mRight == null) {// root is last remaining node
        this.mRoot = null;
      } else if (z.mLeft == null) {// no left child
        Debugger.log("no left child");
        this.transplant(z, z.mRight);
      } else if (z.mRight == null) {// no right child
        this.transplant(z, z.mLeft); 
      } else {// both children
        y = this.minimum(z.mRight);// successor of z
        if (y.mParent != z) {
          this.transplant(y, y.mRight);
          y.mRight = z.mRight;        
          y.mRight.mParent = y;                          
        }// if
        this.transplant(z, y);
        y.mLeft = z.mLeft;
        y.mLeft.mParent = y;  
      }// if
    };// remove

    this.transplant = function(u, v) {// helper function
      if (u.mParent == null) {// u is root
        this.mRoot = v;
      } else if (u == u.mParent.mLeft) {// u is a left child
         u.mParent.mLeft = v;
      } else {
         u.mParent.mRight = v;
      }// if
      if (v != null) {
        v.mParent = u.mParent;
      }
    };// transplant  

    this.inOrderWalk = function(node) {// used for debugging only   
      var stack = [];

      while (node != null) {
        while (node.mLeft != null) {// find left subtree minimum
          stack.push(node);
          node = node.mLeft; 
        }// while  
        Debugger.log(node.mKey);            
    
        if (node.mRight != null) {// move ptr to right child
          node = node.mRight;  
        } else {// no children
          while (node.mRight == null) {// walk up tree
            if (stack.length == 0) { 
              break; 
            } else {
              node = stack.pop();
              Debugger.log(node.mKey);
            }// if
          }// while
          node = node.mRight;// terminate main loop if no right child  
        }// if        
      }// while
    };// inOrderWalk
  }

  // Tree augmentation
  function Tree_test() {
    Tree.call(this);
  }// Tree_test

  Tree_test.prototype = new Tree();
  Tree_test.prototype.updateNodesDisplay = function(node, depth, index, draw) {// refresh Canvas tree display      
    // prepare canvas refresh
    if (draw) {
      fillBackground();
      setTextStyle();
    }
    if (node == null) { // do nothing
      Debugger.log("empty");
      return;
    }
    var queue = [];// use push and shift for queue
    node.mIndex = index;
    node.mDepth = depth;         
    queue.push(node);// initialize loop
    while (queue.length > 0) {// breadth first tree traversal
      node = queue.shift();        
      // update node depth and index attributes
      if (node.mParent != null) {// not root
        node.mDepth = node.mParent.mDepth + 1;
        if (node.mDepth > 4) {
          return false;
        }         
        if (node == node.mParent.mLeft) {
          node.mIndex = 2 * node.mParent.mIndex;
        } else {// right child
          node.mIndex = 2 * node.mParent.mIndex + 1;
        }
      }// if        
      if (draw) {
        // update geometric attributes
        node.updateGeometry();   
        drawNode(node);
        if (node.mParent != null) {// not root
          drawConnect(node, node.mParent);
        }
      }
      if (node.mLeft != null) {
        queue.push(node.mLeft);
      } 
      if (node.mRight != null) {
        queue.push(node.mRight);
      }
    }// while
    return true;
  };// updateNodesDisplay

  
  // get canvas context
  if (!canvasSupport) {
    alert("canvas not supported");
    return;
  } else {
    var theCanvas = document.getElementById("canvas");
    var context = theCanvas.getContext("2d");
  }// if

  var xMin = 0;
  var yMin = 0;
  var xMax = theCanvas.width;
  var yMax = theCanvas.height; 

  var xPos = [];
  var yPos = [100, 200, 300, 400, 500];

  initGeometry();

  function setTextStyle() {
    context.fillStyle    = '#000000';
    context.font         = '15px _sans';
    context.textBaseline = "middle";
    context.textAlign = "center";
  }

  function initGeometry() {
    var xPos4 = [];
    var xPos3 = [];
    var xPos2 = [];
    var xPos1 = [];
    var xPos0 = [400];

    for (var i = 0; i < 16; i++) {
      xPos4[i] = 40 + i * 48;
    }

    for (var i = 0; i < 8; i++) {
      xPos3.push(Math.floor( (xPos4[2*i] + xPos4[2*i+1])/2 ) );
    }

    for (var i = 0; i < 4; i++) {
      xPos2.push(Math.floor( (xPos3[2*i] + xPos3[2*i+1])/2 ) );
    }

    for (var i = 0; i < 2; i++) {
      xPos1.push(Math.floor( (xPos2[2*i] + xPos2[2*i+1])/2 ) );
    }

    xPos = [xPos0, xPos1, xPos2, xPos3, xPos4];

  }// initGeometry

  function drawNode(node) {
    context.beginPath();
    context.strokeStyle = node.color;
    context.lineWidth = 2;
    context.arc(node.xPos, node.yPos, node.mRadius, (Math.PI/180)*0, (Math.PI/180)*360, true); // draw full circle
    context.stroke();
    context.closePath();
    // draw text inside the circle
    Debugger.log("drawNode " + node.mKey + " xPos " + node.xPos + " yPos " + node.yPos);
    context.fillText(node.mKey, node.xPos, node.yPos);
  }// drawNode

  function drawConnect(child, parent) { 
    // connect child to parent
    context.strokeStyle = "black";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(child.xPos, child.yConnU);
    context.lineTo(parent.xPos, parent.yConnD); // draw line from child to parent
    context.stroke();
    context.closePath();
  }// drawConnect


  function fillBackground() {
    Debugger.log("fillBackground");
    // draw background
    context.fillStyle = '#ffffff';
    context.fillRect(xMin, yMin, xMax, yMax);    
  }// fillBackground

  var N = 5;// initial number of nodes

  var keys = new Array(N);// for initialization

  var nodes = new Array(N);// for initialization
  

  function randomize(N) {
    var val;
    var more;

    for (var i = 0; i < N; i++) {
      more = true;// flag
      while(more) {
        more = false;
        val = Math.floor(Math.random() * 100);// range 0 to 99 included
        for (var j = 0; j < keys.length; j++) {
          if (val == keys[j]) {
            more = true;
            break;
          }// if 
        }// for           
      }// while
      keys[i] = val;    
    }// for

  }// randomize


  function search(tree) {
    var searchkey = document.getElementById("searchkey").value;

    // validity check
    var isnum = /^\d+$/.test(searchkey);
    if (!isnum) {
      alert("invalid input");
      return;
    } else {
      searchkey = parseInt(searchkey);
      var answer = document.getElementById("found");
      if (tree.search(tree.mRoot, searchkey)) {    
        answer.innerHTML = "key " + searchkey + " found";
      } else {
        answer.innerHTML = "key " + searchkey + " not found";
      }// if 
    }// if
  }// search


  function insert(tree) {
    var newkey = document.getElementById("newkey").value;
    // validity check
    var isnum = /^\d+$/.test(newkey);
    if (!isnum) {
      alert("invalid input");
      return;
    } else {
      newkey = parseInt(newkey);
      if (newkey < 0 || newkey > 100) {
        alert("range allowed [0,100]");
        return;
      }
    }// if

    if (tree.mRoot != null && tree.search(tree.mRoot, newkey) != null) {
      alert("key already present");
      return;      
    } else {    
      var newnode = new DisplayNode(newkey);

      // first make a clone of the tree
      Debugger.log("clearing tree before cloning");    
      treeSave.clear();// erase all previous contents
      Debugger.log("cloning tree");          
      treeSave.clone(tree);

      tree.insert(newnode);

      var allowed = false;

      allowed = tree.updateNodesDisplay(tree.mRoot, 0, 0, false);// check depth allowed

      Debugger.log("allowed " + allowed);

      if (!allowed) {
        alert("maximal depth exceeded");
        // revert to initial state
        tree.clear();// removes all internal references
        tree.clone(treeSave);// revert     
      }// if

      // redraw Canvas
      tree.updateNodesDisplay(tree.mRoot, 0, 0, true);
    }// if
 
    var empty = document.getElementById("empty");
    if (tree.mRoot == tree.mNil) {// tree empty     
      empty.innerHTML = "tree is empty";
    } else {
      empty.innerHTML = "";
    }// if 

  }// insert


  function remove(tree) {
    var delkey = document.getElementById("delkey").value;
    // valididy check
    var isnum = /^\d+$/.test(delkey);
    if (!isnum) {
      alert("invalid input");
      return;
    }

    delkey = parseInt(delkey); 

    var delnode = tree.search(tree.mRoot, delkey);// node to remove
 
    if (delnode == null) {
      alert(delkey + " not found");
    } else {
      tree.remove(delnode);
      tree.updateNodesDisplay(tree.mRoot, 0, 0, true);
    }// if

    var empty = document.getElementById("empty");
    if (tree.mRoot == tree.mNil) {// tree empty     
      empty.innerHTML = "tree is empty";
    } else {
      empty.innerHTML = "";
    }// if 

  }// remove


  function initialize(N) {
    // initialize tree with N elements

    randomize(N);
 
/*
    keys[0] = 40;
    keys[1] = 20;
    keys[2] = 60;
    keys[3] = 10;
    keys[4] = 30;    
*/

    tree.clear();

    for (var i = 0; i < N; i++) {
      tree.insert(new DisplayNode(keys[i]));
    }

    tree.updateNodesDisplay(tree.mRoot, 0, 0, true);
  }// initialize


  tree = new Tree_test();// empty tree
  treeSave = new Tree_test();// empty tree

  initialize(N);

  $("#initelem").submit(function(event) { initialize(N); return false; });

  $("#searchelem").submit(function(event) { search(tree); return false; });

  $("#insertelem").submit(function(event) { insert(tree); return false; });

  $("#deleteelem").submit(function(event) { remove(tree); return false; });

}// canvasApp


$(document).ready(canvasApp);
