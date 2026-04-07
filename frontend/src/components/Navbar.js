import React from 'react';

export default function Navbar({ isAdmin, userEmail, onLogout, onToggleAdmin, showAdminPanel }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-b border-spidey-red/30" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🕷️</span>
          <span className="text-xl font-bold text-spidey-red">SAMAY'S PORTFOLIO</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-400" data-testid="user-email">{userEmail}</span>
          
          {isAdmin && (
            <button
              onClick={onToggleAdmin}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                showAdminPanel 
                  ? 'bg-spidey-red text-white' 
                  : 'bg-spidey-blue/20 text-spidey-blue border border-spidey-blue'
              }`}
              data-testid="admin-panel-toggle"
            >
              {showAdminPanel ? '📋 View Portfolio' : '⚙️ Admin Panel'}
            </button>
          )}
          
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-600 rounded-lg hover:bg-red-600/30 transition-all text-sm font-semibold"
            data-testid="logout-button"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
