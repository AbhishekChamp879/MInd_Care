import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useEffect, useState } from 'react';

export default function Report() {
  useEffect(() => {
    document.title = 'Report an Issue — MindBuddy';
  }, []);

  const [form, setForm] = useState({ email: '', details: '' });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="h-20" />

      <main className="container mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Report an Issue</h1>
        <p className="text-muted-foreground mb-6">If you encounter harmful content, abuse, or a technical bug, let us know.</p>

        <form className="max-w-2xl space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Your email (optional)</span>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-border mt-2" />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Details</span>
            <textarea value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} rows={6} className="w-full px-4 py-2 rounded-lg border border-border mt-2" />
          </label>

          <div>
            <button type="button" className="px-6 py-2 bg-primary text-primary-foreground rounded-lg">Submit Report</button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
