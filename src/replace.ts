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

  // replace the UNC path(ex: '\\\\hostname\\')
  files.map(file => file.replace('/\\\\/g', '\\'));
  files = ['\\FWTECD-RPIWT1.dfin.local\\d$\\WebApp\\drop\\Web.config'];
  console.log("Files: ", files);

  const results = replace.sync({
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
