import { type FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { login, clearError } from "../../features/auth/authSlice";
import styles from "./LoginPage.module.css";

const MAX_USERNAME_LENGTH = 30;
const MAX_PASSWORD_LENGTH = 50;
const USERNAME_WARNING_THRESHOLD = 20;
const USERNAME_DANGER_THRESHOLD = 26;

function LoginPage(): React.ReactElement {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    const result = await dispatch(login({ username, password }));
    if (login.fulfilled.match(result)) {
      navigate("/chat");
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

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Вход</h1>

        {error && <p className={styles.error}>{error}</p>}

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
        </div>

        <button className={styles.button} type="submit" disabled={isLoading}>
          {isLoading ? "Вход..." : "Войти"}
        </button>

        <p className={styles.link}>
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
