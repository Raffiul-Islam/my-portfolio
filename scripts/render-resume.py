"""Fill the LaTeX template, compile locally, validate, then replace the PDF."""
import json
import os
import re
import shutil
import subprocess
import sys
import unicodedata
from datetime import date
from pathlib import Path
from urllib.parse import urlsplit

try:
    from pypdf import PdfReader
except ImportError:
    sys.exit("Install PDF validation dependencies: python -m pip install -r scripts/requirements-resume.txt")

ROOT = Path(__file__).resolve().parent.parent


def tex(value):
    replacements = {
        "\\": r"\textbackslash{}", "&": r"\&", "%": r"\%", "$": r"\$",
        "#": r"\#", "_": r"\_", "{": r"\{", "}": r"\}",
        "~": r"\textasciitilde{}", "^": r"\textasciicircum{}",
    }
    return "".join(replacements.get(c, c) for c in str(value))


def link(label, url):
    if urlsplit(url).scheme not in {"https", "http", "mailto", "tel"}:
        raise ValueError(f"Unsupported link: {url}")
    for char, encoded in [("\\", "%5C"), ("{", "%7B"), ("}", "%7D"), ("\n", "%0A"), ("\r", "%0D")]:
        url = url.replace(char, encoded)
    url = url.replace("%", r"\%").replace("#", r"\#")
    return r"\href{" + url + "}{" + tex(label) + "}"


