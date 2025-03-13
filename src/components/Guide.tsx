import styles from "../styles/Guide.module.scss";

export default function Guide({isOpen, setIsOpen}: {isOpen: boolean, setIsOpen: (isOpen: boolean) => void}) {
    return (
        <div className={styles.bg + " " + (isOpen ? styles.opened : "")} onClick={() => setIsOpen(false)}>
            <div className={styles.container} onClick={(e) => e.stopPropagation()}>
                <header className={styles.header}>
                    <h2>사용법</h2>
                    <h4>CCFOLIA LOG BEAUTIFIER</h4>
                </header>
                <div className={styles.content}>
                    <p>아직 못썻서영...</p>
                </div>
                <div className={styles.buttons}>
                    <button onClick={() => setIsOpen(false)}>닫기</button>
                </div>
            </div>
        </div>
    );
}