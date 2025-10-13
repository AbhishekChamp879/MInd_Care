import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useEffect } from 'react';

export default function Terms() {
  useEffect(() => {
    document.title = 'Terms of Service — MindBuddy';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="h-20" />

      <main className="container mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-muted-foreground mb-6">
          These Terms govern your use of MindBuddy. By using our services, you agree to these terms.
        </p>

        <section className="prose max-w-none text-muted-foreground">
          <h2>Use of Service</h2>
          <p>
            You agree to use MindBuddy lawfully and in accordance with these Terms. You are
            responsible for maintaining your account credentials.
          </p>

          <h2>Content & Conduct</h2>
          <p>
            Users must not post harassing, illegal, or infringing content. We reserve the right
            to remove content or suspend accounts for violations.
          </p>

          <h2>Disclaimers</h2>
          <p>
            MindBuddy provides supportive tools and does not replace professional medical advice
            or emergency services. In emergencies contact local authorities.
          </p>

          <h2>Governing Law</h2>
          <p>
            These Terms are governed by the laws of the jurisdiction in which MindBuddy operates.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
