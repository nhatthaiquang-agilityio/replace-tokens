import { replaceInFile } from "replace-in-file";

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

  const result = await replaceInFile({
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

  return result.filter(r => r.hasChanged).map(r => r.file);
}

function escapeDelimiter(delimiter: string): string {
  return delimiter.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}
