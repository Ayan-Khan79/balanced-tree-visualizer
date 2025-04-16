"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"
import { AVLTree } from "@/lib/avl-tree"
import { RedBlackTree } from "@/lib/red-black-tree"
import type { TreeNode, TreeType, TraversalType, AnimationState, AnimationStep } from "@/types/tree-types"

interface TreeContextProps {
  treeType: TreeType
  tree: AVLTree | RedBlackTree
  nodes: TreeNode[]
  message: string
  animationSpeed: number
  animationState: AnimationState
  selectedNode: number | null
  highlightedNodes: number[]
  comparisonNode: number | null
  traversalResult: number[]
  animationSteps: AnimationStep[]
  currentStepIndex: number
  insertNode: (value: number) => void
  deleteNode: (value: number) => void
  findNode: (value: number) => void
  traverseTree: (type: TraversalType) => void
  setAnimationSpeed: (speed: number) => void
  pauseAnimation: () => void
  resumeAnimation: () => void
  resetAnimation: () => void
  nextAnimationStep: () => void
  previousAnimationStep: () => void
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
  const [comparisonNode, setComparisonNode] = useState<number | null>(null)
  const [traversalResult, setTraversalResult] = useState<number[]>([])
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([])
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1)

  const animationTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setTree(treeType === "avl" ? new AVLTree() : new RedBlackTree())
    setNodes([])
    setMessage(`Switched to ${treeType === "avl" ? "AVL" : "Red-Black"} Tree`)
    setSelectedNode(null)
    setHighlightedNodes([])
    setComparisonNode(null)
    setTraversalResult([])
    setAnimationSteps([])
    setCurrentStepIndex(-1)

    if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current)
      animationTimerRef.current = null
    }
  }, [treeType])

  useEffect(() => {
    if (tree) {
      setNodes(tree.getNodesForRendering())
    }
  }, [tree])

  const processAnimationSteps = useCallback(
    (steps: AnimationStep[]) => {
      setAnimationSteps(steps)
      setCurrentStepIndex(0)
      setAnimationState("animating")

      const runAnimation = (index: number) => {
        if (index >= steps.length) {
          setAnimationState("idle")
          setSelectedNode(null)
          setHighlightedNodes([])
          setComparisonNode(null)
          return
        }

        const step = steps[index]

        setMessage(step.message)

        if (step.type === "comparison") {
          setComparisonNode(step.value)
          setSelectedNode(step.targetValue || null)
        } else if (step.type === "highlight") {
          setHighlightedNodes(step.path || [])
          setSelectedNode(step.value)
          setComparisonNode(null)
        } else if (step.type === "rotation") {
          setHighlightedNodes(step.affectedNodes || [])
          setMessage(`${step.rotationType} Rotation: ${step.message}`)
        } else if (step.type === "update") {
          setNodes(tree.getNodesForRendering())
        }

        setCurrentStepIndex(index)

        animationTimerRef.current = setTimeout(() => runAnimation(index + 1), step.duration || 1000 / animationSpeed)
      }

      if (steps.length > 0) {
        runAnimation(0)
      }
    },
    [animationSpeed, tree],
  )

  const nextAnimationStep = useCallback(() => {
    if (currentStepIndex < animationSteps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1)
      const nextStep = animationSteps[currentStepIndex + 1]

      setMessage(nextStep.message)

      if (nextStep.type === "comparison") {
        setComparisonNode(nextStep.value)
        setSelectedNode(nextStep.targetValue || null)
      } else if (nextStep.type === "highlight") {
        setHighlightedNodes(nextStep.path || [])
        setSelectedNode(nextStep.value)
        setComparisonNode(null)
      } else if (nextStep.type === "rotation") {
        setHighlightedNodes(nextStep.affectedNodes || [])
        setMessage(`${nextStep.rotationType} Rotation: ${nextStep.message}`)
      } else if (nextStep.type === "update") {
        setNodes(tree.getNodesForRendering())
      }
    } else {
      setAnimationState("idle")
      setSelectedNode(null)
      setHighlightedNodes([])
      setComparisonNode(null)
    }
  }, [currentStepIndex, animationSteps, tree])

  const previousAnimationStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1)
      const prevStep = animationSteps[currentStepIndex - 1]

      setMessage(prevStep.message)

      if (prevStep.type === "comparison") {
        setComparisonNode(prevStep.value)
        setSelectedNode(prevStep.targetValue || null)
      } else if (prevStep.type === "highlight") {
        setHighlightedNodes(prevStep.path || [])
        setSelectedNode(prevStep.value)
        setComparisonNode(null)
      } else if (prevStep.type === "rotation") {
        setHighlightedNodes(prevStep.affectedNodes || [])
        setMessage(`${prevStep.rotationType} Rotation: ${prevStep.message}`)
      } else if (prevStep.type === "update") {
        setNodes(tree.getNodesForRendering())
      }
    }
  }, [currentStepIndex, animationSteps, tree])

  const insertNode = useCallback(
    (value: number) => {
      try {
        setAnimationState("animating")

        const result = tree.insert(value, true)

        if (result.success) {
          processAnimationSteps(result.steps || [])
        } else {
          setMessage(result.message || `Failed to insert node ${value}`)
          setAnimationState("idle")
        }
      } catch (error) {
        setMessage(`Error: ${error instanceof Error ? error.message : String(error)}`)
        setAnimationState("idle")
      }
    },
    [tree, processAnimationSteps],
  )

  const deleteNode = useCallback(
    (value: number) => {
      try {
        setAnimationState("animating")

        const result = tree.delete(value, true)

        if (result.success) {
          processAnimationSteps(result.steps || [])
        } else {
          setMessage(result.message || `Failed to delete node ${value}`)
          setAnimationState("idle")
        }
      } catch (error) {
        setMessage(`Error: ${error instanceof Error ? error.message : String(error)}`)
        setAnimationState("idle")
      }
    },
    [tree, processAnimationSteps],
  )

  const findNode = useCallback(
    (value: number) => {
      try {
        setAnimationState("animating")

        const result = tree.find(value, true)

        processAnimationSteps(result.steps || [])
      } catch (error) {
        setMessage(`Error: ${error instanceof Error ? error.message : String(error)}`)
        setAnimationState("idle")
      }
    },
    [tree, processAnimationSteps],
  )

  const traverseTree = useCallback(
    (type: TraversalType) => {
      try {
        setAnimationState("animating")

        const result = tree.traverse(type)
        setTraversalResult(result)
        setMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} traversal: ${result.join(", ")}`)

        const steps: AnimationStep[] = result.map((value, index) => ({
          type: "highlight",
          value,
          message: `Traversing node ${value} (${index + 1}/${result.length})`,
          duration: 500 / animationSpeed,
        }))

        processAnimationSteps(steps)
      } catch (error) {
        setMessage(`Error: ${error instanceof Error ? error.message : String(error)}`)
        setAnimationState("idle")
      }
    },
    [tree, animationSpeed, processAnimationSteps],
  )

  const pauseAnimation = useCallback(() => {
    setAnimationState("paused")

    if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current)
      animationTimerRef.current = null
    }
  }, [])

  const resumeAnimation = useCallback(() => {
    if (animationState === "paused" && currentStepIndex < animationSteps.length - 1) {
      setAnimationState("animating")

      const runAnimation = (index: number) => {
        if (index >= animationSteps.length) {
          setAnimationState("idle")
          setSelectedNode(null)
          setHighlightedNodes([])
          setComparisonNode(null)
          return
        }

        const step = animationSteps[index]

        setMessage(step.message)

        if (step.type === "comparison") {
          setComparisonNode(step.value)
          setSelectedNode(step.targetValue || null)
        } else if (step.type === "highlight") {
          setHighlightedNodes(step.path || [])
          setSelectedNode(step.value)
          setComparisonNode(null)
        } else if (step.type === "rotation") {
          setHighlightedNodes(step.affectedNodes || [])
          setMessage(`${step.rotationType} Rotation: ${step.message}`)
        } else if (step.type === "update") {
          setNodes(tree.getNodesForRendering())
        }

        setCurrentStepIndex(index)

        animationTimerRef.current = setTimeout(() => runAnimation(index + 1), step.duration || 1000 / animationSpeed)
      }

      runAnimation(currentStepIndex + 1)
    }
  }, [animationState, currentStepIndex, animationSteps, animationSpeed, tree])

  const resetAnimation = useCallback(() => {
    if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current)
      animationTimerRef.current = null
    }

    setAnimationState("idle")
    setSelectedNode(null)
    setHighlightedNodes([])
    setComparisonNode(null)
    setAnimationSteps([])
    setCurrentStepIndex(-1)
    setNodes(tree.getNodesForRendering())
  }, [tree])

  useEffect(() => {
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current)
      }
    }
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
    comparisonNode,
    traversalResult,
    animationSteps,
    currentStepIndex,
    insertNode,
    deleteNode,
    findNode,
    traverseTree,
    setAnimationSpeed,
    pauseAnimation,
    resumeAnimation,
    resetAnimation,
    nextAnimationStep,
    previousAnimationStep,
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
