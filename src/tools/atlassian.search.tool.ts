import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Logger } from '../utils/logger.util.js';
import { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js';
import {
	ServerRequest,
	ServerNotification,
} from '@modelcontextprotocol/sdk/types.js';
import { formatErrorForMcpTool } from '../utils/error.util.js';
import {
	SearchToolArgsType,
	SearchToolArgs,
} from './atlassian.search.types.js';

import atlassianSearchController from '../controllers/atlassian.search.controller.js';

/**
 * MCP Tool: Search Confluence
 *
 * Searches Confluence content using CQL (Confluence Query Language).
 * Returns a formatted markdown response with search results.
 *
 * @param {SearchToolArgsType} args - Tool arguments for the search query
 * @param {RequestHandlerExtra} _extra - Extra request handler information (unused)
 * @returns {Promise<{ content: Array<{ type: 'text', text: string }> }>} MCP response with formatted search results
 * @throws Will return error message if search fails
 */
async function search(
	args: SearchToolArgsType,
	_extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
) {
	const toolLogger = Logger.forContext(
		'tools/atlassian.search.tool.ts',
		'search',
	);
	toolLogger.debug('Searching Confluence with filters:', args);

	try {
		// Pass the search options to the controller
		const message = await atlassianSearchController.search({
			cql: args.cql,
			limit: args.limit,
			cursor: args.cursor,
		});

		toolLogger.debug(
			'Successfully retrieved search results from controller',
			message,
		);

		return {
			content: [
				{
					type: 'text' as const,
					text: message.content,
				},
			],
		};
	} catch (error) {
		toolLogger.error('Failed to search Confluence', error);
		return formatErrorForMcpTool(error);
	}
}

/**
 * Register Atlassian Search MCP Tools
 *
 * Registers the search tool with the MCP server.
 * The tool is registered with its schema, description, and handler function.
 *
 * @param {McpServer} server - The MCP server instance to register tools with
 */
function register(server: McpServer) {
	const toolLogger = Logger.forContext(
		'tools/atlassian.search.tool.ts',
		'register',
	);
	toolLogger.debug('Registering Atlassian Search tools...');

	// Register the search tool
	server.tool(
		'search',
		`Search Confluence content using CQL (Confluence Query Language) for precise results.

        PURPOSE: Performs advanced content searches across Confluence using CQL queries, allowing for complex search patterns, content filtering, and targeted results. This is the most powerful search tool for Confluence, supporting complex filtering and sorting.

        WHEN TO USE:
        - When you need to search for specific text or patterns within page content (not just titles).
        - When you need to combine multiple search criteria (e.g., text + space + date + type).
        - When you need to search using complex logical operators (AND, OR, NOT).
        - When simple title/label searches via 'list_pages' are insufficient.
        - When you need to search across all content types (pages, blog posts, attachments, etc.).
        - When you need fine-grained sorting control over search results.

        WHEN NOT TO USE:
        - When you already know the page ID (use 'get_page' instead).
        - When you only need to list pages in a space by title (use 'list_pages' with optional query).
        - When you need to explore or browse spaces (use space-related tools).
        - When you're not searching for actual content (e.g., for space metadata).

        RETURNS: Formatted search results including:
        - Result type (page, blog, attachment, etc.)
        - Title and content excerpt with highlighted match terms
        - Space information, creation metadata, and URL
        - Content ID for use with other tools like 'get_page'
        
        Results can be paginated using the 'limit' and 'cursor' parameters.

        CQL EXAMPLES:
        - Basic text search: { cql: "text ~ 'project plan'" }
        - Combined criteria: { cql: "text ~ 'quarterly report' AND space = DEV AND type = 'page'" }
        - Date filtering: { cql: "created >= '2023-01-01' AND created <= '2023-12-31'" }
        - Content by specific user: { cql: "creator = 'jsmith'" }
        - Exact phrase with label: { cql: "text = 'API Documentation' AND label = 'public'" }
        
        Common CQL fields:
        - text: Full-text content search
        - title: Title search
        - space: Space key
        - type: Content type (page, blogpost, attachment)
        - created/modified: Date criteria
        - label: Content labels
        - creator/contributor: User references

        ERRORS:
        - Invalid CQL syntax: Check query format against CQL documentation.
        - No results: Try broadening search criteria.
        - Authentication/permission failures: Ensure proper credentials.
        - Rate limiting: For large result sets, use pagination and caching.`,
		SearchToolArgs.shape,
		search,
	);

	toolLogger.debug('Successfully registered Atlassian Search tools');
}

export default { register };
