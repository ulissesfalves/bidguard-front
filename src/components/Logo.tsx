import clsx from 'clsx';

interface LogoProps {
  variant?: 'dark' | 'light'; // 'dark' para fundo claro, 'light' para fundo escuro
  className?: string;
  showBadge?: boolean; // Para o selo "LIVE" no calculador
  size?: 'sm' | 'md'; // Tamanho do texto
}

export const Logo = ({ variant = 'dark', className, showBadge = false, size = 'md' }: LogoProps) => {
  const textColor = variant === 'dark' ? 'text-slate-900' : 'text-white';
  // Azul principal da sua marca
  const iconBlue = '#2563EB'; 
  // Azul mais claro para o detalhe interno
  const iconAccent = '#60A5FA'; 

  const textSize = size === 'sm' ? 'text-xl' : 'text-2xl';
  const iconSize = size === 'sm' ? '24' : '32';

  return (
    <div className={clsx("flex items-center gap-2.5 font-sans select-none", className)}>
      {/* Ícone Hexagonal SVG Recriado */}
      <svg width={iconSize} height={iconSize} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 drop-shadow-sm">
        {/* Base Hexagonal Azul */}
        <path d="M29.3333 9.33333L16 2.66667L2.66666 9.33333V22.6667L16 29.3333L29.3333 22.6667V9.33333Z" fill={iconBlue}/>
        {/* Detalhe interno branco (espaço negativo) */}
        <path fillRule="evenodd" clipRule="evenodd" d="M16 7.33333L24.6667 12V20.6667L16 25.3333L7.33333 20.6667V12L16 7.33333ZM16 11.3333L11.3333 13.6667V18.3333L16 20.6667L20.6667 18.3333V13.6667L16 11.3333Z" fill="white"/>
        {/* Acento azul claro interno */}
        <path d="M20.6667 13.6667L24.6667 12V20.6667L16 25.3333V20.6667L20.6667 18.3333V13.6667Z" fill={iconAccent}/>
      </svg>

      {/* Texto BidGuard */}
      <span className={clsx("font-bold tracking-tight relative -top-px", textColor, textSize)}>
        BidGuard
      </span>
      
      {/* Selo LIVE opcional */}
      {showBadge && (
        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-black uppercase tracking-wider ml-1 self-start mt-1.5 border border-blue-200">
          LIVE
        </span>
      )}
    </div>
  );
};