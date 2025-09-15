// components/NewsSection.tsx
import { Card, CardContent, CardFooter } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
const newsItems = [
    {
        title: "New Online Registration System Launch",
        date: "November 15, 2023",
        excerpt: "The Ministry has launched a new online registration portal to serve citizens more efficiently.",
    },
    {
        title: "Mobile Registration Units Visiting Rural Areas",
        date: "October 28, 2023",
        excerpt: "Mobile registration teams will be visiting remote provinces throughout December.",
    },
    {
        title: "Updated Family Book Regulations",
        date: "September 5, 2023",
        excerpt: "Important changes to family book application process now in effect.",
    },
];
export default function NewsSection() {
    return (<section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-4 text-blue-900">
                    News & Announcements
                </h2>
                <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                    Stay updated with the latest news and important announcements from the
                    Population Management System
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {newsItems.map((item, index) => (<Card key={index} className="hover:shadow-lg transition-shadow duration-300 h-full">
                            <CardContent className="p-6">
                                <div className="text-sm text-gray-500 mb-2">{item.date}</div>
                                <h3 className="font-bold text-lg text-blue-900 mb-3">{item.title}</h3>
                                <p className="text-gray-600">{item.excerpt}</p>
                            </CardContent>
                            <CardFooter>
                                <Button variant="link" className="p-0 text-blue-900">
                                    Read More →
                                </Button>
                            </CardFooter>
                        </Card>))}
                </div>

                <div className="text-center mt-10">
                    <Button variant="outline" className="border-blue-900 text-blue-900">
                        View All News
                    </Button>
                </div>
            </div>
        </section>);
}
