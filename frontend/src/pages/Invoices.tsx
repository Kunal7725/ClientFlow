import { Plus, Download, Receipt, CircleDollarSign } from "lucide-react";
import Header from "../components/Header";
import "./pageCSS/Invoices.css";

const invoices = [
  { number: "INV-2026-014", client: "Acme Studio", date: "Oct 01, 2026", dueDate: "Oct 15, 2026", amount: "$2,400.00", status: "Paid" },
  { number: "INV-2026-015", client: "Bright Solutions", date: "Oct 04, 2026", dueDate: "Oct 18, 2026", amount: "$1,850.00", status: "Pending" },
  { number: "INV-2026-016", client: "Nova Creative", date: "Oct 06, 2026", dueDate: "Oct 12, 2026", amount: "$960.00", status: "Overdue" },
  { number: "INV-2026-017", client: "Pixel Works", date: "Oct 10, 2026", dueDate: "Oct 24, 2026", amount: "$1,200.00", status: "Draft" },
];

function Invoices() {
  return <div className="invoices-container">
    <Header title="Invoices" description="Keep billing organized and monitor payments." />
    <div className="invoices-content">
      <section className="invoices-summary-grid">
        <article className="invoices-summary-card"><span className="invoices-summary-icon"><Receipt size={20} /></span><p>Total invoices</p><h2>4</h2></article>
        <article className="invoices-summary-card"><span className="invoices-summary-icon invoices-summary-green"><CircleDollarSign size={20} /></span><p>Paid this month</p><h2>$2,400</h2></article>
        <article className="invoices-summary-card"><span className="invoices-summary-icon invoices-summary-orange"><CircleDollarSign size={20} /></span><p>Awaiting payment</p><h2>$2,810</h2></article>
      </section>
      <section className="invoices-list-section">
        <div className="invoices-list-heading"><div><h2>Recent invoices</h2><p>Review invoice details and payment status.</p></div><button type="button" className="invoices-add-button" onClick={() => alert("Invoice creation will be added in a future step.")}><Plus size={17} /> Create invoice</button></div>
        <div className="invoices-table-container"><table className="invoices-table"><thead><tr><th>Invoice</th><th>Client</th><th>Issue date</th><th>Due date</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead><tbody>
          {invoices.map((invoice) => <tr key={invoice.number}><td className="invoice-number">{invoice.number}</td><td>{invoice.client}</td><td>{invoice.date}</td><td>{invoice.dueDate}</td><td className="invoice-amount">{invoice.amount}</td><td><span className={`invoice-status invoice-status-${invoice.status.toLowerCase()}`}>{invoice.status}</span></td><td><button type="button" className="invoice-download-button" aria-label={`Download ${invoice.number}`} title="Download (coming soon)"><Download size={17} /></button></td></tr>)}
        </tbody></table></div>
        <p className="invoices-note">These are sample invoice records. Invoice API integration and PDF generation are not connected yet.</p>
      </section>
    </div>
  </div>;
}
export default Invoices;
