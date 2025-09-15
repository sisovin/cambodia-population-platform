// components/layout/Header.tsx
import { Button } from '@workspace/ui/components/button';
export default function Header() {
    return (<header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center">
                    <div className="text-2xl font-bold text-blue-900 mr-10">
                        ប្រព័ន្ធគ្រប់គ្រងប្រជាជន
                    </div>

                    <nav className="hidden md:flex space-x-8">
                        <a href="#" className="text-blue-900 hover:text-blue-700 font-medium">Home</a>
                        <a href="#" className="text-blue-900 hover:text-blue-700 font-medium">Services</a>
                        <a href="#" className="text-blue-900 hover:text-blue-700 font-medium">About</a>
                        <a href="#" className="text-blue-900 hover:text-blue-700 font-medium">News</a>
                        <a href="#" className="text-blue-900 hover:text-blue-700 font-medium">Contact</a>
                    </nav>
                </div>

                <div className="flex items-center space-x-4">
                    <Button variant="outline" className="border-blue-900 text-blue-900">
                        Login
                    </Button>
                    <Button className="bg-blue-900 hover:bg-blue-800">
                        Register
                    </Button>
                </div>
            </div>
        </header>);
}
