import { useState } from 'react';

const CustomSelect = ({ label, options, value, onChange, name, colorClass }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Map colors
    const colors = {
        'white': { border: 'border-white/10', text: 'text-white', bg: 'bg-black/40', hover: 'hover:bg-white/10' },
        'green': { border: 'border-green-500/30', text: 'text-green-400', bg: 'bg-green-900/10', hover: 'hover:bg-green-900/30' },
        'red': { border: 'border-red-500/30', text: 'text-red-400', bg: 'bg-red-900/10', hover: 'hover:bg-red-900/30' }
    };
    const c = colors[colorClass || 'white'];

    return (
        <div className="relative">
            <label className={`block text-[10px] uppercase tracking-wider ${colorClass === 'red' ? 'text-red-500/70' : colorClass === 'green' ? 'text-green-500/70' : 'text-gray-500'} mb-1 font-bold`}>{label}</label>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full p-3 rounded-xl border ${c.border} ${c.bg} ${c.text} font-bold text-sm cursor-pointer flex justify-between items-center transition-all hover:border-opacity-100 border-opacity-50`}
            >
                <span>{options.find(o => o.value === value)?.label || value}</span>
                <span className={`text-xs transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </div>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
                    <div className={`absolute left-0 right-0 mt-2 rounded-xl border ${c.border} bg-[#0a0a0a] backdrop-blur-xl z-20 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200`}>
                        {options.map(opt => (
                            <div
                                key={opt.value}
                                onClick={() => { onChange({ target: { name, value: opt.value } }); setIsOpen(false); }}
                                className={`p-3 text-sm font-bold cursor-pointer transition-colors ${c.text} ${c.hover} ${value === opt.value ? 'bg-white/5' : ''}`}
                            >
                                {opt.label}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default CustomSelect;
