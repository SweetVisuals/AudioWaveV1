import React, { useState } from 'react';
import { Edit2, Check, X } from 'lucide-react';
import { useDashboardStore } from '../store/useDashboardStore';
import clsx from 'clsx';

interface DashboardSectionProps {
  section: {
    id: string;
    title: string;
    type: string;
    order: number;
    visible: boolean;
  };
  children: React.ReactNode;
}

export function DashboardSection({ section, children }: DashboardSectionProps) {
  const { isEditMode, updateSection } = useDashboardStore();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(section.title);

  const handleTitleSave = () => {
    if (title.trim()) {
      updateSection(section.id, { title: title.trim() });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setTitle(section.title);
      setIsEditing(false);
    }
  };

  return (
    <div className={clsx(
      'bg-white/5 backdrop-blur-lg rounded-lg p-6 transition-all duration-200',
      isEditMode && 'border-2 border-dashed border-white/10 hover:border-primary/50'
    )}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {isEditMode && isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-white/10 px-2 py-1 rounded text-white"
                autoFocus
              />
              <button
                onClick={handleTitleSave}
                className="text-primary hover:text-primary-dark"
              >
                <Check size={18} />
              </button>
              <button
                onClick={() => {
                  setTitle(section.title);
                  setIsEditing(false);
                }}
                className="text-white/60 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{section.title}</h2>
              {isEditMode && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-white/40 hover:text-white"
                >
                  <Edit2 size={16} />
                </button>
              )}
            </div>
          )}
        </div>

        {isEditMode && (
          <button
            onClick={() => updateSection(section.id, { visible: false })}
            className="text-white/40 hover:text-white"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {children}
    </div>
  );
}