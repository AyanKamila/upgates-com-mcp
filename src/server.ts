/**
 * MCP Server class - manages server lifecycle and request handling
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { UpgatesConfig } from './types.js';
import { UpgatesClient } from './upgates-client.js';
import { UpgatesError, formatError } from './errors/index.js';
import { TOOLS } from './tools/definitions.js';
import { handleToolRequest } from './handlers/tools.js';
import { listResources, handleResourceRead } from './handlers/resources.js';

/**
 * MCP Server class
 */
export class MCPServer {
  private server: Server;
  private client: UpgatesClient;
  private config: UpgatesConfig;

  constructor(config: UpgatesConfig) {
    this.config = config;
    this.client = new UpgatesClient(config);

    // Create MCP server instance
    this.server = new Server(
      {
        name: 'upgates-com-mcp',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    this.setupHandlers();
  }

  /**
   * Setup request handlers
   */
  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: TOOLS,
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        console.error(`[MCP] Tool called: ${name}`);
        console.error(`[MCP] Arguments:`, JSON.stringify(args, null, 2));

        const result = await handleToolRequest(name, this.client, args || {});

        console.error(`[MCP] Tool ${name} completed successfully`);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        console.error(`[MCP] Tool ${name} failed:`, error);

        const errorMessage =
          error instanceof UpgatesError
            ? formatError(error)
            : `Error: ${String(error)}`;

        return {
          content: [
            {
              type: 'text',
              text: errorMessage,
            },
          ],
          isError: true,
        };
      }
    });

    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: listResources(),
      };
    });

    // Handle resource reading
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;

      try {
        console.error(`[MCP] Resource read: ${uri}`);

        const content = await handleResourceRead(uri, this.client);

        console.error(`[MCP] Resource ${uri} read successfully`);

        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: content,
            },
          ],
        };
      } catch (error) {
        console.error(`[MCP] Resource read failed for ${uri}:`, error);

        const errorMessage =
          error instanceof UpgatesError
            ? formatError(error)
            : `Error: ${String(error)}`;

        throw new Error(errorMessage);
      }
    });
  }

  /**
   * Start the server
   */
  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    console.error('[MCP] Upgates MCP Server started');
    console.error(`[MCP] API URL: ${this.config.apiUrl}`);
    console.error(`[MCP] Readonly mode: ${this.config.readonlyMode ? 'enabled' : 'disabled'}`);
    console.error(`[MCP] Anonymization: ${this.config.anonymizeData ? 'enabled' : 'disabled'}`);
  }

  /**
   * Stop the server
   */
  async stop(): Promise<void> {
    await this.server.close();
    console.error('[MCP] Server stopped');
  }

  /**
   * Get server instance (for testing)
   */
  getServer(): Server {
    return this.server;
  }

  /**
   * Get client instance (for testing)
   */
  getClient(): UpgatesClient {
    return this.client;
  }
}
