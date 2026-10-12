import profile from "../data/profile.json";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import ProjectCard from "../components/ProjectCard";
import Reveal from "../components/Reveal";
import { projects } from "../data/projects";
import profileImage from "../public/images/portfolio-photo.webp";

const selectedProjectSlugs = ["snsop", "mims", "tms", "itlms"];
const selectedProjects = selectedProjectSlugs
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter((project): project is (typeof projects)[number] => Boolean(project));

const deliveryStrengths = profile.deliveryStrengths;

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1} className="relative mx-auto max-w-7xl px-6 pb-20 pt-20 sm:px-8 lg:px-10">
      <Head>
        <title>Md Raffiul Islam - Software Engineer</title>
        <meta
          name="description"
          content="Portfolio of Md Raffiul Islam, a Software Engineer building secure enterprise platforms with Angular, Spring Boot, and carefully validated AI-assisted workflows."
        />
      </Head>

      <div className="absolute left-1/2 top-32 -z-10 h-[420px] w-[680px] max-w-[90vw] -translate-x-1/2 bg-gradient-to-tr from-cyan-100/50 to-indigo-100/30 blur-[110px] dark:from-cyan-500/15 dark:to-indigo-500/10" />

      <section className="fade-in-up hero-card relative overflow-hidden px-7 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-16">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-50/70 via-transparent to-indigo-100/30 dark:from-cyan-500/10 dark:to-indigo-500/5" />

        <div className="relative grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div className="order-2 text-center lg:order-1 lg:text-left">
            <div className="inline-flex max-w-full items-center justify-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-4 py-2 text-center text-[10px] font-bold uppercase leading-relaxed tracking-[0.16em] text-cyan-700 shadow-sm shadow-cyan-100/60 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-300 dark:shadow-cyan-500/10 sm:tracking-[0.25em]">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
              {profile.role} at {profile.company}
            </div>

            <h1 className="mt-7 text-center text-4xl font-black leading-[1.05] tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-left lg:text-7xl">
              Engineering secure platforms for{" "}
              <span className="gradient-text">complex operations</span>
            </h1>
            <p className="mx-auto mt-7 max-w-2xl text-center text-lg leading-relaxed text-slate-600 dark:text-slate-400 sm:text-xl lg:mx-0 lg:text-left">
              {profile.summary}
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-4 lg:justify-start">
              <Link
                href="/projects"
                className="inline-flex min-h-14 items-center justify-center rounded-xl bg-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 dark:bg-indigo-500 dark:shadow-indigo-500/20 dark:hover:bg-indigo-400"
              >
                Explore my work
              </Link>
              <Link
                href="/resume"
                className="inline-flex min-h-14 items-center justify-center rounded-xl border border-slate-200 bg-white/80 px-8 py-3 text-sm font-bold text-slate-800 transition hover:-translate-y-0.5 hover:border-cyan-400 hover:text-cyan-700 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-cyan-400 dark:hover:text-cyan-300"
              >
                View resume
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-14 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 px-8 py-3 text-sm font-bold text-emerald-800 transition hover:-translate-y-0.5 hover:border-emerald-400 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300"
              >
                Contact me
              </Link>
            </div>
          </div>

          <aside className="order-1 mx-auto w-full max-w-md rounded-[2rem] border border-slate-200 bg-linear-to-br from-sky-50 via-cyan-50/70 to-indigo-50/80 p-6 shadow-2xl shadow-slate-300/50 backdrop-blur-md dark:border-white/10 dark:bg-none dark:bg-slate-900/70 dark:shadow-black/30 sm:p-8 lg:order-2">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-300 to-indigo-400 opacity-35 blur-2xl dark:from-cyan-400 dark:to-indigo-500" />
                <div className="relative h-36 w-36 overflow-hidden rounded-full border-4 border-white bg-white shadow-xl dark:border-white/10 dark:bg-slate-900 sm:h-44 sm:w-44">
                  <Image
                    src={profileImage}
                    alt="Md Raffiul Islam"
                    sizes="(max-width: 639px) 144px, 176px"
                    placeholder="blur"
                    loading="eager"
                    className="h-full w-full object-cover object-top"
                  />
                </div>
              </div>
              <h2 className="mt-6 text-3xl font-black text-slate-900 dark:text-white">
                {profile.name}
              </h2>
              <p className="mt-2 text-sm font-semibold text-cyan-700 dark:text-cyan-300">
                Software Engineer &middot; Full-stack Enterprise Systems
              </p>
              <p className="mt-5 max-w-sm text-center text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Working across frontend, backend, data, security, integration, and deployment to
                turn complex requirements into maintainable software.
              </p>
            </div>

            <dl className="mt-7 grid grid-cols-3 gap-3 border-t border-slate-200/80 pt-6 text-center dark:border-white/10">
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500">Work</dt>
                <dd className="mt-1 text-lg font-black text-slate-900 dark:text-white">{projects.length}</dd>
                <dd className="text-[10px] text-slate-500 dark:text-slate-400">platforms</dd>
              </div>
              <div className="border-x border-slate-200/80 dark:border-white/10">
                <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500">Role</dt>
                <dd className="mt-1 text-sm font-black text-slate-900 dark:text-white">Full-stack</dd>
                <dd className="text-[10px] text-slate-500 dark:text-slate-400">engineering</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500">Since</dt>
                <dd className="mt-1 text-lg font-black text-slate-900 dark:text-white">2024</dd>
                <dd className="text-[10px] text-slate-500 dark:text-slate-400">at Karooth IT</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section aria-labelledby="selected-work" className="mt-32">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-300">
              Selected work
            </p>
            <h2 id="selected-work" className="mt-5 text-4xl font-black text-slate-900 dark:text-white sm:text-5xl">
              Enterprise software built around{" "}
              <span className="gradient-text">real operations</span>
            </h2>
            <p className="mt-6 max-w-2xl text-center text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              A selection of platforms covering social protection, institutional administration,
              and the complete training lifecycle.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {selectedProjects.map((project, index) => (
            <Reveal
              key={project.slug}
              className={`h-full ${index === 3 ? "xl:hidden" : ""}`}
              delay={index * 100}
            >
              <ProjectCard
                title={project.title}
                description={project.description}
                tags={project.stack}
                href={`/projects/${project.slug}`}
                image={project.image}
              />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 flex justify-center">
          <Link
            href="/projects"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white/70 px-7 py-3 text-sm font-bold text-slate-700 transition hover:border-cyan-400 hover:text-cyan-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-cyan-400 dark:hover:text-cyan-300"
          >
            View all projects
          </Link>
        </Reveal>
      </section>

      <section id="about" aria-labelledby="about-heading" className="mt-36 scroll-mt-28">
        <Reveal className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="text-center lg:text-left">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-300 lg:text-left">
              About me
            </p>
            <h2 id="about-heading" className="mt-5 text-center text-4xl font-black leading-tight text-slate-900 dark:text-white sm:text-5xl lg:text-left">
              Turning complex workflows into{" "}
              <span className="gradient-text">secure, scalable software</span>
            </h2>
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              <p className="text-center lg:text-left">
                {profile.about}
              </p>
              <p className="text-center lg:text-left">
                I use AI-assisted development workflows to accelerate research, implementation,
                debugging, testing, and documentation. Every output is carefully reviewed and
                validated for correctness, security, and maintainability, ensuring that sound
                technical judgment remains responsible for the final result.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              {["Angular", "TypeScript", "Java", "Spring Boot", "REST APIs", "MSSQL", "PostgreSQL", "CI/CD"].map((skill) => (
                <span key={skill} className="rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-bold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <aside className="section-panel p-7 sm:p-9">
            <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-300">
              What I bring
            </p>
            <div className="mt-7 space-y-4">
              {deliveryStrengths.map((strength, index) => (
                <div key={strength.title} className="rounded-2xl border border-slate-200 bg-linear-to-br from-sky-50 via-cyan-50/70 to-indigo-50/80 p-5 shadow-md shadow-slate-300/50 dark:border-white/10 dark:bg-none dark:bg-white/5 dark:shadow-black/20">
                  <div className="flex items-start gap-4">
                    <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-sm font-black text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-left text-base font-black text-slate-900 dark:text-white">{strength.title}</h3>
                      <p className="mt-2 text-left text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        {strength.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/skills"
              className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-indigo-500 dark:hover:brightness-110"
            >
              Explore the full skill set
            </Link>
          </aside>
        </Reveal>
      </section>

      <Reveal>
        <section className="relative mt-36 overflow-hidden rounded-[2.5rem] border border-cyan-100 bg-gradient-to-br from-cyan-50 to-indigo-50 px-7 py-12 text-center shadow-xl shadow-cyan-100/30 dark:border-cyan-400/20 dark:from-cyan-500/10 dark:to-indigo-500/10 dark:shadow-cyan-500/5 sm:px-12 sm:py-14">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-700 dark:text-cyan-300">
            Let&apos;s work together
          </p>
          <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-black leading-tight text-slate-900 dark:text-white sm:text-5xl">
            Need an engineer who can work across the complete delivery stack?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Let&apos;s discuss your application, architecture, integration, or modernization challenge.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="inline-flex min-h-14 items-center justify-center rounded-xl bg-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 dark:bg-indigo-500 dark:shadow-indigo-500/20 dark:hover:bg-indigo-400">
              Start a conversation
            </Link>
            <Link href="/resume" className="inline-flex min-h-14 items-center justify-center rounded-xl border border-slate-300 bg-white/80 px-8 py-3 text-sm font-bold text-slate-800 transition hover:-translate-y-0.5 hover:border-cyan-400 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-cyan-400">
              Review my resume
            </Link>
          </div>
        </section>
      </Reveal>
    </main>
  );
}
