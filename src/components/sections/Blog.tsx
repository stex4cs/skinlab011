"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { blogPosts, formatBlogDate } from "@/lib/blog";
import type { Locale } from "@/types/database";
import { ArrowRight, Calendar, User } from "lucide-react";

export default function Blog() {
  const t = useTranslations("blog");
  const locale = useLocale() as Locale;
  const posts = blogPosts.slice(0, 3);

  return (
    <section id="blog" className="pt-20 pb-32" style={{ background: "white" }}>
      <div className="container">
        <h2 className="section-title">{t("title")}</h2>
        <p className="section-subtitle">{t("subtitle")}</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {posts.map((post) => {
            const data = post[locale];
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group no-underline block"
              >
                <article
                  className="rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-300"
                  style={{
                    background: "#FDFAF7",
                    border: "1px solid rgba(212,175,120,0.15)",
                    boxShadow: "0 2px 16px rgba(212,175,120,0.07)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 12px 40px rgba(212,175,120,0.18)";
                    (e.currentTarget as HTMLElement).style.transform =
                      "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 2px 16px rgba(212,175,120,0.07)";
                    (e.currentTarget as HTMLElement).style.transform =
                      "translateY(0)";
                  }}
                >
                  {/* Cover image */}
                  <div className="relative overflow-hidden" style={{ height: "220px" }}>
                    <Image
                      src={post.coverImage}
                      alt={data.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 60%)",
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    {/* Meta */}
                    <div className="flex items-center gap-4 mb-4">
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

                    {/* Title */}
                    <h3
                      className="font-heading font-semibold mb-3 leading-snug"
                      style={{
                        color: "var(--color-dark)",
                        fontSize: "1.1rem",
                        letterSpacing: "0.2px",
                      }}
                    >
                      {data.title}
                    </h3>

                    {/* Excerpt */}
                    <p
                      className="text-sm leading-relaxed flex-1 mb-5"
                      style={{ color: "rgba(44,44,44,0.6)" }}
                    >
                      {data.excerpt}
                    </p>

                    {/* CTA */}
                    <span
                      className="flex items-center gap-1.5 text-sm font-semibold transition-all group-hover:gap-3"
                      style={{ color: "var(--color-primary)" }}
                    >
                      {t("readMore")}
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        {blogPosts.length > 3 && (
          <div className="flex justify-center mt-12">
            <Link
              href="/blog"
              className="no-underline px-8 py-3 rounded-full font-semibold text-sm transition-all"
              style={{
                border: "1.5px solid var(--color-primary)",
                color: "var(--color-primary)",
                background: "transparent",
              }}
            >
              {t("allPosts")}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
