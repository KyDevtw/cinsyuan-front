import React from "react";

export default function useSize() {
  const [size, setSize] = React.useState({ width: 0, height: 0 });

  function settingSize() {
    setSize({ width: window.innerWidth, height: window.innerHeight });
  }

  React.useEffect(() => {
    window.addEventListener("resize", settingSize);
    settingSize();
    return () => {
      window.removeEventListener("resize", settingSize);
    };
  }, []);

  return size;
}
