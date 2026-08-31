import ContactForm from "./contact-form";
import SiteChrome from "./site-chrome";
import {
  founders,
  mailHref,
  processSteps,
  projects,
  signals,
  site,
  telHref,
  testimonials,
  values,
  type Project,
} from "../site.config";

function LimitlessLogo() {
  return (
    <span className="limitlessLogo">
      {/* The stylised "E" is drawn in CSS, so the real letter is kept for
          screen readers, text selection and crawlers. */}
      <span className="srOnly">{site.name}</span>
      <span aria-hidden="true" className="logoVisual">
        <span className="logoWord">
          LIMIT
          <b>
            L<i className="logoE" />
            SS
          </b>
        </span>
        <span className="logoSub">Marketing Group</span>
      </span>
    </span>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className="libCard">
      {/* The whole card is one link — a bigger, more predictable target than a
          separate thumbnail and text link, and simpler for keyboard users. */}
      <a className="libLink" href={project.href} target="_blank" rel="noreferrer">
        <span className="libMedia">
          {project.image ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element --
                  next/image's optimizer needs the Cloudflare IMAGES binding, which
                  this project doesn't provision. Explicit dimensions plus the CSS
                  aspect-ratio already reserve space, so there's no layout shift. */}
              <img
                src={project.image}
                width={project.imageWidth}
                height={project.imageHeight}
                /* The top row sits near the fold and holds the likely LCP image. */
                loading={index < 3 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                decoding="async"
                alt={`${project.name} website homepage`}
              />
              <span className="libScrim" aria-hidden="true" />
            </>
          ) : (
            /* No screenshot on file yet — a designed tile reads as intentional,
               where a blank or broken image reads as a dead portfolio. */
            <span className="libPending">
              <span className="libPendingMark" aria-hidden="true" />
              <b>{project.name}</b>
            </span>
          )}
          <span className="libOpen">
            {project.concept ? "View concept" : "Visit site"} <b aria-hidden="true">↗</b>
          </span>
        </span>

        <span className="libBody">
          <span className="libTop">
            <span className={project.concept ? "libChip" : "libChip isLive"}>
              {project.concept ? "Concept" : "Live"}
            </span>
            {project.displayDomain && <span className="libDomain">{project.displayDomain}</span>}
          </span>
          <h3>{project.name}</h3>
          <span className="libSector">{project.sector}</span>
          <span className="libSummary">{project.summary}</span>
          <span className="libTags">{project.tags.join(" · ")}</span>
        </span>
        <span className="srOnly">(opens in a new tab)</span>
      </a>
    </article>
  );
}

