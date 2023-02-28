export default function getNumberOnly(content: string | undefined): number {
  return content ? Number(content?.match(/\d/g)?.join('')) : Number.NaN;
}
