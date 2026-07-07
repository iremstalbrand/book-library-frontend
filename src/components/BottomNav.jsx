import ThemeToggle from "./ThemeToggle";

function BottomNav({ activeView, onViewChange }) {
  const navItems = [
    {
      id: "library",
      label: "Library",
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      id: "add",
      label: "Add",
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      ),
    },
    {
      id: "profile",
      label: "Profile",
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
          <path d="M4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      ),
    },
  ];

  const mobileItemClass = (id) =>
    `flex flex-col items-center gap-0.5 px-5 py-2 transition-colors ${
      activeView === id
        ? "text-gold"
        : "text-muted hover:text-ink dark:hover:text-cream"
    }`;

  const desktopItemClass = (id) =>
    `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
      activeView === id
        ? "text-gold bg-gold/10"
        : "text-muted hover:text-ink dark:hover:text-cream hover:bg-muted/10"
    }`;

  return (
    <>
      {/* Mobile: fixed top-right toggle — bottom bar has no header row to hold it */}
      <div className="md:hidden fixed top-3 right-3 z-50">
        <ThemeToggle className="bg-surface dark:bg-dark-surface shadow-sm" />
      </div>

      {/* Mobile bottom bar — hidden at md+ */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-surface dark:bg-dark-surface border-t border-muted/10 transition-colors">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={mobileItemClass(item.id)}
              aria-label={item.label}
            >
              {item.icon}
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Desktop top header — shown at md+ */}
      <header className="hidden md:flex fixed top-0 inset-x-0 z-50 items-center justify-between px-6 h-14 bg-surface dark:bg-dark-surface border-b border-muted/10 transition-colors">
        <span className="font-bold tracking-tight text-ink dark:text-cream">
          My Library
        </span>
        <div className="flex items-center gap-3">
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={desktopItemClass(item.id)}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </header>
    </>
  );
}

export default BottomNav;
