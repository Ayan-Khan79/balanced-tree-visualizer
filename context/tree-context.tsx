"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { AVLTree } from "@/lib/avl-tree"
import { RedBlackTree } from "@/lib/red-black-tree"
import type { TreeNode, TreeType, TraversalType, AnimationState } from "@/types/tree-types"

interface TreeContextProps {
  treeType: TreeType
  tree: AVLTree | RedBlackTree
  nodes: TreeNode[]
  message: string
  animationSpeed: number
  animationState: AnimationState
  selectedNode: number | null
  highlightedNodes: number[]
  traversalResult: number[]
  insertNode: (value: number) => void
  deleteNode: (value: number) => void
  findNode: (value: number) => void
  traverseTree: (type: TraversalType) => void
  setAnimationSpeed: (speed: number) => void
  pauseAnimation: () => void
  resumeAnimation: () => void
  resetAnimation: () => void
}

const TreeContext = createContext<TreeContextProps | undefined>(undefined)

export function TreeProvider({
  children,
  treeType,
}: {
  children: React.ReactNode
  treeType: TreeType
}) {
  const [tree, setTree] = useState<AVLTree | RedBlackTree>(() =>
    treeType === "avl" ? new AVLTree() : new RedBlackTree(),
  )
  const [nodes, setNodes] = useState<TreeNode[]>([])
  const [message, setMessage] = useState<string>("Welcome to Balanced Tree Visualizer")
  const [animationSpeed, setAnimationSpeed] = useState<number>(1)
  const [animationState, setAnimationState] = useState<AnimationState>("idle")
  const [selectedNode, setSelectedNode] = useState<number | null>(null)
  const [highlightedNodes, setHighlightedNodes] = useState<number[]>([])
  const [traversalResult, setTraversalResult] = useState<number[]>([])

  // Update tree when tree type changes
  useEffect(() => {
    setTree(treeType === "avl" ? new AVLTree() : new RedBlackTree())
    setNodes([])
    setMessage(`Switched to ${treeType === "avl" ? "AVL" : "Red-Black"} Tree`)
    setSelectedNode(null)
    setHighlightedNodes([])
    setTraversalResult([])
  }, [treeType])

  // Update nodes when tree changes
  useEffect(() => {
    if (tree) {
      setNodes(tree.getNodesForRendering())
    }
  }, [tree])

  const insertNode = useCallback(
    (value: number) => {
      try {
        setAnimationState("animating")
        setSelectedNode(value)

        const result = tree.insert(value)
        setNodes(tree.getNodesForRendering())

        if (result.success) {
          setMessage(`Node ${value} inserted successfully`)
          setHighlightedNodes(result.path || [])
        } else {
          setMessage(result.message || `Failed to insert node ${value}`)
        }

        // Reset animation state after a delay
        setTimeout(() => {
          setAnimationState("idle")
          setSelectedNode(null)
          setHighlightedNodes([])
        }, 1000 / animationSpeed)
      } catch (error) {
        setMessage(`Error: ${error instanceof Error ? error.message : String(error)}`)
        setAnimationState("idle")
      }
    },
    [tree, animationSpeed],
  )

  const deleteNode = useCallback(
    (value: number) => {
      try {
        setAnimationState("animating")
        setSelectedNode(value)

        const result = tree.delete(value)
        setNodes(tree.getNodesForRendering())

        if (result.success) {
          setMessage(`Node ${value} deleted successfully`)
          setHighlightedNodes(result.path || [])
        } else {
          setMessage(result.message || `Failed to delete node ${value}`)
        }

        // Reset animation state after a delay
        setTimeout(() => {
          setAnimationState("idle")
          setSelectedNode(null)
          setHighlightedNodes([])
        }, 1000 / animationSpeed)
      } catch (error) {
        setMessage(`Error: ${error instanceof Error ? error.message : String(error)}`)
        setAnimationState("idle")
      }
    },
    [tree, animationSpeed],
  )

  const findNode = useCallback(
    (value: number) => {
      try {
        setAnimationState("animating")

        const result = tree.find(value)

        if (result.found) {
          setMessage(`Node ${value} found`)
          setSelectedNode(value)
          setHighlightedNodes(result.path || [])
        } else {
          setMessage(`Node ${value} not found`)
          setHighlightedNodes(result.path || [])
        }

        // Reset animation state after a delay
        setTimeout(() => {
          setAnimationState("idle")
          setSelectedNode(null)
          setHighlightedNodes([])
        }, 1500 / animationSpeed)
      } catch (error) {
        setMessage(`Error: ${error instanceof Error ? error.message : String(error)}`)
        setAnimationState("idle")
      }
    },
    [tree, animationSpeed],
  )

  const traverseTree = useCallback(
    (type: TraversalType) => {
      try {
        setAnimationState("animating")

        const result = tree.traverse(type)
        setTraversalResult(result)
        setMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} traversal: ${result.join(", ")}`)

        // Animate traversal
        const animateTraversal = (index: number) => {
          if (index < result.length) {
            setSelectedNode(result[index])
            setTimeout(() => animateTraversal(index + 1), 500 / animationSpeed)
          } else {
            setAnimationState("idle")
            setSelectedNode(null)
          }
        }

        animateTraversal(0)
      } catch (error) {
        setMessage(`Error: ${error instanceof Error ? error.message : String(error)}`)
        setAnimationState("idle")
      }
    },
    [tree, animationSpeed],
  )

  const pauseAnimation = useCallback(() => {
    setAnimationState("paused")
  }, [])

  const resumeAnimation = useCallback(() => {
    setAnimationState("animating")
  }, [])

  const resetAnimation = useCallback(() => {
    setAnimationState("idle")
    setSelectedNode(null)
    setHighlightedNodes([])
    setTraversalResult([])
  }, [])

  const value = {
    treeType,
    tree,
    nodes,
    message,
    animationSpeed,
    animationState,
    selectedNode,
    highlightedNodes,
    traversalResult,
    insertNode,
    deleteNode,
    findNode,
    traverseTree,
    setAnimationSpeed,
    pauseAnimation,
    resumeAnimation,
    resetAnimation,
  }

  return <TreeContext.Provider value={value}>{children}</TreeContext.Provider>
}

export function useTree() {
  const context = useContext(TreeContext)
  if (context === undefined) {
    throw new Error("useTree must be used within a TreeProvider")
  }
  return context
}

