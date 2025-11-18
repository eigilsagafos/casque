# Changesets

This project uses [changesets](https://github.com/changesets/changesets) to manage versions and releases.

## Workflow

### 1. Making Changes

When you make changes that should be released:

```bash
bun run changeset
```

This will:
- Prompt you to select which packages changed
- Ask for the type of change (major, minor, patch)
- Ask for a summary of the change

The changeset will be saved in `.changeset/` as a markdown file.

### 2. Versioning (Automated)

When changesets are merged to `main`, the GitHub Action will:
- Create a "Version Packages" PR that bumps versions and updates CHANGELOGs
- You review and merge this PR when ready to release

### 3. Publishing (Automated)

Once you merge the "Version Packages" PR:
- The GitHub Action automatically publishes to npm
- Creates a git tag (e.g., `casque@0.0.3`)
- Creates a GitHub release with the changelog
- Only runs when versions are actually changed (not on every push to main)

## Manual Release

If you need to manually release:

```bash
# 1. Version packages
bun run version

# 2. Build and publish
bun run release
```

## Examples

### Patch Release (Bug Fix)
```bash
bun run changeset
# Select: casque
# Type: patch
# Summary: "Fix collision detection for anchor alignment"
```

### Minor Release (New Feature)
```bash
bun run changeset
# Select: casque
# Type: minor
# Summary: "Add new grid layout component"
```

### Major Release (Breaking Change)
```bash
bun run changeset
# Select: casque
# Type: major
# Summary: "BREAKING: Rename row to horizontal"
```

## Quick Commands

### Fast Changeset Creation (Skip Prompts)
```bash
# Patch (0.0.1 → 0.0.2)
bun run changeset:patch

# Minor (0.1.0 → 0.2.0)
bun run changeset:minor

# Major (1.0.0 → 2.0.0)
bun run changeset:major
```

### Pre-release Workflow
```bash
# Enter pre-release mode
bunx changeset pre enter alpha

# Create changesets
bun run changeset

# Version and publish
bun run version
bun run release
# Result: 0.0.1-alpha.0

# Exit pre-release mode
bunx changeset pre exit
```

### Snapshot Releases (Canary)
For testing unreleased versions:
```bash
bun run version:snapshot
bun run release:snapshot
# Result: 0.0.1-snapshot-20231121120000
# Published with "next" tag
```

Install with: `npm install casque@next`

## Semantic Versioning Guide

**Patch (0.0.X)** - Bug fixes, no breaking changes
- Fix: collision detection bug
- Fix: typo in documentation
- Performance improvement

**Minor (0.X.0)** - New features, backwards compatible
- Add: new layout component
- Add: new configuration option
- Feature: support for nested layouts

**Major (X.0.0)** - Breaking changes
- BREAKING: rename `row` to `horizontal`
- BREAKING: change API signature
- BREAKING: remove deprecated feature

## Tips

- Always create a changeset for changes to `casque` package
- Docs and test-utils are automatically ignored
- Multiple changesets can be created before releasing
- All changesets are combined when versioning
- Use `pre enter` for alpha/beta/rc releases
- Use `snapshot` for one-off test releases
