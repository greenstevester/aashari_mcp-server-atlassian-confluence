import { Command } from 'commander';
import { Logger } from '../utils/logger.util.js';
import { handleCliError } from '../utils/error.util.js';
import atlassianSpacesController from '../controllers/atlassian.spaces.controller.js';
import { ListSpacesOptions } from '../controllers/atlassian.spaces.types.js';
import { formatHeading, formatPagination } from '../utils/formatter.util.js';

/**
 * CLI module for managing Confluence spaces.
 * Provides commands for listing spaces and retrieving space details.
 * All commands require valid Atlassian credentials.
 */

/**
 * Register Confluence Spaces CLI commands with the Commander program
 * @param program - The Commander program instance to register commands with
 * @throws Error if command registration fails
 */
function register(program: Command): void {
	const cliLogger = Logger.forContext(
		'cli/atlassian.spaces.cli.ts',
		'register',
	);
	cliLogger.debug('Registering Confluence Spaces CLI commands...');

	registerListSpacesCommand(program);
	registerGetSpaceCommand(program);

	cliLogger.debug('CLI commands registered successfully');
}

/**
 * Register the command for listing Confluence spaces
 * @param program - The Commander program instance
 */
function registerListSpacesCommand(program: Command): void {
	program
		.command('list-spaces')
		.description(
			`List Confluence spaces accessible to the authenticated user.

        PURPOSE: Discover available spaces, find their keys for use in other commands (like searching or listing pages), and get a high-level overview of space metadata.

        Use Case: Useful when you don't know the exact key of a space, or when exploring available spaces. Allows filtering by type (global/personal) and status (current/archived).

        Output: Formatted list including space name, key, ID, type, status, description snippet, and URL. Supports filtering and pagination.
        
        Sorting: By default, spaces are sorted by name in descending order.

        Examples:
  $ mcp-server-atlassian-confluence list-spaces --type global --status current
  $ mcp-server-atlassian-confluence list-spaces --limit 50
  $ mcp-server-atlassian-confluence list-spaces --query "Documentation"`,
		)
		.option(
			'-l, --limit <number>',
			'Maximum number of items to return (1-100)',
			'25',
		)
		.option(
			'-c, --cursor <string>',
			'Pagination cursor for retrieving the next set of results',
		)
		.option(
			'-q, --query <text>',
			'Filter spaces by name, key, or description (simple text search, not query language)',
		)
		.option(
			'-t, --type <type>',
			'Filter by space type: global, personal',
			'global',
		)
		.option(
			'-s, --status <status>',
			'Filter by space status: current, archived',
			'current',
		)
		.action(async (options) => {
			const actionLogger = Logger.forContext(
				'cli/atlassian.spaces.cli.ts',
				'list-spaces',
			);
			try {
				actionLogger.debug('Processing command options:', options);

				// Validate type if provided
				if (
					options.type &&
					!['global', 'personal'].includes(options.type)
				) {
					throw new Error(
						'Type must be either "global" or "personal"',
					);
				}

				// Validate status if provided
				if (
					options.status &&
					!['current', 'archived'].includes(options.status)
				) {
					throw new Error(
						'Status must be either "current" or "archived"',
					);
				}

				// Validate limit if provided
				if (options.limit) {
					const limit = parseInt(options.limit, 10);
					if (isNaN(limit) || limit <= 0) {
						throw new Error(
							'Invalid --limit value: Must be a positive integer.',
						);
					}
				}

				const filterOptions: ListSpacesOptions = {
					...(options.type && { type: options.type }),
					...(options.status && { status: options.status }),
					...(options.limit && {
						limit: parseInt(options.limit, 10),
					}),
					...(options.cursor && { cursor: options.cursor }),
					...(options.query && { query: options.query }),
				};

				actionLogger.debug(
					'Fetching spaces with filters:',
					filterOptions,
				);

				const result =
					await atlassianSpacesController.list(filterOptions);

				actionLogger.debug('Successfully retrieved spaces');

				// Print the main content
				console.log(formatHeading('Spaces', 2));
				console.log(result.content);

				// Print pagination information if available
				if (result.pagination) {
					console.log(
						'\n' +
							formatPagination(
								result.pagination.count ?? 0,
								result.pagination.hasMore,
								result.pagination.nextCursor,
							),
					);
				}
			} catch (error) {
				actionLogger.error('Operation failed:', error);
				handleCliError(error);
			}
		});
}

/**
 * Register the command for retrieving a specific Confluence space
 * @param program - The Commander program instance
 */
function registerGetSpaceCommand(program: Command): void {
	program
		.command('get-space')
		.description(
			`Get detailed information about a specific Confluence space.

        PURPOSE: Retrieve comprehensive metadata for a known space, including its full description, permissions, and homepage details.`,
		)
		.requiredOption(
			'-k, --space-key <key>',
			'Key of the space to retrieve (e.g., DEV, MARKETING)',
		)
		.action(async (options) => {
			const actionLogger = Logger.forContext(
				'cli/atlassian.spaces.cli.ts',
				'get-space',
			);
			try {
				actionLogger.debug('Processing command options:', options);

				// Validate space key format (typically uppercase alphanumeric)
				if (!options.spaceKey.match(/^[A-Za-z0-9_]+$/)) {
					throw new Error(
						'Space key must contain only letters, numbers, and underscores.',
					);
				}

				actionLogger.debug(`Fetching space: ${options.spaceKey}`);

				const result = await atlassianSpacesController.get({
					spaceKey: options.spaceKey,
				});

				console.log(result.content);
			} catch (error) {
				handleCliError(error);
			}
		});
}

export default { register };
