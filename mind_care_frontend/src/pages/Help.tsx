import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Help() {
  useEffect(() => {
    document.title = 'Help Center — MindBuddy';
  }, []);

  const topics = [
    { title: 'Getting Started', href: '/help#getting-started' },
    { title: 'Using AI Chat', href: '/help#ai-chat' },
    { title: 'Booking Sessions', href: '/help#booking' },
    { title: 'Privacy & Security', href: '/privacy' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="h-20" />

      <main className="container mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Help Center</h1>
        <p className="text-muted-foreground mb-6">
          Find answers to common questions and guides to using MindBuddy.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <aside className="space-y-4">
            <nav aria-label="Help topics" className="space-y-2">
              {topics.map((t) => (
                <a key={t.title} href={t.href} className="block text-muted-foreground hover:text-primary">
                  {t.title}
                </a>
              ))}
            </nav>
          </aside>

          <section className="md:col-span-2 space-y-8 text-muted-foreground">
            <article id="getting-started">
              <h2 className="text-2xl font-semibold">Getting Started</h2>
              <p>
                Create an account, complete your profile, and explore the dashboard to access
                tools like mood tracking, AI chat, and booked sessions.
              </p>
            </article>

            <article id="ai-chat">
              <h2 className="text-2xl font-semibold">Using AI Chat</h2>
              <p>
                Our AI assistant provides quick screening and guided support. It can suggest
                resources and escalate to a counselor when appropriate. Avoid sharing sensitive
                medical data in chat if you're uncomfortable — use secure session booking for
                direct clinical conversations.
              </p>
            </article>

            <article id="booking">
              <h2 className="text-2xl font-semibold">Booking Sessions</h2>
              <p>
                To book a counseling session, navigate to Book Session in the Platform menu,
                choose a provider, and confirm a time. You will receive email confirmations.
              </p>
            </article>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
