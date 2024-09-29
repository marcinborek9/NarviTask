import { PER_PAGE } from '../constants/appConstants.ts';
import axios from 'axios';
import { GetUsersResponse } from '../types/user.ts';

interface TransformedData {
	data: GetUsersResponse['items'];
	totalCount: GetUsersResponse['total_count'];
	page: number;
}

export const getUsers = (debouncedQuery: string, page: number) => {
	return axios.get(
		`https://api.github.com/search/users?q=${debouncedQuery}&per_page=${PER_PAGE}&page=${page}`,
	)
		.then((response) => {
			const transformedData: TransformedData = {
				data: response.data.items,
				totalCount: response.data.total_count,
				page,
			}

			return transformedData;
		})
};
