import * as React from "react";
import { Card, CardContent, CardHeader } from "@mui/material";
import { SimpleShowLayout, TextField, FunctionField } from "react-admin";
const Dashboard = () => {
  const astra = JSON.parse(localStorage.getItem("user"));
  return (
    <Card>
      <CardHeader title="Astra OpenAI Assistant" />
      <CardContent>
        <SimpleShowLayout record={astra}>
          <TextField label="Astra DB ID" source="astra_db_id" />
          <TextField label="Astra DB Region" source="astra_region" />
          <TextField label="Astra DB Keyspace" source="astra_keyspace" />
          <FunctionField label="Astra DB Token" render={record => `${record.astra_token.substr(0, 10)}...${record.astra_token.substr(record.astra_token.length-5)}`} />
        </SimpleShowLayout>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
