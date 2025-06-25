import React, { useState } from 'react';
import { Award, FileImage, FileSpreadsheet } from 'lucide-react';
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';
import { FileUpload } from './components/FileUpload';
import { CertificatePreview } from './components/CertificatePreview';
import { PositionControls } from './components/PositionControls';
import { StudentList } from './components/StudentList';
import { GenerationControls } from './components/GenerationControls';
import { ColumnSelector } from './components/ColumnSelector';
import { EmailSettings } from './components/EmailSettings';
import { parseExcelFile, createStudentsFromColumns, Student, ExcelData } from './utils/excelReader';
import { generateCertificates, generateCertificateBlobs, downloadBlob } from './utils/certificateGenerator';
import { sendCertificateEmails } from './utils/emailService';

function AppContent() {
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<ExcelData | null>(null);
  const [nameColumn, setNameColumn] = useState('');
  const [emailColumn, setEmailColumn] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [fontSize, setFontSize] = useState(48);
  const [fontFamily, setFontFamily] = useState('Arial, sans-serif');
  const [fontColor, setFontColor] = useState('#000000');
  const [fontWeight, setFontWeight] = useState('normal');
  const [fontStyle, setFontStyle] = useState('normal');
  const [textDecoration, setTextDecoration] = useState('none');
  const [templateError, setTemplateError] = useState('');
  const [excelError, setExcelError] = useState('');

  const handleTemplateSelect = (file: File) => {
    setTemplateError('');
    if (file && file.type.startsWith('image/')) {
      setTemplateFile(file);
    } else {
      setTemplateError('Please select a valid image file (PNG, JPEG)');
      setTemplateFile(null);
    }
  };

  const handleExcelSelect = async (file: File) => {
    setExcelError('');
    if (file && (file.type.includes('sheet') || file.name.endsWith('.xlsx'))) {
      try {
        const parsedData = await parseExcelFile(file);
        setExcelFile(file);
        setExcelData(parsedData);
        
        // Auto-select columns if they match common patterns
        const nameCol = parsedData.columns.find(col => 
          col.label.toLowerCase().includes('name') || 
          col.label.toLowerCase().includes('student')
        );
        const emailCol = parsedData.columns.find(col => 
          col.label.toLowerCase().includes('email') || 
          col.label.toLowerCase().includes('mail')
        );
        
        if (nameCol) setNameColumn(nameCol.key);
        if (emailCol) setEmailColumn(emailCol.key);
        
        // If both columns are auto-selected, create students immediately
        if (nameCol && emailCol) {
          const generatedStudents = createStudentsFromColumns(parsedData, nameCol.key, emailCol.key);
          setStudents(generatedStudents);
        }
      } catch (error) {
        setExcelError(error instanceof Error ? error.message : 'Failed to parse Excel file');
        setExcelFile(null);
        setExcelData(null);
        setStudents([]);
      }
    } else {
      setExcelError('Please select a valid Excel file (.xlsx)');
      setExcelFile(null);
      setExcelData(null);
      setStudents([]);
    }
  };

  const handleNameColumnChange = (column: string) => {
    setNameColumn(column);
    if (column && emailColumn && excelData) {
      const generatedStudents = createStudentsFromColumns(excelData, column, emailColumn);
      setStudents(generatedStudents);
    }
  };

  const handleEmailColumnChange = (column: string) => {
    setEmailColumn(column);
    if (nameColumn && column && excelData) {
      const generatedStudents = createStudentsFromColumns(excelData, nameColumn, column);
      setStudents(generatedStudents);
    }
  };

  const handleGenerateAll = async () => {
    if (!templateFile || students.length === 0) return;
    
    try {
      const zipBlob = await generateCertificates({
        templateFile,
        students,
        position,
        fontSize,
        fontFamily,
        fontColor,
        fontWeight,
        fontStyle,
        textDecoration
      });
      
      downloadBlob(zipBlob, 'certificates.zip');
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate certificates. Please try again.');
    }
  };

  const handleSendEmails = async (emailSettings: EmailSettings) => {
    if (!templateFile || students.length === 0) {
      throw new Error('Template and student data are required');
    }
    
    try {
      // Generate individual certificate blobs
      const certificateBlobs = await generateCertificateBlobs({
        templateFile,
        students,
        position,
        fontSize,
        fontFamily,
        fontColor,
        fontWeight,
        fontStyle,
        textDecoration
      });
      
      // Prepare email data
      const emailData = certificateBlobs.map(({ student, blob }) => ({
        to: student.email,
        name: student.name,
        certificateBlob: blob
      }));
      
      // Send emails
      return await sendCertificateEmails(emailData, emailSettings);
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  };

  const canGenerate = templateFile && students.length > 0;
  const sampleName = students.length > 0 ? students[0].name : 'John Doe';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/5 dark:to-purple-400/5" />
        <div className="relative container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Certificate Generator
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Create and distribute certificates effortlessly
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-8 space-y-8">
        {/* File Uploads */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center space-x-2">
              <FileImage className="w-5 h-5" />
              <span>Certificate Template</span>
            </h2>
            <FileUpload
              accept="image/*"
              title="Upload Certificate Template"
              description="PNG, JPEG up to 10MB"
              onFileSelect={handleTemplateSelect}
              selectedFile={templateFile}
              error={templateError}
            />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center space-x-2">
              <FileSpreadsheet className="w-5 h-5" />
              <span>Excel File</span>
            </h2>
            <FileUpload
              accept=".xlsx,.xls"
              title="Upload Excel File"
              description="Excel file with student data"
              onFileSelect={handleExcelSelect}
              selectedFile={excelFile}
              error={excelError}
            />
          </div>
        </div>

        {/* Column Selection */}
        {excelData && (
          <ColumnSelector
            columns={excelData.columns}
            nameColumn={nameColumn}
            emailColumn={emailColumn}
            onNameColumnChange={handleNameColumnChange}
            onEmailColumnChange={handleEmailColumnChange}
          />
        )}

        {/* Configuration & Preview */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="space-y-6">
            <PositionControls
              position={position}
              fontSize={fontSize}
              fontFamily={fontFamily}
              fontColor={fontColor}
              fontWeight={fontWeight}
              fontStyle={fontStyle}
              textDecoration={textDecoration}
              onPositionChange={setPosition}
              onFontSizeChange={setFontSize}
              onFontFamilyChange={setFontFamily}
              onFontColorChange={setFontColor}
              onFontWeightChange={setFontWeight}
              onFontStyleChange={setFontStyle}
              onTextDecorationChange={setTextDecoration}
            />
            
            <StudentList students={students} />
          </div>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Live Preview
              </h2>
              <CertificatePreview
                templateFile={templateFile}
                sampleName={sampleName}
                position={position}
                fontSize={fontSize}
                fontFamily={fontFamily}
                fontColor={fontColor}
                fontWeight={fontWeight}
                fontStyle={fontStyle}
                textDecoration={textDecoration}
              />
            </div>
          </div>
        </div>

        {/* Generation Controls */}
        <GenerationControls
          onGenerateAll={handleGenerateAll}
          onSendEmails={handleSendEmails}
          studentsCount={students.length}
          canGenerate={canGenerate}
        />
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;