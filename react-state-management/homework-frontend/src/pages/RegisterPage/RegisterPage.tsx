import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { register, clearError } from "../../features/auth/authSlice";
import styles from "./RegisterPage.module.css";

const MAX_USERNAME_LENGTH = 30;
const MAX_PASSWORD_LENGTH = 50;
const USERNAME_WARNING_THRESHOLD = 20;
const USERNAME_DANGER_THRESHOLD = 26;
const PASSWORD_WARNING_THRESHOLD = 35;
const PASSWORD_DANGER_THRESHOLD = 45;

function RegisterPage(): React.ReactElement {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    setSuccessMessage("");
    const result = await dispatch(register({ username, password }));
    if (register.fulfilled.match(result)) {
      setSuccessMessage("Регистрация прошла успешно!");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }
  };

  const handleUsernameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setUsername(event.target.value);
    if (error) {
      dispatch(clearError());
    }
  };

  const handlePasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setPassword(event.target.value);
    if (error) {
      dispatch(clearError());
    }
  };

  const getUsernameInputClass = (): string =>
    username ? `${styles.input} ${styles.inputFilled}` : styles.input;

  const getPasswordInputClass = (): string =>
    password ? `${styles.input} ${styles.inputFilled}` : styles.input;

  const getUsernameCounterClass = (): string => {
    if (username.length > USERNAME_DANGER_THRESHOLD) {
      return `${styles.charCounter} ${styles.charCounterDanger}`;
    }
    if (username.length > USERNAME_WARNING_THRESHOLD) {
      return `${styles.charCounter} ${styles.charCounterWarning}`;
    }
    return styles.charCounter;
  };

  const getPasswordCounterClass = (): string => {
    if (password.length > PASSWORD_DANGER_THRESHOLD) {
      return `${styles.charCounter} ${styles.charCounterDanger}`;
    }
    if (password.length > PASSWORD_WARNING_THRESHOLD) {
      return `${styles.charCounter} ${styles.charCounterWarning}`;
    }
    return styles.charCounter;
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Регистрация</h1>

        {error && <p className={styles.error}>{error}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}

        <div className={styles.formGroup}>
          <input
            className={getUsernameInputClass()}
            type="text"
            placeholder=" "
            value={username}
            onChange={handleUsernameChange}
            maxLength={MAX_USERNAME_LENGTH}
            required
          />
          <label className={styles.label}>Имя пользователя</label>
          <span className={getUsernameCounterClass()}>
            {username.length}/{MAX_USERNAME_LENGTH}
          </span>
        </div>

        <div className={styles.formGroup}>
          <input
            className={getPasswordInputClass()}
            type="password"
            placeholder=" "
            value={password}
            onChange={handlePasswordChange}
            maxLength={MAX_PASSWORD_LENGTH}
            required
          />
          <label className={styles.label}>Пароль</label>
          <span className={getPasswordCounterClass()}>
            {password.length}/{MAX_PASSWORD_LENGTH}
          </span>
        </div>

        <button className={styles.button} type="submit" disabled={isLoading}>
          {isLoading ? "Регистрация..." : "Зарегистрироваться"}
        </button>

        <p className={styles.link}>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
