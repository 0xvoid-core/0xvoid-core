"use client";

import { useState } from "react";
import { Save, AlertCircle, Plus, Trash2 } from "lucide-react";

type Staff = {
  id: string;
  name: string;
  role: string;
  status: "Present" | "Absent" | "Leave";
  remarks: string;
};

export default function AttendancePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [staffList, setStaffList] = useState<Staff[]>([
    { id: "1", name: "John Doe", role: "Site Engineer", status: "Present", remarks: "" },
    { id: "2", name: "Jane Smith", role: "Safety Officer", status: "Present", remarks: "" },
  ]);

  const addStaff = () => {
    setStaffList([
      ...staffList,
      { id: Date.now().toString(), name: "", role: "", status: "Present", remarks: "" },
    ]);
  };

  const removeStaff = (id: string) => {
    setStaffList(staffList.filter((s) => s.id !== id));
  };

  const updateStaff = (id: string, field: keyof Staff, value: string) => {
    setStaffList(
      staffList.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: new Date().toISOString().split("T")[0],
          attendance: staffList,
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
          <h1 className="text-2xl font-bold text-gray-900">Staff Attendance</h1>
          <p className="mt-2 text-sm text-gray-600">
            Mark daily attendance for permanent staff and engineers.
          </p>
        </div>
        <div>
          <button
            type="button"
            onClick={addStaff}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
            Add Staff Member
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
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remarks
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {staffList.map((staff) => (
                  <tr key={staff.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        required
                        value={staff.name}
                        onChange={(e) => updateStaff(staff.id, "name", e.target.value)}
                        placeholder="Staff Name"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        required
                        value={staff.role}
                        onChange={(e) => updateStaff(staff.id, "role", e.target.value)}
                        placeholder="e.g. Site Engineer"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={staff.status}
                        onChange={(e) => updateStaff(staff.id, "status", e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Leave">Leave</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={staff.remarks}
                        onChange={(e) => updateStaff(staff.id, "remarks", e.target.value)}
                        placeholder="Optional remarks"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        type="button"
                        onClick={() => removeStaff(staff.id)}
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
                    <h3 className="text-sm font-medium text-red-800">Error submitting attendance</h3>
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
              disabled={isSubmitting || staffList.length === 0}
              className="w-full sm:w-auto flex justify-center items-center py-2.5 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                "Saving..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Attendance
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}