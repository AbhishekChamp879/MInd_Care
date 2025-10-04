# 🛠️ Development Environment Setup

Welcome to MInd_Care! This guide will help you set up your development environment to start contributing to our mental health support platform.

## 📋 Prerequisites

Before you begin, make sure you have the following installed on your system:

### Required Software

- **Node.js** 18 or higher ([Download here](https://nodejs.org/))
- **Git** ([Download here](https://git-scm.com/))
- **Code Editor** (We recommend [VS Code](https://code.visualstudio.com/))

### Recommended Package Manager

We recommend using **npm** for faster package management and development:

## 🚀 Quick Setup

### 1. Fork and Clone the Repository

```bash
# Fork the repository on GitHub first, then clone your fork

git clone https://github.com/YOUR_USERNAME/MInd_Care.git
cd MInd_Care
```

### 2. Install Dependencies

**Using Bun (Recommended):**

```bash
bun install
```

**Using npm:**

```bash
npm install
```

**Using yarn:**

```bash
yarn install
```

### 3. Start Development Server

**Using Bun:**

```bash
bun dev
```

**Using npm:**

```bash
npm run dev
```

**Using yarn:**

```bash
yarn dev
```

### 4. Open in Browser

Navigate to `http://localhost:xxxx` to see the application running.

## 🌐 Platform-Specific Setup

### Windows Setup

1. **Install Node.js**
   - Download from [nodejs.org](https://nodejs.org/)
   - Choose the LTS version
   - Run the installer and follow the prompts

2. **Install Git**
   - Download from [git-scm.com](https://git-scm.com/)
   - During installation, choose "Git from the command line and also from 3rd-party software"

3. **Install Bun (Optional but recommended)**

   ```powershell
   powershell -c "irm bun.sh/install.ps1 | iex"
   ```

4. **VS Code Extensions** (Recommended)
   - ES7+ React/Redux/React-Native snippets
   - TypeScript Importer
   - Tailwind CSS IntelliSense
   - Prettier - Code formatter
   - ESLint

### macOS Setup

1. **Install Homebrew** (if not already installed)

   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Install Node.js**

   ```bash
   brew install node
   ```

3. **Install Git**

   ```bash
   brew install git
   ```

4. **Install Bun**
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

### Linux (Ubuntu/Debian) Setup

1. **Update package list**

   ```bash
   sudo apt update
   ```

2. **Install Node.js**

   ```bash
   # Install Node.js 18.x
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install Git**

   ```bash
   sudo apt install git
   ```

4. **Install Bun**
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

## 🔧 IDE Configuration

### VS Code Setup (Recommended)

1. **Install VS Code** from [code.visualstudio.com](https://code.visualstudio.com/)

2. **Install Essential Extensions:**

   ```bash
   # Open VS Code in the project directory
   code .
   ```

   Install these extensions:
   - **ES7+ React/Redux/React-Native snippets**
   - **TypeScript Importer**
   - **Tailwind CSS IntelliSense**
   - **Prettier - Code formatter**
   - **ESLint**
   - **Auto Rename Tag**
   - **Bracket Pair Colorizer**
   - **GitLens**

### Other IDEs

**WebStorm:**

- Enable TypeScript support
- Install Tailwind CSS plugin
- Configure Prettier for formatting

**Vim/Neovim:**

- Install coc.nvim for TypeScript support
- Use vim-prettier for code formatting

## 🧪 Verify Your Setup

Run these commands to ensure everything is working:

```bash
# Check Node.js version (should be 18+)
node --version

# Check package manager
bun --version  # or npm --version

# Check Git
git --version

# Install dependencies
bun install  # or npm install

# Start development server
bun dev  # or npm run dev

# In another terminal, run linting
bun run lint  # or npm run lint
```

If all commands run without errors, you're ready to contribute! 🎉

## 🔍 Common Issues and Solutions

### Issue: "command not found" errors

**Solution:**

- Make sure the software is properly installed
- Restart your terminal/command prompt
- Check your system's PATH environment variable

### Issue: Permission errors on macOS/Linux

**Solution:**

```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
```

### Issue: Port 5173 already in use

**Solution:**

```bash
# Kill process using the port
npx kill-port 5173

# Or use a different port
bun dev --port 3000
```

### Issue: ESLint errors in VS Code

**Solution:**

1. Install the ESLint extension
2. Restart VS Code
3. Run `bun run lint` to check for actual errors

### Issue: TypeScript errors

**Solution:**

1. Make sure TypeScript extension is enabled in VS Code
2. Run `bun run lint` to see actual TypeScript errors
3. Check that all dependencies are installed

## 🎯 Project Structure Overview

```
MInd_Care/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable React components
│   │   ├── chat/          # Chat functionality
│   │   ├── dashboard/     # Dashboard widgets
│   │   ├── layout/        # Layout components
│   │   ├── ui/            # UI library components
│   │   └── video/         # Video call components
│   ├── contexts/          # React Context providers
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── pages/             # Page components
│   ├── styles/            # Global styles
│   └── types/             # TypeScript type definitions
├── .github/               # GitHub templates and workflows
├── tailwind.config.ts     # Tailwind CSS configuration
├── vite.config.ts         # Vite configuration
└── package.json           # Project dependencies
```

## 🎨 Styling Guidelines

- **Tailwind CSS** for utility-first styling
- **shadcn/ui** components for consistent design
- **CSS custom properties** for themes
- **Mobile-first** responsive design approach

## 📚 Useful Commands

```bash
# Development
bun dev                    # Start development server
bun run build              # Build for production
bun run preview            # Preview production build

# Code Quality
bun run lint               # Run ESLint
bun run lint:fix           # Fix ESLint errors automatically

# Package Management
bun add <package>          # Add dependency
bun add -D <package>       # Add dev dependency
bun remove <package>       # Remove dependency
```

## 🐛 Debugging Tips

1. **Use browser dev tools** - F12 in most browsers
2. **Check the console** for JavaScript errors
3. **Use React Developer Tools** browser extension
4. **Enable source maps** in development for better debugging
5. **Use `console.log()` strategically** for debugging

## 🤝 Getting Help

If you're stuck with setup:

1. **Check existing issues** in the GitHub repository
2. **Create a new issue** with the "documentation" label
3. **Ask in discussions** for general questions
4. **Join our community** for real-time help

## ✅ Next Steps

Once your environment is set up:

1. 📖 Read the [Contributing Guidelines](CONTRIBUTING.md)
2. 🎯 Check out [Good First Issues](GOOD_FIRST_ISSUES.md)
3. 🌟 Pick an issue and start contributing!
4. 🎃 Join Hacktoberfest 2025!

Happy coding! 🚀

---

<div align="center">
<strong>Need help? Don't hesitate to ask! We're here to support you. 💙</strong>
</div>
