/**
 * @dev Assumption: Only SafeApp is able to connect in iframe.
 * Check Content-Security-Policy files.
 */
export const isSafeApp = window?.parent !== window;
