export const concat = (strings, delim = ',', spaceStart = true) =>
    strings.reduce((result, part) => result.concat(part ? (result ? delim : spaceStart ? ' ' : '') + part : ''), '');
