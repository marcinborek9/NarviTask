import { Snackbar as MUISnackbar, SnackbarProps as MUISnackbarProps } from '@mui/material';
import { useState } from 'react';

interface SnackbarProps {
	open: MUISnackbarProps['open'];
	message: MUISnackbarProps['message'];
	anchorOrigin: MUISnackbarProps['anchorOrigin'];
	autoHideDuration: MUISnackbarProps['autoHideDuration'];
}

export const Snackbar = ({ open, message, anchorOrigin, autoHideDuration }: SnackbarProps) => {
	const [isOpen, setIsOpen] = useState(open);

	return (
		<MUISnackbar
			open={isOpen}
			onClose={() => setIsOpen(false)}
			message={message}
			anchorOrigin={anchorOrigin}
			autoHideDuration={autoHideDuration}
		/>
	);
};
