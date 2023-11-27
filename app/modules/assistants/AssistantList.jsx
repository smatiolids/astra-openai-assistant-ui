import * as React from "react";
import { List, Datagrid, TextField, ShowButton  } from 'react-admin';
export const AssistantList = () => (
    <List>
        <Datagrid rowClick="edit"  bulkActionButtons={false}>
            <TextField source="name" />
            <TextField source="instructions" />
            <TextField source="model" />
            <TextField source="created_at" />
            <ShowButton />
        </Datagrid>
    </List>
);