/* eslint-disable react/jsx-props-no-spreading */
import { SVGProps } from 'react';

export function Undo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M7.404 18v-1h7.254q1.555 0 2.65-1.067t1.096-2.606t-1.095-2.596t-2.651-1.058H6.915l2.966 2.965l-.708.708L5 9.173L9.173 5l.708.708l-2.966 2.965h7.743q1.963 0 3.355 1.354t1.39 3.3t-1.39 3.31T14.657 18z"
      />
    </svg>
  );
}

export function Redo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M9.342 18q-1.963 0-3.355-1.363q-1.39-1.364-1.39-3.31t1.39-3.3t3.355-1.354h7.743l-2.966-2.965l.708-.708L19 9.173l-4.173 4.173l-.708-.708l2.966-2.965H9.342q-1.555 0-2.65 1.058t-1.096 2.596t1.095 2.606T9.342 17h7.254v1z"
      />
    </svg>
  );
}

export function FormatH1(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path fill="currentColor" d="M6 16.5v-9h1v4h5v-4h1v9h-1v-4H7v4zm11 0v-8h-2v-1h3v9z" />
    </svg>
  );
}

export function FormatH2(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M4 16.5v-9h1v4h5v-4h1v9h-1v-4H5v4zm9 0v-3.385q0-.666.475-1.14q.474-.475 1.14-.475h3.77q.269 0 .442-.173t.173-.442v-1.77q0-.269-.173-.442t-.442-.173H13v-1h5.385q.666 0 1.14.475q.475.474.475 1.14v1.77q0 .666-.475 1.14q-.474.475-1.14.475h-3.77q-.269 0-.442.173t-.173.442V15.5h6v1z"
      />
    </svg>
  );
}

export function FormatH3(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M4 16.5v-9h1v4h5v-4h1v9h-1v-4H5v4zm9 0v-1h5.385q.269 0 .442-.173t.173-.442V12.5h-4v-1h4V9.115q0-.269-.173-.442t-.442-.173H13v-1h5.385q.666 0 1.14.475q.475.474.475 1.14v5.77q0 .666-.475 1.14q-.474.475-1.14.475z"
      />
    </svg>
  );
}

export function FormatH4(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M4 16.5v-9h1v4h5v-4h1v9h-1v-4H5v4zm14 0v-3h-5v-6h1v5h4v-5h1v5h2v1h-2v3z"
      />
    </svg>
  );
}

export function FormatH5(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M4 16.5v-9h1v4h5v-4h1v9h-1v-4H5v4zm9 0v-1h5.385q.269 0 .442-.173t.173-.442v-1.77q0-.269-.173-.442t-.442-.173H13v-5h7v1h-6v3h4.385q.666 0 1.14.475q.475.474.475 1.14v1.77q0 .666-.475 1.14q-.474.475-1.14.475z"
      />
    </svg>
  );
}

export function FormatH6(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M4 16.5v-9h1v4h5v-4h1v9h-1v-4H5v4zm10.615 0q-.666 0-1.14-.475q-.475-.474-.475-1.14v-5.77q0-.666.475-1.14q.474-.475 1.14-.475H20v1h-5.385q-.269 0-.442.173T14 9.115V11.5h4.385q.666 0 1.14.475q.475.474.475 1.14v1.77q0 .666-.475 1.14q-.474.475-1.14.475zm-.615-4v2.385q0 .269.173.442t.442.173h3.77q.269 0 .442-.173t.173-.442v-1.77q0-.269-.173-.442t-.442-.173z"
      />
    </svg>
  );
}

export function FormatAlignLeft(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M4 20v-1h16v1zm0-3.75v-1h10v1zm0-3.75v-1h16v1zm0-3.75v-1h10v1zM4 5V4h16v1z"
      />
    </svg>
  );
}

export function FormatAlignRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M4 5V4h16v1zm6 3.75v-1h10v1zM4 12.5v-1h16v1zm6 3.75v-1h10v1zM4 20v-1h16v1z"
      />
    </svg>
  );
}
export function FormatAlignCenter(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M4 20v-1h16v1zm4-3.75v-1h8v1zM4 12.5v-1h16v1zm4-3.75v-1h8v1zM4 5V4h16v1z"
      />
    </svg>
  );
}

