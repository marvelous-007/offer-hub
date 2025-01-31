import Link from "next/link";
import Image from "next/image";

const navigation = [
  { name: "Home", href: "/" },
  { name: "My Chats", href: "/chats" },
  { name: "Find Workers", href: "/workers" },
  { name: "My Account", href: "/account" },
];

export function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-8">
          {/* Title and Logo */}
          <div className="w-full flex items-center justify-between">
            <div className="flex-1" /> {/* Left spacer */}
            <div className="flex-1 text-center">
              <h2 className="text-2xl font-bold relative inline-block">
                OFFER-HUB
                <div className="absolute -bottom-1 left-0 w-full h-[1px] bg-black" />
              </h2>
            </div>
            <div className="flex-1 flex justify-end">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-CJ3w1SGez3MVtepe7WWLOqA02fmE9O.svg"
                alt="Offer Hub Logo"
                width={40}
                height={40}
                priority
              />
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-6">
            <Link href="https://twitter.com/offerhub" aria-label="X (Twitter)">
              <Image
                src="/social-networks/x_icon.svg"
                alt="X (Twitter)"
                width={24}
                height={24}
                className="w-6 h-6 text-black hover:text-gray-700 transition-colors"
              />
            </Link>
            <Link href="https://t.me/offerhub" aria-label="Telegram">
              <Image
                src="/social-networks/telegramblack.svg"
                alt="Telegram"
                width={24}
                height={24}
                className="w-6 h-6 text-black hover:text-gray-700 transition-colors"
              />
            </Link>
            <Link href="https://github.com/OFFER-HUB/offer-hub" aria-label="GitHub">
              <Image
                src="/social-networks/github.svg"
                alt="GitHub"
                width={24}
                height={24}
                className="w-6 h-6 text-black hover:text-gray-700 transition-colors"
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}