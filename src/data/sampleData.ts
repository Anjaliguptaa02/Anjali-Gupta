import { Note, QuizQuestion, StudyTask, Achievement, AppNotification, UserProfile, QuizResult } from "../types";

export const INITIAL_USER: UserProfile = {
  name: "Anjali Gupta",
  email: "anjali.student@studybuddy.ai",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
  gradeOrCourse: "Grade 12 — STEM & Pre-Engineering",
  preferredSubjects: ["Physics", "Mathematics", "Computer Science"],
  dailyStudyGoalHours: 4.0,
  todayStudiedMinutes: 165, // 2h 45m
  totalStudyHours: 42.5,
  currentStreakDays: 6,
  lastStudyDate: new Date().toISOString().split("T")[0],
  pomodoroSessionsCompleted: 14,
};

export const INITIAL_NOTES: Note[] = [
  {
    id: "note-1",
    title: "Derivatives & The Chain Rule",
    subject: "Mathematics",
    content: "The derivative of a function measures the sensitivity to change of the function value with respect to a change in its argument. The chain rule states that the derivative of f(g(x)) is f'(g(x)) * g'(x).",
    explanation: "Derivatives define the instantaneous rate of change or the slope of the tangent line at any point along a curve. When functions are composite (nested inside one another), the Chain Rule allows us to decompose them systematically.",
    importantPoints: [
      "Derivative of x^n is n*x^(n-1) (Power Rule)",
      "Chain Rule: d/dx[f(g(x))] = f'(g(x)) · g'(x)",
      "Product Rule: d/dx[u·v] = u'v + uv'",
      "Quotient Rule: d/dx[u/v] = (u'v - uv') / v^2",
      "Critical points occur where f'(x) = 0 or f'(x) is undefined",
    ],
    definitions: [
      { term: "Instantaneous Velocity", definition: "The limit of average velocity as the elapsed time approaches zero (the first derivative of position with respect to time)." },
      { term: "Composite Function", definition: "A function whose values are calculated from two given functions by applying one function to the output of the other." },
    ],
    keyTerms: ["Derivative", "Tangent Line", "Chain Rule", "Differentiation", "Extrema"],
    summary: "Mastering differentiation rules forms the basis of calculus, physics modeling, and algorithmic gradient descent in machine learning.",
    examples: [
      "Find derivative of y = (3x^2 + 1)^4 -> dy/dx = 4(3x^2 + 1)^3 · (6x) = 24x(3x^2 + 1)^3.",
    ],
    createdAt: "2026-09-12T10:30:00Z",
    updatedAt: "2026-09-12T10:30:00Z",
    isFavorite: true,
    tags: ["Calculus", "Differentiation", "Core Math"],
  },
  {
    id: "note-2",
    title: "Newton's Laws of Motion & Momentum",
    subject: "Physics",
    content: "Newton's three laws of motion describe the relationship between a body and the forces acting upon it, and its motion in response to those forces.",
    explanation: "Classical mechanics is built on Newton's laws. First law introduces inertia (objects keep doing what they are doing unless an unbalanced force acts). Second law quantifies force as rate of change of momentum (F = dp/dt = ma). Third law states forces occur in equal and opposite interaction pairs.",
    importantPoints: [
      "First Law (Inertia): Constant velocity unless net external force F_net ≠ 0.",
      "Second Law: F_net = m · a (Force equals mass times acceleration).",
      "Third Law: For every action force, there is an equal and opposite reaction force.",
      "Conservation of Linear Momentum: Total momentum is conserved in isolated systems with no net external impulse.",
    ],
    definitions: [
      { term: "Inertia", definition: "The tendency of an object to resist changes in its state of motion." },
      { term: "Impulse", definition: "The product of the average force and the time interval over which it acts (J = F · Δt = Δp)." },
    ],
    keyTerms: ["Inertia", "Acceleration", "Momentum", "Net Force", "Impulse"],
    summary: "Newton's laws govern macroscopic mechanical systems from planetary orbits to automobile safety braking.",
    examples: [
      "Calculating recoil velocity of a cannon when firing a 10kg cannonball at 300 m/s using conservation of momentum.",
    ],
    createdAt: "2026-09-13T14:15:00Z",
    updatedAt: "2026-09-13T14:15:00Z",
    isFavorite: true,
    tags: ["Mechanics", "Forces", "Newton"],
  },
  {
    id: "note-3",
    title: "Chemical Bonding & Molecular Orbitals",
    subject: "Chemistry",
    content: "Chemical bonds form when atoms share or transfer valence electrons to achieve stable octet electronic configurations.",
    explanation: "Ionic bonds occur between electropositive metals and electronegative non-metals via full electron transfer. Covalent bonds form when non-metal atoms share electron pairs. Metallic bonds consist of a lattice of positive metal ions immersed in a delocalized sea of conduction electrons.",
    importantPoints: [
      "Electronegativity difference > 1.7 typically indicates predominantly ionic bonding.",
      "VSEPR theory predicts 3D geometric shapes based on minimizing valence electron pair repulsion.",
      "Hybridization (sp, sp2, sp3) explains carbon's tetrahedral geometry in methane.",
      "Intermolecular forces (Hydrogen bonding > Dipole-dipole > London dispersion) govern boiling points.",
    ],
    definitions: [
      { term: "Electronegativity", definition: "A chemical property describing an atom's ability to attract shared electrons toward itself in a covalent bond." },
      { term: "Dipole Moment", definition: "A measure of the electrical polarity of a molecule resulting from asymmetrical charge distribution." },
    ],
    keyTerms: ["Ionic", "Covalent", "Hybridization", "VSEPR", "Octet Rule"],
    summary: "Understanding molecular geometries and bond polarity explains reactivity, solubility, and phase behavior in both organic and inorganic chemistry.",
    examples: [
      "Water (H2O) has a bent shape (104.5°) due to two lone pairs on oxygen, giving it a strong net dipole and high boiling point.",
    ],
    createdAt: "2026-09-14T09:00:00Z",
    updatedAt: "2026-09-14T09:00:00Z",
    isFavorite: false,
    tags: ["Inorganic", "Bonds", "VSEPR"],
  },
  {
    id: "note-4",
    title: "Binary Search Trees & Traversal",
    subject: "Computer Science",
    content: "A Binary Search Tree (BST) is a node-based binary tree data structure where each node has at most two children. For each node, values in the left subtree are smaller, and values in the right subtree are larger.",
    explanation: "BSTs provide efficient lookup, addition, and removal of data items. On average, search operations take O(log n) time. However, in the worst case (skewed tree), performance can degrade to O(n), which motivates balanced variants like AVL and Red-Black trees.",
    importantPoints: [
      "Left child value < Parent value < Right child value for all subtrees.",
      "In-order traversal (Left -> Root -> Right) visits nodes in strictly sorted ascending order.",
      "Pre-order traversal (Root -> Left -> Right) is ideal for serializing/copying the tree.",
      "Post-order traversal (Left -> Right -> Root) is ideal for bottom-up deletion or subtree evaluation.",
      "Average time complexity for Search/Insert/Delete: O(log n); Worst case: O(n).",
    ],
    definitions: [
      { term: "Tree Height", definition: "The length of the longest path from the root node to a leaf node." },
      { term: "Balanced Tree", definition: "A tree where the heights of the two child subtrees of any node differ by at most one." },
    ],
    keyTerms: ["BST", "Recursion", "In-order", "Time Complexity", "Balanced Trees"],
    summary: "Binary Search Trees are crucial building blocks for database indexes, priority queues, and lookup tables.",
    examples: [
      "In-order traversal on a BST with nodes [5, 3, 7, 2, 4] produces the sorted sequence: 2, 3, 4, 5, 7.",
    ],
    createdAt: "2026-09-15T11:45:00Z",
    updatedAt: "2026-09-15T11:45:00Z",
    isFavorite: true,
    tags: ["Data Structures", "Algorithms", "Trees"],
  },
  {
    id: "note-5",
    title: "Rhetorical Devices & Essay Analysis",
    subject: "English",
    content: "Rhetorical devices are techniques that an author or speaker uses to convey to the listener or reader a meaning with the goal of persuading them towards considering a topic from a perspective.",
    explanation: "Aristotle identified the three core rhetorical appeals: Ethos (authority, credibility, ethics), Pathos (emotional resonance and empathy), and Logos (logical arguments, evidence, statistics). Strong analytical essays identify how stylistic devices reinforce these appeals.",
    importantPoints: [
      "Ethos: Establishing trustworthiness and scholarly authority.",
      "Pathos: Evoking compassion, urgency, or righteous indignation.",
      "Logos: Constructing valid deductive or inductive syllogisms backed by hard empirical evidence.",
      "Anaphora: Repetition of a word or phrase at the beginning of successive sentences for cadence and emphasis.",
    ],
    definitions: [
      { term: "Juxtaposition", definition: "Placing two contrasting concepts, characters, or settings side by side to highlight differences." },
      { term: "Synecdoche", definition: "A figure of speech in which a part is made to represent the whole (e.g., 'all hands on deck')." },
    ],
    keyTerms: ["Ethos", "Pathos", "Logos", "Anaphora", "Juxtaposition"],
    summary: "Critical reading and rhetorical analysis equip students to dissect political discourse, literature, and media messaging.",
    examples: [
      "Martin Luther King Jr.'s 'I Have a Dream' speech masterfully employs anaphora and Biblical allusions to blend ethos, pathos, and logos.",
    ],
    createdAt: "2026-09-11T16:20:00Z",
    updatedAt: "2026-09-11T16:20:00Z",
    isFavorite: false,
    tags: ["Rhetoric", "Literature", "Essay Writing"],
  },
  {
    id: "note-6",
    title: "Global Climate Cycles & Heat Convection",
    subject: "General Knowledge",
    content: "Earth's climate system is driven by solar radiation and thermal redistribution via atmospheric cells (Hadley, Ferrel, Polar) and oceanic thermohaline circulation.",
    explanation: "Solar heating is strongest at the equator, creating low pressure and warm rising air that drives atmospheric circulation cells. Simultaneously, cold, dense, saline water sinks at the poles, driving the deep ocean conveyor belt that regulates regional temperatures worldwide.",
    importantPoints: [
      "Hadley Cells: Tropical circulation with equatorial upwelling and desert downwelling at ~30° latitude.",
      "Coriolis Effect: Deflection of moving air and water caused by Earth's rotational velocity difference across latitudes.",
      "Thermohaline Circulation: The global ocean conveyor belt driven by temperature and salinity density differences.",
      "Albedo Effect: The fraction of incident solar radiation reflected by ice and cloud cover.",
    ],
    definitions: [
      { term: "Coriolis Force", definition: "An apparent inertial force deflecting moving air/water to the right in the Northern hemisphere and to the left in the Southern hemisphere." },
      { term: "Thermohaline", definition: "Relating to combined effects of temperature (thermo) and salinity (haline) on ocean water density." },
    ],
    keyTerms: ["Coriolis", "Hadley Cell", "Thermohaline", "Albedo", "Jet Stream"],
    summary: "Understanding planetary heat balance is vital for evaluating climate trends, weather forecasting, and geopolitical environmental agreements.",
    examples: [
      "The Gulf Stream brings warm water to Western Europe, keeping winters significantly milder than areas at identical latitudes in Canada.",
    ],
    createdAt: "2026-09-10T12:00:00Z",
    updatedAt: "2026-09-10T12:00:00Z",
    isFavorite: false,
    tags: ["Geography", "Earth Science", "Climate"],
  },
];

