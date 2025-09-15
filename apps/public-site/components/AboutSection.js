// components/AboutSection.tsx
import { Button } from '@workspace/ui/components/button';
export default function AboutSection() {
    return (<section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    <div className="lg:w-1/2">
                        <h2 className="text-3xl font-bold text-blue-900 mb-6">
                            About the Platform
                        </h2>
                        <p className="text-gray-700 mb-4">
                            The Cambodia Population Management System is a government-initiated platform
                            designed to streamline citizen services and improve administrative efficiency
                            across the nation.
                        </p>
                        <p className="text-gray-700 mb-4">
                            Our mission is to provide accessible, secure, and efficient population
                            management services to all Cambodian citizens while maintaining the highest
                            standards of data protection and privacy.
                        </p>
                        <p className="text-gray-700 mb-8">
                            Developed in collaboration with the Ministry of Interior and NCDD Cambodia,
                            this platform represents a significant step forward in digital governance.
                        </p>
                        <Button className="bg-blue-900 hover:bg-blue-800">
                            Read More About Us
                        </Button>
                    </div>

                    <div className="lg:w-1/2">
                        <div className="bg-gray-100 rounded-lg p-6 h-80 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-6xl mb-4">📊</div>
                                <p className="text-gray-600">Platform Infographic</p>
                                <p className="text-sm text-gray-500">Visual representation of services and impact</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>);
}
