import type { CSSProperties } from 'react';

/**
 * Silueta endocrino-reproductora dorada — mismo SVG usado en la tarjeta del
 * curso Sistema Endocrino y Reproductor. Reutilizable: cabecera del sílabo.
 */
export default function EndocrineIcon({
  size = 22,
  color = '#c9a227',
  soft = 'rgba(201,162,39,0.35)',
  className,
  style,
}: {
  size?: number;
  color?: string;
  /** Relleno translúcido de los volúmenes secundarios. */
  soft?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 1024 1024"
      fill="none"
      className={className}
      style={style}
      aria-hidden
    >
      <path d="M397 202 C326 247 293 316 293 385 C293 447 321 500 374 544" fill="none" stroke={color} strokeWidth="18" strokeLinecap="butt" />
      <path d="M627 202 C698 247 731 316 731 385 C731 447 703 500 650 544" fill="none" stroke={color} strokeWidth="18" strokeLinecap="butt" />
      <path d="M432 111 C400 110 391 155 397 194 C404 239 426 273 452 276 C474 278 480 244 512 244 C544 244 550 278 572 276 C598 273 620 239 627 194 C633 155 624 110 592 111 C562 112 556 184 512 184 C468 184 462 112 432 111 Z" fill={soft} />
      <g fill={color}>
        <circle cx="512" cy="405" r="24" />
        <rect x="506" y="426" width="12" height="42" rx="6" />
        <circle cx="512" cy="488" r="24" />
        <path d="M492 500 L451 523 L443 509 L484 486 Z" />
        <path d="M532 500 L573 523 L581 509 L540 486 Z" />
        <circle cx="437" cy="529" r="28" />
        <circle cx="587" cy="529" r="28" />
      </g>
      <path d="M445 614 C397 613 364 598 331 575 C298 551 266 553 233 576 C196 602 182 642 196 677 C207 704 232 722 260 722" fill="none" stroke={color} strokeWidth="28" strokeLinecap="round" />
      <path d="M579 614 C627 613 660 598 693 575 C726 551 758 553 791 576 C828 602 842 642 828 677 C817 704 792 722 764 722" fill="none" stroke={color} strokeWidth="28" strokeLinecap="round" />
      <path d="M445 641 C408 658 388 696 351 718" fill="none" stroke={color} strokeWidth="18" strokeLinecap="round" />
      <path d="M579 641 C616 658 636 696 673 718" fill="none" stroke={color} strokeWidth="18" strokeLinecap="round" />
      <ellipse cx="302" cy="714" rx="62" ry="47" fill={soft} />
      <ellipse cx="722" cy="714" rx="62" ry="47" fill={soft} />
      <path d="M403 600 C436 579 473 571 512 571 C551 571 588 579 621 600 C604 622 596 647 592 676 C587 719 577 749 558 781 C541 810 535 837 537 873 C538 889 532 900 521 900 L503 900 C492 900 486 889 487 873 C489 837 483 810 466 781 C447 749 437 719 432 676 C428 647 420 622 403 600 Z" fill={color} />
      <path d="M390 615 C423 631 464 642 512 643 C560 642 601 631 634 615 C607 650 589 686 578 730 C568 771 553 799 535 826 C523 844 518 866 519 894 L505 894 C506 866 501 844 489 826 C471 799 456 771 446 730 C435 686 417 650 390 615 Z" fill={soft} />
      <path d="M487 860 C493 873 496 886 496 902 L496 935 C496 949 501 960 512 960 C523 960 528 949 528 935 L528 902 C528 886 531 873 537 860 C528 872 520 878 512 878 C504 878 496 872 487 860 Z" fill={color} />
    </svg>
  );
}
