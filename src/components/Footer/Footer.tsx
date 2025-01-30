"use client"

import Link from "next/link"
import { Github, MessageCircle, Twitter } from "lucide-react"
import { cn } from "@/lib/utils"

export interface FooterLink {
  label: string
  href: string
}

export interface SocialLink extends FooterLink {
  icon: "x" | "telegram" | "github"
}

export interface FooterSection {
  title: string
  links: FooterLink[]
}

export interface FooterProps {
  navigationLinks?: FooterLink[]
  sections?: FooterSection[]
  socialLinks?: SocialLink[]
  className?: string
}

const defaultNavigationLinks: FooterLink[] = [
  { label: "Home", href: "/" },
  { label: "My Chats", href: "/chats" },
  { label: "Find Workers", href: "/workers" },
  { label: "My Account", href: "/account" },
]

const defaultSections: FooterSection[] = [
  {
    title: "Platform",
    links: [
      { label: "Home", href: "/" },
      { label: "My Chats", href: "/chats" },
      { label: "Find Workers", href: "/workers" },
      { label: "My Account", href: "/account" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Help Center", href: "/help-center" },
      { label: "Documentation", href: "/docs" },
      { label: "API Reference", href: "/api" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Licenses", href: "/licenses" },
    ],
  },
]

const defaultSocialLinks: SocialLink[] = [
  { label: "X", href: "https://x.com/offerhub_", icon: "x" },
  { label: "Telegram", href: "https://t.me/offer_hub_contributors", icon: "telegram" },
  { label: "GitHub", href: "https://github.com/OFFER-HUB/offer-hub", icon: "github" },
]

function SocialIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "x":
      return <Twitter className="h-5 w-5" />
    case "telegram":
      return <MessageCircle className="h-5 w-5" />
    case "github":
      return <Github className="h-5 w-5" />
    default:
      return null
  }
}

export function Footer({
  navigationLinks = defaultNavigationLinks,
  sections = defaultSections,
  socialLinks = defaultSocialLinks,
  className,
}: FooterProps) {
  if (sections.length > 0) {
    return (
      <footer
        className={cn(
          "w-full bg-secondary-50 border-t border-secondary-100 py-12 px-4 md:px-6 font-[family-name:var(--font-geist-sans)]",
          className
        )}
      >
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4 items-start mb-12">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="bg-primary-500 rounded-full p-3">
                  <span className="text-white font-bold text-xl">OH</span>
                </div>
              </Link>
              <p className="text-sm text-secondary-500 max-w-xs">
                A decentralized freelance platform leveraging blockchain technology for secure and efficient
                collaboration.
              </p>
              <div className="flex gap-4">
                {socialLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-secondary-400 hover:text-primary-500 transition-colors"
                    aria-label={link.label}
                  >
                    <SocialIcon icon={link.icon} />
                  </Link>
                ))}
              </div>
            </div>
            {sections.map((section) => (
              <div key={section.title} className="space-y-4">
                <h3 className="font-semibold text-secondary-500">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-secondary-400 hover:text-primary-500 transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-secondary-100">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-secondary-400">© {new Date().getFullYear()} OFFER-HUB. All rights reserved.</p>
              <div className="flex gap-6">
                <Link href="/privacy" className="text-sm text-secondary-400 hover:text-primary-500 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-sm text-secondary-400 hover:text-primary-500 transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  } else {
    return (
      <footer className={cn("w-full bg-[#f5f5f5] py-8 px-4 md:px-6", className)}>
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 items-center">
            <div className="flex justify-center md:justify-start order-1 md:order-3">
              <Link href="/" className="flex items-center gap-2">
                <div className="bg-[#1e1e1e] rounded-full p-3">
                  <span className="text-white font-bold text-xl">OH</span>
                </div>
              </Link>
            </div>
            <div className="text-center order-2">
              <h2 className="text-2xl font-bold text-[#1e1e1e]">OFFER-HUB</h2>
              <div className="mt-2 w-20 h-1 bg-[#159a9c] mx-auto rounded-full" />
            </div>
            <div className="flex justify-center md:justify-end gap-6 order-3 md:order-1">
              {socialLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[#656464] hover:text-[#159a9c] transition-colors"
                  aria-label={link.label}
                >
                  <SocialIcon icon={link.icon} />
                </Link>
              ))}
            </div>
          </div>
          <nav className="mt-8">
            <ul className="flex flex-wrap justify-center gap-6 text-[#656464]">
              {navigationLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-[#159a9c] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </footer>
    )
  }
}