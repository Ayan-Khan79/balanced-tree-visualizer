import type { TreeNode, TreeOperation, TraversalType, TreeInterface } from "@/types/tree-types"

export class AVLTree implements TreeInterface {
  private root: TreeNode | null = null
  private nodeId = 0

  constructor() {
    this.root = null
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
    }
  }

  private getHeight(node: TreeNode | null): number {
    return node ? node.height : 0
  }

  private updateHeight(node: TreeNode): void {
    node.height = Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1
  }

  private getBalanceFactor(node: TreeNode | null): number {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0
  }

  private updateBalanceFactor(node: TreeNode): void {
    node.balanceFactor = this.getBalanceFactor(node)
  }

  private rotateRight(y: TreeNode): TreeNode {
    const x = y.left as TreeNode
    const T2 = x.right

    x.right = y
    y.left = T2

    x.parent = y.parent
    y.parent = x
    if (T2) T2.parent = y

    this.updateHeight(y)
    this.updateHeight(x)

    this.updateBalanceFactor(y)
    this.updateBalanceFactor(x)

    return x
  }

  private rotateLeft(x: TreeNode): TreeNode {
    const y = x.right as TreeNode
    const T2 = y.left

    y.left = x
    x.right = T2

    y.parent = x.parent
    x.parent = y
    if (T2) T2.parent = x

    this.updateHeight(x)
    this.updateHeight(y)

    this.updateBalanceFactor(x)
    this.updateBalanceFactor(y)

    return y
  }

  private balance(node: TreeNode): TreeNode {
    this.updateHeight(node)
    this.updateBalanceFactor(node)

    // Left
    if (node.balanceFactor > 1) {
      // LR case
      if (this.getBalanceFactor(node.left) < 0) {
        node.left = this.rotateLeft(node.left as TreeNode)
        return this.rotateRight(node)
      }
      // LL case
      return this.rotateRight(node)
    }

    // Right
    if (node.balanceFactor < -1) {
      // RL case
      if (this.getBalanceFactor(node.right) > 0) {
        node.right = this.rotateRight(node.right as TreeNode)
        return this.rotateLeft(node)
      }
      // RR case
      return this.rotateLeft(node)
    }

    return node
  }

  private insertNode(node: TreeNode | null, value: number, path: number[] = []): { node: TreeNode; path: number[] } {
    if (node === null) {
      return { node: this.createNode(value), path }
    }

    path.push(node.value)

    if (value < node.value) {
      const result = this.insertNode(node.left, value, path)
      node.left = result.node
      node.left.parent = node
    } else if (value > node.value) {
      const result = this.insertNode(node.right, value, path)
      node.right = result.node
      node.right.parent = node
    } else {
      return { node, path }
    }

    return { node: this.balance(node), path }
  }

  private findMinValueNode(node: TreeNode): TreeNode {
    let current = node
    while (current.left !== null) {
      current = current.left
    }
    return current
  }

  private deleteNode(
    node: TreeNode | null,
    value: number,
    path: number[] = [],
  ): { node: TreeNode | null; path: number[] } {
    if (node === null) {
      return { node: null, path }
    }

    path.push(node.value)

    if (value < node.value) {
      const result = this.deleteNode(node.left, value, path)
      node.left = result.node
      if (node.left) node.left.parent = node
    } else if (value > node.value) {
      const result = this.deleteNode(node.right, value, path)
      node.right = result.node
      if (node.right) node.right.parent = node
    } else {
      if (node.left === null) {
        return { node: node.right, path }
      } else if (node.right === null) {
        return { node: node.left, path }
      }

      const successor = this.findMinValueNode(node.right)
      node.value = successor.value

      const result = this.deleteNode(node.right, successor.value, path)
      node.right = result.node
      if (node.right) node.right.parent = node
    }

    if (node) {
      return { node: this.balance(node), path }
    }

    return { node, path }
  }

  private findNode(node: TreeNode | null, value: number, path: number[] = []): { found: boolean; path: number[] } {
    if (node === null) {
      return { found: false, path }
    }

    path.push(node.value)

    if (value === node.value) {
      return { found: true, path }
    }

    if (value < node.value) {
      return this.findNode(node.left, value, path)
    } else {
      return this.findNode(node.right, value, path)
    }
  }

  private traverseInOrder(node: TreeNode | null, result: number[] = []): number[] {
    if (node !== null) {
      this.traverseInOrder(node.left, result)
      result.push(node.value)
      this.traverseInOrder(node.right, result)
    }
    return result
  }

  private traversePreOrder(node: TreeNode | null, result: number[] = []): number[] {
    if (node !== null) {
      result.push(node.value)
      this.traversePreOrder(node.left, result)
      this.traversePreOrder(node.right, result)
    }
    return result
  }

  private traversePostOrder(node: TreeNode | null, result: number[] = []): number[] {
    if (node !== null) {
      this.traversePostOrder(node.left, result)
      this.traversePostOrder(node.right, result)
      result.push(node.value)
    }
    return result
  }

  private traverseLevelOrder(node: TreeNode | null): number[] {
    const result: number[] = []
    if (node === null) return result

    const queue: TreeNode[] = [node]
    while (queue.length > 0) {
      const current = queue.shift() as TreeNode
      result.push(current.value)

      if (current.left) queue.push(current.left)
      if (current.right) queue.push(current.right)
    }

    return result
  }

  insert(value: number): TreeOperation {
    try {
      if (this.root === null) {
        this.root = this.createNode(value)
        return { success: true, path: [value] }
      }

      const { node, path } = this.insertNode(this.root, value, [])
      this.root = node
      return { success: true, path }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to insert node",
      }
    }
  }

  delete(value: number): TreeOperation {
    try {
      const { found } = this.find(value)
      if (!found) {
        return { success: false, message: `Node ${value} not found` }
      }

      const { node, path } = this.deleteNode(this.root, value, [])
      this.root = node
      return { success: true, path }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to delete node",
      }
    }
  }

  find(value: number): { found: boolean; path: number[] } {
    return this.findNode(this.root, value, [])
  }

  traverse(type: TraversalType): number[] {
    switch (type) {
      case "inorder":
        return this.traverseInOrder(this.root)
      case "preorder":
        return this.traversePreOrder(this.root)
      case "postorder":
        return this.traversePostOrder(this.root)
      case "levelorder":
        return this.traverseLevelOrder(this.root)
      default:
        return []
    }
  }

  getNodesForRendering(): TreeNode[] {
    const nodes: TreeNode[] = []

    const calculatePositions = (node: TreeNode | null, x = 500, y = 100, horizontalSpacing = 250) => {
      if (!node) return

      node.x = x
      node.y = y
      nodes.push(node)

      const nextY = y + 100
      const nextSpacing = Math.max(horizontalSpacing / 2, 50)

      if (node.left) {
        calculatePositions(node.left, x - nextSpacing, nextY, nextSpacing)
      }

      if (node.right) {
        calculatePositions(node.right, x + nextSpacing, nextY, nextSpacing)
      }
    }

    if (this.root) {
      calculatePositions(this.root)
    }

    return nodes
  }
}

