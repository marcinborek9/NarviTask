import { useState } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroller';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Grid2 } from '@mui/material';

import { LinearProgress } from '../atoms/LinearProgress.tsx';
import { NoData } from '../atoms/NoData.tsx';
import { SearchInput } from '../molecules/SearchInput.tsx';
import { Snackbar } from '../molecules/Snackbar.tsx';
import { UserCard } from '../molecules/UserCard.tsx';

import { useDebounce } from '../../hooks/useDebounce.tsx';

import { getUsers } from '../../services/getUsers.ts';

import { PER_PAGE } from '../../constants/appConstants.ts';
import { GetUsersResponse } from '../../types/user.ts';

import './SearchBarWithResults.css';

export const SearchBarWithResults = () => {
	const [query, setQuery] = useState('');
	const debouncedQuery = useDebounce(query);
	const { data, hasNextPage, fetchNextPage, isFetching, isLoading, error, isError } =
		useInfiniteQuery({
			queryKey: ['users', debouncedQuery],
			queryFn: ({ pageParam }) => getUsers(debouncedQuery, pageParam as number),
			enabled: !!debouncedQuery,
			initialPageParam: 0,
			getNextPageParam: (lastPage) => {
				const maxPages = Math.ceil(lastPage.totalCount / PER_PAGE);

				if (lastPage.page < maxPages) {
					return lastPage.page + 1;
				} else {
					return undefined;
				}
			},
		});

	const handleLoadMoreData = () => {
		if (hasNextPage && !isFetching) {
			fetchNextPage();
		}
	};

	const mergedData =
		data?.pages.reduce<GetUsersResponse['items']>((acc, currentItem) => {
			console.log('acc', acc);
			console.log('currentItem.data', currentItem.data);
			return [...acc, ...currentItem.data];
		}, []) ?? [];

	return (
		<>
			<Snackbar
				open={isError}
				message={
					axios.isAxiosError(error) ? error?.response?.data?.message : 'Something went wrong...'
				}
				anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
				autoHideDuration={5000}
				key={''}
			/>
			<SearchInput value={query} onChange={(event) => setQuery(event.target.value)} />
			{isLoading && !isError && <LinearProgress />}
			{data?.pages[0].totalCount === 0 && <NoData />}
			<div className="user-list-container">
				{mergedData.length > 0 && (
					<InfiniteScroll
						loadMore={handleLoadMoreData}
						hasMore={hasNextPage && !isLoading}
						loader={!isError ? <LinearProgress /> : undefined}
					>
						<Grid2 container spacing={{ xs: 4 }} columns={{ xs: 2, md: 4, lg: 8 }}>
							{mergedData.map((user) => (
								<Grid2 size={{ xs: 2 }} key={user.id}>
									<UserCard avatar={user.avatar_url} name={user.login} />
								</Grid2>
							))}
						</Grid2>
					</InfiniteScroll>
				)}
			</div>
		</>
	);
};
