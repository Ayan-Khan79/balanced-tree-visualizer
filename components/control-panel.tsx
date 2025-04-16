"use client"

import type React from "react"

import { useState } from "react"
import { useTree } from "@/context/tree-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { TraversalType } from "@/types/tree-types"
import {
  Plus,
  Trash,
  Search,
  Play,
  Pause,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  SkipBack,
  SkipForward,
} from "lucide-react"

export function ControlPanel() {
  const {
    insertNode,
    deleteNode,
    findNode,
    traverseTree,
    animationSpeed,
    setAnimationSpeed,
    pauseAnimation,
    resumeAnimation,
    resetAnimation,
    nextAnimationStep,
    previousAnimationStep,
    animationState,
    treeType,
    animationSteps,
    currentStepIndex,
  } = useTree()

  const [nodeValue, setNodeValue] = useState<string>("")
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleInsert = () => {
    const value = Number.parseInt(nodeValue)
    if (!isNaN(value)) {
      insertNode(value)
      setNodeValue("")
    }
  }

  const handleDelete = () => {
    const value = Number.parseInt(nodeValue)
    if (!isNaN(value)) {
      deleteNode(value)
      setNodeValue("")
    }
  }

  const handleFind = () => {
    const value = Number.parseInt(nodeValue)
    if (!isNaN(value)) {
      findNode(value)
    }
  }

  const handleTraversal = (type: TraversalType) => {
    traverseTree(type)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleInsert()
    }
  }

  return (
    <div className={`border-r transition-all duration-300 ${isCollapsed ? "w-12" : "w-80"}`}>
      <div className="p-2 flex justify-between items-center border-b">
        <h2 className={`font-bold ${isCollapsed ? "hidden" : "block"}`}>Controls</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand panel" : "Collapse panel"}
        >
          {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>
      </div>

      {!isCollapsed && (
        <div className="p-4 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Node Operations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="Enter value"
                  value={nodeValue}
                  onChange={(e) => setNodeValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                  disabled={animationState === "animating"}
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={handleInsert}
                  className="flex items-center gap-1"
                  disabled={animationState === "animating" || nodeValue === ""}
                >
                  <Plus className="h-4 w-4" />
                  Insert
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="destructive"
                  className="flex items-center gap-1"
                  disabled={animationState === "animating" || nodeValue === ""}
                >
                  <Trash className="h-4 w-4" />
                  Delete
                </Button>
                <Button
                  onClick={handleFind}
                  variant="secondary"
                  className="flex items-center gap-1"
                  disabled={animationState === "animating" || nodeValue === ""}
                >
                  <Search className="h-4 w-4" />
                  Find
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Traversals</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="inorder">
                <TabsList className="grid grid-cols-2 mb-2">
                  <TabsTrigger value="inorder">In/Pre/Post</TabsTrigger>
                  <TabsTrigger value="levelorder">Level Order</TabsTrigger>
                </TabsList>
                <TabsContent value="inorder" className="space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      onClick={() => handleTraversal("inorder")}
                      variant="outline"
                      size="sm"
                      disabled={animationState === "animating"}
                    >
                      In-Order
                    </Button>
                    <Button
                      onClick={() => handleTraversal("preorder")}
                      variant="outline"
                      size="sm"
                      disabled={animationState === "animating"}
                    >
                      Pre-Order
                    </Button>
                    <Button
                      onClick={() => handleTraversal("postorder")}
                      variant="outline"
                      size="sm"
                      disabled={animationState === "animating"}
                    >
                      Post-Order
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="levelorder">
                  <Button
                    onClick={() => handleTraversal("levelorder")}
                    variant="outline"
                    className="w-full"
                    disabled={animationState === "animating"}
                  >
                    Level-Order Traversal
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Animation Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Speed</span>
                  <span>{animationSpeed.toFixed(1)}x</span>
                </div>
                <Slider
                  value={[animationSpeed]}
                  min={0.1}
                  max={2}
                  step={0.1}
                  onValueChange={(value) => setAnimationSpeed(value[0])}
                />
              </div>

              {animationState !== "idle" && (
                <div className="grid grid-cols-5 gap-2">
                  <Button
                    onClick={previousAnimationStep}
                    variant="outline"
                    size="icon"
                    disabled={currentStepIndex <= 0}
                    title="Previous step"
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>

                  {animationState === "animating" ? (
                    <Button onClick={pauseAnimation} variant="outline" className="flex items-center gap-1 col-span-3">
                      <Pause className="h-4 w-4" />
                      Pause
                    </Button>
                  ) : (
                    <Button onClick={resumeAnimation} variant="outline" className="flex items-center gap-1 col-span-3">
                      <Play className="h-4 w-4" />
                      Resume
                    </Button>
                  )}

                  <Button
                    onClick={nextAnimationStep}
                    variant="outline"
                    size="icon"
                    disabled={currentStepIndex >= animationSteps.length - 1}
                    title="Next step"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <Button
                onClick={resetAnimation}
                variant="outline"
                className="flex items-center gap-1 w-full"
                disabled={animationState === "idle"}
              >
                <RotateCcw className="h-4 w-4" />
                Reset Animation
              </Button>

              {animationSteps.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  <p>
                    Step {currentStepIndex + 1} of {animationSteps.length}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="text-xs text-muted-foreground">
            <p>
              Current Tree: <span className="font-semibold">{treeType === "avl" ? "AVL Tree" : "Red-Black Tree"}</span>
            </p>
            <p className="mt-1">
              {treeType === "avl" ? "Numbers in nodes show balance factors" : "Red/Black colors indicate node colors"}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
