"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/api";
import api from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  IconFileCertificate,
  IconDownload,
  IconLoader2,
  IconArrowRight,
  IconBook,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

// ── Types ────────────────────────────────────────────────────────────────────

interface CertificateItem {
  id: string;
  certificateNumber: string;
  issuedAt: string;
  course: {
    id: string;
    title: string;
    slug: string;
    thumbnail: string | null;
    instructor: { firstName: string; lastName: string };
  };
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function CertificatesPage() {
  const { data: certificates, isLoading } = useQuery<CertificateItem[]>({
    queryKey: ["my-certificates"],
    queryFn: () => fetchData("/certificates"),
  });

  const [downloading, setDownloading] = useState<string | null>(null);

  async function handleDownload(certId: string, certNumber: string) {
    setDownloading(certId);
    try {
      const res = await api.get(`/certificates/${certId}/download`, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" }),
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificate-${certNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Download failed. Please try again.");
    } finally {
      setDownloading(null);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <IconLoader2 size={28} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!certificates || certificates.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <IconFileCertificate size={28} className="text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">No certificates yet</h2>
        <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
          Complete all lessons in a course to earn your certificate of
          completion.
        </p>
        <Button asChild>
          <Link href="/courses">Browse Courses</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black">My Certificates</h1>
        <p className="text-muted-foreground mt-1">
          {certificates.length} certificate
          {certificates.length !== 1 ? "s" : ""} earned
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col"
          >
            {/* Thumbnail */}
            <div className="w-full h-36 bg-gradient-to-br from-blue-500 to-blue-700 relative overflow-hidden">
              {cert.course.thumbnail ? (
                <Image
                  src={cert.course.thumbnail}
                  alt={cert.course.title}
                  fill
                  className="object-cover opacity-60"
                />
              ) : null}
              {/* Certificate icon overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <IconFileCertificate size={28} className="text-white" />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-black line-clamp-2 mb-1">
                {cert.course.title}
              </h3>
              <p className="text-xs text-muted-foreground mb-1">
                By {cert.course.instructor.firstName}{" "}
                {cert.course.instructor.lastName}
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Issued{" "}
                {new Date(cert.issuedAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>

              <div className="mt-auto flex items-center gap-2">
                <button
                  onClick={() =>
                    handleDownload(cert.id, cert.certificateNumber)
                  }
                  disabled={downloading === cert.id}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl font-bold text-sm transition-colors"
                >
                  {downloading === cert.id ? (
                    <IconLoader2 size={14} className="animate-spin" />
                  ) : (
                    <IconDownload size={14} />
                  )}
                  Download PDF
                </button>
                <Link
                  href={`/learn/${cert.course.id}`}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <IconBook size={14} />
                  Review
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
