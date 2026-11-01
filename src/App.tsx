import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { NavTabs, PageTab } from './components/NavTabs';
import { Calculator } from './components/Calculator';
import { Tabuada } from './components/Tabuada';
import { Desafios } from './components/Desafios';
import { Footer } from './components/Footer';
import { playBeep } from './utils/sound';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PageTab>('calc');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Restore background on mount
  useEffect(() => {
    try {
      const bg = localStorage.getItem('heitor-bg');
      if (bg) {
        document.body.style.backgroundImage = `url("${bg}")`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundAttachment = 'fixed';
      }
    } catch {
      // LocalStorage access may fail in private mode
    }
  }, []);

  const handleToggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      if (next) {
        playBeep(500, true);
      }
      return next;
    });
  };

  const handleSelectTab = (tab: PageTab) => {
    setActiveTab(tab);
    playBeep(500, soundEnabled);
  };

  const handleSetBackground = (dataUrl: string) => {
    try {
      localStorage.setItem('heitor-bg', dataUrl);
    } catch (e) {
      throw e;
    }
    document.body.style.backgroundImage = `url("${dataUrl}")`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
  };

  const handleResetBackground = () => {
    try {
      localStorage.removeItem('heitor-bg');
    } catch {
      // ignore
    }
    document.body.style.backgroundImage = '';
  };

  return (
    <main className="app">
      <Header sound={soundEnabled} onToggleSound={handleToggleSound} />
      <NavTabs activeTab={activeTab} onSelectTab={handleSelectTab} />

      {activeTab === 'calc' && (
        <Calculator
          soundEnabled={soundEnabled}
          onSetBackground={handleSetBackground}
          onResetBackground={handleResetBackground}
        />
      )}

      {activeTab === 'tabuada' && <Tabuada soundEnabled={soundEnabled} />}

      {activeTab === 'jogo' && <Desafios soundEnabled={soundEnabled} />}

      <Footer />
    </main>
  );
};

export default App;
