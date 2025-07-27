import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js';
import type {
	ServerRequest,
	ServerNotification,
} from '@modelcontextprotocol/sdk/types.js';
import { Logger } from '../utils/logger.util.js';
import { formatErrorForMcpTool } from '../utils/error.util.js';
import atlassianPagesController from '../controllers/atlassian.pages.controller.js';
import {
	ListPagesToolArgs,
	ListPagesToolArgsType,
	GetPageToolArgs,
	GetPageToolArgsType,
} from './atlassian.pages.types.js';

/**
 * MCP Tool: List Confluence Pages
 *
 * Lists Confluence pages with optional filtering by space, status, and limit.
 * Returns a formatted markdown response with page details and pagination info.
 *
 * @param {ListPagesToolArgsType} args - Tool arguments for filtering pages
 * @param {RequestHandlerExtra} _extra - Extra request handler information (unused)
 * @returns {Promise<{ content: Array<{ type: 'text', text: string }> }>} MCP response with formatted pages list
 * @throws Will return error message if page listing fails
 */
async function listPages(
	args: ListPagesToolArgsType,
	_extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
) {
	const methodLogger = Logger.forContext(
		'tools/atlassian.pages.tool.ts',
		'listPages',
	);
	methodLogger.debug('Tool called with args:', args);

	try {
		// Map the tool args to controller options
		const options: Record<string, unknown> = {};

		if (args.spaceId) {
			options.containerId = args.spaceId;
		}
		if (args.query) {
			options.query = args.query;
		}
		if (args.status) {
			options.status = args.status;
		}
		if (args.limit) {
			options.limit = args.limit;
		}
		if (args.cursor) {
			options.cursor = args.cursor;
		}
		if (args.sort) {
			options.sort = args.sort;
		}

		methodLogger.debug('Calling controller with options:', options);

		// Call the controller to list pages with the provided options
		const result = await atlassianPagesController.list(options);

		methodLogger.debug('Successfully retrieved pages list');

		// Convert the string content to an MCP text resource with the correct type
		return {
			content: [
				{
					type: 'text' as const,
					text: result.content,
				},
			],
		};
	} catch (error) {
		methodLogger.error('Error listing pages:', error);
		// Format the error for MCP tools
		return formatErrorForMcpTool(error);
	}
}

/**
 * MCP Tool: Get Confluence Page Details
 *
 * Retrieves detailed information about a specific Confluence page.
 * Returns a formatted markdown response with page content and metadata.
 *
 * @param {GetPageToolArgsType} args - Tool arguments containing the page ID
 * @param {RequestHandlerExtra} _extra - Extra request handler information (unused)
 * @returns {Promise<{ content: Array<{ type: 'text', text: string }> }>} MCP response with formatted page details
 * @throws Will return error message if page retrieval fails
 */
async function getPage(
	args: GetPageToolArgsType,
	_extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
) {
	const methodLogger = Logger.forContext(
		'tools/atlassian.pages.tool.ts',
		'getPage',
	);
	methodLogger.debug('Tool called with args:', args);

	try {
		// Call the controller to get page details
		const result = await atlassianPagesController.get({
			pageId: args.pageId,
		});

		methodLogger.debug('Successfully retrieved page details');

		// Convert the string content to an MCP text resource with the correct type
		return {
			content: [
				{
					type: 'text' as const,
					text: result.content,
				},
			],
		};
	} catch (error) {
		methodLogger.error('Error retrieving page details:', error);
		// Format the error for MCP tools
		return formatErrorForMcpTool(error);
	}
}

/**
 * Register Atlassian Pages MCP Tools
 *
 * Registers the list-pages and get-page tools with the MCP server.
 * Each tool is registered with its schema, description, and handler function.
 *
 * @param {McpServer} server - The MCP server instance to register tools with
 */
