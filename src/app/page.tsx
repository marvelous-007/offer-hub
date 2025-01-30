import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar/Navbar";

const links = [
  { name: "Home", href: "/", isActive: true },
  { name: "My Chats", href: "/chats", isActive: false },
  { name: "Find workers", href: "/workers", isActive: false },
  { name: "My Account", href: "/account", isActive: false },
  { name: "FAQ", href: "/faq", isActive: false },
  { name: "Help", href: "/help", isActive: false },
];


const user = {
  name: "John Doe",
  profilePicture: "/profile.svg",
};

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="absolute top-4 right-4">
        <Link href="/login">
          <Button variant="outline">Login</Button>
        </Link>
      </div>
      <Navbar 
        logo="/logo.svg" 
        links={links} 
        user={user} 
      />
      <div className="text-center">
        <h1 className="text-3xl font-bold">Welcome to Offer Hub</h1>
        <p className="mt-4 text-gray-600">Explore, connect, and get things done!</p>
      </div>
    </div>
  );
}