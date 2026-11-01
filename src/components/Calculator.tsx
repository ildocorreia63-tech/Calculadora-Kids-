import React, { useState, useEffect, useCallback, useRef } from 'react';
import { playBeep } from '../utils/sound';

interface CalculatorProps {
  soundEnabled: boolean;
  onSetBackground: (dataUrl: string) => void;
  onResetBackground: () => void;
}

type Operator = '+' | '−' | '×' | '÷' | '%' | null;

export const Calculator: React.FC<CalculatorProps> = ({
  soundEnabled,
  onSetBackground,
  onResetBackground,
}) => {
  const [cur, setCur] = useState<string>('0');
  const [saved, setSaved] = useState<number | null>(null);
  const [op, setOp] = useState<Operator>(null);
  const [fresh, setFresh] = useState<boolean>(false);
  const [expr, setExpr] = useState<string>('');
  const [bgError, setBgError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDigit = useCallback(
    (v: string) => {
      setCur((prevCur) => {
        let current = fresh ? '0' : prevCur;
        if (v === '.' && current.includes('.')) return prevCur;
        if (current.length > 13) return prevCur;
        current = current === '0' && v !== '.' ? v : current + v;
        return current;
      });
      setFresh(false);
      playBeep(430, soundEnabled);
    },
    [fresh, soundEnabled]
  );

  const handleClear = useCallback(() => {
    setCur('0');
    setSaved(null);
    setOp(null);
    setFresh(false);
    setExpr('');
    playBeep(250, soundEnabled);
  }, [soundEnabled]);

  const handleDelete = useCallback(() => {
    setCur((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
    playBeep(350, soundEnabled);
  }, [soundEnabled]);

  const handleSign = useCallback(() => {
    setCur((prev) => {
      const num = Number(prev);
      if (isNaN(num)) return '0';
      return String(-num);
    });
    playBeep(450, soundEnabled);
  }, [soundEnabled]);

  const handleCalculate = useCallback(() => {
    if (op === null || saved === null) return;
    const a = saved;
    const b = Number(cur);
    let r: number;

    switch (op) {
      case '+':
        r = a + b;
        break;
      case '−':
        r = a - b;
        break;
      case '×':
        r = a * b;
        break;
      case '÷':
        r = b === 0 ? NaN : a / b;
        break;
      case '%':
        r = (a * b) / 100;
        break;
      default:
        r = b;
    }

    setExpr(`${a} ${op} ${b} =`);
    const isFiniteNum = Number.isFinite(r);
    const resultStr = isFiniteNum ? String(Number(r.toPrecision(10))) : 'Erro';
    setCur(resultStr);
    setSaved(null);
    setOp(null);
    setFresh(true);
    playBeep(isFiniteNum ? 850 : 160, soundEnabled);
  }, [op, saved, cur, soundEnabled]);

  const handleChooseOp = useCallback(
    (v: '+' | '−' | '×' | '÷' | '%') => {
      let currentA = Number(cur);

      if (op && !fresh && saved !== null) {
        // Chained calculation
        const b = currentA;
        let r: number;
        switch (op) {
          case '+':
            r = saved + b;
            break;
          case '−':
            r = saved - b;
            break;
          case '×':
            r = saved * b;
            break;
          case '÷':
            r = b === 0 ? NaN : saved / b;
            break;
          case '%':
            r = (saved * b) / 100;
            break;
          default:
            r = b;
        }
        currentA = Number.isFinite(r) ? Number(r.toPrecision(10)) : 0;
        setCur(String(currentA));
      }

      setSaved(currentA);
      setOp(v);
      setExpr(`${currentA} ${v}`);
      setFresh(true);
      playBeep(650, soundEnabled);
    },
    [cur, op, fresh, saved, soundEnabled]
  );

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input or select
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) {
        return;
      }

      if (/^[0-9.]$/.test(e.key)) {
        handleDigit(e.key);
      } else if (e.key === '+') {
        handleChooseOp('+');
      } else if (e.key === '-') {
        handleChooseOp('−');
      } else if (e.key === '*') {
        handleChooseOp('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleChooseOp('÷');
      } else if (e.key === '%') {
        handleChooseOp('%');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleCalculate();
      } else if (e.key === 'Escape') {
        handleClear();
      } else if (e.key === 'Backspace') {
        handleDelete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit, handleChooseOp, handleCalculate, handleClear, handleDelete]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setBgError(null);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        try {
          onSetBackground(reader.result);
        } catch {
          setBgError('Imagem muito grande. Tente outra com tamanho menor.');
        }
      }
    };
    reader.readAsDataURL(file);
    // Reset file input so same file can be selected again
    e.target.value = '';
  };

  return (
    <section id="calc" className="page active" aria-label="Calculadora">
      <h2>Faça suas contas</h2>
      <div className="calculator">
        <div className="screen" aria-live="polite">
          <small id="expression">{expr || 'Pronto para calcular'}</small>
          <output id="display">{cur}</output>
        </div>
        <div className="keys">
          <button type="button" className="util" onClick={handleClear} aria-label="Limpar">
            AC
          </button>
          <button type="button" className="util" onClick={handleDelete} aria-label="Apagar dígito">
            ⌫
          </button>
          <button
            type="button"
            className="op"
            onClick={() => handleChooseOp('%')}
            aria-label="Porcentagem"
          >
            %
          </button>
          <button
            type="button"
            className="op"
            onClick={() => handleChooseOp('÷')}
            aria-label="Dividir"
          >
            ÷
          </button>

          <button type="button" onClick={() => handleDigit('7')}>
            7
          </button>
          <button type="button" onClick={() => handleDigit('8')}>
            8
          </button>
          <button type="button" onClick={() => handleDigit('9')}>
            9
          </button>
          <button
            type="button"
            className="op"
            onClick={() => handleChooseOp('×')}
            aria-label="Multiplicar"
          >
            ×
          </button>

          <button type="button" onClick={() => handleDigit('4')}>
            4
          </button>
          <button type="button" onClick={() => handleDigit('5')}>
            5
          </button>
          <button type="button" onClick={() => handleDigit('6')}>
            6
          </button>
          <button
            type="button"
            className="op"
            onClick={() => handleChooseOp('−')}
            aria-label="Subtrair"
          >
            −
          </button>

          <button type="button" onClick={() => handleDigit('1')}>
            1
          </button>
          <button type="button" onClick={() => handleDigit('2')}>
            2
          </button>
          <button type="button" onClick={() => handleDigit('3')}>
            3
          </button>
          <button
            type="button"
            className="op"
            onClick={() => handleChooseOp('+')}
            aria-label="Somar"
          >
            +
          </button>

          <button
            type="button"
            className="util"
            onClick={handleSign}
            aria-label="Inverter sinal"
          >
            ±
          </button>
          <button type="button" onClick={() => handleDigit('0')}>
            0
          </button>
          <button type="button" onClick={() => handleDigit('.')}>
            .
          </button>
          <button
            type="button"
            className="equal"
            onClick={handleCalculate}
            aria-label="Calcular resultado"
          >
            =
          </button>
        </div>
      </div>

      <div className="tools">
        <label>
          🖼️ Escolher fundo
          <input
            ref={fileInputRef}
            id="bg"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
        <button
          id="reset"
          type="button"
          onClick={() => {
            onResetBackground();
            playBeep(300, soundEnabled);
          }}
        >
          Restaurar fundo
        </button>
      </div>
      {bgError && (
        <p style={{ textAlign: 'center', color: '#941b27', fontWeight: 800, fontSize: '13px' }}>
          {bgError}
        </p>
      )}
    </section>
  );
};
