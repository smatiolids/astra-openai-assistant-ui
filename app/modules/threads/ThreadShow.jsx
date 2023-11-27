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
  ReferenceManyField,
  ReferenceField,
} from "react-admin";
import { useGetMany, useRecordContext } from "react-admin";

export const ThreadShow = (props) => (
  <Show>
    <TabbedShowLayout syncWithLocation={false}>
      <TabbedShowLayout.Tab label="Thread">
        <TextField source="id" />
        <DateField source="created_at" showTime={true} />
      </TabbedShowLayout.Tab>
      <TabbedShowLayout.Tab label="Messages" path="messages" syncWithLocation={false}>
        <ReferenceManyField
          label="Messages"
          reference="messages"
          target="thread_id"
        >
          <Datagrid bulkActionButtons={false}>
            <TextField source="role" />
            <TextField source="content" />
            <DateField source="created_at" showTime={true} />
            <ReferenceField source="file_ids" reference="files">
              <TextField source="filename" />
            </ReferenceField>
          </Datagrid>
        </ReferenceManyField>
      </TabbedShowLayout.Tab>
      <TabbedShowLayout.Tab label="Runs" path="runs"  syncWithLocation={false}>
        <ReferenceManyField label="Runs" reference="runs" target="thread_id">
          <Datagrid bulkActionButtons={false}>
            <TextField source="model" />
            <DateField source="created_at" showTime={true} />
            <DateField source="completed_at" showTime={true} />
            <ReferenceField source="assistant_id" reference="assistants">
              <TextField source="name" />
            </ReferenceField>
          </Datagrid>
        </ReferenceManyField>
      </TabbedShowLayout.Tab>
    </TabbedShowLayout>
  </Show>
);
