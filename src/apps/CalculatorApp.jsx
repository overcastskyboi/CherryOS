import React, { useState } from 'react';
import { ArrowLeft, Divide, X, Minus, Plus, Equal, Music } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CalculatorApp = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('standard'); // 'standard' or 'music'
  const [input, setInput] = useState('0');
  const [operator, setOperator] = useState(null);
  const [previousInput, setPreviousInput] = useState(null);
  const [history, setHistory] = useState('');
  const [bpm, setBpm] = useState(120);

  const handleDigit = (digit) => {
    if (input === '0' && digit !== '.') {
      setInput(digit);
    } else {
      setInput(prev => prev + digit);
    }
  };

  const handleOperator = (nextOperator) => {
    if (operator && previousInput !== null) {
      handleCalculate();
      setPreviousInput(parseFloat(input));
      setOperator(nextOperator);
      setInput('0');
      setHistory(`${history} ${input} ${nextOperator} `);
    } else {
      setPreviousInput(parseFloat(input));
      setOperator(nextOperator);
      setInput('0');
      setHistory(`${input} ${nextOperator} `);
    }
  };

  const handleCalculate = () => {
    if (operator === null || previousInput === null) return;

    let result;
    const current = parseFloat(input);
    const prev = previousInput;

    switch (operator) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '*':
        result = prev * current;
        break;
      case '/':
        result = prev / current;
        break;
      default:
        return;
    }
    setInput(result.toString());
    setPreviousInput(null);
    setOperator(null);
    setHistory(`${history} ${current} = ${result}`);
  };

  const handleClear = () => {
    setInput('0');
    setOperator(null);
    setPreviousInput(null);
    setHistory('');
  };

  const handleToggleSign = () => {
    setInput(prev => (parseFloat(prev) * -1).toString());
  };

  const calculateMusicTime = (bpm) => {
    if (bpm <= 0) return {};
    const quarterNote = 60000 / bpm;
    return {
      '1/1': quarterNote * 4,
      '1/2': quarterNote * 2,
      '1/4': quarterNote,
      '1/8': quarterNote / 2,
      '1/16': quarterNote / 4,
      '1/32': quarterNote / 8,
    };
  };

  const musicTimes = calculateMusicTime(bpm);

  const standardButtons = [
    { label: 'C', className: 'bg-gray-700', onClick: handleClear },
    { label: '+/-', className: 'bg-gray-700', onClick: handleToggleSign },
    { label: '/', className: 'bg-orange-500', icon: <Divide size={24} />, onClick: () => handleOperator('/') },
    { label: '*', className: 'bg-orange-500', icon: <X size={24} />, onClick: () => handleOperator('*') },
    { label: '7', onClick: () => handleDigit('7') },
    { label: '8', onClick: () => handleDigit('8') },
    { label: '9', onClick: () => handleDigit('9') },
    { label: '-', className: 'bg-orange-500', icon: <Minus size={24} />, onClick: () => handleOperator('-') },
    { label: '4', onClick: () => handleDigit('4') },
    { label: '5', onClick: () => handleDigit('5') },
    { label: '6', onClick: () => handleDigit('6') },
    { label: '+', className: 'bg-orange-500', icon: <Plus size={24} />, onClick: () => handleOperator('+') },
    { label: '1', onClick: () => handleDigit('1') },
    { label: '2', onClick: () => handleDigit('2') },
    { label: '3', onClick: () => handleDigit('3') },
    { label: '=', className: 'bg-green-500 row-span-2', icon: <Equal size={24} />, onClick: handleCalculate },
    { label: '0', className: 'col-span-2', onClick: () => handleDigit('0') },
    { label: '.', onClick: () => handleDigit('.') },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700 shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/')} className="p-1 hover:bg-gray-700 rounded text-blue-400">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-sm font-bold">Calculator</h2>
        </div>
        <button onClick={() => setMode(mode === 'standard' ? 'music' : 'standard')} className="p-1 hover:bg-gray-700 rounded text-rose-400">
          <Music size={20} />
        </button>
      </div>

      {mode === 'standard' && (
        <>
          {/* Display */}
          <div className="flex flex-col items-end justify-around bg-gray-800 p-4 text-right overflow-hidden border-b border-gray-700">
            <div className="text-gray-400 text-xs truncate">{history}</div>
            <div className="text-4xl font-bold truncate">{input}</div>
          </div>
          {/* Buttons */}
          <div className="grid grid-cols-4 gap-2 p-4 flex-grow">
            {standardButtons.map((btn, index) => (
              <button
                key={index}
                onClick={btn.onClick}
                className={`flex items-center justify-center p-4 text-2xl font-bold rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors ${btn.className || ''}`}
              >
                {btn.icon || btn.label}
              </button>
            ))}
          </div>
        </>
      )}

      {mode === 'music' && (
        <div className="p-4 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold">BPM:</span>
            <input
              type="number"
              value={bpm}
              onChange={(e) => setBpm(parseInt(e.target.value) || 0)}
              className="bg-gray-700 text-white p-2 rounded w-24"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(musicTimes).map(([note, time]) => (
              <div key={note} className="bg-gray-800 p-4 rounded-lg text-center">
                <div className="text-lg font-bold">{note}</div>
                <div className="text-sm text-rose-400">{time.toFixed(2)} ms</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalculatorApp;
