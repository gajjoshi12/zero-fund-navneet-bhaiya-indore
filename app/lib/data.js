// Data management functions for tasks, submissions, and users

// Initialize demo data
export function initializeDemoData() {
    // Check if already initialized
    if (localStorage.getItem('tradefund_initialized')) return;

    // Demo tasks
    const demoTasks = [
        {
            id: 'task_1',
            title: 'Complete Trading Challenge - Phase 1',
            description: 'Achieve 8% profit target within the drawdown limits. Trade any instrument of your choice.',
            reward: 50000,
            deadline: '2026-02-15',
            requirements: [
                'Minimum 5 trading days',
                'Maximum 5% daily drawdown',
                'Maximum 10% total drawdown',
                '8% profit target'
            ],
            status: 'active',
            createdAt: new Date().toISOString()
        },
        {
            id: 'task_2',
            title: 'Social Media Promotion',
            description: 'Share your trading journey on social media and tag @TradeFundPro. Submit screenshot as proof.',
            reward: 5000,
            deadline: '2026-02-01',
            requirements: [
                'Post on Instagram or Twitter',
                'Tag @TradeFundPro',
                'Include your trading stats',
                'Minimum 100 followers'
            ],
            status: 'active',
            createdAt: new Date().toISOString()
        },
        {
            id: 'task_3',
            title: 'Refer a Friend',
            description: 'Refer a friend to join TradeFund Pro and earn bonus when they complete their first challenge.',
            reward: 10000,
            deadline: '2026-03-01',
            requirements: [
                'Friend must signup using your referral link',
                'Friend must complete a challenge',
                'Provide friend email and signup proof'
            ],
            status: 'active',
            createdAt: new Date().toISOString()
        },
        {
            id: 'task_4',
            title: 'Video Testimonial',
            description: 'Record a 1-2 minute video testimonial about your experience with TradeFund Pro.',
            reward: 15000,
            deadline: '2026-02-28',
            requirements: [
                'Video must be 1-2 minutes long',
                'Good audio and video quality',
                'Share your genuine experience',
                'Face must be visible'
            ],
            status: 'active',
            createdAt: new Date().toISOString()
        }
    ];

    localStorage.setItem('tradefund_tasks', JSON.stringify(demoTasks));
    localStorage.setItem('tradefund_initialized', 'true');
}

// Task functions
export function getAllTasks() {
    return JSON.parse(localStorage.getItem('tradefund_tasks') || '[]');
}

export function getTaskById(id) {
    const tasks = getAllTasks();
    return tasks.find(t => t.id === id);
}

export function createTask(task) {
    const tasks = getAllTasks();
    const newTask = {
        ...task,
        id: `task_${Date.now()}`,
        status: 'active',
        createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    localStorage.setItem('tradefund_tasks', JSON.stringify(tasks));
    return newTask;
}

export function updateTask(id, updates) {
    const tasks = getAllTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
        tasks[index] = { ...tasks[index], ...updates };
        localStorage.setItem('tradefund_tasks', JSON.stringify(tasks));
        return tasks[index];
    }
    return null;
}

export function deleteTask(id) {
    const tasks = getAllTasks();
    const filtered = tasks.filter(t => t.id !== id);
    localStorage.setItem('tradefund_tasks', JSON.stringify(filtered));
}

// User task assignments
export function assignTaskToUser(taskId, userId) {
    const assignments = JSON.parse(localStorage.getItem('tradefund_assignments') || '[]');
    const existing = assignments.find(a => a.taskId === taskId && a.userId === userId);

    if (!existing) {
        const newAssignment = {
            id: `assign_${Date.now()}`,
            taskId,
            userId,
            status: 'pending', // pending, in_progress, submitted, completed, rejected
            assignedAt: new Date().toISOString()
        };
        assignments.push(newAssignment);
        localStorage.setItem('tradefund_assignments', JSON.stringify(assignments));
        return newAssignment;
    }
    return existing;
}

export function getUserAssignments(userId) {
    const assignments = JSON.parse(localStorage.getItem('tradefund_assignments') || '[]');
    return assignments.filter(a => a.userId === userId);
}

export function getAllAssignments() {
    return JSON.parse(localStorage.getItem('tradefund_assignments') || '[]');
}

