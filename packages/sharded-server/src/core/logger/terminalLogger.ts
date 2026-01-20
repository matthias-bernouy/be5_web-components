export function newTerminalMessage(message: string): void {
    const termMessage = `[SHARDED SERVER]   ${message}`;
    console.log(termMessage);
}