export function FormatAlignJustify(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M4 20v-1h16v1zm0-3.75v-1h16v1zm0-3.75v-1h16v1zm0-3.75v-1h16v1zM4 5V4h16v1z"
      />
    </svg>
  );
}

export function FormatListBulleted(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M9.615 18.5v-1H20v1zm0-6v-1H20v1zm0-6v-1H20v1zM5.327 19.327q-.547 0-.937-.39T4 18t.39-.937t.937-.39t.937.39t.39.937t-.39.937t-.937.39m0-6q-.547 0-.937-.39T4 12t.39-.937t.937-.39t.937.39t.39.937t-.39.937t-.937.39m0-6q-.547 0-.937-.39T4 6t.39-.937t.937-.39t.937.39t.39.937t-.39.937t-.937.39"
      />
    </svg>
  );
}

export function FormatListNumbered(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M4 21v-.885h2.5V18.75H5v-.885h1.5V16.5H4v-.885h2.692q.295 0 .494.2t.199.493v1.384q0 .295-.2.494t-.493.199q.295 0 .494.199t.199.493v1.23q0 .295-.2.494q-.198.199-.493.199zm0-6.308V12.25q0-.294.199-.493q.2-.2.493-.2H6.5v-1.365H4v-.884h2.692q.295 0 .494.199t.199.493v1.75q0 .294-.2.493q-.198.2-.493.2H4.885v1.365h2.5v.884zm1.5-6.307v-4.5H4V3h2.385v5.385zM9.615 18.5v-1H20v1zm0-6v-1H20v1zm0-6v-1H20v1z"
      />
    </svg>
  );
}

export function FormatQuote(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="m6.585 17.308l2.396-4.173q-.173.096-.404.134t-.462.039q-1.4 0-2.353-.973T4.808 10q0-1.4.954-2.354t2.353-.954q1.362 0 2.335.954T11.423 10q0 .479-.118.9q-.118.42-.336.792l-3.238 5.616zm8.769 0l2.396-4.173q-.173.096-.404.134t-.461.039q-1.4 0-2.354-.973T13.577 10q0-1.42.954-2.363q.954-.945 2.354-.945q1.361 0 2.334.954T20.192 10q0 .479-.118.9q-.118.42-.336.792L16.5 17.308z"
      />
    </svg>
  );
}

export function Code(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M14.538 19v-1h1.943q.636 0 1.078-.432t.441-1.03v-2.115q0-.835.512-1.475q.511-.64 1.315-.87v-.157q-.804-.229-1.315-.87Q18 10.412 18 9.578V7.462q0-.599-.441-1.03T16.48 6h-1.943V5h1.943q1.057 0 1.788.721T19 7.461v2.116q0 .636.46 1.068q.461.432 1.117.432H21v1.846h-.423q-.656 0-1.116.432T19 14.423v2.115q0 1.02-.73 1.74q-.732.722-1.79.722zM7.52 19q-1.038 0-1.779-.721T5 16.539v-2.116q0-.636-.46-1.068q-.461-.432-1.117-.432H3v-1.846h.423q.656 0 1.116-.432T5 9.577V7.462q0-1.02.74-1.74Q6.48 5 7.52 5h1.96v1H7.52q-.618 0-1.069.432Q6 6.863 6 7.462v2.115q0 .835-.502 1.475t-1.325.87v.157q.823.229 1.325.87q.502.64.502 1.474v2.115q0 .599.451 1.03Q6.9 18 7.519 18h1.962v1z"
      />
    </svg>
  );
}

export function FormatItalic(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M5.788 18.25v-1.115h3.635l3.48-10.27H9.27V5.75h8.308v1.115h-3.52l-3.48 10.27h3.52v1.115z"
      />
    </svg>
  );
}

export function FormatBold(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M7.877 18.25V5.75h4.198q1.433 0 2.529.904T15.7 9.006q0 .967-.508 1.693q-.507.726-1.257 1.064q.913.256 1.55 1.074t.638 1.97q0 1.61-1.202 2.527q-1.202.916-2.646.916zm1.275-1.185h3.061q1.162 0 1.876-.699q.715-.699.715-1.628t-.715-1.627t-1.893-.7H9.152zm0-5.815h2.863q.998 0 1.69-.617q.693-.618.693-1.546q0-.947-.704-1.552t-1.667-.606H9.152z"
      />
    </svg>
  );
}