export function updateAssignment(id, updates) {
    const assignments = JSON.parse(localStorage.getItem('tradefund_assignments') || '[]');
    const index = assignments.findIndex(a => a.id === id);
    if (index !== -1) {
        assignments[index] = { ...assignments[index], ...updates };
        localStorage.setItem('tradefund_assignments', JSON.stringify(assignments));
        return assignments[index];
    }
    return null;
}

// Submissions
export function createSubmission(assignmentId, userId, taskId, proofUrl, notes) {
    const submissions = JSON.parse(localStorage.getItem('tradefund_submissions') || '[]');
    const newSubmission = {
        id: `sub_${Date.now()}`,
        assignmentId,
        userId,
        taskId,
        proofUrl,
        notes,
        status: 'pending', // pending, approved, rejected
        submittedAt: new Date().toISOString()
    };
    submissions.push(newSubmission);
    localStorage.setItem('tradefund_submissions', JSON.stringify(submissions));

    // Update assignment status
    updateAssignment(assignmentId, { status: 'submitted' });

    return newSubmission;
}

export function getUserSubmissions(userId) {
    const submissions = JSON.parse(localStorage.getItem('tradefund_submissions') || '[]');
    return submissions.filter(s => s.userId === userId);
}

export function getAllSubmissions() {
    return JSON.parse(localStorage.getItem('tradefund_submissions') || '[]');
}

export function updateSubmission(id, updates) {
    const submissions = JSON.parse(localStorage.getItem('tradefund_submissions') || '[]');
    const index = submissions.findIndex(s => s.id === id);
    if (index !== -1) {
        submissions[index] = { ...submissions[index], ...updates };
        localStorage.setItem('tradefund_submissions', JSON.stringify(submissions));
        return submissions[index];
    }
    return null;
}

export function approveSubmission(submissionId) {
    const submission = updateSubmission(submissionId, {
        status: 'approved',
        reviewedAt: new Date().toISOString()
    });

    if (submission) {
        // Update assignment status
        updateAssignment(submission.assignmentId, { status: 'completed' });

        // Add reward to user balance
        const task = getTaskById(submission.taskId);
        if (task) {
            const users = JSON.parse(localStorage.getItem('tradefund_users') || '[]');
            const userIndex = users.findIndex(u => u.id === submission.userId);
            if (userIndex !== -1) {
                users[userIndex].balance = (users[userIndex].balance || 0) + task.reward;
                users[userIndex].totalEarnings = (users[userIndex].totalEarnings || 0) + task.reward;
                localStorage.setItem('tradefund_users', JSON.stringify(users));
            }
        }
    }

    return submission;
}

export function rejectSubmission(submissionId, reason) {
    const submission = updateSubmission(submissionId, {
        status: 'rejected',
        rejectionReason: reason,
        reviewedAt: new Date().toISOString()
    });

    if (submission) {
        updateAssignment(submission.assignmentId, { status: 'rejected' });
    }

    return submission;
}

// User functions
export function getAllUsers() {
    return JSON.parse(localStorage.getItem('tradefund_users') || '[]');
}

export function getUserById(id) {
    const users = getAllUsers();
    return users.find(u => u.id === id);
}

export function updateUserStatus(userId, status) {
    const users = getAllUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
        users[index].status = status;
        localStorage.setItem('tradefund_users', JSON.stringify(users));
        return users[index];
    }
    return null;
}

// Stats
export function getAdminStats() {
    const users = getAllUsers();
    const tasks = getAllTasks();
    const submissions = getAllSubmissions();
    const assignments = getAllAssignments();

    return {
        totalUsers: users.length,
        activeTasks: tasks.filter(t => t.status === 'active').length,
        pendingSubmissions: submissions.filter(s => s.status === 'pending').length,
        completedTasks: assignments.filter(a => a.status === 'completed').length,
        totalPaidOut: users.reduce((sum, u) => sum + (u.totalEarnings || 0), 0)
    };
}

export function getUserStats(userId) {
    const assignments = getUserAssignments(userId);
    const submissions = getUserSubmissions(userId);
    const user = getUserById(userId);

    return {
        assignedTasks: assignments.length,
        completedTasks: assignments.filter(a => a.status === 'completed').length,
        pendingTasks: assignments.filter(a => a.status === 'pending' || a.status === 'in_progress').length,
        submittedTasks: submissions.length,
        balance: user?.balance || 0,
        totalEarnings: user?.totalEarnings || 0
    };
}
