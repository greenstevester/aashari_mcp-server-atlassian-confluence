# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Model Context Protocol (MCP) server for Atlassian Confluence written in TypeScript. It provides tools enabling AI systems to interact with Confluence instances via the standard MCP interface - listing/getting spaces & pages (formatted as Markdown) and searching via CQL.

## Essential Development Commands

### Build and Development
- `npm run build` - Compile TypeScript to JavaScript in dist/
- `npm run prepare` - Build and make dist/index.js executable (runs automatically on install)

### Testing
- `npm test` - Run all Jest tests
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:cli` - Run CLI-specific tests with extended timeout

### Code Quality
- `npm run lint` - ESLint validation (uses eslint.config.mjs)
- `npm run format` - Format code with Prettier

### Local Development and Testing
- `npm run dev:server` - Build and run server with MCP inspector in debug mode
- `npm run dev:cli` - Build and run CLI directly in debug mode
- `npm run start:server` - Build and run server with MCP inspector
- `npm run start:cli` - Build and run CLI directly

## Code Architecture

### Layered Architecture
The codebase follows a clear separation of concerns:

- **Tools Layer** (`src/tools/`) - MCP tool definitions and registration
- **Controllers Layer** (`src/controllers/`) - Business logic, request validation, and response formatting
- **Services Layer** (`src/services/`) - Atlassian API integration and HTTP transport
- **CLI Layer** (`src/cli/`) - Command-line interface implementation
- **Utils Layer** (`src/utils/`) - Shared utilities (config, logging, error handling, markdown conversion)

### Dual Mode Operation
The main entry point (`src/index.ts`) supports two modes:
- **MCP Server Mode** (no CLI args) - Runs as MCP server with STDIO transport
- **CLI Mode** (with CLI args) - Executes CLI commands directly

### Tool Implementation Pattern
Each Confluence feature (spaces, pages, search) follows consistent structure:
- `*.tool.ts` - MCP tool registration and schema
- `*.controller.ts` - Business logic and validation
- `*.service.ts` - Atlassian API communication
- `*.formatter.ts` - Response formatting
- `*.types.ts` - TypeScript type definitions
- `*.test.ts` / `*.cli.test.ts` - Unit tests

### Configuration Management
Uses a centralized config system (`src/utils/config.util.ts`) that loads from:
1. Environment variables
2. Global MCP config file (`~/.mcp/configs.json`)
3. Local `.env` files

### Content Processing
Confluence content is converted from Atlassian's storage format to Markdown using the Turndown library (`src/utils/markdown.util.ts`).

## Key Dependencies

- `@modelcontextprotocol/sdk` - MCP server implementation
- `commander` - CLI argument parsing
- `turndown` - HTML to Markdown conversion
- `zod` - Runtime type validation
- `dotenv` - Environment variable loading

## Configuration Requirements

The server requires these environment variables:
- `ATLASSIAN_SITE_NAME` - Confluence site name
- `ATLASSIAN_USER_EMAIL` - User email for authentication
- `ATLASSIAN_API_TOKEN` - API token for authentication
- `DEBUG` (optional) - Enable debug logging

## Testing Notes

- Uses Jest with ts-jest preset
- CLI tests have extended timeout (60s) and run sequentially
- Test files are co-located with source files
- Coverage excludes test files and dist directory