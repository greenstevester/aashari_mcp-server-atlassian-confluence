import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Logger } from '../utils/logger.util.js';
import { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js';
import {
	ServerRequest,
	ServerNotification,
} from '@modelcontextprotocol/sdk/types.js';
import { formatErrorForMcpTool } from '../utils/error.util.js';
import {
	ListSpacesToolArgsType,
	GetSpaceToolArgsType,
	ListSpacesToolArgs,
	GetSpaceToolArgs,
} from './atlassian.spaces.types.js';

import atlassianSpacesController from '../controllers/atlassian.spaces.controller.js';

/**
 * MCP Tool: List Confluence Spaces
 *
 * Lists Confluence spaces with optional filtering by type and name.
 * Returns a formatted markdown response with space details and pagination info.
 *
 * @param {ListSpacesToolArgsType} args - Tool arguments for filtering spaces
 * @param {RequestHandlerExtra} _extra - Extra request handler information (unused)
 * @returns {Promise<{ content: Array<{ type: 'text', text: string }> }>} MCP response with formatted spaces list
 * @throws Will return error message if space listing fails
 */
async function listSpaces(
	args: ListSpacesToolArgsType,
	_extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
) {
	const toolLogger = Logger.forContext(
		'tools/atlassian.spaces.tool.ts',
		'listSpaces',
	);
	toolLogger.debug('Listing Confluence spaces with filters:', args);

	try {
		// Pass the filter options to the controller
		const message = await atlassianSpacesController.list({
			type: args.type === 'archived' ? 'global' : args.type,
			query: args.query,
			status: args.status,
			limit: args.limit,
			cursor: args.cursor,
		});

		toolLogger.debug(
			'Successfully retrieved spaces from controller',
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
		toolLogger.error('Failed to list spaces', error);
		return formatErrorForMcpTool(error);
	}
}

/**
 * MCP Tool: Get Confluence Space Details
 *
 * Retrieves detailed information about a specific Confluence space.
 * Returns a formatted markdown response with space metadata.
 *
 * @param {GetSpaceToolArgsType} args - Tool arguments containing the space key or ID
 * @param {RequestHandlerExtra} _extra - Extra request handler information (unused)
 * @returns {Promise<{ content: Array<{ type: 'text', text: string }> }>} MCP response with formatted space details
 * @throws Will return error message if space retrieval fails
 */
async function getSpace(
	args: GetSpaceToolArgsType,
	_extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
) {
	const methodLogger = Logger.forContext(
		'tools/atlassian.spaces.tool.ts',
		'getSpace',
	);
	methodLogger.debug('Tool called with args:', args);

	try {
		// Call the controller to get space details
		const result = await atlassianSpacesController.get({
			spaceKey: args.spaceKey,
		});

		methodLogger.debug('Successfully retrieved space details');

		// Convert the string content to an MCP text resource
		return {
			content: [
				{
					type: 'text' as const,
					text: result.content,
				},
			],
		};
	} catch (error) {
		methodLogger.error('Error retrieving space details:', error);
		// Format the error for MCP tools
		return formatErrorForMcpTool(error);
	}
}

/**
 * Register Atlassian Spaces MCP Tools
 *
 * Registers the list-spaces and get-space tools with the MCP server.
 * Each tool is registered with its schema, description, and handler function.
 *
 * @param {McpServer} server - The MCP server instance to register tools with
 */
function register(server: McpServer) {
	const toolLogger = Logger.forContext(
		'tools/atlassian.spaces.tool.ts',
		'register',
	);
	toolLogger.debug('Registering Atlassian Spaces tools...');

	// Register the list spaces tool
	server.tool(
		'list_spaces',
		`List available Confluence spaces with filtering options and pagination support.

        PURPOSE: Discovers accessible Confluence spaces, providing metadata about each space including ID, key, name, description, and status. This tool is essential for finding spaces before working with their content.

        WHEN TO USE:
        - When you need to discover what spaces exist in the Confluence instance.
        - When you need to find a space's ID or key to use with other tools.
        - When you need to filter spaces by type ('global', 'personal', 'archived').
        - When you need to locate a space by partial name matching.
        - When you need to browse available content sources.
        - As a first step before using 'list_pages' or content search tools.

        WHEN NOT TO USE:
        - When you already know the specific space ID/key (use 'get_space' instead).
        - When you need to search for page content (use 'search' instead).
        - When you need to list pages within a known space (use 'list_pages' instead).
        - When you need detailed information about a specific space (use 'get_space' instead).

        RETURNS: Formatted list of spaces including:
        - Numeric ID (used for most API operations)
        - Space key (short identifier, e.g., 'DEV', 'HR', etc.)
        - Display name and description
        - Type (global, personal) and status (current, archived)
        - Creation information and URL
        
        Results can be paginated using the 'limit' and 'cursor' parameters.
        
        SORTING: By default, spaces are sorted by name in descending order.

        EXAMPLES:
        - List all spaces: {}
        - Filter by type: { type: ["global"] }
        - Filter by status: { status: ["current"] }
        - Search by name: { query: "Engineering" }
        - With pagination: { limit: 20, cursor: "some-cursor-value" }

        ERRORS:
        - Authentication failures: Check Confluence credentials.
        - Permission issues: Ensure you have access to view spaces.
        - Invalid filter values: Verify type/status values match allowed options.
        - No spaces found: May indicate permission issues or overly restrictive filters.`,
		ListSpacesToolArgs.shape,
		listSpaces,
	);

	// Register the get space details tool
	server.tool(
		'get_space',
		`Retrieve comprehensive details about a specific Confluence space by ID.

        PURPOSE: Fetches complete metadata and configuration information for a space, identified by its numeric ID. Provides all available details about a space, including permissions, themes, and homepage.

        WHEN TO USE:
        - When you need detailed information about a specific space's configuration.
        - When you need the numeric ID of a space's homepage to use with 'get_page'.
        - When you need to verify permissions, status, or theme settings.
        - When you need to analyze space metadata before working with its content.
        - After finding a space through 'list_spaces' and needing more details.
        - When you need to determine if a space is active, archived, or has specific restrictions.

        WHEN NOT TO USE:
        - When you need to discover spaces (use 'list_spaces' instead).
        - When you need to list pages in a space (use 'list_pages' instead).
        - When you need to search for content (use 'search' instead).
        - When you only have a space key and need the ID (use 'list_spaces' first).

        RETURNS: Comprehensive space details formatted in Markdown, including:
        - Full name, key, and ID information
        - Description and homepage details
        - Type, status, and theme configuration
        - Permissions and restrictions
        - Creation and modification metadata
        - URLs for accessing the space directly
        
        All available metadata is fetched by default to provide complete information.

        EXAMPLES:
        - Get space with ID 123456: { spaceId: "123456" }

        ERRORS:
        - Space not found (404): Verify the numeric space ID exists and is accessible.
        - Permission denied (403): Check if you have access to the space.
        - Authentication failure: Verify Confluence credentials.
        - Invalid ID format: Ensure the spaceId is a valid numeric identifier.`,
		GetSpaceToolArgs.shape,
		getSpace,
	);

	toolLogger.debug('Successfully registered Atlassian Spaces tools');
}

export default { register };
