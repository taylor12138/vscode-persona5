import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { Utility } from './utils';

export default class Loader {
    public readonly TYPE_URL_IMAGE = 'url';
    public readonly TYPE_DEFAULT = 'default';

    public constructor(private context: vscode.ExtensionContext) {
    }

    public getImageUri(): vscode.Uri {
        //type: default
        const type: string = this.getConfigType();
        let images: vscode.Uri[] = [];

        if (type === this.TYPE_URL_IMAGE) {
            // 使用自定义图集
            images = this.getCustomImages();
        } 

        if (images.length <= 0) {
            images = this.getDefaultImages();
        }

        const image = this.getRandomOne(images);

        //拿到一个image的Stats对象
        return image;
    }

    public getLetterUri(): vscode.Uri {
        return vscode.Uri.joinPath(this.context.extensionUri, 'images', 'letter.png');
    }

    // 用同样的方法获取mp4文件
    public getMp4Uri(): vscode.Uri {
        let files: vscode.Uri[] = [];
        const dirPath = path.join(this.context.extensionPath, 'images/video');
        // 读取文件目录列表 readdirSync
        const result = fs.readdirSync(dirPath);
        result.forEach((item, index) => {
            if(/\.(mp4)/.test(item)) {
                files.push(vscode.Uri.joinPath(this.context.extensionUri, 'images/video', item));
            }
        });
        const mp4 = this.getRandomOne(files);
        return mp4;
    }

    protected getRandomOne(images:  vscode.Uri[]): vscode.Uri {
        const n = Math.floor(Math.random() * images.length + 1) - 1;
        return images[n];
    }

    protected getDefaultImages(): vscode.Uri[] {
        const dirPath = this.getDefaultYcyImagePath();
        const files = this.readPathImageNew(dirPath);
        return files;
    }

    //旧版本读取图片，不适用于vscode1.85版本
    protected readPathImage(dirPath: string): vscode.Uri[] {
        let files: vscode.Uri[] = [];
        // 读取文件目录列表 readdirSync
        const result = fs.readdirSync(dirPath);
        result.forEach(function (item, index) {
            const stat = fs.lstatSync(path.join(dirPath, item));
            if (stat.isFile()) {
                files.push(vscode.Uri.file(path.join(dirPath, item)).with({ scheme: 'vscode-resource' }));
            }
        });
        return files;
    }

    // 新版读取
    protected readPathImageNew(dirPath: string): vscode.Uri[] {
        let files: vscode.Uri[] = [];
        // 读取文件目录列表 readdirSync
        const result = fs.readdirSync(dirPath);
        result.forEach((item, index) => {
            if(/\.(jpg|jpeg|png|GIF|JPG|PNG)/.test(item)) {
                files.push(vscode.Uri.joinPath(this.context.extensionUri, 'images/persona', item));
            }
        });
        return files;
    }

    protected getDefaultYcyImagePath() {
        return path.join(this.context.extensionPath, 'images/persona');
    }


    protected getConfigType(): string {
        return Utility.getConfiguration().get<string>('type', 'default');
    }

    protected getConfigPlayType(): string {
        return Utility.getConfiguration().get<string>('play', 'default');
    }

    protected getCustomImages(): vscode.Uri[] {
        return Utility.getConfiguration().get<vscode.Uri[]>('customImages', []);
    }

    public getTitle(): string {
        return Utility.getConfiguration().get<string>('title', '');
    }
}
