import { useEffect, useState } from "react";
import { localStorageKey } from "../config";

function useGetTokenValues() {
  const object = localStorage.getItem(localStorageKey);
  if (object !== null) {
    const objectParsed = JSON.parse(object);
    return objectParsed;
  } else {
    return "";
  }
}

export default useGetTokenValues;
