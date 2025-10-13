import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useEffect } from 'react';

export default function Cookies() {
  useEffect(() => {
    document.title = 'Cookie Policy — MindBuddy';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="h-20" />

      <main className="container mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Cookie Policy</h1>
        <p className="text-muted-foreground mb-6">
          We use cookies and similar technologies to provide, improve and protect our
          services. This page explains what cookies we use and how you can control them.
        </p>

        <section className="prose max-w-none text-muted-foreground">
          <h2>What are cookies?</h2>
          <p>Cookies are small text files stored on your device to remember preferences and improve experience.</p>

          <h2>Types of cookies we use</h2>
          <ul>
            <li>Essential cookies — required for site functionality.</li>
            <li>Performance cookies — to analyze and improve performance.</li>
            <li>Advertising cookies — used with third parties for ads (where applicable).</li>
          </ul>

          <h2>Managing cookies</h2>
          <p>You can manage cookie preferences in your browser settings or via our consent controls.</p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
