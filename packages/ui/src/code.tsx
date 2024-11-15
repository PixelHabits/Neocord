import type React from 'react';

export function Code({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}): React.JSX.Element {
	return <code className={className}>{children}</code>;
}
