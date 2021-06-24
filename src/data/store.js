import { configureStore } from '@reduxjs/toolkit';

import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { gistApi } from '../services/gist';

export const store = configureStore({
	reducer: {
		[gistApi.reducerPath]: gistApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(gistApi.middleware),
});

setupListeners(store.dispatch);
