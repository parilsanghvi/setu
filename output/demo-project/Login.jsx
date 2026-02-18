import React from 'react';
import styles from './Login.module.css';

const Login = () => {
  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <h2>Login</h2>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className={styles.input}
          />
          {/* Validation message will go here */}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className={styles.input}
          />
          {/* Validation message will go here */}
        </div>
        <button type="submit" className={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
