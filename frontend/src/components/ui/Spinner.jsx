// Composant réutilisable — indicateur de chargement
export default function Spinner({ size = 40 }) {
  return (
    <div
      className="spinner"
      style={{ width: size, height: size }}
    />
  )
}
