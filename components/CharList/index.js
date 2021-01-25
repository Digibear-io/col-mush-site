import styles from './CharList.module.css'
import Avatar from '../Avatar'
const CharList = ({ title, list }) => {
    return (
      <div
        className={styles.listContainer}
        style={{ display: list.length > 0 ? "block" : "none" }}
      >
        <p className={styles.listTitle}>{title}</p>
        {list.map((i, idx) => <div className={styles.listWrapper} key={idx}>
          <Avatar src={i.image}>{i.name.split("").shift()}</Avatar>
          <div className={styles.listContainer}>
            <p>{`${i.prefix}${i.name}${i.title}`}</p>
            <p className={styles.listIdle}>{ i.idle}</p>
          </div>
        </div>
        )}
      </div>
    );
};
  

const List = ({ title, list }) => {
    return (
        <div
        className={styles.listSingleContainer}
        style={{ display: list.length > 0 ? "block" : "none" }}
        >
        <p className={styles.listSingleTitle}>{title}</p>
        {list.map((i, idx) => <div className={styles.listSingle} key={idx}>
            <p>{ i }</p>
        </div>
        )}
      </div>
    );
};

export default CharList;
export {List}