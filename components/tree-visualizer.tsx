"use client"

import { useState } from "react"
import { TreeCanvas } from "@/components/tree-canvas"
import { ControlPanel } from "@/components/control-panel"
import { InfoPanel } from "@/components/info-panel"
import { TreeProvider } from "@/context/tree-context"
import { ModeToggle } from "@/components/mode-toggle"
import type { TreeType } from "@/types/tree-types"

export function TreeVisualizer() {
  const [treeType, setTreeType] = useState<TreeType>("avl")

  return (
    <TreeProvider treeType={treeType}>
      <div className="flex flex-col min-h-screen">
        <header className="border-b p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Balanced Tree Visualizer</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Tree Type:</span>
              <select
                className="p-2 rounded border bg-background"
                value={treeType}
                onChange={(e) => setTreeType(e.target.value as TreeType)}
              >
                <option value="avl">AVL Tree</option>
                <option value="redblack">Red-Black Tree</option>
              </select>
            </div>
            <ModeToggle />
          </div>
        </header>
        <div className="flex flex-col md:flex-row flex-1">
          <ControlPanel />
          <div className="flex-1 flex flex-col">
            <TreeCanvas />
            <InfoPanel />
          </div>
        </div>
      </div>
    </TreeProvider>
  )
}

