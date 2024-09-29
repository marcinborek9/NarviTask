import { ChangeEvent } from 'react';

import { Input, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchInputProps {
	value: string;
	onChange: (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
}

export const SearchInput = ({ value, onChange }: SearchInputProps) => {
	return (
		<Input
			value={value}
			onChange={onChange}
			placeholder="Search"
			startAdornment={
				<InputAdornment position="start">
					<SearchIcon />
				</InputAdornment>
			}
		/>
	);
};
