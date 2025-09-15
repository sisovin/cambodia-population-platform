// components/QuickAccessTiles.tsx
import { Card, CardContent } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';

const services = [
    {
        title: "Birth Registration",
        khmerTitle: "ការចុះឈ្មោះកំណើត",
        description: "Register newborn citizens with our streamlined process",
        icon: "👶",
    },
    {
        title: "Family Book",
        khmerTitle: "សៀវភៅគ្រួសារ",
        description: "Manage family records and documentation",
        icon: "📘",
    },
    {
        title: "ID Services",
        khmerTitle: "សេវាអត្តសញ្ញាណ",
        description: "Apply for or renew identification documents",
        icon: "🪪",
    },
    {
        title: "Address Changes",
        khmerTitle: "ការផ្លាស់ប្តូរអាសយដ្ឋាន",
        description: "Update your residential information",
        icon: "🏠",
    },
];

export default function QuickAccessTiles() {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">
                    Quick Access Services
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow duration-300 h-full">
                            <CardContent className="p-6 flex flex-col items-center text-center h-full">
                                <div className="text-4xl mb-4">{service.icon}</div>
                                <h3 className="font-bold text-lg text-blue-900 mb-2">
                                    {service.khmerTitle}
                                </h3>
                                <h4 className="font-semibold text-md mb-3">{service.title}</h4>
                                <p className="text-gray-600 mb-4 flex-grow">{service.description}</p>
                                <Button variant="outline" className="w-full">
                                    Learn More
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}