const replace = require('replace-in-file');

export async function replaceTokens(
  tokenPrefix: string,
  tokenSuffix: string,
  files: string[]
) {
  const fromRegEx = new RegExp(
    `${escapeDelimiter(tokenPrefix)}(.+?)${escapeDelimiter(tokenSuffix)}`,
    "gm"
  );
  const matchRegEx = new RegExp(
    `${escapeDelimiter(tokenPrefix)}(.+?)${escapeDelimiter(tokenSuffix)}`
  );

  console.log("Files: ", files);

  const results = await replace.replaceInFileSync({
    files,
    countMatches: true,
    allowEmptyPaths: false,
    from: fromRegEx,
    disableGlobs: true,
    to: (match: string) => {
      const m = match.match(matchRegEx);
      if (m) {
        const tokenName = m[1];
        return process.env[tokenName] || "";
      }

      return "";
    }
  });

  return results.filter((result: { hasChanged: any; }) => result.hasChanged)
                .map((result: { file: any; }) => result.file);
}

function escapeDelimiter(delimiter: string): string {
  return delimiter.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}
