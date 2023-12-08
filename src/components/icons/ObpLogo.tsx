type LogoProps = {
  className?: string;
  style?: React.CSSProperties;
};

export function ObpLogo({ className, style }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={147}
      height={100}
      fill="none"
      {...{
        className,
        style,
      }}
    >
      <path
        fill="currentColor"
        d="M0 13.91c0-2.007.343-3.862 1.032-5.569.69-1.703 1.662-3.177 2.918-4.419C5.205 2.68 6.688 1.715 8.397 1.03 10.104.342 11.977 0 14.014 0c2.038 0 3.824.342 5.519 1.03a13.455 13.455 0 0 1 4.427 2.892c1.255 1.242 2.228 2.716 2.917 4.42.689 1.703 1.032 3.56 1.032 5.568 0 2.007-.346 3.857-1.032 5.548a13.222 13.222 0 0 1-2.917 4.42 13.19 13.19 0 0 1-4.427 2.912c-1.695.688-3.532 1.03-5.519 1.03-1.986 0-3.91-.342-5.617-1.03a13.248 13.248 0 0 1-4.447-2.913 13.22 13.22 0 0 1-2.918-4.419C.343 17.767 0 15.918 0 13.91Zm4.683 0c0 1.85.403 3.481 1.211 4.893a8.82 8.82 0 0 0 3.315 3.33c1.402.806 3.004 1.208 4.802 1.208 1.799 0 3.356-.402 4.743-1.209a8.653 8.653 0 0 0 3.276-3.35c.793-1.426 1.19-3.052 1.19-4.875 0-1.822-.397-3.52-1.19-4.934a8.564 8.564 0 0 0-3.276-3.309c-1.39-.792-2.97-1.188-4.743-1.188-1.772 0-3.4.402-4.802 1.209a8.8 8.8 0 0 0-3.315 3.33c-.808 1.414-1.21 3.046-1.21 4.895ZM31.36 8.046h3.455l1.151 4.241h-.397V22.63h.397v12.288H31.36V8.047ZM41.485 27.82c-1.748 0-3.264-.41-4.546-1.23-1.283-.819-2.282-1.98-2.998-3.487-.716-1.507-1.071-3.288-1.071-5.351 0-2.064.364-3.85 1.092-5.37.727-1.518 1.733-2.695 3.015-3.529 1.283-.833 2.787-1.247 4.508-1.247s3.368.423 4.704 1.268c1.336.846 2.374 2.028 3.117 3.547.74 1.519 1.113 3.297 1.113 5.33 0 2.035-.37 3.732-1.113 5.25-.742 1.52-1.787 2.702-3.135 3.547-1.351.846-2.911 1.27-4.683 1.27l-.003.002ZM40.73 23.7c1.483 0 2.685-.548 3.613-1.644.924-1.096 1.39-2.529 1.39-4.3 0-1.772-.463-3.25-1.39-4.36-.928-1.11-2.13-1.665-3.613-1.665-1.482 0-2.655.548-3.591 1.644-.94 1.096-1.411 2.543-1.411 4.339 0 1.796.47 3.243 1.41 4.339.94 1.096 2.136 1.644 3.592 1.644v.003ZM62.366 27.781c-1.906 0-3.574-.416-5.003-1.247-1.428-.834-2.547-2.002-3.355-3.508-.809-1.507-1.212-3.264-1.212-5.271s.403-3.812 1.212-5.33c.808-1.52 1.926-2.702 3.355-3.548 1.43-.845 3.097-1.268 5.003-1.268 1.906 0 3.618.429 5.062 1.286 1.44.86 2.56 2.049 3.356 3.568.793 1.519 1.19 3.27 1.19 5.25 0 .238-.006.476-.02.712-.013.238-.033.45-.06.634H56.847v-3.687h11.631l-.951 2.1c0-1.823-.424-3.315-1.271-4.48-.847-1.16-2.13-1.744-3.851-1.744-1.563 0-2.798.482-3.711 1.447-.913.965-1.37 2.24-1.37 3.824v2.1c0 1.637.457 2.939 1.37 3.903.913.965 2.177 1.448 3.791 1.448 1.456 0 2.587-.304 3.395-.912a8.75 8.75 0 0 0 2.085-2.257l3.293 1.98c-.874 1.638-2.037 2.88-3.493 3.726-1.456.846-3.254 1.268-5.4 1.268v.006ZM86.779 7.609c1.375 0 2.46.226 3.254.673a4.346 4.346 0 0 1 1.787 1.843c.397.78.656 1.653.776 2.618.12.965.179 1.962.179 2.993v11.652h-4.606V15.34c0-1.295-.272-2.159-.814-2.593-.543-.438-1.212-.655-2.005-.655-.74 0-1.503.151-2.282.455a7.884 7.884 0 0 0-2.124 1.23 6.755 6.755 0 0 0-1.548 1.763l-.358-2.495h.993V27.39h-4.606V8.046h3.455l.951 3.526-1.35.04a13.516 13.516 0 0 1 2.421-2.121A11.303 11.303 0 0 1 83.7 8.103a9.68 9.68 0 0 1 3.076-.494h.003ZM1.945 63.413v-26.99h9.25c1.957 0 3.58.265 4.863.793 1.282.53 2.249 1.334 2.896 2.418.647 1.084.973 2.445.973 4.083 0 1.349-.326 2.537-.973 3.567a6.718 6.718 0 0 1-2.58 2.397c-1.071.57-2.243.852-3.514.852l.2-1.784c1.613 0 2.989.292 4.128.873 1.137.58 2.026 1.4 2.661 2.457.635 1.057.952 2.31.952 3.764 0 2.483-.767 4.365-2.303 5.646-1.537 1.284-3.747 1.924-6.632 1.924H1.945ZM6.55 39.08v21.4l-1.748-1.466h7.105c1.325 0 2.354-.342 3.097-1.03.74-.688 1.112-1.584 1.112-2.695 0-1.215-.358-2.141-1.07-2.773-.714-.631-1.734-.95-3.058-.95H4.803v-4.082h6.47c1.297 0 2.282-.277 2.956-.834.674-.554 1.014-1.373 1.014-2.457 0-1.004-.346-1.817-1.032-2.439-.689-.62-1.667-.932-2.938-.932H4.96l1.587-1.745.003.003ZM28.422 44.074l1.152 5.27v14.069h-4.606v-19.34h3.454Zm.32 7.45-.952-.437v-3.449l.358-.473c.265-.45.689-.95 1.27-1.507a8.592 8.592 0 0 1 2.044-1.426 5.254 5.254 0 0 1 2.401-.596c.397 0 .773.027 1.13.08.359.054.63.146.815.277v4.16h-1.27c-1.749 0-3.058.272-3.93.814-.873.542-1.494 1.393-1.864 2.555l-.003.003ZM44.978 63.967c-1.483 0-2.76-.271-3.83-.813-1.071-.542-1.9-1.302-2.482-2.279-.582-.976-.874-2.14-.874-3.487 0-1.346.298-2.468.892-3.448.596-.977 1.435-1.751 2.52-2.317 1.086-.569 2.342-.852 3.77-.852 1.88 0 3.396.423 4.547 1.269 1.151.846 1.939 2.034 2.363 3.568l-2.303-.158v-4.795c0-.792-.272-1.507-.815-2.141-.543-.634-1.461-.95-2.759-.95-.743 0-1.563.086-2.461.256-.9.173-1.826.483-2.777.932l-1.39-3.407a16.266 16.266 0 0 1 3.514-1.268 15.882 15.882 0 0 1 3.672-.438c1.721 0 3.141.31 4.269.932 1.124.62 1.965 1.46 2.52 2.517.555 1.057.835 2.272.835 3.645v12.683h-3.534l-1.032-3.607 2.26-.673c-.45 1.585-1.276 2.788-2.481 3.607-1.205.819-2.679 1.23-4.427 1.23l.003-.006Zm1.07-3.764c1.06 0 1.913-.25 2.56-.754.648-.5.973-1.188.973-2.06 0-.924-.326-1.633-.973-2.121-.65-.488-1.503-.733-2.56-.733-1.055 0-1.911.245-2.559.733-.65.488-.972 1.194-.972 2.12 0 .873.322 1.56.972 2.061.648.5 1.5.754 2.56.754ZM58.234 38.05c0-.846.257-1.54.773-2.082.516-.542 1.223-.813 2.124-.813.847 0 1.536.27 2.064.813.528.542.794 1.236.794 2.081 0 .846-.266 1.534-.794 2.061-.528.527-1.217.792-2.064.792-.9 0-1.608-.265-2.124-.792s-.773-1.215-.773-2.06Zm5.2 25.363h-4.606v-19.34h4.606v19.34ZM79.632 43.636c1.375 0 2.46.226 3.254.673a4.346 4.346 0 0 1 1.787 1.844c.397.78.656 1.652.775 2.617.12.965.18 1.963.18 2.993v11.653h-4.606v-12.05c0-1.294-.272-2.158-.815-2.593-.543-.438-1.21-.655-2.004-.655-.74 0-1.504.152-2.282.456a7.884 7.884 0 0 0-2.124 1.23 6.755 6.755 0 0 0-1.548 1.762l-.358-2.495h.993v14.348h-4.606v-19.34h3.455l.951 3.527-1.351.038a13.518 13.518 0 0 1 2.422-2.12 11.304 11.304 0 0 1 2.798-1.388 9.68 9.68 0 0 1 3.076-.494l.003-.006ZM5.638 86.799h5.36c1.641 0 2.945-.438 3.911-1.308.967-.872 1.45-2.087 1.45-3.645 0-1.664-.474-2.918-1.429-3.764-.952-.846-2.25-1.268-3.89-1.268h-5.4l.914-1.03v23.66h-4.61v-26.99h9.648c1.93 0 3.606.402 5.023 1.209a8.635 8.635 0 0 1 3.315 3.33c.793 1.414 1.19 3.03 1.19 4.853s-.397 3.401-1.19 4.816a8.438 8.438 0 0 1-3.335 3.308c-1.43.792-3.097 1.188-5.003 1.188H5.638v-4.36ZM28.225 99.64c-.77 0-1.467-.179-2.103-.536-.635-.358-1.14-.885-1.51-1.585-.372-.7-.554-1.59-.554-2.674V72.454h4.525v20.765c0 .873.197 1.453.594 1.745.397.292.859.435 1.39.435v3.925c-.32.104-.68.185-1.092.238a9.649 9.649 0 0 1-1.25.078ZM40.175 99.994c-1.482 0-2.759-.271-3.83-.813-1.07-.542-1.9-1.301-2.482-2.278-.581-.977-.874-2.141-.874-3.487s.299-2.469.892-3.449c.597-.977 1.435-1.75 2.52-2.317 1.086-.568 2.342-.851 3.771-.851 1.88 0 3.395.423 4.546 1.268 1.152.846 1.94 2.034 2.363 3.568l-2.303-.158v-4.794c0-.793-.271-1.507-.814-2.142-.543-.634-1.462-.95-2.76-.95-.742 0-1.563.087-2.46.257-.901.172-1.826.482-2.778.932l-1.39-3.407a16.268 16.268 0 0 1 3.514-1.269 15.882 15.882 0 0 1 3.672-.438c1.721 0 3.141.31 4.269.933 1.125.619 1.966 1.459 2.52 2.516.555 1.057.836 2.272.836 3.645v12.683h-3.535l-1.032-3.606 2.26-.673c-.45 1.584-1.276 2.787-2.48 3.606-1.206.819-2.68 1.23-4.428 1.23l.003-.006Zm1.071-3.764c1.06 0 1.912-.25 2.56-.754.647-.5.972-1.188.972-2.06 0-.923-.325-1.632-.972-2.12-.65-.489-1.504-.733-2.56-.733s-1.912.244-2.56.732c-.65.489-.972 1.195-.972 2.12 0 .873.322 1.561.973 2.061.647.5 1.5.754 2.56.754ZM52.638 84.303v-4.202h11.79v4.202h-11.79Zm8.973 15.495c-1.852 0-3.314-.51-4.385-1.528-1.07-1.016-1.608-2.62-1.608-4.816V80.098l.874-4.479h3.732v17.44c0 .791.197 1.372.597 1.744.396.373.913.554 1.548.554a7.323 7.323 0 0 0 2.064-.277v4.28a9.45 9.45 0 0 1-1.25.318c-.438.078-.96.12-1.569.12h-.003ZM78.364 84.538H67.288v-4.24h11.076v4.24ZM70.146 99.44V78.395c0-1.4.238-2.576.713-3.529.477-.95 1.157-1.665 2.043-2.141.886-.477 1.924-.715 3.117-.715.582 0 1.104.039 1.57.12.462.08.864.172 1.21.276v4.24c-.292-.053-.575-.103-.853-.157a5.476 5.476 0 0 0-.972-.078c-.609 0-1.13.194-1.57.575-.435.384-.656 1.025-.656 1.924v20.53h-4.605.003ZM90.31 99.875c-1.96 0-3.692-.423-5.199-1.269a8.92 8.92 0 0 1-3.514-3.546c-.835-1.52-1.25-3.282-1.25-5.29 0-2.007.418-3.772 1.25-5.291a8.901 8.901 0 0 1 3.514-3.547c1.51-.846 3.243-1.269 5.2-1.269 1.957 0 3.77.423 5.28 1.27a8.901 8.901 0 0 1 3.514 3.546c.835 1.519 1.25 3.284 1.25 5.292 0 2.007-.418 3.773-1.25 5.288a8.9 8.9 0 0 1-3.514 3.547c-1.51.846-3.27 1.269-5.28 1.269Zm.04-4.44c1.587 0 2.87-.521 3.85-1.567.98-1.042 1.468-2.412 1.468-4.1 0-1.689-.489-3.059-1.467-4.1-.979-1.043-2.264-1.567-3.851-1.567-1.587 0-2.873.52-3.851 1.566-.979 1.042-1.468 2.412-1.468 4.1 0 1.69.49 3.06 1.468 4.101.978 1.043 2.26 1.567 3.85 1.567ZM107.46 80.101l1.152 5.271V99.44h-4.606V80.101h3.454Zm.319 7.451-.951-.438v-3.448l.358-.474c.265-.45.689-.95 1.27-1.506a8.59 8.59 0 0 1 2.044-1.427 5.252 5.252 0 0 1 2.401-.596c.397 0 .773.027 1.131.08.358.055.629.147.814.278v4.16h-1.271c-1.748 0-3.057.271-3.928.813-.874.542-1.495 1.394-1.865 2.555l-.003.003ZM118.02 99.44V80.101h3.454l.952 3.526-1.351.039a14.283 14.283 0 0 1 2.282-2.12 9.95 9.95 0 0 1 2.619-1.388 8.724 8.724 0 0 1 2.917-.495c1.351 0 2.422.227 3.216.674.793.45 1.381 1.063 1.766 1.843s.635 1.653.754 2.617c.12.965.179 1.963.179 2.993v11.653h-4.605V87.394c0-1.295-.272-2.159-.815-2.594-.543-.437-1.196-.655-1.966-.655-1.059 0-2.091.33-3.096.992-1.005.661-1.787 1.48-2.342 2.457l-.358-2.496h.994v14.348h-4.606l.006-.006Zm24.374-12.049c0-1.295-.271-2.159-.814-2.594-.543-.437-1.184-.655-1.924-.655-1.086 0-2.13.33-3.138.992-1.006.661-1.787 1.48-2.342 2.457l-.874-3.925a13.048 13.048 0 0 1 2.243-2.12 9.952 9.952 0 0 1 2.622-1.388 8.73 8.73 0 0 1 2.918-.495c1.351 0 2.422.227 3.215.674.794.45 1.384 1.063 1.766 1.843.385.78.636 1.653.755 2.617.119.965.179 1.963.179 2.993v11.653h-4.606V87.391Z"
      />
    </svg>
  );
}
