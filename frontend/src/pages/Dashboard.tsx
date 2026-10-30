import { Users, FolderKanban, CheckSquare, Clock3, ArrowUpRight, ArrowRight, CalendarDays, CircleCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import "./pageCSS/Dashboard.css";

const stats = [
  { title: "Total Clients", value: "24", change: "+12% this month", icon: Users, color: "purple" },
  { title: "Active Projects", value: "12", change: "+2 this month", icon: FolderKanban, color: "blue" },
  { title: "Pending Tasks", value: "38", change: "8 due this week", icon: CheckSquare, color: "orange" },
  { title: "Overdue Tasks", value: "5", change: "Needs attention", icon: Clock3, color: "red" },
];
const projects = [
  { name: "Website Redesign", client: "Acme Studio", progress: 75, status: "In progress" },
  { name: "Mobile App Development", client: "Bright Solutions", progress: 45, status: "In progress" },
  { name: "Brand Identity", client: "Nova Creative", progress: 90, status: "Almost done" },
];
const tasks = [
  { title: "Finalize homepage design", project: "Website Redesign", dueDate: "Oct 15, 2026", priority: "High", status: "In progress" },
  { title: "Review mobile wireframes", project: "Mobile App Development", dueDate: "Oct 16, 2026", priority: "Medium", status: "To do" },
  { title: "Prepare brand guidelines", project: "Brand Identity", dueDate: "Oct 18, 2026", priority: "Low", status: "Completed" },
];

function Dashboard() {
  return <div className="dashboard-container">
    <Header title="Dashboard" description="Welcome back! Here's what's happening with your business." />
    <div className="dashboard-content">
      <section className="dashboard-welcome"><div><p className="welcome-label">YOUR WORKSPACE</p><h2>Let's get things done.</h2><p>Keep track of your clients, projects, and daily tasks.</p></div><div className="welcome-icon"><FolderKanban size={34} /></div></section>
      <section className="dashboard-stats" aria-label="Business statistics">
        {stats.map((stat) => { const Icon = stat.icon; return <article className="stats-card" key={stat.title}><div className="stats-card-top"><span className="stats-title">{stat.title}</span><span className={`stats-icon stats-icon-${stat.color}`}><Icon size={20} /></span></div><h3 className="stats-number">{stat.value}</h3><p className="stats-change">{stat.change}</p></article>; })}
      </section>
      <section className="dashboard-projects">
        <div className="section-heading"><div><h2>Recent Projects</h2><p>Track the progress of your active work.</p></div><Link to="/projects" className="section-link">View all <ArrowRight size={16} /></Link></div>
        <div className="project-list">{projects.map((project) => <article className="project-card" key={project.name}><div className="project-card-heading"><div className="project-icon"><FolderKanban size={20} /></div><span className="project-status">{project.status}</span></div><h3>{project.name}</h3><p className="project-client">{project.client}</p><div className="project-progress-info"><span>Progress</span><span>{project.progress}%</span></div><div className="project-progress-bar"><div className="project-progress-value" style={{ width: `${project.progress}%` }} /></div></article>)}</div>
      </section>
      <section className="dashboard-tasks">
        <div className="section-heading"><div><h2>Recent Tasks</h2><p>Here's what your team is working on.</p></div><Link to="/tasks" className="section-link">View all <ArrowRight size={16} /></Link></div>
        <div className="tasks-table-container"><table className="tasks-table"><thead><tr><th>Task</th><th>Due date</th><th>Priority</th><th>Status</th></tr></thead><tbody>
          {tasks.map((task) => <tr key={task.title}><td><div className="task-title">{task.title}</div><div className="task-project">{task.project}</div></td><td><span className="task-due-date"><CalendarDays size={15} />{task.dueDate}</span></td><td><span className={`task-priority task-priority-${task.priority.toLowerCase()}`}>{task.priority}</span></td><td><span className={`task-status ${task.status === "Completed" ? "task-status-completed" : ""}`}>{task.status === "Completed" && <CircleCheck size={14} />}{task.status}</span></td></tr>)}
        </tbody></table></div>
      </section>
      <section className="dashboard-summary"><ArrowUpRight size={18} /><p>Dashboard figures are sample data for now. We'll connect this page to your ClientFlow API next.</p></section>
    </div>
  </div>;
}
export default Dashboard;
