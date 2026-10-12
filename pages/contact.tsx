import profile from "../data/profile.json";
import Head from "next/head";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import Reveal from "../components/Reveal";

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      action: string;
      theme: "auto";
      size: "flexible";
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    },
  ) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

type ContactIconName = "email" | "linkedin" | "github" | "whatsapp";

import contactsData from "../data/contacts.json";
const contacts = contactsData as Array<{ title: string; value: string; href: string; icon: ContactIconName; external?: boolean }>;

const CONTACT_EMAIL = contacts.find((contact) => contact.icon === "email")!.value;
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const REASON_OPTIONS = [
  "Professional opportunity",
  "Freelance project",
  "Technical collaboration",
  "General inquiry",
] as const;

type ReasonOption = (typeof REASON_OPTIONS)[number];

function ReasonSelect({ value, onChange }: { value: ReasonOption; onChange: (value: ReasonOption) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() => REASON_OPTIONS.indexOf(value));

  useEffect(() => {
    const handleOutsideClick = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    return () => document.removeEventListener("pointerdown", handleOutsideClick);
  }, []);

  const selectOption = (option: ReasonOption) => {
    onChange(option);
    setActiveIndex(REASON_OPTIONS.indexOf(option));
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      setIsOpen(true);
      setActiveIndex((current) => (current + direction + REASON_OPTIONS.length) % REASON_OPTIONS.length);
      return;
    }

    if ((event.key === "Enter" || event.key === " ") && isOpen) {
      event.preventDefault();
      selectOption(REASON_OPTIONS[activeIndex]);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <input type="hidden" name="reason" value={value} />
      <button
        ref={buttonRef}
        id="reason"
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls="reason-options"
        aria-activedescendant={isOpen ? `reason-option-${activeIndex}` : undefined}
        onClick={() => {
          setActiveIndex(REASON_OPTIONS.indexOf(value));
          setIsOpen((open) => !open);
        }}
        onKeyDown={handleKeyDown}
        className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border border-slate-300 bg-white px-6 py-4 text-left text-slate-900 shadow-sm shadow-slate-300/40 outline-none transition hover:border-slate-400 focus:border-cyan-600 focus:ring-4 focus:ring-cyan-500/15 dark:border-white/10 dark:bg-slate-800 dark:text-white dark:shadow-none dark:hover:border-white/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/10"
      >
        <span className="min-w-0 truncate">{value}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen ? (
        <div
          id="reason-options"
          role="listbox"
          aria-label="Reason for contact"
          className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-sky-50 p-2 shadow-2xl shadow-slate-400/30 dark:border-white/10 dark:bg-slate-900 dark:shadow-black/50"
        >
          {REASON_OPTIONS.map((option, index) => {
            const isActive = index === activeIndex;
            const isSelected = option === value;

            return (
              <button
                key={option}
                id={`reason-option-${index}`}
                type="button"
                role="option"
                aria-selected={isSelected}
                onPointerEnter={() => setActiveIndex(index)}
                onClick={() => selectOption(option)}
                className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                  isActive
                    ? "bg-cyan-100 text-cyan-900 dark:bg-cyan-400/15 dark:text-cyan-200"
                    : "text-slate-700 hover:bg-white dark:text-slate-300 dark:hover:bg-white/5"
                }`}
              >
                <span>{option}</span>
                {isSelected ? <span aria-hidden="true" className="text-cyan-600 dark:text-cyan-300">✓</span> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function ContactIcon({ name }: { name: ContactIconName }) {
  if (name === "email") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <rect width="18" height="14" x="3" y="5" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    );
  }

  if (name === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M19 0H5a5 5 0 0 0-5 5v14a5 5 0 0 0 5 5h14a5 5 0 0 0 5-5V5a5 5 0 0 0-5-5ZM8 19H5V8h3v11ZM6.5 6.73A1.75 1.75 0 1 1 6.5 3.2a1.75 1.75 0 0 1 0 3.53ZM20 19h-3v-5.6c0-3.37-4-3.12-4 0V19h-3V8h3v1.77C14.4 7.18 20 7 20 12.24V19Z" />
      </svg>
    );
  }

  if (name === "github") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 0C5.37 0 0 5.37 0 12a12 12 0 0 0 8.21 11.39c.6.11.79-.26.79-.58v-2.23c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23A11.5 11.5 0 0 1 12 5.8c1.02 0 2.05.14 3.01.4 2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.3c0 .32.19.69.8.57A12 12 0 0 0 12 0Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12.04 0A11.94 11.94 0 0 0 1.76 18l-1.7 6 6.17-1.62A12 12 0 1 0 12.04 0Zm0 21.82a9.8 9.8 0 0 1-5-1.37l-.36-.21-3.66.96.98-3.57-.23-.37A9.8 9.8 0 1 1 12.04 21.82Zm5.37-7.35c-.3-.15-1.74-.86-2.01-.96-.27-.1-.47-.15-.67.15-.2.3-.76.96-.94 1.16-.17.2-.34.22-.64.07-.29-.15-1.24-.46-2.36-1.46a8.8 8.8 0 0 1-1.63-2.03c-.17-.3-.02-.46.13-.6.13-.13.3-.34.44-.51.15-.17.2-.3.3-.49.1-.2.05-.37-.03-.52-.07-.15-.66-1.6-.91-2.18-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.03 1-1.03 2.45s1.06 2.85 1.2 3.05c.15.2 2.08 3.17 5.04 4.45.7.3 1.25.48 1.68.62.71.22 1.35.19 1.86.11.57-.08 1.74-.71 1.99-1.4.24-.68.24-1.27.17-1.39-.07-.12-.27-.2-.56-.34Z" />
    </svg>
  );
}

export default function Contact() {
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);
  const [submitNotice, setSubmitNotice] = useState("");
  const [submissionState, setSubmissionState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [reason, setReason] = useState<ReasonOption>(REASON_OPTIONS[0]);

  useEffect(() => {
    return () => {
      if (turnstileWidgetIdRef.current && window.turnstile) {
        window.turnstile.remove(turnstileWidgetIdRef.current);
        turnstileWidgetIdRef.current = null;
      }
    };
  }, []);

  const renderTurnstile = () => {
    if (
      !TURNSTILE_SITE_KEY ||
      !window.turnstile ||
      !turnstileContainerRef.current ||
      turnstileWidgetIdRef.current
    ) {
      return;
    }

    turnstileWidgetIdRef.current = window.turnstile.render(
      turnstileContainerRef.current,
      {
        sitekey: TURNSTILE_SITE_KEY,
        action: "contact",
        theme: "auto",
        size: "flexible",
        callback: (token) => {
          setTurnstileToken(token);
        },
        "expired-callback": () => {
          setTurnstileToken("");
          setSubmissionState("error");
          setSubmitNotice("The security check expired. Please complete it again.");
        },
        "error-callback": () => {
          setTurnstileToken("");
          setSubmissionState("error");
          setSubmitNotice("The security check could not load. Please refresh and try again.");
        },
      },
    );
  };

  const resetTurnstile = () => {
    setTurnstileToken("");
    if (turnstileWidgetIdRef.current && window.turnstile) {
      window.turnstile.reset(turnstileWidgetIdRef.current);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!turnstileToken) {
      setSubmissionState("error");
      setSubmitNotice("Please complete the security check before sending your message.");
      return;
    }

    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    setSubmissionState("sending");
    setSubmitNotice("Sending your message...");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(form.entries()),
          turnstileToken,
        }),
      });
      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message || "The message could not be sent.");
      }

      setSubmissionState("success");
      setSubmitNotice(payload.message || "Thanks! Your message has been sent successfully.");
      formElement.reset();
      setReason(REASON_OPTIONS[0]);
    } catch (error) {
      setSubmissionState("error");
      setSubmitNotice(
        error instanceof Error
          ? error.message
          : "The message could not be sent. Please try again.",
      );
    } finally {
      resetTurnstile();
    }
  };

  return (
    <main id="main-content" tabIndex={-1} className="relative mx-auto max-w-5xl px-6 pt-24 pb-20 sm:px-8 lg:px-10">
      <Head>
        <title>Contact | Md Raffiul Islam</title>
        <meta
          name="description"
          content="Get in touch with Md Raffiul Islam for full-stack development projects and collaboration."
        />
      </Head>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={renderTurnstile}
        onError={() => {
          setSubmissionState("error");
          setSubmitNotice("The security check could not load. Please refresh and try again.");
        }}
      />
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-cyan-100/30 to-blue-100/30 dark:from-cyan-500/10 dark:to-indigo-500/10 blur-[110px] -z-10" />

      <section className="container-centered mb-16 fade-in-up">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-300">Contact</p>
        <h1 className="mt-6 text-center text-5xl font-black leading-tight tracking-tight text-slate-900 dark:text-white sm:text-6xl">
          Let&apos;s build something <span className="gradient-text">great</span> together
        </h1>
        <p className="mt-6 max-w-2xl text-center text-lg leading-relaxed text-slate-600 dark:text-slate-400">
          Have a project, engineering challenge, or professional opportunity in mind? Share a little context and I&apos;ll respond as soon as possible.
        </p>
      </section>

      <div className="grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal>
          <aside className="section-panel overflow-hidden p-7 sm:p-9">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-400/20 dark:bg-emerald-400/10">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                </span>
                <p className="m-0 text-left text-xs font-black uppercase tracking-[0.2em] text-emerald-800 dark:text-emerald-300">
                  Open to opportunities
                </p>
              </div>
              <p className="mt-3 text-left text-sm leading-relaxed text-emerald-900/75 dark:text-emerald-100/70">
                Available for professional roles, engineering collaborations, and meaningful software projects.
              </p>
            </div>

            <div className="mt-8">
              <p className="text-left text-xs font-bold uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-300">Contact details</p>
              <h2 className="mt-3 text-left text-3xl font-black text-slate-900 dark:text-white">Let&apos;s start a conversation</h2>
              <p className="mt-3 text-left text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Choose the channel that works best for you. Email is preferred for detailed inquiries.
              </p>
            </div>

            <address className="mt-7 space-y-3 not-italic">
              {contacts.map((contact) => (
                <a
                  key={contact.title}
                  href={contact.href}
                  target={contact.external ? "_blank" : undefined}
                  rel={contact.external ? "noreferrer" : undefined}
                  className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-linear-to-br from-sky-50 via-cyan-50/70 to-indigo-50/80 p-4 shadow-sm shadow-slate-200/60 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md dark:border-white/10 dark:bg-none dark:bg-white/5 dark:shadow-black/20 dark:hover:border-cyan-400/40"
                >
                  <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-xs font-black text-cyan-700 transition group-hover:bg-cyan-100 dark:bg-cyan-400/10 dark:text-cyan-300 dark:group-hover:bg-cyan-400/20">
                    <ContactIcon name={contact.icon} />
                  </span>
                  <span className="min-w-0 text-left">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{contact.title}</span>
                    <span className="mt-1 block truncate text-sm font-bold text-slate-900 group-hover:text-cyan-700 dark:text-white dark:group-hover:text-cyan-300">{contact.value}</span>
                  </span>
                  {contact.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
                </a>
              ))}
            </address>

            <dl className="mt-7 grid grid-cols-2 gap-3 border-t border-slate-200 pt-6 text-center dark:border-white/10">
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
                <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Location</dt>
                <dd className="mt-2 text-sm font-black text-slate-900 dark:text-white">{profile.location}</dd>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
                <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Response</dt>
                <dd className="mt-2 text-sm font-black text-slate-900 dark:text-white">Within 24–48 hours</dd>
              </div>
            </dl>
            <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
              Bangladesh Standard Time (UTC+6) &middot; Remote collaboration welcome
            </p>
          </aside>
        </Reveal>

        <Reveal delay={120}>
          <form onSubmit={handleSubmit} className="space-y-6 rounded-[2.5rem] border border-slate-200 bg-linear-to-br from-sky-50 via-cyan-50/70 to-indigo-50/80 p-7 shadow-xl shadow-slate-300/50 transition-all hover:-translate-y-0.5 dark:border-white/10 dark:bg-none dark:bg-slate-900/60 dark:shadow-black/30 sm:p-10">
            <div>
              <p className="text-left text-xs font-bold uppercase tracking-[0.25em] text-indigo-600 dark:text-indigo-300">Send an inquiry</p>
              <h2 className="mt-3 text-left text-3xl font-black text-slate-900 dark:text-white">Let&apos;s discuss how I can help</h2>
              <p className="mt-3 text-left text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Include the goal, current challenge, and how you think I can contribute.
              </p>
            </div>

            <div className="absolute -left-[9999px]" aria-hidden="true">
              <label htmlFor="contact-check-field">Leave this field empty</label>
              <input
                id="contact-check-field"
                name="contactCheck"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                readOnly
                data-1p-ignore
                data-lpignore="true"
                data-form-type="other"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="ml-2 text-sm font-bold text-slate-700 dark:text-slate-400" htmlFor="name">Name</label>
                <input id="name" type="text" name="name" required autoComplete="name" maxLength={80} className="w-full rounded-2xl border border-slate-300 bg-white px-6 py-4 text-slate-900 shadow-sm shadow-slate-300/40 outline-none transition placeholder:text-slate-500 hover:border-slate-400 focus:border-cyan-600 focus:ring-4 focus:ring-cyan-500/15 dark:border-white/10 dark:bg-white/5 dark:text-white dark:shadow-none dark:placeholder:text-slate-500 dark:hover:border-white/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/10" placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <label className="ml-2 text-sm font-bold text-slate-700 dark:text-slate-400" htmlFor="email">Email</label>
                <input id="email" type="email" name="email" required autoComplete="email" maxLength={120} className="w-full rounded-2xl border border-slate-300 bg-white px-6 py-4 text-slate-900 shadow-sm shadow-slate-300/40 outline-none transition placeholder:text-slate-500 hover:border-slate-400 focus:border-cyan-600 focus:ring-4 focus:ring-cyan-500/15 dark:border-white/10 dark:bg-white/5 dark:text-white dark:shadow-none dark:placeholder:text-slate-500 dark:hover:border-white/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/10" placeholder="you@example.com" />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="ml-2 text-sm font-bold text-slate-700 dark:text-slate-400" htmlFor="reason">Reason for contact</label>
                <ReasonSelect value={reason} onChange={setReason} />
              </div>
              <div className="space-y-2">
                <label className="ml-2 text-sm font-bold text-slate-700 dark:text-slate-400" htmlFor="subject">Subject</label>
                <input id="subject" type="text" name="subject" maxLength={140} className="w-full rounded-2xl border border-slate-300 bg-white px-6 py-4 text-slate-900 shadow-sm shadow-slate-300/40 outline-none transition placeholder:text-slate-500 hover:border-slate-400 focus:border-cyan-600 focus:ring-4 focus:ring-cyan-500/15 dark:border-white/10 dark:bg-white/5 dark:text-white dark:shadow-none dark:placeholder:text-slate-500 dark:hover:border-white/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/10" placeholder="A short summary" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="ml-2 text-sm font-bold text-slate-700 dark:text-slate-400" htmlFor="message">Message</label>
              <textarea id="message" name="message" rows={6} required minLength={10} maxLength={2000} className="w-full resize-y rounded-2xl border border-slate-300 bg-white px-6 py-4 text-slate-900 shadow-sm shadow-slate-300/40 outline-none transition placeholder:text-slate-500 hover:border-slate-400 focus:border-cyan-600 focus:ring-4 focus:ring-cyan-500/15 dark:border-white/10 dark:bg-white/5 dark:text-white dark:shadow-none dark:placeholder:text-slate-500 dark:hover:border-white/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/10" placeholder="Tell me about the opportunity or project" />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/60">
              {TURNSTILE_SITE_KEY ? (
                <div ref={turnstileContainerRef} className="min-h-[65px] w-full" />
              ) : (
                <p className="py-3 text-center text-sm font-semibold text-red-700 dark:text-red-300">
                  Security verification is not configured.
                </p>
              )}
            </div>

            <button type="submit" disabled={submissionState === "sending" || !turnstileToken} aria-busy={submissionState === "sending"} className="inline-flex min-h-[3.5rem] w-full cursor-pointer overflow-hidden rounded-2xl bg-white p-px shadow-lg shadow-indigo-100 transition-transform hover:scale-[1.01] focus-visible:outline-indigo-400 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-950 dark:shadow-black/25 dark:focus-visible:outline-indigo-300">
              <span className="inline-flex min-h-[calc(3.5rem-2px)] w-full items-center justify-center rounded-[15px] bg-gradient-to-r from-cyan-500 to-indigo-500 px-8 py-4 text-sm font-bold text-white transition-[filter] hover:brightness-105">
                {submissionState === "sending" ? "Sending message..." : "Send Message"}
              </span>
            </button>
            <p className="text-center text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Your message is delivered securely. You can also email me directly at{" "}
              <a className="font-semibold underline underline-offset-4" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
              {" "}Your details are used only to respond to your inquiry.
            </p>
            <p
              aria-live="polite"
              role={submissionState === "error" ? "alert" : "status"}
              className={`min-h-6 text-center text-sm font-semibold ${
                submissionState === "success"
                  ? "text-emerald-700 dark:text-emerald-300"
                  : submissionState === "error"
                    ? "text-red-700 dark:text-red-300"
                    : "text-cyan-700 dark:text-cyan-300"
              }`}
            >
              {submitNotice}
            </p>
          </form>
        </Reveal>
      </div>
    </main>
  );
}