export function FormatUnderlined(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M5.692 19.25v-1h12.616v1zM12 16.058q-2.14 0-3.358-1.258t-1.217-3.415V3.827h1.133v7.592q0 1.631.911 2.583q.912.952 2.531.952t2.53-.952t.912-2.583V3.827h1.133v7.558q0 2.157-1.217 3.415T12 16.058"
      />
    </svg>
  );
}

export function AddLink(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M17.077 19v-2.923h-2.923v-1h2.923v-2.923h1v2.923H21v1h-2.923V19zm-6.462-2.923H7.077q-1.692 0-2.884-1.192Q3 13.693 3 12t1.193-2.885t2.884-1.193h3.538v1H7.077q-1.27 0-2.173.904T4 12t.904 2.173t2.173.904h3.538zM8.5 12.5v-1h7v1zM21 12h-1q0-1.27-.904-2.173t-2.173-.904h-3.538v-1h3.538q1.692 0 2.885 1.193T21 12"
      />
    </svg>
  );
}

export function TextIncrease(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="m1.615 18.5l5.289-13h.961l5.289 13h-1.208l-1.448-3.633H4.194L2.746 18.5zm2.939-4.6h5.584l-2.71-6.8h-.132zm13.83 1.6v-3h-3v-1h3v-3h1v3h3v1h-3v3z"
      />
    </svg>
  );
}

export function TextDecrease(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="m1.615 18.5l5.289-13h.961l5.289 13h-1.208l-1.448-3.633H4.194L2.746 18.5zm2.939-4.6h5.584L7.435 7.1h-.139zm10.83-1.4v-1h7v1z"
      />
    </svg>
  );
}

export function LightArticleOutline(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M7.5 16.5h6v-1h-6zm0-4h9v-1h-9zm0-4h9v-1h-9zM5.615 20q-.69 0-1.152-.462T4 18.385V5.615q0-.69.463-1.152T5.615 4h12.77q.69 0 1.152.463T20 5.615v12.77q0 .69-.462 1.152T18.385 20zm0-1h12.77q.23 0 .423-.192t.192-.423V5.615q0-.23-.192-.423T18.385 5H5.615q-.23 0-.423.192T5 5.615v12.77q0 .23.192.423t.423.192M5 5v14z"
      />
    </svg>
  );
}

export function FontFamilyTitle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path fill="currentColor" d="M11.385 19V6.25H6.019V5H18v1.25h-5.365V19z" />
    </svg>
  );
}

export function FormatColorBg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="m6.598 2.573l.694-.727l9.289 9.289l-6.196 6.253l-6.197-6.273l5.502-5.45zm3.806 3.806L5.59 11.154h9.589zm8.173 11.313q-.633 0-1.066-.433t-.434-1.067q0-.448.236-.884q.235-.437.495-.827q.186-.262.379-.51t.39-.51q.198.262.39.51t.38.51q.259.39.494.827q.236.436.236.884q0 .633-.434 1.067t-1.066.433M2 24v-2h20v2z"
      />
    </svg>
  );
}

export function FormatColorText(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M3 24v-3.462h18V24zm3.23-7l5.29-13h.96l5.29 13h-1.208l-1.443-3.638H8.815L7.362 17zm2.94-4.6h5.584L12.05 5.6h-.138z"
      />
    </svg>
  );
}

export function FormatMatchCase(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M4.063 17.162L7.823 6.93h1.09l3.818 10.23h-1.112l-1.032-2.953H6.156l-1.02 2.954zM6.5 13.3h3.756l-1.85-5.223h-.062zm9.644 4.092q-1.16 0-1.861-.64q-.702-.639-.702-1.61q0-1.061.833-1.706t2.146-.646q.536 0 1.086.11t.97.304v-.589q0-.975-.494-1.482q-.493-.508-1.44-.508q-.517 0-.963.18t-.892.553l-.637-.568q.562-.513 1.161-.748t1.337-.234q1.437 0 2.133.735t.696 2.207v4.412h-.902V16.14h-.1q-.388.633-.978.943t-1.393.31m.07-.812q1.144 0 1.775-.735q.632-.734.632-1.842q-.35-.2-.885-.313t-1.05-.112q-.992 0-1.576.408q-.585.407-.585 1.155q0 .616.467 1.027q.468.412 1.221.412"
      />
    </svg>
  );
}

