import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, FolderKanban, CheckSquare, Receipt, Settings as SettingsIcon, BriefcaseBusiness, ChevronLeft } from "lucide-react";
import "./componentCSS/Sidebar.css";

function Sidebar() {
    return (
        <aside className="sidebar-container">
            <div className="sidebar-header">
                <div className="sidebar-logo"><BriefcaseBusiness size={24} /></div>
                <div className="sidebar-brand"><h2>ClientFlow</h2><p>Business workspace</p></div>
                <button type="button" className="sidebar-collapse-button" aria-label="Collapse sidebar" title="Collapse sidebar (coming soon)"><ChevronLeft size={18} /></button>
            </div>
            <div className="sidebar-workspace">
                <p className="sidebar-section-title">WORKSPACE</p>
                <nav className="sidebar-navigation" aria-label="Main navigation">
                    <NavLink to="/" end className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link-active" : ""}`}><LayoutDashboard size={19} /><span>Dashboard</span></NavLink>
                    <NavLink to="/clients" className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link-active" : ""}`}><Users size={19} /><span>Clients</span></NavLink>
                    <NavLink to="/projects" className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link-active" : ""}`}><FolderKanban size={19} /><span>Projects</span></NavLink>
                    <NavLink to="/tasks" className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link-active" : ""}`}><CheckSquare size={19} /><span>Tasks</span></NavLink>
                    <NavLink to="/invoices" className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link-active" : ""}`}><Receipt size={19} /><span>Invoices</span></NavLink>
                </nav>
            </div>
            <div className="sidebar-bottom">
                <NavLink to="/settings" className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link-active" : ""}`}><SettingsIcon size={19} /><span>Settings</span></NavLink>
                <div className="sidebar-profile"><div className="profile-avatar">K</div><div className="profile-details"><h4>Kunal Mengoliya</h4><p>Workspace Owner</p></div></div>
            </div>
        </aside>
    );
}
export default Sidebar;
