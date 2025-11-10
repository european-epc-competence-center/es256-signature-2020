# Release Process

This document describes how to release a new version of the `es256-signature-2020` package to npm.

## Prerequisites

1. You must have write access to the GitHub repository
2. The `EECC_NPM_TOKEN` secret must be configured in the GitHub repository settings
   - Go to Settings → Secrets and variables → Actions
   - Add a new repository secret named `EECC_NPM_TOKEN` with your npm access token

## Release Steps

### 1. Update the Changelog

Before creating a release, add your changes to `CHANGELOG.md` under an `## [Unreleased]` section:

```markdown
## [Unreleased]

### Added
- New feature description

### Changed
- Changed feature description

### Fixed
- Bug fix description
```

### 2. Run the Release Script

The release script will:
- Bump the version in `package.json`
- Move unreleased changes to a new version section in `CHANGELOG.md`
- Create a git commit and tag
- Push changes and tags to GitHub

Run one of the following commands depending on the type of release:

```bash
# For a patch release (1.0.0 -> 1.0.1)
npm run release patch

# For a minor release (1.0.0 -> 1.1.0)
npm run release minor

# For a major release (1.0.0 -> 2.0.0)
npm run release major
```

**Optional:** Skip git operations with `--skip-git` flag:
```bash
npm run release patch --skip-git
```

### 3. Create a GitHub Release

After the script completes:

1. Go to the GitHub repository
2. Click on "Releases" → "Create a new release"
3. Select the tag that was just created (e.g., `v1.0.1`)
4. Add release notes (you can copy from the CHANGELOG)
5. Click "Publish release"

### 4. Automated Publishing

Once the GitHub release is created, the GitHub Actions workflow will automatically:
- Run tests
- Build the project
- Publish to npm with public access

You can monitor the progress in the "Actions" tab of the GitHub repository.

## Troubleshooting

### Release script fails to push

If the git push fails, you can manually push:

```bash
git push && git push --tags
```

### GitHub Actions workflow fails

Check the Actions tab in GitHub to see the error. Common issues:
- Missing or invalid `EECC_NPM_TOKEN` secret
- Test failures
- Build errors

### Need to unpublish a version

Contact the package maintainers or use npm's unpublish command (only works within 72 hours):

```bash
npm unpublish es256-signature-2020@<version>
```

## Version Numbering

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR** version: Incompatible API changes
- **MINOR** version: Backwards-compatible functionality additions
- **PATCH** version: Backwards-compatible bug fixes

