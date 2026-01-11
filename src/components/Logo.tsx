import clsx from 'clsx';

interface LogoProps {
  variant?: 'dark' | 'light'; // Controla a cor do TEXTO
  className?: string;
  showBadge?: boolean; // Para o selo "LIVE"
  size?: 'sm' | 'md'; // Tamanho geral
}

export const Logo = ({ variant = 'dark', className, showBadge = false, size = 'md' }: LogoProps) => {
  // Ajuste de tamanhos
  const textSize = size === 'sm' ? 'text-xl' : 'text-2xl';
  const imgSize = size === 'sm' ? 'h-8' : 'h-10'; // Altura da imagem
  
  // Cor do texto baseada no fundo
  const textColor = variant === 'dark' ? 'text-slate-900' : 'text-white';

  return (
    <div className={clsx("flex items-center gap-3 select-none", className)}>
      {/* IMPORTANTE: O arquivo 'logo.png' (ou .jpg) deve estar na pasta /public 
         Se o seu arquivo for jpg, mude abaixo para src="/logo.jpg"
      */}
      <img 
        src="/logo.jpg" 
        alt="BidGuard Logo" 
        className={clsx("object-contain", imgSize)} 
      />

      {/* Texto BidGuard */}
      <span className={clsx("font-bold tracking-tight", textColor, textSize)}>
        BidGuard
      </span>
      
      {/* Selo LIVE opcional */}
      {showBadge && (
        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-black uppercase tracking-wider self-start mt-1 border border-blue-200">
          LIVE
        </span>
      )}
    </div>
  );
};