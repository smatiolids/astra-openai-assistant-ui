import { fetchUtils } from "react-admin";
import { stringify } from "query-string";
import { AstraResources as resources } from "./AstraResources";

// const apiUrl = `https://${process.env.ASTRA_DB_ID}-${
//   process.env.ASTRA_DB_REGION
// }.apps.astra.datastax.com/api/rest/v2`;

const apiUrl = `/api/rest`;

const API = {
  REST: {
    getBase: (resource, query) => `${apiUrl}/${resource}`,
    getList: (resource, query) =>
      `${apiUrl}/${resource}/rows?${stringify(query)}`,
    getManyByKey: (resource, id) =>
      `${apiUrl}/${resource}/${IdToRecord(resource, id)}`,
    getOne: (resource, id) =>
      `${apiUrl}/${resource}/${IdToRecord(resource, id)}`,
    getMany: (resource, id) =>
      `${apiUrl}/${resource}/${IdToRecord(resource, id)}`,
  },
  DOCUMENT: {
    getBase: (resource, query) =>
      `${apiUrl}/namespaces/${process.env.ASTRA_DB_KEYSPACE}/collections/${resource}`,
    getList: (resource, query) =>
      `${apiUrl}/namespaces/${
        process.env.ASTRA_DB_KEYSPACE
      }/collections/${resource}?${stringify(query)}`,
    getOne: (resource, id) =>
      `${apiUrl}/namespaces/${
        process.env.ASTRA_DB_KEYSPACE
      }/${resource}/collections/${IdToRecord(resource, id)}`,
  },
};

const tranformData = (resource, data) => {
  // REST API
  if (Array.isArray(data))
    return data.map((r) => ({
      id: RecordId(resource, r),
      ...r,
    }));

  // DOCUMENT API
  return Object.keys(data).map((k) => {
    return {
      id: k,
      ...data[k],
    };
  });
};

const apiOptions = {
  headers: new Headers({}),
};

const httpClient = fetchUtils.fetchJson;

const SEPARATOR = "%";
const RecordId = (resource, record) => {
  return resources[resource].key.map((k) => record[k]).join(SEPARATOR);
};

const IdToRecord = (resource, id) => {
  return id.split(SEPARATOR).join("/");
};

const AstraDataProvider = {
  getList: (resource, params) => {
    const { perPage } = params.pagination;
    console.log("getList", params);

    /**
     * TO-DO: Handle filter, order and pagination
     */
    // const { page, perPage } = params.pagination;
    // const { field, order } = params.sort;

    const query = {
      "page-size": perPage,
    };

    if (params.meta && params.meta.fields) {
      query.fields = JSON.stringify(
        params.meta.fields.filter((f) => f !== "id")
      );
    }

    let url = API[resources[resource].API].getList(resource, query);
    if (params.filter && params.filter.id) {
      url = API[resources[resource].API].getManyByKey(
        resource,
        params.filter.id
      );
    }

    return httpClient(url, apiOptions).then(({ json }) => {
      return {
        data: tranformData(resource, json.data),
        total: json.count,
      };
    });
  },

  getOne: (resource, params) => {
    console.log("getOne", params);
    const url = API[resources[resource].API].getOne(resource, params.id);

    return httpClient(url, apiOptions).then(({ json }) => ({
      data: {
        id: RecordId(resource, json.data[0]),
        ...json.data[0],
      },
    }));
  },

  getMany: (resource, params) => {
    console.log("getMany", params);
    const url = API[resources[resource].API].getMany(resource, params.ids[0][0]);
    return httpClient(url, apiOptions).then(({ json }) => {
      return {
        data: tranformData(resource, json.data),
        total: json.count,
      };
    });
  },

  getManyReference: (resource, params) => {
    /**
     * TO-DO: Adjust for Astra
     */
    console.log("getManyReference", resource, params);
    const url = API[resources[resource].API].getMany(resource, params.id);

    return httpClient(url, apiOptions).then(({ json }) => {
      return {
        data: tranformData(resource, json.data),
        total: json.count,
      };
    });
  },

  update: (resource, params) => {
    const url = API[resources[resource].API].getOne(resource, params.id);

    // Not allowed to send id and pk fields in body
    const body = params.data;
    resources[resource].key.concat("id").forEach((k) => delete body[k]);

    return httpClient(url, {
      ...apiOptions,
      method: "PUT",
      body: JSON.stringify(body),
    }).then(({ json }) => ({
      data: {
        id: RecordId(resource, json.data),
        ...json.data,
      },
    }));
  },

  updateMany: (resource, params) => {
    /**
     * TO-DO: Adjust for Astra
     */
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
      method: "PUT",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json }));
  },

  create: (resource, params) => {
    const url = API[resources[resource].API].getBase(resource);

    // Not allowed to send id field in body
    let body = params.data;
    ["id"].forEach((k) => delete body[k]);

    return httpClient(url, {
      ...apiOptions,
      method: "POST",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({
      data: { ...params.data, id: RecordId(resource, json) },
    }));
  },

  delete: (resource, params) => {
    const url = API[resources[resource].API].getOne(resource, params.id);
    return httpClient(url, {
      method: "DELETE",
    }).then(({ json }) => ({ data: json }));
  },

  deleteMany: (resource, params) => {
    /**
     * TO-DO: Adjust for Astra
     */

    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
      method: "DELETE",
    }).then(({ json }) => ({ data: json }));
  },
};

export default AstraDataProvider;
