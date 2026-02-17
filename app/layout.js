import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from './context/AuthContext';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'TradeFund Pro | Get Funded - Trade Like a Pro',
  description: 'Join 500,000+ traders worldwide. Get funded accounts up to $500,000 and keep up to 90% of your profits. Complete our challenges and start trading today.',
  openGraph: {
    title: 'TradeFund Pro | Get Funded - Trade Like a Pro',
    description: 'Join 500,000+ traders worldwide. Get funded accounts up to $500,000 and keep up to 90% of your profits.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {/* Animated Background */}
          <div className="bg-gradient-orb"></div>
          <div className="bg-gradient-orb-2"></div>
          <div className="bg-grid"></div>

          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