export default function Home() {
  return (
    <>
      <a className="skipLink" href="#main">
        Skip to content
      </a>

      {/* Full-bleed so the backdrop spans the viewport; the shell only
          constrains the contents. */}
      <header className="nav" data-scrolled="false">
        <div className="shell navInner">
          <a className="brand" href="#top">
            <LimitlessLogo />
          </a>
          <nav className="navLinks" aria-label="Primary">
            <a href="#work">Work</a>
            <a href="#process">Process</a>
            <a href="#contact">Contact</a>
            <a className="navCta" href="#contact">
              Get a free mockup
            </a>
          </nav>
        </div>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="heroAura" aria-hidden="true" />
          <div className="shell heroInner">
            <p className="eyebrow">
              <i aria-hidden="true" /> One standard · No limits
            </p>
            <h1>
              Websites without <em>limits</em>.
            </h1>
            <div className="heroBottom">
              <p className="heroCopy">
                We create clear, modern websites that help growing businesses look credible, stand
                out, and turn more visitors into calls.
              </p>
              <div className="heroActions">
                <a className="button primary" href="#contact">
                  Get a free mockup <span aria-hidden="true">↗</span>
                </a>
                <a className="button ghost" href="#work">
                  See our work <span aria-hidden="true">↓</span>
                </a>
              </div>
            </div>
            <ul className="heroTrust">
              <li>Free custom mockup</li>
              <li>No obligation</li>
              <li>Flat-rate quotes</li>
            </ul>
          </div>
        </section>

        <section className="ticker" aria-label="What we focus on">
          <div className="tickerTrack">
            {[0, 1].map((copy) => (
              <div className="tickerGroup" key={copy} aria-hidden={copy === 1 || undefined}>
                {signals.map((signal) => (
                  <span key={signal}>
                    {signal}
                    <b aria-hidden="true">✦</b>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section className="work" id="work">
          <div className="shell">
            <div className="sectionHead">
              <div>
                <span className="kicker">Selected work</span>
                <h2>Built for the real world.</h2>
              </div>
              <p>
                No filler projects. Just focused websites made for real companies and the customers
                they serve.
              </p>
            </div>

            <div className="libGrid">
              {projects.map((project, index) => (
                <ProjectCard key={project.slug} project={project} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section className="why">
          <div className="whyAura" aria-hidden="true" />
          <div className="shell whyGrid">
            <div className="whyTitle">
              <span className="kicker">Why it matters</span>
              <h2>First impressions happen online.</h2>
            </div>
            <div className="whyCopy">
              <p className="lead">
                Your website should do more than exist. It should make the right customer feel
                confident enough to take the next step.
              </p>
              <div className="valueGrid">
                {values.map((value) => (
                  <div key={value.number}>
                    <b>{value.number}</b>
                    <h3>{value.title}</h3>
                    <p>{value.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Renders only once `testimonials` in site.config.ts has real entries. */}
        {testimonials.length > 0 && (
          <section className="testimonials" aria-labelledby="testimonials-heading">
            <div className="shell">
              <div className="sectionHead">
                <div>
                  <span className="kicker">Client feedback</span>
                  <h2 id="testimonials-heading">What owners say.</h2>
                </div>
              </div>
              <div className="quoteGrid">
                {testimonials.map((testimonial) => (
                  <figure key={testimonial.author}>
                    <blockquote>{testimonial.quote}</blockquote>
                    <figcaption>
                      <b>{testimonial.author}</b>
                      <span>{testimonial.role}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="process" id="process">
          <div className="shell">
            <div className="sectionHead">
              <div>
                <span className="kicker">Simple process</span>
                <h2>See your website before you commit.</h2>
              </div>
            </div>
            <div className="steps">
              {processSteps.map((step) => (
                <article key={step.number}>
                  <span className="stepNum">{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </article>
              ))}
            </div>
            <div className="priceNote">
              <b>What does it cost?</b>
              <p>
                The mockup is free — you see the real design before any money changes hands. Every
                project is quoted up front as a flat price, so there are no hourly surprises.
              </p>
            </div>
          </div>
        </section>

        {founders.show && (
          <section className="founder" aria-labelledby="founder-heading">
            <div className="shell founderInner">
              <span className="kicker">Who you&apos;re working with</span>
              <div className="founderGrid">
                <h2 id="founder-heading">
                  {founders.people.map((person) => (
                    <span className="founderName" key={person.name}>
                      {person.name}
                      <span>{person.role}</span>
                    </span>
                  ))}
                </h2>
                <p>{founders.bio}</p>
              </div>
            </div>
          </section>
        )}

        <section className="contact" id="contact">
          <div className="contactAura" aria-hidden="true" />
          <div className="shell contactGrid">
            <div className="contactIntro">
              <span className="kicker">Become limitless online</span>
              <h2>Let&apos;s make your business impossible to overlook.</h2>
              <p className="contactLead">
                Start with a free, no-pressure website mockup built around your business. Prefer to
                talk?
              </p>
              <ul className="contactDirect">
                <li>
                  <a href={telHref}>
                    <span>Call</span>
                    {site.phone.display}
                  </a>
                </li>
                <li>
                  <a href={mailHref}>
                    <span>Email</span>
                    {site.email}
                  </a>
                </li>
              </ul>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="shell footerGrid">
          <a className="brand" href="#top">
            <LimitlessLogo />
          </a>
          <p>Websites for ambitious businesses.</p>
          <div className="footerContact">
            <a href={telHref}>{site.phone.display}</a>
            <a href={mailHref}>{site.email}</a>
          </div>
        </div>
      </footer>

      <SiteChrome />
    </>
  );
}
