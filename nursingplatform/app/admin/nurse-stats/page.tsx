"use client";
import React, { useState } from 'react';
import {
    Search, Download, ArrowUpRight,
    ArrowDownRight, Users, Activity,
    DollarSign, MapPin, ArrowUpDown, ExternalLink
} from 'lucide-react';
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";

// ── Data ──────────────────────────────────────────────────────────────────────
const US_NURSE_STATS = [
    { id: 1, state: 'California', code: 'CA', total: 325400, vacancies: 12450, avgSalary: 133340, trend: 'up' },
    { id: 2, state: 'Texas', code: 'TX', total: 231000, vacancies: 15200, avgSalary: 84320, trend: 'up' },
    { id: 3, state: 'New York', code: 'NY', total: 188300, vacancies: 9800, avgSalary: 100130, trend: 'down' },
    { id: 4, state: 'Florida', code: 'FL', total: 197000, vacancies: 11200, avgSalary: 79910, trend: 'up' },
    { id: 5, state: 'Pennsylvania', code: 'PA', total: 146000, vacancies: 6500, avgSalary: 82340, trend: 'stable' },
    { id: 6, state: 'Illinois', code: 'IL', total: 129000, vacancies: 5800, avgSalary: 82220, trend: 'up' },
    { id: 7, state: 'Ohio', code: 'OH', total: 128000, vacancies: 7100, avgSalary: 78450, trend: 'down' },
    { id: 8, state: 'Georgia', code: 'GA', total: 92000, vacancies: 6200, avgSalary: 85340, trend: 'up' },
    { id: 9, state: 'North Carolina', code: 'NC', total: 104000, vacancies: 5400, avgSalary: 77420, trend: 'stable' },
    { id: 10, state: 'Michigan', code: 'MI', total: 102000, vacancies: 4900, avgSalary: 80650, trend: 'down' },
    { id: 11, state: 'New Jersey', code: 'NJ', total: 82000, vacancies: 3400, avgSalary: 96670, trend: 'up' },
    { id: 12, state: 'Virginia', code: 'VA', total: 78000, vacancies: 4100, avgSalary: 81860, trend: 'up' },
    { id: 13, state: 'Washington', code: 'WA', total: 65000, vacancies: 3800, avgSalary: 101670, trend: 'up' },
    { id: 14, state: 'Arizona', code: 'AZ', total: 62000, vacancies: 4500, avgSalary: 81600, trend: 'up' },
    { id: 15, state: 'Massachusetts', code: 'MA', total: 91000, vacancies: 3200, avgSalary: 104150, trend: 'down' },
    { id: 16, state: 'Tennessee', code: 'TN', total: 64000, vacancies: 5100, avgSalary: 72480, trend: 'up' },
    { id: 17, state: 'Indiana', code: 'IN', total: 72000, vacancies: 3900, avgSalary: 75230, trend: 'stable' },
    { id: 18, state: 'Missouri', code: 'MO', total: 73000, vacancies: 4200, avgSalary: 71860, trend: 'down' },
    { id: 19, state: 'Maryland', code: 'MD', total: 54000, vacancies: 2800, avgSalary: 87990, trend: 'up' },
    { id: 20, state: 'Wisconsin', code: 'WI', total: 61000, vacancies: 2500, avgSalary: 81420, trend: 'stable' },
    { id: 21, state: 'Colorado', code: 'CO', total: 52000, vacancies: 3100, avgSalary: 86590, trend: 'up' },
    { id: 22, state: 'Minnesota', code: 'MN', total: 63000, vacancies: 2200, avgSalary: 88780, trend: 'down' },
    { id: 23, state: 'South Carolina', code: 'SC', total: 48000, vacancies: 3600, avgSalary: 74330, trend: 'up' },
    { id: 24, state: 'Alabama', code: 'AL', total: 55000, vacancies: 2900, avgSalary: 67220, trend: 'stable' },
    { id: 25, state: 'Louisiana', code: 'LA', total: 47000, vacancies: 3200, avgSalary: 70380, trend: 'down' },
    { id: 26, state: 'Kentucky', code: 'KY', total: 51000, vacancies: 2800, avgSalary: 73220, trend: 'up' },
    { id: 27, state: 'Oregon', code: 'OR', total: 39000, vacancies: 2100, avgSalary: 106610, trend: 'up' },
    { id: 28, state: 'Oklahoma', code: 'OK', total: 34000, vacancies: 2400, avgSalary: 73230, trend: 'stable' },
    { id: 29, state: 'Connecticut', code: 'CT', total: 36000, vacancies: 1500, avgSalary: 94260, trend: 'down' },
    { id: 30, state: 'Utah', code: 'UT', total: 25000, vacancies: 1900, avgSalary: 76400, trend: 'up' },
    { id: 31, state: 'Nevada', code: 'NV', total: 24000, vacancies: 1800, avgSalary: 96310, trend: 'up' },
    { id: 32, state: 'Arkansas', code: 'AR', total: 28000, vacancies: 1700, avgSalary: 66530, trend: 'stable' },
    { id: 33, state: 'Mississippi', code: 'MS', total: 31000, vacancies: 2100, avgSalary: 63340, trend: 'down' },
    { id: 34, state: 'Kansas', code: 'KS', total: 32000, vacancies: 1400, avgSalary: 71220, trend: 'up' },
    { id: 35, state: 'Iowa', code: 'IA', total: 35000, vacancies: 1200, avgSalary: 69340, trend: 'stable' },
    { id: 36, state: 'New Mexico', code: 'NM', total: 18000, vacancies: 1600, avgSalary: 83220, trend: 'up' },
    { id: 37, state: 'Nebraska', code: 'NE', total: 22000, vacancies: 1100, avgSalary: 74210, trend: 'down' },
    { id: 38, state: 'Idaho', code: 'ID', total: 15000, vacancies: 1300, avgSalary: 78530, trend: 'up' },
    { id: 39, state: 'West Virginia', code: 'WV', total: 21000, vacancies: 1900, avgSalary: 70220, trend: 'stable' },
    { id: 40, state: 'Hawaii', code: 'HI', total: 12000, vacancies: 800, avgSalary: 113220, trend: 'up' },
    { id: 41, state: 'New Hampshire', code: 'NH', total: 14000, vacancies: 600, avgSalary: 83420, trend: 'down' },
    { id: 42, state: 'Maine', code: 'ME', total: 15000, vacancies: 700, avgSalary: 77410, trend: 'stable' },
    { id: 43, state: 'Montana', code: 'MT', total: 11000, vacancies: 900, avgSalary: 79220, trend: 'up' },
    { id: 44, state: 'Rhode Island', code: 'RI', total: 12000, vacancies: 500, avgSalary: 85330, trend: 'up' },
    { id: 45, state: 'Delaware', code: 'DE', total: 11000, vacancies: 600, avgSalary: 85020, trend: 'stable' },
    { id: 46, state: 'South Dakota', code: 'SD', total: 13000, vacancies: 400, avgSalary: 64500, trend: 'down' },
    { id: 47, state: 'North Dakota', code: 'ND', total: 10000, vacancies: 300, avgSalary: 73540, trend: 'stable' },
    { id: 48, state: 'Alaska', code: 'AK', total: 6000, vacancies: 400, avgSalary: 103310, trend: 'up' },
    { id: 49, state: 'Vermont', code: 'VT', total: 7000, vacancies: 300, avgSalary: 79540, trend: 'down' },
    { id: 50, state: 'Wyoming', code: 'WY', total: 5500, vacancies: 200, avgSalary: 79140, trend: 'stable' },
];

