'use strict';
import * as vscode from 'vscode';
import Loader from './loader';
import { Utility } from './utils';

export default class Renderer {
    private static panel: vscode.WebviewPanel | undefined;

    public static show(context: vscode.ExtensionContext, flag = false) {
        const loader: Loader = new Loader(context);
        const config = Utility.getConfiguration();
        const platType = config.get<string>('play', '');

        // 如果flag = true，则拿到预告函, 然后再根据 playType选择播放类型
        let path:vscode.Uri | string = '';
        if(flag) {
            path = loader.getLetterUri();
        } else if(platType === 'mp4'){
            path = loader.getMp4Uri();
        } else {
            path = loader.getImageUri();
        }

        // 标题
        const title = flag ? '你已收到预告信！！！' :  config.get<string>('tip', '');

        // 一次只允许存在一个 Web 视图。如果面板在后台，则将其置于前台
        if (this.panel) {
            const src = this.panel.webview.asWebviewUri(path);
            this.panel.webview.html = this.generateHtml(src, title);
            this.panel.reveal();
        } else {
            this.panel = vscode.window.createWebviewPanel("persona", "Persona 5 Royal", vscode.ViewColumn.Two, {
                enableScripts: true,
                retainContextWhenHidden: true,
            });
            const src = this.panel.webview.asWebviewUri(path);
            this.panel.webview.html = this.generateHtml(src, title);
            // 关闭后释放资源
            this.panel.onDidDispose(() => {
                this.panel = undefined;
            });
        }
    }

    protected static generateHtml(path: vscode.Uri|string, title: string): string {

        const pathString = path?.toString();

        if(/\.(mp4)/.test(pathString)) {
            return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Persona 5 Royal</title>
                <style>
                h1 {
                    text-align: center;
                    font-size: 25px;
                }
                .content {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                </style>
            </head>
            <body>
                <h1>${title}</h1>
                <div class="content">
                    <video src="${path}" autoplay="true" crossorigin="anonymous" muted>
                    </video>
                </div>
            </body>
            </html>`;
        }


        let html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Persona 5 Royal</title>
            <style>
            h1 {
                text-align: center;
                font-size: 25px;
            }
            .content {
                display: flex;
                align-items: center;
                justify-content: center;
            }
            </style>
        </head>
        <body>
            <h1>${title}</h1>
            <div class="content">
                <div><img src="${path}"></div>
            </div>
        </body>
        </html>`;

        return html;
    }
}