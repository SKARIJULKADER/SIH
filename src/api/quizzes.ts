// src/api/quizzes.ts
// Multiple-choice quizzes for the post-lecture quiz section on each course page.
import type { QuizQuestion } from './types'

export const quizQuestions: QuizQuestion[] = [
  // ── Data Structures & Algorithms ──────────────────────────────
  { id: 'q-dsa-1', subjectId: 'sub-dsa', question: 'Which Big-O notation describes binary search on a sorted array?', options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(n²)'], correctIndex: 1, explanation: 'Binary search halves the search space each step, giving O(log n) average and worst-case time.' },
  { id: 'q-dsa-2', subjectId: 'sub-dsa', question: 'Which data structure uses FIFO (First In, First Out) ordering?', options: ['Stack', 'Queue', 'Tree', 'Graph'], correctIndex: 1, explanation: 'A queue processes the oldest element first (FIFO), like a line at a counter.' },
  { id: 'q-dsa-3', subjectId: 'sub-dsa', question: 'What is the time complexity of appending to a dynamic array (amortized)?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'], correctIndex: 0, explanation: 'Amortized over many appends, each append is O(1) despite occasional O(n) resizes.' },
  { id: 'q-dsa-4', subjectId: 'sub-dsa', question: 'Which traversal visits left subtree, then root, then right subtree?', options: ['Preorder', 'Inorder', 'Postorder', 'Level order'], correctIndex: 1, explanation: 'Inorder traversal visits Left → Root → Right, yielding sorted order for a BST.' },
  { id: 'q-dsa-5', subjectId: 'sub-dsa', question: 'A hash table resolves collisions using chaining. What is stored at each bucket?', options: ['A single key', 'A linked list of entries', 'A sorted array', 'A stack'], correctIndex: 1, explanation: 'With chaining, each bucket stores a linked list of key-value pairs that hash to it.' },

  // ── Object Oriented Programming ───────────────────────────────
  { id: 'q-oops-1', subjectId: 'sub-oops', question: 'Which OOP principle hides internal state behind methods?', options: ['Inheritance', 'Polymorphism', 'Encapsulation', 'Abstraction'], correctIndex: 2, explanation: 'Encapsulation bundles data with methods and restricts direct access using modifiers like private.' },
  { id: 'q-oops-2', subjectId: 'sub-oops', question: 'Which keyword lets a subclass reuse a parent class constructor?', options: ['this', 'super', 'extends', 'implements'], correctIndex: 1, explanation: 'super() calls the superclass constructor and gives access to parent members.' },
  { id: 'q-oops-3', subjectId: 'sub-oops', question: 'Method overloading is an example of which type of polymorphism?', options: ['Runtime polymorphism', 'Compile-time polymorphism', 'Multiple inheritance', 'Duck typing'], correctIndex: 1, explanation: 'Overloading is resolved at compile time by signature, a form of static polymorphism.' },

  // ── Database Management Systems ───────────────────────────────
  { id: 'q-dbms-1', subjectId: 'sub-dbms', question: 'Which SQL clause filters rows before grouping?', options: ['HAVING', 'WHERE', 'ORDER BY', 'GROUP BY'], correctIndex: 1, explanation: 'WHERE filters rows first; HAVING filters groups after GROUP BY runs.' },
  { id: 'q-dbms-2', subjectId: 'sub-dbms', question: 'Which normal form removes partial dependencies?', options: ['1NF', '2NF', '3NF', 'BCNF'], correctIndex: 1, explanation: '2NF removes partial dependencies (non-key attributes depending on part of a composite key).' },
  { id: 'q-dbms-3', subjectId: 'sub-dbms', question: 'What does ACID stand for?', options: ['Atomicity, Consistency, Isolation, Durability', 'Availability, Consistency, Integrity, Data', 'Atomic, Compact, Isolated, Durable', 'Access, Control, Index, Delete'], correctIndex: 0, explanation: 'ACID guarantees reliable transactions: Atomicity, Consistency, Isolation, Durability.' },

  // ── Operating Systems ─────────────────────────────────────────
  { id: 'q-os-1', subjectId: 'sub-os', question: 'Which scheduling algorithm minimizes average waiting time?', options: ['FCFS', 'Round Robin', 'SJF (Shortest Job First)', 'Priority with preemption'], correctIndex: 2, explanation: 'SJF provably minimizes average waiting time when jobs are known in advance.' },
  { id: 'q-os-2', subjectId: 'sub-os', question: 'Deadlock cannot occur if which condition is removed?', options: ['Mutual exclusion', 'Preemption', 'Circular wait', 'All four conditions must hold; removing any one prevents deadlock'], correctIndex: 3, explanation: 'Coffman conditions: mutual exclusion, hold-and-wait, no preemption, and circular wait must ALL hold.' },
  { id: 'q-os-3', subjectId: 'sub-os', question: 'Which memory technique swaps pages between RAM and disk?', options: ['Segmentation', 'Paging with demand paging', 'Contiguous allocation', 'Paging without swap'], correctIndex: 1, explanation: 'Demand paging brings pages into memory only when needed and swaps them out when full.' },

  // ── Mathematics I ─────────────────────────────────────────────
  { id: 'q-maths-1', subjectId: 'sub-maths', question: 'What is the derivative of f(x) = x³?', options: ['3x²', 'x²', '3x', 'x³/3'], correctIndex: 0, explanation: 'Power rule: d/dx xⁿ = n·xⁿ⁻¹, so x³ → 3x².' },
  { id: 'q-maths-2', subjectId: 'sub-maths', question: 'The determinant of a 2×2 matrix [[a,b],[c,d]] is:', options: ['ad + bc', 'ad − bc', 'ab − cd', 'a + d'], correctIndex: 1, explanation: 'det = a·d − b·c for a 2×2 matrix.' },
  { id: 'q-maths-3', subjectId: 'sub-maths', question: 'What is the value of ∫₀¹ 2x dx?', options: ['0', '1', '2', '0.5'], correctIndex: 1, explanation: '∫2x dx = x², evaluated from 0 to 1 gives 1 − 0 = 1.' },

  // ── Computer Networks ─────────────────────────────────────────
  { id: 'q-net-1', subjectId: 'sub-networks', question: 'Which protocol is connection-oriented and reliable?', options: ['UDP', 'TCP', 'IP', 'ICMP'], correctIndex: 1, explanation: 'TCP establishes connections, retransmits lost packets, and guarantees in-order delivery.' },
  { id: 'q-net-2', subjectId: 'sub-networks', question: 'Which layer of the OSI model routes packets across networks?', options: ['Data Link', 'Network', 'Transport', 'Session'], correctIndex: 1, explanation: 'The Network layer (Layer 3) handles logical addressing and routing.' },
  { id: 'q-net-3', subjectId: 'sub-networks', question: 'Which device forwards frames based on MAC addresses?', options: ['Router', 'Switch', 'Hub', 'Modem'], correctIndex: 1, explanation: 'A switch uses MAC addresses at the Data Link layer to forward frames.' },

  // ── Artificial Intelligence ───────────────────────────────────
  { id: 'q-ai-1', subjectId: 'sub-ai', question: 'Which search algorithm uses a heuristic to estimate cost to goal?', options: ['BFS', 'DFS', 'A*', 'Uniform-cost search'], correctIndex: 2, explanation: 'A* combines path cost g(n) with heuristic h(n): f(n) = g(n) + h(n).' },
  { id: 'q-ai-2', subjectId: 'sub-ai', question: 'Which learning type uses labeled training data?', options: ['Unsupervised', 'Supervised', 'Reinforcement', 'Self-supervised autoencoders'], correctIndex: 1, explanation: 'Supervised learning maps inputs to known labels, e.g. classification on labelled data.' },
  { id: 'q-ai-3', subjectId: 'sub-ai', question: 'What is the primary role of an agent in AI?', options: ['Store data', 'Perceive, reason, and act in an environment', 'Compile code', 'Provide a graphical UI'], correctIndex: 1, explanation: 'An intelligent agent perceives its environment and acts to achieve its goals.' },

  // ── Compiler Design (sem-7) ───────────────────────────────────
  { id: 'q-com-1', subjectId: 'sub-compiler', question: 'Which phase of a compiler produces tokens?', options: ['Lexical analysis', 'Syntax analysis', 'Semantic analysis', 'Code generation'], correctIndex: 0, explanation: 'The lexer/scanner breaks source code into tokens during lexical analysis.' },
  { id: 'q-com-2', subjectId: 'sub-compiler', question: 'Which parsing technique uses a lookahead table (LR family)?', options: ['Recursive descent', 'LL(1)', 'LR(1)', 'Operator precedence'], correctIndex: 2, explanation: 'LR(1) parsers build a parsing table and are used by tools like yacc/bison.' },
  // ── Machine Learning (sem-7) ──────────────────────────────────
  { id: 'q-ml-1', subjectId: 'sub-ml', question: 'Which metric is used for classification accuracy?', options: ['Mean squared error', '(Correct predictions) / (Total predictions)', 'R²', 'Silhouette score'], correctIndex: 1, explanation: 'Accuracy = number of correct predictions divided by total predictions.' },
  { id: 'q-ml-2', subjectId: 'sub-ml', question: 'Overfitting is best reduced by:', options: ['Increasing model depth', 'Regularization and more training data', 'Removing validation set', 'Removing features blindly'], correctIndex: 1, explanation: 'Regularization (L1/L2), cross-validation, and more data combat overfitting.' },
  { id: 'q-ml-3', subjectId: 'sub-ml', question: 'Which algorithm is commonly used for clustering?', options: ['Linear Regression', 'K-Means', 'Naive Bayes', 'Gradient Boosting'], correctIndex: 1, explanation: 'K-Means partitions data into k clusters based on distance to centroids.' },

  // ── Cloud Computing (sem-7) ───────────────────────────────────
  { id: 'q-cloud-1', subjectId: 'sub-cloud', question: 'Which service model provides virtual machines and storage?', options: ['SaaS', 'IaaS', 'PaaS', 'FaaS'], correctIndex: 1, explanation: 'IaaS (Infrastructure as a Service) provides raw compute, storage, and networking.' },
  { id: 'q-cloud-2', subjectId: 'sub-cloud', question: 'Scaling out refers to:', options: ['Adding more resources to one machine', 'Adding more instances', 'Reducing instance size', 'Vertical scaling only'], correctIndex: 1, explanation: 'Scaling out (horizontal) adds more instances; scaling up adds resources to one instance.' },
  { id: 'q-cloud-3', subjectId: 'sub-cloud', question: 'Which tool packages and runs applications in isolated containers?', options: ['Docker', 'Ansible', 'Nagios', 'Terraform'], correctIndex: 0, explanation: 'Docker packages apps with their dependencies into portable, isolated containers.' },

  // ── Internet of Things (sem-8) ────────────────────────────────
  { id: 'q-iot-1', subjectId: 'sub-iot', question: 'Which protocol is lightweight and common in IoT messaging?', options: ['MQTT', 'FTP', 'SMTP', 'Telnet'], correctIndex: 0, explanation: 'MQTT is a lightweight publish/subscribe protocol designed for constrained devices.' },
  { id: 'q-iot-2', subjectId: 'sub-iot', question: 'A typical IoT architecture layers (in order) are:', options: ['Application → Transport → Network', 'Perception → Network → Application', 'Storage → Compute → Display', 'Edge → Cloud → Edge'], correctIndex: 1, explanation: 'IoT commonly follows Perception (sensing), Network (connectivity), and Application (services) layers.' },
  { id: 'q-iot-3', subjectId: 'sub-iot', question: 'Which device is an example of an IoT actuator?', options: ['Temperature sensor', 'Servo motor', 'Camera', 'Microphone'], correctIndex: 1, explanation: 'An actuator performs a physical action (e.g., a servo motor) unlike sensors which measure.' },

  // ── Blockchain Technology (sem-8) ─────────────────────────────
  { id: 'q-block-1', subjectId: 'sub-blockchain', question: 'Which consensus algorithm does Bitcoin use?', options: ['Proof of Stake', 'Proof of Work', 'PBFT', 'Raft'], correctIndex: 1, explanation: 'Bitcoin relies on Proof of Work (mining) to secure its blockchain.' },
  { id: 'q-block-2', subjectId: 'sub-blockchain', question: 'What executes automatically when conditions in code are met?', options: ['Merkle tree', 'Smart contract', 'Oracle', 'Block header'], correctIndex: 1, explanation: 'Smart contracts are self-executing agreements written in code on the blockchain.' },
  { id: 'q-block-3', subjectId: 'sub-blockchain', question: 'Which structure links blocks cryptographically?', options: ['Linked list of hashes', 'Merkle tree of previous block hashes in header', 'B-tree', 'Adjacency matrix'], correctIndex: 1, explanation: 'Each block header includes the hash of the previous block, forming the chain.' },
]

export const quizForSubject = (subjectId: string): QuizQuestion[] =>
  quizQuestions.filter((q) => q.subjectId === subjectId)