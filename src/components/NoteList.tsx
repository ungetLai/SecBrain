import { useEffect, useState } from 'react';

type Note = {
    id: string;
    createdAt: string;
    content: string;
    status: string;
};

interface NoteListProps {
    refreshTrigger: number;
}

export default function NoteList({ refreshTrigger }: NoteListProps) {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchNotes = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/notes/backlog');
            if (res.ok) {
                const data = await res.json();
                setNotes(data);
            }
        } catch (error) {
            console.error('Failed to fetch backlog notes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, [refreshTrigger]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this note?')) return;

        setDeletingId(id);
        try {
            const res = await fetch(`/api/notes/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setNotes((prev) => prev.filter((note) => note.id !== id));
            } else {
                alert('Failed to delete note.');
            }
        } catch (error) {
            console.error('Error deleting note:', error);
            alert('Error deleting note.');
        } finally {
            setDeletingId(null);
        }
    };

    if (isLoading && notes.length === 0) {
        return (
            <div className="w-full max-w-2xl mx-auto mt-8 flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    if (notes.length === 0) {
        return (
            <div className="w-full max-w-2xl mx-auto mt-8 p-8 text-center bg-white/5 backdrop-blur-lg rounded-2xl border border-white/5 shadow-inner">
                <p className="text-gray-400 font-light">Your backlog is clean. Drop some thoughts above!</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto mt-8 space-y-4">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-medium text-gray-200">Current Backlog</h3>
                <span className="bg-cyan-500/20 text-cyan-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-cyan-500/20">
                    {notes.length} Notes
                </span>
            </div>

            <div className="flex flex-col gap-3">
                {notes.map((note) => (
                    <div
                        key={note.id}
                        className="group relative flex flex-col gap-2 p-4 bg-zinc-900/60 backdrop-blur-md rounded-xl border border-white/5 shadow-xl transition-all duration-300 hover:border-cyan-500/30 hover:shadow-cyan-500/5"
                    >
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap break-words pr-8">
                            {note.content}
                        </p>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                            <span className="text-xs text-gray-500 font-medium">
                                {new Date(note.createdAt).toLocaleString(undefined, {
                                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                            </span>
                            <button
                                onClick={() => handleDelete(note.id)}
                                disabled={deletingId === note.id}
                                className="opacity-0 group-hover:opacity-100 absolute top-3 right-3 p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all focus:opacity-100 disabled:opacity-50"
                                title="Delete note"
                            >
                                {deletingId === note.id ? (
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
