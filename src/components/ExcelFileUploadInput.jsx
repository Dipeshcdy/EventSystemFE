import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';
import { FaXmark } from 'react-icons/fa6';

const ExcelFileUploadInput = ({ setFile, customKey, existingUrl, isEditable = true }) => {
  const [excelFile, setExcelFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (existingUrl && (existingUrl.endsWith('.xlsx') || existingUrl.endsWith('.xls'))) {
      setExcelFile({ name: existingUrl.split('/').pop(), url: existingUrl });
    }
  }, []);

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;
    if (files.length > 0) validateAndSetFile(files[0]);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (file) => {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];

    if (validTypes.includes(file.type) || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      setFile(file);
      setExcelFile(file);
      parseExcel(file);
    } else {
      toast.error('Invalid file type. Please upload an XLS or XLSX file.');
    }
  };

  const parseExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length) {
        setHeaders(jsonData[0]);
        setParsedData(jsonData.slice(1));
      } else {
        toast.error('The file is empty or has no readable data.');
        setParsedData([]);
        setHeaders([]);
      }
    };
    reader.readAsBinaryString(file);
  };

  const clearFile = () => {
    setExcelFile(null);
    setParsedData([]);
    setHeaders([]);
    setFile(null);
  };

  return (
    <div className="space-y-4">
      {excelFile ? (
        <>
          <div className="flex items-center w-full justify-between p-2 border rounded-lg bg-gray-100">
            <span className="truncate text-sm font-light">{excelFile.name}</span>
            {isEditable && (
              <FaXmark
                onClick={clearFile}
                className="text-red-400 text-xl hover:text-red-600 cursor-pointer"
                title="Delete File"
              />
            )}
          </div>

          {parsedData.length > 0 && (
            <div className="overflow-x-auto border rounded-lg max-h-96">
              <table className="min-w-full text-sm text-left text-gray-700">
                <thead className="bg-gray-200 sticky top-0">
                  <tr>
                    {headers.map((header, index) => (
                      <th key={index} className="px-4 py-2 border">
                        {header || `Column ${index + 1}`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsedData.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-t">
                      {headers.map((_, colIndex) => (
                        <td key={colIndex} className="px-4 py-1 border">
                          {row[colIndex] ?? ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor={`dropzone-excel-${customKey}`}
            className={`flex flex-col items-center justify-center w-full h-56 border-2 ${isDragging ? 'border-blue-500 bg-blue-100' : 'border-gray-300 bg-gray-50'
              } border-dashed rounded-lg cursor-pointer dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5A5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                XLS, XLSX files only
              </p>
            </div>
            <input
              id={`dropzone-excel-${customKey}`}
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default ExcelFileUploadInput;
