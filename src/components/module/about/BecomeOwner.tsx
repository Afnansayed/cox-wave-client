import { Button } from "@/components/ui/button";
import { CheckCircle2, LayoutDashboard, PlusCircle, SearchCheck, TrendingUp } from "lucide-react";
import Link from "next/link";



const ownerSteps = [
    {
        title: 'Setup',
        sub: 'Create Account',
        desc: 'Request to admin for create account and after approved list your services or events.',
        icon: <PlusCircle className="w-5 h-5" />
    },
    {
        title: 'Verification',
        sub: 'Get Approved',
        desc: 'Our team verify your profile ,if it convinents admin will create a profile behalf of you and provide credentials.',
        icon: <SearchCheck className="w-5 h-5" />
    },
    {
        title: 'Management',
        sub: 'Track Growth',
        desc: 'After verified you can manage all the services and events.Manage bookings and analyze earnings in one intuitive panel.',
        icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
        title: 'Hospitality',
        sub: 'Host & Earn',
        desc: 'Focus on your guests while we handle the logistics and payments. You will get paid from our ecosystem.',
        icon: <TrendingUp className="w-5 h-5" />
    }
];
const BecomeOwner = () => {
    return (
        <section className="py-12 bg-neutral-900 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -z-10" />
            <div className="container-max px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-4 space-y-8">
                    <div className="space-y-4">
                        <div className="h-1 w-12 bg-secondary rounded-full" />
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight text-white">
                            Become an <br /> <span className="text-secondary italic">Owner.</span>
                        </h2>
                        <p className="text-sm md:text-base text-neutral-400 font-medium leading-relaxed max-w-xs">
                            List your luxury services or events and tap into an exclusive network of travelers.
                        </p>
                    </div>

                    <div className="space-y-4 pt-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-light">Partner Benefits</h4>
                        <ul className="space-y-3">
                            {['Zero Upfront Fees', 'Instant Payouts', 'Verified Network', 'Admin Support'].map((perk, i) => (
                                <li key={i} className="flex items-center gap-3 text-xs font-bold text-neutral-300">
                                    <CheckCircle2 className="w-4 h-4 text-primary" />
                                    {perk}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Link href="/contact">
                        <Button className="bg-secondary hover:bg-secondary-dark mt-6 text-white px-8 h-12 rounded-full font-black text-xs uppercase tracking-widest shadow-lg shadow-secondary/20 transition-all">
                            Join as Partner
                        </Button>
                    </Link>
                </div>

                <div className="lg:col-span-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
                        {ownerSteps.map((step, index) => (
                            <div key={step.sub} className="relative group">
                                <span className="absolute -top-6 left-0 text-5xl font-black text-white/5 group-hover:text-primary/10 transition-colors select-none pointer-events-none">
                                    0{index + 1}
                                </span>
                                <div className="relative pt-2 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-primary shadow-sm transition-all group-hover:border-primary/30 group-hover:shadow-lg group-hover:shadow-primary/10">
                                            {step.icon}
                                        </div>
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                                            {step.title}
                                        </h4>
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-lg md:text-xl font-black text-white tracking-tight">
                                            {step.sub}
                                        </h3>
                                        <p className="text-xs md:text-sm text-neutral-400 font-medium leading-relaxed max-w-[240px]">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default BecomeOwner;