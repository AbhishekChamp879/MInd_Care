import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useEffect } from 'react';

export default function Privacy() {
  useEffect(() => {
    document.title = 'Privacy Policy — MindBuddy';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="h-20" />

      <main className="container mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-6">
          Your privacy is important to us. This Privacy Policy explains how MindBuddy
          collects, uses, discloses, and protects your personal information.
        </p>

        <section className="prose max-w-none text-muted-foreground">
          <h2>Information We Collect</h2>
          <p>
            We collect information you provide directly (account details, messages), data
            created through usage (chat transcripts, session metadata), and technical data
            (device, browser, IP address).
          </p>

          <h2>How We Use Information</h2>
          <p>
            We use data to provide, improve, and secure our services, to connect you with
            care, and for analytics. We never sell personal data.
          </p>

          <h2>Data Security</h2>
          <p>
            We follow industry-standard practices to protect data. Sensitive health data is
            handled in accordance with applicable regulations and contractual commitments.
          </p>

          <h2>Your Rights</h2>
          <p>
            You can access, correct, or delete your account information. Contact support to
            make requests or to raise concerns about data handling.
          </p>

          <h2>Contact</h2>
          <p>
            For privacy inquiries, email <a href="mailto:privacy@mindbuddy.com">privacy@mindbuddy.com</a>.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