export const SAMPLE_QUIZZES: Record<string, { topic: string; subject: string; difficulty: "Easy" | "Medium" | "Hard"; questions: QuizQuestion[] }> = {
  "math-calculus": {
    topic: "Calculus & Derivatives",
    subject: "Mathematics",
    difficulty: "Medium",
    questions: [
      {
        id: "q1",
        question: "What is the derivative of f(x) = 3x^4 - 5x^2 + 7?",
        options: ["12x^3 - 10x", "12x^3 - 5x + 7", "7x^3 - 10x", "12x^4 - 10x^2"],
        correctAnswer: 0,
        explanation: "By the power rule, d/dx(3x^4) = 12x^3, d/dx(-5x^2) = -10x, and d/dx(7) = 0. Thus f'(x) = 12x^3 - 10x.",
      },
      {
        id: "q2",
        question: "Using the chain rule, what is the derivative of y = sin(3x)?",
        options: ["cos(3x)", "3cos(3x)", "-3cos(3x)", "3sin(3x)"],
        correctAnswer: 1,
        explanation: "Let u = 3x. Then dy/dx = (d/du sin(u)) * (du/dx) = cos(3x) * 3 = 3cos(3x).",
      },
      {
        id: "q3",
        question: "At a local maximum of a differentiable function f(x), what is f'(x)?",
        options: ["Always positive", "Always negative", "0", "Undefined"],
        correctAnswer: 2,
        explanation: "By Fermat's Theorem on stationary points, if f has an interior extremum and is differentiable, then f'(x) = 0.",
      },
      {
        id: "q4",
        question: "What is the limit of (sin x) / x as x approaches 0?",
        options: ["0", "1", "Infinity", "Undefined"],
        correctAnswer: 1,
        explanation: "lim_{x->0} (sin x)/x = 1 is a fundamental trigonometric limit proven geometrically via the Squeeze Theorem.",
      },
      {
        id: "q5",
        question: "What is the antiderivative (indefinite integral) of 1/x for x > 0?",
        options: ["ln(x) + C", "-1/x^2 + C", "e^x + C", "x + C"],
        correctAnswer: 0,
        explanation: "Since d/dx(ln x) = 1/x, the integral ∫ (1/x) dx = ln|x| + C.",
      },
    ],
  },
  "physics-mechanics": {
    topic: "Newton's Laws & Energy",
    subject: "Physics",
    difficulty: "Medium",
    questions: [
      {
        id: "pq1",
        question: "If a 5 kg mass accelerates at 4 m/s², what is the net force acting upon it?",
        options: ["1.25 N", "9 N", "20 N", "200 N"],
        correctAnswer: 2,
        explanation: "By Newton's second law: F = m * a = 5 kg * 4 m/s² = 20 N.",
      },
      {
        id: "pq2",
        question: "Which quantity is strictly conserved in an inelastic collision in an isolated system?",
        options: ["Kinetic Energy only", "Linear Momentum only", "Both Kinetic Energy and Momentum", "Velocity"],
        correctAnswer: 1,
        explanation: "In inelastic collisions, mechanical kinetic energy transforms into heat and deformation, but total linear momentum is strictly conserved.",
      },
      {
        id: "pq3",
        question: "What is the work done on an object when the force applied is perpendicular to its displacement?",
        options: ["Positive maximum", "Zero", "Negative maximum", "Equal to mass times velocity"],
        correctAnswer: 1,
        explanation: "Work = F · d · cos(θ). Since cos(90°) = 0, no work is done when force and displacement are perpendicular.",
      },
      {
        id: "pq4",
        question: "What happens to the gravitational force between two masses if the distance between them is halved?",
        options: ["It is halved", "It doubles", "It quadruples", "It remains constant"],
        correctAnswer: 2,
        explanation: "Newton's Universal Gravitation law follows inverse-square relationship F ∝ 1/r². Halving r makes (1/0.5)² = 4 times greater.",
      },
      {
        id: "pq5",
        question: "What is the SI unit of momentum?",
        options: ["Joule (J)", "Watt (W)", "kg·m/s", "Newton (N)"],
        correctAnswer: 2,
        explanation: "Momentum p = m * v. Mass is in kg, velocity is in m/s, so units are kg·m/s (equivalent to N·s).",
      },
    ],
  },
  "cs-algorithms": {
    topic: "Data Structures & Big-O",
    subject: "Computer Science",
    difficulty: "Medium",
    questions: [
      {
        id: "cq1",
        question: "What is the worst-case time complexity of standard QuickSort?",
        options: ["O(log n)", "O(n)", "O(n log n)", "O(n^2)"],
        correctAnswer: 3,
        explanation: "When the pivot chosen is consistently the smallest or largest element (e.g. already sorted array with naive pivot), QuickSort degrades to O(n^2).",
      },
      {
        id: "cq2",
        question: "Which data structure operates on a First-In, First-Out (FIFO) principle?",
        options: ["Stack", "Queue", "Heap", "Tree"],
        correctAnswer: 1,
        explanation: "A Queue processes elements in the order they arrive (FIFO), whereas a Stack uses Last-In, First-Out (LIFO).",
      },
      {
        id: "cq3",
        question: "In a balanced binary search tree with N elements, what is the search time complexity?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
        correctAnswer: 1,
        explanation: "Each comparison eliminates half of the remaining nodes, yielding O(log n) time in balanced trees.",
      },
      {
        id: "cq4",
        question: "Which algorithm finds the shortest path in a weighted graph with non-negative edge weights?",
        options: ["Dijkstra's Algorithm", "Kruskal's Algorithm", "Depth First Search", "Bubble Sort"],
        correctAnswer: 0,
        explanation: "Dijkstra's algorithm greedily explores minimum distance vertices to compute single-source shortest paths in O((V + E) log V).",
      },
      {
        id: "cq5",
        question: "What is the hash collision resolution technique that stores colliding elements in a linked list at each bucket?",
        options: ["Linear Probing", "Quadratic Probing", "Separate Chaining", "Double Hashing"],
        correctAnswer: 2,
        explanation: "Separate Chaining stores multiple elements mapping to the same hash bucket in an auxiliary linked list or tree.",
      },
    ],
  },
};

