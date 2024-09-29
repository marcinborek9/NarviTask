import { Card, Typography, Tooltip } from '@mui/material';

import './UserCard.css';

interface UserCardProps {
	avatar: string;
	name: string;
}

export const UserCard = ({ avatar, name }: UserCardProps) => {
	return (
		<Card className="card-container">
			<img src={avatar} alt={name} width={40} height={40} />
			<Tooltip title={name}>
				<Typography variant="body1" className="card-text">
					{name}
				</Typography>
			</Tooltip>
		</Card>
	);
};
