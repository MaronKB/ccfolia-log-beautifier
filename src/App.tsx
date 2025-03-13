/**
 * todo list
 * - [ ] i18n
 * - [ ] 파일 업로드 시 로딩 표시
 * - [ ] ko-fi & kakaopay
 * - [ ] 컴포넌트 싹 분리하기
 * - [ ] 파일명에서 액터명 대조해서 자동 부여하는 기능
 * - [ ] 프리뷰에서 포트 클릭했을 때 액터 이미지 변경
 * - [ ] 이 모든 것을 db에 저장해서 로그인하면 불러오기
 */

import './App.scss'
import {ChangeEvent, useCallback, useEffect, useMemo, useState} from "react";
import {Cookies} from "react-cookie";

import userIcon from "./assets/user.png";
import bg from "./assets/bg.jpg";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faComputerMouse,
    faFileArrowUp, faUserPen
} from "@fortawesome/free-solid-svg-icons";
import Header from "./components/Header.tsx";
import {Actor, Chat, Getters, Setters, Style} from "./Types.tsx";
import Preview from "./components/Preview/Preview.tsx";
import Sidebar from "./components/Sidebar.tsx";
import Footer from "./components/Footer.tsx";
import styles from "./styles/Modals/ExportPdf.module.scss";
import Alert from "./components/Modals/Alert.tsx";
import Guide from "./components/Guide.tsx";

