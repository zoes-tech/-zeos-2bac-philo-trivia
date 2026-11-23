"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getModuleById, getModulePath } from "@/lib/curriculum";
import { getExplanation } from "@/lib/explanations";

export function ConceptFeedback({
  moduleId,
  questionId,
  category,
}: {
  moduleId: string;
  questionId: string;
  category?: string;
}) {
  const owner = getModuleById(moduleId);
  const concept =
    owner?.concepts.find((item) => item.name === category) ??
    (category ? undefined : owner?.concepts[0]);
  const note =
    concept && concept.description && concept.description !== concept.name
      ? concept.description
      : null;
  const explanation = getExplanation(moduleId, questionId);

  return (
    <>
      <div className="mt-4 rounded-xl border border-orange-500/20 bg-orange-500/10 p-3 text-right">
        <p className="text-xs font-bold text-orange-100">
          {concept ? `المفهوم: ${concept.name}` : "راجع هذا المحور"}
        </p>
        {note && (
          <p className="mt-1 text-[11px] leading-relaxed text-orange-100/80">
            {note}
          </p>
        )}
        {owner && (
          <Link
            href={getModulePath(moduleId) ?? "/#curriculum"}
            className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-orange-200 transition-colors hover:text-white"
          >
            راجع المحور كاملاً
            <ArrowLeft aria-hidden="true" className="h-3 w-3" />
          </Link>
        )}
      </div>

      {explanation && (
        <div className="mt-3 rounded-xl border border-cyan-500/20 bg-cyan-500/[0.06] p-3 text-right">
          <p className="text-[11px] font-bold text-cyan-200">شرح مبسط</p>
          <p className="mt-1 text-xs leading-relaxed text-zinc-300">
            {explanation}
          </p>
        </div>
      )}
    </>
  );
}
