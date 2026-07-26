// helper methods for formatting data values

export function formatFileSizeBytes(bytes: number | null | undefined): string {
    if (!bytes || bytes === 0) return "0 B";

    const units = ["B", "KB", "MB", "GB", "TB"];
    const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / 1024 ** unitIndex;

    return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

export function formatUnixTime(timestamp: number | null | undefined): string {
    if (!timestamp) return "-";
    return new Date(timestamp * 1000).toLocaleString();
};
