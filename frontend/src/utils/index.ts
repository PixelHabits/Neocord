import type { FormEvent, KeyboardEvent } from 'react';
import type React from 'react';

/**
 * Get the initials of a server name
 * @param serverName - The name of the server
 * @returns The initials of the server name capitalized
 */
export function getInitials(serverName: string): string {
	const titleArr = serverName.split(' ');
	return titleArr
		.map((title) => title?.charAt(0)?.toUpperCase() ?? '')
		.join('');
}

/**
 * Handle the keys down event for the submit button
 * User can press Ctrl + Enter or Cmd + Enter to submit the form
 * @param e - The keyboard event
 */
export function handleSubmitKeysDown(
	e: KeyboardEvent | React.KeyboardEvent<HTMLFormElement>,
	cb: (e: FormEvent | KeyboardEvent) => void,
) {
	if (e.ctrlKey && e.key === 'Enter') {
		cb(e);
	}
}
