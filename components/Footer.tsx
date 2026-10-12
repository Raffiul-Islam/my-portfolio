export default function Footer() {
  return (
    <footer className="site-footer relative mt-20 py-12 footer-dark footer-gradient">
      <div className="flex w-full flex-col sm:flex-row items-center justify-between gap-8 px-6 sm:px-12 lg:px-20">
        <div className="text-center sm:text-left">
          <p className="text-lg font-black uppercase tracking-[0.4em] italic">Md Raffiul Islam</p>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-widest opacity-60">&copy; {new Date().getFullYear()} All rights reserved</p>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
          {[
            { 
              label: "GitHub",
              href: "https://github.com/Raffiul-Islam",
              icon: (
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              )
            },
            { 
              label: "LinkedIn",
              href: "https://www.linkedin.com/in/rafiul-islam-828b29322/",
              icon: (
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              )
            },
            { 
              label: "Facebook",
              href: "https://www.facebook.com/profile.php?id=61577964661660",
              icon: (
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              )
            }
          ].map((link) => (
            <a 
              key={link.label} 
              href={link.href} 
              target="_blank" 
              rel="noreferrer" 
              aria-label={`${link.label} (opens in a new tab)`}
              className="group flex flex-col items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-cyan-300 hover:-translate-y-1"
            >
              <div className="p-2 rounded-lg bg-white/5 group-hover:bg-cyan-500/10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-cyan-500/20">
                {link.icon}
              </div>
              <span className="hidden sm:block">{link.label}</span>
              <span className="h-1 w-1 rounded-full bg-white/10 group-hover:bg-cyan-300 transition-colors" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
