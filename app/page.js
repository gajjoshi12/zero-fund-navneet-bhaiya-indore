'use client';

import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Challenges from './components/Challenges';
import HowItWorks from './components/HowItWorks';
import Payouts from './components/Payouts';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import CTA from './components/CTA';
import Footer from './components/Footer';
import SMSNotifications from './components/SMSNotifications';

export default function Home() {
  // Scroll animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Parallax effect for background orbs
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const orb1 = document.querySelector('.bg-gradient-orb');
      const orb2 = document.querySelector('.bg-gradient-orb-2');

      if (orb1) {
        orb1.style.transform = `translate(${scrollY * 0.05}px, ${scrollY * 0.1}px)`;
      }

      if (orb2) {
        orb2.style.transform = `translate(${scrollY * -0.05}px, ${scrollY * -0.1}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Navbar />
      <SMSNotifications />
      <main>
        <Hero />
        <Features />
        <Challenges />
        <HowItWorks />
        <Payouts />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