export function FormatIndentDecrease(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M4 20v-1h16v1zm8-3.75v-1h8v1zm0-3.75v-1h8v1zm0-3.75v-1h8v1zM4 5V4h16v1zm2.808 9.808L4 12l2.808-2.808z"
      />
    </svg>
  );
}

export function FormatIndentIncrease(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M4 20v-1h16v1zm8-3.75v-1h8v1zm0-3.75v-1h8v1zm0-3.75v-1h8v1zM4 5V4h16v1zm0 9.808V9.192L6.808 12z"
      />
    </svg>
  );
}

export function DeleteOutline(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M7.615 20q-.67 0-1.143-.472Q6 19.056 6 18.385V6H5V5h4v-.77h6V5h4v1h-1v12.385q0 .69-.462 1.152T16.385 20zM17 6H7v12.385q0 .269.173.442t.442.173h8.77q.23 0 .423-.192t.192-.423zM9.808 17h1V8h-1zm3.384 0h1V8h-1zM7 6v13z"
      />
    </svg>
  );
}

export function FormatChecklist(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M5.838 17.904L3 15.065l.688-.688l2.125 2.125l4.25-4.25l.689.713zm0-7.23L3 7.833l.688-.688L5.813 9.27l4.25-4.25l.689.714zm7.181 5.441v-1h8v1zm0-7.23v-1h8v1z"
      />
    </svg>
  );
}

export function FormatNormalText(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path fill="currentColor" d="M4 17.27v-1h10v1zm0-4.77v-1h16v1zm0-4.77v-1h16v1z" />
    </svg>
  );
}

export function FormatSuperscript(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M18.385 9V7.423q0-.348.23-.578t.577-.23H21V5.77h-2.615V5h2.577q.348 0 .577.23q.23.23.23.578v.769q0 .348-.23.578t-.577.23h-1.808v.846h2.615V9zM7.01 19l4.182-6.467l-3.838-5.918h1.284l3.331 5.193h.023l3.383-5.193h1.29l-3.902 5.918L16.99 19H15.7l-3.708-5.713h-.023L8.3 19z"
      />
    </svg>
  );
}

export function FormatSubscript(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M18.385 19v-1.577q0-.348.23-.578t.577-.23H21v-.846h-2.615V15h2.577q.348 0 .577.23q.23.23.23.578v.769q0 .348-.23.578t-.577.23h-1.808v.846h2.615V19zM7.01 17.385l4.182-6.468L7.354 5h1.284l3.331 5.192h.023L15.375 5h1.29l-3.902 5.917l4.227 6.468H15.7l-3.708-5.714h-.023L8.3 17.385z"
      />
    </svg>
  );
}

export function FormatStrikethrough(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M3 13.48v-1h18v1zm8.385-2.96V6.25H6.019V5H18v1.25h-5.365v4.27zm0 8.48v-3.558h1.25V19z"
      />
    </svg>
  );
}

export function StackAddOutline(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M8 19.385V9.61q0-.672.475-1.14T9.621 8h9.764q.67 0 1.143.472q.472.472.472 1.143v6.962L16.577 21H9.615q-.67 0-1.143-.472Q8 20.056 8 19.385M3.025 6.596q-.13-.671.258-1.208t1.06-.669l9.619-1.694q.67-.13 1.208.258t.668 1.06l.212 1.272h-1.012l-.213-1.192q-.038-.211-.23-.336T14.17 4L4.52 5.713q-.269.039-.404.25t-.096.481l1.596 9.016v1.936q-.342-.167-.581-.475t-.315-.706zM9 9.616v9.769q0 .269.173.442t.442.173H16l4-4V9.615q0-.269-.173-.442T19.385 9h-9.77q-.269 0-.442.173T9 9.615M14 18h1v-3h3v-1h-3v-3h-1v3h-3v1h3z"
      />
    </svg>
  );
}

