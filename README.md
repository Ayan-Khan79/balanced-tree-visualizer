# Balanced Tree Visualizer

Balanced Tree Visualizer is a dynamic, interactive tool designed to help you understand balanced binary search trees. Whether you’re learning about AVL trees or Red-Black trees, this application provides a visually engaging way to explore tree operations and traversals.

## Features

- **Interactive Tree Visualization**  
  Enjoy real-time rendering of tree structures with smooth, eye-catching animations.
  
- **Multiple Tree Types**  
  Seamlessly switch between AVL and Red-Black trees to explore different balancing algorithms.
  
- **Tree Operations**  
  Insert, delete, and search for nodes with instant visual feedback.
  
- **Tree Traversals**  
  Visualize in-order, pre-order, post-order, and level-order traversals to see how different algorithms work.
  
- **Animation Controls**  
  Customize your experience: adjust animation speed, pause, resume, and reset animations as needed.
  
- **Interactive Canvas**  
  Pan and zoom across the canvas to explore large trees in detail.
  
- **Responsive Design**  
  Optimized for both desktop and mobile devices for learning on the go.
  
- **Dark/Light Mode**  
  Easily toggle between dark and light themes to suit your environment.

## Technologies Used

- **Next.js** – A powerful React framework for building modern web applications.
- **TypeScript** – Bringing static type-checking to JavaScript for enhanced reliability.
- **Tailwind CSS** – A utility-first CSS framework for rapid UI development.
- **Framer Motion** – A production-ready animation library for React.
- **Radix UI** – Accessible, unstyled UI components that serve as a foundation for design systems.
- **Lucide React** – A beautiful, customizable icon library.

## Installation

Follow these steps to set up the Balanced Tree Visualizer on your local machine:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/thefznkhan/balanced-tree-visualizer.git
   cd balanced-tree-visualizer
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open in Your Browser**  
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application in action.


## Usage

### Basic Operations

- **Insert a Node**  
  Type a number in the input field and click "Insert" or press Enter to add a node.
  
- **Delete a Node**  
  Enter a number and click "Delete" to remove the corresponding node.
  
- **Find a Node**  
  Input a number and click "Find" to highlight the path leading to the node.

### Tree Traversals

- **In-Order**: Left subtree, root, right subtree.
- **Pre-Order**: Root, left subtree, right subtree.
- **Post-Order**: Left subtree, right subtree, root.
- **Level-Order**: Breadth-first traversal across tree levels.

### Navigation

- **Zoom**: Use your mouse wheel to zoom in and out.
- **Pan**: Click and drag on the canvas to move around.
- **Mobile Controls**: Use the + and - buttons to control zoom on mobile devices.

### Tree Types

Switch effortlessly between AVL and Red-Black trees using the dropdown menu in the header.


## Implementation Details

### AVL Tree

The AVL tree implementation ensures that the heights of the left and right subtrees of every node differ by at most one. When this condition is violated, rotations are performed to restore balance. Key properties include:

- **Balance Factor**: Displayed above each node.
- **Tree Height**: Visual indicator of the overall tree height.

### Red-Black Tree

The Red-Black tree maintains balance using color rules:

1. Every node is either **red** or **black**.
2. The **root** is always black.
3. All **leaves** (NIL nodes) are black.
4. A red node cannot have red children.
5. Every path from a node to its descendant leaves has the same number of black nodes.

Nodes are colored accordingly to visually represent these rules.


## Contributing

Contributions are always welcome! To contribute:

1. **Fork the Repository**
2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit Your Changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push the Branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**  
   Describe your changes and submit your PR for review.


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
