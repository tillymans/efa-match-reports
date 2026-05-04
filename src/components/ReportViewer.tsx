import { X } from "lucide-react";

export default function ReportViewer({ reportData, title, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose}><X size={24} /></button>
        </div>
        
        {/* The Print-Optimized Layout */}
        <div id="printable-report" className="space-y-4 text-sm">
          {Object.entries(reportData).map(([key, val]: any) => (
             <div key={key} className="grid grid-cols-2">
               <span className="font-bold text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
               <span className="text-gray-900">{String(val)}</span>
             </div>
          ))}
        </div>
        

        <div className="mt-8 flex gap-3">
          <button onClick={() => window.print()} className="flex-1 bg-blue-600 text-white py-2 rounded-lg">Print PDF</button>
          <button onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg">Close</button>
        </div>
      </div>
    </div>
  );
}