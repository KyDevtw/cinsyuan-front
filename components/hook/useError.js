import { useState } from "react";
import { isArray } from "lodash";

export default function useError(initObj) {
  const [error, setError] = useState(initObj);

  const mapError = (err) => {
    const message = initObj;
    isArray(err) &&
      err.forEach((item) => {
        message[item.field] = item.message;
      });
    setError(message);
  };

  return { error, mapError };
}