function register(server: McpServer) {
	const toolLogger = Logger.forContext(
		'tools/atlassian.pages.tool.ts',
		'register',
	);
	toolLogger.debug('Registering Atlassian Pages tools...');

	// Register the list pages tool
	server.tool(
		'list_pages',
		`List Confluence pages, optionally filtering by space ID(s), status, or title/content/label query, with pagination.

        PURPOSE: Discover pages within specific spaces or across the instance based on status or simple text matching. Provides page metadata and IDs needed for the 'get_page' tool.

        WHEN TO USE:
        - To list pages within one or more specific spaces (using 'spaceId').
        - To find pages based on their status ('current', 'archived', etc.).
        - To perform simple text searches on page titles or labels ('query').
        - To get an overview of recent pages in a space before getting full content.
        - To obtain 'pageId' values for use with 'get_page'.

        WHEN NOT TO USE:
        - When you need to search the *full content* of pages with complex logic (use 'search' with CQL).
        - When you already know the 'pageId' and need details (use 'get_page').
        - When you need space information (use space tools).
        - If you only have the space *key* (use 'list-spaces' or 'get-space' to find the numeric 'spaceId' first).

        RETURNS: Formatted list of pages including ID, title, space ID, status, author, creation date, version, and URL. Includes pagination details if applicable (Confluence uses cursor-based pagination).
        
        SORTING: By default, pages are sorted by modified date in descending order (most recently modified first). You can change this by specifying a different value in the 'sort' parameter (e.g., "title" for alphabetical sorting).

        EXAMPLES:
        - List pages in space 123456: { spaceId: ["123456"] }
        - List archived pages in space 123456: { spaceId: ["123456"], status: ["archived"] }
        - Find pages with "Project Plan" in title/label in space 123456: { spaceId: ["123456"], query: "Project Plan" }
        - Paginate results: { limit: 10, cursor: "some-cursor-value" }
        - Sort pages by title: { spaceId: ["123456"], sort: "title" }

        ERRORS:
        - Space ID not found: Verify the numeric 'spaceId' is correct.
        - Invalid status: Ensure 'status' is one of the allowed values.
        - Authentication failures: Check Confluence credentials.
        - No pages found: Filters might be too restrictive, or the space is empty/inaccessible.`,
		ListPagesToolArgs.shape,
		listPages,
	);

	// Register the get page details tool
	server.tool(
		'get_page',
		`Retrieve a Confluence page's full content and metadata by its numeric ID.

        PURPOSE: Fetches the complete content (converted to Markdown) and comprehensive metadata for a specific Confluence page, identified by its numeric ID. The page content is properly formatted with headings, tables, lists, and other Markdown elements.

        WHEN TO USE:
        - When you need to read, analyze, or summarize the full content of a specific page.
        - When you need detailed page metadata (author, version, status, etc.).
        - After finding a page ID through 'list_pages' or 'search' and need its complete content.
        - When you need the actual content of a page rather than just its metadata.

        WHEN NOT TO USE:
        - When you only have a space ID or space key (use 'list_pages' first).
        - When you need to find pages based on criteria (use 'list_pages' or 'search').
        - When you want to discover spaces rather than specific pages (use space tools).
        - When you need to search across multiple pages (use 'search').

        RETURNS: Comprehensive page details formatted in Markdown, including:
        - Full title, space information, and creation metadata
        - Complete page content (converted from Atlassian Document Format to Markdown)
        - Version information, permissions status, and URL
        - Metadata including labels, restrictions, and ancestors
        
        The page content is fetched using the Confluence Content REST API, with the body transformed from ADF (Atlassian Document Format) to readable Markdown.

        EXAMPLES:
        - Get page with ID 123456: { pageId: "123456" }

        ERRORS:
        - Page not found (404): Verify the numeric page ID exists and is accessible.
        - Permission denied (403): Check if the page has view restrictions.
        - Authentication failure: Verify API credentials.
        - Content conversion failures: Some complex content elements may not convert perfectly to Markdown.`,
		GetPageToolArgs.shape,
		getPage,
	);

	toolLogger.debug('Successfully registered Atlassian Pages tools');
}

export default { register };
