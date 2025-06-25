import React from 'react';
import { Users, Mail, User } from 'lucide-react';

interface Student {
  name: string;
  email: string;
}

interface StudentListProps {
  students: Student[];
}

export const StudentList: React.FC<StudentListProps> = ({ students }) => {
  if (students.length === 0) {
    return (
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/50 p-6">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <Users className="w-12 h-12 mx-auto mb-3" />
          <p>Upload Excel file to see student list</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/50">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>Students ({students.length})</span>
        </h3>
      </div>
      
      <div className="max-h-64 overflow-y-auto">
        {students.map((student, index) => (
          <div 
            key={index} 
            className="p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                  {student.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate flex items-center space-x-1">
                  <Mail className="w-3 h-3" />
                  <span>{student.email}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};