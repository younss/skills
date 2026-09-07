#!/usr/bin/env node
'use strict';

/**
 * system-thinking-skill installer
 *
 * Copies the systems-thinking agent skill into whichever runtime you point it at.
 * Zero dependencies, Node built-ins only, so `npx github:younss/system-thinking`
 * works without a registry publish or an install step.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

const SKILL_NAME = 'systems-thinking';
const SRC = path.join(__dirname, '..', 'skills', SKILL_NAME);
const pkg = require('../package.json');

const C = process.stdout.isTTY && !process.env.NO_COLOR
  ? { d: '\x1b[2m', b: '\x1b[1m', g: '\x1b[32m', y: '\x1b[33m', r: '\x1b[31m', x: '\x1b[0m' }
  : { d: '', b: '', g: '', y: '', r: '', x: '' };

const say = (msg = '') => console.log(msg);
const ok = (msg) => say(`${C.g}✓${C.x} ${msg}`);
const warn = (msg) => say(`${C.y}!${C.x} ${msg}`);
const die = (msg) => { console.error(`${C.r}✗${C.x} ${msg}`); process.exit(1); };

const TARGETS = {
  claude: {
    label: 'Claude Code / Claude Desktop (personal skills)',
    dir: () => path.join(os.homedir(), '.claude', 'skills', SKILL_NAME),
  },
  project: {
    label: 'Current project (.claude/skills, committed with the repo)',
    dir: () => path.join(process.cwd(), '.claude', 'skills', SKILL_NAME),
  },
  codex: {
    label: 'Codex CLI / IDE / app — personal, all repos',
    dir: () => path.join(os.homedir(), '.agents', 'skills', SKILL_NAME),
  },
  'codex-repo': {
    label: 'Codex — current repo (.agents/skills, committed)',
    dir: () => path.join(process.cwd(), '.agents', 'skills', SKILL_NAME),
  },
  cursor: {
    label: 'Cursor / Windsurf (.cursor/rules)',
    dir: () => path.join(process.cwd(), '.cursor', 'rules', SKILL_NAME),
  },
  opencode: {
    label: 'OpenCode / generic agent skills directory',
    dir: () => path.join(os.homedir(), '.config', 'opencode', 'skills', SKILL_NAME),
  },
};

function usage() {
  say(`
${C.b}system-thinking-skill${C.x} v${pkg.version}

  Installs the ${C.b}${SKILL_NAME}${C.x} agent skill — reason in feedback loops,
  stocks and flows, delays and policy resistance instead of linear chains.

${C.b}Usage${C.x}
  npx github:younss/system-thinking [command] [options]

${C.b}Commands${C.x}
  install            Copy the skill to a target directory (default)
  print              Print SKILL.md to stdout — pipe it into any system prompt
  path               Print the packaged skill's source path and exit
  targets            List known install targets

${C.b}Options${C.x}
  --claude           ~/.claude/skills/${SKILL_NAME}            ${C.d}(default)${C.x}
  --project          ./.claude/skills/${SKILL_NAME}
  --codex            ~/.agents/skills/${SKILL_NAME}
  --codex-repo       ./.agents/skills/${SKILL_NAME}
  --cursor           ./.cursor/rules/${SKILL_NAME}
  --opencode         ~/.config/opencode/skills/${SKILL_NAME}
  --dir <path>       Any directory you like — for frameworks with no skill loader
  --force            Overwrite an existing install
  --refs             With 'print', append the reference files too
  -h, --help         Show this help
  -v, --version      Show version

${C.b}Examples${C.x}
  ${C.d}# personal install, picked up by Claude Code automatically${C.x}
  npx github:younss/system-thinking

  ${C.d}# commit it alongside a project so the whole team gets it${C.x}
  npx github:younss/system-thinking install --project

  ${C.d}# LangGraph, CrewAI, Agents SDK — drop it anywhere and read it yourself${C.x}
  npx github:younss/system-thinking install --dir ./agents/skills

  ${C.d}# paste the whole method into a system prompt${C.x}
  npx github:younss/system-thinking print --refs > systems-thinking.md
`);
}

function parseArgs(argv) {
  const opts = { cmd: null, target: null, dir: null, force: false, refs: false };
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
  return opts;
}

function readSkill() {
  if (!fs.existsSync(SRC)) die(`Packaged skill not found at ${SRC}. The package looks incomplete.`);
  return SRC;
}

function copySkill(dest, force) {
  if (fs.existsSync(dest)) {
    if (!force) {
      warn(`${dest} already exists.`);
      say(`  Re-run with ${C.b}--force${C.x} to overwrite it.`);
      process.exit(1);
    }
    fs.rmSync(dest, { recursive: true, force: true });
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.cpSync(readSkill(), dest, { recursive: true });
}

function countFiles(dir) {
  let n = 0;
  for (const e of fs.readdirSync(dir, { withFileTypes: true, recursive: true })) {
    if (e.isFile()) n++;
  }
  return n;
}

function cmdInstall(opts) {
  const target = opts.dir
    ? { label: 'Custom directory', dir: () => path.resolve(opts.dir, SKILL_NAME) }
    : TARGETS[opts.target || 'claude'];

  const dest = target.dir();
  copySkill(dest, opts.force);

  say();
  ok(`Installed ${C.b}${SKILL_NAME}${C.x} → ${dest}`);
  say(`  ${C.d}${countFiles(dest)} files · SKILL.md + references/${C.x}`);
  say();

  if (!opts.dir && (opts.target || 'claude') === 'claude') {
    say(`  Claude Code picks this up on next start. Verify with ${C.b}/skills${C.x}.`);
  } else if (opts.target === 'project') {
    say(`  Commit ${C.b}.claude/skills/${C.x} so the rest of the team gets it too.`);
  } else if (opts.target === 'codex' || opts.target === 'codex-repo') {
    say(`  Codex detects skill changes automatically — restart it if this doesn't appear.`);
    say(`  Verify with ${C.b}/skills${C.x}, or invoke it explicitly with ${C.b}$${SKILL_NAME}${C.x}.`);
    if (opts.target === 'codex-repo') {
      say(`  Commit ${C.b}.agents/skills/${C.x} so the rest of the team gets it too.`);
    }
  } else if (opts.target === 'cursor') {
    say(`  Cursor reads ${C.b}.cursor/rules/${C.x} — open SKILL.md and set it to Always or Agent Requested.`);
  } else {
    say(`  No auto-discovery outside skill-aware runtimes. Two ways to wire it in:`);
    say(`    1. Put SKILL.md in your system prompt, give the agent read access to references/`);
    say(`    2. Index the folder in your retrieval store and let the agent pull it by description`);
  }
  say(`  ${C.d}Details: https://github.com/younss/system-thinking#readme${C.x}`);
  say();
}

function cmdPrint(opts) {
  const src = readSkill();
  process.stdout.write(fs.readFileSync(path.join(src, 'SKILL.md'), 'utf8'));
  if (opts.refs) {
    const refDir = path.join(src, 'references');
    for (const f of fs.readdirSync(refDir).sort()) {
      process.stdout.write(`\n\n<!-- references/${f} -->\n\n`);
      process.stdout.write(fs.readFileSync(path.join(refDir, f), 'utf8'));
    }
  }
}

function cmdTargets() {
  say();
  for (const [key, t] of Object.entries(TARGETS)) {
    say(`  ${C.b}--${key.padEnd(10)}${C.x} ${t.label}`);
    say(`  ${' '.repeat(12)} ${C.d}${t.dir()}${C.x}`);
  }
  say(`  ${C.b}--dir <path>${C.x} Anywhere else`);
  say();
}

const opts = parseArgs(process.argv.slice(2));
switch (opts.cmd) {
  case 'install': cmdInstall(opts); break;
  case 'print': cmdPrint(opts); break;
  case 'path': say(readSkill()); break;
  case 'targets': cmdTargets(); break;
  default: die(`Unknown command "${opts.cmd}". Run with --help.`);
}