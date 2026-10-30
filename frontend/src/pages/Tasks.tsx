import { useState } from "react";
import { Plus, Search, CalendarDays, CircleCheck } from "lucide-react";
import Header from "../components/Header";
import "./pageCSS/Tasks.css";

const sampleTasks = [
  { title: "Finalize homepage design", project: "Website Redesign", dueDate: "Oct 15, 2026", priority: "High", status: "In progress" },
  { title: "Review mobile wireframes", project: "Mobile App Development", dueDate: "Oct 16, 2026", priority: "Medium", status: "To do" },
  { title: "Prepare brand guidelines", project: "Brand Identity", dueDate: "Oct 18, 2026", priority: "Low", status: "Completed" },
  { title: "Check SEO audit report", project: "SEO Optimization", dueDate: "Oct 19, 2026", priority: "Urgent", status: "To do" },
  { title: "Send design feedback", project: "Website Redesign", dueDate: "Oct 21, 2026", priority: "Medium", status: "In progress" },
];

function Tasks() {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const filteredTasks = sampleTasks.filter((task) => `${task.title} ${task.project}`.toLowerCase().includes(searchText.toLowerCase()) && (statusFilter === "All" || task.status === statusFilter));
  return <div className="tasks-container">
    <Header title="Tasks" description="Stay on top of your team's work and deadlines." />
    <div className="tasks-content">
      <div className="tasks-list-heading"><div><h2>All tasks</h2><p>Organize work and track what needs to get done.</p></div><button type="button" className="tasks-add-button" onClick={() => alert("Task creation will be connected to your API next.")}><Plus size={17} /> Add task</button></div>
      <div className="tasks-filters"><label className="tasks-search"><Search size={18} /><input value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Search tasks..." /></label><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter tasks by status"><option>All</option><option>To do</option><option>In progress</option><option>Completed</option></select></div>
      <div className="tasks-list">{filteredTasks.map((task) => <article className="tasks-list-card" key={task.title}>
        <div className={`tasks-check-icon ${task.status === "Completed" ? "tasks-check-completed" : ""}`}>{task.status === "Completed" ? <CircleCheck size={20} /> : <span />}</div>
        <div className="tasks-main-info"><h3>{task.title}</h3><p>{task.project}</p></div><div className="tasks-due-date"><CalendarDays size={15} /><span>{task.dueDate}</span></div>
        <span className={`tasks-priority tasks-priority-${task.priority.toLowerCase()}`}>{task.priority}</span><span className={`tasks-status tasks-status-${task.status.toLowerCase().replace(" ", "-")}`}>{task.status}</span>
      </article>)}{filteredTasks.length === 0 && <p className="tasks-empty-state">No tasks match your filters.</p>}</div>
    </div>
  </div>;
}
export default Tasks;
