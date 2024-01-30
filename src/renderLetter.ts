'use strict';
import * as vscode from 'vscode';
import Loader from './loader';
import { Utility } from './utils';

export default class Renderer {
    private static panel: vscode.WebviewPanel | undefined;

    public static show(context: vscode.ExtensionContext, ) {
        const loader: Loader = new Loader(context);
        const config = Utility.getConfiguration();

        const imagePath = loader.getImageUri();
        const title = config.get<string>('tip', '');

        if (this.panel) {
            this.panel.webview.html = this.generateHtml(imagePath, title);
            this.panel.reveal();
        } else {
            this.panel = vscode.window.createWebviewPanel("ycy", "Persona 5 Royal", vscode.ViewColumn.Two, {
                enableScripts: true,
                retainContextWhenHidden: true,
            });
            
            this.panel.webview.html = this.generateHtml(imagePath, title);

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
            <div><h1>${imagePath}</h1></div>
            <div><img src="${imagePath}"></div>
            <div><img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif"></div>
        </body>
        </html>`;

        return html;
    }
}