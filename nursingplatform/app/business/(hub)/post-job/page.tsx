"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { 
    Zap, ArrowRight, ClipboardList, Clock, 
    DollarSign, MapPin, Building2, AlertCircle,
    CheckCircle2, Loader2, Info
} from 'lucide-react';

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

export default function PostJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    department: 'Intensive Care Unit (ICU)',
    salary: '',
    date: '',
    shiftType: 'Morning (7am - 3pm)',
    description: ''
  });

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const jobData = {
        title: formData.title,
        description: `${formData.department} - ${formData.shiftType}\n\n${formData.description}`,
        salary: formData.salary,
        type: formData.shiftType,
      };

      await api.post('/jobs', jobData);
      router.push('/business/dashboard');
    } catch (err: any) {
      console.error("Post Job Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <header className="text-center md:text-left space-y-4">
        <div className="flex items-center gap-4 justify-center md:justify-start">
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Post a Job</h1>
        </div>
        <p className="text-slate-500 font-medium text-sm">Fill in the details below to find the best healthcare professionals.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-10">
        <Card className="border-none shadow-2xl shadow-blue-50 bg-white rounded-[3rem] overflow-hidden">
            <CardHeader className="p-10 pb-0">
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-10 h-10 bg-pink-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-pink-100">
                        <Info size={20} />
                    </div>
                    <CardTitle className="text-xl font-bold tracking-tight">Job Details</CardTitle>
                </div>
                <CardDescription className="text-slate-500 font-medium text-xs ps-14">Provide basic information about the position</CardDescription>
            </CardHeader>
            <CardContent className="p-10 pt-10 space-y-10">
                <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <Label className="text-xs font-bold text-slate-600 ml-1">Job Title</Label>
                        <Input 
                            placeholder="e.g. Lead ICU Specialist" 
                            className="h-14 rounded-2xl bg-slate-50/50 border-slate-100 font-bold text-slate-900 focus-visible:ring-0 focus-visible:bg-white transition-all text-base"
                            required
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                        />
                    </div>
                    <div className="space-y-4">
                        <Label className="text-xs font-bold text-slate-600 ml-1">Department</Label>
                        <Select value={formData.department} onValueChange={(val) => handleChange('department', val)}>
                            <SelectTrigger className="h-14 rounded-2xl bg-slate-50/50 border-slate-100 font-bold text-slate-900 focus:ring-0">
                                <SelectValue placeholder="Select Department" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                                <SelectItem value="Emergency Room (ER)" className="font-bold">Emergency Room (ER)</SelectItem>
                                <SelectItem value="Intensive Care Unit (ICU)" className="font-bold">Intensive Care Unit (ICU)</SelectItem>
                                <SelectItem value="Pediatrics" className="font-bold">Pediatrics</SelectItem>
                                <SelectItem value="General Ward" className="font-bold">General Ward</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 pt-6 border-t border-slate-50">
                    <div className="space-y-4">
                        <Label className="text-xs font-bold text-slate-600 ml-1">Salary / Pay Rate ($/hr)</Label>
                        <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <Input 
                                placeholder="45.00" 
                                className="h-14 pl-10 rounded-2xl bg-slate-50/50 border-slate-100 font-bold text-slate-900 focus-visible:ring-0"
                                required
                                value={formData.salary}
                                onChange={(e) => handleChange('salary', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <Label className="text-xs font-bold text-slate-600 ml-1">Job Date</Label>
                        <Input 
                            type="date" 
                            className="h-14 rounded-2xl bg-slate-50/50 border-slate-100 font-bold text-slate-900 focus-visible:ring-0"
                            required
                            value={formData.date}
                            onChange={(e) => handleChange('date', e.target.value)}
                        />
                    </div>
                    <div className="space-y-4">
                        <Label className="text-xs font-bold text-slate-600 ml-1">Shift Type</Label>
                        <Select value={formData.shiftType} onValueChange={(val) => handleChange('shiftType', val)}>
                            <SelectTrigger className="h-14 rounded-2xl bg-slate-50/50 border-slate-100 font-bold text-slate-900 focus:ring-0">
                                <SelectValue placeholder="Select Shift" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                                <SelectItem value="Morning (7am - 3pm)" className="font-bold">Morning (7am - 3pm)</SelectItem>
                                <SelectItem value="Evening (3pm - 11pm)" className="font-bold">Evening (3pm - 11pm)</SelectItem>
                                <SelectItem value="Night (11pm - 7am)" className="font-bold">Night (11pm - 7am)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card className="border-none shadow-2xl shadow-blue-50 bg-white rounded-[3rem] overflow-hidden">
            <CardHeader className="p-10 pb-0">
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-10 h-10 bg-pink-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-pink-100">
                        <ClipboardList size={20} />
                    </div>
                    <CardTitle className="text-xl font-bold tracking-tight">Job Description</CardTitle>
                </div>
                <CardDescription className="text-slate-500 font-medium text-xs ps-14">Requirements and responsibilities for the candidate</CardDescription>
            </CardHeader>
            <CardContent className="p-10 pt-10">
                <div className="space-y-4">
                    <Label className="text-xs font-bold text-slate-600 ml-1">Description & Requirements</Label>
                    <Textarea 
                        placeholder="Detail specific professional requirements, business protocols, and anticipated responsibilities..." 
                        className="min-h-[200px] rounded-[2rem] bg-slate-50/50 border-slate-100 font-bold text-slate-900 focus-visible:ring-0 p-8 leading-relaxed resize-none transition-all focus:bg-white"
                        required
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                    />
                </div>
                
                <div className="mt-10 bg-amber-50 rounded-[2rem] p-8 border border-amber-100/50 flex items-start gap-6">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm shrink-0 border border-amber-50">
                        <Zap size={24} className="fill-amber-500" />
                    </div>
                    <div>
                        <p className="text-amber-900 font-bold text-sm tracking-tight">Job Posting Notice</p>
                        <p className="text-amber-700/80 text-xs font-medium mt-1 leading-relaxed">Publishing this job will make it visible to all verified nurses in the network. Please ensure all details are accurate before submitting.</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-10 bg-slate-900 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/5">
                <Button 
                    type="button" 
                    variant="ghost" 
                    className="h-10 text-slate-500 hover:text-red-500 font-bold text-xs"
                    onClick={() => router.back()}
                >
                    Cancel
                </Button>
                <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full md:w-auto h-16 px-12 rounded-2xl bg-[#ec4899] text-white hover:bg-[#db2777] font-bold text-lg shadow-2xl transition-all active:scale-[0.98]"
                >
                    {loading ? (
                        <div className="flex items-center gap-3">
                            <Loader2 className="animate-spin" size={20} /> Posting Job...
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            Post Job <ArrowRight size={20} />
                        </div>
                    )}
                </Button>
            </CardFooter>
        </Card>
      </form>
    </div>
  );
}