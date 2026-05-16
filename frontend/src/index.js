import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { LanguageProvider } from "./context/LanguageContext";
import { ClerkProvider } from "@clerk/clerk-react";

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ClerkProvider>
  </React.StrictMode>
);