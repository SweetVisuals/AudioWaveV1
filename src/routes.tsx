import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Upload } from './pages/Upload';
import { Dashboard } from './pages/Dashboard';
import { Library } from './pages/Library';
import { Settings } from './pages/Settings';
import { Track } from './pages/Track';
import { Signup } from './pages/Signup';

interface AppRoutesProps {
  onTrackPlay: (track: {
    id: number;
    title: string;
    artist?: string;
    url: string;
  }) => void;
}

export function AppRoutes({ onTrackPlay }: AppRoutesProps) {
  return (
    <Routes>
      <Route path="/" element={<Home onTrackPlay={onTrackPlay} />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/dashboard/:id?" element={<Dashboard />} />
      <Route path="/library" element={<Library />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/track/:id" element={<Track />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}