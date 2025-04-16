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
  isComparing?: boolean
}

export interface TreeOperation {
  success: boolean
  message?: string
  path?: number[]
  rotationType?: RotationType
  steps?: AnimationStep[]
}

export interface TreeInterface {
  insert(value: number, animate?: boolean): TreeOperation
  delete(value: number, animate?: boolean): TreeOperation
  find(value: number, animate?: boolean): { found: boolean; path: number[]; steps?: AnimationStep[] }
  traverse(type: TraversalType): number[]
  getNodesForRendering(): TreeNode[]
}

export type AnimationStepType = "comparison" | "highlight" | "rotation" | "update"

export interface AnimationStep {
  type: AnimationStepType
  value: number
  targetValue?: number
  message: string
  path?: number[]
  affectedNodes?: number[]
  rotationType?: RotationType
  duration?: number
}
