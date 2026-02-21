import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CodeFlowApp = () => {
  const navigate = useNavigate();
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('untitled.txt');
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    if (savedMessage) {
      const timer = setTimeout(() => setSavedMessage(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [savedMessage]);

  const handleSave = () => {
    localStorage.setItem(`codeflow-${fileName}`, fileContent);
    setSavedMessage('File saved!');
  };

  const handleLoad = (e) => {
    const selectedFileName = e.target.value;
    if (selectedFileName) {
      setFileName(selectedFileName);
      setFileContent(localStorage.getItem(`codeflow-${selectedFileName}`) || '');
    }
  };

  const getSavedFiles = () => {
    const files = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('codeflow-')) {
        files.push(key.substring(9));
      }
    }
    return files;
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 text-gray-200 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gray-900 border-b border-gray-700 shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/')} className="p-1 hover:bg-gray-700 rounded text-blue-400">
            <ArrowLeft size={20} />
          </button>
          <FileText size={20} className="text-gray-400" />
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="bg-transparent border-none focus:outline-none text-sm text-white w-40"
          />
        </div>
        <div className="flex items-center gap-3">
          {savedMessage && <span className="text-green-400 text-xs animate-in fade-in">{savedMessage}</span>}
          <select onChange={handleLoad} value="" className="bg-gray-700 text-white text-xs p-1 rounded focus:outline-none">
            <option value="" disabled>Open...</option>
            {getSavedFiles().map(file => (
              <option key={file} value={file}>{file}</option>
            ))}
          </select>
          <button onClick={handleSave} className="p-1 hover:bg-gray-700 rounded text-green-400 flex items-center gap-1 text-sm">
            <Save size={16} />
            Save
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <textarea
        className="flex-grow p-4 text-sm bg-gray-800 focus:outline-none resize-none"
        value={fileContent}
        onChange={(e) => setFileContent(e.target.value)}
        spellCheck="false"
        autoCorrect="off"
        autoCapitalize="off"
      />
    </div>
  );
};

export default CodeFlowApp;
