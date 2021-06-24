import React, { useEffect } from 'react';
import styled from 'styled-components';
import Badge from './Badge';
import { useGetForksByGistIdMutation } from '../services/gist';
import forkIcon from '../images/fork.svg';

export default function GistCard({ gistId, userData, description, file }) {
	const [getGistByUserName, { data: forkData }] = useGetForksByGistIdMutation();

	useEffect(() => {
		if (gistId) {
			getGistByUserName(gistId);
		}
	}, [gistId, getGistByUserName]);

	let forkedUsers = [];

	if (forkData) {
		forkData?.forEach((fork, idx) => {
			if (idx >= 3) {
				return;
			}
			forkedUsers.push(
				<ForkedUser>
					<Avatar alt="avatar" src={fork?.owner?.avatar_url} />
					<Userlink href={fork?.html_url} target="_blank">
						{fork?.owner?.login}
					</Userlink>
					<CommitId href={fork?.html_url} target="_blank">
						{fork?.id.substr(0, 6)}
					</CommitId>
				</ForkedUser>,
			);
		});
	}

	return (
		<StyledGistCard>
			<StyledGistCardHeader>
				<CardLeft>
					<Avatar alt="avatar" src={userData?.avatar_url} />
					<div>
						<div>
							<Userlink href={userData?.html_url} target="_blank">
								{userData?.login}
							</Userlink>
							<span>/</span>
							<Filelink href={file?.filename} target="_blank">
								{file?.filename}
							</Filelink>
						</div>
						<SmallText>Last active 6 years ago</SmallText>
					</div>
				</CardLeft>
				<CardRight>
					<Badge language={file.language?.toLowerCase() || file.type} />
				</CardRight>
			</StyledGistCardHeader>
			<Description>{description || 'No description found'}</Description>
			<ForksContent>
				<img alt="fork" src={forkIcon} />
				<SmallText>{`${forkData?.length} forks`}</SmallText>
				{forkedUsers}
			</ForksContent>
		</StyledGistCard>
	);
}

const StyledGistCard = styled.div`
	display: flex;
	flex-flow: column;
	margin-bottom: 12px;
	margin-left: 24px;
`;

const StyledGistCardHeader = styled.div`
	display: flex;
	justify-content: space-between;
	padding: 12px;
	margin: 24px 0 12px;
	background-color: #f6f8fa;
	border-radius: 6px;
`;

const Avatar = styled.img`
	object-fit: cover;
	border-radius: 100%;
	height: 28px;
	overflow: hidden;
	margin-right: 8px;
	border: 1px solid #e1e4e8;
`;

const CardLeft = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	& > div {
		display: flex;
		flex-flow: column;
	}
`;
const CardRight = styled.div``;
const Userlink = styled.a`
	cursor: pointer;
	color: #0366d6;
	text-decoration: none;
	font-size: 14px;
	margin-right: 4px;
`;

const Filelink = styled.a`
	cursor: pointer;
	color: #0366d6;
	font-weight: bold;
	text-decoration: none;
	font-size: 14px;
	margin-left: 4px;
`;

const SmallText = styled.div`
	font-size: 12px;
	color: #586069;
`;

const Description = styled.div`
	font-size: 13px;
	padding: 0 12px;
	color: #586069;
`;

const ForksContent = styled.div`
	border: 1px solid #e1e4e8;
	border-radius: 6px;
	display: flex;
	align-items: center;
	padding: 12px;
	margin-top: 24px;
`;

const ForkedUser = styled.div`
	display: flex;
	align-items: center;
	margin-left: 16px;

	& > img {
		height: 20px;
	}

	& > a {
		font-size: 12px;
	}
`;

const CommitId = styled(Filelink)`
	font-size: 12px;
	border: 1px solid #e1e4e8;
	border-radius: 6px;
	padding: 2px 4px;
	margin-left: 0;
`;
