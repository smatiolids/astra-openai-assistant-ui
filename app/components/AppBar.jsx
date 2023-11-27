import { ToggleThemeButton, AppBar } from "react-admin";
import { Typography } from "@mui/material";


const AppBarCustom = (props) => (
  <AppBar {...props}>
    <Typography flex="1" variant="h6" id="react-admin-title">
      Astra OpenAI Assistant
    </Typography>
    <ToggleThemeButton/>
  </AppBar>
);

export default AppBarCustom;
