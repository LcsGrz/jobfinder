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

  const combined = headTail.reduce((acc, x) => acc.concat(head.map((h) => `${h} ${x}`)), []);

  return combine([combined, ...tailTail]);
};

module.exports = {
  getKeywords,
  formatToWrite,
  combine,
};