export const INITIAL_TASKS: StudyTask[] = [
  {
    id: "task-1",
    subject: "Physics",
    topic: "Solve 10 Momentum & Collision numerical problems",
    date: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    endTime: "10:30",
    priority: "High",
    status: "Completed",
    completedAt: new Date().toISOString(),
  },
  {
    id: "task-2",
    subject: "Mathematics",
    topic: "Master Chain Rule and Implicit Differentiation exercises",
    date: new Date().toISOString().split("T")[0],
    startTime: "11:00",
    endTime: "12:30",
    priority: "High",
    status: "Completed",
    completedAt: new Date().toISOString(),
  },
  {
    id: "task-3",
    subject: "Computer Science",
    topic: "Implement Binary Search Tree with In-order & Pre-order Traversal",
    date: new Date().toISOString().split("T")[0],
    startTime: "14:00",
    endTime: "15:30",
    priority: "Medium",
    status: "In Progress",
  },
  {
    id: "task-4",
    subject: "Chemistry",
    topic: "Review Molecular Geometry, Hybridization & VSEPR Diagrams",
    date: new Date().toISOString().split("T")[0],
    startTime: "16:30",
    endTime: "17:45",
    priority: "Medium",
    status: "Pending",
  },
  {
    id: "task-5",
    subject: "English",
    topic: "Draft Rhetorical Analysis outline for upcoming midterm",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0], // Tomorrow
    startTime: "10:00",
    endTime: "11:30",
    priority: "Low",
    status: "Pending",
  },
  {
    id: "task-6",
    subject: "General Knowledge",
    topic: "Quiz practice on Atmospheric Circulation & Ocean Currents",
    date: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
    startTime: "15:00",
    endTime: "16:00",
    priority: "Medium",
    status: "Pending",
  },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "ach-1",
    title: "First Quiz Completed",
    description: "Successfully complete your first interactive subject quiz.",
    iconName: "Award",
    isUnlocked: true,
    unlockedAt: "2026-09-12",
    progress: 1,
    maxProgress: 1,
    category: "quiz",
  },
  {
    id: "ach-2",
    title: "7 Day Study Streak",
    description: "Maintain a consecutive study streak for 7 full days.",
    iconName: "Flame",
    isUnlocked: false,
    progress: 6,
    maxProgress: 7,
    category: "study",
  },
  {
    id: "ach-3",
    title: "10 Quizzes Completed",
    description: "Test your knowledge and complete 10 full quiz assessments.",
    iconName: "Trophy",
    isUnlocked: false,
    progress: 5,
    maxProgress: 10,
    category: "quiz",
  },
  {
    id: "ach-4",
    title: "10 Hours Studied",
    description: "Log more than 10 hours of focused study on StudyBuddy.",
    iconName: "Clock",
    isUnlocked: true,
    unlockedAt: "2026-09-14",
    progress: 42,
    maxProgress: 10,
    category: "study",
  },
  {
    id: "ach-5",
    title: "50 Tasks Completed",
    description: "Mark 50 planner tasks as completed to achieve mastery.",
    iconName: "CheckCircle2",
    isUnlocked: false,
    progress: 18,
    maxProgress: 50,
    category: "task",
  },
  {
    id: "ach-6",
    title: "Note Master",
    description: "Create or AI-generate at least 10 comprehensive study notes.",
    iconName: "BookOpen",
    isUnlocked: false,
    progress: 6,
    maxProgress: 10,
    category: "notes",
  },
  {
    id: "ach-7",
    title: "Curious Mind",
    description: "Ask StudyBot 10 insightful educational questions.",
    iconName: "Brain",
    isUnlocked: true,
    unlockedAt: "2026-09-15",
    progress: 10,
    maxProgress: 10,
    category: "study",
  },
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-1",
    title: "Upcoming Study Task",
    message: "Computer Science: Binary Search Tree session scheduled for 14:00 today.",
    type: "task",
    timestamp: "10 mins ago",
    read: false,
  },
  {
    id: "notif-2",
    title: "Daily Goal 70% Completed!",
    message: "You have completed 2h 45m out of your 4h daily target. Keep going!",
    type: "goal",
    timestamp: "1 hour ago",
    read: false,
  },
  {
    id: "notif-3",
    title: "Midterm Exam Reminder",
    message: "Physics Mechanics midterm exam is in 5 days (Sept 21).",
    type: "exam",
    timestamp: "Yesterday",
    read: true,
  },
  {
    id: "notif-4",
    title: "Achievement Unlocked: Curious Mind",
    message: "You reached 10 questions asked to StudyBot! Check your achievements.",
    type: "achievement",
    timestamp: "2 days ago",
    read: true,
  },
];

