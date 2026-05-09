import { geminiCliRuntime } from './runtime.js';
import { GEMINI_CLI_SYSTEM_PROMPT } from './system-prompt.js';

/**
 * `gemini-cli` — runtime plugin backed by Google's `gemini` CLI in headless
 * mode (`gemini -p <prompt> --output-format stream-json`).
 */
export const plugin = {
  id: 'gemini-cli',
  name: 'Gemini CLI',
  description:
    'Google Gemini CLI agent. Spawns the `gemini` binary in headless stream-json mode to read code, edit files, and run shell commands inside the channel\'s workspace.',
  defaultInstructions: GEMINI_CLI_SYSTEM_PROMPT,
  configSchema: {
    type: 'object',
    properties: {
      model: {
        type: 'string',
        description: 'Gemini model id (e.g. gemini-2.5-pro, gemini-2.5-flash).',
      },
      yolo: {
        type: 'boolean',
        description: 'Auto-approve all tool calls (--yolo). Use cautiously.',
        default: false,
      },
      binary: {
        type: 'string',
        description:
          'Optional path/name of the `gemini` binary. If omitted, the runtime auto-detects `gemini` on PATH and falls back to `npx -y @google/gemini-cli@<npmTag>`.',
      },
      npmTag: {
        type: 'string',
        description: 'npm tag/version of `@google/gemini-cli` to use with the npx fallback.',
        default: 'latest',
      },
    },
  },
  factory: ({ agentDetails, config, storage }: any) => {
    return geminiCliRuntime({
      model: typeof config.model === 'string' ? config.model : undefined,
      yolo: !!config.yolo,
      binary: typeof config.binary === 'string' ? config.binary : undefined,
      npmTag: typeof config.npmTag === 'string' ? config.npmTag : 'latest',
      system: agentDetails.instructions || GEMINI_CLI_SYSTEM_PROMPT,
      storage,
    });
  },
};

export default plugin;
