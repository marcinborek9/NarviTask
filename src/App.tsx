import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './App.css';
import { SearchUsers } from './features/SearchUsers/SearchUsers.tsx';

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<SearchUsers />
		</QueryClientProvider>
	);
}

export default App;
