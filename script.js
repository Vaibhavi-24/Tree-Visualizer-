document.addEventListener('DOMContentLoaded', () => {
    // Toggle Algorithm Steps and Explanation
    const toggleStepsBtn = document.getElementById('toggle-steps-btn');
    const algorithmSteps = document.getElementById('algorithm-steps');
    toggleStepsBtn.addEventListener('click', () => {
        algorithmSteps.classList.toggle('hidden');
    });

    const toggleExplanationBtn = document.getElementById('toggle-explanation-btn');
    const algorithmExplanation = document.getElementById('algorithm-explanation');
    toggleExplanationBtn.addEventListener('click', () => {
        algorithmExplanation.classList.toggle('hidden');
    });
    // Algorithm display helpers
    function showAlgorithmSteps(steps) {
        const stepsList = document.getElementById('algorithm-steps');
        stepsList.innerHTML = '';
        steps.forEach((step, i) => {
            const li = document.createElement('li');
            li.textContent = step;
            stepsList.appendChild(li);
        });
    }
    function showAlgorithmExplanation(explanations) {
        const explanationDiv = document.getElementById('algorithm-explanation');
        explanationDiv.innerHTML = '';
        explanations.forEach((exp, i) => {
            const p = document.createElement('p');
            p.textContent = `Step ${i+1}: ${exp}`;
            explanationDiv.appendChild(p);
        });
    }
    // Notification function
    function showNotification(message) {
        let notification = document.createElement('div');
        notification.className = 'custom-notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    // DOM Elements
    const navLinks = document.querySelectorAll('.nav-link');
    const pageSections = document.querySelectorAll('.page-section');
    const speedSlider = document.getElementById('speed-slider');
    const treeContainer = document.getElementById('tree-container');
    const nodeValueInput = document.getElementById('node-value');
    const insertBtn = document.getElementById('insert-btn');
    const deleteBtn = document.getElementById('delete-btn');
    const searchBtn = document.getElementById('search-btn');
    const undoBtn = document.getElementById('undo-btn');
    const redoBtn = document.getElementById('redo-btn');
    const resetBtn = document.getElementById('reset-btn');
    const inorderBtn = document.getElementById('inorder-btn');
    const preorderBtn = document.getElementById('preorder-btn');
    const postorderBtn = document.getElementById('postorder-btn');
    const levelorderBtn = document.getElementById('levelorder-btn');
    const traversalOutput = document.getElementById('traversal-output');
    const treeStateOutput = document.getElementById('tree-state-output');
    const nodeCountSpan = document.getElementById('node-count');
    const treeHeightSpan = document.getElementById('tree-height');
    const treeTypeBtns = document.querySelectorAll('.tree-type-btn');

    // Theme toggle elements
    const themeToggleBtn = document.getElementById('theme-toggle-btn');

    // Apply saved theme from localStorage
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggleBtn.textContent = '☀️';
            themeToggleBtn.title = 'Switch to light theme';
        } else {
            document.body.classList.remove('dark-theme');
            themeToggleBtn.textContent = '🌙';
            themeToggleBtn.title = 'Switch to dark theme';
        }
        localStorage.setItem('tv_theme', theme);
    }

    // Initialize theme based on saved preference or system preference
    (function initTheme() {
        const saved = localStorage.getItem('tv_theme');
        if (saved) return applyTheme(saved);
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
    })();

    themeToggleBtn.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-theme');
        applyTheme(isDark ? 'light' : 'dark');
    });

    let activeTreeType = 'BT';
    let tree;
    let animationSpeed = 600; // Default animation speed
    
    // State Management for Undo/Redo
    let history = [[]];
    let historyIndex = 0;

    // Node Class
    class Node {
        constructor(value) {
            this.value = value;
            this.left = null;
            this.right = null;
            this.height = 1;
            this.x = 0; this.y = 0; this.element = null;
        }
    }
    
    // --- GENERAL TREE VISUALIZATION CLASS ---
    class TreeVisualizer {
        constructor() { this.root = null; }
        insert(value) { throw new Error("Insert must be implemented."); }
        remove(value) { throw new Error("Remove must be implemented."); }

        getTraversal(type) {
            const result = [];
            switch(type) {
                case 'inorder': this._inorder(this.root, result); break;
                case 'preorder': this._preorder(this.root, result); break;
                case 'postorder': this._postorder(this.root, result); break;
                case 'levelorder': this._levelorder(this.root, result); break;
            }
            return result;
        }
        _inorder(node, result) { if (node) { this._inorder(node.left, result); result.push(node); this._inorder(node.right, result); } }
        _preorder(node, result) { if (node) { result.push(node); this._preorder(node.left, result); this._preorder(node.right, result); } }
        _postorder(node, result) { if (node) { this._postorder(node.left, result); this._postorder(node.right, result); result.push(node); } }
        _levelorder(node, result) {
            if (!node) return;
            const queue = [node];
            while (queue.length > 0) {
                const current = queue.shift();
                result.push(current);
                if (current.left) queue.push(current.left);
                if (current.right) queue.push(current.right);
            }
        }
        
        getNodeCount() { return this._count(this.root); }
        _count(node) {
            if (!node) return 0;
            return 1 + this._count(node.left) + this._count(node.right);
        }
        getTreeHeight() { return this._height(this.root); }
        _height(node) {
            if (!node) return 0;
            return 1 + Math.max(this._height(node.left), this._height(node.right));
        }

        async search(value) {
            // Show algorithm steps for search
            const steps = [
                'Algorithm to Search a Node in Binary Search Tree:',
                '1. Start at the root node.',
                '2. If root is NULL, return NOT FOUND.',
                '3. If root->data == value, return FOUND.',
                '4. If value < root->data, search in left subtree.',
                '5. If value > root->data, search in right subtree.',
                '6. Repeat steps 2-5 until node is found or subtree is NULL.'
            ];
            showAlgorithmSteps(steps);
            const explanations = [
                'Begin the search at the root of the tree.',
                'Compare the value you are searching for with the current node’s value.',
                'If the values are equal, you have found the node.',
                'If the target value is less than the current node, move to the left child.',
                'If the target value is greater, move to the right child.',
                'Continue this process until you find the node or reach a leaf (empty subtree).'
            ];
            showAlgorithmExplanation(explanations);
            // Find the node and the path to it
            const { foundNode, path } = this._findNodeWithPath(this.root, value, []);
            
            if (path.length > 0) {
                // Highlight the path
                for (let i = 0; i < path.length; i++) {
                    const nodeInPath = path[i];
                    if (nodeInPath.element) {
                        // Remove highlight from previous node
                        if (i > 0) {
                            const prevNode = path[i-1];
                            if (prevNode.element) {
                                prevNode.element.classList.remove('search-path-green');
                                prevNode.element.classList.remove('found-yellow');
                            }
                        }
                        if (nodeInPath === foundNode) {
                            nodeInPath.element.classList.add('found-yellow'); // Yellow for the target
                        } else {
                            nodeInPath.element.classList.add('search-path-green'); // Green for path nodes
                        }
                        await new Promise(r => setTimeout(r, animationSpeed));
                    }
                }

                await new Promise(r => setTimeout(r, animationSpeed * 2));

                // Remove highlight from final node
                if (path.length > 0 && path[path.length-1].element) {
                    path[path.length-1].element.classList.remove('found-yellow');
                    path[path.length-1].element.classList.remove('search-path-green');
                }
            } else {
                showNotification(`Value ${value} not found in the tree.`);
            }
        }

        // Modified _findNode to also return the path
        _findNodeWithPath(node, value, path) {
            if (!node) return { foundNode: null, path: path };

            path.push(node); // Add current node to path

            if (node.value === value) {
                return { foundNode: node, path: path };
            }

            if (activeTreeType !== 'BT' && value < node.value) {
                return this._findNodeWithPath(node.left, value, path);
            } else if (activeTreeType !== 'BT' && value > node.value) {
                return this._findNodeWithPath(node.right, value, path);
            } else {
                // For BT, search both left and right if not found yet
                const leftResult = this._findNodeWithPath(node.left, value, [...path]); // Pass a copy
                if (leftResult.foundNode) return leftResult;
                
                const rightResult = this._findNodeWithPath(node.right, value, [...path]); // Pass a copy
                if (rightResult.foundNode) return rightResult;
                
                return { foundNode: null, path: [] }; // Not found in this subtree
            }
        }
        
        draw() {
            treeContainer.innerHTML = '';
            if (this.root) {
                this._setNodePositions(this.root, 0, treeContainer.offsetWidth / 2, 50);
                this._drawNode(this.root, null);
            }
        }
        _setNodePositions(node, level, x, y) { if (!node) return; node.x = x; node.y = y; const hGap = Math.max(treeContainer.offsetWidth / Math.pow(2, level + 2.5), 40); this._setNodePositions(node.left, level + 1, x - hGap, y + 80); this._setNodePositions(node.right, level + 1, x + hGap, y + 80); }
    _drawNode(node, parent) { if (!node) return; node.element = document.createElement('div'); node.element.className = 'node'; node.element.innerText = node.value; node.element.style.left = `${node.x}px`; node.element.style.top = `${node.y}px`; treeContainer.appendChild(node.element); if (parent) this._drawLine(parent, node); this._drawNode(node.left, node); this._drawNode(node.right, node); }
    _drawLine(parent, child) { const line = document.createElement('div'); line.className = 'line'; const dx = child.x - parent.x, dy = child.y - parent.y; const dist = Math.sqrt(dx*dx + dy*dy); const angle = Math.atan2(dy, dx) * 180 / Math.PI; line.style.width = `${dist}px`; line.style.left = `${parent.x}px`; line.style.top = `${parent.y}px`; line.style.transform = `rotate(${angle}deg)`; treeContainer.insertBefore(line, treeContainer.firstChild); }
        
        async animateTraversal(type) {
            const nodeQueue = this.getTraversal(type);
            traversalOutput.textContent = '';
            for (const node of nodeQueue) {
                if (node.element) {
                    node.element.classList.add('highlight');
                    traversalOutput.textContent += (traversalOutput.textContent ? ' → ' : '') + node.value;
                    await new Promise(r => setTimeout(r, animationSpeed));
                    node.element.classList.remove('highlight');
                }
            }
        }
    }
    
    // --- TREE IMPLEMENTATIONS ---
    class BinaryTree extends TreeVisualizer {
        insert(value) { const newNode = new Node(value); if (!this.root) { this.root = newNode; } else { const q = [this.root]; while(true) { const n = q.shift(); if (!n.left) { n.left = newNode; break; } if (!n.right) { n.right = newNode; break; } q.push(n.left, n.right); } } }
        remove(value) { alert("Deletion is not supported for standard Binary Tree in this visualizer."); return false; }
        // For BT, search needs to be modified slightly to correctly find the path in _findNodeWithPath
        _findNodeWithPath(node, value, path) {
            if (!node) return { foundNode: null, path: [] };

            path.push(node);

            if (node.value === value) {
                return { foundNode: node, path: path };
            }

            // In Binary Tree, we check both children until found
            let result = this._findNodeWithPath(node.left, value, [...path]);
            if (result.foundNode) return result;

            result = this._findNodeWithPath(node.right, value, [...path]);
            if (result.foundNode) return result;
            
            // If not found in current path, return null and empty path
            return { foundNode: null, path: [] };
        }
    }
    class BinarySearchTree extends TreeVisualizer {
        insert(value) { this.root = this._insertNode(this.root, value); }
        _insertNode(n, v) { if (!n) return new Node(v); if (v < n.value) n.left = this._insertNode(n.left, v); else if (v > n.value) n.right = this._insertNode(n.right, v); return n; }
        remove(value) { this.root = this._removeNode(this.root, value); }
        _removeNode(n, v) { if (!n) return null; if (v < n.value) n.left = this._removeNode(n.left, v); else if (v > n.value) n.right = this._removeNode(n.right, v); else { if (!n.left) return n.right; if (!n.right) return n.left; const min = this._findMin(n.right); n.value = min.value; n.right = this._removeNode(n.right, min.value); } return n; }
        _findMin(n) { return n.left ? this._findMin(n.left) : n; }
    }
    class AVLTree extends BinarySearchTree {
        _h(n) { return n ? n.height : 0; }
        _bal(n) { return n ? this._h(n.left) - this._h(n.right) : 0; }
        _updateH(n) { n.height = 1 + Math.max(this._h(n.left), this._h(n.right)); }
        _rotR(y) { const x = y.left; y.left = x.right; x.right = y; this._updateH(y); this._updateH(x); return x; }
        _rotL(x) { const y = x.right; x.right = y.left; y.left = x; this._updateH(x); this._updateH(y); return y; }
        _insertNode(n, v) { n = super._insertNode(n, v); if (!n) return n; this._updateH(n); const bal = this._bal(n); if (bal > 1 && v < n.left.value) return this._rotR(n); if (bal < -1 && v > n.right.value) return this._rotL(n); if (bal > 1 && v > n.left.value) { n.left = this._rotL(n.left); return this._rotR(n); } if (bal < -1 && v < n.right.value) { n.right = this._rotR(n.right); return this._rotL(n); } return n; }
        _removeNode(n, v) { n = super._removeNode(n, v); if (!n) return n; this._updateH(n); const bal = this._bal(n); if (bal > 1 && this._bal(n.left) >= 0) return this._rotR(n); if (bal > 1 && this._bal(n.left) < 0) { n.left = this._rotL(n.left); return this._rotR(n); } if (bal < -1 && this._bal(n.right) <= 0) return this._rotL(n); if (bal < -1 && this._bal(n.right) > 0) { n.right = this._rotR(n.right); return this._rotL(n); } return n; }
    }


    // --- CORE LOGIC & EVENT HANDLERS ---
    function initializeTree(type) {
        switch(type) {
            case 'BT': return new BinaryTree();
            case 'BST': return new BinarySearchTree();
            case 'AVL': return new AVLTree();
            default: return new BinaryTree();
        }
    }
    function updateHistory(newState) {
        history = history.slice(0, historyIndex + 1);
        history.push(newState);
        historyIndex++;
        updateUI();
    }
    function rebuildTreeFromState(nodes) {
        tree = initializeTree(activeTreeType);
        nodes.forEach(val => tree.insert(val));
        tree.draw();
        updateUI();
    }
    function updateUI() {
        const currentState = history[historyIndex];
        treeStateOutput.textContent = currentState.length === 0 ? 'Start by inserting a node!' : currentState.join(' → ');
        undoBtn.disabled = historyIndex <= 0;
        redoBtn.disabled = historyIndex >= history.length - 1;
        nodeCountSpan.textContent = tree.getNodeCount();
        treeHeightSpan.textContent = tree.getTreeHeight();
    }
    
    // Navigation / Page Switching
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            
            pageSections.forEach(section => {
                section.id === targetId ? section.classList.remove('hidden') : section.classList.add('hidden');
            });
        });
    });

    // Speed Slider Control
    speedSlider.addEventListener('input', (e) => {
        animationSpeed = 1100 - e.target.value; // Invert value so right is faster
    });

    // Other Event Listeners
    treeTypeBtns.forEach(btn => btn.addEventListener('click', () => { activeTreeType = btn.dataset.treeType; treeTypeBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active'); rebuildTreeFromState(history[historyIndex]); }));
    insertBtn.addEventListener('click', () => {
        const value = parseInt(nodeValueInput.value);
        if (isNaN(value)) return;
        let currentState = [...history[historyIndex]];
        if (!currentState.includes(value)) {
            // Show algorithm steps for insertion
            const steps = [
                'Algorithm to Insert a Node in Binary Search Tree:',
                '1. Start at the root node.',
                '2. If root is NULL, insert node as root.',
                `3. If value < root->data, insert in left subtree.`,
                `4. If value > root->data, insert in right subtree.`,
                '5. Repeat steps 2-4 until correct position is found.'
            ];
            showAlgorithmSteps(steps);
            showAlgorithmExplanation([]);
            currentState.push(value);
            updateHistory(currentState);
            rebuildTreeFromState(currentState);
        } else {
            showNotification(`Value ${value} already exists.`);
        }
        nodeValueInput.value = '';
        nodeValueInput.focus();
    });
    deleteBtn.addEventListener('click', () => {
        const value = parseInt(nodeValueInput.value);
        if (isNaN(value)) return;
        let currentState = [...history[historyIndex]];
        const index = currentState.indexOf(value);
        if (index > -1) {
            // Show algorithm steps and explanation for deletion
            const steps = [
                'Algorithm to Delete a Node in Binary Search Tree:',
                '1. Start at the root node.',
                `2. Search for the node with value ${value}.`,
                '3. If node is not found, return NOT FOUND.',
                '4. If node has no children, simply remove it.',
                '5. If node has one child, replace node with its child.',
                '6. If node has two children:',
                '   a. Find inorder successor (smallest in right subtree).',
                '   b. Replace node’s value with successor’s value.',
                '   c. Delete the successor node.'
            ];
            const explanations = [
                `Begin the deletion process by starting at the root of the tree.`,
                `Traverse the tree to locate the node with the value you want to delete.`,
                `Once the node is found, remove it. If the node has children, handle them according to the tree type (e.g., replace with child or restructure).`,
                `Reconnect any child nodes to maintain the tree's structure.`,
                `Finally, update the tree's properties such as node count and height.`
            ];
            showAlgorithmSteps(steps);
            showAlgorithmExplanation(explanations);
            currentState.splice(index, 1);
            updateHistory(currentState);
            rebuildTreeFromState(currentState);
        } else {
            showNotification(`Value ${value} not found.`);
            showAlgorithmSteps([]);
            showAlgorithmExplanation([]);
        }
        nodeValueInput.value = '';
        nodeValueInput.focus();
    });
    searchBtn.addEventListener('click', () => { const value = parseInt(nodeValueInput.value); if (!isNaN(value)) tree.search(value); nodeValueInput.value = ''; nodeValueInput.focus(); });
    nodeValueInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') insertBtn.click(); });
    undoBtn.addEventListener('click', () => { if (historyIndex > 0) { historyIndex--; rebuildTreeFromState(history[historyIndex]); } });
    redoBtn.addEventListener('click', () => { if (historyIndex < history.length - 1) { historyIndex++; rebuildTreeFromState(history[historyIndex]); } });
    resetBtn.addEventListener('click', () => { history = [[]]; historyIndex = 0; rebuildTreeFromState([]); traversalOutput.textContent = ''; });
    inorderBtn.addEventListener('click', () => tree.animateTraversal('inorder'));
    preorderBtn.addEventListener('click', () => tree.animateTraversal('preorder'));
    postorderBtn.addEventListener('click', () => tree.animateTraversal('postorder'));
    levelorderBtn.addEventListener('click', () => tree.animateTraversal('levelorder'));
    window.addEventListener('resize', () => tree.draw());
    
    // Initial setup
    tree = initializeTree(activeTreeType);
    updateUI();
});