export const INITIAL_QUIZ_RESULTS: QuizResult[] = [
  {
    id: "res-1",
    subject: "Mathematics",
    topic: "Calculus & Derivatives",
    totalQuestions: 5,
    correctAnswers: 5,
    wrongAnswers: 0,
    scorePercentage: 100,
    timeTakenSeconds: 94,
    completedAt: "2026-09-14T15:20:00Z",
    difficulty: "Medium",
    userAnswers: [],
  },
  {
    id: "res-2",
    subject: "Physics",
    topic: "Newton's Laws & Energy",
    totalQuestions: 5,
    correctAnswers: 4,
    wrongAnswers: 1,
    scorePercentage: 80,
    timeTakenSeconds: 112,
    completedAt: "2026-09-15T18:00:00Z",
    difficulty: "Medium",
    userAnswers: [],
  },
  {
    id: "res-3",
    subject: "Computer Science",
    topic: "Data Structures & Big-O",
    totalQuestions: 5,
    correctAnswers: 4,
    wrongAnswers: 1,
    scorePercentage: 80,
    timeTakenSeconds: 105,
    completedAt: "2026-09-16T09:30:00Z",
    difficulty: "Medium",
    userAnswers: [],
  },
];

export const SAMPLE_UPCOMING_EXAMS = [
  {
    id: "exam-1",
    subject: "Physics" as const,
    examName: "Physics Mechanics Midterm",
    date: "2026-09-21",
    daysRemaining: 5,
  },
  {
    id: "exam-2",
    subject: "Mathematics" as const,
    examName: "Calculus & Integration Final",
    date: "2026-09-28",
    daysRemaining: 12,
  },
  {
    id: "exam-3",
    subject: "Computer Science" as const,
    examName: "Data Structures Practical Exam",
    date: "2026-10-04",
    daysRemaining: 18,
  },
];

