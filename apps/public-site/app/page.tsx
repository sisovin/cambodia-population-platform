// apps/public-site/app/page.tsx
import Hero from '../components/Hero';
import QuickAccessTiles from '../components/QuickAccessTiles';
import AboutSection from '../components/AboutSection';
import NewsSection from '../components/NewsSection';
import ContactSection from '../components/ContactSection';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <QuickAccessTiles />
      <AboutSection />
      <NewsSection />
      <ContactSection />
    </main>
  );
}
