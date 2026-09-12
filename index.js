const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const methodOverride = require("method-override");
const cors = require("cors");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "client", "dist")));

// Initial seed data with priority and due date support
let tasks = [
    {
        id: uuidv4(),
        title: "Design System & Modern UI",
        details: "Establish cohesive color tokens, typography scales, and glassmorphic card styles for the task board.",
        priority: "high",
        dueDate: "2026-09-15",
        isDone: true,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
        id: uuidv4(),
        title: "Connect Redux Toolkit Store",
        details: "Configure slices, async thunks for API communication, and task status selectors.",
        priority: "high",
        dueDate: "2026-09-16",
        isDone: false,
        createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
        id: uuidv4(),
        title: "Add Task Filtering & Search",
        details: "Implement live text search, status filters (All/Active/Completed), and priority tags.",
        priority: "medium",
        dueDate: "2026-09-18",
        isDone: false,
        createdAt: new Date().toISOString()
    },
    {
        id: uuidv4(),
        title: "Write End-to-End Documentation",
        details: "Document API endpoints and client state architecture in walkthrough guide.",
        priority: "low",
        dueDate: "2026-09-20",
        isDone: false,
        createdAt: new Date().toISOString()
    }
];

// ==========================================
// REST API ROUTES (For React + Redux Client)
// ==========================================

// GET all tasks (supports query filtering)
app.get("/api/tasks", (req, res) => {
    let result = [...tasks];
    const { status, priority, search } = req.query;

    if (status === "completed") {
        result = result.filter((t) => t.isDone);
    } else if (status === "active") {
        result = result.filter((t) => !t.isDone);
    }

    if (priority && priority !== "all") {
        result = result.filter((t) => t.priority === priority);
    }

    if (search && search.trim()) {
        const q = search.toLowerCase();
        result = result.filter(
            (t) => t.title.toLowerCase().includes(q) || (t.details && t.details.toLowerCase().includes(q))
        );
    }

    res.json(result);
});

// GET single task by ID
app.get("/api/tasks/:id", (req, res) => {
    const { id } = req.params;
    const task = tasks.find((t) => t.id === id);
    if (!task) {
        return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
});

// POST new task
app.post("/api/tasks", (req, res) => {
    const { title, details, priority, dueDate } = req.body;
    if (!title || !title.trim()) {
        return res.status(400).json({ error: "Task title is required" });
    }

    const newTask = {
        id: uuidv4(),
        title: title.trim(),
        details: details ? details.trim() : "",
        priority: priority || "medium",
        dueDate: dueDate || null,
        isDone: false,
        createdAt: new Date().toISOString()
    };

    tasks.unshift(newTask);
    res.status(201).json(newTask);
});

// PATCH toggle task done status
app.patch("/api/tasks/:id/done", (req, res) => {
    const { id } = req.params;
    const task = tasks.find((t) => t.id === id);
    if (!task) {
        return res.status(404).json({ error: "Task not found" });
    }

    task.isDone = !task.isDone;
    res.json(task);
});

// PATCH update task details
app.patch("/api/tasks/:id", (req, res) => {
    const { id } = req.params;
    const task = tasks.find((t) => t.id === id);
    if (!task) {
        return res.status(404).json({ error: "Task not found" });
    }

    const { title, details, priority, dueDate, isDone } = req.body;
    if (title !== undefined) task.title = title.trim();
    if (details !== undefined) task.details = details.trim();
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (isDone !== undefined) task.isDone = Boolean(isDone);

    res.json(task);
});

// DELETE task
app.delete("/api/tasks/:id", (req, res) => {
    const { id } = req.params;
    const exists = tasks.some((t) => t.id === id);
    if (!exists) {
        return res.status(404).json({ error: "Task not found" });
    }

    tasks = tasks.filter((t) => t.id !== id);
    res.json({ success: true, id });
});

// ==========================================
// LEGACY SSR ROUTES (EJS fallback)
// ==========================================

app.get("/", (req, res) => {
    res.redirect("/tasks");
});

app.get("/tasks", (req, res) => {
    res.render("index.ejs", { tasks });
});

app.get("/tasks/new", (req, res) => {
    res.render("new.ejs");
});

app.post("/tasks", (req, res) => {
    let { title, details, priority, dueDate } = req.body;
    let id = uuidv4();
    tasks.unshift({
        id,
        title,
        details: details || "",
        priority: priority || "medium",
        dueDate: dueDate || null,
        isDone: false,
        createdAt: new Date().toISOString()
    });
    res.redirect("/tasks");
});

app.patch("/tasks/:id/done", (req, res) => {
    let { id } = req.params;
    let task = tasks.find((p) => id === p.id);
    if (task) {
        task.isDone = !task.isDone;
    }
    res.redirect("/tasks");
});

app.get("/tasks/:id", (req, res, next) => {
    let { id } = req.params;
    let task = tasks.find((p) => id == p.id);
    if (!task) {
        let err = new Error("Task not found!");
        err.status = 404;
        return next(err);
    }
    res.render("show.ejs", { task });
});

app.patch("/tasks/:id", (req, res) => {
    let { id } = req.params;
    let newDetails = req.body.details;
    let task = tasks.find((p) => id == p.id);
    if (task) {
        task.details = newDetails;
    }
    res.redirect("/tasks");
});

app.get("/tasks/:id/edit", (req, res, next) => {
    let { id } = req.params;
    let task = tasks.find((p) => id == p.id);
    if (!task) {
        let err = new Error("Task not found!");
        err.status = 404;
        return next(err);
    }
    res.render("edit.ejs", { task });
});

app.get("/tasks/:id/delete", (req, res, next) => {
    let { id } = req.params;
    let task = tasks.find((p) => id === p.id);
    if (!task) {
        let err = new Error("Task not found!");
        err.status = 404;
        return next(err);
    }
    res.render("delete.ejs", { task });
});

app.delete("/tasks/:id", (req, res) => {
    let { id } = req.params;
    tasks = tasks.filter((p) => id !== p.id);
    res.redirect("/tasks");
});

// Catch-all route to serve React App for any client routes
app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

// Global Error Handler
app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong!" } = err;
    console.error(err.stack);
    if (req.path.startsWith("/api/")) {
        return res.status(status).json({ error: message });
    }
    res.status(status).render("error.ejs", { message });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});