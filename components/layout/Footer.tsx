import Link from 'next/link'
import { Linkedin, Instagram, Twitter, ArrowRight } from 'lucide-react'

const footerLinks = {
  Products: [
    { label: 'Executive Gifts', href: '/categories/executive-gifts' },
    { label: 'Employee Kits', href: '/categories/employee-welcome-kits' },
    { label: 'Festive Hampers', href: '/categories/festive-hampers' },
    { label: 'Tech Accessories', href: '/categories/tech-accessories' },
    { label: 'All Products', href: '/products' },
  ],
  Solutions: [
    { label: 'IT Companies', href: '/industries/it-software' },
    { label: 'Startups', href: '/industries/startups' },
    { label: 'Manufacturing', href: '/industries/manufacturing' },
    { label: 'Healthcare', href: '/industries/healthcare' },
    { label: 'Education', href: '/industries/education' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Blog', href: '/blog' },
    { label: 'Press', href: '/press' },
    { label: 'Contact', href: '/contact' },
  ],
  Resources: [
    { label: 'Catalogue (PDF)', href: '/catalogue.pdf' },
    { label: 'FAQ', href: '/#faq' },
    { label: 'Admin Dashboard', href: '/admin/dashboard' },
    { label: 'Shipping Policy', href: '/shipping-policy' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-16">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">G</span>
              </div>
              <span className="font-display font-bold text-2xl">GiftForge</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Premium corporate gifting that builds stronger relationships. Trusted by 500+ companies across India.
            </p>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Link
              href="/#configurator"
              className="flex items-center gap-2 px-6 py-3 bg-secondary text-white font-semibold rounded-full text-sm hover:bg-secondary/90 transition-colors"
            >
              Request a Quote
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Nav Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-white/10">
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-white font-semibold text-sm mb-4">{section}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/60 text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} GiftForge. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {[
              { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
              { icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
              { icon: Twitter, label: 'Twitter', href: 'https://twitter.com' },
            ].map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
