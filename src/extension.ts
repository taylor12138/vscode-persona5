import * as vscode from 'vscode';
import { Utility } from './utils';
import Render from './renderLetter';

let timer:any = null;

export function activate(context: vscode.ExtensionContext) {
    const config = Utility.getConfiguration();
    const time = 1000 * 60 * config.get<number>('minutes', 60);

    timer = setInterval(() => {
        vscode.window.showInformationMessage('Hello World from vscode-persona5!');
    }, time);


	let disposable = vscode.commands.registerCommand('vscode-persona5.start', () => {
        Render.show(context);
		vscode.window.showInformationMessage('Hello World from vscode-persona5!');
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