function App() {
    const CHAT_SIZE = 30;

    const cookies = useMemo(() => new Cookies(), []);

    const [file, setFile] = useState<File | null>(null);
    const [data, setData] = useState<string | null>(null);
    const [chats, setChats] = useState<Chat[] | null>(null);
    const [actors, setActors] = useState<Actor[]>([]);
    const [style, setStyle] = useState<Style>(Style.Ccfolia);
    const [page, setPage] = useState<number>(1);
    const [message, setMessage] = useState<string>("");
    const [isConfirm, setIsConfirm] = useState<boolean>(false);
    const [onConfirm, setOnConfirm] = useState<() => void>(() => () => {});

    const [isAlertOpened, setIsAlertOpened] = useState<boolean>(false);
    const [isSidebarOpened, setIsSidebarOpened] = useState<boolean>(false);
    const [isPrinting, setIsPrinting] = useState<boolean>(false);
    const [isGuideOpened, setIsGuideOpened] = useState<boolean>(false);

    const [darkMode, setDarkMode] = useState<boolean>(cookies.get("darkMode"));
    const [replaceAvatars, setReplaceAvatars] = useState<boolean>(cookies.get("replaceAvatars"));
    const [disableNoNameHeader, setDisableNoNameHeader] = useState<boolean>(cookies.get("disableNoNameHeader"));

    const getters: Getters = {
        file,
        data,
        chats,
        actors,
        style,
        page,
        message,
        onConfirm,
        darkMode,
        replaceAvatars,
        disableNoNameHeader
    }

    const setters: Setters = {
        setFile,
        setData,
        setChats,
        setActors,
        setStyle,
        setPage,
        setMessage,
        setOnConfirm,
        setDarkMode,
        setReplaceAvatars,
        setDisableNoNameHeader
    }

    const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newFile = e.target.files?.[0];
        if (newFile && file !== newFile) setFile(newFile);
    }

    const reset = () => {
        setFile(null);
        setData(null);
        setChats(null);
        setActors([]);
    }

    const getData = useCallback(() => {
        if (!file) return;

        if (file.type !== "text/html") {
            alertControl("잘못된 파일 형식입니다.");
            reset();
            return;
        }

        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e) => {
            setData(e.target?.result as string);
        }
    }, [file]);

    const getChat = useCallback(() => {
        if (!data) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        const head = doc.head;
        const body = doc.body;
        if (!body || !head || head.querySelector("title")?.innerHTML !== "ccfolia - logs") {
            alertControl("코코포리아 로그가 아닙니다.")
            reset();
            return null;
        }

        const chats = body.querySelectorAll("p");
        const newChats: Chat[] = [];
        const newActors: Actor[] = [];

        chats.forEach((chat) => {
            const channel = chat.querySelector("span:first-child")?.textContent?.replace(" [", '').replace("]", '');
            const actor = chat.querySelector("span:nth-child(2)")?.textContent;
            const text = [chat.querySelector("span:nth-child(3)")?.textContent?.replace("\n    ", '').replace(" \n  ", '')];
            const color = (chat.style.color === "rgb(136, 136, 136)") ? "rgb(255, 255, 255)" : chat.style.color;

            if (!channel || !actor || !text) return;

            const lastChat = newChats[newChats.length - 1];
            if (lastChat && lastChat.channel === channel && lastChat.actor === actor) {
                if (text[0]) lastChat.text.push(text[0]);
            } else {
                newChats.push({channel, actor, text, color});
            }
            if (newActors.filter(e => e.name === actor).length === 0 && actor !== "system") newActors.push({
                name: actor,
                image: replaceAvatars ? `https://www.gravatar.com/avatar/${newActors.length}?s=64&d=identicon` : ""
            });
        });

        setChats(newChats);
        setActors(newActors);
    }, [data, replaceAvatars]);

    const getImageUrl = useCallback((ev: ChangeEvent<HTMLInputElement>, target: string) => {
        const file = (ev.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = (e) => {
            const url = URL.createObjectURL(new Blob([new Uint8Array(e.target?.result as ArrayBuffer)]));
            const newActors = actors.map((actor) => {
                if (actor.name === target) return {
                    name: target,
                    image: url
                };
                return actor;
            });
            setActors(newActors);
        }
    }, [actors, setActors]);

    const getActorImage = useCallback((image: string) => {
        const hasUniqueImage = image && image.slice(0, 5) === "blob:";
        const isGravatar = image && image.slice(0, 32) === "https://www.gravatar.com/avatar/";
        return hasUniqueImage ? image : replaceAvatars && isGravatar ? image : replaceAvatars ? `https://www.gravatar.com/avatar/${Math.floor(Math.random() * 10000)}?s=64&d=identicon` : "";
    }, [replaceAvatars]);

    const replaceActorImage = useCallback(() => {
        const newActors = actors.map(actor => {
            const newImage = getActorImage(actor.image);
            if (actor.image !== newImage) {
                return {
                    name: actor.name,
                    image: newImage
                }
            } else {
                return actor;
            }
        });
        if (JSON.stringify(newActors) !== JSON.stringify(actors)) {
            setActors(newActors);
        }
    }, [actors, getActorImage]);

    const createChatMessages = useCallback((start: number = 0, end: number = (chats?.length ?? 1) - 1) => {
        if (!chats) return;
        return chats.slice(start, end).map((chat: Chat, idx: number) => {
            const headerIsDisabled = disableNoNameHeader && (chat.actor.slice(0, 1) === " " || chat.actor === "　") || (chat.actor === "system");

            const avatarSrc = actors.find((actor) => actor.name === chat.actor)?.image || userIcon;

            return (
                <div key={idx} className={`chat ${headerIsDisabled ? 'desc' : ''}`} style={style === Style.Roll20 && chat.color ? { background: chat.color.replace("rgb(", "rgba(").replace(")", ", 0.05)") } : {}}>
                    {style !== Style.MRKB && !headerIsDisabled && (
                        <>
                            <span className="channel">{chat.channel}</span>
                            <label className="avatar">
                                <input type={"file"} onChange={(e) => getImageUrl(e, chat.actor)}/>
                                <img src={avatarSrc} alt={chat.actor} onError={(e) => {
                                    e.currentTarget.src = userIcon;
                                }}/>
                                <span><FontAwesomeIcon icon={faUserPen}/></span>
                            </label>
                        </>
                    )}
                    <div className="lines">
                        {(style === Style.Roll20 || style === Style.Ccfolia) && (
                            <div className="line header">
                                {!headerIsDisabled && <span className="actor" style={style === Style.Ccfolia && chat.color ? { color: chat.color } : {}}>{chat.actor}</span>}
                                {chat.text[0] && chat.text[0] !== "　" && chat.text[0] !== " " && <span className="text">{chat.text[0]}</span>}
                            </div>
                        )}
                        {style === Style.MRKB && (
                            <div className="header">
                                <label className="avatar">
                                    <input type={"file"} onChange={(e) => getImageUrl(e, chat.actor)}/>
                                    <img src={avatarSrc} alt={chat.actor} onError={(e) => {
                                        e.currentTarget.src = userIcon;
                                    }}/>
                                    <span><FontAwesomeIcon icon={faUserPen}/></span>
                                </label>
                                <span className="actor">
                                {chat.actor}
                                    <span className="channel">{chat.channel}</span>
                            </span>
                            </div>
                        )}
                        {chat.text.slice(style === Style.Roll20 || style === Style.Ccfolia ? 1 : 0).map((text, index) => (
                            text && text !== " " && (
                                <div className="line" key={index}>
                                    <span className="text">{text}</span>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            );
        });
    }, [actors, chats, disableNoNameHeader, getImageUrl, style]);

    const createPreview = useCallback(() => {
        return createChatMessages((page - 1) * CHAT_SIZE, page * CHAT_SIZE);
    }, [createChatMessages, page]);

    const pageControl = (dir: boolean) => {
        const total = Math.ceil((chats?.length ?? 1) / CHAT_SIZE);
        console.log(total, page);
        if (dir) {
            setPage(page >= total ? total : (page + 1));
        } else {
            setPage(page <= 1 ? 1 : (page - 1));
        }
    }

    const triggerLoading = (isLoading: boolean) => {
        const loading = document.getElementById("loading");
        if (loading) loading.classList.toggle(styles.active, isLoading);
    }

    const alertControl = (message: string, callback?: () => void) => {
        setMessage(message);
        setIsConfirm(!!callback);
        if (callback) setOnConfirm(() => callback());
        setIsAlertOpened(true);
    }

    const doReset = () => {
        alertControl("파일이 제거되며 작업이 초기화됩니다. 계속하시겠습니까?", () => reset);
    }

    useEffect(() => {
        if (file) getData();
    }, [file, getData]);

    useEffect(() => {
        if (data) getChat();
    }, [data, getChat]);

    useEffect(() => {
        createPreview();
    }, [actors, createPreview]);

    useEffect(() => {
        createPreview();
    }, [createPreview, style]);

    useEffect(() => {
        document.body.classList.toggle("dark", darkMode);
        cookies.set("darkMode", darkMode);
    }, [cookies, darkMode]);

    useEffect(() => {
        replaceActorImage();
        cookies.set("replaceAvatars", replaceAvatars);
    }, [cookies, replaceActorImage, replaceAvatars]);

    useEffect(() => {
        createPreview();
        cookies.set("disableNoNameHeader", disableNoNameHeader);
    }, [cookies, createPreview, disableNoNameHeader]);

    useEffect(() => {
        if (isPrinting) window.print();
    }, [isPrinting]);

    return (
        <>
            <Header setIsGuideOpen={setIsGuideOpened}/>
            <main style={{backgroundImage: `url(${bg})`}}>
                {data && <Sidebar
                    actors={actors}
                    getImageUrl={getImageUrl}
                    isOpened={isSidebarOpened}
                    setOpened={setIsSidebarOpened}
                />}
                <section className={"main"}>
                    {!data && <div
                        className={"file"}
                        onDragEnter={(e) => {
                            const thisElement = e.target as HTMLElement;
                            thisElement.classList.add("dragging");
                        }}
                        onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        onDragLeave={(e) => {
                            const thisElement = e.target as HTMLElement;
                            thisElement.classList.remove("dragging");
                        }}
                        onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            const thisElement = e.target as HTMLElement;
                            thisElement.classList.remove("dragging");

                            const newFile = e.dataTransfer.files[0];
                            if (newFile && file !== newFile) setFile(newFile);
                        }}
                        onClick={(e) => {
                            const thisElement = e.target as HTMLElement;
                            const input = thisElement.querySelector("input");
                            if (input) input.click();
                        }}
                    >
                        <input type="file" onChange={onFileChange}/>
                        <FontAwesomeIcon icon={faFileArrowUp}/>
                        <h3>파일을 여기에 드래그</h3>
                        <p>또는<span>클릭<FontAwesomeIcon icon={faComputerMouse}/></span>해서 직접 업로드</p>
                    </div>}
                    {(file && data && chats) && <Preview
                        file={file}
                        pageControl={pageControl}
                        getData={getData}
                        getters={getters}
                        setters={setters}
                        reset={doReset}
                        createChatMessages={createChatMessages}
                        getChat={getChat}
                        createPreview={createPreview}
                    />}
                </section>
            </main>
            <Footer
                getters={getters}
                setters={setters}
                reset={doReset}
                setIsPrinting={setIsPrinting}
                triggerLoading={triggerLoading}
            />
            {isPrinting && <div id="print" className={styles.print + " chats " + style}>{createChatMessages()}</div>}
            <div id="loading" className={styles.loading}>
                <div className={styles.spinner}>
                    <div className={styles.bounce1}/>
                    <div className={styles.bounce2}/>
                    <div className={styles.bounce3}/>
                </div>
            </div>
            <Alert
                message={message}
                isConfirm={isConfirm}
                isOpened={isAlertOpened}
                setIsOpened={setIsAlertOpened}
                onConfirm={onConfirm}
            />
            <Guide isOpen={isGuideOpened} setIsOpen={setIsGuideOpened}/>
        </>
    )
}

export default App
