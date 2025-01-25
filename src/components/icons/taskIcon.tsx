import type * as React from "react";

function ChatIcon({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ...props
}: React.SVGProps<SVGSVGElement> & {
  color?: string;
}) {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
    <svg
      width="21"
      height="21"
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <rect width="21" height="21" fill="url(#pattern0_20_4969)" />
      <defs>
        <pattern
          id="pattern0_20_4969"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use xlinkHref="#image0_20_4969" transform="scale(0.015625)" />
        </pattern>
        <image
          id="image0_20_4969"
          width="64"
          height="64"
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </svg>
  );
}

export default ChatIcon;
