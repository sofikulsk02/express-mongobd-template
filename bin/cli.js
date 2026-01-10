#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    cyan: '\x1b[36m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
};

const log = {
    info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
    success: (msg) => console.log(`${colors.green}✔${colors.reset} ${msg}`),
    warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
    error: (msg) => console.log(`${colors.red}✖${colors.reset} ${msg}`),
};

// Get project name from command line arguments
const projectName = process.argv[2];

if (!projectName) {
    log.error('Please specify the project directory:');
    console.log(
        `  ${colors.cyan}npx create-express-mongo${colors.reset} ${colors.green}<project-directory>${colors.reset}`,
    );
    console.log();
    console.log('For example:');
    console.log(
        `  ${colors.cyan}npx create-express-mongo${colors.reset} ${colors.green}my-app${colors.reset}`,
    );
    process.exit(1);
}

const currentPath = process.cwd();
const projectPath = path.join(currentPath, projectName);
const templatePath = path.join(__dirname, '..', 'template');

// Check if directory already exists
if (fs.existsSync(projectPath)) {
    log.error(
        `The directory ${colors.green}${projectName}${colors.reset} already exists.`,
    );
    log.info(
        'Please choose a different project name or delete the existing directory.',
    );
    process.exit(1);
}

console.log();
console.log(
    `${colors.bright}Creating a new Express + MongoDB app in ${colors.green}${projectPath}${colors.reset}`,
);
console.log();

// Create project directory
fs.mkdirSync(projectPath, { recursive: true });

// Function to copy directory recursively
function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

try {
    // Copy template files
    log.info('Copying template files...');
    copyDir(templatePath, projectPath);
    log.success('Template files copied successfully.');

    // Update package.json with project name
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(
            fs.readFileSync(packageJsonPath, 'utf8'),
        );
        packageJson.name = projectName;
        packageJson.version = '1.0.0';
        packageJson.description = `${projectName} - Express + MongoDB application`;
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        log.success('Updated package.json with project name.');
    }

    // Create .env.example file
    const envExamplePath = path.join(projectPath, '.env.example');
    if (!fs.existsSync(envExamplePath)) {
        const envContent = `# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=27017
DB_NAME=${projectName}
DB_USER=
DB_PASSWORD=
DB_MIN_POOL_SIZE=2
DB_MAX_POOL_SIZE=5

# JWT Configuration
ACCESS_TOKEN_VALIDITY_SEC=3600
REFRESH_TOKEN_VALIDITY_SEC=86400

# CORS Configuration
CORS_URL=*

# Logging
LOG_DIR=logs
`;
        fs.writeFileSync(envExamplePath, envContent);
        log.success('Created .env.example file.');
    }

    // Initialize git repository
    log.info('Initializing git repository...');
    try {
        execSync('git init', { cwd: projectPath, stdio: 'ignore' });

        // Create .gitignore if it doesn't exist
        const gitignorePath = path.join(projectPath, '.gitignore');
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
        log.success('Initialized git repository.');
    } catch (error) {
        log.warn(
            'Could not initialize git repository. Please initialize it manually.',
        );
    }

    // Success message
    console.log();
    console.log(
        `${colors.green}${colors.bright}Success!${colors.reset} Created ${colors.cyan}${projectName}${colors.reset} at ${colors.green}${projectPath}${colors.reset}`,
    );
    console.log();
    console.log('Inside that directory, you can run several commands:');
    console.log();
    console.log(`  ${colors.cyan}npm install${colors.reset}`);
    console.log('    Installs all dependencies.');
    console.log();
    console.log(`  ${colors.cyan}npm run dev${colors.reset}`);
    console.log('    Starts the development server with hot-reload.');
    console.log();
    console.log(`  ${colors.cyan}npm run build${colors.reset}`);
    console.log('    Builds the app for production.');
    console.log();
    console.log(`  ${colors.cyan}npm start${colors.reset}`);
    console.log('    Builds and runs the production server.');
    console.log();
    console.log(`  ${colors.cyan}npm test${colors.reset}`);
    console.log('    Runs the test suite.');
    console.log();
    console.log('We suggest that you begin by typing:');
    console.log();
    console.log(`  ${colors.cyan}cd${colors.reset} ${projectName}`);
    console.log(`  ${colors.cyan}npm install${colors.reset}`);
    console.log(`  ${colors.cyan}cp .env.example .env${colors.reset}`);
    console.log(`  ${colors.cyan}npm run dev${colors.reset}`);
    console.log();
    console.log(`${colors.bright}Happy coding!${colors.reset} 🚀`);
    console.log();
} catch (error) {
    log.error('An error occurred while creating the project:');
    console.error(error);
    process.exit(1);
}
