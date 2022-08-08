const getKeywords = (text) =>
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
const formatToWrite = (text) => `[ ${text.map(x => Array.isArray(x) ? `[ ${x.join(", ")} ]` : x).join(", ")} ]`

const combine = ([head, ...[headTail, ...tailTail]]) => {
  if (!headTail) return head;

  const combined = headTail.reduce((acc, x) => acc.concat(head.map((h) => `${h}-${x}`)), []);

  return combine([combined, ...tailTail]);
};

const getQueries = (text) => {
  let queries = [];
  const keywords = getKeywords(text);
  const filteredOrs = keywords.filter(Array.isArray);

  if (filteredOrs.length) {
    const combinedResults = combine(filteredOrs);

    queries = combinedResults.map((cr) => {
      const splitedCR = cr.split('-');
      let cont = 0;

      return keywords
        .reduce((acc = '', x = '') => {
          if (!Array.isArray(x)) return `${acc} ${x}`;
          return `${acc} ${splitedCR[cont++]}`;
        }, [])
        .trim();
    });
  } else {
    queries = [keywords.join(' ')];
  }

  return queries;
};

const msToSeconds = (milis) => Math.floor(milis / 1000);

module.exports = {
  getKeywords,
  formatToWrite,
  combine,
  getQueries,
  msToSeconds,
};
