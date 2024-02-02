'use strict';
import * as vscode from 'vscode';
import Loader from './loader';
import { Utility } from './utils';

export default class Renderer {
    private static panel: vscode.WebviewPanel | undefined;

    public static show(context: vscode.ExtensionContext, flag = false) {
        const loader: Loader = new Loader(context);
        const config = Utility.getConfiguration();

        // 如果flag = true，则拿到预告函
        const imagePath = flag ? loader.getLetterUri() : loader.getImageUri();
        const title = flag ? '你已收到预告信！！！' :  config.get<string>('tip', '');

        if (this.panel) {
            const src = this.panel.webview.asWebviewUri(imagePath);
            this.panel.webview.html = this.generateHtml(src, title);
            this.panel.reveal();
        } else {
            this.panel = vscode.window.createWebviewPanel("persona", "Persona 5 Royal", vscode.ViewColumn.Two, {
                enableScripts: true,
                retainContextWhenHidden: true,
            });
            const src = this.panel.webview.asWebviewUri(imagePath);
            this.panel.webview.html = this.generateHtml(src, title);
            // 关闭后释放资源
            this.panel.onDidDispose(() => {
                this.panel = undefined;
            });
        }
    }

    protected static generateHtml(imagePath: vscode.Uri|string, title: string): string {
        let html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Persona 5 Royal</title>
        </head>
        <body>
            <div><h1>${title}</h1></div>
            <div><img src="${imagePath}"></div>
        </body>
        </html>`;

        return html;
    }
}