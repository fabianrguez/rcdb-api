export default function getNumberOnly(content: string): number {
  return Number(content?.match(/\d/g)?.join(''));
}
