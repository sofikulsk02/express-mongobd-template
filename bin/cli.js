import inquirer from "inquirer";
import path from "path";
import fs from "fs";
import chalk from "chalk";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GITLAB_CI_FILE = ".gitlab-ci.yml";
const GITHUB_CI_FOLDER = ".github";
const PACKAGE_JSON = "package.json";

const styles = {
  command: (cmd) => chalk.cyan.bold(cmd),
  path: (p) => chalk.gray(p),
  success: (msg) => chalk.green(msg),
  warning: (msg) => chalk.yellow(msg),
  error: (msg) => chalk.red(msg),
  heading: (msg) => chalk.bold(msg),
};

// Check if running in interactive mode
function isInteractive() {
  return process.stdin.isTTY && process.stdout.isTTY;
}

async function createExpressMongo() {
  console.log(chalk.cyan.bold("\n🚀 Create Express MongoDB TypeScript App\n"));

  // Get project name from command line
  let projectName = process.argv[2];

  let answers;

  // If not interactive or project name provided, use defaults
  if (!isInteractive()) {
    if (!projectName) {
      console.log(styles.error("✖ Please provide a project name:"));
      console.log(
        `  ${styles.command("npx create-express-mongo-ts")} ${chalk.green(
          "<project-name>"
        )}`
      );
      console.log(`\nExample:`);
      console.log(`  ${styles.command("npx create-express-mongo-ts my-app")}`);
      process.exit(1);
    }

    console.log(
      styles.warning("Running in non-interactive mode with defaults...\n")
    );
    answers = {
      appName: projectName,
      gitProvider: "github",
      initGit: true,
      installDeps: true,
    };
  } else {
    // Interactive mode - use inquirer prompts
    answers = await inquirer.prompt([
      {
        type: "input",
        name: "appName",
        message: "What is your app name?",
        default: projectName || "my-express-mongo-app",
        validate(input) {
          if (!input.trim()) return "App name cannot be empty";
          if (!/^[a-z0-9-_]+$/i.test(input))
            return "App name can only contain letters, numbers, hyphens and underscores";
          return true;
        },
      },
      {
        type: "list",
        name: "gitProvider",
        message: "Which Git provider do you want to use?",
        choices: [
          { name: "GitHub", value: "github" },
          { name: "GitLab", value: "gitlab" },
          { name: "None", value: "none" },
        ],
        default: "github",
      },
      {
        type: "confirm",
        name: "initGit",
        message: "Initialize a git repository?",
        default: true,
      },
      {
        type: "confirm",
        name: "installDeps",
        message: "Install dependencies automatically?",
        default: true,
      },
    ]);
  }

  createApp(answers);
}

