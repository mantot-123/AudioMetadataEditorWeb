import { useCurrentFile } from "../../context/CurrentFileContext";
import { useMetadata } from "../../context/MetadataContext";

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 bytes";

  const units = ["bytes", "KB", "MB", "GB", "TB"];
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** unitIndex;

  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

const formatDuration = (rate: number): string => {
  const minutes: number = Math.trunc(rate / 60);
  const seconds: number = Math.trunc(rate % 60);

  const paddedMins: string = String(minutes).padStart(2, "0");
  const paddedSecs: string = String(seconds).padStart(2, "0");
  return `${paddedMins}:${paddedSecs}`;
};

const formatBitRate = (rate: number | null): string => {
  if(!rate) return "-";
  return `${rate / 1000} kbps`;
};

const formatSampleRate = (rate: number | null) => {
  if(!rate) return "-";

  const value: number = rate > 1000 ? rate / 1000 : rate;
  const unit: string = rate > 1000 ? "kHz" : "Hz";

  return `${value} ${unit}`;
}

const formatModifiedTime = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleString();
};

const formatNullableValue = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
};

function MetadataViewTable() {
  const { fileInfo } = useCurrentFile();
  const { metadata } = useMetadata();
  const tags = metadata.tags;

  const rowsBasic = [
    { group: "File", name: "File name", value: fileInfo?.name },
    { group: "File", name: "Path", value: fileInfo?.full_path },
    { group: "File", name: "MIME type", value: fileInfo?.mime_type },
    { group: "File", name: "File extension", value: fileInfo?.file_ext },
    { group: "File", name: "File size", value: fileInfo ? formatFileSize(fileInfo.size) : null },
    { group: "File", name: "Date modified", value: fileInfo ? formatModifiedTime(fileInfo.modify_time) : null }
    ]

  const rowsStream = [
    { group: "Stream", name: "File path", value: metadata.filepath },
    { group: "Stream", name: "Format", value: metadata.format },
    { group: "Stream", name: "Duration", value: metadata.duration ? `${formatDuration(metadata.duration)}` : null },
    { group: "Stream", name: "Bitrate", value: formatBitRate(metadata.bitrate) },
    { group: "Stream", name: "Channels", value: metadata.channels },
    { group: "Stream", name: "Sample rate", value: formatSampleRate(metadata.sample_rate) }
  ];

  const rowsUserTags = [
    { group: "Tags", name: "Title", value: tags.title },
    { group: "Tags", name: "Album artist", value: tags.album_artist },
    { group: "Tags", name: "Album", value: tags.album },
    { group: "Tags", name: "Year", value: tags.year },
    { group: "Tags", name: "Genre", value: tags.genre },
    { group: "Tags", name: "Track number", value: tags.track_number?.track_number },
    { group: "Tags", name: "Total tracks", value: tags.track_number?.total_tracks },
    { group: "Tags", name: "Disc number", value: tags.disc_number?.disc_number },
    { group: "Tags", name: "Total discs", value: tags.disc_number?.total_discs },
  ];

	return (
		<>
			<div className="my-5">
				<h5>Base file info</h5>
				<table className="table table-hover align-middle">
					<tbody>
							{rowsBasic.map((row) => (
								<tr key={`${row.group}-${row.name}`}>
									<th>{row.name}</th>
									<td>{formatNullableValue(row.value)}</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>

      <div className="my-5">
        <h5>Stream info</h5>
        <table className="table table-hover align-middle">
          <tbody>
            {rowsStream.map((row) => (
              <tr key={`${row.group}-${row.name}`}>
                <th>{row.name}</th>
                <td>{formatNullableValue(row.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
			
      <div className="my-5">
        <h5>Track info</h5>
        <table className="table table-hover align-middle">
          <tbody>
            {rowsUserTags.map((row) => (
                <tr key={`${row.group}-${row.name}`}>
                  <th>{row.name}</th>
                  <td>{formatNullableValue(row.value)}</td>
                </tr>
            ))}
          </tbody>
        </table> 
      </div>
		</>
	);
}

export default MetadataViewTable;