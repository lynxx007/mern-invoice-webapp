const hasNumber = (number) => {
  return new RegExp(/[0-9]/).test(number);
};

const hasMixed = (number) => {
  return new RegExp(/[a-z]/).test(number) && new RegExp(/[A-Z]/).test(number);
};

const hasSpecial = (number) => {
  return new RegExp(/[!@#@$%^&*()_+-=.]/).test(number);
};

export const strengthColor = (count) => {
  if (count < 2) return { label: "Poor", color: "#FF1744" };
  if (count < 3) return { label: "Weak", color: "#FFEA00" };
  if (count < 4) return { label: "Normal", color: "#FFC400" };
  if (count < 5) return { label: "Good", color: "#52C41A" };
  if (count < 6) return { label: "Strong", color: "#C6FF00" };
  return { label: "Poor", color: "#ff4d4f" };
};

export const strengthIndicator = (number) => {
  let strength = 0;
  if (number.length > 5) strength += 1;
  if (number.length > 7) strength += 1;
  if (hasNumber(number)) strength += 1;
  if (hasSpecial(number)) strength += 1;
  if (hasMixed(number)) strength += 1;

  return strength;
};
