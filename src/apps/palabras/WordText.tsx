/** La palabra en inglés con su primera letra resaltada: es la letra que está practicando. */
export function WordText({ text }: { text: string }) {
  return (
    <span lang="en">
      <span className="first-letter">{text[0]}</span>
      {text.slice(1)}
    </span>
  );
}
