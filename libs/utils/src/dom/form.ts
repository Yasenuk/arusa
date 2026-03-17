import React from "react";

const emailPattern = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$";
const passwordPattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";

const emailRegex = new RegExp(emailPattern);
const passwordRegex = new RegExp(passwordPattern);

function validateEmail(e: React.ChangeEvent<HTMLInputElement>) {
  const value = e.target.value;
  if (!emailRegex.test(value)) {
    e.target.setCustomValidity("Введіть коректний email");
  } else {
    e.target.setCustomValidity("");
  }

  return value;
}

function validatePassword(e: React.ChangeEvent<HTMLInputElement>) {
  const value = e.target.value;

  if (!passwordRegex.test(value)) {
    e.target.setCustomValidity(
      "Пароль має містити 8 символів, велику і малу літеру, цифру та спецсимвол"
    );
  } else {
    e.target.setCustomValidity("");
  }
  
  return value;
}

function validatePasswordConfirm(password: string, e: React.ChangeEvent<HTMLInputElement>) {
  const value = validatePassword(e);
  
  if (password && value != password) {
    console.log(password, value);
    
    e.target.setCustomValidity("Паролі не співпадають");
  } else {
    e.target.setCustomValidity("");
  }

  return value;
}

export { emailPattern, passwordPattern, validateEmail, validatePassword, validatePasswordConfirm };