"use client"

import { motion } from "framer-motion"
import { useTree } from "@/context/tree-context"
import type { TreeNode as TreeNodeType } from "@/types/tree-types"

interface TreeNodeProps {
  node: TreeNodeType
}

export function TreeNode({ node }: TreeNodeProps) {
  const { selectedNode, highlightedNodes, comparisonNode, treeType } = useTree()

  const isSelected = selectedNode === node.value
  const isHighlighted = highlightedNodes.includes(node.value)
  const isComparing = comparisonNode === node.value

  const getNodeColor = () => {
    if (isSelected) return "bg-node-selected text-white"
    if (isComparing) return "bg-warning text-black"
    if (isHighlighted) return "bg-node-highlight text-black"

    if (treeType === "redblack" && node.color) {
      return node.color === "red" ? "bg-node-rbRed text-white" : "bg-node-rbBlack text-white"
    }

    return "bg-node-default text-black dark:text-white"
  }

  const nodeSize = Math.max(40, 30 + String(node.value).length * 10)

  return (
    <>
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

      <motion.div
        className={`absolute rounded-full flex items-center justify-center ${getNodeColor()}`}
        style={{
          width: nodeSize,
          height: nodeSize,
          left: node.x - nodeSize / 2,
          top: node.y - nodeSize / 2,
        }}
        initial={{ scale: 0 }}
        animate={{
          scale: 1,
          boxShadow: isComparing || isSelected ? "0 0 15px 5px rgba(255, 215, 0, 0.7)" : "none",
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
          boxShadow: { duration: 0.5, repeat: isComparing ? Number.POSITIVE_INFINITY : 0, repeatType: "reverse" },
        }}
      >
        <span className="font-bold">{node.value}</span>

        {treeType === "avl" && (
          <span className="absolute -top-6 text-xs bg-background dark:bg-gray-800 px-1 rounded">
            {node.balanceFactor}
          </span>
        )}
      </motion.div>
    </>
  )
}
