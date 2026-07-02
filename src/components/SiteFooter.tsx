import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin } from "lucide-react";
import logoAsset from "@/assets/klf-logo-color.png.asset.json";
import { SITE, CATEGORIES } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-white/85">
      <div className="container-page grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="inline-block rounded-lg bg-white p-3 shadow-card">
            <img src={logoAsset.url} alt="The Kohn Law Firm" className="h-16 w-auto" />
          </div>
          <p className="mt-5 text-sm leading-relaxed text-white/70">
            Trusted criminal defense and family law representation serving
            Colorado Springs and the surrounding communities.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            Firm
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <FooterLink to="/">Home</FooterLink>
            <FooterLink to="/about">About</FooterLink>
            <FooterLink to="/team">Our Team</FooterLink>
            <FooterLink to="/contact">Contact</FooterLink>
            <FooterLink to="/consultation">Schedule Consultation</FooterLink>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            Practice Areas
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/$category"
                  params={{ category: c.slug }}
                  className="text-white/80 hover:text-gold"
                >
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            Contact
          </h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                href={SITE.phoneHref}
                className="inline-flex items-center gap-2 hover:text-gold"
              >
                <Phone className="h-4 w-4 text-gold" /> {SITE.phone}
              </a>
            </li>
            <li>
              <a
                href={SITE.emailHref}
                className="inline-flex items-center gap-2 hover:text-gold"
              >
                <Mail className="h-4 w-4 text-gold" /> {SITE.email}
              </a>
            </li>
            <li className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold" /> {SITE.city}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-white/60 md:flex-row">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <p>
            Attorney advertising. Prior results do not guarantee a similar outcome.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <li>
      <Link to={to} className="text-white/80 hover:text-gold">
        {children}
      </Link>
    </li>
  );
}
