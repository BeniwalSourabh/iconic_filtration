import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpenText, CalendarDays, Download, LifeBuoy, ListChecks, Share2, UserRound } from "lucide-react";
import { ConceptBSectionHead } from "@/components/v2/concept-b-shell";
import { blogPosts } from "@/data/site-content";
import { absoluteUrl } from "@/lib/seo/site";

type ConceptBArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default async function ConceptBArticlePage({ params }: ConceptBArticlePageProps) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  const related = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 2);

  return (
    <>
      <section className="b2-page-hero">
        <div className="b2-wrap">
          <Link href="/blog" className="b2-ghost">
            <ArrowLeft className="h-4 w-4" /> Back to Journal
          </Link>
          <div className="mt-10 b2-split">
            <div>
              <span className="b2-kicker">{post.category}</span>
              <h1 className="b2-detail-title">{post.title}</h1>
              <p>{post.excerpt}</p>
              <div className="mt-7 flex flex-wrap gap-5 text-sm font-bold text-white/65">
                <span><UserRound className="mr-2 inline h-4 w-4 text-cyan-300" />{post.authorName}</span>
                <span><CalendarDays className="mr-2 inline h-4 w-4 text-cyan-300" />{new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
                <span><BookOpenText className="mr-2 inline h-4 w-4 text-cyan-300" />{post.readingTime}</span>
              </div>
            </div>
            <div className="b2-product-hero-img">
              <Image src={post.featuredImage.path} alt={post.featuredImage.alt} fill sizes="(max-width: 900px) 100vw, 560px" priority />
            </div>
          </div>
        </div>
      </section>

      <section className="b2-band b2-band-warm">
        <div className="b2-wrap b2-split">
          <aside className="b2-data-card">
            <ListChecks className="h-7 w-7 text-cyan-600" />
            <h2 className="mt-5 text-3xl">Article contents</h2>
            <div className="mt-6 grid gap-3">
              {post.sections.map((section) => (
                <a key={section.id} href={`#${section.id}`} className="b2-link-chip">
                  {section.title}
                </a>
              ))}
            </div>
            <div className="mt-6 grid gap-3">
              <Link href={`/downloads?query=${encodeURIComponent(post.category)}`} className="b2-link-chip b2-link-strong">
                Download PDF <Download className="h-4 w-4" />
              </Link>
              <a href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(absoluteUrl(`/blog/${post.slug}`))}`} className="b2-link-chip">
                Share <Share2 className="h-4 w-4" />
              </a>
              <Link href="/contact" className="b2-link-chip">
                Request Technical Help <LifeBuoy className="h-4 w-4" />
              </Link>
            </div>
          </aside>
          <article className="grid gap-5">
            {post.sections.map((section) => (
              <section key={section.id} id={section.id} className="b2-data-card scroll-mt-28">
                <h2 className="text-4xl">{section.title}</h2>
                <div className="mt-5 grid gap-4">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {section.subsections?.length ? (
                  <div className="mt-7 b2-grid-2">
                    {section.subsections.map((subsection) => (
                      <div key={subsection.title} className="rounded-3xl bg-slate-50 p-5">
                        <h3 className="text-xl">{subsection.title}</h3>
                        <p className="mt-3">{subsection.text}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </section>
            ))}
          </article>
        </div>
      </section>

      <section className="b2-band">
        <div className="b2-wrap">
          <ConceptBSectionHead
            eyebrow="Read next"
            title="Related technical guides."
            description="Continue through the knowledge journal or move directly into product selection."
          />
          <div className="b2-grid-2">
            {related.map((item) => (
              <Link key={item.slug} href={`/blog/${item.slug}`} className="b2-data-card">
                <span className="b2-pill">{item.category}</span>
                <h2 className="mt-5 text-3xl">{item.title}</h2>
                <p className="mt-4">{item.excerpt}</p>
                <span className="b2-link-chip b2-link-strong mt-6">
                  Read next <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="b2-band b2-band-dark">
        <div className="b2-wrap b2-page-hero-grid">
          <div>
            <span className="b2-kicker">Next step</span>
            <h2 className="b2-title">{post.cta.title}</h2>
            <p className="b2-lead">{post.cta.text}</p>
          </div>
          <Link href="/request-quote" className="b2-button">
            Request Quote <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
