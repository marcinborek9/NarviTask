import '@testing-library/jest-dom';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { SearchBarWithResults } from './SearchBarWithResults.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { ReactNode } from 'react';

const server = setupServer(
	http.get(`https://api.github.com/search/users`, () => {
		return HttpResponse.json({
			total_count: 0,
			incomplete_results: false,
			items: [],
		});
	}),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: ReactNode }) => (
	<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

test('Check if NoData component rendered correctly if results are not found', async () => {
	render(<SearchBarWithResults />, { wrapper });

	const inputElement = screen.getByPlaceholderText('Search');

	fireEvent.change(inputElement, {
		target: {
			value: 'John',
		},
	});

	await waitFor(
		() => {
			expect(screen.getByText('No results found')).toBeInTheDocument();
		},
		{ timeout: 3000 },
	);
});

test('Check if data is displayed correctly if results are found', async () => {
	server.use(
		http.get('https://api.github.com/search/users', () => {
			return HttpResponse.json({
				total_count: 1,
				incomplete_results: false,
				items: [
					{
						login: 'John',
						id: 3188460,
						node_id: 'MDQ6VXNlcjMxODg0NjA=',
						avatar_url: 'https://avatars.githubusercontent.com/u/3188460?v=4',
						gravatar_id: '',
						url: 'https://api.github.com/users/td',
						html_url: 'https://github.com/td',
						followers_url: 'https://api.github.com/users/td/followers',
						following_url: 'https://api.github.com/users/td/following{/other_user}',
						gists_url: 'https://api.github.com/users/td/gists{/gist_id}',
						starred_url: 'https://api.github.com/users/td/starred{/owner}{/repo}',
						subscriptions_url: 'https://api.github.com/users/td/subscriptions',
						organizations_url: 'https://api.github.com/users/td/orgs',
						repos_url: 'https://api.github.com/users/td/repos',
						events_url: 'https://api.github.com/users/td/events{/privacy}',
						received_events_url: 'https://api.github.com/users/td/received_events',
						type: 'User',
						site_admin: false,
						score: 1.0,
					},
				],
			});
		}),
	);
	render(<SearchBarWithResults />, { wrapper });

	const inputElement = screen.getByPlaceholderText('Search');

	fireEvent.change(inputElement, {
		target: {
			value: 'John',
		},
	});

	await waitFor(
		() => {
			expect(screen.getByText('John')).toBeInTheDocument();
		},
		{ timeout: 3000 },
	);
});
