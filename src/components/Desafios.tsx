import React, { useState, useEffect, useCallback } from 'react';
import { playBeep } from '../utils/sound';

interface DesafiosProps {
  soundEnabled: boolean;
}

interface QuizState {
  questionText: string;
  answer: number;
  options: number[];
}

export const Desafios: React.FC<DesafiosProps> = ({ soundEnabled }) => {
  const [points, setPoints] = useState<number>(0);
  const [hits, setHits] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [quiz, setQuiz] = useState<QuizState | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('Escolha uma resposta!');

  // Level: 1 to 5, increases every 5 rounds
  const level = Math.min(5, 1 + Math.floor((round - 1) / 5));

  const generateQuestion = useCallback((currentLevel: number) => {
    const signs = currentLevel === 1 ? ['+', '−'] : ['+', '−', '×'];
    const s = signs[Math.floor(Math.random() * signs.length)];
    let a = 1 + Math.floor(Math.random() * currentLevel * 5);
    let b = 1 + Math.floor(Math.random() * currentLevel * 4);

    if (s === '−' && b > a) {
      const temp = a;
      a = b;
      b = temp;
    }

    const answer = s === '+' ? a + b : s === '−' ? a - b : a * b;
    const questionText = `${a} ${s} ${b} = ?`;

    const optsSet = new Set<number>([answer]);
    while (optsSet.size < 4) {
      optsSet.add(Math.max(0, answer + Math.floor(Math.random() * 11) - 5));
    }
    const options = Array.from(optsSet).sort(() => Math.random() - 0.5);

    setQuiz({
      questionText,
      answer,
      options,
    });
    setSelectedOption(null);
    setIsAnswered(false);
    setFeedback('Escolha uma resposta!');
  }, []);

  // Initialize first question
  useEffect(() => {
    generateQuestion(level);
  }, [generateQuestion, level]);

  const handleSelectAnswer = (option: number) => {
    if (isAnswered || !quiz) return;

    setIsAnswered(true);
    setSelectedOption(option);

    if (option === quiz.answer) {
      setPoints((prev) => prev + 10);
      setHits((prev) => prev + 1);
      setFeedback('🎉 Muito bem! Acertou!');
      playBeep(900, soundEnabled);
    } else {
      setFeedback('Quase! A resposta certa está em verde. 💪');
      playBeep(170, soundEnabled);
    }
  };

  const handleNext = () => {
    setRound((prev) => prev + 1);
    playBeep(600, soundEnabled);
  };

  return (
    <section id="jogo" className="page active" aria-label="Desafios de matemática">
      <h2>Desafios de matemática</h2>

      <div className="scores">
        <div>
          PONTOS
          <strong id="score">{points}</strong>
        </div>
        <div>
          ACERTOS
          <strong id="hits">{hits}</strong>
        </div>
        <div>
          NÍVEL
          <strong id="level">{level}</strong>
        </div>
      </div>

      <div className="quiz">
        <small>RESOLVA A CONTA</small>
        <div id="question" className="question" aria-live="polite">
          {quiz?.questionText || '...'}
        </div>

        <div id="answers" className="answers">
          {quiz?.options.map((num, idx) => {
            let className = '';
            if (isAnswered) {
              if (num === quiz.answer) {
                className = 'correct';
              } else if (num === selectedOption) {
                className = 'wrong';
              }
            }

            return (
              <button
                key={`${idx}-${num}`}
                type="button"
                className={className}
                disabled={isAnswered}
                onClick={() => handleSelectAnswer(num)}
                aria-label={`Opção ${num}`}
              >
                {num}
              </button>
            );
          })}
        </div>

        <p id="feedback" aria-live="polite">{feedback}</p>

        <button
          id="next"
          type="button"
          disabled={!isAnswered}
          onClick={handleNext}
        >
          Próximo desafio →
        </button>
      </div>
    </section>
  );
};
