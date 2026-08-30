import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenText, CalendarDays, Download, LifeBuoy, Search, Share2, UserRound } from "lucide-react";
import { ConceptBPageHero, ConceptBSectionHead } from "@/components/v2/concept-b-shell";
import { blogPosts } from "@/data/site-content";

type ConceptBBlogPageProps = {
  searchParams?: Promise<{ query?: string; category?: string }>;
};

export default async function ConceptBBlogPage({ searchParams }: ConceptBBlogPageProps) {
  const params = await searchParams;
  const query = params?.query?.trim().toLowerCase() ?? "";
  const category = params?.category ?? "";
  const categories = Array.from(new Set(blogPosts.map((post) => post.category)));
  const posts = blogPosts.filter((post) => {
    const searchable = [post.title, post.excerpt, post.category, post.sections.map((section) => section.title).join(" ")].join(" ").toLowerCase();

    return (!query || searchable.includes(query)) && (!category || post.category === category);
  });
  const featured = posts[0] ?? blogPosts[0];

  return (
    <>
      <ConceptBPageHero
        eyebrow="Blog"
        title="Technical guides for water filtration buyers"
        description="Read industrial water filtration articles with search, category filtering, reading time, publication date, sharing, downloads, and support actions."
        action={
          <div className="b2-hero-panel">
            <BookOpenText className="h-9 w-9 text-cyan-300" />
            <h2 className="mt-5 text-2xl font-black">Find guidance faster</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">Written for engineers, consultants, procurement teams, and industrial buyers.</p>
          </div>
        }
      />

      <section className="b2-band-tight">
        <div className="b2-wrap">
          <form className="b2-filter-dock">
            <label className="b2-field">
              <span>Search articles</span>
              <input name="query" className="b2-input" placeholder="RO membrane, dosing pump, filtration..." defaultValue={params?.query ?? ""} />
            </label>
            <label className="b2-field">
              <span>Category</span>
              <select name="category" className="b2-select" defaultValue={category}>
                <option value="">All categories</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="b2-button">
              Search <Search className="h-4 w-4" />
            </button>
          </form>
        </div>
      </section>

      <section className="b2-band b2-band-warm">
        <div className="b2-wrap b2-split">
          <div className="b2-product-hero-img">
            <Image src={featured.featuredImage.path} alt={featured.featuredImage.alt} fill sizes="(max-width: 900px) 100vw, 620px" />
          </div>
          <article className="b2-data-card">
            <span className="b2-pill">Featured article</span>
            <h2 className="mt-5 text-4xl">{featured.title}</h2>
            <p className="mt-5">{featured.excerpt}</p>
            <div className="mt-6 grid gap-3 text-sm font-bold text-slate-500">
              <span><UserRound className="mr-2 inline h-4 w-4 text-cyan-600" />{featured.authorName}</span>
              <span><CalendarDays className="mr-2 inline h-4 w-4 text-cyan-600" />{new Date(featured.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
              <span><BookOpenText className="mr-2 inline h-4 w-4 text-cyan-600" />{featured.readingTime}</span>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={`/blog/${featured.slug}`} className="b2-link-chip b2-link-strong">
                Read article <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/downloads" className="b2-link-chip">
                Download PDF <Download className="h-4 w-4" />
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="b2-band">
        <div className="b2-wrap">
          <ConceptBSectionHead
            eyebrow="Articles"
            title="Guides for better filtration decisions"
            description="The list is shorter, easier to scan, and gives every article a clear next action."
          />
          <div className="b2-grid-3">
            {posts.map((post) => (
              <article key={post.slug} className="b2-product">
                <div className="b2-product-media">
                  <Image src={post.featuredImage.path} alt={post.featuredImage.alt} fill sizes="390px" />
                </div>
                <div className="b2-product-body">
                  <div className="b2-pill-row">
                    <span className="b2-pill">{post.category}</span>
                    <span className="b2-pill">{post.readingTime}</span>
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold text-slate-500">
                    <span><CalendarDays className="mr-1 inline h-4 w-4 text-cyan-600" />{new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    <span><UserRound className="mr-1 inline h-4 w-4 text-cyan-600" />{post.authorName}</span>
                  </div>
                  <div className="b2-product-actions">
                    <Link href={`/blog/${post.slug}`} className="b2-link-chip b2-link-strong">Read</Link>
                    <Link href="/contact" className="b2-link-chip">Help</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="b2-band b2-band-dark">
        <div className="b2-wrap b2-page-hero-grid">
          <div>
            <span className="b2-kicker">Need technical help?</span>
            <h2 className="b2-title">Turn reading into product selection.</h2>
            <p className="b2-lead">Share your water source, application, and product requirement with the technical team.</p>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/request-quote" className="b2-button">
              Request Technical Help <LifeBuoy className="h-4 w-4" />
            </Link>
            <Link href="mailto:?subject=ICONIC%20technical%20article" className="b2-ghost">
              Share <Share2 className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
