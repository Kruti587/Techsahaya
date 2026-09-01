import { useEffect, useState } from "react";
import { api } from "../services/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Map, AlertTriangle, Users, TrendingDown, FileX } from "lucide-react";

const stateData = [
  { name: "Karnataka", searches: 85000, failed: 52000, top_reason: "Missing Land Records" },
  { name: "Maharashtra", searches: 120000, failed: 48000, top_reason: "Income Exceeds Threshold" },
  { name: "Uttar Pradesh", searches: 150000, failed: 70000, top_reason: "Missing Caste Certificate" },
  { name: "Tamil Nadu", searches: 90000, failed: 35000, top_reason: "Missing Ration Card" },
  { name: "Bihar", searches: 110000, failed: 65000, top_reason: "Aadhaar Not Linked" },
];

const bottleneckData = [
  { name: "No Land Records", value: 35 },
  { name: "Income Exceeds", value: 25 },
  { name: "Aadhaar Issue", value: 20 },
  { name: "Missing Certs", value: 20 },
];

const COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6'];

export function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">National Welfare Heatmap</h1>
          <p className="mt-1 text-slate-600">Policy analytics & bottleneck detection for government officials.</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-xl bg-sahaya-green px-4 py-2 font-semibold text-white shadow">Export Report</button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 text-slate-500 mb-2"><Users size={20} /> Total Citizens Analyzed</div>
          <div className="text-4xl font-bold text-slate-800">5.2M</div>
          <div className="text-sm text-sahaya-green mt-2">+12% this month</div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 text-slate-500 mb-2"><TrendingDown size={20} /> Welfare Gap Rate</div>
          <div className="text-4xl font-bold text-slate-800">38%</div>
          <div className="text-sm text-red-500 mt-2">Citizens eligible but not receiving</div>
        </div>
        <div className="rounded-3xl bg-red-50 p-6 shadow-sm border border-red-100">
          <div className="flex items-center gap-3 text-red-700 mb-2"><FileX size={20} /> Primary Bottleneck</div>
          <div className="text-2xl font-bold text-red-900 leading-tight">Missing Land Records</div>
          <div className="text-sm text-red-700 mt-2">Blocks 2.1M applications</div>
        </div>
        <div className="rounded-3xl bg-emerald-50 p-6 shadow-sm border border-emerald-100">
          <div className="flex items-center gap-3 text-emerald-700 mb-2"><Map size={20} /> Highest Gap Region</div>
          <div className="text-3xl font-bold text-emerald-900">Karnataka</div>
          <div className="text-sm text-emerald-700 mt-2">Focused intervention needed</div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-6">State-by-State Eligibility Failures</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend />
                <Bar dataKey="searches" name="Total Applications" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                <Bar dataKey="failed" name="Failed Eligibility" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-6">Root Cause of Ineligibility (National)</h3>
          <div className="h-80 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bottleneckData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {bottleneckData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><AlertTriangle className="text-amber-500" /> AI Policy Insights</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
            <div className="font-bold text-amber-900">Drought Relief Blockage</div>
            <p className="mt-2 text-sm text-amber-800">52,000 farmers in Karnataka searched for drought relief but failed eligibility because they lack digitized land records. Suggesting automated RTC integration.</p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
            <div className="font-bold text-amber-900">Income Limit Outdated</div>
            <p className="mt-2 text-sm text-amber-800">48,000 citizens in Maharashtra were disqualified from housing schemes because their income slightly exceeds the ₹2.5L limit set in 2015.</p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
            <div className="font-bold text-amber-900">Aadhaar Seeding Failure</div>
            <p className="mt-2 text-sm text-amber-800">High failure rate (20%) across Bihar due to Aadhaar not being linked to rural bank accounts, preventing DBT transfers.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
