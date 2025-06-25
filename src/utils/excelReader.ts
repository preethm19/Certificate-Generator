import * as XLSX from 'xlsx';

export interface Student {
  name: string;
  email: string;
  [key: string]: string; // Allow additional columns
}

export interface ExcelColumn {
  key: string;
  label: string;
  values: string[];
}

export interface ExcelData {
  columns: ExcelColumn[];
  rows: any[][];
}

export const parseExcelFile = async (file: File): Promise<ExcelData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get the first worksheet
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        
        // Convert to JSON with headers
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
        
        if (jsonData.length < 2) {
          reject(new Error('Excel file must have at least a header row and one data row.'));
          return;
        }
        
        // Extract headers and create columns
        const headers = jsonData[0];
        const columns: ExcelColumn[] = headers.map((header, index) => {
          const values = jsonData.slice(1).map(row => row[index] || '').filter(val => val.toString().trim() !== '');
          return {
            key: `col_${index}`,
            label: header?.toString() || `Column ${index + 1}`,
            values
          };
        });
        
        resolve({
          columns,
          rows: jsonData.slice(1)
        });
      } catch (error) {
        reject(new Error('Failed to parse Excel file. Please ensure it\'s a valid .xlsx file.'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read the file.'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

export const createStudentsFromColumns = (
  excelData: ExcelData,
  nameColumnKey: string,
  emailColumnKey: string
): Student[] => {
  const nameColumnIndex = parseInt(nameColumnKey.replace('col_', ''));
  const emailColumnIndex = parseInt(emailColumnKey.replace('col_', ''));
  
  const students: Student[] = [];
  
  for (const row of excelData.rows) {
    const name = row[nameColumnIndex]?.toString().trim();
    const email = row[emailColumnIndex]?.toString().trim();
    
    if (name && email) {
      students.push({ name, email });
    }
  }
  
  return students;
};