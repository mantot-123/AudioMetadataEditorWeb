import { formatNullableValue } from "../../helpers/formatHelpers";

import { useCurrentFile } from "../../context/CurrentFileContext";

function TrackInfoSection() {
  const { fileInfo } = useCurrentFile();

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
      <div className="custom-table-container border rounded-3">
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

export default TrackInfoSection;