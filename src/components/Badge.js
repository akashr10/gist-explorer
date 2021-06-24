import React from 'react';

const toHex = (str) => {
	var hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	var colour = '';
	for (let i = 0; i < 3; i++) {
		var value = (hash >> (i * 8)) & 0xff;
		colour += ('00' + value.toString(16)).substr(-2);
	}
	return colour;
};

export default function Badge({ language }) {
	return (
		<div>
			<img
				alt="badge"
				src={`https://img.shields.io/badge/-${language}-${toHex(
					language,
				)}?logo=${language}`}
			/>
		</div>
	);
}
