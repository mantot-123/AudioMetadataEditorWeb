import { useCurrentFile } from "../../context/CurrentFileContext";

const formatFileSize = (bytes: number | null): string | null => {
  if(bytes === null) return null;
  if (bytes === 0) return "0 bytes";

  const units = ["bytes", "KB", "MB", "GB", "TB"];
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** unitIndex;

  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

const formatDuration = (rate: number | null | undefined): string | null => {
  if(rate === null || rate === undefined) return null;

  const minutes: number = Math.trunc(rate / 60);
  const seconds: number = Math.trunc(rate % 60);

  const paddedMins: string = String(minutes).padStart(2, "0");
  const paddedSecs: string = String(seconds).padStart(2, "0");
  return `${paddedMins}:${paddedSecs}`;
};

const formatBitRate = (rate: number | null | undefined): string | null => {
  if(rate === null || rate === undefined) return null;
  return `${rate / 1000} kbps`;
};

const formatSampleRate = (rate: number | null | undefined): string | null => {
  if(rate === null || rate === undefined) return null;

  const value: number = rate > 1000 ? rate / 1000 : rate;
  const unit: string = rate > 1000 ? "kHz" : "Hz";

  return `${value} ${unit}`;
}

const formatModifiedTime = (timestamp: number | null | undefined): string | null => {
  if(timestamp === null || timestamp === undefined) return null;

  return new Date(timestamp * 1000).toLocaleString();
};

const formatNullableValue = (value: any): string => {
  if (value === null || value === "" || value === undefined) return "-";
  return String(value);
};

function MetadataViewTable() {
  const { fileInfo } = useCurrentFile();

  const rowsBasic = [
    { group: "File", name: "File name", value: fileInfo?.name },
    { group: "File", name: "Path", value: fileInfo?.full_path },
    { group: "File", name: "MIME type", value: fileInfo?.mime_type },
    { group: "File", name: "File extension", value: fileInfo?.file_ext },
    { group: "File", name: "File size", value: fileInfo ? formatFileSize(fileInfo?.size) : null },
    { group: "File", name: "Date modified", value: formatModifiedTime(fileInfo?.modify_time)}
  ];

  const rowsStream = [
    { group: "Stream", name: "Format", value: fileInfo?.format },
    { group: "Stream", name: "Duration", value: fileInfo?.duration ? `${formatDuration(fileInfo?.duration)}` : null },
    { group: "Stream", name: "Bitrate", value: formatBitRate(fileInfo?.bitrate as number | null) },
    { group: "Stream", name: "Channels", value: fileInfo?.channels },
    { group: "Stream", name: "Sample rate", value: formatSampleRate(fileInfo?.sample_rate) }
  ];

  const rowsUserTags = [
    { group: "Tags", name: "Title", value: fileInfo?.tags.title },
    { group: "Tags", name: "Album artist", value: fileInfo?.tags.album_artist },
    { group: "Tags", name: "Album", value: fileInfo?.tags.album },
    { group: "Tags", name: "Year", value: fileInfo?.tags.year },
    { group: "Tags", name: "Genre", value: fileInfo?.tags.genre },
    { group: "Tags", name: "Track number", value: fileInfo?.tags.track_number },
    { group: "Tags", name: "Disc number", value: fileInfo?.tags.disc_number },
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