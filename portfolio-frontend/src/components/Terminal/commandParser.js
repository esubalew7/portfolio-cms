/**
 * Command Parser Utility
 * Handles parsing commands, arguments, and alias resolution
 */

class CommandParser {
  constructor(commandRegistry) {
    this.registry = commandRegistry;
    this.aliases = commandRegistry.aliases || {};
  }

  /**
   * Parse a command string and return command details
   * @param {string} input - Raw user input
   * @returns {object} Parsed command object with name, args, and metadata
   */
  parse(input) {
    const trimmed = input.toLowerCase().trim();

    if (!trimmed) {
      return {
        valid: false,
        command: null,
        args: [],
        error: "Empty command",
      };
    }

    const parts = trimmed.split(/\s+/);
    let commandName = parts[0];
    const args = parts.slice(1);

    // Resolve aliases
    if (this.aliases[commandName]) {
      commandName = this.aliases[commandName];
    }

    // Check if command exists
    const command = this.registry.commands[commandName];

    if (!command) {
      return {
        valid: false,
        command: null,
        args,
        error: `Command not found: '${parts[0]}'. Type 'help' for available commands.`,
      };
    }

    return {
      valid: true,
      command: commandName,
      originalInput: input,
      args,
      description: command.description,
      metadata: command.metadata || {},
    };
  }

  /**
   * Execute a parsed command
   * @param {object} parsed - Parsed command object from parse()
   * @returns {object} Execution result
   */
  execute(parsed) {
    if (!parsed.valid) {
      return {
        success: false,
        output: parsed.error,
        type: "error",
      };
    }

    const command = this.registry.commands[parsed.command];

    try {
      // Handle dynamic responses (functions)
      let response = command.response;
      if (typeof response === "function") {
        response = response(parsed.args, parsed.originalInput);
      }

      // Handle special commands
      if (parsed.command === "clear") {
        return {
          success: true,
          output: null,
          type: "clear",
          command: parsed.command,
        };
      }

      // Handle link-opening commands
      if (command.metadata?.type === "link") {
        return {
          success: true,
          output: response,
          type: "link",
          url: command.metadata.url,
          command: parsed.command,
        };
      }

      // Handle file download commands
      if (command.metadata?.type === "download") {
        return {
          success: true,
          output: response,
          type: "download",
          fileUrl: command.metadata.fileUrl,
          fileName: command.metadata.fileName,
          command: parsed.command,
        };
      }

      return {
        success: true,
        output: response,
        type: "response",
        command: parsed.command,
        processTime: command.metadata?.processTime || 0,
      };
    } catch (error) {
      return {
        success: false,
        output: `Error executing command: ${error.message}`,
        type: "error",
      };
    }
  }

  /**
   * Get list of all available commands
   * @returns {array} Array of command objects with metadata
   */
  getAvailableCommands() {
    return Object.entries(this.registry.commands).map(([name, cmd]) => ({
      name,
      description: cmd.description,
      aliases: Object.entries(this.aliases)
        .filter(([alias, target]) => target === name)
        .map(([alias]) => alias),
      category: cmd.metadata?.category || "General",
    }));
  }

  /**
   * Check if a command exists
   * @param {string} commandName - Command to check
   * @returns {boolean}
   */
  commandExists(commandName) {
    const resolved =
      this.aliases[commandName.toLowerCase()] || commandName.toLowerCase();
    return !!this.registry.commands[resolved];
  }

  /**
   * Get command by name (with alias resolution)
   * @param {string} commandName
   * @returns {object|null}
   */
  getCommand(commandName) {
    const resolved =
      this.aliases[commandName.toLowerCase()] || commandName.toLowerCase();
    return this.registry.commands[resolved] || null;
  }
}

export default CommandParser;
