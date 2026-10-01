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


export function formatDuration(rate: number | null | undefined): string | null {
    if (rate === null || rate === undefined) return null;

    const minutes: number = Math.trunc(rate / 60);
    const seconds: number = Math.trunc(rate % 60);

    const paddedMins: string = String(minutes).padStart(2, "0");
    const paddedSecs: string = String(seconds).padStart(2, "0");
    return `${paddedMins}:${paddedSecs}`;
};


export function formatBitRate(rate: number | null | undefined): string | null {
    if (rate === null || rate === undefined) return null;
    return `${rate / 1000} kbps`;
};


export function formatSampleRate(rate: number | null | undefined): string | null {
    if (rate === null || rate === undefined) return null;

    const value: number = rate > 1000 ? rate / 1000 : rate;
    const unit: string = rate > 1000 ? "kHz" : "Hz";

    return `${value} ${unit}`;
}


export function formatNullableValue(value: any): string {
    if (value === null || value === "" || value === undefined) return "-";
    return String(value);
};