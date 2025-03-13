import styles from "../../styles/Modals/Options.module.scss";
import {Getters, Setters} from "../../Types.tsx";

export default function OptionsModal({getters, setters, isOpened}: { getters: Getters, setters: Setters, isOpened: boolean }) {
    const {darkMode, replaceAvatars, disableNoNameHeader} = getters;
    const {setDarkMode, setReplaceAvatars, setDisableNoNameHeader} = setters;
    return (
        <div className={styles.modal + (isOpened ? " " + styles.opened : "")} onClick={e => e.stopPropagation()}>
            <div className={styles.option}>
                <input id="option-dark-mode" type={"checkbox"} checked={darkMode}
                       onChange={e => setDarkMode(e.target.checked)}/>
                <label htmlFor={"option-dark-mode"}>
                    <h4>다크모드 활성화</h4>
                    <span><span></span></span>
                </label>
            </div>
            <div className={styles.option}>
                <input id="option-replace-avatars" type={"checkbox"} checked={replaceAvatars}
                       onChange={e => setReplaceAvatars(e.target.checked)}/>
                <label htmlFor={"option-replace-avatars"}>
                    <h4>포트가 없는 캐릭터 아바타를 대체</h4>
                    <span><span></span></span>
                </label>
            </div>
            <div className={styles.option}>
                <input id={"option-disable-no-name-header"} type={"checkbox"}
                       checked={disableNoNameHeader}
                       onChange={e => setDisableNoNameHeader(e.target.checked)}/>
                <label htmlFor={"option-disable-no-name-header"}>
                    <h4>이름이 없는 캐릭터의 발언을 desc 스타일로 적용</h4>
                    <span><span></span></span>
                </label>
            </div>
        </div>
    )
}