import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main className="bg-white">
      <Hero />      {/* This shows the top */}
      <Features />  {/* This shows the middle */}
      <Footer />    {/* This shows the bottom */}
    </main>
  );
}