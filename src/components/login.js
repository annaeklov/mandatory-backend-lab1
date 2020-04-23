import React from "react";

export default function Login({ handleLogin, handleChange, inputValue }) {
  return (
    <div className="login__container">
      <h2 className="login__container-title">Enter username</h2>
      <form className="login__form">
        <input
          className="login__form-inputField"
          type="text"
          required
          autoFocus
          minLength="1"
          maxLength="12"
          placeholder="Username"
          onChange={handleChange}
          value={inputValue}
        />
        <button className="login__form-btn" onClick={handleLogin}>
          Enter chat
        </button>
      </form>
    </div>
  );
}
