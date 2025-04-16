"use client"

import { useState } from "react"
import { useTree } from "@/context/tree-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown, HelpCircle, X } from "lucide-react"

export function InfoPanel() {
  const { message, traversalResult, treeType, animationSteps, currentStepIndex } = useTree()
  const [isExpanded, setIsExpanded] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)

  const currentStep = animationSteps[currentStepIndex]
  const displayMessage = currentStep ? currentStep.message : message

  return (
    <div className="border-t relative">
      <div className="flex justify-between items-center p-2 border-b">
        <div className="flex-1 font-medium truncate">{displayMessage}</div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setShowTutorial(!showTutorial)} aria-label="Show tutorial">
            <HelpCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? "Collapse panel" : "Expand panel"}
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4">
          <h3 className="font-semibold mb-2">Traversal Result</h3>
          <div className="bg-muted p-2 rounded overflow-x-auto">
            {traversalResult.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {traversalResult.map((value, index) => (
                  <span key={index} className="px-2 py-1 bg-primary/10 rounded">
                    {value}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No traversal performed yet</p>
            )}
          </div>

          <h3 className="font-semibold mt-4 mb-2">Tree Statistics</h3>
          <div className="grid grid-cols-2 gap-2">
            <Card>
              <CardContent className="p-3">
                <div className="text-sm font-medium">Tree Type</div>
                <div className="text-lg">{treeType === "avl" ? "AVL Tree" : "Red-Black Tree"}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-sm font-medium">Node Count</div>
                <div className="text-lg">{traversalResult.length}</div>
              </CardContent>
            </Card>
          </div>

          {animationSteps.length > 0 && (
            <>
              <h3 className="font-semibold mt-4 mb-2">Animation Progress</h3>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{ width: `${((currentStepIndex + 1) / animationSteps.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Step {currentStepIndex + 1} of {animationSteps.length}
              </p>
            </>
          )}
        </div>
      )}

      {showTutorial && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardContent className="p-6 relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => setShowTutorial(false)}
              >
                <X className="h-4 w-4" />
              </Button>

              <h2 className="text-2xl font-bold mb-4">How to Use the Tree Visualizer</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Basic Operations</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Enter a number in the input field and click "Insert" to add a node</li>
                    <li>Enter a number and click "Delete" to remove a node</li>
                    <li>Enter a number and click "Find" to search for a node</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Tree Traversals</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>In-Order:</strong> Left subtree, Root, Right subtree
                    </li>
                    <li>
                      <strong>Pre-Order:</strong> Root, Left subtree, Right subtree
                    </li>
                    <li>
                      <strong>Post-Order:</strong> Left subtree, Right subtree, Root
                    </li>
                    <li>
                      <strong>Level-Order:</strong> Breadth-first traversal (level by level)
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Animation Controls</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Use the animation speed slider to control how fast operations are visualized</li>
                    <li>Use the step buttons to move forward and backward through animations</li>
                    <li>Pause and resume animations to study tree operations in detail</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Navigation</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Use the mouse wheel to zoom in and out</li>
                    <li>Click and drag to pan around the tree</li>
                    <li>Use the animation controls to adjust speed</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Tree Types</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>AVL Tree:</strong> Self-balancing BST where heights of left and right subtrees differ by
                      at most 1
                    </li>
                    <li>
                      <strong>Red-Black Tree:</strong> Self-balancing BST with color properties that ensure the tree
                      remains balanced
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
