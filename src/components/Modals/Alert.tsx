import styles from "../../styles/Modals/Alert.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";

export default function Alert({message, isConfirm, isOpened, setIsOpened, onConfirm}: { message: string, isConfirm: boolean, isOpened: boolean, setIsOpened: (isOpened: boolean) => void, onConfirm: () => void }) {
    return (
        <div className={styles.modal + (isOpened ? " " + styles.opened : "")}>
            <h3><FontAwesomeIcon icon={faExclamationTriangle}/>알림</h3>
            <div className={styles.content}>{message}</div>
            <div className={styles.buttons}>
                {isConfirm && <>
                    <button type={"button"} className={styles.button} onClick={() => {
                        onConfirm();
                        setIsOpened(false);
                    }}>확인
                    </button>
                    <button type={"button"} className={styles.button} onClick={() => setIsOpened(false)}>취소</button>
                </>}
                {!isConfirm &&
                    <button type={"button"} className={styles.button} onClick={() => setIsOpened(false)}>확인</button>
                }
            </div>
        </div>
    )
}