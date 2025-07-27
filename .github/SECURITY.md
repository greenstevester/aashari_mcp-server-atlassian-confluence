# Security Policy

## Supported Versions

We actively support and provide security updates for the following versions:

| Version | Supported          | End of Life |
| ------- | ------------------ | ----------- |
| 1.16.x  | ✅ Yes             | TBD         |
| 1.15.x  | ✅ Yes             | TBD         |
| 1.14.x  | ⚠️ Limited Support | TBD         |
| < 1.14  | ❌ No              | Immediate   |

**Note:** We generally support the latest minor version and one previous minor version with full security updates. Older versions may receive critical security patches on a case-by-case basis.

## Reporting Security Vulnerabilities

We take security seriously and appreciate your efforts to responsibly disclose security vulnerabilities.

### How to Report

**⚠️ Please DO NOT report security vulnerabilities through public GitHub issues.**

Instead, please report security vulnerabilities by:

1. **Email** (Preferred): Send an email to the maintainer at the address listed in the project's package.json
2. **GitHub Security Advisories**: Use GitHub's private vulnerability reporting feature
3. **Direct Message**: Contact @greenstevester directly through GitHub

### What to Include

When reporting a security vulnerability, please include:

- **Description**: A clear description of the vulnerability
- **Impact**: The potential impact and severity of the vulnerability
- **Reproduction**: Step-by-step instructions to reproduce the issue
- **Affected Versions**: Which versions of the software are affected
- **Suggested Fix**: If you have suggestions for how to fix the vulnerability
- **Credits**: How you would like to be credited (if at all)

### Response Timeline

We aim to respond to security reports according to the following timeline:

- **Initial Response**: Within 48 hours
- **Confirmation**: Within 7 days
- **Fix Development**: Within 30 days (depending on complexity)
- **Public Disclosure**: After fix is released and deployed

## Security Measures

### Development Security

- **Dependency Scanning**: Automated dependency vulnerability scanning via GitHub Actions
- **Code Analysis**: Static analysis using CodeQL for security issues
- **Secrets Detection**: Automated scanning for leaked secrets and credentials
- **Security Audits**: Regular npm audit runs in CI/CD pipeline

### Runtime Security

- **Input Validation**: All user inputs are validated using Zod schemas
- **API Security**: Secure handling of Atlassian API credentials
- **Error Handling**: Sanitized error messages to prevent information disclosure
- **Logging**: Security-conscious logging that doesn't expose sensitive data

### Authentication & Authorization

- **API Tokens**: Uses Atlassian API tokens for authentication
- **Credential Storage**: Supports secure credential storage via environment variables
- **Least Privilege**: Requests only necessary permissions from Atlassian APIs
- **Token Validation**: Validates API tokens before making requests

## Security Best Practices for Users

### Configuration Security

1. **API Token Management**
   - Use dedicated API tokens with minimal required permissions
   - Rotate API tokens regularly
   - Store tokens securely (environment variables, secret managers)
   - Never commit tokens to version control

2. **Environment Security**
   - Use `.env` files for local development (ensure they're gitignored)
   - Use secure secret management in production
   - Validate environment configuration before starting the server

3. **Network Security**
   - Use HTTPS for all Atlassian API communications
   - Consider IP restrictions on Atlassian API tokens if available
   - Monitor API usage and access patterns

### Deployment Security

1. **Container Security** (if using Docker)
   - Use official Node.js base images
   - Keep base images updated
   - Run containers as non-root user
   - Scan container images for vulnerabilities

2. **Process Security**
   - Run the MCP server with minimal system privileges
   - Use process managers that support security policies
   - Monitor process resource usage

## Known Security Considerations

### Data Handling

- **Content Processing**: Confluence content is processed and converted to Markdown
- **Caching**: No persistent caching of Confluence content by default
- **Logging**: Debug logs may contain non-sensitive request/response metadata

### API Interactions

- **Rate Limiting**: Respects Atlassian API rate limits
- **Timeout Handling**: Implements reasonable timeouts for API requests
- **Error Handling**: Graceful handling of API errors without exposing credentials

## Security Updates

### Notification Methods

We will notify users of security updates through:

1. **GitHub Security Advisories**
2. **Release Notes** with clear security indicators
3. **NPM Package Updates** with appropriate version bumps
4. **Dependabot Alerts** for downstream dependencies

### Update Recommendations

- **Immediate**: Update for critical security vulnerabilities
- **High Priority**: Update within 7 days for high-severity issues
- **Regular**: Include security updates in regular maintenance cycles

## Compliance and Standards

### Security Standards

- **OWASP**: Following OWASP security guidelines for Node.js applications
- **NIST**: Implementing security controls based on NIST cybersecurity framework
- **Industry Best Practices**: Following Node.js and npm security best practices

### Audit Compliance

- Regular security audits using automated tools
- Dependency vulnerability tracking
- Security policy reviews and updates

## Contact Information

For security-related questions or concerns that are not vulnerabilities:

- **Project Maintainer**: @greenstevester
- **GitHub Issues**: For general security questions (non-sensitive)
- **Discussions**: For community security best practices

## Acknowledgments

We appreciate the security research community and acknowledge contributors who help improve the security of this project. Security researchers who responsibly disclose vulnerabilities will be credited in our security advisories (unless they prefer to remain anonymous).

---

**Last Updated**: 2025-07-27  
**Version**: 1.0