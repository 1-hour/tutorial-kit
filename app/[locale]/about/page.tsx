import { getSiteConfig, getUIStrings, isValidLocale, getLocales } from '@/lib/content';
import type { Locale } from '@/lib/types';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return getLocales().map((locale) => ({ locale }));
}

const ABOUT_CONTENT: Record<Locale, { intro: string; mission: string; principles: string[] }> = {
  en: {
    intro: "1 Hour Guide is a collection of hands-on tutorials designed to fit in 60 minutes. No fluff, no endless theory — just practical skills you can use right away.",
    mission: "Learning should be fast, focused, and rewarding. Every tutorial here follows one rule: you can complete it in an hour and walk away with a working skill.",
    principles: [
      "Time-boxed: Every tutorial fits in 60 minutes.",
      "Outcome-first: Start with what you'll build.",
      "Hands-on: Code first, theory only when needed.",
      "Checkpoints: Verify your progress at each step.",
      "Open source: All content is free and contributions welcome.",
    ],
  },
  zh: {
    intro: "1 小时指南是一套精心设计的动手教程，每篇都能在 60 分钟内读完。没有废话，没有冗长的理论——只有你立刻能用上的实用技能。",
    mission: "学习应该是快速、专注、有成就感的。这里的每篇教程都遵循一个规则：一小时内完成，学完就能真正上手。",
    principles: [
      "时间盒：每个教程控制在 60 分钟内。",
      "结果导向：先告诉你要做出什么。",
      "动手优先：代码先行，理论按需。",
      "检查点：每步都可以验证进度。",
      "开源：内容全部免费，欢迎贡献。",
    ],
  },
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const loc = locale as Locale;

  const site = getSiteConfig();
  const ui = getUIStrings(loc);
  const content = ABOUT_CONTENT[loc];

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-6">{ui.nav.about}</h1>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="lead">{content.intro}</p>

        <h2>{loc === 'zh' ? '使命' : 'Mission'}</h2>
        <p>{content.mission}</p>

        <h2>{loc === 'zh' ? '原则' : 'Principles'}</h2>
        <ul>
          {content.principles.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>

        <h2>{loc === 'zh' ? '作者' : 'Author'}</h2>
        <p>
          {loc === 'zh' ? '由 ' : 'Built by '}
          <a href={site.author.url} target="_blank" rel="noopener noreferrer">
            {site.author.name}
          </a>
          {loc === 'zh' ? '创建和维护。' : '.'}
        </p>
      </div>
    </section>
  );
}
