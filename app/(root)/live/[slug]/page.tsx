import type { Metadata } from "next";
import LiveDetailClient from "./_components/LiveDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/public/live/${slug}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) throw new Error("not found");
    const session = await res.json();

    return {
      title: `${session.title} | Live Class`,
      description:
        session.description?.slice(0, 160) ??
        "Join this live class at School of Innovation.",
      openGraph: {
        title: session.title,
        description: session.description?.slice(0, 160) ?? undefined,
        images: session.coverImage ? [session.coverImage] : undefined,
        url: `https://innovationconference.com.ng/live/${slug}`,
        type: "website",
      },
      alternates: {
        canonical: `https://innovationconference.com.ng/live/${slug}`,
      },
    };
  } catch {
    return { title: "Live Class | School of Innovation" };
  }
}

export default async function LiveDetailPage({ params }: Props) {
  const { slug } = await params;
  return <LiveDetailClient slug={slug} />;
}
