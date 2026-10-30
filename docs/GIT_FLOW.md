# GIT_FLOW.md — Team Git Guide · CareerMirror

> Team of 2. Read sections 0–4 before your first commit. Section 5 is for when something breaks.
>
> **One idea to remember:** you work on your own `feature/...` branch. Nothing reaches the shared code until a PR into `develop` is reviewed by the other person and merged.

"CareerMirror" is a working name. When the final name is chosen, update it here and in `README.md`.

---

## 0. One-time setup

**0.1 Tell git who you are.** Use the same name and email as your GitHub account, otherwise your commits do not count as yours (the instructor checks contribution history, and it cannot be fixed afterwards).

```bash
git config --global user.name  "<your GitHub username>"
git config --global user.email "<your GitHub email>"
```

**0.2 Clone the repo.** The default branch is `develop`, so a fresh clone lands on it.

```bash
git clone https://github.com/sakda1306/Advanced-Topic-in-Computer-Software-Course-Career-Mirror.git
cd Advanced-Topic-in-Computer-Software-Course-Career-Mirror
git status          # first line: On branch develop
```

If the password is rejected, run `gh auth login` (GitHub CLI) or use a Personal Access Token.

**0.3 Create your own `.env`** (never committed; everyone has their own keys).

```bash
cp .env.example .env          # PowerShell: copy .env.example .env
```

A new variable goes into `.env.example` as an **empty** entry, and the PR description mentions it.

**0.4 Keep personal tool folders out of git.** If a coding tool creates a settings or memory folder inside the repo, list it in **`.git/info/exclude`** (local to your machine). Do **not** put it in `.gitignore`: that file is shared and must not name anyone's personal tools.

```bash
echo "<tool folder>/" >> .git/info/exclude
git status          # the folder must no longer appear
```

**0.5 Create your feature branch from `develop`.**

```bash
git checkout develop
git pull
git checkout -b feature/<area>-<username>     # e.g. feature/api-sakda1306
git push -u origin feature/<area>-<username>
```

Branch from `develop`, never from `main`.

---

## 1. Branches

```
main       ← submission / demo version · updated only by merging develop (release)
  ↑
develop    ← default branch · integration point · changes arrive only through PRs
  ↑     ↑
feature/<area>-<username>    one branch per piece of work, short-lived
```

| branch | who writes | how |
|---|---|---|
| `main` | sakda1306 | PR `develop → main` at milestones and before submission (5 Nov 2026) |
| `develop` | both | PR from `feature/*` with 1 approval from the other person |
| `feature/*` | owner | push freely, any time |

Short-lived branches: open a PR as soon as one working piece is done (at least every 1–2 days), then start a new branch from the updated `develop`. With 6 days and 2 people, long branches mean painful merges.

Branch name areas: `web`, `api`, `ai`, `retrieval`, `data`, `docs`, `infra`.

---

## 2. Ownership (proposal — confirm on day 1)

One owner per folder avoids merge conflicts. You may read everything; edit only what you own. Need a change in the other person's folder? Ask them, or open an issue.

| person | owns |
|---|---|
| sakda1306 | `services/02_api_backend/`, `services/04_retrieval_knowledge/`, `docker-compose.yml`, `.env.example`, `data/` loaders |
| `<teammate>` | `services/01_web_app/`, `services/03_ai_agent/` |
| shared (PR + both agree) | `docs/` (PRD, Design, api-contract), `data/` content, root `README.md` |

`docs/api-contract.md` is locked on day 1. Changing it needs a separate PR approved by both, because the other person codes against it.

---

## 3. Daily loop

### Morning — get the latest `develop`

```bash
git checkout feature/<area>-<username>
git fetch origin
git merge origin/develop
```

Doing this daily keeps conflicts small. `CONFLICT` → section 5.1.

### During the day — small commits

```bash
git status                              # what changed
git add services/02_api_backend/        # add your own folder by name
git commit -m "feat(api): add daily quota check before ai call"
```

Avoid `git add .` / `git add -A`: they pick up files you did not mean to commit.

### Evening — checklist, then push

Run the checklist in 4.1, then:

```bash
git push
```

Push every day, even unfinished work. It is a backup, it shows progress, and steady commits across the week show contribution.

---

## 4. Rules

