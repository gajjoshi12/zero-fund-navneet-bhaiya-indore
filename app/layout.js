import { Space_Grotesk, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from './context/AuthContext';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' });

export const metadata = {
  title: 'Zero Fund Pro | Get Funded - Trade Like a Pro',
  description: 'Join 500,000+ traders worldwide. Get funded accounts up to ₹500,000 and keep up to 90% of your profits. Complete our challenges and start trading today.',
  openGraph: {
    title: 'Zero Fund Pro | Get Funded - Trade Like a Pro',
    description: 'Join 500,000+ traders worldwide. Get funded accounts up to ₹500,000 and keep up to 90% of your profits.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${jakarta.variable} font-sans`}>
        <AuthProvider>
          {/* Animated Background & Floating Elements */}
          <div className="bg-gradient-orb"></div>
          <div className="bg-gradient-orb-2"></div>
          <div className="bg-grid"></div>

          {/* Super Attractive Floating Elements */}
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>

          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
