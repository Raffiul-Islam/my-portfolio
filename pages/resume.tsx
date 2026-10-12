import Head from "next/head";
import dynamic from "next/dynamic";
import { useState } from "react";
import type { ResumeVariant } from "../data/resume-variants";
import ResumeDownloadButton from "../components/ResumeDownloadButton";
import ResumeLoadingState from "../components/ResumeLoadingState";

const ResumePdfViewer = dynamic(() => import("../components/ResumePdfViewer"), {
  ssr: false,
  loading: () => <ResumeLoadingState />,
});

export default function Resume() {
  const [variant, setVariant] = useState<ResumeVariant>("corporate");
  return (
    <>
      <Head>
        <title>Resume | Md Raffiul Islam</title>
        <meta
          name="description"
          content="Resume of Md Raffiul Islam, Software Engineer."
        />
      </Head>

      <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-4 pb-12 pt-24 sm:px-6">
        <div className="mb-4 flex justify-end">
          <ResumeDownloadButton onVariantChange={setVariant} />
        </div>

        <ResumePdfViewer key={variant} variant={variant} />
      </main>
    </>
  );
}
