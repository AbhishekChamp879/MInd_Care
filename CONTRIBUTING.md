# 🤝 Contributing to Mind_Care

Thank you for your interest in contributing to MInd_Care! We're excited to have you as part of our community working to make mental health support more accessible.

## 🎯 Hacktoberfest 2025 Contributors

Welcome Hacktoberfest participants! We're thrilled to be part of Hacktoberfest 2025. Here's everything you need to know to get started.

### 🏷️ Hacktoberfest Labels

- `hacktoberfest` - Issues specifically tagged for Hacktoberfest
- `good first issue` - Perfect for newcomers
- `beginner-friendly` - Great if you're new to React/TypeScript
- `help wanted` - We need community help on these
- `documentation` - Documentation improvements
- `enhancement` - New features or improvements
- `bug` - Bug fixes needed

## 🚀 Quick Start Guide

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/MInd_Care.git
cd MInd_Care
```

### 2. Set Up Development Environment

```bash
# Install dependencies
bun install
# or
npm install

# Start development server
bun dev
# or
npm run dev
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-number
```

## 📋 Before You Start

1. **Check existing issues** - Look for `hacktoberfest` and `good first issue` labels
2. **Comment on the issue** - Let us know you're working on it
3. **Read the issue description** - Make sure you understand the requirements
4. **Ask questions** - Don't hesitate to ask for clarification

## 🛠️ Development Guidelines

### Code Style

We use ESLint and Prettier for consistent code formatting:

### TypeScript

- Use TypeScript for all new code
- Define proper types for props and state
- Avoid `any` types when possible
- Use existing types from `src/types/`

### React Best Practices

- Use functional components with hooks
- Follow React naming conventions
- Use proper prop types
- Implement proper error boundaries when needed

### Styling Guidelines

- Use Tailwind CSS for styling
- Follow mobile-first responsive design
- Use existing shadcn/ui components when possible
- Maintain consistent spacing and typography
- Support both light and dark themes

## 🎯 Contribution Types

### 🐛 Bug Fixes

1. **Reproduce the bug** locally
2. **Create a test case** if possible
3. **Fix the issue** with minimal changes
4. **Test thoroughly** in different scenarios

### ✨ New Features

1. **Check if the feature exists** in issues or discussions
2. **Start with a small implementation**
3. **Add proper error handling**
4. **Update documentation** if needed

### 📚 Documentation

1. **Use clear, concise language**
2. **Include code examples** when helpful
3. **Update README** if you're changing major functionality
4. **Add inline comments** for complex logic

### 🎨 UI/UX Improvements

1. **Follow existing design patterns**
2. **Ensure accessibility** (WCAG guidelines)
3. **Test on mobile devices**
4. **Consider dark mode compatibility**

## 🧪 Testing Your Changes

### Manual Testing

1. **Test your feature** thoroughly
2. **Check different screen sizes**
3. **Test both light and dark themes**
4. **Verify accessibility** with screen readers if possible

### Browser Testing

Test your changes in:

- Chrome/Chromium
- Firefox
- Safari (if possible)
- Mobile browsers

## 📝 Commit Guidelines

### Commit Message Format

```
type(scope): brief description

Longer description if needed

Closes #issue-number
```

### Types

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Build process or auxiliary tool changes

### Examples

```bash
feat(dashboard): add mood tracking widget

Implement a new widget for the dashboard that allows users to track their daily mood with interactive charts and analytics.

Closes #123
```

```bash
fix(chat): resolve message overflow in mobile view

Fixed chat messages overflowing container on mobile devices by adjusting CSS grid layout and text wrapping.

Closes #45
```

## 🔄 Pull Request Process

### 1. Preparation

- Ensure your branch is up to date with main
- Test your changes locally
- Check that lint passes
- Write descriptive commit messages

### 2. Creating the PR

```bash
git push origin your-branch-name
```

Then create a PR on GitHub with:

- **Clear title** describing the change
- **Description** explaining what you did and why
- **Screenshots** for UI changes
- **Reference to issue** number
- **Testing notes** for reviewers

### 3. PR Template

Use this template for your PR description:

```markdown
## 📝 Description

Brief description of changes

## 🔗 Related Issue

Closes #issue-number

## 🧪 Testing

- [ ] Manual testing completed
- [ ] Responsive design verified
- [ ] Dark mode compatibility checked
- [ ] Accessibility considerations reviewed

## 📷 Screenshots

(If applicable)

## ✅ Checklist

- [ ] Code follows project conventions
- [ ] Self-review completed
- [ ] Documentation updated if needed
- [ ] No console errors
```

## 🚫 What NOT to Contribute

- **Spam PRs** - Low-quality changes just to get PRs accepted
- **Duplicate work** - Check existing PRs and issues first
- **Major architecture changes** - Discuss these in issues first
- **Unrelated changes** - Keep PRs focused on one issue
- **Breaking changes** - Without prior discussion

## 🌟 Good First Issues Ideas

If you're looking for ways to contribute, here are some beginner-friendly areas:

### Documentation

- Add JSDoc comments to components
- Improve README sections
- Create component documentation
- Add setup guides for different operating systems

### UI Improvements

- Add loading states to components
- Improve mobile responsiveness
- Add micro-interactions and animations
- Enhance form validation messages

### Accessibility

- Add ARIA labels
- Improve keyboard navigation
- Enhance screen reader support
- Add focus indicators

### Features

- Add new dashboard widgets
- Create additional themes
- Implement form validation
- Add new mental health resources

## 🤔 Need Help?

- **Questions about setup?** - Check existing issues or create a new one
- **Stuck on implementation?** - Comment on the issue you're working on
- **Need design guidance?** - Look at existing components for patterns
- **Want to propose a feature?** - Create an issue for discussion first

## 📋 Code Review Process

### What We Look For

- **Functionality** - Does it work as expected?
- **Code quality** - Is it readable and maintainable?
- **Performance** - Does it impact app performance?
- **Accessibility** - Is it accessible to all users?
- **Design consistency** - Does it match existing patterns?

### Review Timeline

- We aim to review PRs within 2-3 days
- Complex changes may take longer
- Please be patient and responsive to feedback

## 🏆 Recognition

### Contributors

All contributors will be recognized in our README and project documentation.

### Hacktoberfest Completion

- Quality PRs that meet our guidelines count toward Hacktoberfest
- We reserve the right to mark low-quality PRs as spam
- Focus on meaningful contributions over quantity

## 📜 Code of Conduct

This project follows our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold these standards.

## 🎉 Thank You!

Your contributions help make mental health support more accessible to everyone. Whether you're fixing a small bug or adding a major feature, every contribution matters!

Happy coding! 🚀

---

<div align="center">
<strong>Questions? Don't hesitate to ask! We're here to help. 💙</strong>
</div>
