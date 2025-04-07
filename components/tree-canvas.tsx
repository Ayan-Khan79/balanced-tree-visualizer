"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useTree } from "@/context/tree-context"
import { TreeNode } from "@/components/tree-node"
import { useMobile } from "@/hooks/use-mobile"

export function TreeCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const { nodes, animationState } = useTree()
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const isMobile = useMobile()

  // Handle zoom
  const handleZoom = (event: React.WheelEvent) => {
    event.preventDefault()
    const delta = event.deltaY > 0 ? -0.1 : 0.1
    setScale((prevScale) => Math.min(Math.max(prevScale + delta, 0.5), 2))
  }

  // Handle pan start
  const handlePanStart = (event: React.MouseEvent | React.TouchEvent) => {
    if (animationState === "animating") return

    setIsDragging(true)
    if ("clientX" in event) {
      setStartPos({ x: event.clientX - position.x, y: event.clientY - position.y })
    } else {
      const touch = event.touches[0]
      setStartPos({ x: touch.clientX - position.x, y: touch.clientY - position.y })
    }
  }

  // Handle pan move
  const handlePanMove = (event: MouseEvent | TouchEvent) => {
    if (!isDragging) return

    if ("clientX" in event) {
      setPosition({
        x: event.clientX - startPos.x,
        y: event.clientY - startPos.y,
      })
    } else {
      const touch = event.touches[0]
      setPosition({
        x: touch.clientX - startPos.x,
        y: touch.clientY - startPos.y,
      })
    }
  }

  // Handle pan end
  const handlePanEnd = () => {
    setIsDragging(false)
  }

  // Add event listeners for pan
  useEffect(() => {
    const moveHandler = (e: MouseEvent | TouchEvent) => handlePanMove(e)
    const upHandler = () => handlePanEnd()

    if (isDragging) {
      window.addEventListener("mousemove", moveHandler)
      window.addEventListener("touchmove", moveHandler)
      window.addEventListener("mouseup", upHandler)
      window.addEventListener("touchend", upHandler)
    }

    return () => {
      window.removeEventListener("mousemove", moveHandler)
      window.removeEventListener("touchmove", moveHandler)
      window.removeEventListener("mouseup", upHandler)
      window.removeEventListener("touchend", upHandler)
    }
  }, [isDragging])

  // Reset position and scale when nodes change
  useEffect(() => {
    if (nodes.length === 0) {
      setPosition({ x: 0, y: 0 })
      setScale(1)
    }
  }, [nodes.length])

  return (
    <div
      ref={canvasRef}
      className="relative flex-1 overflow-hidden bg-background dark:bg-gray-900 border-b"
      onWheel={handleZoom}
      onMouseDown={handlePanStart}
      onTouchStart={handlePanStart}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          scale,
          x: position.x,
          y: position.y,
        }}
      >
        {nodes.map((node) => (
          <TreeNode key={node.id} node={node} />
        ))}
      </motion.div>

      {/* Zoom controls for mobile */}
      {isMobile && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button
            className="p-2 bg-primary text-primary-foreground rounded-full"
            onClick={() => setScale((prev) => Math.min(prev + 0.1, 2))}
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            className="p-2 bg-primary text-primary-foreground rounded-full"
            onClick={() => setScale((prev) => Math.max(prev - 0.1, 0.5))}
            aria-label="Zoom out"
          >
            -
          </button>
        </div>
      )}
    </div>
  )
}

