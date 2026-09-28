import { AuthProvider, useAuth } from './auth/AuthContext.jsx';
import { AuthSplash, Login } from './auth/Login.jsx';
import { EntrenoProvider } from './domains/entreno/context/EntrenoContext.jsx';
import { EntrenoApp } from './domains/entreno/components/EntrenoApp.jsx';

function Gate() {
  const { currentUser, authLoading } = useAuth();
  if (authLoading) return <AuthSplash />;
  if (!currentUser) return <Login />;
  return (
    <EntrenoProvider key={currentUser.uid}>
      <EntrenoApp />
    </EntrenoProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}
