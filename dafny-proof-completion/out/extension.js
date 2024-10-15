"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
class DafnyProofCompletionItemProvider {
    provideCompletionItems(document, position, token, context) {
        const fileName = document.fileName;
        const execSync = require("child_process").execSync;
        const result = execSync(`python "C:/Users/denni/OneDrive/Desktop/Courses/CS 91R/Code/dafny-proof-completion/src/llm.py" "${fileName}"`);
        const result_str = result.toString("utf8");
        return [new vscode.CompletionItem('hello, world'), new vscode.CompletionItem(result_str)];
    }
}
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    // console.log('Congratulations, your extension "dafny-proof-completion" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    // const disposable = vscode.commands.registerCommand('dafny-proof-completion.helloWorld', () => {
    // 	// The code you place here will be executed every time your command is executed
    // 	// Display a message box to the user
    // 	vscode.window.showInformationMessage('Hello World from dafny-proof-completion!');
    // });
    // const disposable2 = vscode.commands.registerCommand('dafny-proof-completion.suggest', () => {
    // 	vscode.window.showInformationMessage('Suggest');
    // });
    let sel = { scheme: 'file', language: 'dafny' };
    const disposable = vscode.languages.registerCompletionItemProvider(sel, new DafnyProofCompletionItemProvider());
    context.subscriptions.push(disposable);
}
// This method is called when your extension is deactivated
function deactivate() { }
///////////////////////////////////////////////////////////////////////////////////////////////////
// /*---------------------------------------------------------
//  * Copyright (C) Microsoft Corporation. All rights reserved.
//  *--------------------------------------------------------*/
// import * as vscode from 'vscode';
// export function activate(context: vscode.ExtensionContext) {
// 	const provider1 = vscode.languages.registerCompletionItemProvider('plaintext', {
// 		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
// 			// a simple completion item which inserts `Hello World!`
// 			const simpleCompletion = new vscode.CompletionItem('Hello World!');
// 			// a completion item that inserts its text as snippet,
// 			// the `insertText`-property is a `SnippetString` which will be
// 			// honored by the editor.
// 			const snippetCompletion = new vscode.CompletionItem('Good part of the day');
// 			snippetCompletion.insertText = new vscode.SnippetString('Good ${1|morning,afternoon,evening|}. It is ${1}, right?');
// 			const docs: any = new vscode.MarkdownString("Inserts a snippet that lets you select [link](x.ts).");
// 			snippetCompletion.documentation = docs;
// 			docs.baseUri = vscode.Uri.parse('http://example.com/a/b/c/');
// 			// a completion item that can be accepted by a commit character,
// 			// the `commitCharacters`-property is set which means that the completion will
// 			// be inserted and then the character will be typed.
// 			const commitCharacterCompletion = new vscode.CompletionItem('console');
// 			commitCharacterCompletion.commitCharacters = ['.'];
// 			commitCharacterCompletion.documentation = new vscode.MarkdownString('Press `.` to get `console.`');
// 			// a completion item that retriggers IntelliSense when being accepted,
// 			// the `command`-property is set which the editor will execute after 
// 			// completion has been inserted. Also, the `insertText` is set so that 
// 			// a space is inserted after `new`
// 			const commandCompletion = new vscode.CompletionItem('new');
// 			commandCompletion.kind = vscode.CompletionItemKind.Keyword;
// 			commandCompletion.insertText = 'new ';
// 			commandCompletion.command = { command: 'editor.action.triggerSuggest', title: 'Re-trigger completions...' };
// 			// return all completion items as array
// 			return [
// 				simpleCompletion,
// 				snippetCompletion,
// 				commitCharacterCompletion,
// 				commandCompletion
// 			];
// 		}
// 	});
// 	const provider2 = vscode.languages.registerCompletionItemProvider(
// 		'plaintext',
// 		{
// 			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
// 				// get all text until the `position` and check if it reads `console.`
// 				// and if so then complete if `log`, `warn`, and `error`
// 				const linePrefix = document.lineAt(position).text.slice(0, position.character);
// 				if (!linePrefix.endsWith('console.')) {
// 					return undefined;
// 				}
// 				return [
// 					new vscode.CompletionItem('log', vscode.CompletionItemKind.Method),
// 					new vscode.CompletionItem('warn', vscode.CompletionItemKind.Method),
// 					new vscode.CompletionItem('error', vscode.CompletionItemKind.Method),
// 				];
// 			}
// 		},
// 		'.' // triggered whenever a '.' is being typed
// 	);
// 	context.subscriptions.push(provider1, provider2);
// }
//# sourceMappingURL=extension.js.map