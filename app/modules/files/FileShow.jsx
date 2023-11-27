import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  RichTextField,
  TabbedShowLayout,
  Loading,
  useGetOne,
  useGetList,
  List,
  Datagrid,
} from "react-admin";
import { useGetMany, useRecordContext } from "react-admin";

export const FileShow = (props) => (
  <Show>
    <TabbedShowLayout>
      <TabbedShowLayout.Tab label="File">
        <TextField source="filename" />
        <TextField source="format" />
        <DateField label="Publication date" source="created_at"  showTime={true}/>
      </TabbedShowLayout.Tab>
      <TabbedShowLayout.Tab label="Chunks">
        <FileChunks />
      </TabbedShowLayout.Tab>
    </TabbedShowLayout>
  </Show>
);

const FileChunks = () => {
  const record = useRecordContext();
  // console.log("record", record);
  const { data, isLoading, error } = useGetList("file_chunks", {
    filter: { id: record.filename },
    meta: { raw: true },
  });
  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <p>ERROR</p>;
  }
  return (
    <List>
      <Datagrid data={data} bulkActionButtons={false}>
        <TextField source="chunk_id" />
        <TextField source="content" />
      </Datagrid>
    </List>

    // <ul>
    //   {data.map((chunk) => (
    //     <li key={chunk.chunk_id}>{chunk.content}</li>
    //   ))}
    // </ul>
  );
};
