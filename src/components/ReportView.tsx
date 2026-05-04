export default function ReportView({ data, title }: any) {
  return (
    <div className="p-8 max-w-4xl mx-auto bg-white border border-gray-200">
      <div className="text-center mb-8 border-b-2 border-blue-900 pb-4">
        <h1 className="text-2xl font-bold uppercase">{title}</h1>
      </div>
      
      {/* Header Table */}
      <table className="w-full mb-8 border-collapse border border-gray-400">
        <tbody>
          <tr><td className="border p-2 font-bold">Tournament:</td><td className="border p-2">{data.tournament}</td></tr>
          <tr><td className="border p-2 font-bold">Date:</td><td className="border p-2">{data.date}</td></tr>
        </tbody>
      </table>

      {/* Questions Section */}
      <div className="space-y-4">
        {Object.entries(data).map(([key, val]: any) => (
          <div key={key} className="border border-gray-300">
            <div className="bg-gray-100 p-2 font-bold uppercase text-xs">{key}</div>
            <div className="p-3">{val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}