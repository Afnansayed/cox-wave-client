import { Button } from "@/components/ui/button";
import Link from "next/link";


const FinalCta = () => {
    return (
        <section className="py-12 bg-white relative overflow-hidden">
            <div className="container-max px-6">
                <div className="relative bg-neutral-50 rounded-[3rem] p-12  text-center space-y-6 overflow-hidden shadow-sm border border-neutral-100">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -z-10 blur-3xl" />
                    <div className="space-y-4 relative z-10">
                        <h2 className="text-3xl md:text-5xl font-black text-neutral-900 tracking-tighter leading-tight">
                            Ready to Experience <br /> the <span className="text-primary italic">Next Wave?</span>
                        </h2>
                        <p className="text-base md:text-lg text-neutral-500 font-medium leading-relaxed max-w-2xl mx-auto">
                            Whether you're looking for an adventure or want to host one, Cox Wave is your definitive gateway to Cox's Bazar.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                        <Link href="/event" className="w-full sm:w-auto">
                            <Button className="w-full bg-primary hover:bg-primary-dark text-white h-12 px-10 rounded-full font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 transition-all">
                                Explore Experiences
                            </Button>
                        </Link>
                        <Link href="/contact" className="w-full sm:w-auto">
                            <Button variant="outline" className="w-full h-12 px-10 rounded-full border-neutral-200 text-neutral-700 hover:bg-neutral-50 font-black text-sm uppercase tracking-widest transition-all">
                                Contact Support
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FinalCta;