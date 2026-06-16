import Link from 'next/link'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection variant="fadeUp" className="text-center mb-16">
          <p className="text-xs uppercase tracking-widest font-medium text-secondary mb-4">Contact</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">Let's Work Together</h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            Tell us about your gifting needs and we'll put together the perfect solution.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <AnimatedSection variant="slideLeft">
            <div>
              <div className="space-y-6 mb-10">
                {[
                  { icon: Mail, label: 'Email', value: 'hello@giftforge.in', href: 'mailto:hello@giftforge.in' },
                  { icon: Phone, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
                  { icon: MapPin, label: 'Office', value: '4th Floor, Prestige Tower, MG Road, Bengaluru 560001', href: '#' },
                  { icon: Clock, label: 'Office Hours', value: 'Mon–Sat, 10am–6pm IST', href: '#' },
                ].map(({ icon: Icon, label, value, href }) => (
                  <a
                    key={label}
                    href={href}
                    className={`flex items-start gap-4 group ${href === '#' ? 'cursor-default' : ''}`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-secondary/5 flex items-center justify-center shrink-0 group-hover:bg-secondary/10 transition-colors">
                      <Icon className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground mb-1">{label}</p>
                      <p className="text-base font-medium text-primary group-hover:text-secondary transition-colors">{value}</p>
                    </div>
                  </a>
                ))}
              </div>

              {/* CTA to configurator */}
              <div className="bg-primary rounded-2xl p-6 text-white">
                <h3 className="font-display font-semibold text-lg mb-2">Ready to configure your order?</h3>
                <p className="text-white/70 text-sm mb-4">Use our interactive kit builder for instant pricing</p>
                <Link
                  href="/#configurator"
                  className="inline-flex items-center px-5 py-2.5 bg-secondary text-white text-sm font-medium rounded-full hover:bg-secondary/90 transition-colors"
                >
                  Open Configurator →
                </Link>
              </div>
            </div>
          </AnimatedSection>

          {/* Contact Form */}
          <AnimatedSection variant="slideRight">
            <form
              className="bg-lightGray rounded-2xl p-6 space-y-4"
            >
              <h2 className="font-display font-semibold text-primary text-xl mb-2">Send us a message</h2>

              {[
                { label: 'Full Name', type: 'text', placeholder: 'Priya Sharma', id: 'contact-name' },
                { label: 'Work Email', type: 'email', placeholder: 'priya@company.com', id: 'contact-email' },
                { label: 'Phone Number', type: 'tel', placeholder: '+91 98765 43210', id: 'contact-phone' },
                { label: 'Company', type: 'text', placeholder: 'Acme Corp', id: 'contact-company' },
              ].map((field) => (
                <div key={field.id}>
                  <label htmlFor={field.id} className="block text-sm font-medium text-primary mb-1.5">
                    {field.label}
                  </label>
                  <input
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full px-3.5 py-2.5 border border-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all"
                  />
                </div>
              ))}

              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-primary mb-1.5">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  placeholder="Tell us about your gifting needs, quantity, timeline..."
                  className="w-full px-3.5 py-2.5 border border-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-secondary text-white font-semibold rounded-xl hover:bg-secondary/90 transition-colors"
              >
                Send Message →
              </button>

              <p className="text-xs text-muted-foreground text-center">
                We respond within 24 hours on business days.
              </p>
            </form>
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}
