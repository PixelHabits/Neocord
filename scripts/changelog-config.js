const typeMap = {
	feature: 'Features',
	feat: 'Features',
	fix: 'Bug Fixes',
	refactor: 'Code Refactoring',
	docs: 'Documentation',
	style: 'Styles',
	chore: 'Maintenance',
	tooling: 'Tooling',
	update: 'Updates',
};

module.exports = {
	writerOpts: {
		transform: (commit) => {
			if (!commit.header) return null;

			// Extract PR number if present
			// biome-ignore lint/performance/useTopLevelRegex: <explanation>
			const prMatch = commit.header.match(/\(#(\d+)\)$/);
			const prNumber = prMatch ? prMatch[1] : null;

			// Clean header of PR number
			// biome-ignore lint/performance/useTopLevelRegex: <explanation>
			const cleanHeader = commit.header.replace(/\s*\(#\d+\)$/, '');

			// Try different commit message formats
			const formats = [
				// Feature/Fix format: "Feature(Scope): Message"
				// biome-ignore lint/performance/useTopLevelRegex: <explanation>
				/(?:Feature|Fix|Refactor|Docs|Style|Chore|Update)\(([^)]+)\):\s*(.+)$/i,
				// Conventional format: "feat(scope): message"
				// biome-ignore lint/performance/useTopLevelRegex: <explanation>
				/(feat|fix|docs|style|refactor|chore|update)\(([^)]+)\):\s*(.+)$/i,
				// Turbo format: "feat(create-turbo): message"
				// biome-ignore lint/performance/useTopLevelRegex: <explanation>
				/(feat)\(([^)]+)\):\s*(.+)$/i,
			];

			// biome-ignore lint/style/useSingleVarDeclarator: <explanation>
			let type, scope, subject;
			for (const format of formats) {
				const match = cleanHeader.match(format);
				if (match) {
					[, type, scope, subject] = match;
					break;
				}
			}

			if (!type) return null;

			// Extract bullet points from body
			const notes = [];
			if (commit.body) {
				const bulletPoints = commit.body
					.split('\n')
					.filter(
						(line) =>
							line.trim().startsWith('*') || line.trim().startsWith('-'),
					)
					// biome-ignore lint/performance/useTopLevelRegex: <explanation>
					.map((line) => line.trim().replace(/^[*-]\s*/, ''));

				// biome-ignore lint/style/useExplicitLengthCheck: <explanation>
				if (bulletPoints.length) {
					notes.push({
						title: 'Changes',
						text: bulletPoints.join('\n'),
					});
				}
			}

			return {
				type: typeMap[type.toLowerCase()] || type,
				scope: scope,
				subject: subject,
				notes: notes,
				references: prNumber ? [{ issue: prNumber }] : [],
			};
		},
	},
};
