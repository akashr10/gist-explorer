import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const gistApi = createApi({
	reducerPath: 'gistApi',
	baseQuery: fetchBaseQuery({ baseUrl: 'https://api.github.com/' }),
	endpoints: (builder) => ({
		getGistByUserName: builder.mutation({
			query: (username) => `users/${username}/gists`,
		}),
		getUserByUserName: builder.mutation({
			query: (username) => `users/${username}`,
		}),
		getForksByGistId: builder.mutation({
			query: (gistid) => `gists/${gistid}/forks`,
		}),
	}),
});

export const {
	useGetGistByUserNameMutation,
	useGetUserByUserNameMutation,
	useGetForksByGistIdMutation,
	useGetForksByGistIdQuery,
} = gistApi;
