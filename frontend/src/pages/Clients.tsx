import { useState } from "react";
import { Plus, Search, Users, Mail, Phone, MoreHorizontal } from "lucide-react";
import Header from "../components/Header";
import "./pageCSS/Clients.css";

const sampleClients = [
  { name: "Acme Studio", contact: "Olivia Martin", email: "olivia@acmestudio.com", phone: "+1 555 0101", status: "Active", projects: 3 },
  { name: "Bright Solutions", contact: "Noah Williams", email: "noah@brightsolutions.com", phone: "+1 555 0102", status: "Active", projects: 2 },
  { name: "Nova Creative", contact: "Emma Davis", email: "emma@novacreative.com", phone: "+1 555 0103", status: "Lead", projects: 0 },
  { name: "Pixel Works", contact: "Liam Wilson", email: "liam@pixelworks.com", phone: "+1 555 0104", status: "Inactive", projects: 1 },
];

function Clients() {
  const [searchText, setSearchText] = useState("");
  const filteredClients = sampleClients.filter((client) => `${client.name} ${client.contact} ${client.email}`.toLowerCase().includes(searchText.toLowerCase()));
  return <div className="clients-container">
    <Header title="Clients" description="Manage your client relationships in one place." />
    <div className="clients-content">
      <section className="clients-overview"><div className="clients-overview-icon"><Users size={23} /></div><div><p>Total clients</p><h2>{sampleClients.length}</h2></div><span className="clients-overview-note">Sample client records</span></section>
      <section className="clients-list-section">
        <div className="clients-list-heading"><div><h2>All clients</h2><p>View and manage your clients.</p></div><button className="clients-add-button" type="button" onClick={() => alert("Client form will be added during API integration.")}><Plus size={17} /> Add client</button></div>
        <label className="clients-search"><Search size={18} /><input value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Search clients..." /></label>
        <div className="clients-table-container"><table className="clients-table"><thead><tr><th>Client</th><th>Contact</th><th>Phone</th><th>Projects</th><th>Status</th><th>Actions</th></tr></thead><tbody>
          {filteredClients.map((client) => <tr key={client.email}><td><div className="client-name-cell"><span className="client-avatar">{client.name.charAt(0)}</span><span>{client.name}</span></div></td><td><div className="client-contact-name">{client.contact}</div><div className="client-email"><Mail size={13} />{client.email}</div></td><td><span className="client-phone"><Phone size={13} />{client.phone}</span></td><td>{client.projects}</td><td><span className={`client-status client-status-${client.status.toLowerCase()}`}>{client.status}</span></td><td><button type="button" className="client-action-button" aria-label={`Actions for ${client.name}`}><MoreHorizontal size={19} /></button></td></tr>)}
          {filteredClients.length === 0 && <tr><td colSpan={6} className="clients-empty-state">No clients match your search.</td></tr>}
        </tbody></table></div>
      </section>
    </div>
  </div>;
}
export default Clients;
