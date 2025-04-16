import type {
  TreeNode,
  TreeOperation,
  TraversalType,
  TreeInterface,
  NodeColor,
  AnimationStep,
} from "@/types/tree-types";

export class RedBlackTree implements TreeInterface {
  private root: TreeNode | null = null;
  private nodeId = 0;
  private NIL: TreeNode;

  constructor() {
    this.NIL = {
      id: 0,
      value: -1,
      x: 0,
      y: 0,
      left: null,
      right: null,
      parent: null,
      height: 0,
      balanceFactor: 0,
      color: "black",
    };
    this.root = this.NIL;
  }

  private createNode(
    value: number,
    parent: TreeNode = this.NIL,
    color: NodeColor = "red"
  ): TreeNode {
    const newNode = {
      id: ++this.nodeId,
      value,
      x: 0,
      y: 0,
      left: this.NIL,
      right: this.NIL,
      parent,
      height: 1,
      balanceFactor: 0,
      color,
    };
    return newNode;
  }

  private isNil(node: TreeNode): boolean {
    return node === this.NIL;
  }

  private isRed(node: TreeNode): boolean {
    return node !== this.NIL && node.color === "red";
  }

  private rotateLeft(x: TreeNode, animationSteps?: AnimationStep[]): TreeNode {
    const y = x.right as TreeNode;

    if (animationSteps) {
      animationSteps.push({
        type: "rotation",
        value: x.value,
        message: `Left rotation at node ${x.value}`,
        affectedNodes: [x.value, y.value],
        rotationType: "LL",
        duration: 1000,
      });
    }

    x.right = y.left;
    if (y.left && !this.isNil(y.left)) {
      y.left.parent = x;
    }

    y.parent = x.parent;

    if (x.parent === null || this.isNil(x.parent)) {
      this.root = y;
    } else if (x === x.parent.left) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }

    y.left = x;
    x.parent = y;

    if (animationSteps) {
      animationSteps.push({
        type: "update",
        value: y.value,
        message: "Tree updated after left rotation",
        duration: 500,
      });
    }

