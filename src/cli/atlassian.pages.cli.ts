import { Command } from 'commander';
import { Logger } from '../utils/logger.util.js';
import { handleCliError } from '../utils/error.util.js';
import atlassianPagesController from '../controllers/atlassian.pages.controller.js';
import { ListPagesOptions } from '../controllers/atlassian.pages.types.js';
import { formatHeading, formatPagination } from '../utils/formatter.util.js';

/**
 * CLI module for managing Confluence pages.
 * Provides commands for listing pages and retrieving page details.
 * All commands require valid Atlassian credentials.
 */

/**
 * Register Confluence Pages CLI commands with the Commander program
 * @param program - The Commander program instance to register commands with
 * @throws Error if command registration fails
 */
function register(program: Command): void {
	const cliLogger = Logger.forContext(
		'cli/atlassian.pages.cli.ts',
		'register',
	);
	cliLogger.debug('Registering Confluence Pages CLI commands...');

	registerListPagesCommand(program);
	registerGetPageCommand(program);

	cliLogger.debug('CLI commands registered successfully');
}

/**
 * Register the command for listing Confluence pages
 * @param program - The Commander program instance
 */
function registerListPagesCommand(program: Command): void {
	program
		.command('list-pages')
		.description(
			`List Confluence pages, optionally filtering by space ID(s), status, or title/content/label query.

        PURPOSE: Discover pages within specific spaces or across your instance based on status or simple text matching. Useful for finding page IDs for 'get-page'.

        Use Case: Use this for browsing pages in a known space, finding archived pages, or doing simple text searches within titles/labels. For complex content searches, use the 'search' command with CQL.

        Output: Formatted list of pages including ID, title, space ID, status, author, creation date, and URL. Supports filtering and pagination.

        Sorting: By default, pages are sorted by modified date in descending order (most recently modified first).

        Note: --space-id requires numeric IDs. Use 'list-spaces' or 'get-space' first if you only have the space key.

        Examples:
  $ mcp-server-atlassian-confluence list-pages --space-id 123456 --status current
  $ mcp-server-atlassian-confluence list-pages --limit 50 --query "Project"
  $ mcp-server-atlassian-confluence list-pages --space-id 123456,789012 --query "documentation"
  $ mcp-server-atlassian-confluence list-pages --cursor "next-cursor-value"`,
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
			'Filter pages by title, content, or labels (simple text search, not query language)',
		)
		.option(
			'-s, --space-id <ids...>',
			'Filter by one or more space IDs (numeric), separated by spaces. This is also referred to as "containerId" in the API for cross-service consistency.',
		)
		.option(
			'-S, --status <status>',
			'Filter by page status: current, archived',
			'current',
		)
		.option(
			'--sort <sort>',
			'Sort order for pages (e.g., "title", "-modified-date"). Default is "-modified-date" (most recently modified first).',
		)
		.action(async (options) => {
			const actionLogger = Logger.forContext(
				'cli/atlassian.pages.cli.ts',
				'list-pages',
			);
			try {
				actionLogger.debug('Processing command options:', options);

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

				// Create filter options for controller
				const filterOptions: ListPagesOptions = {
					// Map from CLI --space-id flag to the controller's standardized containerId parameter
					...(options.spaceId && { containerId: options.spaceId }),
					...(options.status && { status: [options.status] }),
					...(options.limit && {
						limit: parseInt(options.limit, 10),
					}),
					...(options.cursor && { cursor: options.cursor }),
					...(options.query && { query: options.query }),
					...(options.sort && { sort: options.sort }),
				};

				actionLogger.debug(
					'Fetching pages with filters:',
					filterOptions,
				);

				const result =
					await atlassianPagesController.list(filterOptions);

				actionLogger.debug('Successfully retrieved pages');

				// Print the main content
				console.log(formatHeading('Pages', 2));
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
 * Register the command for retrieving a specific Confluence page
 * @param program - The Commander program instance
 */
function registerGetPageCommand(program: Command): void {
	program
		.command('get-page')
		.description(
			`Get detailed information about a specific Confluence page using its ID.

        PURPOSE: Retrieve the full content (converted to Markdown) and comprehensive metadata for a specific Confluence page, identified by its numeric ID.`,
		)
		.requiredOption(
			'-p, --page-id <id>',
			'ID of the page to retrieve (numeric)',
		)
		.action(async (options) => {
			const actionLogger = Logger.forContext(
				'cli/atlassian.pages.cli.ts',
				'get-page',
			);
			try {
				actionLogger.debug('Processing command options:', options);

				// Validate page ID format (numeric)
				if (!options.pageId.match(/^\d+$/)) {
					throw new Error('Page ID must be numeric.');
				}

				actionLogger.debug(`Fetching page: ${options.pageId}`);

				const result = await atlassianPagesController.get({
					pageId: options.pageId,
				});

				console.log(result.content);
			} catch (error) {
				handleCliError(error);
			}
		});
}

export default { register };
