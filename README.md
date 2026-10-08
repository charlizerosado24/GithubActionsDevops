# Solar System Explorer

A small, responsive planet picker built for the **GitHub Actions + DevOps** college club workshop. Students edit a data file, run the app locally, push a change, watch automated checks, and publish the static website with GitHub Pages.

## Project overview

The browser reads the eight planet entries in `public/data/planets.json`. Choose a planet to see its short description. The data file is also read by the automated tests.

There are three different jobs in this project:

- **Locally**, Node.js and Express serve the website so it is easy to run on your computer.
- **In CI**, Node.js installs dependencies and runs the automated tests.
- **Online**, GitHub Pages hosts the static HTML, CSS, JavaScript, and JSON files from `public/`. GitHub Pages does **not** run the Express server or host a Node.js backend.

The same static website files are served by Express locally and by GitHub Pages after deployment. No build step is needed. If this project later needed a Node.js server online, it would need a different hosting platform.

## Prerequisites

- Node.js **26.x** and npm. Install the current Node.js 26 release from [nodejs.org](https://nodejs.org/); npm is included. This matches the workflow.
- Git, a GitHub account, and a code editor.
- Java is not needed. This is a Node.js project.

## Create your own repository

1. Open the instructor's `solar-system-explorer` template repository on GitHub.
2. Choose **Use this template → Create a new repository**.
3. Create a repository under your own GitHub account (or the class organization). Give it a name, such as `solar-system-explorer`, and choose its visibility according to your instructor's guidance.
4. Copy the URL for **your new repository**. Clone that repository, not the instructor's template.

## Local setup

In Terminal, replace each placeholder with your own repository URL and folder name:

```sh
git clone <YOUR-REPOSITORY-URL>
cd <YOUR-REPOSITORY-FOLDER>
npm ci
npm run dev
```

Open <http://localhost:3000>. Leave the terminal running while you explore. Press Ctrl+C to stop the server.

`npm ci` installs the exact dependency versions recorded in `package-lock.json`. `npm run dev` starts Node's built-in watch mode, which restarts the server when server-side files change.

## Make a change

1. Open `public/data/planets.json` in your editor.
2. Find Earth's `color` value, for example `"color": "#48a9e6"`, and change it to another six-digit hex color such as `#6c5ce7`.
3. Save, then refresh the browser.

A browser refresh reloads the frontend files and planet data. Server-side code changes can restart automatically in watch mode. Local edits stay on your computer; they do not update GitHub or the deployed website until you commit and push them.

Other beginner challenges:

1. Change Earth's display color.
2. Update Earth's description.
3. Change the page title in `public/index.html` (look for the `<h1>`).
4. Change the background color in `public/styles.css` (look for `:root` and `body`).

### See a website edit enter the CI/CD pipeline

The page header includes a **Pipeline demo** message. Change its text in `public/index.html`, save, and refresh the local browser to see your edit. Then run the tests and commit and push that source change to `main`. The existing workflow starts from the GitHub push, runs the test job, and deploys the updated static page if the tests pass. Find that run under **Actions → Latest run**.

The page itself does not start GitHub Actions when a visitor clicks or edits something in the browser. The workflow responds to repository events such as commits being pushed. A browser button that triggers a workflow would require a secure server and GitHub credentials; those are outside this static Pages project.

### Try the Mission Log

Choose a planet in the **Mission Log**, optionally add a short note, and select **Add to mission log**. The new item appears below the form and stays in this browser after a refresh. Use **Remove** or **Clear log** to change the list. These visitor-created entries are stored in browser local storage; they do not change the repository and are not shared with GitHub Actions.

The Mission Log feature itself lives in `public/index.html`, `public/styles.css`, and `public/app.js`. When you add or change a feature in these files and push the source change to `main`, CI runs the tests and CD deploys the new website if they pass. This gives the workshop a visible click interaction and a clear source-code change that travels through the pipeline.

## Run tests

```sh
npm test
```

The tests use Node's built-in test runner. They read the same JSON file as the website and check the planet count, Earth, required fields, unique IDs, and color format. They do not start Express, use the network, or need secrets.

## Commit and push

After making your change, run:

```sh
git add .
git commit -m "Change Earth display color"
git push
```

The first push may ask you to authenticate with GitHub. Make sure your current branch is `main`, or merge your work into `main` after reviewing it.

## One-time GitHub Pages setup

In your repository on GitHub, open **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**. The workflow deploys only the `public/` folder.

GitHub Pages is available for public repositories on GitHub Free. Private-repository Pages availability depends on the account or organization plan: GitHub Pro, Team, and Enterprise plans support private-repository Pages. Even when the repository itself is private, a published Pages site is publicly available on the internet, so do not put private information in the website. Check the [GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site) and your organization's policy.

## Watch CI/CD

Open **Repository → Actions → Latest run**.

- The **test** job checks out the code, installs Node.js 26 and npm dependencies, then runs `npm test`.
- The **deploy** job needs the test job to pass. It only runs for a push to `main` or a manual run on `main`; pull requests never deploy. It uploads `public/` as the Pages artifact and publishes it.
- This is **Continuous Deployment**: after CI passes on an eligible main-branch run, the static site publishes automatically without manual approval.

Find the live address in the completed workflow run's **deploy** job / `github-pages` environment. It commonly looks like `https://YOUR-ACCOUNT.github.io/YOUR-REPOSITORY/`. Use the address GitHub reports for your repository.

## Break and fix exercise

1. In `public/data/planets.json`, temporarily change Earth's name to `Terra`.
2. Run `npm test` and observe the failed Earth check.
3. For the workshop demonstration, commit and push the broken data to `main`. The test job fails, and because deploy needs test to pass, deployment is skipped. The previously published site remains unchanged.
4. Change the name back to `Earth`, run `npm test`, then commit and push the fix. After the tests pass, deployment can run again.

## Pipeline diagram

```text
Local edit → Local browser refresh → Commit and push → Install dependencies → Run tests → Deploy static website
```

## YAML explained

Open `.github/workflows/ci-cd.yml`:

- `on` lists events that start the workflow: pushes to `main`, pull requests targeting `main`, and manual runs.
- `jobs` groups work into independently reported jobs (`test` and `deploy`).
- `runs-on` picks the runner computer, here GitHub's `ubuntu-latest` image.
- `steps` lists tasks in order within a job.
- `uses` runs a reusable GitHub Action, such as checking out code or setting up Node.js.
- `run` executes a shell command such as `npm ci`.
- `needs` makes one job wait for another. Here `deploy` needs a successful `test` job.
- `permissions` limits what the workflow token can do. Only deployment gets Pages write access and the identity token it needs.
- `environment` records the Pages deployment URL, and `concurrency` avoids overlapping deployments.

## Troubleshooting

- **`node` or `npm` not found:** install Node.js 26.x from [nodejs.org](https://nodejs.org/), then close and reopen Terminal. Check with `node --version` and `npm --version`.
- **Port 3000 already in use:** stop the other server, or run `PORT=3001 npm run dev` and open <http://localhost:3001>.
- **Invalid JSON:** check commas, quotation marks, and brackets in `public/data/planets.json`. JSON strings require double quotes; the last array entry must not have a trailing comma.
- **Tests failing:** read the test output, confirm there are eight entries with unique IDs and nonempty fields, and use a color such as `#48a9e6`. Descriptions can be edited freely as long as they are nonempty.
- **Workflow file in the wrong folder:** confirm it is named `.github/workflows/ci-cd.yml` (including the leading dot directories).
- **Pages not enabled:** set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**.
- **Missing deployment permissions:** confirm the workflow is allowed to use Actions and Pages in repository settings. The deploy job needs `pages: write` and `id-token: write`; the test job does not.
- **Old browser content:** hard refresh the page or try a private window. Wait for the deployment job to finish before checking the online site.
- **Repository-subpath URL problems:** keep frontend asset and data URLs relative, like `./styles.css` and `./data/planets.json`. Avoid leading-slash URLs like `/data/planets.json`, which point to the domain root rather than your project subpath.

