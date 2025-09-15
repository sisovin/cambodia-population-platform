// components/ContactSection.tsx
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Textarea } from '@workspace/ui/components/textarea';

export default function ContactSection() {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-4 text-blue-900">
                    Contact & Support
                </h2>
                <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                    Get in touch with our support team for assistance with any population management services
                </p>

                <div className="flex flex-col lg:flex-row gap-12">
                    <div className="lg:w-1/2">
                        <div className="bg-gray-100 rounded-lg p-6 h-80 flex items-center justify-center mb-6">
                            <div className="text-center">
                                <div className="text-6xl mb-4">🗺️</div>
                                <p className="text-gray-600">Interactive Map</p>
                                <p className="text-sm text-gray-500">Find your nearest registration office</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 border rounded-lg">
                                <h3 className="font-semibold text-blue-900 mb-2">Phone Support</h3>
                                <p className="text-gray-600">+855 23 123 4567</p>
                                <p className="text-sm text-gray-500">Mon-Fri, 8AM-5PM</p>
                            </div>

                            <div className="p-4 border rounded-lg">
                                <h3 className="font-semibold text-blue-900 mb-2">Email</h3>
                                <p className="text-gray-600">support@popmanagement.gov.kh</p>
                                <p className="text-sm text-gray-500">Response within 24 hours</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/2">
                        <form className="space-y-4">
                            <div>
                                <Input placeholder="Full Name" className="p-6" />
                            </div>
                            <div>
                                <Input type="email" placeholder="Email Address" className="p-6" />
                            </div>
                            <div>
                                <Input placeholder="Subject" className="p-6" />
                            </div>
                            <div>
                                <Textarea placeholder="Your Message" rows={5} className="p-6" />
                            </div>
                            <Button className="w-full bg-blue-900 hover:bg-blue-800 p-6">
                                Send Message
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}