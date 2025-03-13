import {Actor} from "../Types.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser, faX} from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/Sidebar.module.scss";
import {ChangeEvent} from "react";
import userIcon from "../assets/user.png";

export default function Sidebar({actors, getImageUrl, isOpened, setOpened}: { actors: Actor[], getImageUrl: (ev: ChangeEvent<HTMLInputElement>, target: string) => void, isOpened: boolean, setOpened: (isOpened: boolean) => void }) {

    return (
        <>
            <button className={styles.opener + (isOpened ? (" " + styles.opened) : "")} onClick={() => setOpened(true)}>
                <FontAwesomeIcon icon={faUser}/>
                <h3>CHARACTERS</h3>
            </button>
            <aside className={styles.sidebar + (isOpened ? (" " + styles.opened) : "")}
                   onClick={() => setOpened(false)}
            >
                <div className={styles.actors}
                     onClick={(e) => e.stopPropagation()}
                >
                    <header className={styles.header}>
                        <h3>ACTORS</h3>
                        <button type={"button"} className={styles.fold} onClick={() => setOpened(false)}>
                            <FontAwesomeIcon icon={faX}/></button>
                    </header>
                    <div className={styles.content}>
                        {actors.map(actor => (
                            <label className={styles.actor} key={"actor-" + actor.name}>
                                <input type={"file"} onChange={(e) => getImageUrl(e, actor.name)}/>
                                <img src={actor.image} alt={actor.name} onError={(e) => {
                                    e.currentTarget.src = userIcon;
                                }}/>
                                <span>{actor.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </aside>
        </>
    );
}