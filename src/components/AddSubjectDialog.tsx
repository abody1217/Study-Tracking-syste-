import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';

interface AddSubjectDialogProps {
  onAddSubject: (name: string, color: string, allowedAbsenceHours: number) => void;
}

const COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e',
];

export function AddSubjectDialog({ onAddSubject }: AddSubjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [allowedAbsenceHours, setAllowedAbsenceHours] = useState('0');

  const handleSubmit = () => {
    if (name.trim()) {
      onAddSubject(name, selectedColor, parseFloat(allowedAbsenceHours) || 0);
      setName('');
      setSelectedColor(COLORS[0]);
      setAllowedAbsenceHours('0');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg">
          <Plus className="h-5 w-5 mr-2" />
          Add Subject
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border border-white/20 text-white">
        <DialogHeader>
          <DialogTitle>Add New Subject</DialogTitle>
          <DialogDescription>
            Create a new subject to track your lectures and study progress.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm">Subject Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Mathematics"
              className="w-full px-3 py-2 rounded-lg border border-white/20 bg-white/10 text-white placeholder:text-white/40 focus:bg-white/15"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm">Color</label>
            <div className="grid grid-cols-9 gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full transition-transform ${
                    selectedColor === color ? 'scale-110 ring-2 ring-offset-2 ring-black' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm">Allowed Absence Hours (optional)</label>
            <input
              type="number"
              value={allowedAbsenceHours}
              onChange={(e) => setAllowedAbsenceHours(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 rounded-lg border border-white/20 bg-white/10 text-white placeholder:text-white/40 focus:bg-white/15"
              min="0"
              step="0.5"
            />
            <p className="text-xs text-white/50">
              Set the maximum allowed absence hours for this subject
            </p>
          </div>

          <Button onClick={handleSubmit} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0">
            Add Subject
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
