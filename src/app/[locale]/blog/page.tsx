import Image from "next/image";
import { blogPosts, formatBlogDate } from "@/lib/blog";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Link } from "@/i18n/navigation";
import { Calendar, User, ArrowRight } from "lucide-react";
import type { Locale } from "@/types/database";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  const loc = locale as Locale;

  const titles = {
    me: "Blog",
    en: "Blog",
    ru: "Блог",
  };
  const subtitles = {
    me: "Savjeti, trendovi i stručna mišljenja o njezi kože",
    en: "Tips, trends and expert opinions on skincare",
    ru: "Советы, тренды и экспертные мнения об уходе за кожей",
  };
  const readMoreLabel = {
    me: "Pročitajte više",
    en: "Read more",
    ru: "Читать далее",
  };

  return (
    <>
      <Navbar />
      <main className="pt-[70px]">
        <section
          className="pt-20 pb-32"
          style={{ background: "var(--color-secondary)" }}
        >
          <div className="container">
            <h1 className="section-title">{titles[loc]}</h1>
            <p className="section-subtitle">{subtitles[loc]}</p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {blogPosts.map((post) => {
                const data = post[loc];
                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group no-underline block"
                  >
                    <article
                      className="rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-300"
                      style={{
                        background: "white",
                        border: "1px solid rgba(212,175,120,0.15)",
                        boxShadow: "0 2px 16px rgba(212,175,120,0.07)",
                      }}
                    >
                      <div className="relative overflow-hidden" style={{ height: "220px" }}>
                        <Image
                          src={post.coverImage}
                          alt={data.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <span
                            className="flex items-center gap-1.5 text-xs"
                            style={{ color: "rgba(44,44,44,0.45)" }}
                          >
                            <Calendar size={12} />
                            {formatBlogDate(post.publishedAt, locale)}
                          </span>
                          <span
                            className="flex items-center gap-1.5 text-xs"
                            style={{ color: "rgba(44,44,44,0.45)" }}
                          >
                            <User size={12} />
                            {post.author.name}
                          </span>
                        </div>
                        <h2
                          className="font-heading font-semibold mb-3 leading-snug"
                          style={{ color: "var(--color-dark)", fontSize: "1.05rem" }}
                        >
                          {data.title}
                        </h2>
                        <p
                          className="text-sm leading-relaxed flex-1 mb-5"
                          style={{ color: "rgba(44,44,44,0.6)" }}
                        >
                          {data.excerpt}
                        </p>
                        <span
                          className="flex items-center gap-1.5 text-sm font-semibold transition-all group-hover:gap-3"
                          style={{ color: "var(--color-primary)" }}
                        >
                          {readMoreLabel[loc]}
                          <ArrowRight size={14} />
                        </span>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
