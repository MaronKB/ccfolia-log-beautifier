export type Actor = {
    name: string;
    image: string;
}
export type Chat = {
    channel: string;
    actor: string;
    text: (string | undefined)[];
    color?: string;
}
export type Getters = {
    file: File | null;
    data: string | null;
    chats: Chat[] | null;
    actors: Actor[];
    style: Style;
    page: number;
    message: string;
    onConfirm: () => void;
    darkMode: boolean;
    replaceAvatars: boolean;
    disableNoNameHeader: boolean;
}
export type Setters = {
    setFile: (file: File) => void;
    setData: (data: string) => void;
    setChats: (chats: Chat[]) => void;
    setActors: (actors: Actor[]) => void;
    setStyle: (style: Style) => void;
    setPage: (page: number) => void;
    setMessage: (message: string) => void;
    setOnConfirm: (onConfirm: () => void) => void;
    setDarkMode: (darkMode: boolean) => void;
    setReplaceAvatars: (replaceAvatars: boolean) => void;
    setDisableNoNameHeader: (disableNoNameHeader: boolean) => void;
}

export enum Style {
    Ccfolia = "ccfolia",
    Roll20 = "roll20",
    MRKB = "mrkb"
}
export enum Width {
    Px400 = 400,
    Px600 = 600,
    Px800 = 800,
    Px1000 = 1000,
    Px1200 = 1200,
    default = Width.Px800
}
export enum Height {
    One = 1,
    OnePointFourOneFour = 1.414,
    OnePointSixOneEight = 1.618,
    Max = 14400,
    default = Height.OnePointFourOneFour
}