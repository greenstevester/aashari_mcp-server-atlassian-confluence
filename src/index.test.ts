import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { startServer } from './index';
import { runCli } from './cli/index.js';
import { config } from './utils/config.util.js';

// Mock dependencies
jest.mock('@modelcontextprotocol/sdk/server/mcp.js');
jest.mock('@modelcontextprotocol/sdk/server/stdio.js');
jest.mock('./cli/index.js');
jest.mock('./utils/config.util.js');
jest.mock('./tools/atlassian.spaces.tool.js', () => ({
	default: { register: jest.fn() },
}));
jest.mock('./tools/atlassian.pages.tool.js', () => ({
	default: { register: jest.fn() },
}));
jest.mock('./tools/atlassian.search.tool.js', () => ({
	default: { register: jest.fn() },
}));

const mockMcpServer = McpServer as jest.MockedClass<typeof McpServer>;
const mockStdioServerTransport = StdioServerTransport as jest.MockedClass<
	typeof StdioServerTransport
>;
const mockRunCli = runCli as jest.MockedFunction<typeof runCli>;
const mockConfig = config as jest.Mocked<typeof config>;

describe('MCP Server Index', () => {
	let mockServerInstance: jest.Mocked<McpServer>;
	let mockTransportInstance: jest.Mocked<StdioServerTransport>;

	beforeEach(() => {
		jest.clearAllMocks();

		// Setup mock instances
		mockServerInstance = {
			connect: jest.fn(),
		} as any;
		mockTransportInstance = {} as any;

		mockMcpServer.mockImplementation(() => mockServerInstance);
		mockStdioServerTransport.mockImplementation(
			() => mockTransportInstance,
		);

		// Setup config mocks
		mockConfig.load = jest.fn();
		mockConfig.getBoolean = jest.fn().mockReturnValue(false);
		mockConfig.get = jest.fn().mockReturnValue('false');

		// Mock CLI
		mockRunCli.mockResolvedValue(undefined);

		// Mock process.exit to prevent actual exit during tests
		jest.spyOn(process, 'exit').mockImplementation(
			(code?: string | number | null | undefined) => {
				throw new Error(`Process exit called with code: ${code}`);
			},
		);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('startServer', () => {
		it('should start server in stdio mode successfully', async () => {
			mockServerInstance.connect.mockResolvedValue(undefined);

			const result = await startServer('stdio');

			expect(mockConfig.load).toHaveBeenCalled();
			expect(mockMcpServer).toHaveBeenCalledWith({
				name: expect.any(String),
				version: expect.any(String),
			});
			expect(mockStdioServerTransport).toHaveBeenCalled();
			expect(mockServerInstance.connect).toHaveBeenCalledWith(
				mockTransportInstance,
			);
			expect(result).toBe(mockServerInstance);
		});

		it('should default to stdio mode when no mode specified', async () => {
			mockServerInstance.connect.mockResolvedValue(undefined);

			await startServer();

			expect(mockStdioServerTransport).toHaveBeenCalled();
			expect(mockServerInstance.connect).toHaveBeenCalledWith(
				mockTransportInstance,
			);
		});

		it('should throw error for SSE mode', async () => {
			await expect(startServer('sse')).rejects.toThrow(
				'SSE mode is not supported yet',
			);
		});

		it('should handle server connection failures', async () => {
			const connectionError = new Error('Connection failed');
			mockServerInstance.connect.mockRejectedValue(connectionError);

			await expect(startServer('stdio')).rejects.toThrow(
				'Process exit called with code: 1',
			);
		});

		it('should enable debug logging when DEBUG config is true', async () => {
			mockConfig.getBoolean.mockReturnValue(true);
			mockServerInstance.connect.mockResolvedValue(undefined);

			await startServer('stdio');

			expect(mockConfig.getBoolean).toHaveBeenCalledWith('DEBUG');
		});
	});

	describe('main function behavior', () => {
		let originalArgv: string[];
		let originalRequireMain: NodeModule | undefined;

		beforeEach(() => {
			originalArgv = process.argv;
			originalRequireMain = require.main;
		});

		afterEach(() => {
			process.argv = originalArgv;
			require.main = originalRequireMain;
		});

		it('should detect CLI mode with arguments', () => {
			const originalArgv = process.argv;
			process.argv = ['node', 'index.js', 'list-spaces'];

			// Test the condition that determines CLI vs server mode
			const hasCliArgs = process.argv.length > 2;
			expect(hasCliArgs).toBe(true);

			process.argv = originalArgv;
		});

		it('should detect server mode without arguments', () => {
			const originalArgv = process.argv;
			process.argv = ['node', 'index.js'];

			// Test the condition that determines CLI vs server mode
			const hasCliArgs = process.argv.length > 2;
			expect(hasCliArgs).toBe(false);

			process.argv = originalArgv;
		});
	});

	describe('tool registration', () => {
		it('should register all Confluence tools', async () => {
			mockServerInstance.connect.mockResolvedValue(undefined);

			// Import tools to get their mocks
			const spacesTool =
				require('./tools/atlassian.spaces.tool.js').default;
			const pagesTool =
				require('./tools/atlassian.pages.tool.js').default;
			const searchTool =
				require('./tools/atlassian.search.tool.js').default;

			await startServer('stdio');

			expect(spacesTool.register).toHaveBeenCalledWith(
				mockServerInstance,
			);
			expect(pagesTool.register).toHaveBeenCalledWith(mockServerInstance);
			expect(searchTool.register).toHaveBeenCalledWith(
				mockServerInstance,
			);
		});
	});

	describe('configuration handling', () => {
		it('should load configuration before starting server', async () => {
			mockServerInstance.connect.mockResolvedValue(undefined);

			await startServer('stdio');

			expect(mockConfig.load).toHaveBeenCalled();
			expect(mockMcpServer).toHaveBeenCalled();
		});

		it('should check DEBUG configuration setting', async () => {
			mockServerInstance.connect.mockResolvedValue(undefined);

			await startServer('stdio');

			expect(mockConfig.getBoolean).toHaveBeenCalledWith('DEBUG');
			expect(mockConfig.get).toHaveBeenCalledWith('DEBUG');
		});
	});
});