export function PageBreakOutline(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M6.615 21q-.666 0-1.14-.475Q5 20.051 5 19.385V16.5h1v2.885q0 .269.173.442t.442.173h10.77q.269 0 .442-.173t.173-.442V16.5h1v2.885q0 .666-.475 1.14q-.474.475-1.14.475zM5 11.5V4.615q0-.666.475-1.14Q5.949 3 6.615 3H14.5L19 7.5v4h-1V8h-4V4H6.615q-.269 0-.442.173T6 4.615V11.5zm4.192 3v-1h5.616v1zm7.616 0v-1h5.615v1zm-15.231 0v-1h5.615v1zM12 16.5"
      />
    </svg>
  );
}

export function HorizontalRule(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="m9.108 11.758l2.284-2.29l-2.054-2.06l-1.157 1.157l-.708-.707L8.625 6.7L6.673 4.748l-2.29 2.29zm7.834 7.84l2.29-2.29l-1.951-1.952l-1.158 1.152l-.708-.708l1.152-1.158l-2.04-2.034l-2.285 2.284zM17.273 5l1.733 1.733zM7.153 20H4v-3.154l4.394-4.394L3 7.038l3.673-3.673l5.439 5.42l5.205-5.212l3.085 3.173l-5.142 5.167l5.375 5.414L16.962 21l-5.414-5.394zM5 19h1.727l9.82-9.813l-1.734-1.733L5 17.274zM15.692 8.313l-.879-.86l1.733 1.734z"
      />
    </svg>
  );
}

export function Column2Outline(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M15 20q-.69 0-1.153-.462t-.462-1.153V5.615q0-.69.462-1.152T15 4h2.77q.69 0 1.152.463t.463 1.152v12.77q0 .69-.463 1.152T17.77 20zm-.615-14.385v12.77q0 .23.192.423T15 19h2.77q.23 0 .422-.192t.193-.423V5.615q0-.23-.193-.423T17.77 5H15q-.23 0-.423.192t-.192.423M6.23 20q-.69 0-1.153-.462t-.463-1.153V5.615q0-.69.463-1.152T6.23 4H9q.69 0 1.153.463t.462 1.152v12.77q0 .69-.462 1.152T9 20zM5.615 5.615v12.77q0 .23.193.423T6.23 19H9q.23 0 .423-.192t.192-.423V5.615q0-.23-.192-.423T9 5H6.23q-.23 0-.422.192t-.193.423M18.385 5h-4zm-8.77 0h-4z"
      />
    </svg>
  );
}

export function EditDocument(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M13.654 20.192V19.12q0-.161.056-.3t.186-.27l5.09-5.066q.149-.13.308-.19t.32-.062q.165 0 .334.064t.298.193l.925.945q.123.148.188.307t.064.32t-.061.322t-.19.31l-5.066 5.066q-.131.13-.27.186t-.301.056h-1.073q-.349 0-.578-.23t-.23-.578m6.884-5.132l-.925-.945zm-6 5.055h.95l3.468-3.473l-.925-.963l-3.493 3.486zM6.615 21q-.69 0-1.152-.462T5 19.385V4.615q0-.69.463-1.152T6.615 3h7.214q.323 0 .628.13t.522.349L18.52 7.02q.217.217.348.522t.131.628v1.675q0 .214-.143.357t-.357.143t-.357-.143T18 9.846V8h-3.192q-.348 0-.578-.23T14 7.192V4H6.615q-.23 0-.423.192T6 4.615v14.77q0 .23.192.423t.423.192h4.154q.214 0 .357.143t.143.357t-.143.357t-.357.143zM6 20V4zm12.506-3.852l-.475-.47l.925.964z"
      />
    </svg>
  );
}