const PAGE_SIZE = 15;

export default function NurseStatsPage() {
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState('total');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [page, setPage] = useState(1);

    // ── Filter + Sort ─────────────────────────────────────────────────────────
    const filtered = US_NURSE_STATS
        .filter(d =>
            d.state.toLowerCase().includes(search.toLowerCase()) ||
            d.code.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            const factor = sortOrder === 'asc' ? 1 : -1;
            return ((a as any)[sortField] > (b as any)[sortField] ? 1 : -1) * factor;
        });

    // ── Pagination ────────────────────────────────────────────────────────────
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const toggleSort = (field: string) => {
        if (sortField === field) setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
        else { setSortField(field); setSortOrder('desc'); }
        setPage(1);
    };

    // ── Export CSV ────────────────────────────────────────────────────────────
    const handleExport = () => {
        const header = 'State,Code,Total Nurses,Open Vacancies,Avg Salary,Trend';
        const rows = filtered.map(d =>
            `"${d.state}","${d.code}",${d.total},${d.vacancies},${d.avgSalary},"${d.trend}"`
        );
        const csv = [header, ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'usa_nurse_stats.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    // ── Trend helpers ─────────────────────────────────────────────────────────
    const trendLabel: Record<string, { label: string; color: string; Icon: any }> = {
        up: { label: 'Growing', color: 'text-green-500', Icon: ArrowUpRight },
        down: { label: 'Declining', color: 'text-slate-400', Icon: ArrowDownRight },
        stable: { label: 'Stable', color: 'text-blue-400', Icon: Activity },
    };

    return (
        <div className="space-y-8 font-sans">

            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-medium text-slate-900 tracking-tight">US Nurse Statistics</h1>
                    <p className="text-sm text-slate-400 font-medium mt-0.5">
                        Nurse count, open jobs, and salary by state.
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* Search */}
                    <div className="flex items-center gap-2 bg-white px-4 h-11 rounded-xl border border-slate-200 shadow-sm flex-1 md:w-72 focus-within:ring-2 focus-within:ring-blue-500/10 focus-within:border-blue-500/30 transition-all">
                        <Search size={16} className="text-slate-400 shrink-0" />
                        <Input
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                            placeholder="Search state or code..."
                            className="h-full border-none focus-visible:ring-0 text-sm font-medium bg-transparent p-0 placeholder:text-slate-400"
                        />
                    </div>
                    {/* Export */}
                    <button
                        onClick={handleExport}
                        className="h-11 px-5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-xl flex items-center gap-2 transition-all shrink-0"
                    >
                        <Download size={16} /> Export CSV
                    </button>
                </div>
            </div>

            {/* ── KPI Cards ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                    { icon: Users, bg: 'bg-blue-50', color: 'text-blue-600', label: 'Registered Nurses', value: '3.2M+' },
                    { icon: Activity, bg: 'bg-green-50', color: 'text-green-600', label: 'Open Job Postings', value: '184.2K' },
                    { icon: DollarSign, bg: 'bg-blue-50', color: 'text-blue-600', label: 'Avg National Salary', value: '$86,070' },
                ].map((kpi, i) => (
                    <Card key={i} className="border border-slate-100 shadow-sm bg-white rounded-2xl">
                        <CardContent className="p-7 flex items-center gap-5">
                            <div className={`w-12 h-12 ${kpi.bg} rounded-xl flex items-center justify-center shrink-0`}>
                                <kpi.icon size={22} className={kpi.color} />
                            </div>
                            <div>
                                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{kpi.label}</p>
                                <p className="text-2xl font-semibold text-slate-900 leading-none mt-0.5">{kpi.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* ── Table ── */}
            <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">

                {/* Table header info */}
                <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-900">
                        Showing <span className="text-blue-600">{filtered.length}</span> states
                        {search && <span className="text-slate-400 font-medium"> for "{search}"</span>}
                    </p>
                    <p className="text-xs font-medium text-slate-400">
                        Page {page} of {totalPages || 1}
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/60 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">State</th>
                                <th
                                    onClick={() => toggleSort('total')}
                                    className="px-6 py-4 text-[10px] font-semibold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors select-none"
                                >
                                    <div className="flex items-center gap-1.5">
                                        Total Nurses
                                        <ArrowUpDown size={11} className={sortField === 'total' ? 'text-blue-600' : ''} />
                                    </div>
                                </th>
                                <th
                                    onClick={() => toggleSort('vacancies')}
                                    className="px-6 py-4 text-[10px] font-semibold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors select-none"
                                >
                                    <div className="flex items-center gap-1.5">
                                        Open Jobs
                                        <ArrowUpDown size={11} className={sortField === 'vacancies' ? 'text-blue-600' : ''} />
                                    </div>
                                </th>
                                <th
                                    onClick={() => toggleSort('avgSalary')}
                                    className="px-6 py-4 text-[10px] font-semibold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors select-none"
                                >
                                    <div className="flex items-center gap-1.5">
                                        Avg Salary
                                        <ArrowUpDown size={11} className={sortField === 'avgSalary' ? 'text-blue-600' : ''} />
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Trend</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {pageData.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center">
                                                <MapPin size={24} className="text-slate-300" />
                                            </div>
                                            <p className="text-sm font-medium text-slate-400">No states found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : pageData.map(item => {
                                const t = trendLabel[item.trend];
                                return (
                                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors group">

                                        {/* State */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center font-semibold text-slate-500 text-xs shrink-0">
                                                    {item.code}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900 text-sm">{item.state}</p>
                                                    <p className="text-[10px] text-slate-400 font-medium">United States</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Total */}
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-slate-800 text-sm">{item.total.toLocaleString()}</span>
                                        </td>

                                        {/* Vacancies */}
                                        <td className="px-6 py-4">
                                            <Badge className="bg-green-50 text-green-700 border-none font-medium text-[10px] px-2.5 py-1">
                                                {item.vacancies.toLocaleString()} open
                                            </Badge>
                                        </td>

                                        {/* Salary */}
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-slate-900 text-sm">${item.avgSalary.toLocaleString()}</span>
                                        </td>

                                        {/* Trend */}
                                        <td className="px-6 py-4">
                                            <div className={`flex items-center gap-1.5 font-medium text-[11px] uppercase tracking-wider ${t.color}`}>
                                                <t.Icon size={13} />
                                                {t.label}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* ── Pagination ── */}
                <div className="px-6 py-4 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between">
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                        Source: US Bureau of Labor Statistics
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="h-8 px-4 rounded-lg border border-slate-200 text-[10px] font-medium text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            Prev
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                            .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                                if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push('...');
                                acc.push(p);
                                return acc;
                            }, [])
                            .map((p, i) => p === '...'
                                ? <span key={`dot-${i}`} className="text-slate-300 text-xs px-1">…</span>
                                : (
                                    <button key={p} onClick={() => setPage(p as number)}
                                        className={`h-8 w-8 rounded-lg text-[10px] font-semibold transition-all ${page === p ? 'bg-blue-600 text-white' : 'border border-slate-200 text-slate-500 hover:bg-slate-100'}`}>
                                        {p}
                                    </button>
                                )
                            )
                        }
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages || totalPages === 0}
                            className="h-8 px-4 rounded-lg border border-slate-200 text-[10px] font-medium text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </Card>

            <p className="text-center text-[10px] font-medium text-slate-300 uppercase tracking-widest pb-4">
                NurseFlex · US Nursing Data
            </p>
        </div>
    );
}