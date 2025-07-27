import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as crypto from 'crypto';
import { getPackageName } from './package.util';

/**
 * Format a timestamp for logging
 * @returns Formatted timestamp [HH:MM:SS]
 */
function getTimestamp(): string {
	const now = new Date();
	return `[${now.toISOString().split('T')[1].split('.')[0]}]`;
}

/**
 * Safely convert object to string with size limits
 * @param obj Object to stringify
 * @param maxLength Maximum length of the resulting string
 * @returns Safely stringified object
 */
function safeStringify(obj: unknown, maxLength = 2000): string {
	try {
		const str = JSON.stringify(obj);
		if (str.length <= maxLength) {
			return str;
		}
		return `${str.substring(0, maxLength)}... (truncated, ${str.length} chars total)`;
	} catch (error: unknown) {
		console.error('Failed to stringify object:', error);
		return '[Object cannot be stringified]';
	}
}

/**
 * Extract essential values from larger objects for logging
 * @param obj The object to extract values from
 * @param keys Keys to extract (if available)
 * @returns Object containing only the specified keys
 */
function extractEssentialValues(
	obj: Record<string, unknown>,
	keys: string[],
): Record<string, unknown> {
	const result: Record<string, unknown> = {};
	keys.forEach((key) => {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			result[key] = obj[key];
		}
	});
	return result;
}

/**
 * Format source path consistently using the standardized format:
 * [module/file.ts@function] or [module/file.ts]
 *
 * @param filePath File path (with or without src/ prefix)
 * @param functionName Optional function name
 * @returns Formatted source path according to standard pattern
 */
