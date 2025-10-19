import { Hero } from '@/components/home/hero';
import { Features } from '@/components/home/features';
import { Sponsors } from '@/components/home/sponsors';
import './page.css';

export default function Home() {
  return (
    <main className="home-layout">
      <Hero />
      <Features />
      <Sponsors />
    </main>
  );
}
