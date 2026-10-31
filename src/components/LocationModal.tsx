import React, { useState } from 'react';
import { MapPin, X, Check, Search, Navigation } from 'lucide-react';
import { POPULAR_LOCATIONS } from '../data/servicesData';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: string;
  onSelectLocation: (loc: string) => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation
}) => {
  const [customInput, setCustomInput] = useState('');
  const [filterQuery, setFilterQuery] = useState('');

  if (!isOpen) return null;

  const filteredLocations = POPULAR_LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      loc.district.toLowerCase().includes(filterQuery.toLowerCase()) ||
      loc.state.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleSelect = (locName: string) => {
    onSelectLocation(locName);
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      handleSelect(customInput.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-[#0B4626] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-700/60 flex items-center justify-center text-white">
              <MapPin className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Select Your Village, Town, or City</h3>
              <p className="text-xs text-emerald-200">GS Setu connects services to your exact neighborhood</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Custom location input */}
          <form onSubmit={handleCustomSubmit} className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Enter Custom Village / Mohalla / City Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Rohania Village, Varanasi or your locality"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#168548]/30 focus:border-[#168548]"
              />
              <button
                type="submit"
                disabled={!customInput.trim()}
                className="px-4 py-2.5 bg-[#168548] hover:bg-[#126e3c] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Set Location
              </button>
            </div>
          </form>

          {/* Quick filter */}
          <div>
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Filter popular service hubs..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-[#168548]/30"
              />
            </div>

            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Popular Service Centers (Uttar Pradesh & Bihar Hubs)
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {filteredLocations.map((loc) => {
                const formatted = `${loc.name}, ${loc.district}`;
                const isSelected = currentLocation.includes(loc.name);
                return (
                  <button
                    key={loc.id}
                    onClick={() => handleSelect(formatted)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#EAF7EE] border-[#168548] text-[#0B4626]'
                        : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Navigation className={`w-4 h-4 ${isSelected ? 'text-[#168548]' : 'text-slate-400'}`} />
                      <div>
                        <div className="text-sm font-semibold">{loc.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {loc.district}, {loc.state} • PIN {loc.pincode}
                        </div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#168548]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Currently set to: <strong className="text-slate-800">{currentLocation}</strong></span>
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
