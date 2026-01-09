"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  fetchJobsFiltered,
  createJob,
  runJob,
  deleteJob,
} from "@/utils/api";

import {
  Play,
  CheckCircle,
  Clock,
  Loader2,
  Plus,
  X,
  Trash2,
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();

  const [jobs, setJobs] = useState<any[]>([]);
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState("Medium");

  // Payload builder
  const [kvPairs, setKvPairs] = useState<{ key: string; value: string }[]>([]);
  const [currKey, setCurrKey] = useState("");
  const [currValue, setCurrValue] = useState("");

  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const loadJobs = async () => {
    const data = await fetchJobsFiltered(statusFilter, priorityFilter);
    setJobs(data);
  };

  useEffect(() => {
    loadJobs();
    const interval = setInterval(loadJobs, 4000);
    return () => clearInterval(interval);
  }, [statusFilter, priorityFilter]);

  // Add payload pair
  const addPair = () => {
    if (!currKey.trim() || !currValue.trim()) return;
    setKvPairs([...kvPairs, { key: currKey, value: currValue }]);
    setCurrKey("");
    setCurrValue("");
  };

  const removePair = (i: number) =>
    setKvPairs(kvPairs.filter((_, idx) => idx !== i));

  const handleCreate = async () => {
    if (!taskName) return alert("Task Name is required");

    const finalPairs = [...kvPairs];
    if (currKey && currValue) finalPairs.push({ key: currKey, value: currValue });

    const payloadObject = finalPairs.reduce((acc, pair) => {
      acc[pair.key] = pair.value;
      return acc;
    }, {} as Record<string, string>);

    await createJob({ taskName, priority, payload: payloadObject });

    setTaskName("");
    setKvPairs([]);
    setCurrKey("");
    setCurrValue("");
    loadJobs();
  };

  const handleRun = async (id: number) => {
    await runJob(id);
    loadJobs();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this job?")) return;
    await deleteJob(id);
    loadJobs();
  };

  const renderPayload = (jsonString: string) => {
    try {
      const obj = JSON.parse(jsonString || "{}");
      const entries = Object.entries(obj);
      if (!entries.length)
        return <span className="text-gray-400 text-xs italic">No data</span>;

      return (
        <div className="flex flex-wrap gap-1">
          {entries.map(([key, val], i) => (
            <span
              key={i}
              className="px-2 py-0.5 text-xs rounded bg-slate-100 border border-slate-200"
            >
              <span className="opacity-60">{key}:</span> {String(val)}
            </span>
          ))}
        </div>
      );
    } catch {
      return <span className="text-red-500 text-xs">Bad JSON</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-slate-900 tracking-tight">
            Job Scheduler & Automation
          </h1>
          <p className="text-slate-500 text-base">Manage and automate your scheduled tasks efficiently</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* ================= LEFT PANEL: CREATE ================= */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 h-fit sticky top-8">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3 text-slate-900">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Plus className="text-blue-600" size={22} />
              </div>
              Create Job
            </h2>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-2">
                  Task Name
                </label>
                <input
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="e.g., Generate Invoice"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-2">
                  Priority Level
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-3">
                  Payload Data
                </label>

                <div className="flex flex-col gap-2">
                  <input
                    value={currKey}
                    onChange={(e) => setCurrKey(e.target.value)}
                    placeholder="Key"
                    className="px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
                  />
                  <input
                    value={currValue}
                    onChange={(e) => setCurrValue(e.target.value)}
                    placeholder="Value"
                    className="px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
                  />

                  <button
                    onClick={addPair}
                    className="py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition"
                  >
                    + Add Pair
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 my-4 border border-dashed border-slate-300 p-3 rounded-lg bg-slate-50">
                  {kvPairs.length === 0 && (
                    <span className="text-xs text-slate-400">No payload pairs added</span>
                  )}
                  {kvPairs.map((pair, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-full text-xs font-medium text-slate-700 shadow-sm"
                    >
                      <span className="text-slate-500">{pair.key}:</span>
                      <span className="text-slate-900">{pair.value}</span>
                      <button 
                        onClick={() => removePair(i)}
                        className="ml-1 text-slate-400 hover:text-red-500 transition"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCreate}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition shadow-md hover:shadow-lg"
              >
                Create Job
              </button>
            </div>
          </div>

          {/* ================= RIGHT PANEL ================= */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium transition"
                  >
                    <option value="">📊 All Status</option>
                    <option value="pending">⏳ Pending</option>
                    <option value="running">▶️ Running</option>
                    <option value="completed">✅ Completed</option>
                  </select>

                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium transition"
                  >
                    <option value="">🎯 All Priority</option>
                    <option value="Low">🟢 Low</option>
                    <option value="Medium">🟡 Medium</option>
                    <option value="High">🔴 High</option>
                  </select>
                </div>

                <button 
                  onClick={loadJobs} 
                  className="px-4 py-2.5 text-blue-600 hover:text-blue-700 font-semibold transition hover:bg-blue-50 rounded-lg"
                >
                  🔄 Refresh
                </button>
              </div>
            </div>

            {/* Job Table */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
              <table className="w-full border-collapse text-left">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-sm font-bold text-slate-900">Task</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-900">Priority</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-900">Payload</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-900">Status</th>
                    <th className="px-6 py-4 text-sm font-bold text-right text-slate-900">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {jobs.map((job) => (
                    <tr
                      key={job.id}
                      onClick={() => router.push(`/jobs/${job.id}`)}
                      className="hover:bg-blue-50 cursor-pointer transition"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{job.taskName}</div>
                        <div className="text-xs text-slate-400 mt-1">
                          ID: #{job.id}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1.5 text-xs rounded-full font-semibold inline-block
                            ${
                              job.priority === "High"
                                ? "bg-red-100 text-red-700 border border-red-200"
                                : job.priority === "Medium"
                                ? "bg-amber-100 text-amber-700 border border-amber-200"
                                : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            }`}
                        >
                          {job.priority}
                        </span>
                      </td>

                      <td className="px-6 py-4">{renderPayload(job.payload)}</td>

                      <td className="px-6 py-4">
                        {job.status === "completed" && (
                          <span className="text-emerald-600 text-sm flex items-center gap-2 font-medium">
                            <CheckCircle size={16} className="text-emerald-500" /> Completed
                          </span>
                        )}
                        {job.status === "running" && (
                          <span className="text-blue-600 text-sm flex items-center gap-2 font-medium">
                            <Loader2 size={16} className="animate-spin text-blue-500" /> Running
                          </span>
                        )}
                        {job.status === "pending" && (
                          <span className="text-slate-500 text-sm flex items-center gap-2 font-medium">
                            <Clock size={16} className="text-slate-400" /> Pending
                          </span>
                        )}
                      </td>

                      <td
                        className="px-6 py-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-end gap-2">
                          {job.status === "pending" && (
                            <button
                              onClick={() => handleRun(job.id)}
                              className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition shadow-md hover:shadow-lg"
                            >
                              <Play size={14} />
                              Run
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(job.id)}
                            className="text-slate-400 hover:text-red-600 p-2 rounded-lg transition hover:bg-red-50"
                            title="Delete job"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {jobs.length === 0 && (
                <div className="p-12 text-center">
                  <div className="text-4xl mb-3">📭</div>
                  <p className="text-slate-400 text-base">No jobs found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
