"use client"

import { motion } from "framer-motion"
import { useTree } from "@/context/tree-context"
import type { TreeNode as TreeNodeType } from "@/types/tree-types"

interface TreeNodeProps {
  node: TreeNodeType
}

export function TreeNode({ node }: TreeNodeProps) {
  const { selectedNode, highlightedNodes, treeType } = useTree()

  const isSelected = selectedNode === node.value
  const isHighlighted = highlightedNodes.includes(node.value)

  // Determine node color based on tree type and node properties
  const getNodeColor = () => {
    if (isSelected) return "bg-node-selected text-white"
    if (isHighlighted) return "bg-node-highlight text-black"

    if (treeType === "redblack" && node.color) {
      return node.color === "red" ? "bg-node-rbRed text-white" : "bg-node-rbBlack text-white"
    }

    return "bg-node-default text-black dark:text-white"
  }

  // Calculate node size based on value length
  const nodeSize = Math.max(40, 30 + String(node.value).length * 10)

  return (
    <>
      {/* Draw edges to children */}
      {node.left && (
        <motion.div
          className="absolute h-[2px] bg-border dark:bg-gray-600 origin-left"
          style={{
            width: Math.sqrt(Math.pow(node.left.x - node.x, 2) + Math.pow(node.left.y - node.y, 2)),
            left: node.x,
            top: node.y,
            transform: `rotate(${Math.atan2(node.left.y - node.y, node.left.x - node.x)}rad)`,
            transformOrigin: "0 0",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {node.right && (
        <motion.div
          className="absolute h-[2px] bg-border dark:bg-gray-600 origin-left"
          style={{
            width: Math.sqrt(Math.pow(node.right.x - node.x, 2) + Math.pow(node.right.y - node.y, 2)),
            left: node.x,
            top: node.y,
            transform: `rotate(${Math.atan2(node.right.y - node.y, node.right.x - node.x)}rad)`,
            transformOrigin: "0 0",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Node circle */}
      <motion.div
        className={`absolute rounded-full flex items-center justify-center ${getNodeColor()}`}
        style={{
          width: nodeSize,
          height: nodeSize,
          left: node.x - nodeSize / 2,
          top: node.y - nodeSize / 2,
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <span className="font-bold">{node.value}</span>

        {/* Balance factor or color indicator */}
        {treeType === "avl" && (
          <span className="absolute -top-6 text-xs bg-background dark:bg-gray-800 px-1 rounded">
            {node.balanceFactor}
          </span>
        )}
      </motion.div>
    </>
  )
}

