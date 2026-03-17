// ============================================================
// Button — Bouton réutilisable avec variantes
//
// Props :
//   variant : 'primary' | 'secondary' | 'danger' | 'ghost'
//   loading : true/false → affiche un spinner
//   disabled, onClick, type, className, children
// ============================================================
import Spinner from './Spinner'

const variants = {
  primary:   'bg-cyan-600 hover:bg-cyan-500 text-white',
  gradient:  'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white',
  secondary: 'border border-white/20 hover:bg-white/10 text-white',
  danger:    'bg-red-500/20 hover:bg-red-500/30 text-red-300',
  ghost:     'text-cyan-400 hover:text-cyan-300',
}

export default function Button({
  children,
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        ${variants[variant]}
        px-4 py-3 rounded-xl font-medium transition-all
        flex items-center justify-center gap-2
        disabled:opacity-60 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {loading ? <Spinner size={18} /> : children}
    </button>
  )
}
