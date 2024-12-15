import React from 'react';
import { Music } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <Music className="h-16 w-16 text-primary animate-bounce" />
        <div className="mt-8 w-48 h-2 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-loading-bar" />
        </div>
      </div>
    </div>
  );
}