function createApp({ appName, gitProvider, initGit, installDeps }) {
  const targetDir = path.join(process.cwd(), appName);
  const templateDir = path.join(__dirname, "../template");

  // Check if directory exists
  if (fs.existsSync(targetDir)) {
    console.log(styles.error(`\n✖ Folder "${appName}" already exists.`));
    process.exit(1);
  }

  console.log(
    styles.heading(
      `\nCreating a new Express + MongoDB app in ${styles.path(targetDir)}\n`
    )
  );

  // Copy template files
  console.log(chalk.cyan("ℹ") + " Copying template files...");
  copyDir(templateDir, targetDir);
  console.log(styles.success("✔ Template files copied successfully."));

  // Handle git provider - remove unused CI files
  if (gitProvider === "github") {
    const gitlabPath = path.join(targetDir, GITLAB_CI_FILE);
    if (fs.existsSync(gitlabPath)) {
      fs.rmSync(gitlabPath, { recursive: true, force: true });
    }
  } else if (gitProvider === "gitlab") {
    const githubPath = path.join(targetDir, GITHUB_CI_FOLDER);
    if (fs.existsSync(githubPath)) {
      fs.rmSync(githubPath, { recursive: true, force: true });
    }
  } else {
    // Remove both if none selected
    const gitlabPath = path.join(targetDir, GITLAB_CI_FILE);
    const githubPath = path.join(targetDir, GITHUB_CI_FOLDER);
    if (fs.existsSync(gitlabPath))
      fs.rmSync(gitlabPath, { recursive: true, force: true });
    if (fs.existsSync(githubPath))
      fs.rmSync(githubPath, { recursive: true, force: true });
  }

  // Update package.json with project name
  const pkgPath = path.join(targetDir, PACKAGE_JSON);
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    pkg.name = appName;
    pkg.version = "1.0.0";
    pkg.description = `${appName} - Express + MongoDB TypeScript application`;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    console.log(styles.success("✔ Updated package.json with project name."));
  }

  // Create .env.example file
  const envExamplePath = path.join(targetDir, ".env.example");
  if (!fs.existsSync(envExamplePath)) {
    const envContent = `# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=27017
DB_NAME=${appName}
DB_USER=
DB_USER_PASSWORD=
DB_MIN_POOL_SIZE=2
DB_MAX_POOL_SIZE=5

# JWT Configuration
ACCESS_TOKEN_VALIDITY_SEC=3600
REFRESH_TOKEN_VALIDITY_SEC=86400
TOKEN_ISSUER=${appName}
TOKEN_AUDIENCE=${appName}

# CORS Configuration
ORIGIN_URL=*

# Logging
LOG_DIRECTORY=logs
`;
    fs.writeFileSync(envExamplePath, envContent);
    console.log(styles.success("✔ Created .env.example file."));
  }

  // Initialize git repository
  if (initGit) {
    console.log(chalk.cyan("ℹ") + " Initializing git repository...");
    try {
      execSync("git init", { cwd: targetDir, stdio: "ignore" });

      // Create .gitignore if it doesn't exist
      const gitignorePath = path.join(targetDir, ".gitignore");
      if (!fs.existsSync(gitignorePath)) {
        const gitignoreContent = `# Dependencies
node_modules/

# Build output
dist/

# Environment files
.env
.env.local
.env.*.local

# Logs
logs/
*.log
npm-debug.log*

# IDE
.vscode/
.idea/

# OS files
.DS_Store
Thumbs.db

# Coverage
coverage/

# Keys (keep the folder structure but ignore actual keys)
keys/*.pem
keys/*.key

# TypeScript cache
*.tsbuildinfo
`;
        fs.writeFileSync(gitignorePath, gitignoreContent);
      }
      console.log(styles.success("✔ Initialized git repository."));
    } catch (error) {
      console.log(styles.warning("⚠ Could not initialize git repository."));
    }
  }

  // Install dependencies
  if (installDeps) {
    console.log(
      chalk.cyan("ℹ") + " Installing dependencies (this may take a minute)..."
    );
    try {
      execSync("npm install", { cwd: targetDir, stdio: "inherit" });
      console.log(styles.success("✔ Dependencies installed successfully."));
    } catch (error) {
      console.log(
        styles.warning(
          "⚠ Could not install dependencies. Please run 'npm install' manually."
        )
      );
    }
  }

  // Success message
  console.log(
    styles.success(`\n✨ Success! Created ${appName} at ${targetDir}\n`)
  );

  console.log(styles.heading("Next Steps:\n"));
  console.log(
    `  👉 Go to project directory: ${styles.command(`cd ${appName}`)}`
  );
  if (!installDeps) {
    console.log(
      `  👉 Install dependencies:    ${styles.command("npm install")}`
    );
  }
  console.log(
    `  👉 Set up environment:      ${styles.command("cp .env.example .env")}`
  );
  console.log(`  👉 Run the application:     ${styles.command("npm run dev")}`);
  console.log();
  console.log(styles.heading("Available Commands:\n"));
  console.log(
    `  ${styles.command(
      "npm run dev"
    )}     - Start development server with hot-reload`
  );
  console.log(`  ${styles.command("npm run build")}   - Build for production`);
  console.log(
    `  ${styles.command("npm start")}       - Build and run production server`
  );
  console.log(`  ${styles.command("npm test")}        - Run test suite`);
  console.log(
    `  ${styles.command("npm run lint")}    - Check for linting errors`
  );
  console.log();
  console.log(chalk.bold("Happy coding! 🚀\n"));
}

// Recursively copy all files and folders
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });

  for (const file of fs.readdirSync(src)) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);

    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
      continue;
    }

    fs.copyFileSync(srcPath, destPath);
  }
}

createExpressMongo().catch((error) => {
  console.error(styles.error("An error occurred:"), error);
  process.exit(1);
});
