import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://192.168.196.45:5001" }),
  reducerPath: "adminApi",
  tagTypes: [
    "User",
    "Products",
    "Customers",
    "Transactions",
    "Geography",
    "Sales",
    "Admins",
    "Performance",
    "Dashboard",
    "Receitas" // tag para o CRUD de receitas
  ],
  endpoints: (build) => ({
    getUser: build.query({
      query: (id) => `general/user/${id}`,
      providesTags: ["User"],
    }),
    getProducts: build.query({
      query: () => "client/products",
      providesTags: ["Products"],
    }),
    getCustomers: build.query({
      query: () => "client/customers",
      providesTags: ["Customers"],
    }),
    getTransactions: build.query({
      query: ({ page, pageSize, sort, search }) => ({
        url: "client/transactions",
        method: "GET",
        params: { page, pageSize, sort, search },
      }),
      providesTags: ["Transactions"],
    }),
    getGeography: build.query({
      query: () => "client/geography",
      providesTags: ["Geography"],
    }),
    getSales: build.query({
      query: () => "sales/sales",
      providesTags: ["Sales"],
    }),
    getAdmins: build.query({
      query: () => "management/admins",
      providesTags: ["Admins"],
    }),
    getUserPerformance: build.query({
      query: (id) => `management/performance/${id}`,
      providesTags: ["Performance"],
    }),
    getDashboard: build.query({
      query: () => "general/dashboard",
      providesTags: ["Dashboard"],
    }),
    // Endpoints para o CRUD de receitas
    getReceitas: build.query({
      query: () => "receitas",
      providesTags: ["Receitas"],
    }),
    getReceita: build.query({
      query: (id) => `receitas/${id}`,
      providesTags: (result, error, id) => [{ type: "Receitas", id }],
    }),
    createReceita: build.mutation({
      query: (novaReceita) => ({
        url: "receitas",
        method: "POST",
        body: novaReceita,
      }),
      invalidatesTags: ["Receitas"],
    }),
    updateReceita: build.mutation({
      query: ({ id, ...data }) => ({
        url: `receitas/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Receitas", id }],
    }),
    deleteReceita: build.mutation({
      query: (nome) => ({
        url: `receitas/nome/${nome}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, nome) => [{ type: "Receitas", id: nome }],
    }),
    
  }),
});

export const {
  useGetUserQuery,
  useGetProductsQuery,
  useGetCustomersQuery,
  useGetTransactionsQuery,
  useGetGeographyQuery,
  useGetSalesQuery,
  useGetAdminsQuery,
  useGetUserPerformanceQuery,
  useGetDashboardQuery,
  useGetReceitasQuery,
  useGetReceitaQuery,
  useCreateReceitaMutation,
  useUpdateReceitaMutation,
  useDeleteReceitaMutation,
} = api;
