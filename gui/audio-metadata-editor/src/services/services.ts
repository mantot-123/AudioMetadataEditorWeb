import axios from "axios";

import type { AudioUserTags } from "../types/AudioUserTags";

export async function getDir() {
    const response = await axios.get("/get-dir");
    return response;
}

export async function getAllFiles() {
    const response = await axios.get("/all-files");
    return response;
}

export async function getFile(path: string) {
    const response = await axios.get("/get-file", {
        params: { 
            filename: path 
        }
    });
    return response;
}

export async function renameFile(path: string, newName: string) {
    const response = await axios.post("/rename-file", {
        filename: path,
        new_name: newName
    });
    return response;
}

export async function deleteFile(path: string) {
    const response = await axios.post("/delete-file", {
        filename: path,
    });
    return response;
}

export async function searchMetadata(tags: AudioUserTags) {
    const response = await axios.get("/browse-metadata", {
        params: {
            title: tags.title,
            album_artist: tags.album_artist,
            album: tags.album,
            year: tags.year,
            genre: tags.genre,
            track_number: tags.track_number,
            disc_number: tags.disc_number
        }
    });
    return response;
}

export async function searchArtByMBID(id: string) {
    const response = await axios.get("/browse-art", {
        params: { 
            album_id: id 
        }
    });
    return response;
}

export async function getFileAlbumArt(path: string) {
    const response = await axios.get("/get-album-art", {
        params: {
            filename: path
        }
    });
    return response;
}