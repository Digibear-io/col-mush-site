import styles from './Avatar.module.css';

const Avatar = ({ children }) => {
    return (
      <div className={styles.avatarContainer}>
        <p>{children}</p>
      </div>
    );
};
  

export default Avatar;