import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { SITE_URL } from "@/lib/data";
import { getGuide, urlFor } from "@/lib/sanity";

export const revalidate = 60;
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const g = await getGuide(slug);
  if (!g) return {};
  const img = g.cover ? urlFor(g.cover).width(1200).height(630).fit("crop").url() : undefined;
  return {
    title: g.title,
    description: g.excerpt,
    alternates: { canonical: `/goc-chill/${g.slug}` },
    openGraph: { title: g.title, description: g.excerpt, type: "article", images: img ? [img] : undefined },
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const g = await getGuide(slug);
  if (!g) notFound();
  return (
    <article className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/goc-chill" className="text-sm text-muted hover:text-brand">← Góc chill</Link>
      {g.area && <p className="mt-4 text-sm text-muted">{g.area}</p>}
      <h1 className="display mt-1 text-4xl sm:text-5xl">{g.title}</h1>
      {g.cover && (
        <Image src={urlFor(g.cover).width(1200).height(700).fit("crop").url()} alt={g.cover.alt || g.title} width={1200} height={700} className="mt-6 w-full rounded-3xl" priority />
      )}
      <div className="mt-8 space-y-4 text-lg leading-relaxed [&_h2]:display [&_h2]:mt-8 [&_h2]:text-2xl [&_a]:text-brand [&_a]:underline">
        <PortableText
          value={g.body ?? []}
          components={{
            types: {
              image: ({ value }) => (
                <Image src={urlFor(value).width(1000).url()} alt={value.alt || g.title} width={1000} height={650} className="my-6 w-full rounded-2xl" />
              ),
            },
          }}
        />
      </div>
      <div className="card mt-12 p-6 text-center">
        <p className="display text-2xl">Rủ nhóm đi thôi?</p>
        <Link href="/tao-keo" className="btn-primary mt-4">Tạo kèo ngay</Link>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: g.title,
            description: g.excerpt,
            datePublished: g.publishedAt,
            mainEntityOfPage: `${SITE_URL}/goc-chill/${g.slug}`,
          }),
        }}
      />
    </article>
  );
}
