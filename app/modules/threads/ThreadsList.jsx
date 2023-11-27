import * as React from "react";
import { List, Datagrid, TextField, EmailField, ShowButton } from "react-admin";
export const ThreadsList = () => (
  <List>
    <Datagrid rowClick="edit"  bulkActionButtons={false}>
      <TextField source="id" />
      <TextField source="created_at" />
      <ShowButton />
    </Datagrid>
  </List>
);
