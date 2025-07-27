import * as fs from 'fs';
import * as path from 'path';

/**
 * Extract package name from package.json or environment variable
 * @returns The package name without scope prefix
 */
export function getPackageName(): string {
	try {
		const packageJsonPath = path.resolve(process.cwd(), 'package.json');
		if (fs.existsSync(packageJsonPath)) {
			const packageJson = JSON.parse(
				fs.readFileSync(packageJsonPath, 'utf8'),
			);
			if (packageJson.name) {
				// Extract the last part of the name if it's scoped
				const match = packageJson.name.match(/(@[\w-]+\/)?(.+)/);
				return match ? match[2] : packageJson.name;
			}
		}
	} catch (error: unknown) {
		console.error('Failed to read package.json:', error);
	}

	// Fallback to environment variable or default
	return process.env.PACKAGE_NAME || 'mcp-server';
}
