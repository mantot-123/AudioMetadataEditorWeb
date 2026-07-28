import { formatFileSizeBytes, formatUnixTime, formatNullableValue } from "../../helpers/formatHelpers";

import { useCurrentFile } from "../../context/CurrentFileContext";

function BaseInfoSection() {
  const { fileInfo } = useCurrentFile();

  const rowsBasic = [
    { group: "File", name: "File name", value: fileInfo?.name },
    { group: "File", name: "Path", value: fileInfo?.full_path },
    { group: "File", name: "MIME type", value: fileInfo?.mime_type },
    { group: "File", name: "File extension", value: fileInfo?.file_ext },
    { group: "File", name: "File size", value: formatFileSizeBytes(fileInfo?.size)},
    { group: "File", name: "Date modified", value: formatUnixTime(fileInfo?.modify_time)}
  ];
  
  return (
    <>
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
    </> 
  );
}

export default BaseInfoSection;