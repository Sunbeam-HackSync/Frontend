import { useCallback, useState } from "react";

import {
  getDemoState,
  saveDemoState,
  updateDemoState,
} from "../services/demoStore";

export default function useDemoData() {
  const [state, setState] = useState(() => getDemoState());

  const commit = useCallback((updater) => {
    const nextState = updateDemoState(updater);
    setState(nextState);
    return nextState;
  }, []);

  const replace = useCallback((nextState) => {
    saveDemoState(nextState);
    setState(nextState);
  }, []);

  return {
    state,
    commit,
    replace,
  };
}