export const DEFAULT_USER_STATS = {
  totalStudyHours: 42.5,
  todayStudyHours: 2.5,
  streakDays: 6,
  quizzesCompleted: 12,
  quizAccuracy: 88,
  weeklyStudyHours: [
    { day: "Mon", hours: 3.5 },
    { day: "Tue", hours: 4.0 },
    { day: "Wed", hours: 2.5 },
    { day: "Thu", hours: 5.0 },
    { day: "Fri", hours: 3.0 },
    { day: "Sat", hours: 4.5 },
    { day: "Sun", hours: 2.5 },
  ],
};

export const SAMPLE_NOTES = INITIAL_NOTES;
export const SAMPLE_TASKS = INITIAL_TASKS;
export const SAMPLE_ACHIEVEMENTS = INITIAL_ACHIEVEMENTS.map((a) => ({
  ...a,
  icon:
    a.iconName === "Flame"
      ? "🔥"
      : a.iconName === "Trophy"
      ? "🏆"
      : a.iconName === "Clock"
      ? "⏰"
      : a.iconName === "CheckCircle2"
      ? "✅"
      : a.iconName === "BookOpen"
      ? "📚"
      : "💡",
  unlocked: a.isUnlocked,
}));
export const SAMPLE_QUIZ_RESULTS = INITIAL_QUIZ_RESULTS;
export const SAMPLE_NOTIFICATIONS = INITIAL_NOTIFICATIONS.map((n) => ({
  ...n,
  time: n.timestamp,
}));
export const DEFAULT_STUDENT_PROFILE = {
  ...INITIAL_USER,
  dailyGoalHours: INITIAL_USER.dailyStudyGoalHours,
  joinedDate: "2026-08-15",
};

