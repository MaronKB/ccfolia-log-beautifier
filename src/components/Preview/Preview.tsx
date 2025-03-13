import PreviewHeader from "./Header.tsx";
import Dock from "./Dock.tsx";
import {JSX} from "react";
import {Getters, Setters} from "../../Types.tsx";
import styles from "../../styles/Preview/Preview.module.scss";

export default function Preview({file, getters, setters, pageControl, getData, reset, createPreview}: {
    file: File,
    getters: Getters,
    setters: Setters,
    pageControl: (isNext: boolean) => void,
    getData: () => void,
    getChat: () => void,
    reset: () => void,
    createChatMessages: (start?: number, end?: number) => JSX.Element[] | undefined,
    createPreview: () => JSX.Element[] | undefined
}) {
    const {style} = getters;
    const {setStyle} = setters;

    return (
        <div className={styles.preview}>
            <PreviewHeader
                setStyle={setStyle}
                style={style}
                reset={reset}
            />
            <Dock
                pageControl={pageControl}
                title={file.name}
                getData={getData}
            />
            <div className={"chats" + " " + style}>{createPreview()}</div>
        </div>
    )
}