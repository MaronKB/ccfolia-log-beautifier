import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faAngleLeft,
    faAngleRight,
    faDownload,
    faEllipsisVertical,
    faLock,
    faRotateRight
} from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/Preview/Dock.module.scss";

export default function Dock({pageControl, title, getData}: { pageControl: (isNext: boolean) => void, title: string, getData: () => void }) {
    return (
        <div className={styles.dock}>
            <div className={styles.arrows}>
                <button type={"button"} onClick={() => pageControl(false)}><FontAwesomeIcon icon={faAngleLeft}/>
                </button>
                <button type={"button"} onClick={() => pageControl(true)}><FontAwesomeIcon icon={faAngleRight}/>
                </button>
            </div>
            <div className={styles.filename}>
                <i><FontAwesomeIcon icon={faLock}/></i>
                <span>{title}</span>
                <button className={styles.refresh} onClick={getData}><FontAwesomeIcon
                    icon={faRotateRight}/>
                </button>
            </div>
            <div className={styles.buttons}>
                <button type={"button"} onClick={() => {}}><FontAwesomeIcon
                    icon={faDownload}/></button>
                <button type={"button"} onClick={() => {
                }}><FontAwesomeIcon icon={faEllipsisVertical}/></button>
            </div>
        </div>
    )
}