| # | rule | why |
|---|---|---|
| 1 | Edit only folders you own (section 2) | silent overwrites of the other person's work |
| 2 | Never push directly to `main` or `develop`; use PRs | broken code reaches everyone |
| 3 | Never commit `.env`, API keys, model files, FAISS/BM25 indexes, user CVs, files over 5 MB | leaked keys must be revoked; personal data; repo bloat |
| 4 | No traces of AI coding tools in the work: no AI `Co-Authored-By` lines, no "generated with ..." text, no assistant or vendor names in commits, PR descriptions, README, code comments or `.gitignore`, and no tool settings folders committed (use `.git/info/exclude`, 0.4). The tools must never appear as author or contributor. | team rule |
| 5 | Run checklist 4.1 before every push | pushed history is very hard to clean |
| 6 | No `git push --tags` / `--follow-tags`; no force push to shared branches | tags are created only at release; force push destroys the other person's work |

AI as **product content** ("AI Router", "AI chat", model names in config) is fine. Rule 4 is about the tools used to write the work.

### 4.1 Pre-push checklist (every time, 1 minute)

```bash
git status                                   # 1) no .env, no tool folders, only your files
git diff --cached --stat                     # 2) staged files are what you intended
git log origin/develop..HEAD --format=%B     # 3) unpushed commit messages: no trailers or signatures
git diff origin/develop --name-only          # 4) every file that differs from develop
git grep -n -i -E "co-authored-by|generated with" -- $(git diff origin/develop --name-only)
                                             # 5) must find nothing
```

- [ ] 1–4: no stray files, no `.env`, no keys
- [ ] 3: no `Co-Authored-By` of an AI, no "generated with"
- [ ] 5: nothing found (except the lines describing this rule in `docs/GIT_FLOW.md`); also grep for the names of the tools you personally use
- [ ] no `--tags`, no `--force`

Anything wrong → do not push; fix with 5.3 / 5.4 first.

### 4.2 Commit message format

```
<type>(<area>): <what changed>
```

```
feat(api): parse uploaded CV PDF into skills and experience
feat(ai): route profile_edit requests to structured change extraction
fix(retrieval): load Thai job descriptions with multilingual embedder
test(api): cover removed skills in match scoring
docs(docs): add git flow guide
```

Types: `feat` `fix` `test` `docs` `refactor` `chore`. A subject line (plus a body if needed) and nothing else: no trailers, no signatures.

### 4.3 Pull requests

1. Merge the latest `origin/develop` into your branch and run the tests.
2. Push, then open a PR on GitHub. **base: `develop`** ← compare: your branch (develop is the default, so this is preselected).
3. Description: what changed / how you tested it / new libraries or env vars.
4. Ask the other person to review. The reviewer approves; the author merges after approval.
5. After merge, delete the feature branch and start the next one from the updated `develop`.

---

## 5. When something breaks

> Never delete the folder and re-clone: unpushed work is lost for good. Ask the other person first, with a screenshot of the error.

**5.1 `CONFLICT` during merge** — `git status` shows the files. In your own files, keep the right code, remove the `<<<<<<<`, `=======`, `>>>>>>>` markers, then `git add <file>` and `git commit`. In the other person's files or shared files → `git merge --abort` and talk first.

**5.2 Edited someone else's file, not committed** — `git restore <path>`.

**5.3 Wrong commit, not pushed** — `git reset --soft HEAD~1`, re-add only your folder, commit again.

**5.4 Committed a file that must not be in git (not pushed)**

```bash
git reset --soft HEAD~1
git restore --staged .env
git add services/<yours>/
git commit -m "..."
```

Already pushed a key → tell the team immediately and revoke the key; deleting the commit is not enough. Already pushed AI tool traces → tell sakda1306; do not rewrite shared history yourself.

**5.5 Worked on the wrong branch, not committed**

```bash
git stash
git checkout feature/<area>-<username>
git stash pop
```

**5.6 Push rejected (non-fast-forward)** — `git pull --no-rebase`, resolve conflicts (5.1), `git push`.

---

## 6. Repository settings (sakda1306, once)

- Default branch: `develop` (Settings → General → Default branch, or `gh repo edit --default-branch develop`).
- Branch protection for `main` and `develop`: require a PR and 1 approval, block force push and deletion. (On a private repo with a free account, GitHub may not enforce this; the rules in section 4 still apply.)

---

## Cheat sheet

```bash
# morning
git checkout feature/<area>-<username> && git fetch origin && git merge origin/develop

# during the day
git status
git add services/<your folder>/
git commit -m "feat(<area>): what changed"

# evening: checklist 4.1, then
git push
```

**Working piece done → PR into `develop` → other person reviews → merge.**
