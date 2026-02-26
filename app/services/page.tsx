import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function ServicesPage() {
  const services = [
    {
      title: 'Project Management',
      description: 'Plan, track, and deliver projects with ease. Kanban boards, timelines, and task dependencies all in one place.',
      features: ['Custom workflows', 'Milestone tracking', 'Resource allocation'],
    },
    {
      title: 'Team Collaboration',
      description: 'Keep everyone on the same page with real‑time updates, comments, and file sharing.',
      features: ['Team chat', 'File attachments', 'Mentions & notifications'],
    },
    {
      title: 'Analytics & Reporting',
      description: 'Get insights into your team’s productivity with custom reports and dashboards.',
      features: ['Burndown charts', 'Velocity tracking', 'Exportable reports'],
    },
    {
      title: 'Integrations',
      description: 'Connect with the tools you already use, like Slack, GitHub, and Google Calendar.',
      features: ['Two‑way sync', 'Webhooks', 'API access'],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Simple header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm fixed top-0 w-full z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-tight text-gray-900">
            INFINITE
          </Link>
          <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            ← Home
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight mb-6">
              Services we offer
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything your team needs to stay productive and focused.
            </p>
          </div>

          {/* Services grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-500">
                      <CheckCircle size={18} className="text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-20 text-center bg-gradient-to-r from-indigo-50 to-purple-50 p-12 rounded-3xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
            <p className="text-gray-600 mb-8">Join thousands of teams using Infinite to manage their work.</p>
            <Link
              href="/signup"
              className="inline-block bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-all shadow-lg"
            >
              Start your free trial
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}