function formatSourcePath(filePath: string, functionName?: string): string {
	// Always strip 'src/' prefix for consistency
	const normalizedPath = filePath.replace(/^src\//, '');

	return functionName
		? `[${normalizedPath}@${functionName}]`
		: `[${normalizedPath}]`;
}

/**
 * Check if debug logging is enabled for a specific module
 *
 * This function parses the DEBUG environment variable to determine if a specific
 * module should have debug logging enabled. The DEBUG variable can be:
 * - 'true' or '1': Enable all debug logging
 * - Comma-separated list of modules: Enable debug only for those modules
 * - Module patterns with wildcards: e.g., 'controllers/*' enables all controllers
 *
 * Examples:
 * - DEBUG=true
 * - DEBUG=controllers/*,services/aws.sso.auth.service.ts
 * - DEBUG=transport,utils/formatter*
 *
 * @param modulePath The module path to check against DEBUG patterns
 * @returns true if debug is enabled for this module, false otherwise
 */
function isDebugEnabledForModule(modulePath: string): boolean {
	const debugEnv = process.env.DEBUG;

	if (!debugEnv) {
		return false;
	}

	// If debug is set to true or 1, enable all debug logging
	if (debugEnv === 'true' || debugEnv === '1') {
		return true;
	}

	// Parse comma-separated debug patterns
	const debugPatterns = debugEnv.split(',').map((p) => p.trim());

	// Check if the module matches any pattern
	return debugPatterns.some((pattern) => {
		// Convert glob-like patterns to regex
		// * matches anything within a path segment
		// ** matches across path segments
		const regexPattern = pattern
			.replace(/\*/g, '.*') // Convert * to regex .*
			.replace(/\?/g, '.'); // Convert ? to regex .

		const regex = new RegExp(`^${regexPattern}$`);
		return (
			regex.test(modulePath) ||
			// Check for pattern matches without the 'src/' prefix
			regex.test(modulePath.replace(/^src\//, ''))
		);
	});
}

// Constants for logging configuration
const LOGGING_CONSTANTS = {
	MAX_LOG_LINE_LENGTH: 2000,
	LOG_BATCH_SIZE: 10,
	SESSION_ID_LENGTH: 36,
	DEFAULT_LOG_LEVEL: 'info',
	FILE_PERMISSIONS: {
		LOG_DIR: 0o755,
		LOG_FILE: 0o644,
	},
} as const;

// Generate a unique session ID for this process
const SESSION_ID = crypto.randomUUID();

// Async logging setup
class AsyncLogger {
	private static logQueue: string[] = [];
	private static isProcessing = false;
	private static logStream: fs.WriteStream | null = null;
	private static logFilePath: string;
	private static mcpDataDir: string;

	/**
	 * Initialize the async logger with secure file operations
	 */
	static initialize(): void {
		try {
			const homeDir = os.homedir();
			this.mcpDataDir = path.join(homeDir, '.mcp', 'data');
			const cliName = getPackageName();

			// Ensure the MCP data directory exists with proper permissions
			if (!fs.existsSync(this.mcpDataDir)) {
				fs.mkdirSync(this.mcpDataDir, {
					recursive: true,
					mode: LOGGING_CONSTANTS.FILE_PERMISSIONS.LOG_DIR,
				});
			}

			// Create the log file path with session ID
			const logFilename = `${cliName}.${SESSION_ID}.log`;
			this.logFilePath = path.join(this.mcpDataDir, logFilename);

			// Validate file path to prevent directory traversal
			const resolvedPath = path.resolve(this.logFilePath);
			if (!resolvedPath.startsWith(path.resolve(this.mcpDataDir))) {
				throw new Error(
					'Invalid log file path: potential directory traversal',
				);
			}

			// Initialize log file with header
			const logHeader =
				`# ${cliName} Log Session\n` +
				`Session ID: ${SESSION_ID}\n` +
				`Started: ${new Date().toISOString()}\n` +
				`Process ID: ${process.pid}\n` +
				`Working Directory: ${process.cwd()}\n` +
				`Command: ${process.argv.join(' ')}\n\n` +
				`## Log Entries\n\n`;

			fs.writeFileSync(resolvedPath, logHeader, {
				encoding: 'utf8',
				mode: LOGGING_CONSTANTS.FILE_PERMISSIONS.LOG_FILE,
			});
		} catch (error: unknown) {
			console.error('Failed to initialize logging:', error);
			// Set fallback path to avoid further errors
			this.logFilePath = '/dev/null';
		}
	}

	/**
	 * Get or create the log write stream
	 */
	private static getLogStream(): fs.WriteStream {
		if (!this.logStream) {
			this.logStream = fs.createWriteStream(this.logFilePath, {
				flags: 'a',
				encoding: 'utf8',
			});

			// Handle stream errors
			this.logStream.on('error', (error: unknown) => {
				console.error('Log stream error:', error);
				this.logStream = null; // Reset stream for retry
			});
		}
		return this.logStream;
	}

	/**
	 * Add a log message to the queue for async processing
	 */
	static queueLog(message: string): void {
		this.logQueue.push(message);
		this.processLogQueue();
	}

	/**
	 * Process the log queue asynchronously
	 */
	private static async processLogQueue(): Promise<void> {
		if (this.isProcessing || this.logQueue.length === 0) {
			return;
		}

		this.isProcessing = true;

		try {
			// Process logs in batches for better performance
			const batch = this.logQueue.splice(
				0,
				LOGGING_CONSTANTS.LOG_BATCH_SIZE,
			);
			const batchContent = batch.join('\n') + '\n';

			// Use write stream for better performance
			const stream = this.getLogStream();
			await new Promise<void>((resolve, reject) => {
				stream.write(batchContent, (error) => {
					if (error) {
						reject(error);
					} else {
						resolve();
					}
				});
			});
		} catch (error: unknown) {
			console.error('Failed to write log batch:', error);
			// Add failed logs back to the queue for retry
			// Note: In a production system, you might want to implement
			// a dead letter queue or exponential backoff
		} finally {
			this.isProcessing = false;

			// Continue processing if there are more logs
			if (this.logQueue.length > 0) {
				setImmediate(() => this.processLogQueue());
			}
		}
	}

	/**
	 * Get the current log file path
	 */
	static getLogFilePath(): string {
		return this.logFilePath;
	}

	/**
	 * Cleanup resources when the process exits
	 */
	static cleanup(): void {
		if (this.logStream) {
			this.logStream.end();
			this.logStream = null;
		}
	}
}

// Initialize async logger
AsyncLogger.initialize();

// Cleanup on process exit
process.on('exit', () => AsyncLogger.cleanup());
process.on('SIGINT', () => {
	AsyncLogger.cleanup();
	process.exit(0);
});
process.on('SIGTERM', () => {
	AsyncLogger.cleanup();
	process.exit(0);
});

// Logger singleton to track initialization
let isLoggerInitialized = false;

/**
 * Logger class for consistent logging across the application.
 *
 * RECOMMENDED USAGE:
 *
 * 1. Create a file-level logger using the static forContext method:
 *    ```
 *    const logger = Logger.forContext('controllers/myController.ts');
 *    ```
 *
 * 2. For method-specific logging, create a method logger:
 *    ```
 *    const methodLogger = Logger.forContext('controllers/myController.ts', 'myMethod');
 *    ```
 *
 * 3. Avoid using raw string prefixes in log messages. Instead, use contextualized loggers.
 *
 * 4. For debugging objects, use the debugResponse method to log only essential properties.
 *
 * 5. Set DEBUG environment variable to control which modules show debug logs:
 *    - DEBUG=true (enable all debug logs)
 *    - DEBUG=controllers/*,services/* (enable for specific module groups)
 *    - DEBUG=transport,utils/formatter* (enable specific modules, supports wildcards)
 */
class Logger {
	private context?: string;
	private modulePath: string;
	private static sessionId = SESSION_ID;

	constructor(context?: string, modulePath: string = '') {
		this.context = context;
		this.modulePath = modulePath;

		// Log initialization message only once
		if (!isLoggerInitialized) {
			this.info(
				`Logger initialized with session ID: ${Logger.sessionId}`,
			);
			this.info(`Logs will be saved to: ${AsyncLogger.getLogFilePath()}`);
			isLoggerInitialized = true;
		}
	}

	/**
	 * Create a contextualized logger for a specific file or component.
	 * This is the preferred method for creating loggers.
	 *
	 * @param filePath The file path (e.g., 'controllers/aws.sso.auth.controller.ts')
	 * @param functionName Optional function name for more specific context
	 * @returns A new Logger instance with the specified context
	 *
	 * @example
	 * // File-level logger
	 * const logger = Logger.forContext('controllers/myController.ts');
	 *
	 * // Method-level logger
	 * const methodLogger = Logger.forContext('controllers/myController.ts', 'myMethod');
	 */
	static forContext(filePath: string, functionName?: string): Logger {
		return new Logger(formatSourcePath(filePath, functionName), filePath);
	}

	/**
	 * Create a method level logger from a context logger
	 * @param method Method name
	 * @returns A new logger with the method context
	 */
	forMethod(method: string): Logger {
		return Logger.forContext(this.modulePath, method);
	}

	private _formatMessage(message: string): string {
		return this.context ? `${this.context} ${message}` : message;
	}

	private _formatArgs(args: unknown[]): unknown[] {
		// If the first argument is an object and not an Error, safely stringify it
		if (
			args.length > 0 &&
			typeof args[0] === 'object' &&
			args[0] !== null &&
			!(args[0] instanceof Error)
		) {
			args[0] = safeStringify(args[0]);
		}
		return args;
	}

	_log(
		level: 'info' | 'warn' | 'error' | 'debug',
		message: string,
		...args: unknown[]
	) {
		// Skip debug messages if not enabled for this module
		if (level === 'debug' && !isDebugEnabledForModule(this.modulePath)) {
			return;
		}

		const timestamp = getTimestamp();
		const prefix = `${timestamp} [${level.toUpperCase()}]`;
		let logMessage = `${prefix} ${this._formatMessage(message)}`;

		const formattedArgs = this._formatArgs(args);
		if (formattedArgs.length > 0) {
			// Handle errors specifically
			if (formattedArgs[0] instanceof Error) {
				const error = formattedArgs[0] as Error;
				logMessage += ` Error: ${error.message}`;
				if (error.stack) {
					logMessage += `\n${error.stack}`;
				}
				// If there are more args, add them after the error
				if (formattedArgs.length > 1) {
					logMessage += ` ${formattedArgs
						.slice(1)
						.map((arg) =>
							typeof arg === 'string' ? arg : safeStringify(arg),
						)
						.join(' ')}`;
				}
			} else {
				logMessage += ` ${formattedArgs
					.map((arg) =>
						typeof arg === 'string' ? arg : safeStringify(arg),
					)
					.join(' ')}`;
			}
		}

		// Queue log message for async processing
		AsyncLogger.queueLog(logMessage);

		if (process.env.NODE_ENV === 'test') {
			console[level](logMessage);
		} else {
			console.error(logMessage);
		}
	}

	info(message: string, ...args: unknown[]) {
		this._log('info', message, ...args);
	}

	warn(message: string, ...args: unknown[]) {
		this._log('warn', message, ...args);
	}

	error(message: string, ...args: unknown[]) {
		this._log('error', message, ...args);
	}

	debug(message: string, ...args: unknown[]) {
		this._log('debug', message, ...args);
	}

	/**
	 * Log essential information about an API response
	 * @param message Log message
	 * @param response API response object
	 * @param essentialKeys Keys to extract from the response
	 */
	debugResponse(
		message: string,
		response: Record<string, unknown>,
		essentialKeys: string[],
	) {
		const essentialInfo = extractEssentialValues(response, essentialKeys);
		this.debug(message, essentialInfo);
	}

	/**
	 * Get the current session ID
	 * @returns The UUID for the current logging session
	 */
	static getSessionId(): string {
		return Logger.sessionId;
	}

	/**
	 * Get the current log file path
	 * @returns The path to the current log file
	 */
	static getLogFilePath(): string {
		return AsyncLogger.getLogFilePath();
	}
}

// Only export the Logger class to enforce contextual logging via Logger.forContext
export { Logger };
