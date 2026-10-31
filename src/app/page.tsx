"use client";

import {
  Users,
  HardHat,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

const stats = [
  { name: "Total Labour On Site", value: "142", icon: HardHat, color: "bg-blue-500" },
  { name: "Staff Attendance", value: "24/25", icon: Users, color: "bg-emerald-500" },
  { name: "Daily Reports", value: "Up to date", icon: FileText, color: "bg-purple-500" },
  { name: "Active Issues", value: "2", icon: AlertTriangle, color: "bg-amber-500" },
];

const recentActivity = [
  { id: 1, type: "report", title: "Daily Progress Report Submitted", time: "2 hours ago", status: "completed" },
  { id: 2, type: "attendance", title: "Site Engineer Attendance Marked", time: "4 hours ago", status: "completed" },
  { id: 3, type: "labour", title: "Labour Count Updated (142 workers)", time: "5 hours ago", status: "completed" },
  { id: 4, type: "issue", title: "Material Shortage: Cement", time: "1 day ago", status: "pending" },
];

export default function Dashboard() {
  const today = new Date();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500">{format(today, "EEEE, MMMM do, yyyy")}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/report"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            New Report
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden bg-white rounded-lg shadow-sm border border-gray-200 p-5"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-md ${stat.color} bg-opacity-10`}>
                <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/report" className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <FileText className="h-6 w-6 text-blue-500 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">Submit Report</h3>
                <p className="text-xs text-gray-500">Create daily progress report</p>
              </div>
            </Link>
            <Link href="/attendance" className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors">
              <Users className="h-6 w-6 text-emerald-500 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">Mark Attendance</h3>
                <p className="text-xs text-gray-500">Staff and engineers</p>
              </div>
            </Link>
            <Link href="/labour" className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-colors">
              <HardHat className="h-6 w-6 text-amber-500 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">Update Labour</h3>
                <p className="text-xs text-gray-500">Daily wage workers</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
          <div className="flow-root">
            <ul className="-mb-8">
              {recentActivity.map((activity, activityIdx) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {activityIdx !== recentActivity.length - 1 ? (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                          activity.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}>
                          {activity.status === 'completed' ? (
                            <CheckCircle2 className="h-5 w-5 text-white" aria-hidden="true" />
                          ) : (
                            <Clock className="h-5 w-5 text-white" aria-hidden="true" />
                          )}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">{activity.title}</p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}