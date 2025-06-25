import React from 'react';
import { Move, Type, Palette, Bold, Italic, Underline } from 'lucide-react';

interface PositionControlsProps {
  position: { x: number; y: number };
  fontSize: number;
  fontFamily: string;
  fontColor: string;
  fontWeight: string;
  fontStyle: string;
  textDecoration: string;
  onPositionChange: (position: { x: number; y: number }) => void;
  onFontSizeChange: (size: number) => void;
  onFontFamilyChange: (family: string) => void;
  onFontColorChange: (color: string) => void;
  onFontWeightChange: (weight: string) => void;
  onFontStyleChange: (style: string) => void;
  onTextDecorationChange: (decoration: string) => void;
}

const fontFamilies = [
  'Arial, sans-serif',
  'Georgia, serif',
  'Times New Roman, serif',
  'Helvetica, sans-serif',
  'Courier New, monospace',
  'Verdana, sans-serif',
  'Impact, sans-serif',
  'Comic Sans MS, cursive'
];

export const PositionControls: React.FC<PositionControlsProps> = ({
  position,
  fontSize,
  fontFamily,
  fontColor,
  fontWeight,
  fontStyle,
  textDecoration,
  onPositionChange,
  onFontSizeChange,
  onFontFamilyChange,
  onFontColorChange,
  onFontWeightChange,
  onFontStyleChange,
  onTextDecorationChange
}) => {
  return (
    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/50 p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
        <Move className="w-5 h-5" />
        <span>Text Configuration</span>
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Position Controls */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700 dark:text-gray-300">Position (%)</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">X Position</label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={position.x}
                  onChange={(e) => onPositionChange({ ...position, x: parseInt(e.target.value) })}
                  className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-sm font-mono w-12 text-center">{position.x}%</span>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Y Position</label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={position.y}
                  onChange={(e) => onPositionChange({ ...position, y: parseInt(e.target.value) })}
                  className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-sm font-mono w-12 text-center">{position.y}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Font Controls */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
            <Type className="w-4 h-4" />
            <span>Typography</span>
          </h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Font Size</label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="12"
                  max="120"
                  value={fontSize}
                  onChange={(e) => onFontSizeChange(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-sm font-mono w-12 text-center">{fontSize}px</span>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Font Family</label>
              <select
                value={fontFamily}
                onChange={(e) => onFontFamilyChange(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"
              >
                {fontFamilies.map((font) => (
                  <option key={font} value={font} style={{ fontFamily: font }}>
                    {font.split(',')[0]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center space-x-1">
                <Palette className="w-4 h-4" />
                <span>Font Color</span>
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={fontColor}
                  onChange={(e) => onFontColorChange(e.target.value)}
                  className="w-12 h-8 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
                <input
                  type="text"
                  value={fontColor}
                  onChange={(e) => onFontColorChange(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm text-gray-900 dark:text-gray-100"
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Text Style Controls */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700 dark:text-gray-300">Text Styles</h4>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onFontWeightChange(fontWeight === 'bold' ? 'normal' : 'bold')}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200
              ${fontWeight === 'bold'
                ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }
            `}
          >
            <Bold className="w-4 h-4" />
            <span className="font-bold">Bold</span>
          </button>
          
          <button
            onClick={() => onFontStyleChange(fontStyle === 'italic' ? 'normal' : 'italic')}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200
              ${fontStyle === 'italic'
                ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }
            `}
          >
            <Italic className="w-4 h-4" />
            <span className="italic">Italic</span>
          </button>
          
          <button
            onClick={() => onTextDecorationChange(textDecoration === 'underline' ? 'none' : 'underline')}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200
              ${textDecoration === 'underline'
                ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }
            `}
          >
            <Underline className="w-4 h-4" />
            <span className="underline">Underline</span>
          </button>
        </div>
        
        {/* Preview Text */}
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Style Preview:</p>
          <p 
            style={{
              fontFamily,
              fontSize: `${Math.min(fontSize, 24)}px`,
              color: fontColor,
              fontWeight,
              fontStyle,
              textDecoration
            }}
            className="text-center"
          >
            Sample Certificate Text
          </p>
        </div>
      </div>
    </div>
  );
};