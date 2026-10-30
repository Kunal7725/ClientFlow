import { useState } from "react";
import { Plus, Search, FolderKanban, CalendarDays, MoreHorizontal } from "lucide-react";
import Header from "../components/Header";
import "./pageCSS/Projects.css";

const sampleProjects = [
  { name: "Website Redesign", client: "Acme Studio", dueDate: "Oct 25, 2026", progress: 75, status: "In progress" },
  { name: "Mobile App Development", client: "Bright Solutions", dueDate: "Nov 12, 2026", progress: 45, status: "In progress" },
  { name: "Brand Identity", client: "Nova Creative", dueDate: "Oct 20, 2026", progress: 90, status: "Review" },
  { name: "SEO Optimization", client: "Pixel Works", dueDate: "Nov 30, 2026", progress: 20, status: "Planning" },
];

function Projects() {
  const [searchText, setSearchText] = useState("");
  const filteredProjects = sampleProjects.filter((project) => `${project.name} ${project.client}`.toLowerCase().includes(searchText.toLowerCase()));
  return <div className="projects-container">
    <Header title="Projects" description="Plan work, track progress, and deliver on time." />
    <div className="projects-content">
      <div className="projects-list-heading"><div><h2>All projects</h2><p>{filteredProjects.length} projects shown</p></div><button type="button" className="projects-add-button" onClick={() => alert("Project creation will be connected to your API next.")}><Plus size={17} /> New project</button></div>
      <label className="projects-search"><Search size={18} /><input value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Search projects..." /></label>
      <section className="projects-grid">{filteredProjects.map((project) => <article className="projects-card" key={project.name}>
        <div className="projects-card-top"><div className="projects-card-icon"><FolderKanban size={22} /></div><button type="button" className="projects-action-button" aria-label={`Actions for ${project.name}`}><MoreHorizontal size={20} /></button></div>
        <span className={`projects-status projects-status-${project.status.toLowerCase().replace(" ", "-")}`}>{project.status}</span><h3>{project.name}</h3><p className="projects-client-name">{project.client}</p>
        <div className="projects-progress-label"><span>Progress</span><strong>{project.progress}%</strong></div><div className="projects-progress-bar"><div className="projects-progress-value" style={{ width: `${project.progress}%` }} /></div>
        <div className="projects-due-date"><CalendarDays size={15} /><span>Due {project.dueDate}</span></div>
      </article>)}{filteredProjects.length === 0 && <p className="projects-empty-state">No projects match your search.</p>}</section>
    </div>
  </div>;
}
export default Projects;
