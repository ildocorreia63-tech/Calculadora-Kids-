# Calculadora do Heitor 🧮

Aplicativo educativo interativo desenvolvido em React 19, TypeScript e Vite. Criado para aprender matemática brincando com calculadora, tabuadas completas de 1 a 20, desafios dinâmicos com pontuação e níveis, efeitos sonoros sintetizados via Web Audio API, personalização de papel de parede e suporte a Progressive Web App (PWA).

## Recursos

- **🧮 Calculadora**: Suporte a operações aritméticas (`+`, `−`, `×`, `÷`, `%`), inversão de sinal (`±`), display digital estilo retrô, suporte a teclado numérico e atalhos.
- **✖️ Tabuada**: Seletor intuitivo para tabuadas do 1 ao 20 com apresentação em grade de fácil leitura.
- **⭐ Desafios**: Jogo de perguntas e respostas com cálculo dinâmico de pontuação, taxa de acertos e progressão de nível (1 a 5) com feedback visual e sonoro imediato.
- **🔊 Síntese Sonora**: Efeitos de áudio com oscilador Web Audio API com frequências personalizadas para cada interação e botão de ligar/desligar som.
- **🖼️ Papel de Parede Personalizado**: Permite ao usuário carregar uma imagem personalizada de fundo persistida via `localStorage` ou restaurar para o visual padrão.
- **📱 PWA & Responsividade**: Suporte offline com service worker, ícone adaptativo e layout otimizado para celulares, tablets e desktops.

## Tecnologias

- **React 19**
- **TypeScript**
- **Vite**
- **Web Audio API**
- **PWA Service Worker**

## Desenvolvimento

```bash
npm install
npm run dev
```

Dev server roda na porta 3000 em `http://0.0.0.0:3000`.

## Build de Produção

```bash
npm run build
```
