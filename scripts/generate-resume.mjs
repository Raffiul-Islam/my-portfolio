import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const json = (file) => JSON.parse(read(file));

// Read literal project content without executing TSX or importing Next.js images.
function literal(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
  throw new Error("Resume project fields must be literal strings or arrays of strings.");
}

try {
  const source = ts.createSourceFile("projects.ts", read("data/projects.ts"), ts.ScriptTarget.Latest, true);
  let declaration;
  function visit(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(source) === "projects") declaration = node;
    ts.forEachChild(node, visit);
  }
  visit(source);
  if (!declaration || !ts.isArrayLiteralExpression(declaration.initializer)) {
    throw new Error("Expected a literal projects array in data/projects.ts.");
  }
  const projects = declaration.initializer.elements.map((node) => {
    if (!ts.isObjectLiteralExpression(node)) throw new Error("Expected a project object.");
    const project = {};
    for (const key of ["title", "description", "liveUrl", "stack", "highlights"]) {
      const field = node.properties.find((property) => property.name?.getText(source) === key);
      if (!field || !ts.isPropertyAssignment(field)) throw new Error(`Missing project field: ${key}`);
      project[key] = literal(field.initializer);
    }
    return project;
  });
  const data = {
    profile: json("data/profile.json"), contacts: json("data/contacts.json"),
    skills: json("data/skills.json"), resume: json("data/resume.json"), projects,
  };
  const command = process.env.PYTHON || "python";
  const result = spawnSync(command, ["scripts/render-resume.py"], {
    cwd: root, input: JSON.stringify(data), encoding: "utf8", stdio: ["pipe", "inherit", "inherit"], env: { ...process.env, PYTHONUTF8: "1" },
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.error) throw new Error(`Cannot run ${command}: ${result.error.message}. Install Python 3 or set PYTHON to its executable path.`, { cause: result.error });
  process.exitCode = result.status ?? 1;
} catch (error) {
  console.error(`Resume generation failed: ${error.message}`);
  process.exitCode = 1;
}
