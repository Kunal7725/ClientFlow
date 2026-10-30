import { Bell, Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./componentCSS/Header.css";

interface HeaderProps { title: string; description: string; }

function Header({ title, description }: HeaderProps) {
  const navigate = useNavigate();
  return (
    <header className="header-container">
      <div className="header-page-info"><h1 className="header-title">{title}</h1><p className="header-description">{description}</p></div>
      <div className="header-actions">
        <label className="header-search"><Search size={18} /><input type="search" placeholder="Search anything..." aria-label="Search" /></label>
        <button type="button" className="header-notification-button" aria-label="Notifications" title="Notifications"><Bell size={20} /><span className="notification-dot" /></button>
        <button type="button" className="header-create-button" onClick={() => navigate("/projects")}><Plus size={18} /><span>New project</span></button>
      </div>
    </header>
  );
}
export default Header;
