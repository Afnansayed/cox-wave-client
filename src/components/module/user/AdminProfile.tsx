"use client";

import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  Edit3,
  Camera
} from "lucide-react";
import { IAdmin } from "@/types/account.types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const AdminProfile = ({ admin }: { admin: IAdmin }) => {
  
  // Robust date formatting
  const formatDate = (dateValue: string | Date | null) => {
    if (!dateValue) return "N/A";
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="w-full mx-auto ">
      {/* Profile Header Card */}
      <div className="relative mb-6 md:mb-8">
        {/* Decorative Header Background */}
        <div className="h-24 w-full bg-slate-900 rounded-t-[1.5rem] md:rounded-t-[2rem]" />
        
        <div className="bg-white rounded-b-[1.5rem] md:rounded-b-[2rem] border border-slate-100 px-4 pb-6 md:px-8 shadow-sm border-t-0">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 -mt-12">
            
            {/* Avatar Section */}
            <div className="relative group">
              <div className="h-24 w-24 md:h-28 md:w-28 rounded-[2rem] border-4 border-white bg-slate-100 overflow-hidden shadow-md">
                {admin.profile_picture ? (
                  <img 
                    src={admin.profile_picture} 
                    alt={admin.name} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-slate-400">
                    <User size={40} />
                  </div>
                )}
              </div>
              <button className="absolute bottom-1 right-1 p-2 bg-primary text-white rounded-xl border-2 border-white shadow-sm hover:scale-110 transition-transform">
                <Camera size={14} />
              </button>
            </div>
            
            {/* Info Section */}
            <div className="flex-1 text-center md:text-left space-y-1 mb-2">
              <div className="flex flex-col md:flex-row items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold text-slate-900">{admin.name}</h1>
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider rounded-full border border-emerald-100 flex items-center gap-1">
                  <ShieldCheck size={10} /> Admin
                </span>
              </div>
              <p className="text-slate-500 text-sm flex items-center justify-center md:justify-start gap-2">
                <Mail size={14} /> {admin.email}
              </p>
            </div>

            {/* Actions */}
       <Link href="/admin-dashboard/account/update" className="w-full md:w-auto">
            <Button className="w-full md:w-auto rounded-xl h-11 md:h-10 bg-primary hover:bg-primary/90 text-white gap-2 px-6 mb-2">
              <Edit3 size={16} /> Edit Profile
            </Button>
       </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        
        {/* Left Side: Personal Information */}
        <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
          <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 p-5 md:p-8 shadow-sm space-y-6">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-50 pb-3">
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
              <LabelItem label="Full Name" icon={<User size={14} />} value={admin.name} />
              <LabelItem label="Email Address" icon={<Mail size={14} />} value={admin.email} />
              <LabelItem 
                label="Phone Number" 
                icon={<Phone size={14} />} 
                value={admin.phone_number ?? "Not provided"} 
              />
              <LabelItem 
                label="Location" 
                icon={<MapPin size={14} />} 
                value={admin.address ?? "Not provided"} 
              />
            </div>
          </div>
        </div>

        {/* Right Side: Account Metadata Sidebar */}
        <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
          <div className="bg-slate-900 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 text-white space-y-6 shadow-xl">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Account Security</h3>
            
            <div className="grid grid-cols-1 gap-4">
              {/* Responsive sub-grid for these items if desired, but stacked looks cleaner for security info */}
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-primary shrink-0">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Member Since</p>
                  <p className="text-sm font-medium">{formatDate(admin.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400 shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Last Updated</p>
                  <p className="text-sm font-medium">{formatDate(admin.updatedAt)}</p>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase px-1">Internal Reference</p>
                <div className="bg-white/5 rounded-xl p-4 flex flex-col gap-1 border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase">System User ID</span>
                  <code className="text-xs text-primary truncate break-all">{admin.user_id}</code>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-rose-50 rounded-[1.5rem] p-5 border border-rose-100 flex items-start gap-4">
            <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-rose-600 shrink-0 shadow-sm">
               <ShieldCheck size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">Security Policy</p>
              <p className="text-[11px] text-rose-600 leading-relaxed">
                Administrative access requires periodic password rotations and active 2FA. Report any unauthorized system changes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mobile-first helper component
const LabelItem = ({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) => (
  <div className="space-y-2">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
      {icon} {label}
    </p>
    <div className="text-sm font-semibold text-slate-700 bg-slate-50/50 p-4 rounded-xl border border-slate-100 transition-colors hover:bg-slate-50">
      {value}
    </div>
  </div>
);

export default AdminProfile;