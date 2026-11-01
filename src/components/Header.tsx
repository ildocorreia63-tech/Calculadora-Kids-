import React from 'react';

interface HeaderProps {
  sound: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({ sound, onToggleSound }) => {
  return (
    <header>
      <div className="logo" aria-label="Logo Heitor">H</div>
      <div>
        <small>APRENDER BRINCANDO</small>
        <h1>
          Calculadora <span>do Heitor</span>
        </h1>
      </div>
      <button
        id="sound"
        type="button"
        onClick={onToggleSound}
        aria-label={sound ? 'Desativar som' : 'Ativar som'}
      >
        {sound ? '🔊 Som' : '🔇 Sem som'}
      </button>
    </header>
  );
};
