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

  const results = replace.replaceInFile({
    files,
    countMatches: true,
    allowEmptyPaths: false,
    from: fromRegEx,
    to: (match: string) => {
      const m = match.match(matchRegEx);
      console.log("Match: ", m);
      if (m) {
        const tokenName = m[1];
        console.log("tokenName: ", tokenName);
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
