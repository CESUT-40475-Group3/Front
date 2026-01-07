import './globals.css';
import {Providers} from './providers';
import AuthGate from './components/AuthGate';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
    <body>
    <Providers>
      <AuthGate>{children}</AuthGate>
    </Providers>
    </body>
    </html>
  );
}
