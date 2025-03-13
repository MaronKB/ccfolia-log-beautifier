import ExportPdf from "./Modals/ExportPdf.tsx";
import OptionsModal from "./Modals/Options.tsx";
import {useState} from "react";
import styles from "../styles/Footer.module.scss";
import {Getters, Setters} from "../Types.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopyright, faFilePdf, faGear, faRotateLeft} from "@fortawesome/free-solid-svg-icons";

export default function Footer({getters, setters, reset, setIsPrinting, triggerLoading}: { getters: Getters, setters: Setters, reset: () => void, setIsPrinting: (isPrinting: boolean) => void, triggerLoading: (isLoading: boolean) => void }) {

    const [isOptionOpened, setIsOptionOpened] = useState<boolean>(false);
    const [isModalOpened, setIsModalOpened] = useState<boolean>(false);

    return (
        <footer className={styles.footer}>
            <div className={styles.info}>
                <p><FontAwesomeIcon icon={faCopyright}/> 2025 <a href={"https://mrkb.kr"} target={"_blank"} rel={"noreferrer"}>MRKB</a></p>
                <p><a href={"https://creativecommons.org/licenses/by-nc-sa/2.0/kr/deed.ko"} target={"_blank"} rel={"noreferrer"}>CC BY-NC-SA 2.0 KR</a></p>
            </div>
            <div className={styles.controller}>
                <div className={styles.buttons}>
                    <button type={"button"} className={(isOptionOpened ? styles.active : "")}
                            onClick={() => setIsOptionOpened(!isOptionOpened)}>
                        <FontAwesomeIcon icon={faGear}/>
                        <span>설정</span>
                    </button>
                    {getters.chats && getters.chats.length > 0 && <>
                        {/*<button type={"button"} onClick={() => {}}>HTML로 출력</button>*/}
                        <button type={"button"} className={(isModalOpened ? styles.active : "")}
                                onClick={() => setIsModalOpened(!isModalOpened)}>
                            <FontAwesomeIcon icon={faFilePdf}/>
                            <span>PDF로 출력</span>
                        </button>
                        <button type={"button"} onClick={reset}>
                            <FontAwesomeIcon icon={faRotateLeft}/>
                            <span>초기화</span>
                        </button>
                    </>}
                </div>
            </div>
            <div className={styles.boxes}>
                {getters.chats && <ExportPdf
                    title={getters.file?.name ?? "log"}
                    style={getters.style}
                    isOpened={isModalOpened}
                    setIsPrinting={setIsPrinting}
                    triggerLoading={triggerLoading}
                />}
                <OptionsModal
                    getters={getters}
                    setters={setters}
                    isOpened={isOptionOpened}
                />
            </div>
        </footer>
    )
}