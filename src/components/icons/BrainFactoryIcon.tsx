import Styles from './icon.module.css';

export type IconProps = {
  className?: string;
}

function getClassName(className?: string) {
  const classes = [Styles.icon];
  if (className) classes.push(className);
  return classes.join(' ');
}

export default function IconBrainFactory({ className }: IconProps) {
  return (
    <svg className={getClassName(className)} viewBox="0 0 20 22">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M4.18327 3.22959C4.18327 1.45568 5.67463 0 7.66129 0C8.3798 0 9.01905 0.311053 9.4762 0.756477C9.93014 1.19878 10.2284 1.79776 10.2284 2.40149C10.2284 3.27327 9.63501 4.14051 8.65502 4.14051C8.0811 4.14051 7.5377 3.94346 7.21164 3.40002C7.11752 3.24315 7.16838 3.03968 7.32525 2.94556C7.48212 2.85144 7.68559 2.9023 7.77971 3.05917C7.9505 3.34383 8.23521 3.47802 8.65502 3.47802C9.16561 3.47802 9.56593 3.0203 9.56593 2.40149C9.56593 2.0115 9.36734 1.57536 9.01388 1.23097C8.66362 0.889693 8.18494 0.662481 7.66129 0.662481C6.00432 0.662481 4.84575 1.85672 4.84575 3.22959C4.84575 3.93462 5.08386 4.46458 5.486 4.84049C5.89454 5.22239 6.50168 5.47207 7.2802 5.54992C7.46223 5.56812 7.59504 5.73045 7.57684 5.91248C7.55864 6.09451 7.39631 6.22732 7.21428 6.20911C6.33661 6.12135 5.57737 5.83276 5.0336 5.32445C4.48343 4.81016 4.18327 4.09796 4.18327 3.22959Z" fill="white"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M5.52234 5.01508C5.63388 5.16008 5.60676 5.36805 5.46176 5.47959C5.02343 5.81677 4.79147 6.40467 4.84433 6.97736C4.89595 7.53662 5.21655 8.06027 5.87116 8.30143C6.04282 8.36468 6.13071 8.5551 6.06747 8.72676C6.00423 8.89842 5.81381 8.98631 5.64215 8.92307C4.72333 8.58457 4.25724 7.82466 4.18465 7.03825C4.11331 6.26528 4.41964 5.44541 5.05783 4.95449C5.20283 4.84295 5.4108 4.87008 5.52234 5.01508Z" fill="white"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M4.84339 2.69327C4.86519 2.87491 4.73561 3.03982 4.55397 3.06162C3.61359 3.17446 2.85908 3.67975 2.45985 4.3512C2.06502 5.01523 2.00448 5.86147 2.48425 6.71025L2.66374 7.02779L2.33041 7.17593C1.35547 7.60923 0.760239 8.67842 0.673278 9.83778C0.586452 10.9953 1.01396 12.1398 1.95537 12.7191L2.1897 12.8633L2.09093 13.1201C1.32821 15.1032 2.3204 17.3839 4.45031 18.0685C4.62447 18.1245 4.72028 18.311 4.66429 18.4852C4.60831 18.6594 4.42174 18.7552 4.24758 18.6992C1.82962 17.922 0.663702 15.3948 1.38478 13.1323C0.337132 12.3562 -0.0805028 11.0302 0.012653 9.78823C0.103605 8.57565 0.687863 7.35691 1.75289 6.72932C1.32722 5.7701 1.42419 4.79675 1.89042 4.01263C2.40208 3.15208 3.34517 2.53944 4.47504 2.40386C4.65668 2.38206 4.82159 2.51163 4.84339 2.69327Z" fill="white"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M9.13073 9.29986C8.86663 9.24907 8.65968 9.24238 8.56973 9.26487C8.44871 9.29513 8.32939 9.39945 8.04416 9.75597C8.01102 9.7974 7.97634 9.84116 7.93987 9.88718C7.684 10.21 7.34005 10.6441 6.81899 11.1652C6.8101 11.174 6.80115 11.183 6.79215 11.192C6.10338 11.881 5.08417 12.9005 3.73019 13.0811C3.54886 13.1053 3.38226 12.9779 3.35807 12.7965C3.33389 12.6152 3.46129 12.4486 3.64262 12.4244C4.75525 12.276 5.62937 11.4179 6.35054 10.6967C6.84317 10.2041 7.1647 9.79851 7.41981 9.47674C7.45678 9.43011 7.49236 9.38524 7.52686 9.34211C7.7799 9.02582 8.03322 8.71613 8.40906 8.62217C8.65035 8.56185 8.98166 8.59657 9.25583 8.64929C9.54141 8.70421 9.84272 8.79439 10.0453 8.89568C10.2089 8.97749 10.2753 9.17646 10.1934 9.34009C10.1116 9.50371 9.91266 9.57003 9.74903 9.48822C9.62037 9.42389 9.38342 9.34845 9.13073 9.29986Z" fill="white"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M3.15806 9.52128C3.27787 9.38303 3.48707 9.36809 3.62531 9.4879L5.60898 11.2071C5.74723 11.3269 5.76217 11.5361 5.64236 11.6743C5.52255 11.8126 5.31335 11.8275 5.17511 11.7077L3.19143 9.98853C3.05319 9.86872 3.03824 9.65952 3.15806 9.52128Z" fill="white"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M7.05086 14.2424C7.18858 14.3628 7.20259 14.5721 7.08217 14.7098C6.49903 15.3767 5.65903 16.2826 5.41915 16.5396C4.94522 17.0474 4.79485 18.0043 5.1055 18.8609C5.40533 19.6877 6.11931 20.3713 7.33 20.3713C8.70636 20.3713 9.56552 19.209 9.56552 18.301C9.56552 17.8699 9.44212 17.6821 9.34557 17.5963C9.2409 17.5032 9.10381 17.4729 8.98584 17.4729C8.62363 17.4729 8.30374 17.6446 8.0192 18.0709C7.91763 18.223 7.71195 18.2641 7.5598 18.1625C7.40764 18.0609 7.36663 17.8552 7.46819 17.7031C7.84695 17.1356 8.35516 16.8105 8.98584 16.8105C9.19953 16.8105 9.5179 16.863 9.78577 17.1012C10.0618 17.3466 10.228 17.7384 10.228 18.301C10.228 19.5461 9.10042 21.0338 7.33 21.0338C5.80823 21.0338 4.86608 20.1439 4.48271 19.0868C4.11016 18.0595 4.24951 16.8219 4.93483 16.0876C5.17437 15.8309 6.00799 14.9318 6.58346 14.2737C6.70389 14.136 6.91315 14.122 7.05086 14.2424Z" fill="white"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M4.08297 14.9408C4.16479 14.7772 4.36375 14.7108 4.52738 14.7927L5.59104 15.3245C5.75467 15.4063 5.82099 15.6053 5.73918 15.7689C5.65736 15.9325 5.4584 15.9988 5.29477 15.917L4.23111 15.3852C4.06748 15.3034 4.00116 15.1044 4.08297 14.9408Z" fill="white"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M11.0329 1.47486C10.6009 1.95189 10.3112 2.67507 10.3112 3.64364V17.3901C10.3112 18.409 10.585 19.1288 11.0021 19.5902C11.4162 20.0484 12.0043 20.2885 12.7127 20.2885C13.9235 20.2885 14.8658 19.2918 14.8658 18.0526C14.8658 17.3062 14.5675 16.6732 14.0936 16.3347C13.9447 16.2284 13.9102 16.0215 14.0166 15.8726C14.1229 15.7238 14.3298 15.6893 14.4786 15.7956C15.1641 16.2852 15.5283 17.1428 15.5283 18.0526C15.5283 19.629 14.3175 20.951 12.7127 20.951C11.8477 20.951 11.0695 20.6528 10.5106 20.0344C9.9546 19.4193 9.64874 18.5243 9.64874 17.3901V3.64364C9.64874 2.54196 9.98016 1.65035 10.5419 1.03015C11.1045 0.40894 11.8784 0.0828101 12.7127 0.0828101C13.447 0.0828101 14.0841 0.313539 14.5736 0.73144C15.0618 1.14818 15.385 1.73535 15.5218 2.41934C15.5577 2.59873 15.4414 2.77323 15.262 2.80911C15.0826 2.84499 14.9081 2.72865 14.8722 2.54926C14.7606 1.9911 14.5041 1.54314 14.1435 1.2353C13.7842 0.928613 13.3034 0.745291 12.7127 0.745291C12.0565 0.745291 11.464 0.998832 11.0329 1.47486Z" fill="white"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M14.8658 13.7465C15.0487 13.7465 15.197 13.8948 15.197 14.0777C15.197 14.8519 14.9249 15.6702 14.3394 16.2318C13.7403 16.8065 12.8543 17.0725 11.7245 16.8013C11.5466 16.7586 11.437 16.5798 11.4797 16.4019C11.5224 16.224 11.7012 16.1144 11.8791 16.1571C12.8196 16.3828 13.4656 16.152 13.8808 15.7537C14.3098 15.3422 14.5345 14.7113 14.5345 14.0777C14.5345 13.8948 14.6828 13.7465 14.8658 13.7465Z" fill="white"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M14.0329 9.48204C14.1928 9.57088 14.2505 9.77254 14.1616 9.93246C13.2332 11.6036 11.3093 11.8454 10.019 11.6733C9.83767 11.6491 9.71027 11.4825 9.73445 11.3012C9.75863 11.1199 9.92523 10.9925 10.1066 11.0166C11.3006 11.1758 12.8547 10.9208 13.5825 9.61073C13.6713 9.45081 13.873 9.39319 14.0329 9.48204ZM10.12 13.4905C10.3908 13.2456 10.7577 13.084 11.1393 13.084C11.9188 13.084 12.4208 13.6532 12.6916 14.3755C12.7559 14.5468 12.6691 14.7377 12.4978 14.8019C12.3265 14.8662 12.1356 14.7794 12.0713 14.6081C11.8453 14.0054 11.5192 13.7465 11.1393 13.7465C10.9413 13.7465 10.7285 13.8333 10.5645 13.9818C10.4008 14.1299 10.3112 14.3148 10.3112 14.4918C10.3112 14.6747 10.1629 14.823 9.97998 14.823C9.79704 14.823 9.64874 14.6747 9.64874 14.4918C9.64874 14.089 9.84898 13.7357 10.12 13.4905Z" fill="white"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M9.91465 6.08011C10.0783 5.9983 10.2772 6.06462 10.3591 6.22825C10.6276 6.76533 11.4208 7.2958 12.3262 7.37125C12.5085 7.38644 12.6439 7.54654 12.6288 7.72885C12.6136 7.91116 12.4535 8.04663 12.2712 8.03144C11.1891 7.94126 10.1605 7.31239 9.76652 6.52452C9.6847 6.36089 9.75103 6.16192 9.91465 6.08011ZM16.9218 10.1999C17.0512 10.3292 17.0512 10.5389 16.9218 10.6683C16.4248 11.1654 15.8176 11.5009 15.1437 11.5611C14.4652 11.6216 13.7616 11.3992 13.0855 10.8584C12.9426 10.7441 12.9194 10.5356 13.0337 10.3928C13.148 10.2499 13.3565 10.2268 13.4993 10.341C14.0654 10.7939 14.6039 10.9441 15.0847 10.9012C15.5702 10.8579 16.0395 10.6137 16.4534 10.1999C16.5827 10.0705 16.7925 10.0705 16.9218 10.1999Z" fill="white"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M13.3731 4.85608C12.9378 4.65893 12.3429 4.67658 11.7083 5.01234C11.5466 5.0979 11.3461 5.03617 11.2606 4.87447C11.175 4.71277 11.2368 4.51233 11.3985 4.42677C12.1716 4.01769 12.9845 3.95284 13.6464 4.2526C14.3173 4.55642 14.7707 5.20691 14.864 6.09264C14.8831 6.27457 14.7512 6.43759 14.5692 6.45675C14.3873 6.47591 14.2243 6.34395 14.2051 6.16202C14.1328 5.47497 13.7995 5.04916 13.3731 4.85608Z" fill="white"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12.8953 4.20138C13.2604 3.10611 14.1938 2.15306 15.6111 2.15306C16.4321 2.15306 17.1189 2.42818 17.602 2.89926C18.0846 3.36976 18.3438 4.01639 18.3438 4.72018C18.3438 5.33288 18.1549 5.93519 17.9349 6.38101C19.1799 7.24396 20 8.49575 20 9.93721C20 10.568 19.8433 11.2541 19.5799 11.8688C19.3497 12.4058 19.0291 12.9092 18.6373 13.2781C19.2967 15.7942 17.6989 18.019 15.4371 18.541C15.2589 18.5821 15.081 18.471 15.0399 18.2927C14.9987 18.1145 15.1099 17.9366 15.2882 17.8955C17.2699 17.4381 18.628 15.4668 17.9446 13.265L17.8777 13.0493L18.0541 12.9082C18.413 12.621 18.7366 12.1547 18.971 11.6079C19.2044 11.0632 19.3375 10.4657 19.3375 9.93721C19.3375 8.38213 18.1471 6.98635 16.3185 6.27079C16.1481 6.20413 16.064 6.01198 16.1307 5.84162C16.1974 5.67126 16.3895 5.5872 16.5599 5.65386C16.8407 5.76375 17.111 5.88992 17.3682 6.03104C17.5395 5.66625 17.6813 5.18848 17.6813 4.72018C17.6813 4.18181 17.4851 3.7105 17.1395 3.3736C16.7946 3.03729 16.2807 2.81554 15.6111 2.81554C14.5441 2.81554 13.8212 3.5187 13.5238 4.41087C13.466 4.58442 13.2784 4.67822 13.1048 4.62037C12.9313 4.56252 12.8375 4.37493 12.8953 4.20138Z" fill="white"/>
    </svg>
  );
}