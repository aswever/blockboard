import { FormEvent } from "react";

export const formAction = (fn: () => void) => (e: FormEvent) => {
  e.preventDefault();
  fn();
};
