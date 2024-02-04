import * as vscode from 'vscode';
import { Utility } from './utils';
import Render from './renderLetter';

let timer:any = null;
let flag = false;

export function activate(context: vscode.ExtensionContext) {
    const config = Utility.getConfiguration();
    const time = 1000 * 60 * config.get<number>('minutes', 60);

    const command = () => {
        Render.show(context, flag);
        if(!flag) {
            vscode.window.showInformationMessage('0.0 休息一下', '现在就去走一走', '劳资才不要').then((res) => {
                if(res === '劳资才不要') {
                    flag = true;
                }
            });
        }
        flag = false;
    };

    timer = setInterval(() => {
        command();
    }, time);


	let disposable = vscode.commands.registerCommand('vscode-persona5.start', () => {
        command();
        
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {
    if(!!timer) {
        clearInterval(timer);
        timer = null;
    }
}
