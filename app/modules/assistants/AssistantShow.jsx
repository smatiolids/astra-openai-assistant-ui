import {
  Show,
  TextField,
  ReferenceArrayField,
  SimpleShowLayout,
  Loading,
  ArrayField,
  SingleFieldList,
  ChipField,
} from "react-admin";
import { useGetMany, useRecordContext } from "react-admin";

export const AssistantShow = (props) => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" label="Id" />
      <TextField source="name" label="Name" />
      <TextField source="instructions" label="Instructions" />
      <TextField source="description" label="Description" />
      <TextField source="model" label="Model" />
      <TextField source="file_ids" label="file_ids" />
      <SingleFieldList>
        <ChipField source="file_ids" />
      </SingleFieldList>
      {/* <ReferenceArrayField label="Files" reference="files" source="file_ids" /> */}
    </SimpleShowLayout>
  </Show>
);
