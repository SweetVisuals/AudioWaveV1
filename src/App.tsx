import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { PlayBar } from './components/PlayBar';
import { AppRoutes } from './routes';
import { Toaster } from 'react-hot-toast';
import { ParticleProvider } from './providers/ParticleProvider';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [currentTrack, setCurrentTrack] = React.useState<{
    id: number;
    title: string;
    artist?: string;
    url: string;
  } | null>(null);

  const handleTrackPlay = (track: {
    id: number;
    title: string;
    artist?: string;
    url: string;
  }) => {
    setCurrentTrack(track);
  };

  return (
    <BrowserRouter>
      <ParticleProvider>
        <div className="min-h-screen bg-black">
          <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
          />
          <main className="pt-16">
            <AppRoutes onTrackPlay={handleTrackPlay} />
          </main>
          <PlayBar currentTrack={currentTrack} isExpanded={!!currentTrack} />
          <Toaster 
            position="bottom-center"
            toastOptions={{
              className: 'bg-white/10 backdrop-blur-lg text-white border border-white/20',
              duration: 3000,
              style: {
                background: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                backdropFilter: 'blur(8px)',
              },
            }}
          />
        </div>
      </ParticleProvider>
    </BrowserRouter>
  );
}