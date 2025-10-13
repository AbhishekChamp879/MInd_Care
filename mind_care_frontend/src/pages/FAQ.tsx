import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useEffect } from 'react';

const faqs = [
  { q: 'Is MindBuddy confidential?', a: 'Yes — we anonymize non-essential data and follow security best practices.' },
  { q: 'How quickly can I get a counselor?', a: 'Availability varies. Bookings are typically within 48-72 hours.' },
  { q: 'Is AI medical advice?', a: 'No — AI offers screening and guidance but not medical diagnosis.' },
];

export default function FAQ() {
  useEffect(() => {
    document.title = 'FAQ — MindBuddy';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="h-20" />

      <main className="container mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <div className="space-y-6">
          {faqs.map((f) => (
            <details key={f.q} className="bg-white/60 border border-border rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">{f.q}</summary>
              <p className="mt-2 text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
