import Head from "next/head";
import SkillBadge from "../components/SkillBadge";
import Reveal from "../components/Reveal";

import skillCategoriesData from "../data/skills.json";
const skillCategories = skillCategoriesData;

export default function Skills() {
  return (
    <main id="main-content" tabIndex={-1} className="relative mx-auto max-w-7xl px-6 pt-24 pb-20 sm:px-8 lg:px-10">
      <Head>
        <title>Skills & Tech Stack | Md Raffiul Islam</title>
        <meta
          name="description"
          content="Technical skills of Md Raffiul Islam across Angular, Spring Boot, databases, CI/CD, enterprise platforms, and AI-assisted development tools."
        />
      </Head>
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-cyan-100/30 to-blue-100/30 dark:from-cyan-500/10 dark:to-indigo-500/10 blur-[110px] -z-10" />

      <section className="container-centered mb-20 max-w-3xl fade-in-up">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-300">Skills & Tech Stack</p>
        <h1 className="mt-6 text-5xl font-black tracking-tight text-slate-900 dark:text-white sm:text-6xl">
          Building <span className="gradient-text">Enterprise Software</span>
        </h1>
        <p className="mt-6 text-slate-600 dark:text-slate-400 leading-relaxed text-lg text-center">
          My stack covers frontend architecture, secure backend services, programming
          languages, data platforms, and the tools needed to deliver reliable systems.
        </p>
      </section>

      <section className="mx-auto grid gap-8 md:grid-cols-2 xl:max-w-7xl xl:grid-cols-3">
        {skillCategories.map((category, i) => (
          <Reveal key={category.title} delay={i * 120} className="h-full">
            <div className="group glass-card flex h-[32rem] flex-col rounded-[2.5rem] p-8 text-center transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-cyan-500/10 sm:p-10">
              <h2 className="mb-6 flex min-h-16 shrink-0 items-center justify-center text-2xl font-black text-slate-900 transition-colors group-hover:text-cyan-600 dark:text-white dark:group-hover:text-cyan-300">
                {category.title}
              </h2>
              <div className="skill-scroll grid flex-1 content-start gap-3 overflow-y-auto pr-2">
                {category.skills.map((skill) => (
                  <SkillBadge key={skill} label={skill} />
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </section>
    </main>
  );
}
