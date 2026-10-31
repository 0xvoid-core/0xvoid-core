"use client";

import { useState } from "react";
import { Save, AlertCircle, Plus, Trash2, Users } from "lucide-react";

type LabourEntry = {
  id: string;
  type: string;
  count: number;
  contractor: string;
  remarks: string;
};

export default function LabourPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [labourList, setLabourList] = useState<LabourEntry[]>([
    { id: "1", type: "Skilled Mason", count: 12, contractor: "ABC Builders", remarks: "Block A" },
    { id: "2", type: "General Helper", count: 25, contractor: "XYZ Contractors", remarks: "Site clearing" },
  ]);

  const addLabourType = () => {
    setLabourList([
      ...labourList,
      { id: Date.now().toString(), type: "", count: 0, contractor: "", remarks: "" },
    ]);
  };

  const removeLabourType = (id: string) => {
    setLabourList(labourList.filter((l) => l.id !== id));
  };

  const updateLabourType = (id: string, field: keyof LabourEntry, value: string | number) => {
    setLabourList(
      labourList.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
  };

  const totalLabour = labourList.reduce((acc, curr) => acc + (Number(curr.count) || 0), 0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/labour", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: new Date().toISOString().split("T")[0],
          labour: labourList,
          total: totalLabour,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit");
      setSubmitStatus("success");
    } catch (error) {
      console.error(error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daily Labour Counter</h1>
          <p className="mt-2 text-sm text-gray-600">
            Track daily wage workers, skilled and unskilled labour on site.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 flex items-center gap-3">
            <Users className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-xs text-blue-600 font-medium uppercase tracking-wider">Total Labour</p>
              <p className="text-xl font-bold text-blue-900">{totalLabour}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={addLabourType}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
            Add Type
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Labour Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Count
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contractor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remarks / Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {labourList.map((labour) => (
                  <tr key={labour.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        required
                        value={labour.type}
                        onChange={(e) => updateLabourType(labour.id, "type", e.target.value)}
                        placeholder="e.g. Mason, Helper, Carpenter"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        required
                        min="0"
                        value={labour.count}
                        onChange={(e) => updateLabourType(labour.id, "count", parseInt(e.target.value) || 0)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={labour.contractor}
                        onChange={(e) => updateLabourType(labour.id, "contractor", e.target.value)}
                        placeholder="Subcontractor Name"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={labour.remarks}
                        onChange={(e) => updateLabourType(labour.id, "remarks", e.target.value)}
                        placeholder="Optional remarks"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        type="button"
                        onClick={() => removeLabourType(labour.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-200">
            {submitStatus === "error" && (
              <div className="mb-4 rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error submitting labour count</h3>
                  </div>
                </div>
              </div>
            )}

            {submitStatus === "success" && (
              <div className="mb-4 rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Successfully submitted</h3>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || labourList.length === 0}
              className="w-full sm:w-auto flex justify-center items-center py-2.5 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                "Saving..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Labour Count
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}