import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  EditButton,
  ShowButton,
} from "react-admin";
export const FileList = (props) => (
  <List queryOptions={{ key: props.key }}>
    <Datagrid rowClick="edit" bulkActionButtons={false}>
      <TextField source="filename" />
      <TextField source="format" />
      <TextField source="status" />
      <TextField source="created_at" />
      <ShowButton />
    </Datagrid>
  </List>
);
