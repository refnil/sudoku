export function cellIDToSVGPos (id) {
  const line = (id % 9) * 100 + 50
  const col = Math.floor(id / 9) * 100 + 50
  return [line, col]
}
