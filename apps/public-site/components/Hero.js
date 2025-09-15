// components/Hero.tsx
import { Button } from "@workspace/ui/components/button";
export default function Hero() {
    return (<section className="relative w-full h-[80vh] min-h-[500px] flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-700 text-white">
            <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{
            backgroundImage: "url('/images/cambodia-hero-bg.jpg')",
        }}/>

            <div className="relative z-10 text-center max-w-4xl px-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                    ប្រព័ន្ធគ្រប់គ្រងប្រជាជនកម្ពុជា
                </h1>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-8">
                    Cambodia Population Management System
                </h2>
                <p className="text-xl mb-10 max-w-2xl mx-auto">
                    A modern, secure platform for citizen services and population management
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="bg-gold hover:bg-gold-dark text-blue-900 font-bold">
                        Register Now
                    </Button>
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                        Learn More
                    </Button>
                </div>
            </div>
        </section>);
}
