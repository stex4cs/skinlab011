import { notFound } from "next/navigation";
import Image from "next/image";
import { getBlogPost, formatBlogDate } from "@/lib/blog";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Link } from "@/i18n/navigation";
import { ChevronLeft, Calendar, User } from "lucide-react";
import type { Locale } from "@/types/database";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const data = post[locale as Locale];
  if (!data) notFound();

  const authorTitle = post.author.title[locale as Locale];

  const backLabel =
    locale === "ru" ? "Назад к блогу" : locale === "en" ? "Back to Blog" : "Nazad na blog";

  return (
    <>
      <Navbar />
      <main className="pt-[70px]">
        {/* Hero image */}
        <div className="relative w-full" style={{ height: "480px" }}>
          <Image
            src={post.coverImage}
            alt={data.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)",
            }}
          />
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="container pb-12 text-center">
              <div className="flex justify-center mb-6">
                <Link
                  href="/blog"
                  className="no-underline inline-flex items-center gap-1.5 text-sm transition-opacity hover:opacity-80"
                  style={{ color: "rgba(255,255,255,0.75)" }}
                >
                  <ChevronLeft size={14} />
                  {backLabel}
                </Link>
              </div>
              <h1
                className="font-heading font-bold text-white leading-tight mx-auto"
                style={{ fontSize: "clamp(1.6rem, 4vw, 2.5rem)", maxWidth: "800px" }}
              >
                {data.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Article */}
        <div className="container py-16">
          <div className="max-w-2xl mx-auto text-center">
            {/* Author + date */}
            <div
              className="flex flex-col items-center gap-3 pb-8 mb-10"
              style={{ borderBottom: "1px solid rgba(212,175,120,0.2)" }}
            >
              <div className="relative w-14 h-14 rounded-full overflow-hidden">
                <Image
                  src={post.author.image}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div>
                <div className="font-semibold text-sm" style={{ color: "var(--color-dark)" }}>
                  {post.author.name}
                </div>
                <div className="text-xs" style={{ color: "rgba(44,44,44,0.5)" }}>
                  {authorTitle}
                </div>
              </div>
              <div
                className="flex items-center gap-1.5 text-xs"
                style={{ color: "rgba(44,44,44,0.45)" }}
              >
                <Calendar size={12} />
                {formatBlogDate(post.publishedAt, locale)}
              </div>
            </div>

            {/* Content blocks */}
            <div className="space-y-6 text-center">
              {data.content.map((block, i) => {
                if (block.type === "paragraph") {
                  return (
                    <p
                      key={i}
                      className="text-base leading-relaxed"
                      style={{ color: "rgba(44,44,44,0.8)" }}
                    >
                      {block.text}
                    </p>
                  );
                }
                if (block.type === "heading") {
                  return (
                    <h2
                      key={i}
                      className="font-heading font-semibold pt-4"
                      style={{
                        fontSize: "1.25rem",
                        color: "var(--color-dark)",
                        letterSpacing: "0.2px",
                      }}
                    >
                      {block.text}
                    </h2>
                  );
                }
                if (block.type === "image") {
                  return (
                    <figure key={i} className="my-8">
                      <div
                        className="relative w-full rounded-2xl overflow-hidden"
                        style={{ height: "380px" }}
                      >
                        <Image
                          src={block.src}
                          alt={block.alt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 672px"
                        />
                      </div>
                      {block.caption && (
                        <figcaption
                          className="text-center text-xs mt-3 italic"
                          style={{ color: "rgba(44,44,44,0.45)" }}
                        >
                          {block.caption}
                        </figcaption>
                      )}
                    </figure>
                  );
                }
                return null;
              })}
            </div>

            {/* Bottom CTA */}
            <div
              className="mt-14 p-8 rounded-2xl text-center"
              style={{
                background: "linear-gradient(135deg, #FDFAF7, #F5EDD9)",
                border: "1px solid rgba(212,175,120,0.25)",
              }}
            >
              <div
                className="font-heading font-semibold text-lg mb-2"
                style={{ color: "var(--color-dark)" }}
              >
                {locale === "ru"
                  ? "Готовы преобразить свою кожу?"
                  : locale === "en"
                  ? "Ready to transform your skin?"
                  : "Spremni za transformaciju vaše kože?"}
              </div>
              <p
                className="text-sm mb-6"
                style={{ color: "rgba(44,44,44,0.6)" }}
              >
                {locale === "ru"
                  ? "Запишитесь на персональную консультацию в SkinLab 011."
                  : locale === "en"
                  ? "Book a personal consultation at SkinLab 011."
                  : "Zakažite personalnu konsultaciju u SkinLab 011."}
              </p>
              <Link
                href="/#booking"
                className="no-underline inline-block cta-button"
              >
                {locale === "ru"
                  ? "Записаться на процедуру"
                  : locale === "en"
                  ? "Book a Treatment"
                  : "Zakažite tretman"}
              </Link>
            </div>

            <div className="mt-10 flex justify-center">
              <Link
                href="/blog"
                className="no-underline flex items-center gap-1.5 text-sm"
                style={{ color: "rgba(44,44,44,0.45)" }}
              >
                <ChevronLeft size={13} />
                {backLabel}
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
