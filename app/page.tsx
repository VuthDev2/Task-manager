import Hero from './components/Hero';
import Features from './components/Features';
import LandingExpansion from './components/LandingExpansion';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main className="bg-white">
      <Hero />      {/*  top */}
      <Features />  {/*  middle */}
      <LandingExpansion />
      <Footer />    {/* bottom */}
    </main>
  );
}
