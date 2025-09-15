// components/layout/Footer.tsx
export default function Footer() {
    return (<footer className="bg-blue-900 text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-gold">Services</a></li>
                            <li><a href="#" className="hover:text-gold">About</a></li>
                            <li><a href="#" className="hover:text-gold">News</a></li>
                            <li><a href="#" className="hover:text-gold">Contact</a></li>
                            <li><a href="#" className="hover:text-gold">How to Use</a></li>
                            <li><a href="#" className="hover:text-gold">FAQs</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Legal & Policy</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-gold">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-gold">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-gold">Accessibility Statement</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Government References</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-gold">NCDD Cambodia</a></li>
                            <li><a href="#" className="hover:text-gold">Ministry of Interior</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/20 mt-8 pt-8 text-center">
                    <p>© 2023 Cambodia Population Management System. All rights reserved.</p>
                </div>
            </div>
        </footer>);
}
