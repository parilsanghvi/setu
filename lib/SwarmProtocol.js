/**
 * SwarmProtocol - Standardized Workflow Handoffs
 * This module defines the message types and constants for task orchestration.
 */

const Protocol = {
    // Task Lifecycle
    TASK_ASSIGN: 'TASK_ASSIGN',       // Manager -> Worker (Assign work)
    TASK_ACK: 'TASK_ACK',             // Worker -> Manager (Got it, starting)
    TASK_COMPLETE: 'TASK_COMPLETE',   // Worker -> Manager (Done, result attached)
    TASK_FAIL: 'TASK_FAIL',           // Worker -> Manager (Failed, error attached)

    // Status Updates
    STATUS_UPDATE: 'STATUS_UPDATE',   // Worker -> Manager (Progress report)

    // Helper to format a message object
    createMessage: (type, content, meta = {}) => {
        return { type, content, meta };
    }
};

module.exports = Protocol;
