#!/usr/bin/env node
'use strict';

/**
 * younss-skills installer
 *
 * Copies one or more agent skills from this collection into whichever
 * runtime you point it at. Zero dependencies, Node built-ins only, so
 * `npx github:younss/younss-skills` works without a registry publish
 * or an install step.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '..', 'skills');
const pkg = require('../package.json');

const C = process.stdout.isTTY && !process.env.NO_COLOR
  ? { d: '\x1b[2m', b: '\x1b[1m', g: '\x1b[32m', y: '\x1b[33m', r: '\x1b[31m', x: '\x1b[0m' }
  : { d: '', b: '', g: '', y: '', r: '', x: '' };

const say = (msg = '') => console.log(msg);
const ok = (msg) => say(`${C.g}✓${C.x} ${msg}`);
const warn = (msg) => say(`${C.y}!${C.x} ${msg}`);
const die = (msg) => { console.error(`${C.r}✗${C.x} ${msg}`); process.exit(1); };

function discoverSkills() {
  if (!fs.existsSync(SKILLS_DIR)) return [];
  return fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .filter((name) => fs.existsSync(path.join(SKILLS_DIR, name, 'SKILL.md')))
    .sort();
}

const ALL_SKILLS = discoverSkills();

// Minimal frontmatter reader — just enough for `name`/`description`,
// including the block-scalar (`>-` / `|-`) form used for long descriptions.
function parseFrontmatter(skillMdPath) {
  const content = fs.readFileSync(skillMdPath, 'utf8');
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const lines = m[1].split(/\r?\n/);
  const result = {};
  for (let i = 0; i < lines.length; i++) {
    const kv = lines[i].match(/^([a-zA-Z_][\w-]*):\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1];
    let value = kv[2].trim();
    if (/^[>|][-+]?$/.test(value)) {
      const folded = value.startsWith('>');
      const block = [];
      let j = i + 1;
      while (j < lines.length && (lines[j] === '' || lines[j].startsWith(' '))) {
        block.push(lines[j].replace(/^ {1,2}/, ''));
        j++;
      }
      value = block.join(folded ? ' ' : '\n').trim();
      i = j - 1;
    } else {
      value = value.replace(/^(['"])(.*)\1$/, '$2');
    }
    result[key] = value;
  }
  return result;
}

const TARGETS = {
  claude: {
    label: 'Claude Code / Claude Desktop (personal skills)',
    dir: (skill) => path.join(os.homedir(), '.claude', 'skills', skill),
  },
  project: {
    label: 'Current project (.claude/skills, committed with the repo)',
    dir: (skill) => path.join(process.cwd(), '.claude', 'skills', skill),
  },
  codex: {
    label: 'Codex CLI / IDE / app — personal, all repos',
    dir: (skill) => path.join(os.homedir(), '.agents', 'skills', skill),
  },
  'codex-repo': {
    label: 'Codex — current repo (.agents/skills, committed)',
    dir: (skill) => path.join(process.cwd(), '.agents', 'skills', skill),
  },
  cursor: {
    label: 'Cursor / Windsurf (.cursor/rules)',
    dir: (skill) => path.join(process.cwd(), '.cursor', 'rules', skill),
  },
  gemini: {
    label: 'Gemini CLI (personal, all repos)',
    dir: (skill) => path.join(os.homedir(), '.gemini', 'extensions', skill, 'skills', skill),
  },
  'gemini-repo': {
    label: 'Gemini CLI — current repo (.gemini/extensions, committed)',
    dir: (skill) => path.join(process.cwd(), '.gemini', 'extensions', skill, 'skills', skill),
  },
  opencode: {
    label: 'OpenCode / generic agent skills directory',
    dir: (skill) => path.join(os.homedir(), '.config', 'opencode', 'skills', skill),
  },
};

function usage() {
  const skillList = ALL_SKILLS.length ? ALL_SKILLS.join(', ') : '(none found)';
  say(`
${C.b}younss-skills${C.x} v${pkg.version}

  Installs agent skills from this collection into whichever runtime you point it at.
  Packaged skills: ${C.b}${skillList}${C.x}

${C.b}Usage${C.x}
  npx github:younss/younss-skills [command] [skill] [options]

${C.b}Commands${C.x}
  install [skill]    Copy a skill — or all packaged skills — to a target directory (default)
  print [skill]       Print SKILL.md to stdout — pipe it into any system prompt
  path [skill]        Print a packaged skill's source path (or the skills/ dir)
  list                List packaged skills with their descriptions
  targets             List known install targets

${C.b}Options${C.x}
  --claude           ~/.claude/skills/<skill>            ${C.d}(default)${C.x}
  --project          ./.claude/skills/<skill>
  --codex            ~/.agents/skills/<skill>
  --codex-repo       ./.agents/skills/<skill>
  --cursor           ./.cursor/rules/<skill>
  --gemini           ~/.gemini/extensions/<skill> (as a skill, with a generated manifest)
  --gemini-repo      ./.gemini/extensions/<skill> (same, committed with the repo)
  --opencode         ~/.config/opencode/skills/<skill>
  --dir <path>       Any directory you like — for frameworks with no skill loader
  --force            Overwrite an existing install
  --refs             With 'print', append the reference files too
  -h, --help         Show this help
  -v, --version      Show version

${C.b}Examples${C.x}
  ${C.d}# install every packaged skill, picked up by Claude Code automatically${C.x}
  npx github:younss/younss-skills

  ${C.d}# install just one skill${C.x}
  npx github:younss/younss-skills install systems-thinking

  ${C.d}# commit it alongside a project so the whole team gets it${C.x}
  npx github:younss/younss-skills install --project

  ${C.d}# LangGraph, CrewAI, Agents SDK — drop it anywhere and read it yourself${C.x}
  npx github:younss/younss-skills install --dir ./agents/skills

  ${C.d}# paste one skill's method into a system prompt${C.x}
  npx github:younss/younss-skills print systems-thinking --refs > systems-thinking.md
`);
}

function parseArgs(argv) {
  const opts = { cmd: null, skill: null, target: null, dir: null, force: false, refs: false };
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-h' || a === '--help') { usage(); process.exit(0); }
    else if (a === '-v' || a === '--version') { say(pkg.version); process.exit(0); }
    else if (a === '--force' || a === '-f') opts.force = true;
    else if (a === '--refs') opts.refs = true;
    else if (a === '--dir') {
      opts.dir = argv[++i];
      if (!opts.dir) die('--dir needs a path.');
    } else if (a.startsWith('--')) {
      const key = a.slice(2);
      if (!TARGETS[key]) die(`Unknown option --${key}. Run with --help.`);
      opts.target = key;
    } else rest.push(a);
  }
  opts.cmd = rest[0] || 'install';
  opts.skill = rest[1] || null;
  return opts;
}

function pickSkills(opts) {
  if (opts.skill) {
    if (!ALL_SKILLS.includes(opts.skill)) {
      die(`Unknown skill "${opts.skill}". Available: ${ALL_SKILLS.join(', ') || '(none)'}`);
    }
    return [opts.skill];
  }
  if (!ALL_SKILLS.length) die('No skills found in this package.');
  return ALL_SKILLS;
}

function readSkill(skill) {
  const src = path.join(SKILLS_DIR, skill);
  if (!fs.existsSync(path.join(src, 'SKILL.md'))) {
    die(`Packaged skill "${skill}" not found. The package looks incomplete.`);
  }
  return src;
}

function copySkill(src, dest, force) {
  if (fs.existsSync(dest)) {
    if (!force) {
      warn(`${dest} already exists.`);
      say(`  Re-run with ${C.b}--force${C.x} to overwrite it.`);
      process.exit(1);
    }
    fs.rmSync(dest, { recursive: true, force: true });
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.cpSync(src, dest, { recursive: true });
}

function ensureGeminiManifest(extensionDir, force, skill) {
  const manifestPath = path.join(extensionDir, 'gemini-extension.json');
  if (fs.existsSync(manifestPath) && !force) return false;
  const fm = parseFrontmatter(path.join(SKILLS_DIR, skill, 'SKILL.md'));
  const manifest = {
    name: skill,
    version: pkg.version,
    description: fm.description || '',
  };
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  return true;
}

function countFiles(dir) {
  let n = 0;
  for (const e of fs.readdirSync(dir, { withFileTypes: true, recursive: true })) {
    if (e.isFile()) n++;
  }
  return n;
}

function cmdInstall(opts) {
  const skills = pickSkills(opts);
  const targetKey = opts.target || 'claude';
  const isGemini = targetKey === 'gemini' || targetKey === 'gemini-repo';

  say();
  for (const skill of skills) {
    const dest = opts.dir
      ? path.resolve(opts.dir, skill)
      : TARGETS[targetKey].dir(skill);
    copySkill(readSkill(skill), dest, opts.force);
    if (isGemini) ensureGeminiManifest(path.dirname(path.dirname(dest)), opts.force, skill);
    ok(`Installed ${C.b}${skill}${C.x} → ${dest}`);
    say(`  ${C.d}${countFiles(dest)} files${C.x}`);
  }
  say();

  if (!opts.dir && targetKey === 'claude') {
    say(`  Claude Code picks ${skills.length > 1 ? 'these' : 'this'} up on next start. Verify with ${C.b}/skills${C.x}.`);
  } else if (targetKey === 'project') {
    say(`  Commit ${C.b}.claude/skills/${C.x} so the rest of the team gets it too.`);
  } else if (targetKey === 'codex' || targetKey === 'codex-repo') {
    say(`  Codex detects skill changes automatically — restart it if this doesn't appear.`);
    say(`  Verify with ${C.b}/skills${C.x}, or invoke explicitly with ${C.b}$${skills[0]}${C.x}${skills.length > 1 ? ` (or any of: ${skills.join(', ')})` : ''}.`);
    if (targetKey === 'codex-repo') say(`  Commit ${C.b}.agents/skills/${C.x} so the rest of the team gets it too.`);
  } else if (targetKey === 'cursor') {
    say(`  Cursor reads ${C.b}.cursor/rules/${C.x} — open each SKILL.md and set it to Always or Agent Requested.`);
  } else if (isGemini) {
    say(`  Gemini CLI discovers extensions in ${C.b}.gemini/extensions/${C.x} on next start.`);
    say(`  A minimal ${C.b}gemini-extension.json${C.x} was generated per skill — edit freely, re-running`);
    say(`  install won't overwrite it unless you pass ${C.b}--force${C.x}. Verify with ${C.b}/extensions${C.x}.`);
    if (targetKey === 'gemini-repo') say(`  Commit ${C.b}.gemini/extensions/${C.x} so the rest of the team gets it too.`);
  } else {
    say(`  No auto-discovery outside skill-aware runtimes. Two ways to wire it in:`);
    say(`    1. Put SKILL.md in your system prompt, give the agent read access to references/`);
    say(`    2. Index the folder in your retrieval store and let the agent pull it by description`);
  }
  say(`  ${C.d}Details: https://github.com/younss/younss-skills#readme${C.x}`);
  say();
}

function cmdPrint(opts) {
  const skills = pickSkills(opts);
  skills.forEach((skill) => {
    const src = readSkill(skill);
    if (skills.length > 1) process.stdout.write(`\n\n<!-- skill: ${skill} -->\n\n`);
    process.stdout.write(fs.readFileSync(path.join(src, 'SKILL.md'), 'utf8'));
    if (opts.refs) {
      const refDir = path.join(src, 'references');
      if (fs.existsSync(refDir)) {
        for (const f of fs.readdirSync(refDir).sort()) {
          process.stdout.write(`\n\n<!-- references/${f} (${skill}) -->\n\n`);
          process.stdout.write(fs.readFileSync(path.join(refDir, f), 'utf8'));
        }
      }
    }
  });
}

function cmdList() {
  say();
  if (!ALL_SKILLS.length) {
    say(`  ${C.d}(none found)${C.x}`);
    say();
    return;
  }
  for (const skill of ALL_SKILLS) {
    const fm = parseFrontmatter(path.join(SKILLS_DIR, skill, 'SKILL.md'));
    say(`  ${C.b}${skill}${C.x}`);
    say(`  ${C.d}${fm.description || '(no description)'}${C.x}`);
    say();
  }
}

function cmdTargets() {
  say();
  for (const [key, t] of Object.entries(TARGETS)) {
    say(`  ${C.b}--${key.padEnd(10)}${C.x} ${t.label}`);
    say(`  ${' '.repeat(12)} ${C.d}${t.dir('<skill>')}${C.x}`);
  }
  say(`  ${C.b}--dir <path>${C.x} Anywhere else`);
  say();
}

const opts = parseArgs(process.argv.slice(2));
switch (opts.cmd) {
  case 'install': cmdInstall(opts); break;
  case 'print': cmdPrint(opts); break;
  case 'path': say(opts.skill ? readSkill(opts.skill) : SKILLS_DIR); break;
  case 'list': cmdList(); break;
  case 'targets': cmdTargets(); break;
  default: die(`Unknown command "${opts.cmd}". Run with --help.`);
}
