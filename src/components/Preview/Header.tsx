import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExpand, faWindowMinimize, faX} from "@fortawesome/free-solid-svg-icons";
import {Style} from "../../Types.tsx";
import ccfoliaIcon from "../../assets/ccfolia.png";
import roll20Icon from "../../assets/roll20.jpg";
import mrkbIcon from "../../assets/mrkb.png";
import styles from "../../styles/Preview/Header.module.scss";

export default function PreviewHeader({setStyle, style, reset}: { setStyle: (style: Style) => void, style: Style, reset: () => void }) {
    return (
        <header className={styles.header}>
            <h3>PREVIEW</h3>
            <nav className={styles.style}>
                <button onClick={() => setStyle(Style.Ccfolia)}
                        className={(style === Style.Ccfolia) ? styles.active : ""}>
                    <img src={ccfoliaIcon} alt={"ccfolia"}/>
                    <span>CCFOLIA</span>
                </button>
                <button onClick={() => setStyle(Style.Roll20)}
                        className={(style === Style.Roll20) ? styles.active : ""}>
                    <img src={roll20Icon} alt={"roll20"}/>
                    <span>Roll20</span>
                </button>
                <button onClick={() => setStyle(Style.MRKB)}
                        className={(style === Style.MRKB) ? styles.active : ""}>
                    <img src={mrkbIcon} alt={"mrkb"}/>
                    <span>MRKB</span>
                </button>
            </nav>
            <div className={styles.control}>
                <button type={"button"} onClick={() => {
                }}><FontAwesomeIcon icon={faWindowMinimize}/></button>
                <button type={"button"} onClick={() => {
                }}><FontAwesomeIcon icon={faExpand}/></button>
                <button type={"button"} onClick={reset}><FontAwesomeIcon icon={faX}/></button>
            </div>
        </header>
    )
}