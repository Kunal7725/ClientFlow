import { useState, type FormEvent } from "react";
import { UserRound, Bell, ShieldCheck, Save } from "lucide-react";
import Header from "../components/Header";
import "./pageCSS/Settings.css";

function Settings() {
  const [name, setName] = useState("Kunal Mengoliya");
  const [email, setEmail] = useState("kunal@example.com");
  const [workspaceName, setWorkspaceName] = useState("ClientFlow Workspace");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [saveMessage, setSaveMessage] = useState("");

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaveMessage("These settings are only saved in this screen for now. API saving will be connected later.");
  }

  return <div className="settings-container">
    <Header title="Settings" description="Manage your profile and workspace preferences." />
    <div className="settings-content"><form onSubmit={handleSave} className="settings-form">
      <section className="settings-section">
        <div className="settings-section-heading"><span className="settings-section-icon"><UserRound size={20} /></span><div><h2>Profile information</h2><p>Update your personal details.</p></div></div>
        <div className="settings-fields">
          <label className="settings-field"><span>Full name</span><input value={name} onChange={(event) => setName(event.target.value)} required /></label>
          <label className="settings-field"><span>Email address</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
          <label className="settings-field settings-field-full"><span>Workspace name</span><input value={workspaceName} onChange={(event) => setWorkspaceName(event.target.value)} required /></label>
        </div>
      </section>
      <section className="settings-section">
        <div className="settings-section-heading"><span className="settings-section-icon settings-icon-orange"><Bell size={20} /></span><div><h2>Notifications</h2><p>Choose which reminders you want to receive.</p></div></div>
        <label className="settings-toggle-row"><span><strong>Email notifications</strong><small>Receive updates about workspace activity.</small></span><input type="checkbox" checked={emailNotifications} onChange={(event) => setEmailNotifications(event.target.checked)} /></label>
        <label className="settings-toggle-row"><span><strong>Task reminders</strong><small>Get reminders about upcoming deadlines.</small></span><input type="checkbox" checked={taskReminders} onChange={(event) => setTaskReminders(event.target.checked)} /></label>
      </section>
      <section className="settings-section">
        <div className="settings-section-heading"><span className="settings-section-icon settings-icon-green"><ShieldCheck size={20} /></span><div><h2>Security</h2><p>Keep your workspace account secure.</p></div></div>
        <p className="settings-security-note">Password updates and session management will be added when the account settings API is connected.</p>
      </section>
      <div className="settings-save-row">{saveMessage && <p className="settings-save-message" role="status">{saveMessage}</p>}<button type="submit" className="settings-save-button"><Save size={17} /> Save changes</button></div>
    </form></div>
  </div>;
}
export default Settings;
