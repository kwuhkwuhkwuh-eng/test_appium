interface SidebarProps {
  sections: { id: string; title: string; icon: string }[];
  activeSection: string;
  onSectionChange: (id: string) => void;
}

export default function Sidebar({ sections, activeSection, onSectionChange }: SidebarProps) {
  return (
    <aside className="w-72 bg-gray-950 border-r border-gray-800 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-lg">
            🤖
          </div>
          <div>
            <h2 className="font-bold text-white text-lg">Appium</h2>
            <p className="text-xs text-gray-500">Testing Guide</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => onSectionChange(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                  activeSection === section.id
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-600/30'
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 border border-transparent'
                }`}
              >
                <span className="text-lg">{section.icon}</span>
                <span className="text-sm font-medium">{section.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="bg-gray-800/50 rounded-lg p-3">
          <p className="text-xs text-gray-500 text-center">
            Appium v2.x • 2024
          </p>
        </div>
      </div>
    </aside>
  );
}