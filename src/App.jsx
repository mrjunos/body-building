import { EntrenoProvider } from './domains/entreno/context/EntrenoContext.jsx';
import { EntrenoApp } from './domains/entreno/components/EntrenoApp.jsx';

export default function App() {
  return (
    <EntrenoProvider>
      <EntrenoApp />
    </EntrenoProvider>
  );
}
