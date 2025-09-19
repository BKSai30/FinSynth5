# Contributing to FinSynth

Thank you for your interest in contributing to FinSynth! We welcome contributions from the community and are grateful for your help in making this project better.

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- Git

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/finsynth.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Install dependencies:
   ```bash
   # Backend
   pip install -r requirements.txt
   
   # Frontend
   npm install
   ```

## 📝 How to Contribute

### Reporting Bugs
- Use the GitHub issue tracker
- Include detailed steps to reproduce
- Provide system information (OS, Python/Node versions)
- Include error messages and logs

### Suggesting Features
- Use the GitHub issue tracker with the "enhancement" label
- Describe the feature and its benefits
- Consider implementation complexity

### Code Contributions
1. **Fork and Clone**: Fork the repository and clone your fork
2. **Create Branch**: Create a feature branch from `main`
3. **Make Changes**: Implement your changes with tests
4. **Test**: Ensure all tests pass
5. **Commit**: Use conventional commit messages
6. **Push**: Push to your fork
7. **Pull Request**: Create a pull request

## 🎯 Development Guidelines

### Code Style
- **Python**: Follow PEP 8
- **TypeScript/JavaScript**: Use ESLint configuration
- **CSS**: Follow Tailwind CSS conventions

### Commit Messages
Use conventional commit format:
```
type(scope): description

feat(auth): add password reset functionality
fix(forecast): resolve decimal values in Excel export
docs(readme): update installation instructions
```

### Testing
- Write tests for new features
- Ensure existing tests pass
- Test both frontend and backend changes

### Documentation
- Update README.md for significant changes
- Add JSDoc comments for functions
- Update API documentation

## 🏗️ Project Structure

```
FinSynth/
├── app/                    # Next.js frontend
├── backend/               # FastAPI backend
├── components/            # Shared components
├── public/               # Static assets
└── docs/                 # Documentation
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
npm test
```

### Manual Testing
1. Test user registration and login
2. Test forecast generation
3. Test file upload functionality
4. Test export features

## 📋 Pull Request Process

1. **Update Documentation**: Update README.md if needed
2. **Add Tests**: Include tests for new functionality
3. **Update Version**: Update version numbers if applicable
4. **Check CI**: Ensure all CI checks pass
5. **Request Review**: Request review from maintainers

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass
- [ ] Manual testing completed
- [ ] No breaking changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Environment**:
   - OS and version
   - Python version
   - Node.js version
   - Browser (for frontend issues)

2. **Steps to Reproduce**:
   - Clear, numbered steps
   - Expected vs actual behavior

3. **Additional Context**:
   - Screenshots if applicable
   - Error messages
   - Log files

## 💡 Feature Requests

When suggesting features:

1. **Problem**: What problem does this solve?
2. **Solution**: Describe your proposed solution
3. **Alternatives**: What alternatives have you considered?
4. **Additional Context**: Any other relevant information

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **Email**: Contact maintainers directly for sensitive issues

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You

Thank you for contributing to FinSynth! Your contributions help make financial forecasting more accessible and powerful for businesses worldwide.

---

**Happy Coding! 🚀**
