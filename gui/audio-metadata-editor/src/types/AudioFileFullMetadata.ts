import type { AudioUserTags } from "./AudioUserTags";

export type AudioFileFullMetadata = {
    filepath: string;
    format: string;
    duration: number;
    bitrate: number | null;
    channels: number | null;
    sample_rate: number | null;
    tags: AudioUserTags;
};