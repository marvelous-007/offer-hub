import type * as React from "react";

function ChatIcon({
  ...props
}: React.SVGProps<SVGSVGElement> & {
}) {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M32 0C14.327 0 0 14.327 0 32c0 17.673 14.327 32 32 32s32-14.327 32-32C64 14.327 49.673 0 32 0zM15.94 42.655V48l5.345-5.345h10.37c2.937 0 5.345-2.408 5.345-5.345V21.345C37 18.408 34.592 16 31.655 16H16.345C13.408 16 11 18.408 11 21.345v16.31c0 2.937 2.408 5.345 5.345 5.345h-.405z"
        fill={props.color}
      />
    </svg>
  );
}

export default ChatIcon;
