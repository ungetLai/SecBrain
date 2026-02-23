import NoteInput from '@/components/NoteInput';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-200 font-sans selection:bg-cyan-500/30">
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen opacity-50 animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-600/10 blur-[150px] rounded-full mix-blend-screen opacity-50"></div>
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] p-8 pb-20 gap-16 sm:p-20">

        {/* Header Section */}
        <header className="flex flex-col items-center text-center max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-cyan-400 mb-2 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            Zeabur Powered
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500">
            Second Brain
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl font-light leading-relaxed">
            Your personal knowledge vault. Drop fleeting thoughts, URLs, or articles here,
            and let your AI Agent process them asynchronously into pristine markdown.
          </p>
        </header>

        {/* Input Interface */}
        <div className="w-full relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <NoteInput />
        </div>
      </main>
    </div>
  );
}
