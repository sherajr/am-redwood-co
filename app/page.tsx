import { ArrowDown, ArrowLeftRight, ArrowUpRight, Check, MapPin, MessageSquare, Phone, Trees } from "lucide-react";
import type { Metadata } from "next";
import { business, services, steps, beforeAfter } from "@/content/site";
import { Services } from "@/components/site/services";
import { Testimonials } from "@/components/site/testimonials";
import { Motion } from "@/components/site/motion";
import { MobileNav } from "@/components/site/mobile-nav";
// Search engines read the business facts from content/site.ts. Only verifiable
// details belong here: no ratings, reviews, hours, address or credentials.
const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    url: business.url,
    telephone: business.phoneHref.replace("tel:", ""),
    description: business.intro,
    image: new URL(business.heroImage, business.url).href,
    areaServed: business.areas.map(area => ({ "@type": "City", name: area, containedInPlace: { "@type": "State", name: "California" } })),
    founder: business.founders.map(name => ({ "@type": "Person", name })),
    hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Services",
        itemListElement: services.map(group => ({
            "@type": "OfferCatalog",
            name: group.title,
            itemListElement: group.items.map(item => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: item } })),
        })),
    },
};
export const metadata: Metadata = { alternates: { canonical: "/" } };
export default function Home() {
    return <main id="top">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}/>
    <a className="skip-link" href="#services">Skip to services</a>
    <Motion />
    <section className="hero" aria-labelledby="hero-title">
      <img className="hero-image" src={business.heroImage} alt="Sunlight filtering through a grove of towering redwoods" width="1920" height="1280" fetchPriority="high"/>
      <div className="hero-shade"/>
      <header className="header wrap">
        <a className="wordmark" href="#top" aria-label="A and M Redwood Co home"><Trees strokeWidth={1.3} aria-hidden="true"/><span>A & M <strong>REDWOOD CO</strong></span></a>
        <nav className="desktop-nav" aria-label="Main navigation"><a href="#services">What we do</a><a href="#about">Who we are</a><a href="#work">Our work</a><a href="#neighbors">Kind words</a></nav>
        <a className="header-phone" href={business.phoneHref}><Phone size={15}/>{business.phone}</a>
        <MobileNav />
      </header>
      <div className="hero-content wrap">
        <p className="eyebrow hero-eyebrow">ROOTED IN THE SANTA CRUZ MOUNTAINS</p>
        <h1 id="hero-title">{business.headline[0]}<br /><em>{business.headline[1]}</em></h1>
        <p className="hero-description">{business.intro}</p>
        <div className="hero-actions"><a className="button button-light" href={business.phoneHref}>Let’s talk about your project <ArrowUpRight size={19}/></a><a className="text-link light" href="#services">See what we do <ArrowDown size={16}/></a></div>
      </div>
      <div className="hero-bottom wrap"><p><MapPin size={15}/> Boulder Creek <span>·</span> Felton <span>·</span> Ben Lomond</p><a href="#services" className="scroll-cue">A LITTLE HELP GOES A LONG WAY <ArrowDown size={17}/></a></div>
    </section>
    <section className="intro-strip"><div className="wrap"><span>Two people. Plenty of know-how.</span><span><Check size={16}/> Hands-on work</span><span><Check size={16}/> Small projects welcome</span><span><Check size={16}/> Local, personal service</span></div></section>
    <section className="services-section section wrap" id="services">
      <div className="section-heading reveal"><p className="eyebrow">01 / WHAT WE DO</p><h2>A long to-do list.<br /><em>One good call.</em></h2><p>From the jobs you’ve been putting off to the projects you’ve been dreaming about. Tell us what you need.</p><a className="text-link" href={business.textHref}>Text us your project <ArrowUpRight size={17}/></a></div>
      <Services />
    </section>
    <section className="about-section" id="about"><div className="wrap about-grid">
      <div className="about-image reveal"><img src="/images/redwood-path.jpg" alt="Tall redwood trunks and green forest understory" width="900" height="1100" loading="lazy"/><div className="image-caption"><Trees size={24} strokeWidth={1.2}/><span>THE MOUNTAINS ARE<br />OUR KIND OF PLACE.</span></div></div>
      <div className="about-copy reveal"><p className="eyebrow">02 / THE PEOPLE BEHIND THE WORK</p><h2>Meet Asa.<br />Meet Manny.<br /><em>Your next good call.</em></h2><p>We’re Asa Branden and Manny Fonseca. We started A & M Redwood Co to bring practical help and a personal touch to our mountain communities.</p><p>Our approach is simple: listen, figure it out together, and get to work. From a fresh coat of paint to a cleared yard or a little company, we’re here to make your day easier.</p><div className="founders"><div><span className="initial">A</span><span>Asa Branden<small>CO-FOUNDER</small></span></div><div><span className="initial">M</span><span>Manny Fonseca<small>CO-FOUNDER</small></span></div></div><p className="about-note">Hands, tools, and a can-do attitude. No tractors required.</p></div>
    </div></section>
    <section className="work-section section wrap" id="work">
      <div className="work-heading reveal"><p className="eyebrow">03 / SEE THE DIFFERENCE</p><h2>Before.<br /><em>After.</em></h2><p>A look at recent work around the mountains, from builds to clearing to garden care.</p></div>
      <div className="work-grid">{beforeAfter.map(pair => <article className="work-pair reveal" key={pair.id}>
        <div className="work-compare" tabIndex={0} aria-label={`${pair.title}: showing the after photo. Hover or focus to compare with before.`}>
          <img className="work-photo work-after" src={pair.after.src} alt={pair.after.alt} width="700" height="525" loading="lazy"/>
          <img className="work-photo work-before" src={pair.before.src} alt={pair.before.alt} width="700" height="525" loading="lazy"/>
          <span className="work-hint"><ArrowLeftRight size={13}/> Compare</span>
          <span className="work-tag work-tag-after">After</span>
          <span className="work-tag work-tag-before">Before</span>
        </div>
        <h3>{pair.title}</h3>
      </article>)}</div>
    </section>
    <section className="process-section section wrap"><div className="process-heading reveal"><p className="eyebrow">04 / SIMPLE FROM THE START</p><h2>Less on your list.<br /><em>More room to breathe.</em></h2></div><div className="steps">{steps.map(step => <article className="step reveal" key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.description}</p></article>)}</div></section>
    <Testimonials />
    <section className="contact-section" id="contact"><div className="wrap contact-grid reveal"><div><p className="eyebrow">BOULDER CREEK · FELTON · BEN LOMOND</p><h2>What can we take<br /><em>off your hands?</em></h2><p>One job or a whole list. Let’s start with a conversation.</p></div><div className="contact-actions"><a className="contact-number" href={business.phoneHref}>{business.phone}<ArrowUpRight /></a><div className="contact-buttons"><a className="button button-light" href={business.phoneHref}><Phone size={17}/> Give us a call</a><a className="button button-outline" href={business.textHref}><MessageSquare size={17}/> Send a text</a></div></div></div></section>
    <footer className="footer wrap"><a className="wordmark footer-brand" href="#top"><Trees strokeWidth={1.3} aria-hidden="true"/><span>A & M <strong>REDWOOD CO</strong></span></a><p>Good people. Solid work. Right here in the mountains.</p><div><span>© {new Date().getFullYear()} A & M Redwood Co</span><a href="/manage">Team access</a></div></footer>
  </main>;
}