    return y;
  }

  private rotateRight(y: TreeNode, animationSteps?: AnimationStep[]): TreeNode {
    const x = y.left as TreeNode;

    if (animationSteps) {
      animationSteps.push({
        type: "rotation",
        value: y.value,
        message: `Right rotation at node ${y.value}`,
        affectedNodes: [y.value, x.value],
        rotationType: "RR",
        duration: 1000,
      });
    }

    y.left = x.right;
    if (x.right && !this.isNil(x.right)) {
      x.right.parent = y;
    }

    x.parent = y.parent;

    if (y.parent === null || this.isNil(y.parent)) {
      this.root = x;
    } else if (y === y.parent.left) {
      y.parent.left = x;
    } else {
      y.parent.right = x;
    }

    x.right = y;
    y.parent = x;

    if (animationSteps) {
      animationSteps.push({
        type: "update",
        value: x.value,
        message: "Tree updated after right rotation",
        duration: 500,
      });
    }

    return x;
  }

  private flipColors(node: TreeNode, animationSteps?: AnimationStep[]): void {
    if (animationSteps) {
      animationSteps.push({
        type: "highlight",
        value: node.value,
        message: `Flipping colors at node ${node.value}`,
        affectedNodes: [
          node.value,
          node.left && !this.isNil(node.left) ? node.left.value : 0,
          node.right && !this.isNil(node.right) ? node.right.value : 0,
        ],
        duration: 800,
      });
    }

    node.color = node.color === "red" ? "black" : "red";
    if (node.left && !this.isNil(node.left))
      node.left.color = node.left.color === "red" ? "black" : "red";
    if (node.right && !this.isNil(node.right))
      node.right.color = node.right.color === "red" ? "black" : "red";

    if (animationSteps) {
      animationSteps.push({
        type: "update",
        value: node.value,
        message: "Colors flipped",
        duration: 500,
      });
    }
  }

  private insertFixup(node: TreeNode, animationSteps?: AnimationStep[]): void {
    let current = node;

    while (current !== this.root && current.parent !== null && this.isRed(current.parent)) {
      if (current.parent && current.parent.parent && current.parent === current.parent.parent.left) {
        const uncle = current.parent.parent.right;

        if (uncle && this.isRed(uncle)) {
          // Case 1: Uncle is red
          if (animationSteps) {
            animationSteps.push({
              type: "highlight",
              value: current.value,
              message: `Case 1: Uncle is red - recoloring nodes`,
              affectedNodes: [
                current.value,
                current.parent ? current.parent.value : 0,
                uncle.value,
                current.parent?.parent?.value ?? 0,
              ],
              duration: 800,
            });
          }

          current.parent.color = "black";
          uncle.color = "black";
          if (current.parent.parent) {
            current.parent.parent.color = "red";
          }
          current = current.parent.parent;

          if (animationSteps) {
            animationSteps.push({
              type: "update",
              value: current.value,
              message: "Recolored nodes and moved up to grandparent",
              duration: 500,
            });
          }
        } else {
          // Uncle is black
          if (current === current.parent.right) {
            // Case 2: Current is right child
            if (animationSteps) {
              animationSteps.push({
                type: "highlight",
                value: current.value,
                message: `Case 2: Current is right child - rotate left`,
                affectedNodes: [current.value, current.parent.value],
                duration: 800,
              });
            }

            current = current.parent;
            this.rotateLeft(current, animationSteps);
          }

          // Case 3: Current is left child
          if (animationSteps) {
            animationSteps.push({
              type: "highlight",
              value: current.value,
              message: `Case 3: Current is left child - recolor and rotate right`,
              affectedNodes: [
                current.value,
                current.parent ? current.parent.value : 0,
                current.parent?.parent?.value ?? 0,
              ],
              duration: 800,
            });
          }

          if (current.parent && current.parent.parent) {
            current.parent.color = "black";
            current.parent.parent.color = "red";
            this.rotateRight(current.parent.parent, animationSteps);
          }
        }
      } else {
        // mirror cases
        const uncle = current?.parent?.parent?.left;

        if (uncle && this.isRed(uncle)) {
          // Case 1: Uncle is red
          if (animationSteps) {
            animationSteps.push({
              type: "highlight",
              value: current.value,
              message: `Case 1: Uncle is red - recoloring nodes`,
              affectedNodes: [
                current.value,
                current.parent.value,
                uncle.value,
                current.parent.parent ? current.parent.parent.value : 0,
              ],
              duration: 800,
            });
          }

          current.parent.color = "black";
          uncle.color = "black";
          if (current.parent && current.parent.parent) {
            current.parent.parent.color = "red";
            current = current.parent.parent;
          }

          if (animationSteps) {
            animationSteps.push({
              type: "update",
              value: current.value,
              message: "Recolored nodes and moved up to grandparent",
              duration: 500,
            });
          }
        } else {
          // Uncle is black
          if (current === current.parent.left) {
            // Case 2: Current is left child
            if (animationSteps) {
              animationSteps.push({
                type: "highlight",
                value: current.value,
                message: `Case 2: Current is left child - rotate right`,
                affectedNodes: [current.value, current.parent.value],
                duration: 800,
              });
            }

            current = current.parent;
            this.rotateRight(current, animationSteps);
          }

          // Case 3: Current is right child
          if (animationSteps) {
            animationSteps.push({
              type: "highlight",
              value: current.value,
              message: `Case 3: Current is right child - recolor and rotate left`,
              affectedNodes: [
                current.value,
                current.parent?.value ?? 0,
                current.parent?.parent?.value ?? 0,
              ],
              duration: 800,
            });
          }

          if (current.parent && current.parent.parent) {
            current.parent.color = "black";
            current.parent.parent.color = "red";
            this.rotateLeft(current.parent.parent, animationSteps);
          }
        }
      }
    }

    if (this.root && this.root.color === "red") {
      if (animationSteps) {
        animationSteps.push({
          type: "highlight",
          value: this.root.value,
          message: "Ensuring root is black",
          duration: 500,
        });
      }
      this.root.color = "black";
    }
  }

  private insertNode(value: number, animationSteps?: AnimationStep[]): void {
    const newNode = this.createNode(value);

    let current = this.root;
    let parent = this.NIL;

    while (current && !this.isNil(current)) {
      parent = current;

      if (animationSteps) {
        animationSteps.push({
          type: "comparison",
          value: current.value,
          targetValue: value,
          message: `Comparing ${value} with ${current.value}`,
          duration: 800,
        });
      }

      if (value < current.value) {
        if (animationSteps) {
          animationSteps.push({
            type: "highlight",
            value: current.value,
            message: `${value} < ${current.value}, going to left subtree`,
            duration: 800,
          });
        }
        current = current.left;
      } else if (value > current.value) {
        if (animationSteps) {
          animationSteps.push({
            type: "highlight",
            value: current.value,
            message: `${value} > ${current.value}, going to right subtree`,
            duration: 800,
          });
        }
        current = current.right;
      } else {
        if (animationSteps) {
          animationSteps.push({
            type: "highlight",
            value: current.value,
            message: `Node ${value} already exists in the tree`,
            duration: 800,
          });
        }
        return;
      }
    }

    newNode.parent = parent;

    if (this.isNil(parent)) {
      this.root = newNode;
      if (animationSteps) {
        animationSteps.push({
          type: "highlight",
          value: value,
          message: `Inserted root node ${value}`,
          duration: 800,
        });
      }
    } else if (value < parent.value) {
      parent.left = newNode;
      if (animationSteps) {
        animationSteps.push({
          type: "highlight",
          value: value,
          message: `Inserted ${value} as left child of ${parent.value}`,
          duration: 800,
        });
      }
    } else {
      parent.right = newNode;
      if (animationSteps) {
        animationSteps.push({
          type: "highlight",
          value: value,
          message: `Inserted ${value} as right child of ${parent.value}`,
          duration: 800,
        });
      }
    }

    if (animationSteps) {
      animationSteps.push({
        type: "highlight",
        value: value,
        message: `Checking Red-Black tree properties after insertion`,
        duration: 800,
      });
    }

    this.insertFixup(newNode, animationSteps);

    if (animationSteps) {
      animationSteps.push({
        type: "update",
        value: value,
        message: `Node ${value} inserted successfully`,
        duration: 800,
      });
    }
  }

  private findMinValueNode(
    node: TreeNode,
    animationSteps?: AnimationStep[]
  ): TreeNode {
    let current = node;

    if (animationSteps) {
      animationSteps.push({
        type: "highlight",
        value: current.value,
        message: `Finding minimum value in the subtree rooted at ${current.value}`,
        duration: 800,
      });
    }

    while (current.left && !this.isNil(current.left)) {
      if (animationSteps) {
        animationSteps.push({
          type: "comparison",
          value: current.value,
          message: `Checking if ${current.value} has a left child`,
          duration: 600,
        });
      }
      current = current.left;
      if (animationSteps) {
        animationSteps.push({
          type: "highlight",
          value: current.value,
          message: `Moving to left child: ${current.value}`,
          duration: 600,
        });
      }
    }

    if (animationSteps) {
      animationSteps.push({
        type: "highlight",
        value: current.value,
        message: `Found minimum value: ${current.value}`,
        duration: 800,
      });
    }

    return current;
  }

  private transplant(
    u: TreeNode,
    v: TreeNode,
    animationSteps?: AnimationStep[]
  ): void {
    if (u.parent && this.isNil(u.parent)) {
      this.root = v;
    } else if (u === u.parent?.left) {
      u.parent.left = v;
    } else {
      if (u.parent) u.parent.right = v;
    }
    v.parent = u.parent;

    if (animationSteps) {
      animationSteps.push({
        type: "highlight",
        value: v.value !== -1 ? v.value : u.value,
        message: `Replaced ${u.value} with ${v.value !== -1 ? v.value : "NIL"}`,
        duration: 800,
      });
    }
  }

  private deleteFixup(x: TreeNode, animationSteps?: AnimationStep[]): void {
    while (x !== this.root && x.color === "black") {
      if (x === x.parent?.left) {
        let w = x.parent.right;

        // Case 1: x's sibling w is red
        if (w && this.isRed(w)) {
          if (animationSteps) {
            animationSteps.push({
              type: "highlight",
              value: w.value,
              message: `Case 1: Sibling is red - recolor and rotate left`,
              affectedNodes: [x.parent.value, w.value],
              duration: 800,
            });
          }

          w.color = "black";
          x.parent.color = "red";
          this.rotateLeft(x.parent, animationSteps);
          w = x.parent.right;

          if (animationSteps) {
            animationSteps.push({
              type: "update",
              value: x.parent.value,
              message: "Updated tree after Case 1",
              duration: 500,
            });
          }
        }

        // Case 2: x's sibling w is black, and both of w's children are black
        if (w && w.left && w.right && !this.isRed(w.left) && !this.isRed(w.right)) {
          if (animationSteps) {
            animationSteps.push({
              type: "highlight",
              value: w.value,
              message: `Case 2: Sibling is black with black children - recolor sibling`,
              affectedNodes: [w.value],
              duration: 800,
            });
          }

          w.color = "red";
          x = x.parent;

          if (animationSteps) {
            animationSteps.push({
              type: "update",
              value: x.value,
              message: "Moved up to parent after Case 2",
              duration: 500,
            });
          }
        } else {
          // Case 3: x's sibling w is black, w's left child is red, and w's right child is black
          if (w && w.right && !this.isRed(w.right)) {
            if (animationSteps) {
              animationSteps.push({
                type: "highlight",
                value: w.value,
                message: `Case 3: Sibling is black with red left child - recolor and rotate right`,
                affectedNodes: [w.value, w.left ? w.left.value : 0],
                duration: 800,
              });
            }

            if (w.left) w.left.color = "black";
            w.color = "red";
            this.rotateRight(w, animationSteps);
            w = x.parent.right;

            if (animationSteps) {
              animationSteps.push({
                type: "update",
                value: w ? w.value: 0,
                message: "Updated tree after Case 3",
                duration: 500,
              });
            }
          }

          // Case 4: x's sibling w is black, and w's right child is red
          if (animationSteps) {
            animationSteps.push({
              type: "highlight",
              value: w ? w.value : 0,
              message: `Case 4: Sibling is black with red right child - recolor and rotate left`,
              affectedNodes: [w?.value ?? 0, x.parent?.value ?? 0, w?.right?.value ?? 0],
              duration: 800,
            });
          }

          if (w) w.color = x.parent.color;
          x.parent.color = "black";
          if (w && w.right) w.right.color = "black";
          this.rotateLeft(x.parent, animationSteps);
          if (this.root) x = this.root;

          if (animationSteps) {
            animationSteps.push({
              type: "update",
              value: this.root?.value ?? 0,
              message: "Updated tree after Case 4",
              duration: 500,
            });
          }
        }
      } else {
        // Mirror cases
        let w = x.parent?.left;

        // Case 1: x's sibling w is red
        if (w && this.isRed(w)) {
          if (animationSteps) {
            animationSteps.push({
              type: "highlight",
              value: w.value,
              message: `Case 1: Sibling is red - recolor and rotate right`,
              affectedNodes: [x.parent?.value ?? 0, w.value],
              duration: 800,
            });
          }

          w.color = "black";
          if (x.parent) {
            x.parent.color = "red";
            this.rotateRight(x.parent, animationSteps);
            w = x.parent.left;
          }

          if (animationSteps) {
            animationSteps.push({
              type: "update",
              value: x.parent?.value ?? 0,
              message: "Updated tree after Case 1",
              duration: 500,
            });
          }
        }

        // Case 2: x's sibling w is black, and both of w's children are black
        if (w && w.left && w.right && !this.isRed(w.right) && !this.isRed(w.left)) {
          if (animationSteps) {
            animationSteps.push({
              type: "highlight",
              value: w.value,
              message: `Case 2: Sibling is black with black children - recolor sibling`,
              affectedNodes: [w.value],
              duration: 800,
            });
          }

          w.color = "red";
          if (x.parent) x = x.parent;

          if (animationSteps) {
            animationSteps.push({
              type: "update",
              value: x.value,
              message: "Moved up to parent after Case 2",
              duration: 500,
            });
          }
        } else {
          // Case 3: x's sibling w is black, w's right child is red, and w's left child is black
          if (w && w.left && !this.isRed(w.left)) {
            if (animationSteps) {
              animationSteps.push({
                type: "highlight",
                value: w.value,
                message: `Case 3: Sibling is black with red right child - recolor and rotate left`,
                affectedNodes: [w.value, w.right?.value ?? 0],
                duration: 800,
              });
            }

            if (w && w.right) w.right.color = "black";
            w.color = "red";
            this.rotateLeft(w, animationSteps);
            if (x.parent) w = x.parent.left;

            if (animationSteps) {
              animationSteps.push({
                type: "update",
                value: w?.value ?? 0,
                message: "Updated tree after Case 3",
                duration: 500,
              });
            }
          }

          // Case 4: x's sibling w is black, and w's left child is red
          if (animationSteps) {
            animationSteps.push({
              type: "highlight",
              value: w?.value ?? 0,
              message: `Case 4: Sibling is black with red left child - recolor and rotate right`,
              affectedNodes: [w?.value ?? 0, x.parent?.value ?? 0, w?.left?.value ?? 0],
              duration: 800,
            });
          }

          if (w && x.parent) {
            w.color = x.parent.color;
            x.parent.color = "black";
            if (w.left) w.left.color = "black";
            this.rotateRight(x.parent, animationSteps);
          }
          if (this.root) {
            x = this.root;
          }

          if (animationSteps) {
            animationSteps.push({
              type: "update",
              value: this.root?.value ?? 0,
              message: "Updated tree after Case 4",
              duration: 500,
            });
          }
        }
      }
    }

    x.color = "black";
  }

  private deleteNode(value: number, animationSteps?: AnimationStep[]): boolean {
    let z = this.NIL;
    let current = this.root;

    while (current && !this.isNil(current)) {
      if (animationSteps) {
        animationSteps.push({
          type: "comparison",
          value: current.value,
          targetValue: value,
          message: `Comparing ${value} with ${current.value}`,
          duration: 800,
        });
      }

      if (value === current.value) {
        z = current;
        break;
      } else if (value < current.value) {
        if (animationSteps) {
          animationSteps.push({
            type: "highlight",
            value: current.value,
            message: `${value} < ${current.value}, searching in left subtree`,
            duration: 800,
          });
        }
        current = current.left;
      } else {
        if (animationSteps) {
          animationSteps.push({
            type: "highlight",
            value: current.value,
            message: `${value} > ${current.value}, searching in right subtree`,
            duration: 800,
          });
        }
        current = current.right;
      }
    }

    if (this.isNil(z)) {
      if (animationSteps) {
        animationSteps.push({
          type: "highlight",
          value: value,
          message: `Node ${value} not found for deletion`,
          duration: 800,
        });
      }
      return false;
    }

    if (animationSteps) {
      animationSteps.push({
        type: "highlight",
        value: z.value,
        message: `Found node ${value} to delete`,
        duration: 800,
      });
    }

    let y = z;
    let yOriginalColor = y.color;

    // x is the node that will replace y
    let x: TreeNode;

    if (z.left === null || this.isNil(z.left)) {
      if (animationSteps) {
        animationSteps.push({
          type: "highlight",
          value: z.value,
          message: `Node ${z.value} has no left child, replacing with right child`,
          duration: 800,
        });
      }

      x = z.right!;
      this.transplant(z, z.right ?? this.NIL, animationSteps);
    } else if (z.right === null || this.isNil(z.right)) {
      if (animationSteps) {
        animationSteps.push({
          type: "highlight",
          value: z.value,
          message: `Node ${z.value} has no right child, replacing with left child`,
          duration: 800,
        });
      }

      x = z.left;
      this.transplant(z, z.left, animationSteps);
    } else {
      if (animationSteps) {
        animationSteps.push({
          type: "highlight",
          value: z.value,
          message: `Node ${z.value} has two children, finding successor`,
          duration: 800,
        });
      }

      y = this.findMinValueNode(z.right, animationSteps);
      yOriginalColor = y.color;
      x = y.right!;

      if (y.parent === z) {
        x.parent = y;

        if (animationSteps) {
          animationSteps.push({
            type: "highlight",
            value: y.value,
            message: `Successor ${y.value} is direct right child of ${z.value}`,
            duration: 800,
          });
        }
      } else {
        if (animationSteps) {
          animationSteps.push({
            type: "highlight",
            value: y.value,
            message: `Replacing successor ${y.value} with its right child`,
            duration: 800,
          });
        }

        this.transplant(y, y.right ?? this.NIL, animationSteps);
        y.right = z.right;
        y.right.parent = y;
      }

      if (animationSteps) {
        animationSteps.push({
          type: "highlight",
          value: z.value,
          message: `Replacing ${z.value} with successor ${y.value}`,
          duration: 800,
        });
      }

      this.transplant(z, y, animationSteps);
      y.left = z.left;
      y.left.parent = y;
      y.color = z.color;

      if (animationSteps) {
        animationSteps.push({
          type: "update",
          value: y.value,
          message: `Updated tree after replacing ${z.value} with ${y.value}`,
          duration: 800,
        });
      }
    }

    if (yOriginalColor === "black") {
      if (animationSteps) {
        animationSteps.push({
          type: "highlight",
          value: x.value !== -1 ? x.value : y.value !== -1 ? y.value : z.value,
          message: `Removed a black node, need to fix Red-Black properties`,
          duration: 800,
        });
      }

      this.deleteFixup(x, animationSteps);
    }

    return true;
  }

  private findNode(
    node: TreeNode,
    value: number,
    path: number[] = [],
    animationSteps?: AnimationStep[]
  ): { found: boolean; path: number[] } {
    if (this.isNil(node)) {
      if (animationSteps) {
        animationSteps.push({
          type: "highlight",
          value: value,
          message: `Search complete: Node ${value} not found`,
          duration: 800,
        });
      }
      return { found: false, path };
    }

    path.push(node.value);

    if (animationSteps) {
      animationSteps.push({
        type: "comparison",
        value: node.value,
        targetValue: value,
        message: `Comparing ${value} with ${node.value}`,
        duration: 800,
      });
    }

    if (value === node.value) {
      if (animationSteps) {
        animationSteps.push({
          type: "highlight",
          value: node.value,
          message: `Found node ${value}!`,
          path: [...path],
          duration: 1000,
        });
      }
      return { found: true, path };
    }

    if (value < node.value) {
      if (animationSteps) {
        animationSteps.push({
          type: "highlight",
          value: node.value,
          message: `${value} < ${node.value}, searching in left subtree`,
          path: [...path],
          duration: 800,
        });
      }
      return node.left ? this.findNode(node.left, value, path, animationSteps) : { found: false, path };
    } else {
      if (animationSteps) {
        animationSteps.push({
          type: "highlight",
          value: node.value,
          message: `${value} > ${node.value}, searching in right subtree`,
          path: [...path],
          duration: 800,
        });
      }
      return node.right ? this.findNode(node.right, value, path, animationSteps) : { found: false, path };
    }
  }

  private traverseInOrder(node: TreeNode, result: number[] = []): number[] {
    if (!this.isNil(node)) {
      if (node.left) this.traverseInOrder(node.left, result);
      result.push(node.value);
      if (node.right) this.traverseInOrder(node.right, result);
    }
    return result;
  }

  private traversePreOrder(node: TreeNode, result: number[] = []): number[] {
    if (!this.isNil(node)) {
      result.push(node.value);
      if (node.left) this.traversePreOrder(node.left, result);
      if (node.right) this.traversePreOrder(node.right, result);
    }
    return result;
  }

  private traversePostOrder(node: TreeNode, result: number[] = []): number[] {
    if (!this.isNil(node)) {
      if (node.left) this.traversePostOrder(node.left, result);
      if (node.right) this.traversePostOrder(node.right, result);
      result.push(node.value);
    }
    return result;
  }

  private traverseLevelOrder(node: TreeNode): number[] {
    const result: number[] = [];
    if (this.isNil(node)) return result;

    const queue: TreeNode[] = [node];
    while (queue.length > 0) {
      const current = queue.shift() as TreeNode;
      result.push(current.value);

      if (current.left && !this.isNil(current.left)) queue.push(current.left);
      if (current.right && !this.isNil(current.right)) queue.push(current.right);
    }

    return result;
  }

  insert(value: number, animate = false): TreeOperation {
    try {
      const animationSteps: AnimationStep[] = animate ? [] : [];

      if (this.root && this.isNil(this.root)) {
        if (animationSteps) {
          animationSteps.push({
            type: "highlight",
            value: value,
            message: `Inserting root node ${value}`,
            duration: 800,
          });
        }

        this.root = this.createNode(value, this.NIL, "black");

        if (animationSteps) {
          animationSteps.push({
            type: "update",
            value: value,
            message: `Tree updated with new root ${value}`,
            duration: 500,
          });
        }

        return {
          success: true,
          path: [value],
          steps: animationSteps,
        };
      }

      this.insertNode(value, animationSteps);

      return {
        success: true,
        path: this.root ? this.findNode(this.root, value).path : [],
        steps: animationSteps,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to insert node",
      };
    }
  }

  delete(value: number, animate = false): TreeOperation {
    try {
      const animationSteps: AnimationStep[] = animate ? [] : [];

      if (!this.root) {
        return {
          success: false,
          message: `Tree is empty`,
          steps: animationSteps,
        };
      }
      const { found, path } = this.findNode(this.root, value);
      if (!found) {
        return {
          success: false,
          message: `Node ${value} not found`,
          steps: animationSteps,
        };
      }

      const success = this.deleteNode(value, animationSteps);

      if (success && animationSteps) {
        animationSteps.push({
          type: "update",
          value: 0,
          message: `Node ${value} deleted successfully`,
          duration: 800,
        });
      }

      return {
        success,
        path,
        steps: animationSteps,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to delete node",
      };
    }
  }

  find(
    value: number,
    animate = false
  ): { found: boolean; path: number[]; steps?: AnimationStep[] } {
    const animationSteps: AnimationStep[] = animate ? [] : [];
    const result = this.root ? this.findNode(this.root, value, [], animationSteps) : { found: false, path: [] };

    return {
      ...result,
      steps: animationSteps,
    };
  }

  traverse(type: TraversalType): number[] {
    switch (type) {
      case "inorder":
        return this.root ? this.traverseInOrder(this.root) : [];
      case "preorder":
        return this.root ? this.traversePreOrder(this.root) : [];
      case "postorder":
        return this.root ? this.traversePostOrder(this.root) : [];
      case "levelorder":
        return this.root ? this.traverseLevelOrder(this.root): [];
      default:
        return [];
    }
  }

  getNodesForRendering(): TreeNode[] {
    const nodes: TreeNode[] = [];

    const getDepth = (node: TreeNode): number => {
      if (this.isNil(node)) return 0;
      return 1 + Math.max(getDepth(node.left ?? this.NIL), getDepth(node.right ?? this.NIL));
    };

    const treeDepth = getDepth(this.root ?? this.NIL);

    const calculatePositions = (
      node: TreeNode,
      x = 500,
      y = 100,
      level = 0,
      leftBound = 0,
      rightBound = 1000
    ) => {
      if (this.isNil(node)) return;

      const renderNode: TreeNode = {
        id: node.id,
        value: node.value,
        x: x,
        y: y,
        left: null,
        right: null,
        parent: null,
        height: node.height,
        balanceFactor: node.balanceFactor,
        color: node.color,
      };

      nodes.push(renderNode);

      const nextY = y + 100;

      const leftWidth = (x - leftBound) * 0.95;
      const rightWidth = (rightBound - x) * 0.95;

      if (node.left && !this.isNil(node.left)) {
        const leftX = x - leftWidth / 2;
        calculatePositions(node.left, leftX, nextY, level + 1, leftBound, x);

        const renderedLeftChild = nodes.find((n) => n.id === node.left!.id);
        if (renderedLeftChild) {
          renderNode.left = renderedLeftChild;
          renderedLeftChild.parent = renderNode;
        }
      }

      if (node.right && !this.isNil(node.right)) {
        const rightX = x + rightWidth / 2;
        calculatePositions(node.right, rightX, nextY, level + 1, x, rightBound);

        const renderedRightChild = nodes.find((n) => n.id === node.right!.id);
        if (renderedRightChild) {
          renderNode.right = renderedRightChild;
          renderedRightChild.parent = renderNode;
        }
      }
    };

    if (this.root && !this.isNil(this.root)) {
      const canvasWidth = Math.max(1000, 2 ** (treeDepth - 1) * 120);
      calculatePositions(this.root, canvasWidth / 2, 100, 0, 0, canvasWidth);
    }

    return nodes;
  }
}
