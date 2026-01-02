# Project Guidelines

## Project Overview

It is a utils package for SolidJS

## Code Conventions

1. **Language Usage**: Use **English** for all code documentation, comments, and commit messages (unless explicitly requested otherwise). When responding to user questions, match the user's language (conversational responses only, not code)
2. **File Modifications**: Ask before creating or modifying files unless explicitly instructed
3. **No Unnecessary Documentation**: Do not create README, CHANGELOG, or other documentation files unless explicitly requested
4. **Keep This File Concise**: Avoid unnecessary complexity in project guidelines

## Linter and formatter

This project uses **Ultracite**, a zero-config Biome preset that enforces strict code quality standards through automated formatting and linting

- **Format code**: `pnpm dlx ultracite fix`
- **Check for issues**: `pnpm dlx ultracite check`
- **Diagnose setup**: `pnpm dlx ultracite doctor`
