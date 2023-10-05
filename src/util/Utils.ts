// there might be a better way to do this but idk
function baseNum(num: number) {
    return num < 10 ? '0' + num : num.toString();
}

export function formatSeconds(secs: number) {
    let numMins = Math.floor(secs / 60);
    let numSecs = secs % 60;

    return `${numMins}:${baseNum(Math.round(numSecs))}`;
}

export function slog(str: string, error = false) {
    if (!error) script.log(`${TextColor.BLUE}NBSRadio${TextColor.WHITE}: ${str}`)
    else script.log(`${TextColor.RED}${str}`)
}