import JSZip from 'jszip';

export interface GenerationConfig {
  templateFile: File;
  students: Array<{ name: string; email: string }>;
  position: { x: number; y: number };
  fontSize: number;
  fontFamily: string;
  fontColor: string;
  fontWeight: string;
  fontStyle: string;
  textDecoration: string;
}

export interface CertificateBlob {
  student: { name: string; email: string };
  blob: Blob;
}

export const generateCertificates = async (config: GenerationConfig): Promise<Blob> => {
  const zip = new JSZip();
  
  // Create canvas for certificate generation
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Canvas context not available');
  }
  
  // Load template image
  const templateImage = await loadImage(config.templateFile);
  
  // Set canvas size
  canvas.width = templateImage.width;
  canvas.height = templateImage.height;
  
  // Generate certificate for each student
  for (const student of config.students) {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw template
    ctx.drawImage(templateImage, 0, 0);
    
    // Configure text with styles
    let fontString = '';
    if (config.fontStyle === 'italic') fontString += 'italic ';
    if (config.fontWeight === 'bold') fontString += 'bold ';
    fontString += `${config.fontSize}px ${config.fontFamily}`;
    
    ctx.font = fontString;
    ctx.fillStyle = config.fontColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Calculate position
    const x = (config.position.x / 100) * canvas.width;
    const y = (config.position.y / 100) * canvas.height;
    
    // Draw student name
    ctx.fillText(student.name, x, y);
    
    // Add underline if needed
    if (config.textDecoration === 'underline') {
      const textMetrics = ctx.measureText(student.name);
      const textWidth = textMetrics.width;
      const underlineY = y + config.fontSize * 0.1;
      
      ctx.beginPath();
      ctx.moveTo(x - textWidth / 2, underlineY);
      ctx.lineTo(x + textWidth / 2, underlineY);
      ctx.strokeStyle = config.fontColor;
      ctx.lineWidth = Math.max(1, config.fontSize * 0.05);
      ctx.stroke();
    }
    
    // Convert to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/png', 0.9);
    });
    
    // Add to zip
    const fileName = `${student.name.replace(/[^a-zA-Z0-9]/g, '_')}_certificate.png`;
    zip.file(fileName, blob);
  }
  
  // Generate zip file
  return await zip.generateAsync({ type: 'blob' });
};

export const generateCertificateBlobs = async (config: GenerationConfig): Promise<CertificateBlob[]> => {
  const results: CertificateBlob[] = [];
  
  // Create canvas for certificate generation
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Canvas context not available');
  }
  
  // Load template image
  const templateImage = await loadImage(config.templateFile);
  
  // Set canvas size
  canvas.width = templateImage.width;
  canvas.height = templateImage.height;
  
  // Generate certificate for each student
  for (const student of config.students) {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw template
    ctx.drawImage(templateImage, 0, 0);
    
    // Configure text with styles
    let fontString = '';
    if (config.fontStyle === 'italic') fontString += 'italic ';
    if (config.fontWeight === 'bold') fontString += 'bold ';
    fontString += `${config.fontSize}px ${config.fontFamily}`;
    
    ctx.font = fontString;
    ctx.fillStyle = config.fontColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Calculate position
    const x = (config.position.x / 100) * canvas.width;
    const y = (config.position.y / 100) * canvas.height;
    
    // Draw student name
    ctx.fillText(student.name, x, y);
    
    // Add underline if needed
    if (config.textDecoration === 'underline') {
      const textMetrics = ctx.measureText(student.name);
      const textWidth = textMetrics.width;
      const underlineY = y + config.fontSize * 0.1;
      
      ctx.beginPath();
      ctx.moveTo(x - textWidth / 2, underlineY);
      ctx.lineTo(x + textWidth / 2, underlineY);
      ctx.strokeStyle = config.fontColor;
      ctx.lineWidth = Math.max(1, config.fontSize * 0.05);
      ctx.stroke();
    }
    
    // Convert to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/png', 0.9);
    });
    
    results.push({ student, blob });
  }
  
  return results;
};

const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};