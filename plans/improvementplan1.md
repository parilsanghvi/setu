Setu: Strategic Improvement Plan
Date: February 16, 2026 Based on: Deep dive of Setu v1.0.0 and comparison with pi.dev architecture.

Executive Summary
Setu is a robust, multi-process swarm system designed for persistence ("Ancient Swarm Intelligence"). While its multi-process architecture is excellent for stability and isolation, its internal agent runtime (
CoreAgent.js
) is primitive compared to modern standards like pi.dev.

To evolve Setu into a state-of-the-art system, we should adopt specific "internal organs" from pi.dev while keeping Setu's "external body" (the Swarm orchestration).

1. Context Management: The "Elephant in the Room"
Current State: Setu uses an in-memory array (this.context) that grows indefinitely. Problem: Long-running agents will eventually crash or hallucinate as context limits are breached. Recommendation: Implement Context Compaction.

Action: Port the compaction logic from pi.dev to Setu.
Mechanism: When context exceeds a threshold (e.g., 80% of window), trigger a "Sleep Cycle" where the agent summarizes the oldest 50% of messages into a single system or summary message, preserving key decisions and file operations.
Benefit: Agents can run indefinitely (weeks/months) without losing their "core identity" or recent context.
2. Session History: From Flat to Tree
Current State: Setu appends logs to 
JOURNAL.md
 and keeps a flat chat array. Problem: Debugging is hard. If an agent goes down a wrong path, you can't "rewind" and try again without restarting. Recommendation: Adopt Tree-Structured History.

Action: Store agent sessions as JSONL files with 
id
 and parentId fields.
Benefit: This enables "Time Travel" debugging. You can view the exact state of an agent at Turn #45, fork it, and manually steer it in a new direction.
3. Tooling: From Methods to Schema
Current State: Tools are ad-hoc methods (
executeTool
 switch/case). Problem: Fragile. Relies heavily on the LLM "guessing" the right arguments. Recommendation: Adopt Schema-Based Tooling.

Action: Define tools using JSON Schema (compatible with OpenAI/Anthropic function calling).
Validation: Use libraries like zod or ajv to strictly validate tool arguments before execution.
Benefit: dramatically reduces "Cognitive Errors" and hallucinated arguments.
4. Runtime: Event-Driven Observable Loop
Current State: 
CoreAgent
 runs a while loop and logs to console. Problem: The UI (Dashboard) has to poll logs or DB to know what's happening. "Thinking" content is often lost or delayed. Recommendation: implementing an Event Stream.

Action: Refactor 
CoreAgent
 to emit events:
thought_start / thought_end
tool_start / tool_end
context_compacted
Benefit: The Dashboard can show a real-time "Brain Scan" of the agent, creating a much more engaging and transparent user experience.
5. Extensibility: "Skills as Code"
Current State: Skills are static Markdown files. Problem: Skills can instruct the agent what to do, but can't give it new capabilities. Recommendation: Upgrade to Executable Skills.

Action: Allow skills to define a tools.js or 
index.js
 sidecar that registers new actual code functions with the agent.
Benefit: A "Git" skill naturally adds git_commit and git_push tools, rather than just telling the agent to "run git commands via bash".
Implementation Roadmap
Phase 1 (The Brain): Update 
CoreAgent.js
 to support Event Emitting and Schema-based Tooling.
Phase 2 (Memory): Implement JSONL Session persistence and Context Compaction.
Phase 3 (The Body): Update 
Sutradhar
 and the Dashboard to visualize the new event streams and tree history.

Comment
Ctrl+Alt+M
