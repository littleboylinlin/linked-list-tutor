import { useState } from "react";
import { parseListInput } from "../algorithms/layout";
import { defaultParams, type UpdateParam } from "../algorithms/parameters";

export function useTutorInputs() {
  const [input, setInput] = useState("1 2 3 4 5");
  const [appliedValues, setAppliedValues] = useState([1, 2, 3, 4, 5]);
  const [params, setParams] = useState(() => ({ ...defaultParams }));

  const updateParam: UpdateParam = (name, value) => {
    setParams((current) => ({ ...current, [name]: value }));
  };

  return {
    input,
    setInput,
    appliedValues,
    params,
    updateParam,
    applyInput: () => setAppliedValues(parseListInput(input)),
  };
}
