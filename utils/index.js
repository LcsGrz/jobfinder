module.exports.getKeywords = (text) =>
  text
    .toLowerCase()
    .split(/\band\b/)
    .map((x) => {
      if (x.match(/\bor\b/)) {
        const or = x
          .split(/\bor\b/)
          .map((z) => z.trim())
          .filter(Boolean);

        if (or.length <= 1) return or.pop();

        return or;
      }

      return x.trim();
    })
    .filter(Boolean);

// prettier-ignore
module.exports.formatToWrite = (text) => `[ ${text.map(x => Array.isArray(x) ? `[ ${x.join(", ")} ]` : x).join(", ")} ]`
