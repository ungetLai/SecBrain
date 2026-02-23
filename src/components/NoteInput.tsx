'use client';

import { useState } from 'react';

export default function NoteInput() {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsSubmitting(true);
        setStatusMessage(null);

        try {
            const res = await fetch('/api/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            });

            if (!res.ok) throw new Error('Failed to submit note');

            setContent('');
            setStatusMessage({ type: 'success', text: 'Note successfully added to Backlog!' });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setStatusMessage({ type: 'error', text: 'An error occurred while adding the note.' });
        } finally {
            setIsSubmitting(false);
            // Auto-hide success message after 3 seconds
            setTimeout(() => setStatusMessage(null), 3000);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl transition-all duration-300 hover:shadow-cyan-500/10 hover:border-white/20">
            <h2 className="text-2xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight">
                Drop a thought or link
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind? Paste a URL or jot down a quick note..."
                    className="w-full min-h-[120px] p-4 bg-zinc-900/50 text-gray-100 rounded-xl border border-zinc-700/50 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all outline-none resize-y placeholder:text-zinc-500"
                    disabled={isSubmitting}
                />

                <div className="flex items-center justify-between">
                    <div className="text-sm font-medium h-6 flex items-center">
                        {statusMessage && (
                            <span className={`animate-fade-in ${statusMessage.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                                {statusMessage.text}
                            </span>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || !content.trim()}
                        className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-xl hover:from-cyan-400 hover:to-blue-500 focus:ring-2 focus:ring-cyan-500/40 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center min-w-[120px]"
                    >
                        {isSubmitting ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            'Save to Brain'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
