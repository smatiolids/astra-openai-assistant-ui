import {
  Admin,
  Resource,
  ListGuesser,
  EditGuesser,
  ShowGuesser,
} from "react-admin";
import { authProvider } from "../providers/authProvider";
import Dashboard from "../modules/dashboard";
import { AssistantList } from "../modules/assistants/AssistantList";
import { AstraResources } from "../providers/AstraResources";
import AstraDataProvider from "../providers/AstraDataProvider";
import { AstraGraphQLDataProvider } from "../providers/AstraGraphQLProvider";
import { FileList } from "../modules/files/FileList";
import { FileShow } from "../modules/files/FileShow";
import { ThreadsList } from "../modules/threads/ThreadsList";
import { ThreadShow } from "../modules/threads/ThreadShow";
import { AssistantShow } from "../modules/assistants/AssistantShow";
import AssistantIcon from "@mui/icons-material/Assistant";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import FolderSharpIcon from "@mui/icons-material/FolderSharp";
import { darkTheme, lightTheme } from "../themes/adminTheme";

const AdminApp = () => (
  <Admin
    title="Astra OpenAI Assistant"
    dashboard={Dashboard}
    dataProvider={AstraDataProvider}
    lightTheme={lightTheme}
    darkTheme={darkTheme}
    // authProvider={authProvider}
  >
    <Resource
      name="assistants"
      list={AssistantList}
      show={AssistantShow}
      icon={AssistantIcon}
      options={{ key: AstraResources.assistants.key, label: "Assistants" }}
    />
    <Resource
      name="files"
      list={FileList}
      edit={FileShow}
      show={FileShow}
      icon={FolderSharpIcon}
      options={{ key: AstraResources.files.key, label: "Files" }}
    />
    <Resource
      name="threads"
      list={ThreadsList}
      show={ThreadShow}
      icon={QuestionAnswerOutlinedIcon}
      options={{ key: AstraResources.threads.key, label: "Threads" }}
    />
  </Admin>
);

export default AdminApp;
