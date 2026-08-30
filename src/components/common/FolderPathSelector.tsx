import React, { useState, useEffect } from 'react';
import {
  Folder,
  FolderPlus,
  FolderGit2,
  FileCode2,
  ChevronDown,
  ChevronUp,
  Check,
  RefreshCw,
  Edit3,
  ListFilter,
  Sparkles,
  Layers,
  Search,
  X,
  Loader2
} from 'lucide-react';

interface FolderPathSelectorProps {
  targetPath: string;
  onChangeTargetPath: (newPath: string) => void;
  githubToken?: string;
  repoOwner?: string;
  repoName?: string;
  branch?: string;
  type?: 'paper' | 'syllabus' | 'notes' | 'general';
  label?: string;
  className?: string;
}

export const FolderPathSelector: React.FC<FolderPathSelectorProps> = ({
  targetPath,
  onChangeTargetPath,
  githubToken,
  repoOwner,
  repoName,
  branch = 'main',
  type = 'paper',
  label = 'Target JSON File Path in Repo',
  className = '',
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isRawEdit, setIsRawEdit] = useState(false);
  const [repoFolders, setRepoFolders] = useState<string[]>([]);
  const [isLoadingFolders, setIsLoadingFolders] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [customFolderInput, setCustomFolderInput] = useState('');

  // Helper: split targetPath into folder and filename
  const parsePath = (fullPath: string) => {
    const clean = (fullPath || '').trim().replace(/\\/g, '/');
    const lastSlashIdx = clean.lastIndexOf('/');
    if (lastSlashIdx === -1) {
      return { folder: '', filename: clean || 'paper.json' };
    }
    const folder = clean.substring(0, lastSlashIdx);
    const filename = clean.substring(lastSlashIdx + 1);
    return { folder, filename };
  };

  const { folder: currentFolder, filename: currentFilename } = parsePath(targetPath);

  // Define Preset Folders according to type
  const getPresetFolders = () => {
    if (type === 'syllabus') {
      return [
        'Syllabus/XII',
        'Syllabus/XII/Arts',
        'Syllabus/XII/Science',
        'Syllabus/XII/Commerce',
        'Syllabus/X',
        'data/syllabus',
        'syllabus',
        '', // Root
      ];
    }
    if (type === 'notes') {
      return [
        'Notes/XII',
        'Notes/XII/Political Science',
        'Notes/XII/Biology',
        'Notes/XII/Physics',
        'Notes/XII/Chemistry',
        'Notes/X',
        'data/notes',
        'notes',
        '', // Root
      ];
    }
    // Default / Paper presets
    return [
      'Papers/XII/Political Science',
      'Papers/XII/History',
      'Papers/XII/Geography',
      'Papers/XII/Sociology',
      'Papers/XII/Biology',
      'Papers/XII/Physics',
      'Papers/XII/Chemistry',
      'Papers/XII/Mathematics',
      'Papers/XII/Hindi',
      'Papers/XII/English',
      'Papers/X/Science',
      'Papers/X/Social Science',
      'data/papers',
      'papers',
      '', // Root
    ];
  };

  const presetFolders = getPresetFolders();

  // Fetch folders from connected GitHub Repository
  const fetchRepoFolders = async () => {
    if (!repoOwner || !repoName) return;
    setIsLoadingFolders(true);
    try {
      const res = await fetch('/api/github/fetch-repo-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: githubToken,
          owner: repoOwner,
          repo: repoName,
          branch,
        }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.folders)) {
        setRepoFolders(data.folders);
      }
    } catch (err) {
      console.warn('Failed to fetch repo folders:', err);
    } finally {
      setIsLoadingFolders(false);
    }
  };

  // Auto-fetch repo folders when picker opens if available
  useEffect(() => {
    if (isPickerOpen && repoOwner && repoName && repoFolders.length === 0) {
      fetchRepoFolders();
    }
  }, [isPickerOpen, repoOwner, repoName]);

  // Update full path when folder changes
  const handleSelectFolder = (newFolder: string) => {
    const cleanFolder = newFolder.trim().replace(/^\/+|\/+$/g, '');
    const fn = currentFilename || 'file.json';
    const newFullPath = cleanFolder ? `${cleanFolder}/${fn}` : fn;
    onChangeTargetPath(newFullPath);
  };

  // Update full path when filename changes
  const handleFilenameChange = (newFilename: string) => {
    const cleanFn = newFilename.trim().replace(/^\/+/g, '');
    const folder = currentFolder ? currentFolder.trim().replace(/^\/+|\/+$/g, '') : '';
    const newFullPath = folder ? `${folder}/${cleanFn}` : cleanFn;
    onChangeTargetPath(newFullPath);
  };

  // Update folder input manually
  const handleFolderInputChange = (newFolder: string) => {
    handleSelectFolder(newFolder);
  };

  // Combine presets and repo folders
  const allAvailableFolders = Array.from(
    new Set([...presetFolders, ...repoFolders])
  ).filter((f) => {
    if (!searchFilter.trim()) return true;
    return f.toLowerCase().includes(searchFilter.toLowerCase());
  });

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Header Label */}
      <div className="flex items-center justify-between">
        <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <FileCode2 className="w-3.5 h-3.5 text-indigo-600" />
          <span>{label}</span>
        </label>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsRawEdit(!isRawEdit)}
            className="text-[10px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
          >
            <Edit3 className="w-3 h-3" />
            <span>{isRawEdit ? 'Structured Picker' : 'Edit Full String'}</span>
          </button>
        </div>
      </div>

      {isRawEdit ? (
        /* Raw Full Path Input */
        <div className="relative">
          <input
            type="text"
            value={targetPath}
            onChange={(e) => onChangeTargetPath(e.target.value)}
            placeholder="e.g. Papers/XII/Political Science/class12_polscience_2026.json"
            className="w-full h-10 px-3 pr-10 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold text-xs focus:ring-2 focus:ring-indigo-600 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setIsPickerOpen(!isPickerOpen)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer"
            title="Open Folder Selector"
          >
            <FolderGit2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Structured Path Selector (Folder + Filename) */
        <div className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
            {/* Folder Selection Box */}
            <div className="sm:col-span-7 relative">
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setIsPickerOpen(!isPickerOpen)}
                  className="h-10 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 border-r-0 rounded-l-xl font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
                  title="Folder Select Karein"
                >
                  <Folder className="w-4 h-4 text-indigo-600" />
                  <span className="hidden xs:inline">Select Folder</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-indigo-600 transition-transform ${isPickerOpen ? 'rotate-180' : ''}`} />
                </button>

                <input
                  type="text"
                  value={currentFolder}
                  onChange={(e) => handleFolderInputChange(e.target.value)}
                  placeholder="Target Folder (e.g. Papers/XII/Political Science)"
                  className="w-full h-10 px-3 rounded-r-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Filename Box */}
            <div className="sm:col-span-5 relative">
              <div className="flex items-center">
                <span className="h-10 px-2 bg-slate-100 text-slate-500 border border-slate-200 border-r-0 rounded-l-xl font-mono text-xs flex items-center justify-center shrink-0">
                  /
                </span>
                <input
                  type="text"
                  value={currentFilename}
                  onChange={(e) => handleFilenameChange(e.target.value)}
                  placeholder="filename.json"
                  className="w-full h-10 px-3 rounded-r-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold text-xs focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Combined Preview Bar */}
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-bold text-slate-500 shrink-0">Destination:</span>
              <span className="font-mono text-indigo-900 font-bold truncate">
                {repoName ? `${repoName}/` : ''}
                <span className="text-indigo-700">{currentFolder ? `${currentFolder}/` : ''}</span>
                <span className="text-slate-900">{currentFilename || 'file.json'}</span>
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsPickerOpen(!isPickerOpen)}
              className="text-indigo-600 hover:text-indigo-800 font-bold text-[10px] shrink-0 underline cursor-pointer"
            >
              {isPickerOpen ? 'Close Folders' : 'Choose Folder'}
            </button>
          </div>
        </div>
      )}

      {/* Folder Selector Drawer / Dropdown */}
      {isPickerOpen && (
        <div className="p-3.5 rounded-2xl bg-white border border-indigo-200 shadow-md space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-1.5">
              <FolderGit2 className="w-4 h-4 text-indigo-600" />
              <span className="font-bold text-xs text-slate-900">Select Target Folder Directory</span>
            </div>

            <div className="flex items-center gap-2">
              {repoOwner && repoName && (
                <button
                  type="button"
                  onClick={fetchRepoFolders}
                  disabled={isLoadingFolders}
                  className="text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  {isLoadingFolders ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                  <span>Scan Repo Folders</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsPickerOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Filter Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search or filter folder paths..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full h-8 pl-8 pr-3 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:ring-1 focus:ring-indigo-600 focus:outline-none"
            />
          </div>

          {/* Quick Preset Buttons Section */}
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Standard Folder Presets</span>
              <span className="text-slate-400 font-normal">(Click to apply)</span>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
              {presetFolders
                .filter((f) => !searchFilter || f.toLowerCase().includes(searchFilter.toLowerCase()))
                .map((folder) => {
                  const isSelected = currentFolder === folder;
                  return (
                    <button
                      key={`preset-${folder || 'root'}`}
                      type="button"
                      onClick={() => {
                        handleSelectFolder(folder);
                        setIsPickerOpen(false);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600 text-white font-bold shadow-xs'
                          : 'bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-900 border border-slate-200 hover:border-indigo-200'
                      }`}
                    >
                      <Folder className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-indigo-600'}`} />
                      <span>{folder || '(Root / Main)'}</span>
                      {isSelected && <Check className="w-3 h-3 ml-0.5" />}
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Live Repository Folders Section */}
          {repoFolders.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Folders Existing in Repository ({repoFolders.length})</span>
                <span className="text-indigo-600 font-bold">{repoOwner}/{repoName}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
                {repoFolders
                  .filter((f) => !searchFilter || f.toLowerCase().includes(searchFilter.toLowerCase()))
                  .map((folder) => {
                    const isSelected = currentFolder === folder;
                    return (
                      <button
                        key={`repo-folder-${folder}`}
                        type="button"
                        onClick={() => {
                          handleSelectFolder(folder);
                          setIsPickerOpen(false);
                        }}
                        className={`p-2 rounded-xl text-left border text-xs font-mono transition-colors flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-400 text-indigo-950 font-bold'
                            : 'bg-slate-50 hover:bg-indigo-50 border-slate-200 hover:border-indigo-300 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FolderGit2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span className="truncate">{folder}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Custom Folder Creator Input */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              placeholder="Create new folder path (e.g. QuestionBanks/2026/Class12)"
              value={customFolderInput}
              onChange={(e) => setCustomFolderInput(e.target.value)}
              className="flex-1 h-8 px-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono focus:ring-1 focus:ring-indigo-600 focus:outline-none"
            />
            <button
              type="button"
              disabled={!customFolderInput.trim()}
              onClick={() => {
                if (customFolderInput.trim()) {
                  handleSelectFolder(customFolderInput.trim());
                  setCustomFolderInput('');
                  setIsPickerOpen(false);
                }
              }}
              className="h-8 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>Apply Folder</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
