import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useEffect } from 'react';
import { Phone } from 'lucide-react';

export default function Crisis() {
  useEffect(() => {
    document.title = 'Crisis Support — MindBuddy';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="h-20" />

      <main className="container mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-destructive">Crisis Support</h1>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <section className="space-y-4 text-muted-foreground">
            <p className="text-lg">
              If you or someone else is in immediate danger, please call your local emergency
              number right away.
            </p>

            <div className="p-6 bg-white/60 border border-border rounded-xl">
              <h2 className="text-xl font-semibold mb-2">Immediate Help</h2>
              <p className="mb-4">Call the numbers below for urgent support.</p>
              <div className="space-y-2">
                <a href="tel:988" className="flex items-center gap-3 text-destructive hover:underline">
                  <Phone className="h-5 w-5" />
                  US Crisis Hotline: 988
                </a>
                <a href="tel:911" className="flex items-center gap-3 text-destructive hover:underline">
                  <Phone className="h-5 w-5" />
                  Emergency Services: 911
                </a>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">When to seek urgent help</h3>
              <ul className="list-disc pl-5 text-muted-foreground">
                <li>Thoughts of harming yourself or others</li>
                <li>Severe panic attack or loss of contact with reality</li>
                <li>Immediate risk due to substance use</li>
              </ul>
            </div>
          </section>

          <aside className="space-y-4 text-muted-foreground">
            <h3 className="text-lg font-semibold">Non-urgent supports</h3>
            <p>
              If this is not an emergency, consider contacting a licensed counselor through our
              booking system or using AI chat for immediate triage.
            </p>

            <div className="p-4 bg-muted/30 rounded-lg">
              <strong>Resources:</strong>
              <ul className="list-disc pl-5 mt-2">
                <li>National suicide prevention lifeline</li>
                <li>Local crisis centers</li>
                <li>Peer support lines</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
