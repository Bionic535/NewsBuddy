import path from "path";
import { app } from "electron";

export function getPreloadPath() {
    return path.join(app.getAppPath(), 'dist-electron', 'preload.cjs');
}


export function getUiPath() {
    return path.join(
        app.getAppPath(), '/dist-react/index.html'
    );
}

export function getIconPath() {
    if (isDev()) {
        return path.join(app.getAppPath(), 'src/electron/assets/icon.ico');
    }
    return path.join(app.getAppPath(), 'dist-electron/assets/icon.ico');
}

import { isDev } from "./util.js";