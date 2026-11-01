import React, { useState } from 'react';
import { playBeep } from '../utils/sound';

interface TabuadaProps {
  soundEnabled: boolean;
}

export const Tabuada: React.FC<TabuadaProps> = ({ soundEnabled }) => {
  const [selectedNum, setSelectedNum] = useState<number>(1);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = Number(e.target.value);
    setSelectedNum(val);
    playBeep(520, soundEnabled);
  };

  const rows = Array.from({ length: 10 }, (_, i) => {
    const multiplier = i + 1;
    return {
      multiplier,
      result: selectedNum * multiplier,
    };
  });

  return (
    <section id="tabuada" className="page active" aria-label="Tabuada interativa">
      <h2>Tabuada interativa</h2>
      <label className="choose">
        Escolha:
        <select
          id="table"
          value={selectedNum}
          onChange={handleSelectChange}
          aria-label="Escolha a tabuada de 1 a 20"
        >
          {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              Tabuada do {n}
            </option>
          ))}
        </select>
      </label>

      <div id="tableGrid" className="table-grid">
        {rows.map(({ multiplier, result }) => (
          <div key={multiplier}>
            {selectedNum} × {multiplier} = <strong>{result}</strong>
          </div>
        ))}
      </div>
    </section>
  );
};