export function DataSyncInit(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M4.654 19.346v-1h3.09q-1.794-1.561-2.519-3.073q-.725-1.511-.725-3.196q0-2.454 1.402-4.409T9.5 4.942v1.062q-1.788.74-2.894 2.403T5.5 12.077q0 1.523.643 2.805t2.28 2.722v-3.027h1v4.77zM15 19.5q-1.02 0-1.76-.74T12.5 17q0-1.008.68-1.726q.682-.718 1.805-.768q.367-.881 1.147-1.444T18 12.5q1.229 0 2.134.814T21.18 15.5h.307q.839 0 1.425.571t.587 1.404q0 .838-.58 1.432q-.582.593-1.42.593zm3.4-8.77q-.252-1.14-.838-2.092q-.587-.951-1.985-2.223v3.008h-1v-4.77h4.77v1h-3.091q1.594 1.412 2.253 2.61t.897 2.468zM15 18.5h6.5q.412 0 .706-.294t.294-.706t-.294-.706t-.706-.294h-1.25v-.75q0-.937-.657-1.593Q18.937 13.5 18 13.5t-1.564.57t-.667 1.372v.058H15q-.617 0-1.059.441T13.5 17t.441 1.059T15 18.5m3-2.5"
      />
    </svg>
  );
}

export function DataSync(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M5.5 12.077q0 1.522.643 2.804t2.28 2.723v-2.527q0-.213.144-.356t.357-.144t.356.144t.143.356v3.461q0 .344-.232.576t-.576.232H5.154q-.213 0-.356-.144q-.144-.144-.144-.357q0-.212.144-.356t.356-.143h2.59q-1.794-1.561-2.519-3.073q-.725-1.511-.725-3.187q0-2.211 1.151-4.024q1.15-1.814 2.991-2.756q.196-.104.408-.042t.279.27t-.028.4t-.272.297q-1.592.813-2.56 2.383T5.5 12.077M15 19.5q-1.02 0-1.76-.74T12.5 17q0-1.003.68-1.723q.682-.721 1.805-.771q.367-.881 1.147-1.444T18 12.5q1.229 0 2.134.814T21.18 15.5h.307q.839 0 1.425.571t.587 1.396q0 .846-.58 1.44t-1.42.593zm.577-13.085v2.508q0 .213-.144.356t-.357.144t-.356-.144t-.143-.356V5.462q0-.344.232-.576t.576-.232h3.461q.213 0 .356.144q.144.144.144.357q0 .212-.144.356t-.356.143h-2.59q1.402 1.225 2.053 2.278q.65 1.053.937 2.114q.067.189-.052.36t-.313.227q-.194.055-.359-.062t-.237-.315q-.27-.975-.848-1.831q-.58-.856-1.86-2.01"
      />
    </svg>
  );
}

export function TextdirectionVertical(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M6.77 17.308v-3.75q-1.574 0-2.672-1.098T3 9.788t1.098-2.67t2.672-1.1h6.577v1h-2v10.289h-1V7.019H7.77v10.289zM17.557 19l-3.443-3.308l.708-.707l2.235 2.113V6.02h1V17.1l2.234-2.12l.708.713z"
      />
    </svg>
  );
}

export function TextdirectionLToR(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M11.135 4v10q0 .213-.144.357t-.357.143t-.356-.144t-.143-.356V9.73h-.443q-1.4 0-2.373-.982t-.973-2.383t.973-2.382T9.692 3h5.731q.213 0 .356.144q.144.144.144.357q0 .212-.144.356T15.423 4h-1.385v10q0 .213-.143.356t-.357.144t-.356-.144t-.144-.356V4zm6.95 14.327H4.5q-.213 0-.356-.144T4 17.826t.144-.356t.356-.143h13.565l-1.611-1.612q-.16-.16-.16-.363t.16-.364t.363-.16t.364.16l2.254 2.254q.242.243.242.566t-.242.565l-2.254 2.273q-.134.16-.341.16t-.367-.16t-.16-.354t.16-.354z"
      />
    </svg>
  );
}

