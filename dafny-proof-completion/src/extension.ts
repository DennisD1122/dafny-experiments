// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { writeFileSync, unlinkSync } from "fs";

function call_python(document: vscode.TextDocument, position: vscode.Position, ...args : string[]) : string {
	const fileName = document.fileName.substring(0, document.fileName.length-4) + '.tmp.dfy';
	writeFileSync(fileName, document.getText(), { flag: "w" });
	const execSync = require("child_process").execSync;
	const result = execSync(`python "${__dirname}/../src/llm.py" "${fileName}" ${position.line} ${position.character} "${args.join('" "')}"`);
	unlinkSync(fileName);
	return result.toString("utf8");
}

class DafnyProofCompletionItemProvider implements vscode.CompletionItemProvider {
    public provideCompletionItems(
        document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext):
        vscode.ProviderResult<vscode.CompletionItem[]> {
		const result = call_python(document, position, 'complete');
		const idx = result.indexOf('\n');
		const message = result.substring(0, idx-1);
		if (message === 'non-verification error') {
			vscode.window.showInformationMessage('Program has errors unrelated to verification.');
			return []
		}
		if (message === 'verifies') {
			vscode.window.showInformationMessage('Program verifies!');
			return []
		}
		const suggestion = result.substring(idx+1);
    	return [new vscode.CompletionItem(suggestion)];
    }
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

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

	let sel: vscode.DocumentSelector = { scheme: 'file', language: 'dafny' };
	const completionItemProvider = vscode.languages.registerCompletionItemProvider(sel, new DafnyProofCompletionItemProvider());
	context.subscriptions.push(completionItemProvider);

	const goToVerificationError = vscode.commands.registerCommand('dafny-proof-completion.goToVerificationError', () => {
		vscode.window.withProgress(
			{
				title: "Loading...",
				location: vscode.ProgressLocation.Notification,
				cancellable: false
			},
			async (progress) => {	
				await new Promise((resolve) => {
					if (vscode.window.activeTextEditor === undefined) {
						resolve(null);
						return;
					}
					const editor = vscode.window.activeTextEditor;
					const document = editor.document;
					const position = editor.selection.active;
					const result = call_python(document, position, 'goto');
					const goto_line = Number(result);
					if (goto_line === -1) {
						vscode.window.showInformationMessage('Program verifies!');
						resolve(null);
						return;
					}
					const new_position = new vscode.Position(Number(goto_line), 0)
					editor.selection = new vscode.Selection(new_position, new_position);
					editor.revealRange(new vscode.Range(new_position, new_position), vscode.TextEditorRevealType.InCenter);
					resolve(null);
				});
			}
		);
	});
	context.subscriptions.push(goToVerificationError);
}


// This method is called when your extension is deactivated
export function deactivate() {}


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
