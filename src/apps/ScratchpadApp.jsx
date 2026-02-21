import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Plus, Trash2, Save, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ScratchpadApp = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState(() => {
    const storedNotes = JSON.parse(localStorage.getItem('scratchpad-notes')) || [];
    return storedNotes;
  });
  const [activeNoteId, setActiveNoteId] = useState(() => {
      const storedNotes = JSON.parse(localStorage.getItem('scratchpad-notes')) || [];
      return storedNotes.length > 0 ? storedNotes[0].id : null;
  });
  const [noteTitle, setNoteTitle] = useState(() => {
      const storedNotes = JSON.parse(localStorage.getItem('scratchpad-notes')) || [];
      return storedNotes.length > 0 ? storedNotes[0].title : '';
  });
  const [noteContent, setNoteContent] = useState(() => {
      const storedNotes = JSON.parse(localStorage.getItem('scratchpad-notes')) || [];
      return storedNotes.length > 0 ? storedNotes[0].content : '';
  });
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('scratchpad-notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    if (savedMessage) {
      const timer = setTimeout(() => setSavedMessage(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [savedMessage]);

  const handleSave = useCallback(() => {
    if (!noteTitle.trim()) {
      alert('Note title cannot be empty.');
      return;
    }

    const now = new Date().toISOString();
    if (activeNoteId) {
      setNotes(prevNotes =>
        prevNotes.map(note =>
          note.id === activeNoteId
            ? { ...note, title: noteTitle, content: noteContent, lastModified: now }
            : note
        )
      );
    } else {
      const newNote = {
        id: Date.now(),
        title: noteTitle,
        content: noteContent,
        createdAt: now,
        lastModified: now,
      };
      setNotes(prevNotes => [...prevNotes, newNote]);
      setActiveNoteId(newNote.id);
    }
    setSavedMessage('Note saved!');
  }, [activeNoteId, noteTitle, noteContent]);

  const handleNewNote = () => {
    setActiveNoteId(null);
    setNoteTitle('');
    setNoteContent('');
  };

  const handleDeleteNote = useCallback((id) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    if (activeNoteId === id) {
      handleNewNote();
    }
  }, [activeNoteId]);

  const handleSelectNote = useCallback((id) => {
    const note = notes.find(n => n.id === id);
    if (note) {
      setActiveNoteId(note.id);
      setNoteTitle(note.title);
      setNoteContent(note.content);
    }
  }, [notes]);

  return (
    <div className="flex h-full bg-gray-800 text-gray-200 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-gray-700 flex flex-col shrink-0">
        <div className="flex items-center justify-between p-3 border-b border-gray-700">
          <button onClick={() => navigate('/')} className="p-1 hover:bg-gray-700 rounded text-blue-400">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-sm font-bold">Scratchpad</h2>
          <button onClick={handleNewNote} className="p-1 hover:bg-gray-700 rounded text-green-400">
            <Plus size={20} />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto">
          {notes.length === 0 && <p className="text-gray-500 text-xs p-3">No notes yet. Click &apos;+&apos; to create one.</p>}
          {notes.map(note => (
            <div
              key={note.id}
              onClick={() => handleSelectNote(note.id)}
              className={`flex items-center justify-between p-3 hover:bg-gray-800 cursor-pointer ${
                note.id === activeNoteId ? 'bg-gray-700' : ''
              }`}
            >
              <FileText size={16} className="text-gray-500" />
              <span className="flex-grow ml-2 text-sm truncate">{note.title}</span>
              <button
                onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }}
                className="p-1 hover:bg-red-700 rounded text-red-400 opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex flex-col flex-grow">
        {activeNoteId || notes.length === 0 ? (
          <>
            <div className="flex items-center justify-between p-3 bg-gray-900 border-b border-gray-700 shrink-0">
              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Note Title"
                className="bg-transparent border-none focus:outline-none text-sm text-white flex-grow"
              />
              <div className="flex items-center gap-3">
                {savedMessage && <span className="text-green-400 text-xs animate-in fade-in">{savedMessage}</span>}
                <button onClick={handleSave} className="p-1 hover:bg-gray-700 rounded text-green-400 flex items-center gap-1 text-sm">
                  <Save size={16} /> Save
                </button>
              </div>
            </div>
            <textarea
              className="flex-grow p-4 text-sm bg-gray-800 focus:outline-none resize-none"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Start writing your note here..."
            />
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center text-gray-500 text-lg">
            Select a note or create a new one.
          </div>
        )}
      </div>
    </div>
  );
};

export default ScratchpadApp;
