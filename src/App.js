import React, { useState } from 'react';
import styled from 'styled-components';
import {
	useGetGistByUserNameMutation,
	useGetUserByUserNameMutation,
} from './services/gist';
import GistCard from './components/GistCard';

import githubImage from './images/github.svg';
import gistImage from './images/gist.svg';
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import md5 from 'md5';

export const getDummyAvatarUrl = (username) => {
	const md5Hash = md5(username);
	return `https://www.gravatar.com/avatar/${md5Hash}?d=identicon`;
};

function App() {
	const [searchText, setSearchText] = useState('');
	const [
		getGistByUserName,
		{ data: gistData, error: gistDataError, isLoading: gistDataIsLoading },
	] = useGetGistByUserNameMutation();
	const [
		getUserByUserName,
		{ data: userData, error: userDataError, isLoading: userDataIsLoading },
	] = useGetUserByUserNameMutation();

	const searchGistOnClick = () => {
		getUserByUserName(searchText);
		getGistByUserName(searchText);
	};

	const renderErrorMessage = (error) => {
		debugger;
		return (
			<ErrorMessage>
				<ExtraLargeText>{error?.status}</ExtraLargeText>
				<LargeText href={error?.data.documentation_url}>
					{error?.data.message}
				</LargeText>
				<ContentText href={error?.data.documentation_url}>
					{error?.data.documentation_url}
				</ContentText>
			</ErrorMessage>
		);
	};

	return (
		<StyledApp>
			<StyledHeader>
				<StyledImage alt="logo" src={githubImage} />
				<StyledImage alt="logo" src={gistImage} />

				<SearchBox
					type="text"
					placeholder="Search..."
					onChange={(e) => setSearchText(e.target.value)}
					name="username"
				/>

				<StyledButton type="submit" onClick={searchGistOnClick}>
					Search
				</StyledButton>
			</StyledHeader>
			{gistDataError ? (
				renderErrorMessage(gistDataError)
			) : (
				<Content>
					<ContentLeft>
						{!userData ? (
							<ContentText>
								Please enter username and click on search
							</ContentText>
						) : !userDataIsLoading ? (
							<>
								<Avatar
									alt="avatar"
									src={
										userData?.avatar_url || getDummyAvatarUrl(userData?.login)
									}
								/>
								<ExtraLargeText>{userData?.name}</ExtraLargeText>
								<LargeText href={userData?.html_url} target="_blank">
									{userData?.login}
								</LargeText>
								<BioSection>
									<PeopleAltOutlinedIcon />
									<HighlightedText>{userData?.followers || 0}</HighlightedText>
									<span> followers </span>
									<HighlightedText>{userData?.following || 0}</HighlightedText>
									<span> following</span>
								</BioSection>
								<ContentText>{userData?.bio}</ContentText>
								<ContactDetails>
									{userData?.location ? (
										<div>
											<LocationOnIcon />
											<span> {userData?.location}</span>
										</div>
									) : null}
									{userData?.email ? (
										<div>
											<MailOutlineIcon />
											<span> {userData?.email}</span>
										</div>
									) : null}
								</ContactDetails>

								<ViewGithubButton href={userData?.html_url} target="_blank">
									View Github Profile
								</ViewGithubButton>
							</>
						) : (
							<HourglassEmptyIcon />
						)}
					</ContentLeft>

					<ContentRight>
						{gistDataIsLoading ? (
							<>Loading...</>
						) : gistData ? (
							<>
								{gistData.map((gist) => {
									const files = Object.keys(gist.files);
									return files.map((file, idx) => (
										<GistCard
											key={file?.filename || idx}
											createdAt={gist.created_at}
											gistId={gist.id}
											userData={userData}
											description={gist?.description}
											file={gist.files[file]}
										/>
									));
								})}
							</>
						) : null}
					</ContentRight>
				</Content>
			)}
		</StyledApp>
	);
}

export default App;

const StyledApp = styled.div`
	display: flex;
	margin: 0 auto;
	flex-flow: column;
`;

const ErrorMessage = styled.div`
	display: flex;
	flex-flow: column;
	justify-content: center;
	align-items: center;
	height: calc(100vh - 72px);
`;

const StyledHeader = styled.div`
	display: flex;
	align-items: center;
	background-color: #24292e;
	height: 48px;
	padding: 12px 24px;
`;

const SearchBox = styled.input`
	margin-left: 12px;
	padding: 8px 16px;
	border-radius: 6px;
	color: #fafbfc;
	background-color: #24292e;
	outline: none;
	border: 1px solid gray;
	background: none;

	::placeholder {
		/* Chrome, Firefox, Opera, Safari 10.1+ */
		color: #fafbfc;
		opacity: 1; /* Firefox */
	}

	:focus {
		background-color: #586069;
		border-color: #0366d6;
	}
`;

const Content = styled.div`
	display: flex;
	padding: 24px;
`;

const ContentLeft = styled.div`
	display: flex;
	flex-flow: column;
	flex: 0.3;
	padding: 12px;

	@media screen and (max-width: 880px) {
		display: none;
	}
`;

const Avatar = styled.img`
	object-fit: cover;
	border-radius: 100%;
	overflow: hidden;
	max-width: 250px;
	margin-bottom: 28px;
`;

const ExtraLargeText = styled.div`
	font-size: 28px;
	font-weight: bold;
	color: #24292e;
`;

const LargeText = styled.a`
	cursor: pointer;
	font-size: 20px;
	text-decoration: none;
	color: #586069;
	cursor: pointer;
`;

const ContentText = styled.a`
	font-size: 14px;
	color: #586069;
`;

const BioSection = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: center;
	margin: 24px 0;

	& > * {
		margin-right: 8px;
		font-size: 14px;
		color: #586069;
	}
`;

const HighlightedText = styled.span`
	color: #24292e;
	font-weight: bold;
`;

const ContentRight = styled.div`
	flex: 0.75;
	display: flex;
	flex-flow: column;

	@media screen and (max-width: 880px) {
		flex: auto;
	}
`;

const ContactDetails = styled.div`
	margin: 24px 0;
	display: flex;
	flex-flow: column;
	justify-content: center;

	& > div {
		display: flex;
		align-items: center;
		margin-top: 8px;
		font-size: 14px;
		color: #586069;

		& > * {
			margin-right: 8px;
		}
	}
`;

const ViewGithubButton = styled.a`
	color: #24292e;
	background-color: #fafbfc;
	transition: 0.2s cubic-bezier(0.3, 0, 0.5, 1);
	transition-property: color, background-color, border-color;
	position: relative;
	display: inline-block;
	padding: 8px 16px;
	font-size: 14px;
	font-weight: bold;
	cursor: pointer;
	user-select: none;
	border: 1px solid rgba(27, 31, 25, 0.15);
	border-radius: 6px;
	appearance: none;
	text-align: center;
	text-decoration: none;
`;

const StyledImage = styled.img`
	object-fit: contain;
	height: 24px;
	margin-right: 4px;
`;

const StyledButton = styled.div`
	cursor: pointer;
	color: white;
	font-size: 16px;
	margin-left: 12px;
`;
