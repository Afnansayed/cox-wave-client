'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';


const schema = z.object({
    email: z.string().email('Please enter a valid email address'),
});

export default function Newsletter() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(schema),
    });


    const onSubmit = async (data: z.infer<typeof schema>) => {
        setIsSubmitting(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/email/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result?.success === true) {
                setIsSuccess(true);
                toast.success(result.message);
                reset();
            } else {
                toast.error(result?.message || "Failed to subscribe");
            }
        } catch (err) {
            toast.error("Server connection failed!");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <section className="py-12 bg-background overflow-hidden">
            <div className="container-max">
                <div className="relative bg-neutral-900 dark:bg-card rounded-[3rem] p-8 md:p-16 overflow-hidden border border-white/5 shadow-2xl">

                    {/* Animated Background Glow */}
                    <div className="absolute -top-24 -right-24 h-64 w-64 bg-primary/20 blur-[100px] rounded-full" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.4em]">
                                <Send size={14} /> Join the Wave
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">
                                Don't Miss the <br /> <span className="italic text-primary">Next Party.</span>
                            </h2>
                            <p className="text-neutral-400 text-sm md:text-base font-medium leading-relaxed max-w-sm">
                                Get notified about exclusive BBQ nights and secret beach festivals in Cox's Bazar.
                            </p>
                        </div>

                        <div className="relative">
                            {isSuccess ? (
                                <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in duration-500">
                                    <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                                        <CheckCircle2 size={32} />
                                    </div>
                                    <p className="text-white font-black uppercase tracking-widest text-xs">You're on the list!</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <div className="relative group">
                                        <input
                                            {...register('email')}
                                            type="email"
                                            placeholder="Enter your email"
                                            className="w-full h-16 bg-white/5 border border-white/10 rounded-[2rem] px-6 text-white text-sm font-medium focus:outline-none focus:border-primary transition-all placeholder:text-neutral-500"
                                        />
                                        <button
                                            disabled={isSubmitting}
                                            type="submit"
                                            className="absolute right-2 top-2 h-12 px-6 bg-primary text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : "Subscribe"}
                                        </button>
                                    </div>
                                    {errors.email && (
                                        <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest ml-2">
                                            {errors.email.message as string}
                                        </p>
                                    )}
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}