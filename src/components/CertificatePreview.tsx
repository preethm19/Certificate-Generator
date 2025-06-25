import React, { useRef, useEffect, useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface CertificatePreviewProps {
  templateFile: File | null;
  sampleName: string;
  position: { x: number; y: number };
  fontSize: number;
  fontFamily: string;
  fontColor: string;
  fontWeight: string;
  fontStyle: string;
  textDecoration: string;
}

export const CertificatePreview: React.FC<CertificatePreviewProps> = ({
  templateFile,
  sampleName,
  position,
  fontSize,
  fontFamily,
  fontColor,
  fontWeight,
  fontStyle,
  textDecoration
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [templateImage, setTemplateImage] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (templateFile) {
      const img = new Image();
      img.onload = () => {
        setTemplateImage(img);
      };
      img.src = URL.createObjectURL(templateFile);
      
      return () => {
        URL.revokeObjectURL(img.src);
      };
    }
  }, [templateFile]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (canvas && ctx && templateImage) {
      // Set canvas size to match image
      canvas.width = templateImage.width;
      canvas.height = templateImage.height;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw template
      ctx.drawImage(templateImage, 0, 0);
      
      // Draw sample name with styles
      if (sampleName) {
        // Build font string with weight and style
        let fontString = '';
        if (fontStyle === 'italic') fontString += 'italic ';
        if (fontWeight === 'bold') fontString += 'bold ';
        fontString += `${fontSize}px ${fontFamily}`;
        
        ctx.font = fontString;
        ctx.fillStyle = fontColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const x = (position.x / 100) * canvas.width;
        const y = (position.y / 100) * canvas.height;
        
        // Draw text
        ctx.fillText(sampleName, x, y);
        
        // Add underline if needed
        if (textDecoration === 'underline') {
          const textMetrics = ctx.measureText(sampleName);
          const textWidth = textMetrics.width;
          const underlineY = y + fontSize * 0.1;
          
          ctx.beginPath();
          ctx.moveTo(x - textWidth / 2, underlineY);
          ctx.lineTo(x + textWidth / 2, underlineY);
          ctx.strokeStyle = fontColor;
          ctx.lineWidth = Math.max(1, fontSize * 0.05);
          ctx.stroke();
        }
      }
    }
  }, [templateImage, sampleName, position, fontSize, fontFamily, fontColor, fontWeight, fontStyle, textDecoration]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.3));
  const handleResetZoom = () => setZoom(1);

  if (!templateFile) {
    return (
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/50 p-8">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="w-24 h-24 mx-auto mb-4 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
          <p>Upload a certificate template to see preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Certificate Preview</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[3rem] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="overflow-auto max-h-[500px] rounded-lg shadow-lg bg-white dark:bg-gray-800">
          <div 
            className="p-4 flex justify-center"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
          >
            <canvas
              ref={canvasRef}
              className="max-w-full h-auto shadow-xl rounded-lg"
              style={{ maxWidth: '600px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};