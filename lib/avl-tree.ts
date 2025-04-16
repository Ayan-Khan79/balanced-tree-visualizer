import type {
  TreeNode,
  TreeOperation,
  TraversalType,
  TreeInterface,
  AnimationStep,
} from "@/types/tree-types";

export class AVLTree implements TreeInterface {
  private root: TreeNode | null = null;
  private nodeId = 0;

  constructor() {
    this.root = null;
  }

  private createNode(value: number, parent: TreeNode | null = null): TreeNode {
    return {
      id: ++this.nodeId,
      value,
      x: 0,
      y: 0,
      left: null,
      right: null,
      parent,
      height: 1,
      balanceFactor: 0,
    };
  }

  private getHeight(node: TreeNode | null): number {
    return node ? node.height : 0;
  }

  private updateHeight(node: TreeNode): void {
    node.height =
      Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
  }

  private getBalanceFactor(node: TreeNode | null): number {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  private updateBalanceFactor(node: TreeNode): void {
    node.balanceFactor = this.getBalanceFactor(node);
  }

  private rotateRight(y: TreeNode, animationSteps?: AnimationStep[]): TreeNode {
    const x = y.left as TreeNode;
    const T2 = x.right;

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

    x.right = y;
    y.left = T2;

    x.parent = y.parent;
    y.parent = x;
    if (T2) T2.parent = y;

    this.updateHeight(y);
    this.updateHeight(x);

    this.updateBalanceFactor(y);
    this.updateBalanceFactor(x);

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

  private rotateLeft(x: TreeNode, animationSteps?: AnimationStep[]): TreeNode {
    const y = x.right as TreeNode;
    const T2 = y.left;

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

    y.left = x;
    x.right = T2;

    y.parent = x.parent;
    x.parent = y;
    if (T2) T2.parent = x;

    this.updateHeight(x);
    this.updateHeight(y);

    this.updateBalanceFactor(x);
    this.updateBalanceFactor(y);

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

  private balance(node: TreeNode, animationSteps?: AnimationStep[]): TreeNode {
    this.updateHeight(node);
    this.updateBalanceFactor(node);

    if (animationSteps) {
      animationSteps.push({
        type: "highlight",
        value: node.value,
        message: `Checking balance factor at node ${node.value}: ${node.balanceFactor}`,
        path: [node.value],
        duration: 800,
      });
    }

    if (node.balanceFactor > 1) {
      // Left-Right
      if (node.left && this.getBalanceFactor(node.left) < 0) {
        if (animationSteps) {
          animationSteps.push({
            type: "rotation",
            value: node.value,
            message: `Left-Right case detected at node ${node.value}`,
            affectedNodes: [node.value, node.left.value],
            rotationType: "LR",
            duration: 800,
          });
        }
        node.left = this.rotateLeft(node.left as TreeNode, animationSteps);
        return this.rotateRight(node, animationSteps);
      }
      // Left-Left
      if (animationSteps) {
        animationSteps.push({
          type: "rotation",
          value: node.value,
          message: `Left-Left case detected at node ${node.value}`,
          affectedNodes: [node.value, node.left?.value || 0],
          rotationType: "LL",
          duration: 800,
        });
      }
      return this.rotateRight(node, animationSteps);
    }

    if (node.balanceFactor < -1) {
      // Right-Left
      if (node.right && this.getBalanceFactor(node.right) > 0) {
        if (animationSteps) {
          animationSteps.push({
            type: "rotation",
            value: node.value,
            message: `Right-Left case detected at node ${node.value}`,
            affectedNodes: [node.value, node.right.value],
            rotationType: "RL",
            duration: 800,
          });
        }
        node.right = this.rotateRight(node.right as TreeNode, animationSteps);
        return this.rotateLeft(node, animationSteps);
      }
      // Right-Right
      if (animationSteps) {
        animationSteps.push({
          type: "rotation",
          value: node.value,
          message: `Right-Right case detected at node ${node.value}`,
          affectedNodes: [node.value, node.right?.value || 0],
          rotationType: "RR",
          duration: 800,
        });
      }
      return this.rotateLeft(node, animationSteps);
    }

    return node;
  }

  private insertNode(
    node: TreeNode | null,
    value: number,
    path: number[] = [],
    animationSteps?: AnimationStep[]
  ): { node: TreeNode; path: number[] } {
    if (node === null) {
      if (animationSteps) {
        animationSteps.push({
          type: "highlight",
          value: value,
          message: `Found insertion point for node ${value}`,
          duration: 800,
        });
      }
      return { node: this.createNode(value), path };
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

    if (value < node.value) {
      if (animationSteps) {
        animationSteps.push({
          type: "highlight",
          value: node.value,
          message: `${value} < ${node.value}, going to left subtree`,
          path: [...path],
          duration: 800,
        });
      }
      const result = this.insertNode(node.left, value, path, animationSteps);
      node.left = result.node;
      node.left.parent = node;

      if (animationSteps) {
        animationSteps.push({
          type: "update",
          value: value,
          message: `Connected node ${value} to parent ${node.value}`,
          duration: 500,
        });
      }
    } else if (value > node.value) {
      if (animationSteps) {
        animationSteps.push({
          type: "highlight",
          value: node.value,
          message: `${value} > ${node.value}, going to right subtree`,
          path: [...path],
          duration: 800,
        });
      }
      const result = this.insertNode(node.right, value, path, animationSteps);
      node.right = result.node;
      node.right.parent = node;

      if (animationSteps) {
        animationSteps.push({
          type: "update",
          value: value,
          message: `Connected node ${value} to parent ${node.value}`,
          duration: 500,
        });
      }
    } else {
      // Duplicate value
      if (animationSteps) {
        animationSteps.push({
          type: "highlight",
          value: node.value,
          message: `Node ${value} already exists in the tree`,
          path: [...path],
          duration: 800,
        });
      }
      return { node, path };
    }

    return { node: this.balance(node, animationSteps), path };
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

    while (current.left !== null) {
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

  private deleteNode(
    node: TreeNode | null,
    value: number,
    path: number[] = [],
    animationSteps?: AnimationStep[]
  ): { node: TreeNode | null; path: number[] } {
    if (node === null) {
      if (animationSteps) {
        animationSteps.push({
          type: "highlight",
          value: value,
          message: `Node ${value} not found for deletion`,
          duration: 800,
        });
      }
      return { node: null, path };
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
      const result = this.deleteNode(node.left, value, path, animationSteps);
      node.left = result.node;
      if (node.left) node.left.parent = node;

      if (animationSteps) {
        animationSteps.push({
          type: "update",
          value: node.value,
          message: `Updated left subtree of node ${node.value}`,
          duration: 500,
        });
      }
    } else if (value > node.value) {
      if (animationSteps) {
        animationSteps.push({
          type: "highlight",
          value: node.value,
          message: `${value} > ${node.value}, searching in right subtree`,
          path: [...path],
          duration: 800,
        });
      }
      const result = this.deleteNode(node.right, value, path, animationSteps);
      node.right = result.node;
      if (node.right) node.right.parent = node;

      if (animationSteps) {
        animationSteps.push({
          type: "update",
          value: node.value,
          message: `Updated right subtree of node ${node.value}`,
          duration: 500,
        });
      }
    } else {
      // Found the node
      if (animationSteps) {
        animationSteps.push({
          type: "highlight",
          value: node.value,
          message: `Found node ${value} to delete`,
          path: [...path],
          duration: 800,
        });
      }

      if (node.left === null) {
        if (animationSteps) {
          animationSteps.push({
            type: "highlight",
            value: node.value,
            message: `Node ${value} has no left child, replacing with right child`,
            duration: 800,
          });

          animationSteps.push({
            type: "update",
            value: node.right?.value || 0,
            message: `Removed node ${value} from the tree`,
            duration: 800,
          });
        }
        return { node: node.right, path };
      } else if (node.right === null) {
        if (animationSteps) {
          animationSteps.push({
            type: "highlight",
            value: node.value,
            message: `Node ${value} has no right child, replacing with left child`,
            duration: 800,
          });

          animationSteps.push({
            type: "update",
            value: node.left.value,
            message: `Removed node ${value} from the tree`,
            duration: 800,
          });
        }
        return { node: node.left, path };
      }

      if (animationSteps) {
        animationSteps.push({
          type: "highlight",
          value: node.value,
          message: `Node ${value} has two children, finding inorder successor`,
          duration: 800,
        });
      }

      const successor = this.findMinValueNode(node.right, animationSteps);

      if (animationSteps) {
        animationSteps.push({
          type: "highlight",
          value: successor.value,
          message: `Replacing node ${node.value} with inorder successor ${successor.value}`,
          duration: 800,
        });
      }

      node.value = successor.value;

      if (animationSteps) {
        animationSteps.push({
          type: "highlight",
          value: successor.value,
          message: `Now deleting the inorder successor ${successor.value} from its original position`,
          duration: 800,
        });
      }

      const result = this.deleteNode(
        node.right,
        successor.value,
        path,
        animationSteps
      );
      node.right = result.node;
      if (node.right) node.right.parent = node;

      if (animationSteps) {
        animationSteps.push({
          type: "update",
          value: node.value,
          message: `Replaced deleted node with successor ${node.value}`,
          duration: 500,
        });
      }
    }

    if (node) {
      if (animationSteps) {
        animationSteps.push({
          type: "highlight",
          value: node.value,
          message: `Checking balance after deletion at node ${node.value}`,
          duration: 800,
        });
      }
      return { node: this.balance(node, animationSteps), path };
    }

    return { node, path };
  }

  private findNode(
    node: TreeNode | null,
    value: number,
    path: number[] = [],
    animationSteps?: AnimationStep[]
  ): { found: boolean; path: number[] } {
    if (node === null) {
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
      return this.findNode(node.left, value, path, animationSteps);
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
      return this.findNode(node.right, value, path, animationSteps);
    }
  }

  private traverseInOrder(
    node: TreeNode | null,
    result: number[] = []
  ): number[] {
    if (node !== null) {
      this.traverseInOrder(node.left, result);
      result.push(node.value);
      this.traverseInOrder(node.right, result);
    }
    return result;
  }

  private traversePreOrder(
    node: TreeNode | null,
    result: number[] = []
  ): number[] {
    if (node !== null) {
      result.push(node.value);
      this.traversePreOrder(node.left, result);
      this.traversePreOrder(node.right, result);
    }
    return result;
  }

  private traversePostOrder(
    node: TreeNode | null,
    result: number[] = []
  ): number[] {
    if (node !== null) {
      this.traversePostOrder(node.left, result);
      this.traversePostOrder(node.right, result);
      result.push(node.value);
    }
    return result;
  }

  private traverseLevelOrder(node: TreeNode | null): number[] {
    const result: number[] = [];
    if (node === null) return result;

    const queue: TreeNode[] = [node];
    while (queue.length > 0) {
      const current = queue.shift() as TreeNode;
      result.push(current.value);

      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }

    return result;
  }

  insert(value: number, animate = false): TreeOperation {
    try {
      const animationSteps: AnimationStep[] = animate ? [] : [];

      if (this.root === null) {
        this.root = this.createNode(value);

        if (animationSteps) {
          animationSteps.push({
            type: "highlight",
            value: value,
            message: `Inserted root node ${value}`,
            duration: 800,
          });

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

      const { node, path } = this.insertNode(
        this.root,
        value,
        [],
        animationSteps
      );
      this.root = node;

      if (animationSteps) {
        animationSteps.push({
          type: "update",
          value: value,
          message: `Node ${value} inserted successfully`,
          duration: 800,
        });
      }

      return {
        success: true,
        path,
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

      const { found } = this.find(value);
      if (!found) {
        if (animationSteps) {
          animationSteps.push({
            type: "highlight",
            value: value,
            message: `Node ${value} not found for deletion`,
            duration: 800,
          });
        }

        return {
          success: false,
          message: `Node ${value} not found`,
          steps: animationSteps,
        };
      }

      const { node, path } = this.deleteNode(
        this.root,
        value,
        [],
        animationSteps
      );
      this.root = node;

      if (animationSteps) {
        animationSteps.push({
          type: "update",
          value: 0,
          message: `Node ${value} deleted successfully`,
          duration: 800,
        });
      }

      return {
        success: true,
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
    const result = this.findNode(this.root, value, [], animationSteps);

    return {
      ...result,
      steps: animationSteps,
    };
  }

  traverse(type: TraversalType): number[] {
    switch (type) {
      case "inorder":
        return this.traverseInOrder(this.root);
      case "preorder":
        return this.traversePreOrder(this.root);
      case "postorder":
        return this.traversePostOrder(this.root);
      case "levelorder":
        return this.traverseLevelOrder(this.root);
      default:
        return [];
    }
  }

  getNodesForRendering(): TreeNode[] {
    const nodes: TreeNode[] = [];

    const getDepth = (node: TreeNode | null): number => {
      if (!node) return 0;
      return 1 + Math.max(getDepth(node.left), getDepth(node.right));
    };

    const treeDepth = getDepth(this.root);

    const calculatePositions = (
      node: TreeNode | null,
      x = 500,
      y = 100,
      level = 0,
      leftBound = 0,
      rightBound = 1000
    ) => {
      if (!node) return;

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
      };

      nodes.push(renderNode);

      const nextY = y + 100;

      const leftWidth = (x - leftBound) * 0.95;
      const rightWidth = (rightBound - x) * 0.95;

      if (node.left) {
        const leftX = x - leftWidth / 2;
        calculatePositions(node.left, leftX, nextY, level + 1, leftBound, x);

        const renderedLeftChild = nodes.find((n) => n.id === node.left?.id);
        if (renderedLeftChild) {
          renderNode.left = renderedLeftChild;
          renderedLeftChild.parent = renderNode;
        }
      }

      if (node.right) {
        const rightX = x + rightWidth / 2;
        calculatePositions(node.right, rightX, nextY, level + 1, x, rightBound);

        const renderedRightChild = nodes.find((n) => n.id === node.right?.id);
        if (renderedRightChild) {
          renderNode.right = renderedRightChild;
          renderedRightChild.parent = renderNode;
        }
      }
    };

    if (this.root) {
      const canvasWidth = Math.max(1000, 2 ** (treeDepth - 1) * 120);
      calculatePositions(this.root, canvasWidth / 2, 100, 0, 0, canvasWidth);
    }

    return nodes;
  }
}
