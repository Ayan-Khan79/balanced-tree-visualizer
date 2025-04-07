export type TreeType = "avl" | "redblack"
export type TraversalType = "inorder" | "preorder" | "postorder" | "levelorder"
export type AnimationState = "idle" | "animating" | "paused"
export type NodeColor = "red" | "black" | "default"
export type RotationType = "LL" | "RR" | "LR" | "RL" | null

export interface TreeNode {
  id: number
  value: number
  x: number
  y: number
  left: TreeNode | null
  right: TreeNode | null
  parent: TreeNode | null
  height: number
  balanceFactor: number
  color?: NodeColor
  isHighlighted?: boolean
  isSelected?: boolean
}

export interface TreeOperation {
  success: boolean
  message?: string
  path?: number[]
  rotationType?: RotationType
}

export interface TreeInterface {
  insert(value: number): TreeOperation
  delete(value: number): TreeOperation
  find(value: number): { found: boolean; path: number[] }
  traverse(type: TraversalType): number[]
  getNodesForRendering(): TreeNode[]
}

