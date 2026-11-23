import type { Locale } from "@/i18n/locales";
import type { LevelId } from "@/lib/curriculum";
import type { Module } from "@/types";

type LevelCopy = Record<LevelId, { title: string; description: string }>;
type ModuleCopy = Record<string, { title: string; description: string }>;

export const LEVEL_COPY: Record<Locale, LevelCopy> = {
  ar: {
    "common-core": {
      title: "الجذع المشترك",
      description: "نشأة الفلسفة: من الأسطورة إلى اللوغوس.",
    },
    "1st-bac": {
      title: "الأولى باك",
      description: "الإنسان والفاعلية: الوعي، الرغبة، اللغة، التقنية والعمل.",
    },
    "2nd-bac": {
      title: "الثانية باك",
      description: "الوضع البشري، المعرفة، الأخلاق والسياسة.",
    },
  },
  fr: {
    "common-core": {
      title: "Tronc commun",
      description: "Naissance de la philosophie : du mythe au logos.",
    },
    "1st-bac": {
      title: "1re année Bac",
      description:
        "L'humain et l'action : conscience, désir, langage, technique et travail.",
    },
    "2nd-bac": {
      title: "2e année Bac",
      description: "Condition humaine, connaissance, morale et politique.",
    },
  },
  en: {
    "common-core": {
      title: "Common Core",
      description: "The birth of philosophy: from myth to logos.",
    },
    "1st-bac": {
      title: "11th Grade",
      description:
        "The human being and action: consciousness, desire, language, technique and work.",
    },
    "2nd-bac": {
      title: "12th Grade",
      description: "Human condition, knowledge, ethics and politics.",
    },
  },
};

export const MODULE_COPY: Record<Locale, ModuleCopy> = {
  ar: {},
  fr: {
    "intro-philosophy": {
      title: "Naissance de la philosophie",
      description:
        "Du mythe au raisonnement : premiers concepts et premières questions philosophiques.",
    },
    humanity: {
      title: "L'humain",
      description:
        "Les dimensions de l'existence humaine : conscience, désir et langage.",
    },
    effectiveness: {
      title: "Agir et créer",
      description:
        "Le rapport au monde à travers la technique, la science et le travail.",
    },
    "human-condition": {
      title: "La condition humaine",
      description:
        "La personne et l'autre : identité, liberté et altérité.",
    },
    politics: {
      title: "La politique",
      description: "L'État, le droit et la justice, la violence.",
    },
    knowledge: {
      title: "La connaissance",
      description: "Théorie et expérience, vérité, sciences.",
    },
    morality: {
      title: "La morale",
      description: "Le devoir, le bonheur, la liberté.",
    },
  },
  en: {
    "intro-philosophy": {
      title: "The Birth of Philosophy",
      description:
        "From myth to reasoned argument: the first philosophical concepts and questions.",
    },
    humanity: {
      title: "The Human Being",
      description:
        "Dimensions of human existence: consciousness, desire and language.",
    },
    effectiveness: {
      title: "Action and Creation",
      description:
        "How humans engage with the world through technique, science and work.",
    },
    "human-condition": {
      title: "The Human Condition",
      description: "The self and the other: identity, freedom and otherness.",
    },
    politics: {
      title: "Politics",
      description: "The state, right and justice, violence.",
    },
    knowledge: {
      title: "Knowledge",
      description: "Theory and experience, truth, the sciences.",
    },
    morality: {
      title: "Ethics",
      description: "Duty, happiness, freedom.",
    },
  },
};


export function getLevelCopy(locale: Locale, level: LevelId) {
  return LEVEL_COPY[locale][level];
}

export function getModuleCopy(
  locale: Locale,
  module: Pick<Module, "id" | "title" | "description">,
) {
  return (
    MODULE_COPY[locale][module.id] ?? {
      title: module.title,
      description: module.description,
    }
  );
}
