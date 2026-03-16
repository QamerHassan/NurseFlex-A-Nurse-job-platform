"use client";
import React, { useState } from 'react';
import { 
    Search, 
    Download, 
    Filter, 
    ArrowUpRight, 
    ArrowDownRight, 
    Users, 
    Activity, 
    DollarSign, 
    MapPin,
    ArrowUpDown,
    ExternalLink
} from 'lucide-react';
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";

// Mock data for all 50 US States
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
    { id: 50, state: 'Wyoming', code: 'WY', total: 5500, vacancies: 200, avgSalary: 79140, trend: 'stable' }
];

export default function NurseStatsPage() {
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState('total');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const filteredData = US_NURSE_STATS
        .filter(item => item.state.toLowerCase().includes(search.toLowerCase()) || item.code.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            const factor = sortOrder === 'asc' ? 1 : -1;
            return ((a as any)[sortField] > (b as any)[sortField] ? 1 : -1) * factor;
        });

    const toggleSort = (field: string) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight italic uppercase">USA Nurse Census</h1>
                    <p className="text-sm text-slate-500 font-medium">State-wise distribution and workforce statistics.</p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm grow md:w-80 transition-all focus-within:ring-2 focus-within:ring-pink-500/10 focus-within:border-pink-500/30">
                        <Search className="text-slate-400" size={18} />
                        <Input 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search states..." 
                            className="h-10 border-none focus-visible:ring-0 font-medium text-sm bg-transparent placeholder:text-slate-400 p-0" 
                        />
                    </div>
                    <Button className="h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 rounded-xl transition-all shadow-sm flex items-center gap-2 group whitespace-nowrap">
                        <Download size={18} /> Export <span className="hidden sm:inline">CSV</span>
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-[2rem] overflow-hidden">
                    <CardContent className="p-8 flex items-center gap-6">
                        <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-[#ec4899] shrink-0">
                            <Users size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Total US Registered Nurses</p>
                            <h3 className="text-3xl font-black text-slate-900 leading-none tracking-tight">3.2M+</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-[2rem] overflow-hidden">
                    <CardContent className="p-8 flex items-center gap-6">
                        <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shrink-0">
                            <Activity size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Active Postings</p>
                            <h3 className="text-3xl font-black text-slate-900 leading-none tracking-tight">184.2K</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-[2rem] overflow-hidden">
                    <CardContent className="p-8 flex items-center gap-6">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                            <DollarSign size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Avg National Salary</p>
                            <h3 className="text-3xl font-black text-slate-900 leading-none tracking-tight">$86,070</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Table Section */}
            <Card className="border-none shadow-[0_20px_50px_rgb(0,0,0,0.06)] bg-white rounded-[2.5rem] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100">State / Region</th>
                                <th onClick={() => toggleSort('total')} className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100 cursor-pointer hover:text-pink-600 transition-colors">
                                    <div className="flex items-center gap-2">Total Nurses <ArrowUpDown size={12} /></div>
                                </th>
                                <th onClick={() => toggleSort('vacancies')} className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100 cursor-pointer hover:text-pink-600 transition-colors">
                                    <div className="flex items-center gap-2">Active Vacancies <ArrowUpDown size={12} /></div>
                                </th>
                                <th onClick={() => toggleSort('avgSalary')} className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100 cursor-pointer hover:text-pink-600 transition-colors">
                                    <div className="flex items-center gap-2">Avg Annual Salary <ArrowUpDown size={12} /></div>
                                </th>
                                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100">Trend</th>
                                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredData.map((item) => (
                                <tr key={item.id} className="group hover:bg-slate-50/70 transition-colors">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400 text-xs">
                                                {item.code}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 tracking-tight">{item.state}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">United States</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className="font-bold text-slate-700">{item.total.toLocaleString()}</span>
                                    </td>
                                    <td className="p-6">
                                        <Badge className="bg-pink-50 text-[#ec4899] border-none font-black text-[9px] uppercase tracking-wider px-2 py-1 shadow-none">
                                            {item.vacancies.toLocaleString()} OPEN
                                        </Badge>
                                    </td>
                                    <td className="p-6">
                                        <span className="font-black text-slate-900">${item.avgSalary.toLocaleString()}</span>
                                    </td>
                                    <td className="p-6">
                                        {item.trend === 'up' && (
                                            <div className="flex items-center gap-1.5 text-green-500 font-bold text-[10px] uppercase tracking-widest leading-none">
                                                <ArrowUpRight size={14} /> Growing
                                            </div>
                                        )}
                                        {item.trend === 'down' && (
                                            <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase tracking-widest leading-none">
                                                <ArrowDownRight size={14} /> Stable
                                            </div>
                                        )}
                                        {item.trend === 'stable' && (
                                            <div className="flex items-center gap-1.5 text-blue-400 font-bold text-[10px] uppercase tracking-widest leading-none">
                                                <Activity size={14} /> Balance
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-6 text-right">
                                        <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-[#ec4899] hover:bg-pink-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                                            <ExternalLink size={18} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {filteredData.length === 0 && (
                    <div className="p-20 text-center space-y-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-200">
                             <MapPin size={32} />
                        </div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic">No matching states found</p>
                    </div>
                )}

                <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Source: US Bureau of Labor Statistics (Mock)</p>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest rounded-lg border-slate-200 text-slate-500">Prev</Button>
                        <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest rounded-lg border-slate-200 text-slate-500">Next</Button>
                    </div>
                </div>
            </Card>

            <footer className="pt-10 text-center">
                <p className="text-[10px] font-bold text-slate-200 uppercase tracking-widest italic">NurseFlex Data Engine v1.0.4</p>
            </footer>
        </div>
    );
}
