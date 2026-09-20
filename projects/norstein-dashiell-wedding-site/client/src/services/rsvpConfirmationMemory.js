let currentConfirmation = null;

export function setTransientConfirmation(
  payload,
) {
  currentConfirmation = payload;
}

export function getTransientConfirmation() {
  return currentConfirmation;
}

export function clearTransientConfirmation() {
  currentConfirmation = null;
}
