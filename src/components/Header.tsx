import styles from "../styles/Header.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleInfo} from "@fortawesome/free-solid-svg-icons";
import {faDiscord} from "@fortawesome/free-brands-svg-icons";
import buyMeACoffee from "../assets/buy-me-a-coffee.png";
import mrkb from "../assets/mrkb.png";

export default function Header({setIsGuideOpen}: {setIsGuideOpen: (isGuideOpen: boolean) => void}) {
    return (
        <>
            <header className={styles.header}>
                <div className={styles.title}>
                    <h1><span>CCFOLIA</span><span>LOG BEAUTIFIER</span></h1>
                    <h4>BETA</h4>
                </div>
                <nav>
                    <a onClick={() => setIsGuideOpen(true)}>
                        <FontAwesomeIcon icon={faCircleInfo} color={"orange"}/>
                        <span>사용법</span>
                    </a>
                    <div className={styles.divider}/>
                    <a href={"https://discordapp.com/users/266895122522832896"} target={"_blank"}>
                        <FontAwesomeIcon icon={faDiscord} color={"#7289da"}/>
                        <span>문의</span>
                    </a>
                    <div className={styles.divider}/>
                    <a href={"https://buymeacoffee.com/maronkb"} target={"_blank"}>
                        <img src={buyMeACoffee} alt={"Buy me a coffee"}/>
                        <span>후원</span>
                    </a>
                    <div className={styles.divider}/>
                    <a href={"https://mrkb.kr"} target={"_blank"}>
                        <img src={mrkb} alt={"MRKB"}/>
                        <span>MRKB</span>
                    </a>
                </nav>
            </header>
        </>
    );
}