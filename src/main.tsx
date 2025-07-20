import { createRoot } from 'react-dom/client'
import { AuthProvider } from '@/contexts/AuthContext'
import { RangeProvider } from '@/contexts/RangeContext'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <RangeProvider>
      <App />
    </RangeProvider>
  </AuthProvider>
);
