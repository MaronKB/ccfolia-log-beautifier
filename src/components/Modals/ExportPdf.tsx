import {Height, Style, Width} from "../../Types.tsx"
import styles from "../../styles/Modals/ExportPdf.module.scss";
import {useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload} from "@fortawesome/free-solid-svg-icons";

export default function ExportPdf({title, style, isOpened, setIsPrinting, triggerLoading}: { title: string, style: Style, isOpened: boolean, setIsPrinting: (isPrinting: boolean) => void, triggerLoading: (isLoading: boolean) => void }) {

    const css = useRef<HTMLStyleElement>(null);

    const [width, setWidth] = useState<Width>(Width.default);
    const [height, setHeight] = useState<Height>(Height.default);

    const exportPdf = () => {
        window.onbeforeprint = () => {
            const finalHeight = height === Height.Max ? Height.Max : width * height;
            const getColor = (style: Style) => {
                switch (style) {
                    case Style.Ccfolia:
                        return "#2F3136";
                    case Style.Roll20:
                        return "#E4E4E4";
                    case Style.MRKB:
                        return "#1A1A1A";
                }
            }

            const newCss = document.createElement("style");
            newCss.innerHTML = `
                body {
                    background-color: ${getColor(style)};
                }
                @page {
                    size: ${width}px ${finalHeight}px;
                }
            `;
            css.current = newCss;

            document.head.append(css.current);

            const titles = title.split(".");
            titles.pop();
            document.title = titles.join(".");
        }
        window.onafterprint = () => {
            setIsPrinting(false);
            triggerLoading(false);
            if (css.current) document.head.removeChild(css.current);
            document.title = "CCFOLIA LOG BEAUTIFIER";
        }
        triggerLoading(true);
        setIsPrinting(true);
    }

    return (
        <div id="export-pdf" className={styles.modal + (isOpened ? " " + styles.opened : "")}>
            <div className={styles.options}>
                <h4>일괄 변경</h4>
                <div className={styles.option}>
                    <button type={"button"} onClick={() => {
                        setWidth(Width.default);
                        setHeight(Height.default);
                    }}>기본값<span>(권장)</span></button>
                    <button type={"button"} onClick={() => {
                        setWidth(Width.Px400);
                        setHeight(Height.Max);
                    }}>모바일 최적화
                    </button>
                </div>
                <h4>좌우 폭</h4>
                <div className={styles.option}>
                    <input type={"radio"} value={"400"} name={"width"} id={"option-width-400px"}
                           checked={width === Width.Px400} onChange={() => setWidth(Width.Px400)}/>
                    <label htmlFor={"option-width-400px"}>400<span>px</span></label>
                    <input type={"radio"} value={"600"} name={"width"} id={"option-width-600px"}
                           checked={width === Width.Px600} onChange={() => setWidth(Width.Px600)}/>
                    <label htmlFor={"option-width-600px"}>600<span>px</span></label>
                    <input type={"radio"} value={"800"} name={"width"} id={"option-width-800px"}
                           checked={width === Width.Px800} onChange={() => setWidth(Width.Px800)}/>
                    <label htmlFor={"option-width-800px"}>800<span>px</span></label>
                    <input type={"radio"} value={"1000"} name={"width"} id={"option-width-1000px"}
                           checked={width === Width.Px1000} onChange={() => setWidth(Width.Px1000)}/>
                    <label htmlFor={"option-width-1000px"}>1,000<span>px</span></label>
                    <input type={"radio"} value={"1200"} name={"width"} id={"option-width-1200px"}
                           checked={width === Width.Px1200} onChange={() => setWidth(Width.Px1200)}/>
                    <label htmlFor={"option-width-1200px"}>1,200<span>px</span></label>
                </div>
                <h4>페이지 비율</h4>
                <div className={styles.option}>
                    <input type={"radio"} value={"1"} name={"height"} id={"option-height-1"}
                           checked={height === Height.One} onChange={() => setHeight(Height.One)}/>
                    <label htmlFor={"option-height-1"}>1:1</label>
                    <input type={"radio"} value={"1.414"} name={"height"} id={"option-height-1.414"}
                           checked={height === Height.OnePointFourOneFour}
                           onChange={() => setHeight(Height.OnePointFourOneFour)}/>
                    <label htmlFor={"option-height-1.414"}>1:1.414<span>(A용지)</span></label>
                    <input type={"radio"} value={"1.618"} name={"height"} id={"option-height-1.618"}
                           checked={height === Height.OnePointSixOneEight}
                           onChange={() => setHeight(Height.OnePointSixOneEight)}/>
                    <label htmlFor={"option-height-1.618"}>1:618<span>(황금비)</span></label>
                    <input type={"radio"} value={"14400"} name={"height"} id={"option-height-max"}
                           checked={height === Height.Max} onChange={() => setHeight(Height.Max)}/>
                    <label htmlFor={"option-height-max"}>최대<span>(14,400px)</span></label>
                </div>
            </div>
            <button className={styles.export} onClick={exportPdf}>
                <FontAwesomeIcon icon={faDownload}/>
                <span>PDF로 출력</span>
            </button>
        </div>
    )
}