export function EditPenSquare(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M11.943 1.25H13.5a.75.75 0 0 1 0 1.5H12c-2.378 0-4.086.002-5.386.176c-1.279.172-2.05.5-2.62 1.069c-.569.57-.896 1.34-1.068 2.619c-.174 1.3-.176 3.008-.176 5.386s.002 4.086.176 5.386c.172 1.279.5 2.05 1.069 2.62c.57.569 1.34.896 2.619 1.068c1.3.174 3.008.176 5.386.176s4.086-.002 5.386-.176c1.279-.172 2.05-.5 2.62-1.069c.569-.57.896-1.34 1.068-2.619c.174-1.3.176-3.008.176-5.386v-1.5a.75.75 0 0 1 1.5 0v1.557c0 2.309 0 4.118-.19 5.53c-.194 1.444-.6 2.584-1.494 3.479c-.895.895-2.035 1.3-3.48 1.494c-1.411.19-3.22.19-5.529.19h-.114c-2.309 0-4.118 0-5.53-.19c-1.444-.194-2.584-.6-3.479-1.494c-.895-.895-1.3-2.035-1.494-3.48c-.19-1.411-.19-3.22-.19-5.529v-.114c0-2.309 0-4.118.19-5.53c.194-1.444.6-2.584 1.494-3.479c.895-.895 2.035-1.3 3.48-1.494c1.411-.19 3.22-.19 5.529-.19m4.827 1.026a3.503 3.503 0 0 1 4.954 4.953l-6.648 6.649c-.371.37-.604.604-.863.806a5.34 5.34 0 0 1-.987.61c-.297.141-.61.245-1.107.411l-2.905.968a1.492 1.492 0 0 1-1.887-1.887l.968-2.905c.166-.498.27-.81.411-1.107c.167-.35.372-.68.61-.987c.202-.26.435-.492.806-.863zm3.893 1.06a2.003 2.003 0 0 0-2.832 0l-.376.377c.022.096.054.21.098.338c.143.413.415.957.927 1.469a3.875 3.875 0 0 0 1.807 1.025l.376-.376a2.003 2.003 0 0 0 0-2.832m-1.558 4.391a5.397 5.397 0 0 1-1.686-1.146a5.395 5.395 0 0 1-1.146-1.686L11.218 9.95c-.417.417-.58.582-.72.76a3.84 3.84 0 0 0-.437.71c-.098.203-.172.423-.359.982l-.431 1.295l1.032 1.033l1.295-.432c.56-.187.779-.261.983-.358c.251-.12.49-.267.71-.439c.177-.139.342-.302.759-.718z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function Save(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 12c0-.466 0-.699.076-.883a1 1 0 0 1 .541-.54c.184-.077.417-.077.883-.077h3c.466 0 .699 0 .883.076a1 1 0 0 1 .54.541c.077.184.077.417.077.883s0 .699-.076.883a1 1 0 0 1-.541.54c-.184.077-.417.077-.883.077h-3c-.466 0-.699 0-.883-.076a1 1 0 0 1-.54-.541C9 12.699 9 12.466 9 12Z" />
        <path
          strokeLinecap="round"
          d="M20.5 7v6c0 3.771 0 5.657-1.172 6.828C18.157 21 16.271 21 12.5 21h-1c-3.771 0-5.657 0-6.828-1.172C3.5 18.657 3.5 16.771 3.5 13V7"
        />
        <path d="M2 5c0-.943 0-1.414.293-1.707C2.586 3 3.057 3 4 3h16c.943 0 1.414 0 1.707.293C22 3.586 22 4.057 22 5c0 .943 0 1.414-.293 1.707C21.414 7 20.943 7 20 7H4c-.943 0-1.414 0-1.707-.293C2 6.414 2 5.943 2 5Z" />
      </g>
    </svg>
  );
}

export function Delete(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <path
          strokeLinecap="round"
          d="M20.5 6h-17m15.333 2.5l-.46 6.9c-.177 2.654-.265 3.981-1.13 4.79c-.865.81-2.196.81-4.856.81h-.774c-2.66 0-3.991 0-4.856-.81c-.865-.809-.954-2.136-1.13-4.79l-.46-6.9"
        />
        <path d="M6.5 6h.11a2 2 0 0 0 1.83-1.32l.034-.103l.097-.291c.083-.249.125-.373.18-.479a1.5 1.5 0 0 1 1.094-.788C9.962 3 10.093 3 10.355 3h3.29c.262 0 .393 0 .51.019a1.5 1.5 0 0 1 1.094.788c.055.106.097.23.18.479l.097.291A2 2 0 0 0 17.5 6" />
      </g>
    </svg>
  );
}
