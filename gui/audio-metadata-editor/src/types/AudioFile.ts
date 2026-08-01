import type { AudioUserTags } from "./AudioUserTags";

export type AudioFile = {
  id: number | null;
  name: string | null;
  full_path: string | null;
  size: number | null;
  file_ext: string | null;
  mime_type: string | null;
  modify_time: number | null;
  tag_sys: string | null;
  format: string | null;
  duration: number |  null;
  bitrate: number | null;
  channels: number | null;
  sample_rate: number | null;
  tags: AudioUserTags;
};

export const isAudioFile = (value: unknown): value is AudioFile => {
  if (!value || typeof value !== "object") return false;

  const file = value as AudioFile;
  return (
    (typeof file.id === "number" || file.id === null) &&
    (typeof file.name === "string" || file.name === null) &&
    (typeof file.full_path === "string" || file.full_path === null) &&
    (typeof file.size === "number" || file.size === null) &&
    (typeof file.file_ext === "string" || file.file_ext === null) &&
    (typeof file.mime_type === "string" || file.mime_type === null) &&
    (typeof file.modify_time === "number" || file.modify_time === null) &&
    (typeof file.tag_sys === "string" || file.tag_sys === null) &&
    (typeof file.format === "string" || file.format === null) &&
    (typeof file.duration === "number" || file.duration === null) &&
    (typeof file.bitrate === "number" || file.bitrate === null) &&
    (typeof file.channels === "number" || file.channels === null) &&
    (typeof file.sample_rate === "number" || file.sample_rate === null) &&
    (typeof file.tags === "object" || file.tags === null)
  );
};
