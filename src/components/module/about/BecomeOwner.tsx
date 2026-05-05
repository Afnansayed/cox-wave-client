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
        <section className="py-24 bg-card text-foreground relative overflow-hidden border-y border-border">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -z-10" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] -z-10" />
            <div className="container-max px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                <div className="lg:col-span-4 space-y-10">
                    <div className="space-y-6">
                        <div className="h-1.5 w-16 bg-secondary rounded-full" />
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9] text-foreground">
                            Become an <br /> <span className="text-secondary italic">Owner.</span>
                        </h2>
                        <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed max-w-sm">
                            List your luxury services or events and tap into an exclusive network of travelers globally.
                        </p>
                    </div>

                    <div className="space-y-6 pt-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Partner Privileges</h4>
                        <ul className="grid grid-cols-1 gap-4">
                            {['Zero Upfront Fees', 'Instant Global Payouts', 'Verified Traveler Network', '24/7 Dedicated Support'].map((perk, i) => (
                                <li key={i} className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-foreground">
                                    <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <CheckCircle2 className="w-4 h-4 text-primary" />
                                    </div>
                                    {perk}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="pt-6">
                        <Link href="/contact">
                            <Button className="bg-secondary hover:bg-secondary/90 text-white px-10 h-14 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-secondary/20 transition-all hover:scale-105 active:scale-95">
                                Join our network
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="lg:col-span-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-16">
                        {ownerSteps.map((step, index) => (
                            <div key={step.sub} className="relative group">
                                <span className="absolute -top-10 left-0 text-7xl font-black text-foreground/5 group-hover:text-primary/10 transition-all duration-500 select-none pointer-events-none">
                                    0{index + 1}
                                </span>
                                <div className="relative pt-4 space-y-5">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 flex items-center justify-center rounded-[1.25rem] bg-card border border-border text-primary shadow-sm transition-all duration-500 group-hover:border-primary group-hover:shadow-xl group-hover:shadow-primary/20 group-hover:-translate-y-1">
                                            {step.icon}
                                        </div>
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                                            {step.title}
                                        </h4>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl md:text-2xl font-black text-foreground tracking-tight">
                                            {step.sub}
                                        </h3>
                                        <p className="text-xs md:text-sm text-muted-foreground font-medium leading-relaxed max-w-[280px]">
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