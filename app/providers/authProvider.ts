import { AuthProvider, HttpError } from "react-admin";

export const authProvider: AuthProvider = {
  login: ({ username, password }) => {
    // https://cfd38e61-9f24-4a16-b91f-e2b394875c05-us-east1.apps.astra.datastax.com
    // AstraCS:rdsFASznDMPCHdxnDyKnxWjv:4ea05cde442c7ab12712949c4ec68a3045cc4cfef770f2f108cfa07f3bdf9295
    // Validates the token with Stargate
    const astra_db_id = username.substr(8, 36);
    const astra_region = username.substring(8 + 36 + 1, username.indexOf("."));
    const astra_keyspace = "assistant_api";
    const auth_data = {
      astra_db_id,
      astra_region,
      astra_keyspace,
      astra_token: password,
    };

    const request = new Request("/api/login", {
      method: "POST",
      body: JSON.stringify(auth_data),
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    return fetch(request)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((auth) => {
        localStorage.setItem("user", JSON.stringify(auth_data));
        return Promise.resolve();
      })
      .catch(() => {
        throw new Error("Invalid API Endpoint/Token");
      });

    // const user = data.users.find(
    //   (u) => u.username === username && u.password === password
    // );

    // if (user) {
    //   // eslint-disable-next-line no-unused-vars
    //   let { password, ...userToPersist } = user;
    //   localStorage.setItem("user", JSON.stringify(userToPersist));
    //   return Promise.resolve();
    // }

    return Promise.resolve();

    return Promise.reject(
      new HttpError("Unauthorized", 401, {
        message: "Invalid username or password",
      })
    );
  },
  logout: () => {
    localStorage.removeItem("user");
    return Promise.resolve();
  },
  checkError: () => Promise.resolve(),
  checkAuth: () =>
    localStorage.getItem("user") ? Promise.resolve() : Promise.reject(),
  getPermissions: () => {
    return Promise.resolve(undefined);
  },
  getIdentity: () => {
    const persistedUser = localStorage.getItem("user");
    const user = persistedUser ? JSON.parse(persistedUser) : null;

    return Promise.resolve(user);
  },
};

export default authProvider;
