/**
 * Updates the logs array while maintaining a maximum size limit.
 * New items are appended to the end. If the total size exceeds the limit,
 * older items are removed from the beginning.
 *
 * @param {Array} prevLogs - The current array of logs.
 * @param {Array|string} newItems - The new item(s) to add. Can be a single item or an array of items.
 * @param {number} maxLogs - The maximum number of logs to keep.
 * @returns {Array} - The updated array of logs.
 */
export const updateLogs = (prevLogs = [], newItems, maxLogs = 500) => {
    if (maxLogs <= 0) {
        return [];
    }

    const items = Array.isArray(newItems) ? newItems : [newItems];

    if (items.length >= maxLogs) {
        return items.slice(-maxLogs);
    }

    const safePrevLogs = Array.isArray(prevLogs) ? prevLogs : [];
    const availableSpace = maxLogs - items.length;
    // slice(-N) extracts the last N elements
    // If availableSpace > safePrevLogs.length, it returns all elements, which is what we want.
    // Note: slice(-0) returns the whole array, but since we check items.length < maxLogs,
    // availableSpace is always > 0.
    return [...safePrevLogs.slice(-availableSpace), ...items];
};
