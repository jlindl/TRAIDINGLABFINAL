export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#050505] p-6 selection:bg-neon/30">
      {/* Background grid */}
      <div className="bg-grid pointer-events-none fixed inset-0 z-0 opacity-20" />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-2">
          <a href="/" className="relative flex items-center justify-center h-12 w-full">
            <img 
              src="/Logo.png" 
              alt="TraidingLab Logo" 
              className="h-16 w-auto object-contain transition-transform duration-300 hover:scale-110" 
              style={{ minWidth: '200px' }}
            />
          </a>
        </div>
        {children}
      </div>
    </div>
  );
}
