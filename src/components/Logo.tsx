/** Sprechblase mit versetztem Schatten, wie im bisherigen Logo des Elternrats. */
export function Logo() {
  return (
    <svg className="logo" viewBox="0 0 250 104" role="img" aria-label="Elternrat TSN">
      <path className="logo-schatten" d="M18 14h220v58H180l-52 30 12-30H18z" />
      <path className="logo-blase" d="M6 4h220v58H168l-52 30 12-30H6z" />
      <text x="116" y="43" textAnchor="middle">
        Elternrat TSN
      </text>
    </svg>
  )
}
