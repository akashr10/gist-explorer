import React, { useEffect } from 'react';
import styled from 'styled-components';
import Badge from './Badge';
import { useGetForksByGistIdMutation } from '../services/gist';
import forkIcon from '../images/fork.svg';
import { getDummyAvatarUrl } from '../App';

const DateOptions = {
	weekday: 'long',
	year: 'numeric',
	month: 'long',
	day: 'numeric',
};

export default function GistCard({
	gistId,
	userData,
	description,
	file,
	createdAt,
}) {
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
				<ForkedUser key={`forkedUser-${idx}`}>
					<Avatar
						alt="avatar"
						src={
							fork?.owner?.avatar_url ||
							getDummyAvatarUrl(fork?.owner?.login || '')
						}
					/>
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
							<Filelink href={file?.raw_url} target="_blank">
								{file?.filename}
							</Filelink>
						</div>
						<SmallText>
							{`created on ${new Date(createdAt).toLocaleDateString(
								'en-US',
								DateOptions,
							)}`}
						</SmallText>
					</div>
				</CardLeft>
				<CardRight>
					<Badge language={file.language?.toLowerCase() || file.type} />
				</CardRight>
			</StyledGistCardHeader>
			<Description>{description || 'No description found'}</Description>
			<ForksContent>
				<img alt="fork" src={forkIcon} />
				<SmallText>{`${forkData?.length || 0} forks`}</SmallText>
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

	@media screen and (max-width: 880px) {
		margin-left: 0;
		width: calc(100vw - 48px);
	}
`;

const StyledGistCardHeader = styled.div`
	display: flex;
	justify-content: space-between;
	padding: 8px;
	margin: 24px 0 12px;
	background-color: #f6f8fa;
	border-radius: 6px;
	flex-wrap: wrap;
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
	margin: 8px 0;
	& > div {
		display: flex;
		flex-flow: column;
	}
`;
const CardRight = styled.div`
	margin: 8px 0;
`;
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
	word-break: break-word;
	white-space: break-spaces;
`;

const ForksContent = styled.div`
	border: 1px solid #e1e4e8;
	border-radius: 6px;
	display: flex;
	align-items: center;
	padding: 12px;
	margin-top: 24px;
	@media screen and (max-width: 880px) {
		overflow: scroll;
		white-space: nowrap;

		::-webkit-scrollbar {
			display: none;
		}
	}
`;

const ForkedUser = styled.div`
	display: flex;
	align-items: center;
	margin-left: 16px;

	& > img {
		height: 20px;
		width: 20px;
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
