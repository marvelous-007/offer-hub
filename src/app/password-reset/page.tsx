import ResetPasswordPage from './ResetPasswordPage';
import { User } from "lucide-react"
import { Button } from "@/components/ui/button"

// Simple Header component defined inline
function SimpleHeader() {
    return (
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <a href="/" className="flex items-center">
                <span className="text-xl font-bold text-[#15949C]">Offer Hub</span>
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="text-[#002333]">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>
    )
  }


export default function Page() {
  return (
    <div className="min-h-screen bg-white">
        <SimpleHeader/>
        <ResetPasswordPage />;
    </div>
  );
}
