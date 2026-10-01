import { formatDuration, formatBitRate, formatSampleRate, formatNullableValue } from "../../helpers/formatHelpers";

import { useCurrentFile } from "../../context/CurrentFileContext";

function StreamInfoSection() {
  const { fileInfo } = useCurrentFile();

  const rowsStream = [
    { group: "Stream", name: "Format", value: fileInfo?.format },
    { group: "Stream", name: "Duration", value: fileInfo?.duration ? `${formatDuration(fileInfo?.duration)}` : null },
    { group: "Stream", name: "Bitrate", value: formatBitRate(fileInfo?.bitrate as number | null) },
    { group: "Stream", name: "Channels", value: fileInfo?.channels },
    { group: "Stream", name: "Sample rate", value: formatSampleRate(fileInfo?.sample_rate) }
  ];

  return (
    <>
      <div className="custom-table-container border rounded-3">
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
    </>
  );
}

export default StreamInfoSection;