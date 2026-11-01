import React from 'react';

export type PageTab = 'calc' | 'tabuada' | 'jogo';

interface NavTabsProps {
  activeTab: PageTab;
  onSelectTab: (tab: PageTab) => void;
}

export const NavTabs: React.FC<NavTabsProps> = ({ activeTab, onSelectTab }) => {
  return (
    <nav aria-label="Navegação de abas">
      <button
        type="button"
        className={`tab ${activeTab === 'calc' ? 'active' : ''}`}
        onClick={() => onSelectTab('calc')}
        aria-selected={activeTab === 'calc'}
      >
        🧮 Calculadora
      </button>
      <button
        type="button"
        className={`tab ${activeTab === 'tabuada' ? 'active' : ''}`}
        onClick={() => onSelectTab('tabuada')}
        aria-selected={activeTab === 'tabuada'}
      >
        ✖️ Tabuada
      </button>
      <button
        type="button"
        className={`tab ${activeTab === 'jogo' ? 'active' : ''}`}
        onClick={() => onSelectTab('jogo')}
        aria-selected={activeTab === 'jogo'}
      >
        ⭐ Desafios
      </button>
    </nav>
  );
};
