import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { omit } from "lodash";
import { AstraResources as resources } from "./AstraResources";

// const apiUrl = `https://${import.meta.env.VITE_ASTRA_DB_ID}-${
//   import.meta.env.VITE_ASTRA_DB_REGION
// }.apps.astra.datastax.com/api/graphql/${
//   import.meta.env.VITE_ASTRA_DB_KEYSPACE
// }`;

const apiUrl = `/api/graphql`

const client = new ApolloClient({
  uri: apiUrl,
  headers: {
    // "x-cassandra-token": import.meta.env.VITE_ASTRA_DB_APPLICATION_TOKEN,
  },
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "no-cache",
      errorPolicy: "ignore",
    },
    query: {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    },
  },
});

const fields = {
  posts: "id title body author_id created_at",
  authors: "id name",
};

export const AstraGraphQLDataProvider = {
  getList: (resource, { sort, pagination, filter }) => {
    const { field, order } = sort;
    const { page, perPage } = pagination;
    return client
      .query({
        query: gql`
            query {
                ${resource}  {
                    ${resources[resource].fields}
                }
            }`,
      })
      .then((result) => ({
        data: result.data[resource],
        total: result.data[`${resource}_aggregate`].aggregate.count,
      }));
  },
  getOne: (resource, params) => {
    return client
      .query({
        query: gql`
            query ($id: Int!) {
                ${resource}_by_pk(id: $id) {
                    ${fields[resource]}
                }
            }`,
        variables: {
          id: params.id,
        },
      })
      .then((result) => ({ data: result.data[`${resource}_by_pk`] }));
  },
  getMany: (resource, params) => {
    return client
      .query({
        query: gql`
            query ($where: ${resource}_bool_exp) {
                ${resource}(where: $where) {
                    ${fields[resource]}
                }
            }`,
        variables: {
          where: {
            id: { _in: params.ids },
          },
        },
      })
      .then((result) => ({ data: result.data[resource] }));
  },
  getManyReference: (resource, { target, id, sort, pagination, filter }) => {
    const { field, order } = sort;
    const { page, perPage } = pagination;
    return client
      .query({
        query: gql`
            query ($limit: Int, $offset: Int, $order_by: [${resource}_order_by!], $where: ${resource}_bool_exp) {
                ${resource}(limit: $limit, offset: $offset, order_by: $order_by, where: $where) {
                    ${fields[resource]}
                }
                ${resource}_aggregate(where: $where) {
                    aggregate {
                        count
                    }
                }
            }`,
        variables: {
          limit: perPage,
          offset: (page - 1) * perPage,
          order_by: { [field]: order.toLowerCase() },
          where: Object.keys(filter).reduce(
            (prev, key) => ({
              ...prev,
              [key]: { _eq: filter[key] },
            }),
            { [target]: { _eq: id } }
          ),
        },
      })
      .then((result) => ({
        data: result.data[resource],
        total: result.data[`${resource}_aggregate`].aggregate.count,
      }));
  },
  create: (resource, params) => {
    return client
      .mutate({
        mutation: gql`
            mutation ($data: ${resource}_insert_input!) {
                insert_${resource}_one(object: $data) {
                    ${fields[resource]}
                }
            }`,
        variables: {
          data: omit(params.data, ["__typename"]),
        },
      })
      .then((result) => ({
        data: result.data[`insert_${resource}_one`],
      }));
  },
  update: (resource, params) => {
    return client
      .mutate({
        mutation: gql`
            mutation ($id: Int!, $data: ${resource}_set_input!) {
                update_${resource}_by_pk(pk_columns: { id: $id }, _set: $data) {
                    ${fields[resource]}
                }
            }`,
        variables: {
          id: params.id,
          data: omit(params.data, ["__typename"]),
        },
      })
      .then((result) => ({
        data: result.data[`update_${resource}_by_pk`],
      }));
  },
  updateMany: (resource, params) => {
    return client
      .mutate({
        mutation: gql`
            mutation ($where: ${resource}_bool_exp!, $data: ${resource}_set_input!) {
                update_${resource}(where: $where, _set: $data) {
                    affected_rows
                }
            }`,
        variables: {
          where: {
            id: { _in: params.ids },
          },
          data: omit(params.data, ["__typename"]),
        },
      })
      .then((result) => ({
        data: params.ids,
      }));
  },
  delete: (resource, params) => {
    return client
      .mutate({
        mutation: gql`
            mutation ($id: Int!) {
                delete_${resource}_by_pk(id: $id) {
                    ${fields[resource]}
                }
            }`,
        variables: {
          id: params.id,
        },
      })
      .then((result) => ({
        data: result.data[`delete_${resource}_by_pk`],
      }));
  },
  deleteMany: (resource, params) => {
    return client
      .mutate({
        mutation: gql`
            mutation ($where: ${resource}_bool_exp!) {
                delete_${resource}(where: $where) {
                    affected_rows
                }
            }`,
        variables: {
          where: {
            id: { _in: params.ids },
          },
        },
      })
      .then((result) => ({
        data: params.ids,
      }));
  },
};
