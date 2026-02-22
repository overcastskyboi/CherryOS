import { useState } from 'react';

const CalculatorApp = () => {
  const [display, setDisplay] = useState('0');
  const [operator, setOperator] = useState(null);
  const [previousValue, setPreviousValue] = useState(null);

  const clear = () => {
    setDisplay('0');
    setOperator(null);
    setPreviousValue(null);
  };

  const handleNumber = (num) => {
    if (display === '0') {
      setDisplay(num.toString());
    } else {
      setDisplay(display + num.toString());
    }
  };

  const handleOperator = (op) => {
    if (operator !== null) {
      calculate();
    }
    setOperator(op);
    setPreviousValue(parseFloat(display));
    setDisplay('0');
  };

  const calculate = () => {
    if (operator === null || previousValue === null) return;
    
    const currentValue = parseFloat(display);
    let result;
    
    switch (operator) {
      case '+':
        result = previousValue + currentValue;
        break;
      case '-':
        result = previousValue - currentValue;
        break;
      case '*':
        result = previousValue * currentValue;
        break;
      case '/':
        result = previousValue / currentValue;
        break;
      default:
        return;
    }
    
    setDisplay(result.toString());
    setOperator(null);
    setPreviousValue(null);
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  return (
    <div className="calculator">
      <div className="display">{display}</div>
      <div className="buttons">
        <button onClick={clear}>C</button>
        <button onClick={() => handleOperator('/')}>/</button>
        <button onClick={() => handleOperator('*')}>*</button>
        <button onClick={() => handleOperator('-')}>-</button>
        <button onClick={() => handleNumber(7)}>7</button>
        <button onClick={() => handleNumber(8)}>8</button>
        <button onClick={() => handleNumber(9)}>9</button>
        <button onClick={() => handleOperator('+')}>+</button>
        <button onClick={() => handleNumber(4)}>4</button>
        <button onClick={() => handleNumber(5)}>5</button>
        <button onClick={() => handleNumber(6)}>6</button>
        <button onClick={calculate}>=</button>
        <button onClick={() => handleNumber(1)}>1</button>
        <button onClick={() => handleNumber(2)}>2</button>
        <button onClick={() => handleNumber(3)}>3</button>
        <button onClick={handleDecimal}>.</button>
        <button onClick={() => handleNumber(0)}>0</button>
      </div>
      <style jsx>{`
        .calculator {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          padding: 20px;
          max-width: 300px;
          margin: 0 auto;
        }
        .display {
          background: #2d3748;
          color: #fff;
          font-size: 2rem;
          padding: 20px;
          text-align: right;
          border-radius: 10px;
          margin-bottom: 20px;
          min-height: 60px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
        .buttons {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }
        button {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          border: none;
          border-radius: 10px;
          padding: 20px;
          font-size: 1.2rem;
          color: white;
          cursor: pointer;
          transition: transform 0.2s;
        }
        button:hover {
          transform: scale(1.05);
        }
        button:active {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
};

export default CalculatorApp;