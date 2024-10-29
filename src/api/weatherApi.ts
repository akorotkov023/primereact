import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const weatherApi = createApi({
    reducerPath: 'weatherApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    endpoints: (builder) => ({
        getWeatherEntries: builder.query<any[], void>({
            query: () => 'weather',
        }),
        addWeatherEntry: builder.mutation<void, any>({
            query: (newEntry) => ({
                url: 'weather',
                method: 'POST',
                body: newEntry,
            }),
        }),
        deleteWeatherEntry: builder.mutation<void, number>({
            query: (id) => ({
                url: `weather/${id}`,
                method: 'DELETE',
            }),
        }),
        getUsers: builder.query<any[], void>({
            query: () => 'users',
        }),
    }),
});

export const { useGetWeatherEntriesQuery, useAddWeatherEntryMutation, useDeleteWeatherEntryMutation, useGetUsersQuery } = weatherApi;
