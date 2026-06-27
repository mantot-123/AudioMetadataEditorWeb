import type { CommentTag } from "./CommentTag";
import type { LyricsTag } from "./LyricsTag";
import type { DiscNumberTag } from "./DiscNumbertag";
import type { TrackNumberTag } from "./TrackNumberTag";

export type AudioUserTags = {
    title: string | null;
    album_artist: string | null;
    album: string | null;
    year: string | null;
    track_number: string | number | null;
    disc_number: string | number | null;
    genre: string | null; 
};