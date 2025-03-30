import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Theme } from "@radix-ui/themes";
import { ThemeProvider } from './components/theme-provider';
import { ClerkProvider } from '@clerk/clerk-react'
import { esMX } from '@clerk/localizations'
import '@fontsource/poppins';

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Theme>
      <ThemeProvider>
        <ClerkProvider localization={esMX} publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/" afterSignInUrl="/dashboard">
          <App />
        </ClerkProvider>
      </ThemeProvider>
    </Theme>
  </React.StrictMode>,
);
