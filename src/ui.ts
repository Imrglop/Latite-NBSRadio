import { notePlayer } from "./index";
import { formatSeconds } from "./util/Utils";

const visMod = new HudModule("NBSRadioVisualizer", "NBS Radio Visualizer", "The overlay for the NBS Radio script.", KeyCode.None, false);

client.getModuleManager().registerModule(visMod);
graphics.use("minecraft"); // use minecraft renderer

let size = new Vector2(280, 120);

visMod.on("render", (prev, editor) => {
    visMod.setBounds(size.x, size.y);
})

function drawOverlay() {
    if (!notePlayer.song) return;

    let pos = visMod.getPos();
    let rect: Rect = new Rect(pos.x, pos.y, pos.x + size.x, pos.y + size.y);
    let color: Color = Color.RGB(0x1E, 0x1E, 0x1E, 255 / 2);

    const fontSize = 30;
    let titleRect = new Rect(rect.left, rect.top, rect.right, rect.top + fontSize);
    let authorRect = new Rect(rect.left, titleRect.bottom + 4, rect.right, titleRect.bottom + fontSize + 4);
    
    graphics.fillRect(rect, color);
    graphics.drawRect(rect, Color.WHITE, 6);
    graphics.drawTextFull(titleRect, notePlayer.song.name, fontSize, Color.WHITE, TextAlignment.Left, VerticalAlignment.Top);
    graphics.drawTextFull(authorRect, notePlayer.song.originalAuthor, 20, new Color(0.7, 0.7, 0.7, 1), TextAlignment.Left, VerticalAlignment.Top);

    let statusRect = new Rect(rect.left + 5, rect.bottom - 8, rect.right - 5, rect.bottom - 5);
    let completedRect = statusRect;
    completedRect.right = completedRect.left + (completedRect.getWidth() * notePlayer.getSeconds() / notePlayer.getSongLengthSeconds());

    let compTextRect = new Rect(statusRect.left, statusRect.top - 3- 15, statusRect.right, statusRect.top - 3 );

    graphics.fillRect(statusRect, Color.WHITE);
    graphics.fillRect(completedRect, Color.GREEN);

    graphics.drawTextFull(compTextRect, formatSeconds(notePlayer.getSeconds()) + '/' + formatSeconds(notePlayer.getSongLengthSeconds()), 15, Color.WHITE.asAlpha(0.8), TextAlignment.Left, VerticalAlignment.Top);
}

client.on("render2d", () =>{ 
    if (visMod.isEnabled()) {
        drawOverlay();
    }
})