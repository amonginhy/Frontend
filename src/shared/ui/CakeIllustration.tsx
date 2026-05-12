import { motion } from 'framer-motion';
import { cn } from '@shared/utils/cn';

interface CakeIllustrationProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  flavor?: 'chocolate' | 'vanilla' | 'redvelvet' | 'strawberry' | 'matcha';
  toppings?: string[]; // strawberry, cherry, sprinkles, chocolate, blueberry, candle
  tiers?: 1 | 2 | 3;
  className?: string;
}

const flavorPalette: Record<NonNullable<CakeIllustrationProps['flavor']>, { sponge: string; frosting: string; drip: string }> = {
  chocolate: { sponge: '#5B3A1E', frosting: '#3F1517', drip: '#2A0F11' },
  vanilla: { sponge: '#F0DCA8', frosting: '#FBF6EE', drip: '#E8D2A0' },
  redvelvet: { sponge: '#8E2A2A', frosting: '#FBEDED', drip: '#B86060' },
  strawberry: { sponge: '#F1B7B7', frosting: '#FBEDED', drip: '#E58A8A' },
  matcha: { sponge: '#A8C089', frosting: '#E6EFD6', drip: '#7E9C5C' },
};

const sizeMap = {
  sm: 'h-32 w-32',
  md: 'h-48 w-48',
  lg: 'h-72 w-72',
  xl: 'h-96 w-96',
};

export function CakeIllustration({
  size = 'lg',
  flavor = 'chocolate',
  toppings = [],
  tiers = 1,
  className,
}: CakeIllustrationProps) {
  const palette = flavorPalette[flavor];

  return (
    <motion.div
      key={`${flavor}-${tiers}-${toppings.join(',')}`}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 22 }}
      className={cn('relative grid place-items-center select-none', sizeMap[size], className)}
    >
      <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-[0_18px_30px_rgba(63,21,23,0.35)]">
        <defs>
          <radialGradient id="plate" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FBF6EE" />
            <stop offset="100%" stopColor="#E5D0A6" />
          </radialGradient>
          <linearGradient id="sponge" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={palette.sponge} stopOpacity="1" />
            <stop offset="100%" stopColor={palette.sponge} stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id="frosting" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={palette.frosting} />
            <stop offset="100%" stopColor={palette.drip} />
          </linearGradient>
        </defs>

        {/* Plate */}
        <ellipse cx="120" cy="210" rx="100" ry="14" fill="url(#plate)" />
        <ellipse cx="120" cy="208" rx="92" ry="9" fill="#F7EFE0" />

        {/* Bottom tier */}
        <g>
          <ellipse cx="120" cy="190" rx="86" ry="14" fill={palette.sponge} opacity="0.9" />
          <rect x="34" y="140" width="172" height="55" rx="6" fill="url(#sponge)" />
          <ellipse cx="120" cy="140" rx="86" ry="14" fill={palette.frosting} />
          {/* Drip */}
          <path
            d="M34 145 C 50 160, 60 130, 75 150 S 100 130, 115 152 S 145 130, 160 152 S 190 130, 206 148 L 206 140 L 34 140 Z"
            fill="url(#frosting)"
          />
          {/* Decorative dots */}
          {Array.from({ length: 8 }).map((_, i) => (
            <circle
              key={i}
              cx={48 + i * 18}
              cy={178}
              r={3}
              fill={palette.frosting}
              opacity={0.7}
            />
          ))}
        </g>

        {tiers >= 2 && (
          <g>
            <ellipse cx="120" cy="135" rx="62" ry="10" fill={palette.sponge} opacity="0.9" />
            <rect x="58" y="95" width="124" height="42" rx="6" fill="url(#sponge)" />
            <ellipse cx="120" cy="95" rx="62" ry="10" fill={palette.frosting} />
            <path
              d="M58 100 C 72 112, 82 92, 92 108 S 112 92, 122 108 S 142 92, 152 108 S 172 92, 182 105 L 182 95 L 58 95 Z"
              fill="url(#frosting)"
            />
          </g>
        )}

        {tiers >= 3 && (
          <g>
            <ellipse cx="120" cy="92" rx="42" ry="8" fill={palette.sponge} opacity="0.9" />
            <rect x="78" y="62" width="84" height="32" rx="6" fill="url(#sponge)" />
            <ellipse cx="120" cy="62" rx="42" ry="8" fill={palette.frosting} />
          </g>
        )}

        {/* Toppings */}
        {toppings.includes('strawberry') && (
          <g>
            <ellipse cx="80" cy="86" rx="9" ry="11" fill="#E83A3A" />
            <ellipse cx="120" cy="80" rx="9" ry="11" fill="#E83A3A" />
            <ellipse cx="160" cy="86" rx="9" ry="11" fill="#E83A3A" />
            <path d="M76 78 L84 78 L80 72 Z" fill="#3A8B45" />
            <path d="M116 72 L124 72 L120 66 Z" fill="#3A8B45" />
            <path d="M156 78 L164 78 L160 72 Z" fill="#3A8B45" />
          </g>
        )}
        {toppings.includes('cherry') && (
          <g>
            <circle cx="100" cy="86" r="7" fill="#C81E3D" />
            <circle cx="140" cy="86" r="7" fill="#C81E3D" />
            <path d="M100 80 Q 120 60, 140 80" stroke="#3A8B45" strokeWidth="2" fill="none" />
          </g>
        )}
        {toppings.includes('blueberry') && (
          <g fill="#3F4E9C">
            <circle cx="76" cy="88" r="5" />
            <circle cx="92" cy="80" r="5" />
            <circle cx="148" cy="80" r="5" />
            <circle cx="164" cy="88" r="5" />
            <circle cx="120" cy="76" r="5" />
          </g>
        )}
        {toppings.includes('chocolate') && (
          <g fill="#3F1517">
            <rect x="68" y="78" width="6" height="14" rx="1" transform="rotate(-12 71 85)" />
            <rect x="108" y="72" width="6" height="14" rx="1" />
            <rect x="148" y="78" width="6" height="14" rx="1" transform="rotate(12 151 85)" />
            <rect x="88" y="80" width="6" height="14" rx="1" transform="rotate(20 91 87)" />
            <rect x="128" y="80" width="6" height="14" rx="1" transform="rotate(-20 131 87)" />
          </g>
        )}
        {toppings.includes('sprinkles') && (
          <g>
            {Array.from({ length: 12 }).map((_, i) => {
              const colors = ['#F26B1F', '#E83A3A', '#FBF6EE', '#5C1F22', '#FFC499'];
              const x = 60 + (i * 11) % 120;
              const y = 78 + (i % 3) * 6;
              return (
                <rect
                  key={i}
                  x={x}
                  y={y}
                  width="6"
                  height="2.5"
                  rx="1.2"
                  fill={colors[i % colors.length]}
                  transform={`rotate(${(i * 31) % 90} ${x + 3} ${y + 1})`}
                />
              );
            })}
          </g>
        )}
        {toppings.includes('candle') && (
          <g>
            <rect x="118" y="40" width="4" height="22" fill="#FBEDED" />
            <path d="M120 36 C 116 32, 124 30, 120 24 C 122 30, 126 34, 120 40 Z" fill="#F26B1F" />
          </g>
        )}
      </svg>
    </motion.div>
  );
}
