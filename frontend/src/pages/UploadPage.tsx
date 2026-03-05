import { useState } from 'react';
import { Upload, CheckCircle, FileText, BarChart3, Table as TableIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface ParsedCSV {
  headers: string[];
  data: Record<string, string>[];
}

const parseCSVText = (text: string): ParsedCSV => {
  const lines = text.split('\n').filter(line => line.trim());
  if (lines.length === 0) {
    return { headers: [], data: [] };
  }

  // Parse headers
  const headers = lines[0].split(',').map(h => h.trim());

  // Parse data rows
  const data = lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const row: Record<string, string> = {};
    headers.forEach((header, i) => {
      row[header] = values[i] || '';
    });
    return row;
  });

  return { headers, data };
};

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [csvData, setCSVData] = useState<ParsedCSV | null>(null);

  const parseCSV = async (csvFile: File) => {
    try {
      const text = await csvFile.text();
      const parsed = parseCSVText(text);
      if (parsed.headers.length === 0) {
        toast.error('File appears to be empty');
        return;
      }
      setCSVData(parsed);
    } catch (error) {
      toast.error('Failed to parse CSV file');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type === 'text/csv') {
      setFile(f);
      parseCSV(f);
      setDone(false);
    } else {
      toast.error('Please upload a CSV file');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      parseCSV(f);
      setDone(false);
    }
  };

  const handleProcess = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('uploaded_by', 'user'); // Replace with actual user ID if available
      const response = await fetch('http://localhost:8000/api/uploads/', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        setDone(true);
        toast.success('File uploaded and processed successfully!');
      } else {
        toast.error('Upload failed. Please try again.');
      }
    } catch (error) {
      toast.error('Upload error. Please check your connection.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Data Upload</h1>
        <p className="text-sm text-muted-foreground mt-1">Upload CSV case data for processing</p>
      </div>

      {/* Centered Upload Box */}
      <div className="flex justify-center">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 transition-colors bg-card w-full max-w-md"
        >
          {file ? (
            <div className="flex flex-col items-center gap-2">
              <FileText className="w-10 h-10 text-primary" />
              <p className="text-sm font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
              {csvData && (
                <p className="text-xs text-primary mt-2">
                  {csvData.data.length} rows, {csvData.headers.length} columns
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Upload className="w-10 h-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Drag & drop CSV file here, or</p>
              <label className="cursor-pointer px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                Browse Files
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>
            </div>
          )}
        </div>
      </div>

      {file && !done && (
        <div className="flex justify-center">
          <button
            onClick={handleProcess}
            disabled={processing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {processing ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" />
                Processing...
              </>
            ) : (
              'Process Data'
            )}
          </button>
        </div>
      )}

      {done && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 text-sm text-primary font-medium">
          <CheckCircle className="w-5 h-5" />
          Data processed — imputation complete, priority scores recalculated.
        </motion.div>
      )}

      {/* Attributes Section */}
      {csvData && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center gap-2">
            <TableIcon className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Data Attributes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {csvData.headers.map((header) => (
              <div key={header} className="bg-card border border-border rounded-lg p-3 judicial-shadow-sm">
                <p className="text-xs font-medium text-primary uppercase tracking-wide">{header}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {csvData.data.filter(row => row[header] && row[header].trim()).length} values
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Data Preview Section */}
      {csvData && csvData.data.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Data Preview</h2>
          </div>
          <div className="bg-card border border-border rounded-lg overflow-hidden judicial-shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {csvData.headers.slice(0, 6).map((header) => (
                      <th key={header} className="px-4 py-3 text-left font-medium text-foreground">
                        {header}
                      </th>
                    ))}
                    {csvData.headers.length > 6 && (
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                        +{csvData.headers.length - 6} more
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {csvData.data.slice(0, 5).map((row, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      {csvData.headers.slice(0, 6).map((header) => (
                        <td key={`${i}-${header}`} className="px-4 py-3 text-muted-foreground truncate">
                          {row[header] || '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {csvData.data.length > 5 && (
              <div className="px-4 py-3 bg-muted/10 text-xs text-muted-foreground border-t border-border">
                Showing 5 of {csvData.data.length} rows
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
