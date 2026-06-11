"use client";

import { useState, useEffect } from "react";
import {
  IconShieldCheck,
  IconShieldX,
  IconSearch,
  IconLoader2,
  IconCertificate,
  IconUser,
  IconCalendar,
  IconChalkboard,
} from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { publicFetch } from "@/lib/api";

interface VerifyResult {
  valid: boolean;
  certificateNumber?: string;
  studentName?: string;
  courseTitle?: string;
  instructorName?: string;
  issuedAt?: string;
}

export const VerifyClient = ({
  initialCertNumber,
}: {
  initialCertNumber?: string;
}) => {
  const [certNumber, setCertNumber] = useState(initialCertNumber ?? "");
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleVerify(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await publicFetch<VerifyResult>(
        `/certificates/verify/${encodeURIComponent(trimmed)}`,
      );
      setResult(data);
    } catch {
      setResult({ valid: false });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (initialCertNumber) {
      handleVerify(initialCertNumber);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCertNumber]);

  return (
    <section className="py-20 bg-white min-h-[70vh]">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 text-primary mb-4">
            <IconCertificate size={28} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Verify a Certificate
          </h1>
          <p className="text-gray-600">
            Enter the certificate number to confirm its authenticity.
          </p>
        </div>

        {/* Search */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify(certNumber);
          }}
          className="flex flex-col sm:flex-row gap-3 mb-8"
        >
          <Input
            value={certNumber}
            onChange={(e) => setCertNumber(e.target.value)}
            placeholder="e.g. CERT-A1B2C3D4-XXXXXXXX"
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !certNumber.trim()}>
            {loading ? (
              <IconLoader2 size={16} className="animate-spin" />
            ) : (
              <IconSearch size={16} />
            )}
            Verify
          </Button>
        </form>

        {/* Result */}
        {searched && !loading && result && (
          <>
            {result.valid ? (
              <div className="bg-green-50 border border-green-100 rounded-md p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                    <IconShieldCheck size={24} className="text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Certificate Verified
                    </h2>
                    <p className="text-sm text-green-700">
                      This certificate is valid and was issued by School of
                      Innovation.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-md divide-y divide-gray-100 border border-gray-100">
                  <DetailRow
                    icon={<IconUser size={16} />}
                    label="Student"
                    value={result.studentName!}
                  />
                  <DetailRow
                    icon={<IconChalkboard size={16} />}
                    label="Course"
                    value={result.courseTitle!}
                  />
                  <DetailRow
                    icon={<IconUser size={16} />}
                    label="Instructor"
                    value={result.instructorName!}
                  />
                  <DetailRow
                    icon={<IconCalendar size={16} />}
                    label="Issued On"
                    value={new Date(result.issuedAt!).toLocaleDateString(
                      "en-GB",
                      { day: "numeric", month: "long", year: "numeric" },
                    )}
                  />
                  <DetailRow
                    icon={<IconCertificate size={16} />}
                    label="Certificate No."
                    value={result.certificateNumber!}
                    mono
                  />
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-100 rounded-md p-8 text-center">
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <IconShieldX size={24} className="text-red-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  Certificate Not Found
                </h2>
                <p className="text-sm text-red-700">
                  We couldn't find a certificate matching that number. Please
                  double-check and try again.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

function DetailRow({
  icon,
  label,
  value,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <span className="flex items-center gap-2 text-sm text-gray-500">
        {icon}
        {label}
      </span>
      <span
        className={`text-sm font-bold text-gray-900 text-right ${mono ? "font-mono text-xs" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