def generate(data, variant):
    profile, resume = data["profile"], data["resume"]
    selected = []
    for entry in resume["experienceHighlights"]:
        project = next((p for p in data["projects"] if p["title"] == entry["project"]), None)
        if project is None:
            raise ValueError(f'Unknown resume project: {entry["project"]}')
        indexes = entry["highlightIndexes"]
        if not indexes or any(type(i) is not int or i < 0 or i >= len(project["highlights"]) for i in indexes):
            raise ValueError(f'Invalid highlight indexes for {entry["project"]}')
        selected.append(r"\item \textbf{" + tex(entry["label"]) + "} -- " + tex(" ".join(project["highlights"][i] for i in indexes)))

    contacts = [r"\faMapMarker*\ " + tex(profile["location"])]
    icons = {"email": r"\faEnvelope", "linkedin": r"\faLinkedinIn", "github": r"\faGithub", "whatsapp": r"\faPhone*"}
    for item in data["contacts"]:
        label = item["value"] if item["icon"] != "linkedin" else "LinkedIn"
        contacts.append(icons[item["icon"]] + r"\ " + link(label, item["href"]))

    education = []
    for item in resume["education"]:
        education.append(r"\textbf{" + tex(item["institution"]) + r"}\hfill \textit{" + tex(item["period"]) + r"}\\" + "\n" + tex(item["qualification"]) + r"\par")
    refs = resume.get("references", [])
    references = []
    for i in range(0, len(refs), 2):
        columns = []
        for item in refs[i:i + 2]:
            columns.append(r"\begin{minipage}[t]{\linewidth}\textbf{" + tex(item["name"]) + r"}\\" + tex(item["role"]) + r"\\Phone: " + tex(item["phone"]) + r"\\Email: " + link(item["email"], "mailto:" + item["email"]) + r"\end{minipage}")
        references.append(" & ".join(columns) + r"\\[3pt]")
    values = {
        "VARIANT": r"\corporatetrue" if variant == "corporate" else r"\corporatefalse",
        "NAME": tex(profile["name"]), "CONTACTS": r"\quad ".join(contacts),
        "PROFILE": tex(profile["summary"]) + "\n\n" + tex(profile["about"]),
        "SKILLS": "\n".join(r"\textbf{" + tex(c["title"]) + ":} " + tex(", ".join(c["skills"])) + r"\par" for c in data["skills"]),
        "ROLE": tex(profile["role"]), "COMPANY": tex(profile["company"]),
        "EMPLOYMENT": tex(profile["employmentPeriod"]), "EXPERIENCE": "\n".join(selected),
        "EDUCATION": "\n".join(education), "REFERENCES": "\n".join(references),
        "UPDATED": date.today().strftime("%B %Y"),
    }
    template = (ROOT / "scripts/resume-template.tex").read_text(encoding="utf-8")
    source = re.sub(r"@@([A-Z]+)@@", lambda match: values[match[1]], template)
    build = ROOT / ".resume-build"
    build.mkdir(exist_ok=True)
    if variant == "corporate":
        shutil.copy2(ROOT / "public/images/resume-photo.jpg", build / "resume-photo.jpg")
    source_path = build / f"resume-{variant}.tex"
    source_path.write_text(source, encoding="utf-8")

    local = ROOT / ".tools/tectonic/tectonic.exe"
    compiler = os.environ.get("TECTONIC") or (str(local) if local.exists() else shutil.which("tectonic"))
    if not compiler:
        raise RuntimeError("Install Tectonic or set TECTONIC to its executable path. LaTeX source is available at .resume-build/resume.tex.")
    # Direct official bundle URL avoids a slow relay redirect on this connection.
    bundle = os.environ.get("TECTONIC_BUNDLE", "https://data1b.fullyjustified.net/tlextras-2022.0r0.tar")
    result = subprocess.run([compiler, "--untrusted", "--keep-logs", "--bundle", bundle, "--outdir", str(build), str(source_path)], cwd=ROOT, timeout=600)
    if result.returncode:
        raise RuntimeError("LaTeX compilation failed. See compiler output above; existing PDF was preserved.")
    log = source_path.with_suffix(".log").read_text(encoding="utf-8", errors="replace")
    if "Overfull \\hbox" in log or "Overfull \\vbox" in log:
        raise ValueError("LaTeX content overflows its layout; adjust scripts/resume-template.tex. See .resume-build/resume.log. Existing PDF was preserved.")
    generated = source_path.with_suffix(".pdf")
    pdf = PdfReader(generated, strict=True)
    if len(pdf.pages) != 1:
        raise ValueError(f"Resume is {len(pdf.pages)} pages. Shorten content or select fewer experience highlights in data/resume.json. Existing PDF was preserved.")
    # LaTeX fonts may extract ligatures such as 'ff' as a single Unicode glyph.
    normalize = lambda value: "".join(unicodedata.normalize("NFKC", value).split())
    text = normalize(pdf.pages[0].extract_text())
    for required in [profile["name"], "Profile", "Skills", "Experience", "Education", "References", *[p["label"] for p in resume["experienceHighlights"]]]:
        if normalize(required) not in text:
            raise ValueError(f"Generated PDF is missing {required!r}")
    urls = [str(ref.get_object().get("/A", {}).get("/URI", "")) for ref in pdf.pages[0].get("/Annots", [])]
    for item in data["contacts"]:
        if item["href"] not in urls:
            raise ValueError(f'Missing PDF contact link: {item["href"]}')
    has_photo = bool(list(pdf.pages[0].images))
    if has_photo != (variant == "corporate"):
        raise ValueError(f"Incorrect photo presence in {variant} resume")
    return generated


def main():
    data = json.load(sys.stdin)
    # Validate both variants before publishing either one.
    generated = {
        "corporate": generate(data, "corporate"),
        "software-farm": generate(data, "software-farm"),
    }
    output = ROOT / "public/Resume_Raffiul_Islam.pdf"
    backup = ROOT / ".resume-backups/Resume_Raffiul_Islam.original.pdf"
    if output.exists() and not backup.exists():
        backup.parent.mkdir(exist_ok=True)
        shutil.copy2(output, backup)
    outputs = {
        "Resume_Raffiul_Islam.pdf": generated["corporate"],
        "Resume_Raffiul_Islam_With_Photo.pdf": generated["corporate"],
        "Resume_Raffiul_Islam_Without_Photo.pdf": generated["software-farm"],
    }
    for filename, source in outputs.items():
        output = ROOT / "public" / filename
        temporary = output.with_suffix(".generating.pdf")
        try:
            shutil.copy2(source, temporary)
            temporary.replace(output)
        finally:
            temporary.unlink(missing_ok=True)
    print("Generated With Photo and Without Photo resumes: one page each; verified sections, links, photo presence, and layout bounds.")
    print("Default preview PDF: With Photo. Template: scripts/resume-template.tex")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        sys.exit(str(error))
