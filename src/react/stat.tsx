import React from "react";

type Props = React.ComponentProps<"div"> & {
  label: string;
  content: string;
};

export function Stat(props: Props) {
  const { className, label, content, ...rest } = props;

  return (
    <div
      {...rest}
      className={`-outline-offset-8 outline-4 bg-dark text-brand py-4 px-10 rounded-full shadow-lg ${className}`}
    >
      <p>{label}</p>
      <p className="font-extrabold text-3xl">{content}</p>
    </div>
  );
}
